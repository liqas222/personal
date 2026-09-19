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
    schritt(2, "Trefferliste — welche Abfrage lässt der Dienst zu?")
    import time
    seit = time.strftime("%Y-%m-%d", time.gmtime(time.time() - 14 * 86400))
    bis = time.strftime("%Y-%m-%d")

    treffer = _variante_finden(basis, seit, bis)
    if treffer is None:
        return 1
    basis, zusatz, accept, kopf = treffer

    print("Publikationen: %d" % len(kopf))
    for k in kopf[:3]:
        print("  · %s | %s | %s" % (k.get("datum"), k.get("rubrik"),
                                    (k.get("titel") or "")[:60]))
    if not kopf:
        print("  KEINE Treffer, aber auch kein Fehler. Entweder gab es in "
              "14 Tagen wirklich nichts (unwahrscheinlich), oder die "
              "Rubrikcodes passen nicht zu den Parameternamen.")
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
                              "seitengroesse": 20, "max_details": 5,
                              "zusatz_parameter": zusatz})
        saetze = q2.holen(seit)
        print("%d verwertbare Sätze" % len(saetze))
        for s in saetze[:3]:
            print("  · %s | %s | UID %s | %s"
                  % (s.get("firma"), s.get("ort"), s.get("uid"),
                     (s.get("meldungsart") or "")[:40]))
        print("\nErgebnis: die Schnittstelle funktioniert.")
        print("Automatischen Tageslauf einschalten: in radar/config.json")
        print('  "amtsblatt": { "aktiv": true, "auto": true, '
              '"basis_url": %s, "zusatz_parameter": %s }'
              % (json.dumps(basis), json.dumps(zusatz)))
        return 0
    except Exception as e:
        print("%s: %s" % (type(e).__name__, e))
        return 1


def _variante_finden(basis, seit, bis):
    """Die Abfrage suchen, die der Dienst tatsächlich zulässt.

    Die Rubrikliste antwortet ohne Anmeldung, die Trefferliste kann mit 401
    ablehnen. Ein 401 auf einem offenen Dienst heisst fast nie „Konto
    fehlt", sondern „so darfst du nicht fragen". Welcher Parameter das ist,
    lässt sich nicht erraten — also wird es durchprobiert, mit einer
    einzigen Rubrik und einer winzigen Seite, damit der Dienst dabei kaum
    belastet wird.

    Gibt (basis, zusatz, accept, kopfdaten) zurück oder None.
    """
    hosts = []
    for h in (basis, "https://www.shab.ch/api/v1",
              "https://amtsblattportal.ch/api/v1"):
        if h not in hosts:
            hosts.append(h)

    zusaetze = [
        ({"publicationStates": "PUBLISHED"}, "publicationStates=PUBLISHED"),
        ({}, "ohne Zusatzparameter"),
        ({"publicationStates": "PUBLISHED",
          "allowRubricSelection": "true"}, "+ allowRubricSelection=true"),
        ({"publicationStates": "PUBLISHED", "tenant": "shab"},
         "+ tenant=shab"),
    ]
    accepts = ["application/json", "application/xml"]

    gesehen = set()
    for host in hosts:
        for zusatz, wie in zusaetze:
            for accept in accepts:
                q = AmtsblattQuelle({
                    "basis_url": host, "max_seiten": 1, "seitengroesse": 5,
                    "rubriken": ["KK01"], "zusatz_parameter": zusatz})
                kurz = "%s | %s | %s" % (host.split("//")[-1].split("/")[0],
                                         wie, accept.split("/")[-1])
                try:
                    kopf = _liste_mit_accept(q, seit, bis, accept)
                    print("  OK   %-52s %d Treffer" % (kurz, len(kopf)))
                    if kopf:
                        print("\nDiese Abfrage geht. In radar/config.json "
                              "unter \"amtsblatt\" eintragen:")
                        print("  " + json.dumps(
                            {"basis_url": host, "zusatz_parameter": zusatz},
                            ensure_ascii=False))
                        return host, zusatz, accept, kopf
                except urllib.error.HTTPError as e:
                    print("  %-4s %s" % (e.code, kurz))
                    gesehen.add(e.code)
                except Exception as e:
                    print("  FEHL %-52s %s" % (kurz, type(e).__name__))

    print("\nKeine Variante lieferte Treffer.")
    if gesehen <= {401, 403} and gesehen:
        print("Durchgehend %s. Das Portal lässt die Trefferliste "
              "offenbar nicht anonym zu — dann gibt es keinen "
              "Parameter, der das repariert, sondern es braucht einen "
              "Zugang vom Betreiber (SECO/SHAB). Bis dahin bleibt der "
              "Import von Hand: CSV, JSON oder PDF."
              % "/".join(str(c) for c in sorted(gesehen)))
    return None


def _liste_mit_accept(q, seit, bis, accept):
    """Einen Listenabruf mit einem bestimmten Accept-Header machen."""
    echt = q._hole
    q._hole = lambda url, akzeptiere=accept: echt(url, accept)
    try:
        return q._liste(seit, bis)
    finally:
        q._hole = echt


def _codes_sammeln(d, raus=None):
    """Aus einer beliebig verschachtelten Rubrikantwort die Codes ziehen."""
    if raus is None:
        raus = set()
    if isinstance(d, dict):
        for schluessel in ("code", "id", "key"):
            v = d.get(schluessel)
            # Nur Unterrubriken: "KK01" ja, die Oberrubrik "KK" nein.
            # `subRubrics` erwartet Unterrubriken, und eine Oberrubrik dort
            # ist je nach Dienst ein Fehler statt einer Erweiterung.
            if (isinstance(v, str) and 3 <= len(v) <= 8
                    and any(c.isdigit() for c in v)):
                raus.add(v)
        for v in d.values():
            _codes_sammeln(v, raus)
    elif isinstance(d, list):
        for v in d:
            _codes_sammeln(v, raus)
    return raus


if __name__ == "__main__":
    sys.exit(main())
