#!/usr/bin/env python3
"""Liest die WTO Trade Profiles 2023 aus und schreibt static/wto.js.

WARUM ES DIESES WERKZEUG GIBT
-----------------------------
Der Atlas hatte bis hierher keine belastbaren bilateralen Handelszahlen. In
`handel.js` stehen deshalb nur Rangfolgen ("Ausfuhr: Fahrzeuge, Maschinen,
Elektronik") und Partnernamen ohne Gewicht — erfundene Prozentzahlen wären
schlimmer gewesen als keine.

Die WTO Trade Profiles schliessen genau diese Lücke: je Volkswirtschaft die
Anteile der wichtigsten Ziel- und Herkunftsländer in Prozent, die Aufteilung
nach Warengruppen und die fünf grössten Ein- und Ausfuhrwaren mit Werten.

ABHÄNGIGKEIT — BEWUSSTE AUSNAHME
--------------------------------
Der Atlas kommt sonst ohne Fremdbibliotheken aus. Dieses Werkzeug braucht
`pypdf` und ist deshalb ein Bau-Werkzeug wie `build_map.py`: es läuft einmal
beim Entwickeln, nie im Auslieferungsstand. Was ausgeliefert wird, ist die
erzeugte `static/wto.js` — reines JavaScript ohne jede Abhängigkeit.

    pip install pypdf
    python3 tools/wto_lesen.py trade_profiles23_e.pdf

ZUM TEXT AUS DEM PDF
--------------------
Die Profile sind zweispaltig gesetzt; beim Extrahieren kommt der Text in
einer Reihenfolge heraus, die nicht der optischen entspricht. Verlässlich
sind aber die Beschriftungen ("By main destination", "Agricultural
products:"), und daran hängt sich dieses Werkzeug auf. Was sich nicht
zweifelsfrei zuordnen lässt, wird weggelassen und am Ende gemeldet —
lieber eine Lücke als eine falsche Zahl.
"""
import json
import os
import re
import sys

try:
    from pypdf import PdfReader
except ImportError:
    sys.exit("pypdf fehlt:  pip install pypdf")

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ZIEL = os.path.join(BASE, "static", "wto.js")

# Die Namen der WTO auf die Namen der Kartendaten (Natural Earth) bringen.
# Nur wo sie sich unterscheiden — alles andere passt wörtlich.
NAMEN = {
    "United States of America": "United States of America",
    "Korea, Republic of": "South Korea",
    "Russian Federation": "Russia",
    "Chinese Taipei": "Taiwan",
    "Hong Kong, China": "Hong Kong",
    "Macao, China": "Macao",
    "Iran": "Iran",
    "Syrian Arab Republic": "Syria",
    "Lao People's Democratic Republic": "Laos",
    "Viet Nam": "Vietnam",
    "Türkiye": "Turkey",
    "Czech Republic": "Czechia",
    "Slovak Republic": "Slovakia",
    "Congo": "Congo",
    "Eswatini": "eSwatini",
    "Bahrain, Kingdom of": "Bahrain",
    "Kuwait, the State of": "Kuwait",
    "Saudi Arabia, Kingdom of": "Saudi Arabia",
    "Bolivia, Plurinational State of": "Bolivia",
    "Venezuela, Bolivarian Republic of": "Venezuela",
    "Moldova, Republic of": "Moldova",
    "Serbia": "Serbia",
    "European Union": "European Union",
    "Kyrgyz Republic": "Kyrgyzstan",
    "Lao People\u2019s Democratic Republic": "Laos",
    "Sao Tomé and Principe": "São Tomé and Principe",
    "Republic of the Congo": "Congo",
    "Korea, Dem. People\u2019s Rep. of": "North Korea",
    "Korea, Dem. People's Rep. of": "North Korea",
    "Virgin Islands, British": "British Virgin Is.",
    "Northern Mariana Islands": "N. Mariana Is.",
    "St. Vincent & the Grenadines": "St. Vin. and Gren.",
    # Gegen die tatsächlichen Namen in world.js geprüft, nicht geraten.
    "Côte d\u2019Ivoire": "Côte d'Ivoire",
    "Antigua and Barbuda": "Antigua and Barb.",
    "Dem. Rep. of the Congo": "Dem. Rep. Congo",
    "Democratic Republic of the Congo": "Dem. Rep. Congo",
    "Lebanese Republic": "Lebanon",
    "Cayman Islands": "Cayman Is.",
    "North Macedonia": "Macedonia",
    "Turks and Caicos Islands": "Turks and Caicos Is.",
    "Saint Martin": "St-Martin",
    "Saint Kitts and Nevis": "St. Kitts and Nevis",
    "Saint Lucia": "Saint Lucia",
    "Sudan, former": "Sudan",
    "South Sudan": "S. Sudan",
    "Timor-Leste": "Timor-Leste",
    "Cabo Verde": "Cabo Verde",
    "Micronesia, Federated States of": "Micronesia",
    "The Gambia": "Gambia",
    "Brunei Darussalam": "Brunei",
    "Tanzania": "Tanzania",
    "Bosnia and Herzegovina": "Bosnia and Herz.",
    "Faeroe Islands": "Faeroe Is.",
    "Solomon Islands": "Solomon Is.",
    "Marshall Islands": "Marshall Is.",
    "Central African Republic": "Central African Rep.",
    "Dominican Republic": "Dominican Rep.",
    "Equatorial Guinea": "Eq. Guinea",
    "Trinidad and Tobago": "Trinidad and Tobago",
    "Saint Vincent and the Grenadines": "St. Vin. and Gren.",
}

# Warengruppen, wie sie im PDF heissen. "Other" steht bewusst NICHT dabei:
# es trennt die Ausfuhr- von der Einfuhrliste der Partner und wird gebraucht.
GRUPPEN = ["Agricultural products", "Fuels and mining products",
           "Manufactures"]


def index_lesen(reader):
    """Aus dem Inhaltsverzeichnis: Name -> gedruckte Seitenzahl."""
    text = reader.pages[6].extract_text() or ""
    eintraege = {}
    for zeile in text.split("\n"):
        m = re.match(r"^(.+?)\s+(\d{1,3})\s*$", zeile.strip())
        if not m:
            continue
        name, seite = m.group(1).strip(), int(m.group(2))
        if len(name) > 2 and seite >= 6:
            eintraege[name] = seite
    return eintraege


def zahl(s):
    """'746 920' oder '19.4' -> float. Gibt None bei 'na' und Unsinn."""
    s = s.replace(" ", "").replace(" ", "").strip()
    if not s or s.lower() in ("na", "-", "..."):
        return None
    try:
        return float(s)
    except ValueError:
        return None


def anteile_lesen(text, marke):
    """Die Zeilen 'China: 19.4 United States of America: 18.7' auswerten.

    Im extrahierten Text stehen erst alle Warengruppen-Zeilen, danach die
    Partnerzeilen — jeweils Ausfuhr zuerst, dann Einfuhr. Erkannt werden sie
    an ihrem Aufbau 'Name: Zahl', nicht an ihrer Position; die Position ist
    beim zweispaltigen Satz nicht verlässlich.
    """
    raus = []
    # Kein Zeilenumbruch im Namen: sonst schluckt der erste Treffer die
    # halbe Seite und heisst dann "HS2208\nHS2103\n...China".
    for treffer in re.finditer(r"([A-Z][^:\n]{2,45}?):\s*([\d.]+)", text):
        name = treffer.group(1).strip()
        wert = zahl(treffer.group(2))
        if wert is None or wert > 100:
            continue
        raus.append((name, wert))
    return raus


def waren_lesen(text):
    """Top-Waren: 'HS8703 Motor cars for transport of persons  86 573'."""
    raus = []
    for m in re.finditer(r"(HS\d{4})\s+(.+?)\s{2,}([\d ]+\d)\s*$",
                         text, re.M):
        w = zahl(m.group(3))
        if w is not None:
            raus.append({"hs": m.group(1), "t": m.group(2).strip(), "v": w})
    return raus


def profil_lesen(text, name):
    """Ein Länderprofil auswerten. Fehlendes bleibt weg."""
    p = {"name": name}

    m = re.search(r"GDP \(million current US\$, (\d{4})\)\s+([\d ]+)", text)
    if m:
        p["bip"] = zahl(m.group(2))
        p["bipJahr"] = int(m.group(1))

    # Handelsvolumen: die beiden grossen Zahlen unter "Million US$ 2022".
    m = re.search(r"Million US\$ 2022\s*\n\s*([\d ]+)\s*\n\s*([\d ]+)", text)
    if m:
        p["aus"] = zahl(m.group(1))
        p["ein"] = zahl(m.group(2))

    # Bezugsjahre stehen an den Überschriften und sind NICHT überall gleich:
    # Japan hat Partner für 2022, Saudi-Arabien für 2021. Ein pauschales
    # "Stand 2022" wäre schlicht falsch.
    m = re.search(r"By main destination, % \((\d{4})\)", text)
    if m:
        p["pJahr"] = int(m.group(1))
    m = re.search(r"By main commodity group, % \((\d{4})\)", text)
    if m:
        p["wJahr"] = int(m.group(1))

    # Warengruppen — zwei Blöcke: erst Ausfuhr, dann Einfuhr.
    gruppen = []
    for m in re.finditer(
            r"Agricultural products:\s*([\d.]+)\s*"
            r"Fuels and mining products:\s*([\d.]+)\s*"
            r"Manufactures:\s*([\d.]+)\s*Other:\s*([\d.]+)", text):
        gruppen.append({"agrar": zahl(m.group(1)), "energie": zahl(m.group(2)),
                        "industrie": zahl(m.group(3)), "sonst": zahl(m.group(4))})
    if len(gruppen) >= 1:
        p["wAus"] = gruppen[0]
    if len(gruppen) >= 2:
        p["wEin"] = gruppen[1]

    # Partner. Die Warengruppenzeilen vorher herausschneiden, sonst tauchen
    # "Manufactures" und "Other" als Partnerländer auf.
    rest = re.sub(r"Agricultural products:.*?Other:\s*[\d.]+", "", text,
                  flags=re.S)
    partner = [(n, w) for n, w in anteile_lesen(rest, None)
               if n not in GRUPPEN and not n.startswith("HS")]
    # "Other: 38.2" trennt die Ausfuhr- von der Einfuhrliste.
    #
    # Der "Other"-Anteil wird MITGENOMMEN, nicht verworfen. Bei Saudi-Arabien
    # weist die WTO 80.2 % als "Other" aus — wer dann nur "Hauptabnehmer VAE
    # 5.1 %" liest, bekommt ein falsches Bild. Der Rest gehört sichtbar dazu.
    aus, ein, akt = [], [], []
    reste = []
    for n, w in partner:
        if n == "Other":
            (aus if not aus else ein).extend(akt)
            reste.append(w)
            akt = []
            continue
        akt.append({"l": n, "p": w})
    if akt:
        (aus if not aus else ein).extend(akt)
    if aus:
        p["pAus"] = aus
    if ein:
        p["pEin"] = ein
    if len(reste) >= 1:
        p["restAus"] = reste[0]
    if len(reste) >= 2:
        p["restEin"] = reste[1]
    return p


def main():
    pdf = sys.argv[1] if len(sys.argv) > 1 else os.path.join(
        BASE, "trade_profiles23_e.pdf")
    if not os.path.exists(pdf):
        sys.exit("PDF nicht gefunden: " + pdf)
    reader = PdfReader(pdf)
    # Versatz zwischen gedruckter Seite und PDF-Seite bestimmen, statt ihn
    # anzunehmen: das Inhaltsverzeichnis ist gedruckte Seite 5.
    versatz = 7 - 5
    index = index_lesen(reader)
    print("Profile im Inhaltsverzeichnis: %d" % len(index))

    daten, luecken = {}, []
    for name, seite in sorted(index.items(), key=lambda x: x[1]):
        i = seite + versatz - 1
        if i >= len(reader.pages):
            continue
        text = reader.pages[i].extract_text() or ""
        if name.split(",")[0][:12] not in text:
            luecken.append(name + " (Seite passt nicht)")
            continue
        p = profil_lesen(text, name)
        # Auch die Partnernamen auf die Kartennamen bringen — sonst findet
        # die Karte "Korea, Republic of" nicht und zeichnet keine Linie.
        for feld in ("pAus", "pEin"):
            for eintrag in p.get(feld) or []:
                eintrag["l"] = NAMEN.get(eintrag["l"], eintrag["l"])
        p["waren"] = waren_lesen(text)
        p["seite"] = seite
        schluessel = NAMEN.get(name, name)
        daten[schluessel] = p
        fehlt = [k for k in ("pAus", "pEin", "wAus", "wEin") if k not in p]
        if fehlt:
            luecken.append("%s: fehlt %s" % (name, ", ".join(fehlt)))

    kopf = (
        "/* Handelszahlen der WTO — ERZEUGT, nicht von Hand pflegen.\n"
        "\n"
        "   Quelle: WTO, Trade Profiles 2023 (ISBN 978-92-870-7449-4).\n"
        "   Bezugsjahr steht je Land in pJahr/wJahr — es ist NICHT überall\n"
        "   gleich (Japan 2022, Saudi-Arabien 2021).\n"
        "   Erzeugt von tools/wto_lesen.py aus trade_profiles23_e.pdf.\n"
        "   Das Feld `seite` nennt die gedruckte Seite zum Nachschlagen.\n"
        "\n"
        "   Felder je Volkswirtschaft:\n"
        "     bip    Bruttoinlandsprodukt, Mio. US$\n"
        "     aus    Warenausfuhr, Mio. US$ (f.o.b.)\n"
        "     ein    Wareneinfuhr, Mio. US$ (c.i.f.)\n"
        "     wAus   Ausfuhr nach Warengruppe, Prozent\n"
        "     wEin   Einfuhr nach Warengruppe, Prozent\n"
        "     pAus   Zielländer mit Anteil an der Ausfuhr, Prozent\n"
        "     pEin   Herkunftsländer mit Anteil an der Einfuhr, Prozent\n"
        "     waren  fünf grösste Waren je Richtung, Mio. US$\n"
        "     restAus/restEin  Anteil, den die WTO nicht aufschlüsselt.\n"
        "            Nicht weglassen: bei Saudi-Arabien sind das 80.2 % der\n"
        "            Ausfuhr, und ohne diese Angabe liest sich der grösste\n"
        "            genannte Abnehmer (5.1 %) als Hauptabnehmer.\n"
        "\n"
        "   ZUR EINORDNUNG: Die EU zählt als EIN Partner. Anteile beziehen\n"
        "   sich auf den Warenhandel, nicht auf Dienstleistungen, und\n"
        "   summieren sich mit 'Other' auf 100. */\n")
    with open(ZIEL, "w") as f:
        f.write(kopf)
        f.write("const WTO = ")
        json.dump(daten, f, ensure_ascii=False, indent=0, sort_keys=True)
        f.write(";\n")

    print("Geschrieben: %s (%d Volkswirtschaften, %.0f KB)"
          % (ZIEL, len(daten), os.path.getsize(ZIEL) / 1024))
    mitP = sum(1 for p in daten.values() if p.get("pAus"))
    mitW = sum(1 for p in daten.values() if p.get("wAus"))
    print("  mit Partneranteilen: %d   mit Warengruppen: %d" % (mitP, mitW))
    if luecken:
        print("  Lücken (%d):" % len(luecken))
        for l in luecken[:25]:
            print("    " + l)


if __name__ == "__main__":
    main()
