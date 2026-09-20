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
import time
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


def _tag(wurzel, name):
    """Ersten nichtleeren Text unter diesem Tagnamen (Namensraum egal)."""
    for k in wurzel.iter():
        if k.tag.split("}")[-1].lower() == name.lower():
            if k.text and k.text.strip():
                return k.text.strip()
    return None


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
            # Mit Titel, nicht nur mit Code: welche SB-Rubrik eine
            # Steigerung ist und welche ein Zahlungsbefehl durch
            # öffentliche Bekanntmachung, entscheidet darüber, was
            # aufgenommen werden darf — und das lässt sich an „SB04"
            # nicht ablesen.
            titel = _titel_sammeln(d)
            for gruppe, liste in (("Konkurs (KK)", kk),
                                  ("Betreibung (SB)", sb),
                                  ("Handelsregister (HR)", hr)):
                print("  %s:" % gruppe)
                if not liste:
                    print("    KEINE")
                for c in liste:
                    print("    %-6s %s" % (c, titel.get(c, "(ohne Titel)")))
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
    # Eine FIRMA aussuchen, keine Privatperson. Beim ersten Lauf erwischte
    # die Prüfung eine Privatperson und meldete „UID NICHT GEFUNDEN,
    # Zweck NICHT GEFUNDEN" — beides bei einer Privatperson völlig
    # normal, als Befund aber irreführend.
    pid, firmen_pid = kopf[0]["id"], None
    for k in kopf[:12]:
        try:
            _, roh = _hole("%s/publications/%s/xml" % (basis, k["id"]),
                           "application/xml")
            w = ET.fromstring(roh.decode("utf-8", "replace"))
            art = (_tag(w, "selectType") or "").lower()
            if art and art != "person":
                firmen_pid = k["id"]
                break
            if _tag(w, "uid"):
                firmen_pid = k["id"]
                break
        except Exception:
            continue
        time.sleep(0.3)
    if firmen_pid:
        pid = firmen_pid
    else:
        print("  Keine Firma unter den ersten Publikationen — es wird eine "
              "Privatperson gezeigt. Dass dort UID und Zweck fehlen, ist "
              "dann normal und kein Befund.")
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
            "Konkursamt": ("registrationOfficeAndCirculationAuthority",
                           "registrationOffice", "officeName",
                           "registryOffice", "bankruptcyOffice", "office"),
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
        # Der Zweck steht hier absichtlich NICHT in der Pflichtliste:
        # eine Konkurspublikation enthält keinen. Ihn hier als „fehlend"
        # zu melden, würde den echten Befund verwässern — geholt wird er
        # aus dem Handelsregister, und das prüft Schritt 5.
        zweck_da = bool({"purpose", "zweck", "businesspurpose"} & vorhanden)
        print("  %-12s %s" % ("Zweck", "purpose" if zweck_da else
                              "nicht enthalten — normal, siehe Schritt 5"))
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
        # Genug Publikationen, dass Firmen dabei sind: ein grosser Teil
        # der Konkursrubriken betrifft Privatpersonen, und bei fünf
        # Stück ist es gut möglich, dass keine einzige Firma auftaucht.
        q2 = AmtsblattQuelle({"basis_url": basis, "max_seiten": 1,
                              "seitengroesse": 40, "max_details": 40,
                              "pause_sekunden": 0.3,
                              "zweck_nachschlagen": False,
                              "zusatz_parameter": zusatz})
        saetze = q2.holen(seit)
        print("%d verwertbare Sätze" % len(saetze))
        for z in q2.protokoll[-1:]:
            print("  " + z)
        if not saetze:
            print("  Keine Firma dabei — in diesem Zeitraum betrafen die "
                  "Publikationen offenbar nur Privatpersonen. Die werden "
                  "bewusst übersprungen; siehe _ist_person() in "
                  "radar/quellen/amtsblatt.py.")
        for s in saetze[:3]:
            print("  · %s | %s | UID %s | %s"
                  % (s.get("firma"), s.get("ort"), s.get("uid"),
                     (s.get("meldungsart") or "")[:40]))
        # --- 5. Zweckartikel aus dem Handelsregister --------------------
        schritt(5, "Zweckartikel nachschlagen — geht die Suche nach UID?")
        mit_uid = [s for s in saetze if s.get("uid")]
        if not mit_uid:
            print("  Kein Satz mit UID dabei — nicht prüfbar. Bei "
                  "Privatpersonen ist das normal.")
        else:
            q3 = AmtsblattQuelle({"basis_url": basis,
                                  "zusatz_parameter": zusatz,
                                  "pause_sekunden": 0.4})
            uid = mit_uid[0]["uid"]
            print("  Suche zu %s (%s)" % (uid, mit_uid[0].get("firma")))
            for name in AmtsblattQuelle.UID_PARAMETER:
                try:
                    treffer = q3._hr_suchen(name, uid)
                except urllib.error.HTTPError as e:
                    print("    %-22s HTTP %s" % (name, e.code))
                    continue
                except Exception as e:
                    print("    %-22s %s" % (name, type(e).__name__))
                    continue
                print("    %-22s %d Treffer" % (name, len(treffer)))
                if treffer:
                    z = q3._zweck_aus_publikation(treffer[0]["id"])
                    print("\n  Zweck: %s" % ((z or "")[:200] or
                                             "gefunden, aber ohne Zweckfeld"))
                    if z:
                        print("\n  Das ist die wichtigste Angabe für die "
                              "Bewertung. Läuft.")
                    break
                time.sleep(0.4)
            else:
                print("\n  Keine Variante fand eine HR-Publikation. Dann "
                      "bleibt der Zweck leer und die meisten Fälle unter "
                      "der Schwelle — Score ab 0 filtern und von Hand "
                      "sichten. Abschalten lässt sich die Suche mit "
                      "\"zweck_nachschlagen\": false.")

        print("\nErgebnis: die Schnittstelle funktioniert.")
        # Ein Befehl zum Kopieren, kein JSON-Schnipsel: ein Schnipsel in
        # der Shell ergibt „amtsblatt:: command not found", und die
        # Einstellung ist dann nicht gesetzt, sieht aber so aus.
        print("Einschalten:")
        print("  python3 -m radar.einrichten --an "
              "--kantone deutsch")
        print("  sudo systemctl restart atlas")
        if basis != BASIS:
            print("Abweichende Adresse — zusätzlich in radar/config.json "
                  "unter \"amtsblatt\" eintragen: \"basis_url\": %s"
                  % json.dumps(basis))
        return 0
    except Exception as e:
        print("%s: %s" % (type(e).__name__, e))
        return 1


def _abfrage(host, felder, accept="application/json", zeitlimit=25):
    """Eine Trefferlisten-Abfrage stellen. Gibt (code, rohbytes) zurück."""
    url = host + "/publications?" + urllib.parse.urlencode(felder)
    req = urllib.request.Request(url, headers={
        "Accept": accept,
        "User-Agent": "konkurs-deal-radar/1.0 (Schnittstellenpruefung)",
    })
    with urllib.request.urlopen(req, timeout=zeitlimit) as r:
        return r.status, r.read()


def _struktur(roh):
    """Beschreiben, wie die Antwort gebaut ist und wo Einträge stecken.

    Der entscheidende Unterschied: eine Antwort ohne Einträge und eine
    Antwort, deren Einträge ich nur nicht finde, sehen von aussen gleich
    aus — beide ergeben „0 Treffer". Hier wird auseinandergehalten, was
    der Dienst geschickt hat und was mein Leser daraus gemacht hat.

    Gibt (beschreibung, listen) zurück; `listen` ist [(pfad, anzahl), ...]
    aller nichtleeren Listen in der Antwort.
    """
    text = roh.decode("utf-8", "replace").strip()
    listen = []
    if text.startswith("{") or text.startswith("["):
        try:
            d = json.loads(text)
        except ValueError:
            return "JSON kaputt: " + text[:120], listen

        def geh(x, pfad):
            if isinstance(x, dict):
                for k, v in x.items():
                    geh(v, pfad + "." + k if pfad else k)
            elif isinstance(x, list) and x:
                listen.append((pfad or "(Wurzel)", len(x)))

        geh(d, "")
        oben = ", ".join(sorted(d)) if isinstance(d, dict) else "Liste"
        return "JSON, oberste Ebene: " + oben, listen

    try:
        wurzel = ET.fromstring(text)
    except ET.ParseError:
        return "weder JSON noch XML: " + text[:120], listen
    zaehler = {}
    for k in wurzel:
        zaehler[k.tag.split("}")[-1]] = zaehler.get(
            k.tag.split("}")[-1], 0) + 1
    for n, c in zaehler.items():
        if c > 1:
            listen.append((wurzel.tag.split("}")[-1] + "/" + n, c))
    return ("XML, Wurzel <%s>, Kinder: %s"
            % (wurzel.tag.split("}")[-1],
               ", ".join("%s×%d" % (n, c) for n, c in zaehler.items())
               or "keine"), listen)


def _erster_eintrag_zeigen(roh):
    """Die Feldpfade des ersten Listeneintrags ausgeben.

    Wenn der Leser nichts findet, obwohl Einträge da sind, ist das die
    Antwort auf die Frage „wie heissen die Felder wirklich". Ohne diese
    Ausgabe wäre die nächste Runde wieder Raten.
    """
    from .quellen.amtsblatt import _flach
    try:
        d = json.loads(roh.decode("utf-8", "replace"))
    except ValueError:
        return
    if not isinstance(d, dict):
        return
    for schluessel, wert in d.items():
        if isinstance(wert, list) and wert and isinstance(wert[0], dict):
            print("          Felder des ersten Eintrags unter %s:"
                  % schluessel)
            for pfad, v in sorted(_flach(wert[0]).items())[:20]:
                print("            %-32s %s" % (pfad, str(v)[:44]))
            return


def _variante_finden(basis, seit, bis):
    """Herausfinden, welche Abfrage der Dienst zulässt UND beantwortet.

    Zwei getrennte Fragen, die nacheinander beantwortet werden:

      1. Welche Abfrage wird überhaupt zugelassen? Ohne
         `publicationStates=PUBLISHED` antwortet das Portal mit 401 — das
         ist kein fehlendes Konto, sondern eine nicht zugelassene Abfrage.
      2. Warum kommen trotzdem keine Einträge zurück? Hier wird jeder
         Filter einzeln zugeschaltet. Bleibt es schon ohne jeden Filter
         bei null, liegt es nicht am Filter, sondern daran, wie die
         Antwort gebaut ist — und dann wird genau das gezeigt.

    Gibt (basis, zusatz, accept, kopfdaten) zurück oder None.
    """
    hosts = []
    for h in (basis, "https://www.shab.ch/api/v1",
              "https://amtsblattportal.ch/api/v1"):
        if h not in hosts:
            hosts.append(h)

    zusatz = {"publicationStates": "PUBLISHED"}
    grund = [("publicationStates", "PUBLISHED"), ("pageRequest.size", "5")]

    leser = AmtsblattQuelle({"basis_url": basis})

    # -- Frage 1: welcher Host lässt die Abfrage zu? ---------------------
    host = None
    for h in hosts:
        kurz = h.split("//")[-1].split("/")[0]
        try:
            code, roh = _abfrage(h, grund)
            beschreibung, listen = _struktur(roh)
            anzahl = len(leser._liste_lesen(roh))
            print("  HTTP %d  %-22s %d Bytes · %s" % (code, kurz, len(roh),
                                                      beschreibung))
            print("          gefundene Einträge: %d (mein Leser) | %s"
                  % (anzahl, ", ".join("%s=%d" % (p, c) for p, c in listen)
                     or "keine Liste in der Antwort"))
            if host is None:
                _erster_eintrag_zeigen(roh)
            if host is None:
                host = h
        except urllib.error.HTTPError as e:
            print("  HTTP %s  %-22s abgelehnt" % (e.code, kurz))
        except Exception as e:
            print("  FEHL     %-22s %s" % (kurz, type(e).__name__))

    if host is None:
        print("\nKein Host liess die Abfrage zu. Ohne Zugang vom Betreiber "
              "(SECO/SHAB) geht es nicht weiter; bis dahin bleibt der "
              "Import von Hand: CSV, JSON oder PDF.")
        return None

    # -- Frage 2: welcher Filter nimmt die Treffer weg? ------------------
    print("\n  Filter einzeln zuschalten (%s):"
          % host.split("//")[-1].split("/")[0])
    proben = [
        ("ohne Filter", []),
        ("+ subRubrics=KK01", [("subRubrics", "KK01")]),
        ("+ rubrics=KK", [("rubrics", "KK")]),
        ("+ publicationDate.start/.end",
         [("publicationDate.start", seit), ("publicationDate.end", bis)]),
        ("+ startDate/endDate", [("startDate", seit), ("endDate", bis)]),
        ("+ cantons=ZH", [("cantons", "ZH")]),
    ]
    ergebnis = {}
    for wie, extra in proben:
        try:
            code, roh = _abfrage(host, grund + extra)
            anzahl = len(leser._liste_lesen(roh))
            _, listen = _struktur(roh)
            roh_anzahl = max([c for _, c in listen] or [0])
            ergebnis[wie] = (anzahl, roh_anzahl)
            print("    %-30s Leser %-4d Antwort %-4d" % (wie, anzahl,
                                                         roh_anzahl))
        except urllib.error.HTTPError as e:
            ergebnis[wie] = None
            print("    %-30s HTTP %s" % (wie, e.code))
        except Exception as e:
            ergebnis[wie] = None
            print("    %-30s %s" % (wie, type(e).__name__))
        time.sleep(0.4)

    ohne = ergebnis.get("ohne Filter")
    if ohne and ohne[1] and not ohne[0]:
        print("\n  BEFUND: Der Dienst liefert Einträge, mein Leser findet "
              "sie nicht. Es liegt NICHT am Filter, sondern daran, wie die "
              "Antwort gebaut ist. Die Zeile mit den gefundenen Einträgen "
              "oben nennt den Pfad — der gehört in _liste_lesen() in "
              "radar/quellen/amtsblatt.py.")
        return None
    if ohne and not ohne[1]:
        print("\n  BEFUND: Schon ohne jeden Filter kommt nichts zurück. "
              "Dann ist es nicht die Abfrage, sondern der Zugang: das "
              "Portal beantwortet anonyme Trefferlisten offenbar leer. "
              "Ein Zugang vom Betreiber (SECO/SHAB) wäre der Weg; bis "
              "dahin bleibt der Import von Hand.")
        return None

    # Der beste Filtersatz: alles, was für sich genommen Treffer behielt.
    felder, benutzt = [], []
    for wie, extra in proben[1:]:
        e = ergebnis.get(wie)
        if e and e[0]:
            felder.extend(extra)
            benutzt.append(wie)
    kopf = []
    if ohne and ohne[0]:
        try:
            code, roh = _abfrage(host, grund + felder)
            kopf = leser._liste_lesen(roh)
        except Exception as e:
            print("  %s" % e)
    if kopf:
        print("\n  Diese Abfrage geht (%s). In radar/config.json unter "
              "\"amtsblatt\" eintragen:" % (", ".join(benutzt) or "ungefiltert"))
        print("  " + json.dumps({"basis_url": host,
                                 "zusatz_parameter": zusatz},
                                ensure_ascii=False))
        return host, zusatz, "application/json", kopf

    print("\n  Keine Kombination lieferte auswertbare Treffer.")
    return None


def _titel_sammeln(d, raus=None):
    """Code → Titel aus der Rubrikantwort ziehen.

    Ein Eintrag, der einen Code und einen Namen trägt, wird als Paar
    gemerkt. Welches Feld der Name ist, unterscheidet sich zwischen
    Diensten — deshalb mehrere Kandidaten, deutscher zuerst.
    """
    if raus is None:
        raus = {}
    if isinstance(d, dict):
        code = d.get("code") or d.get("id") or d.get("key")
        if isinstance(code, str) and any(c.isdigit() for c in code):
            for feld in ("name", "title", "description", "label"):
                v = d.get(feld)
                if isinstance(v, dict):
                    v = v.get("de") or v.get("fr") or v.get("en")
                if isinstance(v, str) and v.strip():
                    raus.setdefault(code, v.strip()[:70])
                    break
        for v in d.values():
            _titel_sammeln(v, raus)
    elif isinstance(d, list):
        for v in d:
            _titel_sammeln(v, raus)
    return raus


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
