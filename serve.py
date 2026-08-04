#!/usr/bin/env python3
"""Winziger Webserver für den Atlas.

Liefert den Inhalt von static/ aus, optional hinter HTTP-Basic-Auth. Nur
Standardbibliothek — keine Abhängigkeiten, kein Build.

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
import threading
import time
import urllib.error
import urllib.request
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

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

# ---------------------------------------------------------------------------
# Live-Daten: tägliche Schiffsdurchfahrten je Meerenge (IMF PortWatch, offen).
#
# EHRLICH ZUR EINORDNUNG: Handelsdaten in Echtzeit für jedes Land gibt es
# nicht kostenlos. Was es gibt, ist die tägliche Zahl der Durchfahrten je
# Chokepoint — und die ist für diesen Atlas die aussagekräftigste Live-Zahl:
# man sieht unmittelbar, ob eine Enge gemieden wird.
#
# Fällt der Abruf aus, bleibt der Atlas vollständig nutzbar; die Oberfläche
# zeigt dann "LIVE: aus". Kein stiller Ausfall.
# ---------------------------------------------------------------------------

PORTWATCH_URL = os.environ.get(
    "ATLAS_PORTWATCH_URL",
    "https://services9.arcgis.com/weJ1QsnbMYJlCHdG/arcgis/rest/services/"
    "Daily_Chokepoints_Data/FeatureServer/0/query"
    "?where=1%3D1&outFields=portname,date,n_total&resultRecordCount=2000"
    "&orderByFields=date%20DESC&f=json")

# Namen bei PortWatch -> ids im Atlas
CHOKE_NAMEN = {
    "strait of hormuz": "hormuz",
    "bab el-mandeb strait": "babelmandeb",
    "suez canal": "suez",
    "strait of malacca": "malakka",
    "taiwan strait": "taiwan",
    "bosporus strait": "bosporus",
    "panama canal": "panama",
    "strait of gibraltar": "gibraltar",
}

CACHE = os.path.join(BASE, "data", "live.json")
LIVE = {"stand": None, "quelle": "IMF PortWatch", "werte": {}, "fehler": None}


def _cache_laden():
    try:
        with open(CACHE) as f:
            LIVE.update(json.load(f))
    except Exception:
        pass


def _cache_schreiben():
    try:
        os.makedirs(os.path.dirname(CACHE), exist_ok=True)
        tmp = CACHE + ".tmp"
        with open(tmp, "w") as f:
            json.dump(LIVE, f)
        os.replace(tmp, CACHE)
    except OSError:
        pass


def hole_live():
    """Holt die Durchfahrten und legt sie in LIVE ab. Wirft nie."""
    try:
        req = urllib.request.Request(
            PORTWATCH_URL, headers={"User-Agent": "atlas/1.0"})
        with urllib.request.urlopen(req, timeout=25) as r:
            roh = json.loads(r.read().decode("utf-8", "replace"))
    except (urllib.error.URLError, ValueError, OSError) as e:
        LIVE["fehler"] = "%s: %s" % (type(e).__name__, e)
        return False

    merkmale = roh.get("features")
    if not isinstance(merkmale, list):
        LIVE["fehler"] = "Unerwartete Antwort — kein Feld 'features'."
        return False

    # Je Enge den jüngsten Eintrag behalten.
    werte, stand = {}, None
    for m in merkmale:
        a = (m or {}).get("attributes") or {}
        name = str(a.get("portname", "")).strip().lower()
        eid = CHOKE_NAMEN.get(name)
        if not eid:
            continue
        datum, n = a.get("date"), a.get("n_total")
        if datum is None or n is None:
            continue
        if eid not in werte or datum > werte[eid]["d"]:
            werte[eid] = {"d": datum, "n": round(float(n), 1)}
        stand = max(stand, datum) if stand else datum

    if not werte:
        LIVE["fehler"] = "Antwort enthielt keine bekannten Chokepoints."
        return False
    LIVE.update({"werte": werte, "stand": stand, "fehler": None,
                 "geholt": int(time.time())})
    _cache_schreiben()
    return True


def live_schleife():
    """Einmal beim Start, danach alle sechs Stunden."""
    while True:
        hole_live()
        time.sleep(6 * 3600)


_cache_laden()


class Handler(SimpleHTTPRequestHandler):
    # Keep-alive: die Seite lädt vier Dateien, darunter die 218 KB grosse
    # Karte. Mit HTTP/1.0 würde für jede eine neue Verbindung aufgebaut.
    protocol_version = "HTTP/1.1"

    def do_GET(self):
        if not self.pruefe_auth():
            return
        if self.path.split("?")[0] == "/api/live":
            koerper = json.dumps(LIVE).encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(koerper)))
            self.send_header("Cache-Control", "no-store")
            self.end_headers()
            self.wfile.write(koerper)
            return
        super().do_GET()

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
    threading.Thread(target=live_schleife, daemon=True).start()
    handler = partial(Handler, directory=STATIC)
    srv = ThreadingHTTPServer((CFG["host"], int(CFG["port"])), handler)
    schutz = "mit Passwort" if CFG.get("auth_token") else "OHNE Passwort"
    print("Atlas läuft auf %s:%s (%s)" % (CFG["host"], CFG["port"], schutz))
    print("Live-Daten: IMF PortWatch, Abruf alle 6 h — Status unter /api/live")
    srv.serve_forever()


if __name__ == "__main__":
    main()
