#!/usr/bin/env python3
"""Konkurs Deal Radar — Routen und Export.

Wird von serve.py unter /radar/ eingehängt. Ein eigener Serverprozess wäre
auf dem geteilten Droplet ein zweiter Port, ein zweiter Dienst und eine
Proxy-Regel — für nichts. So genügt ein git pull und ein Neustart.
"""
import csv
import io
import json
import os
import re
import zipfile

from . import bewertung, kette, modell
from .bewertung import SCHWELLE
from .quellen.dateien import CsvQuelle, JsonQuelle, PdfQuelle
from .quellen.amtsblatt import AmtsblattQuelle
from .quellen.shab import ShabQuelle
from .speicher import Speicher

BASE = os.path.dirname(os.path.abspath(__file__))
DB_PFAD = os.path.join(BASE, "daten", "radar.db")
CFG_PFAD = os.path.join(BASE, "config.json")

STANDARD_CFG = {
    "kantone": ["ZH", "AG", "ZG", "SZ", "SG", "LU"],
    "min_score": SCHWELLE,
    # Löschfrist für Fälle. Konkursmeldungen über Einzelfirmen enthalten
    # Personendaten; eine unbegrenzte Historie wäre nach DSG nicht in
    # Ordnung. 0 = keine Löschung (dann bewusst entscheiden).
    "loeschfrist_tage": 730,
    "amtsblatt": {
        "aktiv": True,
        "auto": True,
        "intervall_stunden": 12,
    },
    "shab": {
        "aktiv": False,
        "verifiziert": False,
        "basis_url": "",
        "kopfzeilen": {},
        "rubriken": [],
        "kantone": ["ZH", "AG", "ZG", "SZ", "SG", "LU"],
    },
}

_speicher = None
_cfg = None


def cfg():
    global _cfg
    if _cfg is None:
        _cfg = dict(STANDARD_CFG)
        if os.path.exists(CFG_PFAD):
            try:
                with open(CFG_PFAD) as f:
                    _cfg.update(json.load(f))
            except ValueError as e:
                print("radar: config.json ist kein gültiges JSON: %s" % e)
    return _cfg


def speicher():
    global _speicher
    if _speicher is None:
        _speicher = Speicher(DB_PFAD)
    return _speicher


# ---------------------------------------------------------------------------
# Export
# ---------------------------------------------------------------------------

SPALTEN = [
    ("firma", "Firma"), ("ort", "Ort"), ("kanton", "Kanton"),
    ("branche", "Branche"), ("publikationsdatum", "Publikationsdatum"),
    ("art_text", "Meldungsart"), ("assets_text", "Vermutete Assets"),
    ("score", "Deal Score"), ("begruendung_text", "Score-Begründung"),
    ("konkursamt", "Konkursamt"), ("quelle_url", "Quelle"),
    ("status", "Status"), ("uid", "UID"), ("alter_jahre", "Alter"),
    ("naechster_schritt", "Nächster Schritt"),
]


def _zeile_fuer_export(f):
    assets = kette._liste(f.get("assets"))
    zeilen = kette._liste(f.get("begruendung"))
    d = dict(f)
    d["assets_text"] = ", ".join(assets)
    d["begruendung_text"] = " · ".join(
        "%+d %s" % (z["punkte"], z["grund"]) for z in zeilen if z["punkte"])
    return [("" if d.get(k) is None else d.get(k)) for k, _ in SPALTEN]


def export_csv(faelle):
    p = io.StringIO()
    s = csv.writer(p, delimiter=";")
    s.writerow([t for _, t in SPALTEN])
    for f in faelle:
        s.writerow(_zeile_fuer_export(f))
    # BOM, damit Excel auf Deutsch die Umlaute richtig liest.
    return ("﻿" + p.getvalue()).encode("utf-8")


def _xml_escape(t):
    return (str(t).replace("&", "&amp;").replace("<", "&lt;")
            .replace(">", "&gt;"))


def export_xlsx(faelle):
    """XLSX ohne Fremdbibliothek.

    Eine xlsx-Datei ist ein ZIP mit ein paar XML-Dateien. Das von Hand zu
    schreiben ist überschaubar und spart openpyxl — auf einem Server, auf
    dem nichts installiert werden soll, ist das den Aufwand wert.
    Alles wird als Text geschrieben; Excel darf selber erkennen.
    """
    def zelle(spalte, zeile, wert):
        ref = "%s%d" % (_spaltenname(spalte), zeile)
        return ('<c r="%s" t="inlineStr"><is><t xml:space="preserve">%s</t>'
                '</is></c>' % (ref, _xml_escape(wert)))

    zeilen = [[t for _, t in SPALTEN]]
    for f in faelle:
        zeilen.append(_zeile_fuer_export(f))

    xml = ['<?xml version="1.0" encoding="UTF-8"?>',
           '<worksheet xmlns="http://schemas.openxmlformats.org/'
           'spreadsheetml/2006/main"><sheetData>']
    for i, z in enumerate(zeilen, start=1):
        xml.append('<row r="%d">' % i)
        for j, w in enumerate(z):
            xml.append(zelle(j, i, w))
        xml.append("</row>")
    xml.append("</sheetData></worksheet>")

    puffer = io.BytesIO()
    with zipfile.ZipFile(puffer, "w", zipfile.ZIP_DEFLATED) as z:
        z.writestr("[Content_Types].xml",
                   '<?xml version="1.0" encoding="UTF-8"?>'
                   '<Types xmlns="http://schemas.openxmlformats.org/'
                   'package/2006/content-types">'
                   '<Default Extension="rels" ContentType="application/'
                   'vnd.openxmlformats-package.relationships+xml"/>'
                   '<Default Extension="xml" ContentType="application/xml"/>'
                   '<Override PartName="/xl/workbook.xml" ContentType='
                   '"application/vnd.openxmlformats-officedocument.'
                   'spreadsheetml.sheet.main+xml"/>'
                   '<Override PartName="/xl/worksheets/sheet1.xml" '
                   'ContentType="application/vnd.openxmlformats-officedocument.'
                   'spreadsheetml.worksheet+xml"/></Types>')
        z.writestr("_rels/.rels",
                   '<?xml version="1.0" encoding="UTF-8"?>'
                   '<Relationships xmlns="http://schemas.openxmlformats.org/'
                   'package/2006/relationships"><Relationship Id="rId1" '
                   'Type="http://schemas.openxmlformats.org/officeDocument/'
                   '2006/relationships/officeDocument" Target="xl/workbook.xml"'
                   '/></Relationships>')
        z.writestr("xl/workbook.xml",
                   '<?xml version="1.0" encoding="UTF-8"?>'
                   '<workbook xmlns="http://schemas.openxmlformats.org/'
                   'spreadsheetml/2006/main" xmlns:r="http://schemas.'
                   'openxmlformats.org/officeDocument/2006/relationships">'
                   '<sheets><sheet name="Deals" sheetId="1" r:id="rId1"/>'
                   '</sheets></workbook>')
        z.writestr("xl/_rels/workbook.xml.rels",
                   '<?xml version="1.0" encoding="UTF-8"?>'
                   '<Relationships xmlns="http://schemas.openxmlformats.org/'
                   'package/2006/relationships"><Relationship Id="rId1" '
                   'Type="http://schemas.openxmlformats.org/officeDocument/'
                   '2006/relationships/worksheet" '
                   'Target="worksheets/sheet1.xml"/></Relationships>')
        z.writestr("xl/worksheets/sheet1.xml", "".join(xml))
    return puffer.getvalue()


def _spaltenname(i):
    name = ""
    i += 1
    while i:
        i, rest = divmod(i - 1, 26)
        name = chr(65 + rest) + name
    return name


# ---------------------------------------------------------------------------
# Routen
# ---------------------------------------------------------------------------

def _json_antwort(obj, code=200):
    return code, "application/json; charset=utf-8", \
        json.dumps(obj, ensure_ascii=False).encode("utf-8")


def behandle_get(pfad, query):
    """Gibt (code, content_type, koerper) oder None, wenn nicht zuständig."""
    sp = speicher()

    if pfad in ("", "/"):
        with open(os.path.join(BASE, "static", "index.html"), "rb") as f:
            return 200, "text/html; charset=utf-8", f.read()

    if pfad == "/api/faelle":
        kantone = [k for k in (query.get("kanton") or [""])[0].split(",") if k]
        ms = (query.get("min_score") or ["0"])[0]
        faelle = sp.suchen(
            kantone=kantone or None,
            min_score=int(ms) if ms.isdigit() else 0,
            branche=(query.get("branche") or [None])[0] or None,
            status=(query.get("status") or [None])[0] or None)
        for f in faelle:
            f["assets"] = json.loads(f.get("assets") or "[]")
            f["begruendung"] = json.loads(f.get("begruendung") or "[]")
            f["einschraenkungen"] = json.loads(f.get("einschraenkungen") or "[]")
        return _json_antwort({"faelle": faelle, "zahlen": sp.zahlen(),
                              "schwelle": bewertung.SCHWELLE,
                              "kantone": modell.KANTONE,
                              "status_werte": modell.STATUS_WERTE})

    if pfad == "/api/zustand":
        amt = AmtsblattQuelle(cfg().get("amtsblatt"))
        amt_ok, amt_grund = amt.verfuegbar()
        shab = ShabQuelle(cfg().get("shab"))
        ok, grund = shab.verfuegbar()
        pdf_ok, pdf_grund = PdfQuelle(b"").verfuegbar()
        return _json_antwort({
            "quellen": [
                {"name": "CSV-Import", "bereit": True, "hinweis": ""},
                {"name": "JSON-Import", "bereit": True, "hinweis": ""},
                {"name": "PDF-Import", "bereit": pdf_ok, "hinweis": pdf_grund},
                {"name": "Amtsblattportal", "bereit": amt_ok,
                 "hinweis": amt_grund or amt.zugang_hinweis},
                {"name": "SHAB (alt)", "bereit": ok, "hinweis": grund,
                 "verifiziert": shab.verifiziert},
            ],
            "auto": bool((cfg().get("amtsblatt") or {}).get("auto")),
            "letzter_lauf": sp.letzter_lauf(),
            "laeufe": sp.laeufe(8),
            "zahlen": sp.zahlen(),
        })

    if pfad == "/api/meldung":
        text, ids = kette.tagesmeldung(sp, cfg().get("kantone"),
                                       cfg().get("min_score"))
        return _json_antwort({"text": text, "anzahl": len(ids), "ids": ids})

    if pfad in ("/export.csv", "/export.xlsx"):
        kantone = [k for k in (query.get("kanton") or [""])[0].split(",") if k]
        ms = (query.get("min_score") or ["0"])[0]
        faelle = sp.suchen(kantone=kantone or None,
                           min_score=int(ms) if ms.isdigit() else 0,
                           limit=5000)
        if pfad.endswith(".csv"):
            return 200, "text/csv; charset=utf-8", export_csv(faelle)
        return (200, "application/vnd.openxmlformats-officedocument."
                "spreadsheetml.sheet", export_xlsx(faelle))

    m = re.match(r"^/api/fall/([a-f0-9]{6,40})$", pfad)
    if m:
        f = sp.holen(m.group(1))
        if not f:
            return _json_antwort({"fehler": "Nicht gefunden"}, 404)
        f["assets"] = json.loads(f.get("assets") or "[]")
        f["begruendung"] = json.loads(f.get("begruendung") or "[]")
        f["einschraenkungen"] = json.loads(f.get("einschraenkungen") or "[]")
        f["verwandte"] = sp.verwandte(f["firma_schluessel"], f["id"])
        f["meldung"] = kette.meldung_bauen(f)
        return _json_antwort(f)

    return None


def behandle_post(pfad, koerper, content_type, dateiname=None):
    sp = speicher()

    if pfad == "/api/import":
        quelle = _quelle_waehlen(koerper, dateiname)
        if quelle is None:
            return _json_antwort(
                {"fehler": "Format nicht erkannt. CSV, JSON oder PDF."}, 400)
        ok, grund = quelle.verfuegbar()
        if not ok:
            return _json_antwort({"fehler": grund}, 400)
        lauf = sp.lauf_beginnen(quelle.name)
        try:
            roh = quelle.holen()
        except Exception as e:
            sp.lauf_beenden(lauf, 0, 0, 0, 0, "%s: %s" % (type(e).__name__, e))
            return _json_antwort({"fehler": "%s: %s" % (type(e).__name__, e)}, 400)
        bericht = kette.verarbeiten(roh, sp)
        sp.lauf_beenden(lauf, bericht["gelesen"], bericht["neu"],
                        bericht["aktualisiert"], bericht["verworfen"])
        return _json_antwort(bericht)

    if pfad == "/api/abrufen":
        d = json.loads(koerper or b"{}")
        return _json_antwort(abrufen(d.get("tage")))

    if pfad == "/api/zweck":
        return _json_antwort(zweck_nachtragen())

    if pfad == "/api/status":
        d = json.loads(koerper or b"{}")
        if d.get("status") not in modell.STATUS_WERTE:
            return _json_antwort({"fehler": "Unbekannter Status"}, 400)
        sp.status_setzen(d.get("id"), d["status"], d.get("notiz"))
        return _json_antwort({"ok": True})

    if pfad == "/api/gemeldet":
        d = json.loads(koerper or b"{}")
        sp.als_gemeldet_markieren(d.get("ids") or [])
        return _json_antwort({"ok": True})

    return None


def _zeitraum(sp, quelle, tage=None):
    """Ab welchem Datum geholt wird. Gibt "JJJJ-MM-TT" zurück.

    `tage` gewinnt immer: wer ausdrücklich 90 Tage will, bekommt 90 Tage,
    egal was die Marke sagt. Sonst die Marke des letzten Laufs, der etwas
    gelesen hat, minus Überlappung. Gibt es keinen solchen Lauf, wird der
    Erstlauf-Zeitraum genommen.
    """
    import datetime
    c = cfg().get("amtsblatt") or {}
    heute = datetime.date.today()
    if tage:
        return (heute - datetime.timedelta(days=int(tage))).isoformat()

    ueberlappung = int(c.get("ueberlappung_tage", 3))
    erstlauf = int(c.get("erstlauf_tage", 30))
    marke = sp.letzter_lauf_mit_daten(quelle)
    if not marke:
        return (heute - datetime.timedelta(days=erstlauf)).isoformat()
    try:
        d = datetime.date.fromisoformat((marke.get("beendet") or "")[:10])
    except ValueError:
        return (heute - datetime.timedelta(days=erstlauf)).isoformat()
    return (d - datetime.timedelta(days=ueberlappung)).isoformat()


def abrufen(tage=None):
    """Einen Abruf beim Amtsblattportal ausführen.

    Gibt IMMER zurück, was passiert ist — auch und gerade im Fehlerfall.
    Ein Abruf, der still nichts liefert, ist von einem, bei dem es nichts
    zu holen gab, nicht zu unterscheiden.

    WELCHER ZEITRAUM — hier steckte ein Fehler
    ------------------------------------------
    Bisher begann jeder Abruf beim Datum des letzten erfolgreichen Laufs.
    Klingt richtig, hatte aber zwei Haken:

    1. Auch ein Lauf, der NICHTS gelesen hat, galt als erfolgreich und
       setzte die Marke auf heute. Als der Adapter noch kaputt war, lief
       er einmal durch, las null — und schob die Marke vor. Damit lagen
       die 14 Tage davor für immer hinter der Marke und wurden nie mehr
       geholt.
    2. Ohne Überlappung geht alles verloren, was zwischen zwei Läufen
       nachgetragen oder korrigiert wird.

    Deshalb jetzt: die Marke ist der letzte Lauf, der **wirklich etwas
    gelesen hat**, minus einer Überlappung (Vorgabe drei Tage).
    `tage` übergeht das und holt ausdrücklich so weit zurück — das ist
    der Weg, um Vergangenes nachzuholen.
    """
    sp = speicher()
    q = AmtsblattQuelle(cfg().get("amtsblatt"))
    ok, grund = q.verfuegbar()
    if not ok:
        return {"fehler": grund}
    seit = _zeitraum(sp, q.name, tage)
    lauf = sp.lauf_beginnen(q.name)
    try:
        roh = q.holen(seit)
    except Exception as e:
        text = "%s: %s" % (type(e).__name__, e)
        sp.lauf_beenden(lauf, 0, 0, 0, 0, text)
        return {"fehler": text, "protokoll": q.protokoll}
    bericht = kette.verarbeiten(roh, sp)
    # Die letzte Protokollzeile nennt Sätze, übersprungene Personen und
    # fehlgeschlagene Details. Sie wird mitgespeichert, damit „0 gelesen"
    # in der Fusszeile einen Grund hat.
    bemerkung = q.protokoll[-1] if q.protokoll else None
    sp.lauf_beenden(lauf, bericht["gelesen"], bericht["neu"],
                    bericht["aktualisiert"], bericht["verworfen"],
                    bemerkung=bemerkung)
    bericht["protokoll"] = q.protokoll
    bericht["bemerkung"] = bemerkung
    bericht["seit"] = seit
    aufraeumen()
    return bericht


def zweck_nachtragen(grenze=200):
    """Bestehenden Fällen den Zweckartikel nachtragen und neu bewerten.

    Gebraucht wird das, weil die Zwecksuche später dazukam als die ersten
    Läufe. Ohne Nachtragen müsste man die Datenbank wegwerfen, um an
    brauchbare Scores zu kommen — und damit auch jeden Status, jede Notiz
    und jede bereits geleistete Arbeit. Das ist es nicht wert.

    Bewertet wird anschliessend neu, sonst bliebe der alte Score stehen
    und der neue Zweck wäre ohne Wirkung.
    """
    sp = speicher()
    q = AmtsblattQuelle(cfg().get("amtsblatt"))
    ok, grund = q.verfuegbar()
    if not ok:
        return {"fehler": grund}

    offen = [f for f in sp.suchen(min_score=0, limit=grenze)
             if f.get("uid") and not (f.get("zweck") or "").strip()]
    gefunden, versucht = 0, 0
    for fall in offen:
        versucht += 1
        try:
            zweck = q._zweck_zu_uid(fall["uid"])
        except Exception:
            continue
        if not zweck:
            continue
        gefunden += 1
        sp.zweck_setzen(fall["id"], zweck)
        neu = kette.neu_bewerten(sp.holen(fall["id"]))
        sp.bewertung_setzen(fall["id"], neu)
    return {"geprueft": versucht, "ergaenzt": gefunden,
            "ohne_uid_oder_schon_da": sp.zahlen()["gesamt"] - versucht,
            "parameter": q.uid_parameter}


def aufraeumen():
    """Alte Fälle löschen.

    Konkursmeldungen über Einzelfirmen sind Personendaten. Eine Sammlung,
    die nie vergisst, ist etwas anderes als ein Arbeitsvorrat — deshalb
    eine Frist, und zwar eingebaut statt als Vorsatz in der README.
    Fälle, an denen gearbeitet wurde, bleiben.
    """
    tage = int(cfg().get("loeschfrist_tage") or 0)
    if tage <= 0:
        return 0
    return speicher().aufraeumen(tage)


def auto_schleife():
    """Hintergrundlauf: holt regelmässig neue Publikationen.

    Läuft nur, wenn in der Konfiguration ausdrücklich eingeschaltet. Der
    erste Abruf kommt kurz nach dem Start, nicht sofort — der Server soll
    erst hochkommen.

    Ein Fehler beendet die Schleife NICHT: eine Quelle, die heute nicht
    antwortet, antwortet morgen vielleicht. Der Fehler steht im
    Laufprotokoll und in der Oberfläche.
    """
    import threading
    import time as _t

    c = cfg().get("amtsblatt") or {}
    if not (c.get("aktiv") and c.get("auto")):
        return None
    stunden = float(c.get("intervall_stunden", 12))

    def lauf():
        _t.sleep(20)
        while True:
            try:
                b = abrufen()
                if b.get("fehler"):
                    print("radar: Abruf fehlgeschlagen — " + str(b["fehler"]))
                else:
                    print("radar: %d gelesen, %d neu"
                          % (b.get("gelesen", 0), b.get("neu", 0)))
            except Exception as e:                      # pragma: no cover
                print("radar: Abrufschleife — %s: %s" % (type(e).__name__, e))
            _t.sleep(stunden * 3600)

    t = threading.Thread(target=lauf, daemon=True, name="radar-abruf")
    t.start()
    return t


def _quelle_waehlen(koerper, dateiname):
    name = (dateiname or "").lower()
    probe = koerper[:512].lstrip() if koerper else b""
    if name.endswith(".pdf") or probe.startswith(b"%PDF"):
        return PdfQuelle(koerper, dateiname or "import.pdf")
    if name.endswith(".json") or probe[:1] in (b"{", b"["):
        return JsonQuelle(koerper, dateiname or "import.json")
    if name.endswith(".csv") or b";" in probe or b"," in probe:
        return CsvQuelle(koerper, dateiname or "import.csv")
    return None
