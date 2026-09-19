#!/usr/bin/env python3
"""Import aus Dateien: CSV, JSON und PDF.

Das ist der Weg, der HEUTE und ohne jeden Zugang funktioniert. Wer eine
Trefferliste aus dem SHAB-Suchformular exportiert oder ein Amtsblatt als
PDF herunterlädt, bekommt sie hier ausgewertet.

Die Spaltennamen sind absichtlich grosszügig: Quellen nennen dasselbe Feld
mal `Firma`, mal `Firmenname`, mal `company`. Wer beim Import an Benennung
scheitert, benutzt das Werkzeug nicht.
"""
import csv
import io
import json
import re

from .basis import Quelle

# Spaltenname (kleingeschrieben, ohne Sonderzeichen) -> internes Feld
SPALTEN = {
    "firma": "firma", "firmenname": "firma", "name": "firma",
    "company": "firma", "gesellschaft": "firma", "schuldner": "firma",
    "uid": "uid", "uidnummer": "uid", "chenummer": "uid", "che": "uid",
    "ort": "ort", "sitz": "ort", "domizil": "ort", "gemeinde": "ort",
    "kanton": "kanton", "canton": "kanton",
    "publikationsdatum": "publikationsdatum", "datum": "publikationsdatum",
    "publiziert": "publikationsdatum", "publikation": "publikationsdatum",
    "sogcdate": "publikationsdatum",
    "konkursdatum": "konkursdatum", "konkurseroeffnung": "konkursdatum",
    "art": "art", "meldungsart": "meldungsart", "rubrik": "meldungsart",
    "titel": "titel", "subrubrik": "meldungsart",
    "zweck": "zweck", "geschaeftszweck": "zweck", "purpose": "zweck",
    "taetigkeit": "zweck", "branche": "zweck",
    "gruendung": "gruendung", "gruendungsdatum": "gruendung",
    "eintragungsdatum": "gruendung",
    "konkursamt": "konkursamt", "amt": "konkursamt",
    "konkursverwaltung": "konkursamt",
    "aktenzeichen": "aktenzeichen", "meldungsnummer": "aktenzeichen",
    "publikationsnummer": "aktenzeichen", "id": "aktenzeichen",
    "url": "quelle_url", "quelle": "quelle_url", "link": "quelle_url",
    "text": "text", "inhalt": "text", "meldungstext": "text",
    "beschreibung": "text",
}


def _spalte(name):
    k = re.sub(r"[^a-z0-9]", "", str(name or "").lower()
               .replace("ä", "ae").replace("ö", "oe").replace("ü", "ue"))
    return SPALTEN.get(k)


def _zeile_umlegen(zeile):
    """Beliebige Spaltennamen auf die internen Feldnamen abbilden."""
    raus = {}
    for k, v in zeile.items():
        feld = _spalte(k)
        if feld and v not in (None, ""):
            # Mehrere Quellspalten auf dasselbe Feld: die erste gewinnt,
            # weitere werden angehängt statt überschrieben.
            if feld in raus and feld == "text":
                raus[feld] += "\n" + str(v)
            elif feld not in raus:
                raus[feld] = str(v).strip()
    return raus


class CsvQuelle(Quelle):
    name = "CSV-Import"

    def __init__(self, inhalt, dateiname="import.csv"):
        self.inhalt = inhalt
        self.dateiname = dateiname

    def holen(self, seit=None):
        text = self.inhalt
        if isinstance(text, bytes):
            # BOM aus Excel-Exporten wegnehmen, sonst heisst die erste
            # Spalte "﻿Firma" und wird nicht erkannt.
            text = text.decode("utf-8-sig", "replace")
        # Trennzeichen erraten: Schweizer Excel-Exporte nutzen oft Semikolon.
        probe = text[:4000]
        trenner = ";" if probe.count(";") > probe.count(",") else ","
        leser = csv.DictReader(io.StringIO(text), delimiter=trenner)
        raus = []
        for zeile in leser:
            d = _zeile_umlegen(zeile)
            if d.get("firma"):
                d["quelle"] = "%s (%s)" % (self.name, self.dateiname)
                raus.append(d)
        return raus


class JsonQuelle(Quelle):
    name = "JSON-Import"

    def __init__(self, inhalt, dateiname="import.json"):
        self.inhalt = inhalt
        self.dateiname = dateiname

    def holen(self, seit=None):
        text = self.inhalt
        if isinstance(text, bytes):
            text = text.decode("utf-8-sig", "replace")
        daten = json.loads(text)
        # Sowohl [ {...} ] als auch { "content": [ {...} ] } zulassen —
        # Schnittstellen verpacken ihre Listen gern.
        if isinstance(daten, dict):
            for schluessel in ("content", "items", "results", "publications",
                               "data", "faelle"):
                if isinstance(daten.get(schluessel), list):
                    daten = daten[schluessel]
                    break
            else:
                daten = [daten]
        raus = []
        for eintrag in daten:
            if not isinstance(eintrag, dict):
                continue
            flach = _flach(eintrag)
            d = _zeile_umlegen(flach)
            if d.get("firma"):
                d["quelle"] = "%s (%s)" % (self.name, self.dateiname)
                raus.append(d)
        return raus


def _flach(d, praefix=""):
    """Verschachteltes JSON flach machen: {'a':{'b':1}} -> {'b':1}.

    Schnittstellen verschachteln Firmendaten gern zwei Ebenen tief. Die
    Spaltenzuordnung arbeitet auf Namen, nicht auf Pfaden — also flach
    machen und den letzten Namensteil verwenden.
    """
    raus = {}
    for k, v in d.items():
        if isinstance(v, dict):
            raus.update(_flach(v, k))
        elif isinstance(v, list):
            teile = [str(x) for x in v if not isinstance(x, (dict, list))]
            if teile:
                raus[k] = ", ".join(teile)
        elif v is not None:
            raus[k] = v
    return raus


class PdfQuelle(Quelle):
    """Amtsblatt-PDF auswerten.

    EHRLICH ZUR VERLÄSSLICHKEIT: Ein PDF hat keine Struktur, nur Text in
    einer Reihenfolge, die nicht der optischen entsprechen muss. Was hier
    herauskommt, ist eine Leseheuristik und braucht eine Sichtkontrolle.
    Wo ein Feld nicht sicher erkennbar ist, bleibt es leer, statt geraten
    zu werden.

    Braucht `pypdf`. Fehlt es, sagt der Adapter das, statt zu scheitern.
    """

    name = "PDF-Import"
    braucht_zugang = False
    zugang_hinweis = "Benötigt die Bibliothek pypdf:  pip install pypdf"

    def __init__(self, inhalt, dateiname="amtsblatt.pdf"):
        self.inhalt = inhalt
        self.dateiname = dateiname

    def verfuegbar(self):
        try:
            import pypdf         # noqa: F401
            return True, ""
        except ImportError:
            return False, self.zugang_hinweis

    def holen(self, seit=None):
        ok, grund = self.verfuegbar()
        if not ok:
            raise RuntimeError(grund)
        import io as _io
        from pypdf import PdfReader
        leser = PdfReader(_io.BytesIO(self.inhalt))
        text = "\n".join((s.extract_text() or "") for s in leser.pages)
        return self.aus_text(text)

    def aus_text(self, text):
        """Meldungsblöcke aus freiem Text lesen.

        Getrennt von holen(), damit es ohne pypdf testbar ist.
        """
        raus = []
        # An Leerzeilen trennen. NICHT zusätzlich vor jeder UID trennen:
        # dann landet der Firmenname im vorigen Block und der Rest hat
        # keinen mehr. Liefert die Leerzeilen-Trennung nichts Brauchbares,
        # wird ersatzweise vor jeder Zeile mit Rechtsform getrennt.
        bloecke = re.split(r"\n\s*\n", text)
        if len(bloecke) < 2 and len(text) > 200:
            bloecke = re.split(
                r"\n(?=[A-ZÄÖÜ][^\n]{2,60}\b(?:AG|GmbH|SA|Sàrl|Sagl)\b)",
                text)
        for b in bloecke:
            b = b.strip()
            if len(b) < 40:
                continue
            uid = re.search(r"CHE-?\d{3}[.\s]?\d{3}[.\s]?\d{3}", b)
            # Firmenname: die erste Zeile, die eine Rechtsform enthält.
            firma = None
            for zeile in b.split("\n"):
                if re.search(r"\b(AG|GmbH|SA|Sàrl|Sagl|Genossenschaft)\b",
                             zeile):
                    firma = zeile.strip(" .,;:")
                    break
            if not firma:
                continue
            ort = re.search(r"\b(?:in|Sitz(?:\s+in)?:?)\s+([A-ZÄÖÜ][\w.\- ]{2,30})"
                            r"(?:\s*\(([A-Z]{2})\))?", b)
            datum = re.search(r"\b(\d{1,2}\.\d{1,2}\.\d{4})\b", b)
            amt = re.search(r"(Konkursamt[^\n.,;]{0,60}|"
                            r"Konkursverwaltung[^\n.,;]{0,60})", b)
            raus.append({
                "firma": firma,
                "uid": uid.group(0) if uid else None,
                "ort": (ort.group(1).strip() if ort else None),
                "kanton": (ort.group(2) if ort and ort.group(2) else None),
                "publikationsdatum": datum.group(1) if datum else None,
                "konkursamt": amt.group(1).strip() if amt else None,
                "text": b[:2000],
                "quelle": "%s (%s)" % (self.name, self.dateiname),
            })
        return raus
