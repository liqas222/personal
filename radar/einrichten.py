#!/usr/bin/env python3
"""Den Live-Abruf ein- und ausschalten, ohne eine Datei von Hand zu ändern.

    python3 -m radar.einrichten --an
    python3 -m radar.einrichten --an --kantone ZH,AG,ZG,SZ,SG,LU
    python3 -m radar.einrichten --aus
    python3 -m radar.einrichten            (nur anzeigen)

WARUM ES DAS GIBT
-----------------
Die Anleitung sagte bisher „trag das in radar/config.json ein" und zeigte
einen JSON-Schnipsel. In eine Shell geklebt ergibt der
`amtsblatt:: command not found` — und die Einstellung ist nicht gesetzt,
sieht aber so aus, als wäre etwas passiert. Eine Einstellung, die man
vornehmen soll, gehört in einen Befehl.

Bestehende Einträge bleiben erhalten: die Datei wird gelesen, ergänzt und
zurückgeschrieben, nicht überschrieben.
"""
import argparse
import json
import os
import sys

PFAD = os.path.join(os.path.dirname(os.path.abspath(__file__)),
                    "config.json")


def laden(pfad):
    if not os.path.exists(pfad):
        return {}
    with open(pfad, encoding="utf-8") as f:
        text = f.read().strip()
    if not text:
        return {}
    return json.loads(text)


def zeigen(cfg):
    a = cfg.get("amtsblatt") or {}
    print("Datei:    %s%s" % (PFAD, "" if os.path.exists(PFAD)
                              else "  (noch nicht vorhanden)"))
    print("Abruf:    %s" % ("EIN" if a.get("aktiv") else "AUS"))
    print("Alle %s Stunden von selbst: %s"
          % (a.get("intervall_stunden", 12),
             "ja" if a.get("auto") else "nein — nur über „Jetzt abrufen\""))
    print("Kantone:  %s" % (", ".join(a.get("kantone") or [])
                            or "alle (nicht eingeschränkt)"))
    print("Löschfrist: %s Tage" % cfg.get("loeschfrist_tage", 730))


def main(argv=None):
    p = argparse.ArgumentParser(
        description="Live-Abruf aus dem Amtsblattportal ein-/ausschalten.")
    p.add_argument("--an", action="store_true",
                   help="Abruf einschalten (und den Tageslauf dazu)")
    p.add_argument("--aus", action="store_true", help="Abruf abschalten")
    p.add_argument("--kantone",
                   help="Komma-Liste, z. B. ZH,AG,ZG,SZ,SG,LU. "
                        "Leer lassen heisst: alle Kantone.")
    p.add_argument("--kein-auto", action="store_true",
                   help="Einschalten, aber nur auf Knopfdruck abrufen")
    p.add_argument("--loeschfrist", type=int,
                   help="Tage, nach denen unbearbeitete Fälle wegfallen "
                        "(0 = nie)")
    a = p.parse_args(argv)

    try:
        cfg = laden(PFAD)
    except ValueError as e:
        print("radar/config.json ist kein gültiges JSON: %s" % e)
        print("Bitte erst die Datei reparieren — ich überschreibe sie "
              "nicht, es könnten andere Einstellungen drinstehen.")
        return 1

    if not (a.an or a.aus or a.kantone or a.loeschfrist is not None):
        zeigen(cfg)
        print("\nEinschalten:  python3 -m radar.einrichten --an")
        return 0

    amt = dict(cfg.get("amtsblatt") or {})
    if a.an:
        amt["aktiv"] = True
        amt["auto"] = not a.kein_auto
        amt.setdefault("intervall_stunden", 12)
    if a.aus:
        amt["aktiv"] = False
        amt["auto"] = False
    if a.kantone is not None:
        amt["kantone"] = [k.strip().upper() for k in a.kantone.split(",")
                          if k.strip()]
    cfg["amtsblatt"] = amt
    if a.loeschfrist is not None:
        cfg["loeschfrist_tage"] = a.loeschfrist

    with open(PFAD, "w", encoding="utf-8") as f:
        json.dump(cfg, f, ensure_ascii=False, indent=2)
        f.write("\n")

    zeigen(cfg)
    print("\nGespeichert. Damit es greift:  sudo systemctl restart atlas")
    return 0


if __name__ == "__main__":
    sys.exit(main())
