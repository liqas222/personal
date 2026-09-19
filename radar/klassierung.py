#!/usr/bin/env python3
"""Branche und wahrscheinliche Assets aus dem Zweckartikel ableiten.

WARUM DER ZWECKARTIKEL UND NICHT DIE WEBSITE
--------------------------------------------
Die ursprüngliche Spezifikation wollte Punkte dafür vergeben, ob die
Firmenwebsite Fahrzeuge oder Maschinen zeigt. Das hat zwei Probleme:

1. Die Website einer Konkursitin ist häufig bereits abgeschaltet — gerade
   dann, wenn man sie bräuchte.
2. Ohne diese Signale erreicht ein Fall nur 30 + 20 = 50 Punkte und fällt
   unter die Schwelle von 60. Der Radar hätte fast täglich gemeldet, es
   gebe nichts.

Der Zweckartikel aus dem Handelsregister steht dagegen IMMER zur Verfügung,
ist amtlich und erstaunlich ergiebig: „Handel mit und Reparatur von
Motorfahrzeugen", „Betrieb einer Schreinerei", „Stahl- und Montagebau".
Daraus lassen sich Assets begründet ableiten, ohne eine fremde Seite
anzufassen.

WAS HIER NICHT PASSIERT
-----------------------
Es wird nichts bestätigt. Alles, was diese Datei liefert, ist eine
Vermutung aus Wortmaterial. Die einzige verbindliche Auskunft über
vorhandene Gegenstände gibt das Inventar des Konkursamts.
"""
import re

# ---------------------------------------------------------------------------
# Branchen. `punkte` fliesst in die Bewertung, `assets` sind die Gegenstände,
# die bei dieser Tätigkeit typischerweise anfallen.
#
# Die Stichworte sind bewusst auf Deutsch und in der Form, in der sie in
# Handelsregister-Zwecken tatsächlich vorkommen.
# ---------------------------------------------------------------------------
BRANCHEN = [
    {
        "id": "auto",
        "name": "Autohandel und Garage",
        "punkte": 30,
        "worte": ["garage", "motorfahrzeug", "autohandel", "autohaus",
                  "fahrzeughandel", "carrosserie", "karosserie", "autospritz",
                  "pneuhaus", "autoreparatur", "fahrzeugreparatur",
                  "occasion", "autogewerbe", "automobil"],
        "assets": ["Fahrzeuge und Vorführwagen", "Hebebühnen",
                   "Diagnosegeräte", "Werkstatteinrichtung",
                   "Reifen- und Ersatzteillager"],
    },
    {
        "id": "bau",
        "name": "Bau",
        "punkte": 30,
        "worte": ["baugeschäft", "bauunternehm", "hochbau", "tiefbau",
                  "baumeister", "maurer", "gipser", "bauarbeiten",
                  "generalunternehm", "umbau", "renovation", "baggerarbeiten",
                  "erdarbeiten", "abbruch", "gerüstbau", "bedachung",
                  "spengler", "dachdecker", "plattenleger", "bodenleger",
                  "maler", "sanitär", "heizung", "lüftung", "elektroinstallat"],
        "assets": ["Kleinbaumaschinen", "Gerüste", "Baustelleneinrichtung",
                   "Transporter", "Elektrowerkzeuge", "Anhänger"],
    },
    {
        "id": "logistik",
        "name": "Logistik und Transport",
        "punkte": 30,
        "worte": ["transport", "spedition", "logistik", "umzüge", "umzug",
                  "kurier", "camionnage", "güterverkehr", "lagerhaltung",
                  "lagerlogistik", "distribution", "zustell"],
        "assets": ["Lastwagen und Transporter", "Anhänger", "Stapler",
                   "Regalanlagen", "Hubwagen", "Lagereinrichtung"],
    },
    {
        "id": "produktion",
        "name": "Produktion",
        "punkte": 30,
        "worte": ["herstellung", "produktion", "fabrikation", "fertigung",
                  "verarbeitung", "giesserei", "druckerei", "textil",
                  "kunststoff", "lebensmittelherstell", "bäckerei",
                  "metzgerei", "brauerei"],
        "assets": ["Produktionsmaschinen", "Fertigungsanlagen",
                   "Roh- und Fertigwarenlager", "Werkstatteinrichtung"],
    },
    {
        "id": "maschinenbau",
        "name": "Maschinenbau und Metall",
        "punkte": 30,
        "worte": ["maschinenbau", "metallbau", "stahlbau", "montagebau",
                  "mechanik", "cnc", "dreherei", "fräserei", "schlosserei",
                  "schweiss", "apparatebau", "anlagenbau", "werkzeugbau",
                  "blech"],
        "assets": ["Werkzeugmaschinen", "CNC-Maschinen", "Schweissgeräte",
                   "Hebe- und Montagegeräte", "Werkstatteinrichtung",
                   "Materiallager"],
    },
    {
        "id": "montage",
        "name": "Montage",
        "punkte": 30,
        "worte": ["montage", "montagen", "installation von",
                  "industriemontage", "anlagenmontage"],
        "assets": ["Transporter", "Elektrowerkzeuge",
                   "Hebe- und Montagegeräte", "Gerüste",
                   "Werkstatt- und Lagereinrichtung"],
    },
    {
        "id": "handwerk",
        "name": "Handwerk",
        # 30 wie die anderen Zielbranchen: Handwerk steht ausdrücklich auf
        # der Prioritätenliste, und eine Schreinerei hat stationäre
        # Maschinen im fünfstelligen Bereich.
        "punkte": 30,
        "worte": ["schreinerei", "zimmerei", "holzbau", "tischlerei",
                  "polsterei", "glaserei", "küchenbau", "innenausbau",
                  "gartenbau", "landschaftsbau", "reinigung"],
        "assets": ["Stationäre Holzbearbeitungsmaschinen", "Elektrowerkzeuge",
                   "Transporter", "Materiallager", "Werkstatteinrichtung"],
    },
    {
        "id": "lager",
        "name": "Handel und Lagerhaltung",
        "punkte": 20,
        "worte": ["grosshandel", "handel mit", "import und export",
                  "vertrieb von", "warenlager", "detailhandel"],
        "assets": ["Warenbestand", "Regalanlagen", "Stapler",
                   "Lagereinrichtung"],
    },
    {
        "id": "gastro",
        "name": "Gastronomie",
        "punkte": 10,
        "worte": ["restaurant", "gastronomie", "gaststätte", "hotel",
                  "bar und", "café", "cafe", "take away", "catering",
                  "betrieb eines lokals"],
        "assets": ["Gastroküche", "Kühl- und Gefriergeräte",
                   "Mobiliar", "Geschirr und Besteck"],
    },
]

# Tätigkeiten mit wenig verwertbarer Substanz. Abzug, nicht Ausschluss —
# eine Beratungsfirma kann Fahrzeuge haben, nur selten in Menge.
ABZUEGE = [
    {"id": "beratung", "name": "Beratung", "punkte": -30,
     "worte": ["beratung", "consulting", "unternehmensberat", "coaching",
               "treuhand", "revision", "rechtsberat", "vermittlung von",
               "marketing", "werbeagentur", "personalverleih"]},
    {"id": "holding", "name": "Holding", "punkte": -30,
     "worte": ["holding", "beteiligungen an", "erwerb und verwaltung von "
               "beteiligungen", "vermögensverwalt", "finanzierung von"]},
    {"id": "software", "name": "Software und Digital", "punkte": -20,
     "worte": ["software", "informatik", "it-dienstleist", "webdesign",
               "app-entwicklung", "programmier", "digitalagentur",
               "online-marketing", "e-commerce-plattform"]},
    {"id": "immobilien", "name": "Immobilien", "punkte": -20,
     "worte": ["erwerb, verwaltung und veräusserung von immobilien",
               "immobilienverwalt", "liegenschaftsverwalt"]},
]

# Einzelne Gegenstände, die im Text direkt genannt werden. Das ist stärker
# als die Branchenvermutung, weil es wörtlich dasteht.
ASSET_WORTE = {
    "Fahrzeuge": ["fahrzeug", "lieferwagen", "transporter", "lastwagen",
                  "lkw", "personenwagen", "occasionen", "fahrzeugflotte",
                  "nutzfahrzeug"],
    "Stapler und Lagertechnik": ["stapler", "gabelstapler", "hubwagen",
                                 "regalanlage", "hochregal"],
    "Baumaschinen": ["bagger", "baumaschine", "radlader", "kompressor",
                     "rüttelplatte", "kran"],
    "Werkzeuge": ["werkzeug", "elektrowerkzeug", "maschinenpark",
                  "handwerkzeug"],
    "Produktionsmaschinen": ["produktionsmaschine", "cnc", "drehbank",
                             "fräsmaschine", "presse", "anlage zur"],
    "Warenbestand": ["warenlager", "warenbestand", "lagerbestand",
                     "rohmaterial", "fertigwaren"],
    "Werkstatt- und Lagereinrichtung": ["werkstatt", "werkstatteinrichtung",
                                        "lagereinrichtung", "betriebsausstatt"],
}


def _treffer(text, worte):
    """Welche Stichworte kommen vor? Gibt die Fundstellen zurück.

    Wortgrenzen sind zwingend: ohne sie steckt „bau" in „Baumwolle" und
    „it-" in „Reinigung". Derselbe Fehler hat im Atlas schon einmal den
    Absender einer Meldung zum Ziel erklärt.
    """
    raus = []
    for w in worte:
        if re.search(r"\b" + re.escape(w), text):
            raus.append(w)
    return raus


def klassieren(zweck, zusatztext=""):
    """Branche, Abzüge und vermutete Assets bestimmen.

    Gibt immer eine nachvollziehbare Begründung mit: welches Wort hat
    welchen Treffer ausgelöst. Ohne das ist eine Bewertung nicht prüfbar.
    """
    text = ((zweck or "") + " " + (zusatztext or "")).lower()

    branchen = []
    for b in BRANCHEN:
        t = _treffer(text, b["worte"])
        if t:
            branchen.append({"id": b["id"], "name": b["name"],
                             "punkte": b["punkte"], "wegen": t[:4],
                             "assets": b["assets"]})
    # Die stärkste Branche führt; weitere werden als Nebenbranchen geführt.
    branchen.sort(key=lambda x: -x["punkte"])

    abzuege = []
    for a in ABZUEGE:
        t = _treffer(text, a["worte"])
        if t:
            abzuege.append({"id": a["id"], "name": a["name"],
                            "punkte": a["punkte"], "wegen": t[:4]})

    # Assets: erst die wörtlich genannten, dann die aus der Branche vermuteten.
    genannt, vermutet = [], []
    for name, worte in ASSET_WORTE.items():
        if _treffer(text, worte):
            genannt.append(name)
    for b in branchen[:2]:
        for a in b["assets"]:
            if a not in vermutet and a not in genannt:
                vermutet.append(a)

    # Wenn keine Zielbranche greift, aber ein Abzug: DEN anzeigen. „Nicht
    # erkennbar" wäre falsch — eine Holding wurde sehr wohl erkannt, sie ist
    # nur uninteressant, und das ist eine andere Aussage.
    if branchen:
        anzeige, anzeige_id = branchen[0]["name"], branchen[0]["id"]
    elif abzuege:
        anzeige = abzuege[0]["name"] + " (uninteressant)"
        anzeige_id = abzuege[0]["id"]
    else:
        anzeige, anzeige_id = "Nicht erkennbar", None

    return {
        "branche": anzeige,
        "branche_id": anzeige_id,
        "branchen": branchen,
        "abzuege": abzuege,
        "assets_genannt": genannt,
        "assets_vermutet": vermutet,
    }
