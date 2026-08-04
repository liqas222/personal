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


class Handler(SimpleHTTPRequestHandler):
    # Keep-alive: die Seite lädt vier Dateien, darunter die 218 KB grosse
    # Karte. Mit HTTP/1.0 würde für jede eine neue Verbindung aufgebaut.
    protocol_version = "HTTP/1.1"

    def do_GET(self):
        if not self.pruefe_auth():
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
    handler = partial(Handler, directory=STATIC)
    srv = ThreadingHTTPServer((CFG["host"], int(CFG["port"])), handler)
    schutz = "mit Passwort" if CFG.get("auth_token") else "OHNE Passwort"
    print("Atlas läuft auf %s:%s (%s)" % (CFG["host"], CFG["port"], schutz))
    srv.serve_forever()


if __name__ == "__main__":
    main()
