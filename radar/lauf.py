#!/usr/bin/env python3
"""Einstiegspunkt für einen geplanten Lauf.

Bewusst ein einfaches Skript ohne eigenen Scheduler: so lässt es sich mit
cron, systemd-timer, GitHub Actions oder von Hand starten, ohne dass der
Radar wissen muss, wer ihn aufruft.

    python3 -m radar.lauf --datei pfad/zur/liste.csv
    python3 -m radar.lauf --abrufen
    python3 -m radar.lauf --abrufen --tage 90     # Vergangenes nachholen
    python3 -m radar.lauf --meldung

Täglich per cron (Beispiel, 06:15):

    15 6 * * *  cd /opt/atlas && python3 -m radar.lauf --abrufen >> /var/log/radar.log 2>&1
"""
import argparse
import os
import sys

from . import app, kette
from .quellen.shab import ShabQuelle


def main(argv=None):
    p = argparse.ArgumentParser(description="Konkurs Deal Radar — Lauf")
    p.add_argument("--datei", help="CSV, JSON oder PDF einlesen")
    p.add_argument("--abrufen", action="store_true",
                   help="Amtsblattportal abrufen")
    p.add_argument("--tage", type=int,
                   help="So viele Tage zurück holen (statt seit dem letzten "
                        "Lauf) — damit lässt sich Vergangenes nachholen")
    p.add_argument("--shab", action="store_true",
                   help="alter SHAB-Adapter (unverifiziert, abgeschaltet)")
    p.add_argument("--meldung", action="store_true",
                   help="Tagesmeldung ausgeben")
    p.add_argument("--markieren", action="store_true",
                   help="Gemeldete Fälle als gemeldet markieren")
    a = p.parse_args(argv)

    sp = app.speicher()

    if a.datei:
        with open(a.datei, "rb") as f:
            inhalt = f.read()
        quelle = app._quelle_waehlen(inhalt, os.path.basename(a.datei))
        if quelle is None:
            sys.exit("Format nicht erkannt: " + a.datei)
        ok, grund = quelle.verfuegbar()
        if not ok:
            sys.exit(grund)
        lauf = sp.lauf_beginnen(quelle.name)
        b = kette.verarbeiten(quelle.holen(), sp)
        sp.lauf_beenden(lauf, b["gelesen"], b["neu"], b["aktualisiert"],
                        b["verworfen"])
        print("%d gelesen, %d neu, %d aktualisiert, %d verworfen"
              % (b["gelesen"], b["neu"], b["aktualisiert"], b["verworfen"]))
        for pr in b["probleme"]:
            print("  Hinweis: " + pr)

    if a.abrufen or (a.tage and not a.datei):
        b = app.abrufen(a.tage)
        if b.get("fehler"):
            sys.exit("Abruf fehlgeschlagen: " + b["fehler"])
        print("ab %s: %d gelesen, %d neu, %d aktualisiert"
              % (b.get("seit", "?"), b["gelesen"], b["neu"],
                 b["aktualisiert"]))
        if b.get("bemerkung"):
            print("  " + b["bemerkung"])

    if a.shab:
        q = ShabQuelle(app.cfg().get("shab"))
        ok, grund = q.verfuegbar()
        if not ok:
            # Kein stilles Nichtstun: wer den Lauf plant, muss merken,
            # dass der Adapter gar nicht gelaufen ist.
            sys.exit("SHAB-Adapter nicht bereit: " + grund)
        letzter = sp.letzter_lauf("SHAB")
        seit = (letzter or {}).get("beendet", "")[:10] or None
        lauf = sp.lauf_beginnen("SHAB")
        try:
            roh = q.holen(seit)
        except Exception as e:
            sp.lauf_beenden(lauf, 0, 0, 0, 0, "%s: %s" % (type(e).__name__, e))
            sys.exit("SHAB-Abruf fehlgeschlagen: %s" % e)
        b = kette.verarbeiten(roh, sp)
        sp.lauf_beenden(lauf, b["gelesen"], b["neu"], b["aktualisiert"],
                        b["verworfen"])
        print("SHAB: %d gelesen, %d neu" % (b["gelesen"], b["neu"]))

    if a.meldung:
        text, ids = kette.tagesmeldung(sp, app.cfg().get("kantone"),
                                       app.cfg().get("min_score"))
        print(text)
        if a.markieren and ids:
            sp.als_gemeldet_markieren(ids)
            print("\n(%d Fälle als gemeldet markiert)" % len(ids))

    if not (a.datei or a.abrufen or a.tage or a.shab or a.meldung):
        p.print_help()


if __name__ == "__main__":
    main()
