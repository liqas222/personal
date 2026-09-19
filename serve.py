#!/usr/bin/env python3
"""Winziger Webserver für den Atlas.

Liefert den Inhalt von static/ aus, optional hinter HTTP-Basic-Auth. Nur
Standardbibliothek — keine Abhängigkeiten, kein Build.

Der Atlas-Teil ruft nichts ab: statische Dateien, sonst nichts. Unter
/radar/ hängt zusätzlich der Konkurs Deal Radar (siehe radar/). Auch der
arbeitet auf importierten Dateien; erst wenn dort ein Quellen-Adapter
eingerichtet und ausdrücklich verifiziert wird, geht Verkehr nach draussen.

Beides im selben Prozess, weil der Zielserver klein und geteilt ist: ein
zweiter Dienst hiesse ein zweiter Port, eine Proxy-Regel und ein zweiter
Neustart — für nichts.

Er wird überhaupt nur gebraucht, um die Seite unter einer festen Adresse und
hinter einem Passwort bereitzustellen. Wer sie lokal benutzen will, öffnet
`static/index.html` per Doppelklick — dafür ist das Ganze gebaut.

Einstellungen kommen aus config.json im selben Verzeichnis (siehe
config.example.json). Ohne config.json läuft er auf Port 8899 ohne Passwort,
was für lokales Ausprobieren genau richtig ist.

    python3 serve.py
"""
import base64
import hmac
import json
import os
import sys
import traceback
import urllib.parse
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

# Der Radar wird nachgeladen, nicht importiert: fehlt der Ordner oder hat
# er einen Fehler, muss der Atlas trotzdem laufen.
try:
    from radar import app as radar_app
except Exception:                       # pragma: no cover
    radar_app = None
    print("radar: nicht geladen —\n" + traceback.format_exc())

BASE = os.path.dirname(os.path.abspath(__file__))
STATIC = os.path.join(BASE, "static")


def load_config():
    pfad = os.path.join(BASE, "config.json")
    cfg = {"host": "0.0.0.0", "port": 8899, "auth_token": ""}
    if os.path.exists(pfad):
        try:
            with open(pfad) as f:
                cfg.update(json.load(f))
        except ValueError as e:
            # Lieber hier sauber abbrechen als mit halber Konfiguration
            # starten — ein fehlendes Anführungszeichen hat das schon einmal
            # zu einer Neustartschleife gemacht.
            sys.exit("config.json ist kein gültiges JSON: %s" % e)
    return cfg


CFG = load_config()


class Handler(SimpleHTTPRequestHandler):

    def do_GET(self):
        if not self.pruefe_auth():
            return
        if self._radar("GET"):
            return
        super().do_GET()

    def do_POST(self):
        if not self.pruefe_auth():
            return
        if self._radar("POST"):
            return
        self.send_error(404)

    # -- Konkurs Deal Radar unter /radar/ ---------------------------------

    def _radar(self, methode):
        """True, wenn die Anfrage vom Radar beantwortet wurde."""
        roh = urllib.parse.urlparse(self.path)
        if not roh.path.startswith("/radar"):
            return False
        if radar_app is None:
            self._senden(503, "text/plain; charset=utf-8",
                         "Der Radar ist nicht geladen — siehe Serverprotokoll."
                         .encode("utf-8"))
            return True
        # /radar -> /radar/ , damit relative Adressen in der Seite stimmen.
        if roh.path == "/radar":
            self.send_response(301)
            self.send_header("Location", "/radar/")
            self.send_header("Content-Length", "0")
            self.end_headers()
            return True

        pfad = roh.path[len("/radar"):] or "/"
        query = urllib.parse.parse_qs(roh.query)
        try:
            if methode == "GET":
                antwort = radar_app.behandle_get(pfad, query)
            else:
                laenge = int(self.headers.get("Content-Length") or 0)
                if laenge > 64 * 1024 * 1024:
                    self._senden(413, "application/json",
                                 b'{"fehler":"Datei zu gross (max 64 MB)."}')
                    return True
                koerper = self.rfile.read(laenge) if laenge else b""
                name = urllib.parse.unquote(
                    self.headers.get("X-Dateiname") or "")
                antwort = radar_app.behandle_post(
                    pfad, koerper, self.headers.get("Content-Type"), name)
        except Exception as e:
            traceback.print_exc()
            self._senden(500, "application/json; charset=utf-8",
                         json.dumps({"fehler": "%s: %s" % (type(e).__name__, e)}
                                    ).encode("utf-8"))
            return True
        if antwort is None:
            self._senden(404, "application/json", b'{"fehler":"Unbekannt"}')
            return True
        code, typ, koerper = antwort
        self._senden(code, typ, koerper)
        return True

    def _senden(self, code, typ, koerper):
        self.send_response(code)
        self.send_header("Content-Type", typ)
        self.send_header("Content-Length", str(len(koerper)))
        self.send_header("Cache-Control", "no-store")
        if typ.startswith("text/csv"):
            self.send_header("Content-Disposition",
                             'attachment; filename="deals.csv"')
        if "spreadsheetml" in typ:
            self.send_header("Content-Disposition",
                             'attachment; filename="deals.xlsx"')
        self.end_headers()
        self.wfile.write(koerper)

    def do_HEAD(self):
        if not self.pruefe_auth():
            return
        super().do_HEAD()

    def pruefe_auth(self):
        """True, wenn die Anfrage weiterlaufen darf."""
        token = CFG.get("auth_token") or ""
        if not token:
            return True
        kopf = self.headers.get("Authorization", "")
        if kopf.startswith("Basic "):
            try:
                roh = base64.b64decode(kopf[6:]).decode("utf-8", "replace")
            except Exception:
                roh = ""
            # Benutzername ist egal, es zählt das Passwort. compare_digest
            # statt == , damit die Laufzeit nichts über den Token verrät.
            passwort = roh.split(":", 1)[1] if ":" in roh else ""
            if hmac.compare_digest(passwort, token):
                return True
        self.send_response(401)
        self.send_header("WWW-Authenticate", 'Basic realm="Atlas"')
        self.send_header("Content-Length", "0")
        self.end_headers()
        return False

    def end_headers(self):
        # Ohne das zeigt der Browser nach einem Update hartnäckig die alte
        # Fassung. Die Kartendatei darf dagegen liegen bleiben, sie ist gross
        # und ändert sich praktisch nie.
        if self.path.rstrip("/").endswith("world.js"):
            self.send_header("Cache-Control", "public, max-age=86400")
        else:
            self.send_header("Cache-Control", "no-store, must-revalidate")
        super().end_headers()

    def log_message(self, fmt, *args):
        # Zugriffe nicht mitschreiben — journalctl soll lesbar bleiben.
        pass


def main():
    handler = partial(Handler, directory=STATIC)
    srv = ThreadingHTTPServer((CFG["host"], int(CFG["port"])), handler)
    schutz = "mit Passwort" if CFG.get("auth_token") else "OHNE Passwort"
    print("Atlas läuft auf %s:%s (%s)" % (CFG["host"], CFG["port"], schutz))
    print("Atlas: statische Dateien, keine Abrufe nach draussen.")
    print("Radar: %s" % ("/radar/ bereit" if radar_app
                         else "NICHT geladen — siehe Protokoll oben"))
    srv.serve_forever()


if __name__ == "__main__":
    main()
