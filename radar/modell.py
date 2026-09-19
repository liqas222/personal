#!/usr/bin/env python3
"""Datenmodell und Normalisierung für Konkursmeldungen.

Ein Fall ist eine Meldung über eine Firma, angereichert um das, was sich
daraus ableiten lässt. Was gemessen ist und was abgeleitet, bleibt im Modell
getrennt — sonst weiss man später nicht mehr, was aus der amtlichen Quelle
stammt und was diese Software dazuerfunden hat.

KEINE ABHÄNGIGKEITEN. Nur Standardbibliothek, damit der Radar im selben
Prozess wie der Atlas läuft und der Server nichts installieren muss.
"""
import datetime
import hashlib
import re
import unicodedata

# ---------------------------------------------------------------------------
# Kantone, die uns interessieren. Andere werden eingelesen, aber nicht
# angezeigt — wegwerfen wäre falsch, denn die Prioritäten können sich ändern.
# ---------------------------------------------------------------------------
KANTONE = {
    "ZH": "Zürich", "AG": "Aargau", "ZG": "Zug", "SZ": "Schwyz",
    "SG": "St. Gallen", "LU": "Luzern",
}

ALLE_KANTONE = {
    "AG": "Aargau", "AI": "Appenzell Innerrhoden", "AR": "Appenzell Ausserrhoden",
    "BE": "Bern", "BL": "Basel-Landschaft", "BS": "Basel-Stadt",
    "FR": "Freiburg", "GE": "Genf", "GL": "Glarus", "GR": "Graubünden",
    "JU": "Jura", "LU": "Luzern", "NE": "Neuenburg", "NW": "Nidwalden",
    "OW": "Obwalden", "SG": "St. Gallen", "SH": "Schaffhausen",
    "SO": "Solothurn", "SZ": "Schwyz", "TG": "Thurgau", "TI": "Tessin",
    "UR": "Uri", "VD": "Waadt", "VS": "Wallis", "ZG": "Zug", "ZH": "Zürich",
}

# Meldungsarten. Die Unterscheidung ist geschäftlich wichtig: eine
# Konkurseröffnung ist etwas anderes als ein Kollokationsplan, und beides
# ist etwas anderes als eine Steigerungsanzeige.
MELDUNGSARTEN = {
    "konkurseroeffnung": "Konkurseröffnung",
    "konkurs_einstellung": "Einstellung mangels Aktiven",
    "konkurs_widerruf": "Widerruf des Konkurses",
    "kollokationsplan": "Kollokationsplan und Inventar",
    "schuldenruf": "Schuldenruf",
    "steigerung": "Steigerung / Verwertung",
    "liquidation": "Liquidation",
    "sonstige": "Sonstige Meldung",
}

# Woran die Art erkannt wird. Bewusst grob und in dieser Reihenfolge geprüft —
# der erste Treffer gewinnt, spezifische Muster stehen deshalb vorn.
ART_MUSTER = [
    ("steigerung", ["steigerung", "versteigerung", "verwertung",
                    "freihandverkauf", "gant"]),
    ("kollokationsplan", ["kollokationsplan", "inventar", "auflage des",
                          "kollokation"]),
    ("konkurs_widerruf", ["widerruf des konkurses", "konkurswiderruf"]),
    ("konkurs_einstellung", ["mangels aktiven", "einstellung des konkurs",
                             "summarisches verfahren mangels"]),
    ("schuldenruf", ["schuldenruf", "rechnungsruf", "eingabefrist"]),
    ("konkurseroeffnung", ["konkurseröffnung", "konkurseroeffnung",
                           "konkurs eröffnet", "über die firma wurde der konkurs"]),
    ("liquidation", ["liquidation", "auflösung der gesellschaft",
                     "in liquidation"]),
]


def art_erkennen(text):
    """Welche Meldungsart steckt im Text? Gibt 'sonstige', wenn unklar."""
    t = (text or "").lower()
    for art, worte in ART_MUSTER:
        if any(w in t for w in worte):
            return art
    return "sonstige"


def uid_normieren(roh):
    """'CHE-113.766.916' oder 'CHE113766916' -> 'CHE-113.766.916'."""
    if not roh:
        return None
    z = re.sub(r"\D", "", str(roh))
    if len(z) != 9:
        return None
    return "CHE-%s.%s.%s" % (z[0:3], z[3:6], z[6:9])


def uid_gueltig(uid):
    """Prüfziffer der Schweizer UID (Modulo 11).

    Die letzte Ziffer ist eine Prüfziffer. Eine UID, die sie nicht erfüllt,
    ist ein Tippfehler oder eine falsch ausgelesene Stelle aus einem PDF —
    und darf nicht in die Datenbank, wo sie als Schlüssel dient.
    """
    if not uid:
        return False
    z = [int(c) for c in uid if c.isdigit()]
    if len(z) != 9:
        return False
    gewicht = [5, 4, 3, 2, 7, 6, 5, 4]
    rest = sum(a * b for a, b in zip(z[:8], gewicht)) % 11
    if rest == 0:
        pruef = 0
    elif rest == 1:
        return False          # Prüfziffer wäre 10 — gibt es nicht
    else:
        pruef = 11 - rest
    return pruef == z[8]


def datum_normieren(roh):
    """Verschiedene Schreibweisen auf 'YYYY-MM-DD'. None, wenn unlesbar.

    Schweizer Quellen schreiben 31.12.2025, Schnittstellen liefern
    2025-12-31. Ungemischt lässt sich nicht sortieren und kein Zeitraum
    bilden — derselbe Fallstrick wie schon beim Atlas-Feed.
    """
    if not roh:
        return None
    s = str(roh).strip()[:32]
    m = re.match(r"^(\d{4})-(\d{2})-(\d{2})", s)
    if m:
        return "%s-%s-%s" % m.groups()
    m = re.match(r"^(\d{1,2})[.\-/](\d{1,2})[.\-/](\d{4})", s)
    if m:
        t, mo, j = m.groups()
        return "%s-%02d-%02d" % (j, int(mo), int(t))
    return None


def kanton_erkennen(ort, kanton_roh=None):
    """Kantonskürzel bestimmen. Ausgeschrieben oder aus '(SG)' im Ort."""
    if kanton_roh:
        k = str(kanton_roh).strip().upper()
        if k in ALLE_KANTONE:
            return k
        for kuerzel, name in ALLE_KANTONE.items():
            if name.lower() == str(kanton_roh).strip().lower():
                return kuerzel
    t = str(ort or "")
    m = re.search(r"\(([A-Z]{2})\)", t)
    if m and m.group(1) in ALLE_KANTONE:
        return m.group(1)
    m = re.search(r",\s*([A-Z]{2})\s*$", t)
    if m and m.group(1) in ALLE_KANTONE:
        return m.group(1)
    return None


def ort_saeubern(ort):
    """'Andwil (SG)' -> 'Andwil'. Der Kanton steht in einem eigenen Feld."""
    t = str(ort or "").strip()
    t = re.sub(r"\s*\([A-Z]{2}\)\s*$", "", t)
    t = re.sub(r",\s*[A-Z]{2}\s*$", "", t)
    return t.strip(" ,")


def firmenname_schluessel(name):
    """Vergleichsform eines Firmennamens für die Duplikaterkennung.

    'Müller Bau AG', 'Mueller Bau AG' und 'MÜLLER BAU  AG' sind dieselbe
    Firma. Rechtsform und Satzzeichen fallen weg, Umlaute werden aufgelöst.
    """
    t = str(name or "").lower()
    # Umlaute ZUERST deutsch umschreiben. Ueber NFKD allein wird aus "ü"
    # ein "u", aus der Schreibweise "ue" aber "ue" — und dann passen
    # "Müller Bau" und "Mueller Bau" nicht mehr zusammen.
    for a, b in (("ä", "ae"), ("ö", "oe"), ("ü", "ue"), ("ß", "ss")):
        t = t.replace(a, b)
    t = unicodedata.normalize("NFKD", t)
    t = "".join(c for c in t if not unicodedata.combining(c))
    t = re.sub(r"\b(ag|gmbh|sa|sarl|sagl|kg|kollektivgesellschaft|"
               r"einzelfirma|in liquidation|in liq|genossenschaft|"
               r"stiftung|verein)\b", " ", t)
    t = re.sub(r"[^a-z0-9]+", " ", t)
    return " ".join(t.split())


def fall_id(uid, name, art, datum):
    """Stabile Kennung eines Falls.

    hashlib, nicht hash(): das eingebaute hash() ist pro Prozess zufällig
    gesalzen, und nach jedem Neustart wäre derselbe Fall ein neuer. Genau
    dieser Fehler ist im Atlas-Feed schon einmal passiert.
    """
    roh = "|".join([uid or firmenname_schluessel(name), art or "",
                    datum or ""])
    return hashlib.sha256(roh.encode("utf-8")).hexdigest()[:20]


def firmenalter(gruendung, stichtag=None):
    """Alter in Jahren, oder None wenn das Gründungsdatum fehlt."""
    g = datum_normieren(gruendung)
    if not g:
        return None
    try:
        gd = datetime.date.fromisoformat(g)
    except ValueError:
        return None
    heute = stichtag or datetime.date.today()
    jahre = heute.year - gd.year
    if (heute.month, heute.day) < (gd.month, gd.day):
        jahre -= 1
    return max(0, jahre)


STATUS_WERTE = ["Neu", "Aktualisiert", "Kontakt empfohlen",
                "Inventarliste angefragt", "Besichtigung", "Beobachten",
                "Verworfen"]


def fall_bauen(roh, stichtag=None):
    """Aus einem rohen Datensatz einen normalisierten Fall machen.

    `roh` ist ein dict mit beliebiger Herkunft (CSV, JSON, Schnittstelle).
    Fehlende Felder bleiben None — nichts wird geraten. Das Feld `fehler`
    sammelt, was beim Einlesen nicht gestimmt hat, statt still zu scheitern.
    """
    fehler = []
    name = (roh.get("firma") or roh.get("name") or "").strip()
    if not name:
        fehler.append("Firmenname fehlt")

    uid = uid_normieren(roh.get("uid"))
    if roh.get("uid") and not uid:
        fehler.append("UID nicht lesbar: %r" % roh.get("uid"))
    elif uid and not uid_gueltig(uid):
        fehler.append("UID-Prüfziffer falsch: %s" % uid)
        uid = None

    ort_roh = roh.get("ort") or roh.get("sitz") or ""
    kanton = kanton_erkennen(ort_roh, roh.get("kanton"))
    publiziert = datum_normieren(roh.get("publikationsdatum")
                                 or roh.get("datum"))
    if roh.get("publikationsdatum") and not publiziert:
        fehler.append("Publikationsdatum nicht lesbar")

    text = " ".join(str(roh.get(k) or "") for k in
                    ("meldungsart", "titel", "text", "inhalt", "zweck"))
    art = roh.get("art") if roh.get("art") in MELDUNGSARTEN else art_erkennen(text)

    return {
        "id": fall_id(uid, name, art, publiziert),
        "firma": name,
        "uid": uid,
        "ort": ort_saeubern(ort_roh),
        "kanton": kanton,
        "publikationsdatum": publiziert,
        "konkursdatum": datum_normieren(roh.get("konkursdatum")),
        "art": art,
        "art_text": MELDUNGSARTEN.get(art, art),
        "zweck": (roh.get("zweck") or "").strip(),
        "gruendung": datum_normieren(roh.get("gruendung")),
        "alter": firmenalter(roh.get("gruendung"), stichtag),
        "konkursamt": (roh.get("konkursamt") or "").strip() or None,
        "aktenzeichen": (roh.get("aktenzeichen")
                         or roh.get("meldungsnummer") or "").strip() or None,
        "quelle_url": (roh.get("quelle_url") or roh.get("url") or "").strip()
                      or None,
        "quelle": (roh.get("quelle") or "Import").strip(),
        "rohtext": (roh.get("text") or roh.get("inhalt") or "").strip()[:4000],
        "fehler": fehler,
    }
