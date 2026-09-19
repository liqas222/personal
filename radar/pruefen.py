#!/usr/bin/env python3
"""Schnittstelle selbst ausprobieren und berichten, was wirklich ankommt.

WARUM ES DAS GIBT
-----------------
Der Amtsblatt-Adapter ist nach öffentlicher Dokumentation gebaut, aber nie
gegen den echten Dienst gelaufen — aus der Entwicklungsumgebung ist
amtsblattportal.ch gesperrt. Statt zu raten oder zu behaupten, macht dieses
Werkzeug auf DEINEM Server das, was ich hier nicht konnte: es klopft die
Schnittstelle ab und schreibt auf, was zurückkommt.

    python3 -m radar.pruefen

Es ändert nichts an der Datenbank. Es fragt, liest und berichtet.

Wenn etwas nicht stimmt — andere Feldnamen, andere Rubrikcodes, ein
Parameter, der anders heisst — steht es danach schwarz auf weiss da, und
die Konfiguration lässt sich gezielt anpassen, ohne Code zu ändern.
"""
import json
import sys
import urllib.error
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET

from .quellen.amtsblatt import BASIS, KONKURS, AmtsblattQuelle


def _hole(url, akzeptiere="application/json", zeitlimit=25):
    req = urllib.request.Request(url, headers={
        "Accept": akzeptiere,
        "User-Agent": "konkurs-deal-radar/1.0 (Schnittstellenpruefung)",
    })
    with urllib.request.urlopen(req, timeout=zeitlimit) as r:
        return r.status, r.read()


def schritt(nr, was):
    print("\n[%d] %s" % (nr, was))
    print("-" * 68)


def main(argv=None):
    basis = (argv or sys.argv[1:] or [BASIS])[0]
    print("Prüfe: " + basis)
    print("Es wird nur gelesen. Die Datenbank bleibt unberührt.")

    # --- 1. Ist der Dienst überhaupt da? --------------------------------
    schritt(1, "Rubrikliste abrufen — gibt es die Schnittstelle?")
    try:
        code, roh = _hole(basis + "/rubrics")
        print("HTTP %d, %d Bytes" % (code, len(roh)))
        try:
            d = json.loads(roh.decode("utf-8", "replace"))
            codes = _codes_sammeln(d)
            kk = sorted(c for c in codes if c.upper().startswith("KK"))
            sb = sorted(c for c in codes if c.upper().startswith("SB"))
            hr = sorted(c for c in codes if c.upper().startswith("HR"))
            print("Rubrikcodes gefunden: %d" % len(codes))
            print("  Konkurs (KK):      %s" % (", ".join(kk) or "KEINE"))
            print("  Betreibung (SB):   %s" % (", ".join(sb) or "KEINE"))
            print("  Handelsreg. (HR):  %s" % (", ".join(hr) or "KEINE"))
            if kk and set(kk) != set(KONKURS):
                print("  ACHTUNG: weichen von der Vorgabe ab. In "
                      "radar/config.json unter \"amtsblatt\" → \"rubriken\" "
                      "eintragen:")
                print("  " + json.dumps(kk + sb))
        except ValueError:
            print("Antwort ist kein JSON. Erste 300 Zeichen:")
            print(roh[:300].decode("utf-8", "replace"))
    except urllib.error.HTTPError as e:
        print("HTTP %s — %s" % (e.code, e.read()[:200].decode("utf-8",
                                                              "replace")))
        print("Die Adresse stimmt vermutlich nicht.")
        return 1
    except Exception as e:
        print("%s: %s" % (type(e).__name__, e))
        print("Kein Netzzugang oder falsche Adresse.")
        return 1

    # --- 2. Liefert die Liste Treffer? ----------------------------------
    schritt(2, "Trefferliste der letzten 14 Tage")
    q = AmtsblattQuelle({"basis_url": basis, "max_seiten": 1,
                         "seitengroesse": 20})
    import time
    seit = time.strftime("%Y-%m-%d", time.gmtime(time.time() - 14 * 86400))
    bis = time.strftime("%Y-%m-%d")
    try:
        kopf = q._liste(seit, bis)
        for z in q.protokoll:
            print("  " + z)
        print("Publikationen: %d" % len(kopf))
        for k in kopf[:3]:
            print("  · %s | %s | %s" % (k.get("datum"), k.get("rubrik"),
                                        (k.get("titel") or "")[:60]))
        if not kopf:
            print("  KEINE Treffer. Mögliche Gründe: Rubrikcodes stimmen "
                  "nicht, oder die Parameternamen heissen anders "
                  "(publicationDate.start / subRubrics / pageRequest.size).")
            return 1
    except Exception as e:
        print("%s: %s" % (type(e).__name__, e))
        return 1

    # --- 3. Enthält das Detail-XML die gebrauchten Felder? --------------
    schritt(3, "Detail-XML einer Publikation — welche Felder gibt es?")
    pid = kopf[0]["id"]
    try:
        code, roh = _hole("%s/publications/%s/xml" % (basis, pid),
                          "application/xml")
        print("HTTP %d, %d Bytes" % (code, len(roh)))
        wurzel = ET.fromstring(roh.decode("utf-8", "replace"))
        tags = {}
        for k in wurzel.iter():
            n = k.tag.split("}")[-1]
            if k.text and k.text.strip():
                tags.setdefault(n, k.text.strip()[:60])
        print("Felder mit Inhalt: %d" % len(tags))
        for n, v in sorted(tags.items())[:40]:
            print("  %-28s %s" % (n, v))

        gebraucht = {
            "Firmenname": ("name", "companyName", "legalEntityName",
                           "debtorName"),
            "UID": ("uid", "uidNumber", "cheNumber"),
            "Ort": ("town", "city", "municipality", "seat", "legalSeat"),
            "Zweck": ("purpose", "zweck", "businessPurpose"),
            "Konkursamt": ("officeName", "registryOffice",
                           "bankruptcyOffice", "office"),
        }
        print("\nWas der Radar braucht:")
        fehlt = []
        vorhanden = {n.lower() for n in tags}
        for was, namen in gebraucht.items():
            treffer = [n for n in namen if n.lower() in vorhanden]
            print("  %-12s %s" % (was, treffer[0] if treffer
                                  else "NICHT GEFUNDEN"))
            if not treffer:
                fehlt.append(was)
        if fehlt:
            print("\n  Fehlende Felder heissen im XML vermutlich anders. Die "
                  "obige Feldliste zeigt, wie. Danach in "
                  "radar/quellen/amtsblatt.py in _detail() ergänzen.")
    except Exception as e:
        print("%s: %s" % (type(e).__name__, e))
        return 1

    # --- 4. Voller Durchlauf, ohne zu speichern -------------------------
    schritt(4, "Vollständiger Adapterlauf (ohne Speichern)")
    try:
        q2 = AmtsblattQuelle({"basis_url": basis, "max_seiten": 1,
                              "seitengroesse": 20, "max_details": 5})
        saetze = q2.holen(seit)
        print("%d verwertbare Sätze" % len(saetze))
        for s in saetze[:3]:
            print("  · %s | %s | UID %s | %s"
                  % (s.get("firma"), s.get("ort"), s.get("uid"),
                     (s.get("meldungsart") or "")[:40]))
        print("\nErgebnis: die Schnittstelle funktioniert.")
        print("Automatischen Tageslauf einschalten: in radar/config.json")
        print('  "amtsblatt": { "aktiv": true, "auto": true }')
        return 0
    except Exception as e:
        print("%s: %s" % (type(e).__name__, e))
        return 1


def _codes_sammeln(d, raus=None):
    """Aus einer beliebig verschachtelten Rubrikantwort die Codes ziehen."""
    if raus is None:
        raus = set()
    if isinstance(d, dict):
        for schluessel in ("code", "id", "key"):
            v = d.get(schluessel)
            if isinstance(v, str) and 2 <= len(v) <= 8:
                raus.add(v)
        for v in d.values():
            _codes_sammeln(v, raus)
    elif isinstance(d, list):
        for v in d:
            _codes_sammeln(v, raus)
    return raus


if __name__ == "__main__":
    sys.exit(main())
