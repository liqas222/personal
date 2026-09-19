#!/usr/bin/env python3
"""Amtsblattportal — die amtliche Schnittstelle für SHAB und Kantonsblätter.

WAS DAS IST
-----------
`amtsblattportal.ch` ist das gemeinsame Portal, über das das Schweizerische
Handelsamtsblatt (SHAB) und die angeschlossenen kantonalen Amtsblätter
veröffentlicht werden. Es hat eine offene REST-Schnittstelle:

    https://amtsblattportal.ch/api/v1/publications          Liste
    https://amtsblattportal.ch/api/v1/publications/{id}/xml  Volltext
    https://amtsblattportal.ch/api/v1/publications/{id}/pdf  PDF
    https://amtsblattportal.ch/api/v1/rubrics                Rubrikliste

Damit sind die Quellen 1 (SHAB) und 2 (kantonale Amtsblätter) in einer
Schnittstelle abgedeckt — strukturiert, kein HTML-Scraping.

STAND DER PRÜFUNG — BITTE LESEN
-------------------------------
Adresse, Parameter und Rubrikcodes stammen aus öffentlicher Dokumentation
und aus quelloffenen Projekten, die diese Schnittstelle benutzen. Sie sind
NICHT von mir ausprobiert worden: in der Umgebung, in der dieser Code
entstand, ist amtsblattportal.ch von der Netzrichtlinie gesperrt.

Das ist ein Unterschied zu „ausgedacht", aber kein Ersatz für einen echten
Lauf. Deshalb:

* Der Adapter läuft beim ersten Start einfach los und schreibt genau auf,
  was passiert ist — Statuscode, Anzahl, Fehlertext. Ein Flag, das ich
  selbst auf „geprüft" setze, wäre wertlos; ein Protokolleintrag von deinem
  Server ist der Beweis.
* Geht etwas schief, steht der Grund in der Oberfläche unter
  „Letzter Lauf" und im Serverprotokoll. Nichts scheitert still.

ZWEI SCHRITTE, WEIL DIE LISTE NICHT ALLES ENTHÄLT
-------------------------------------------------
Die Liste liefert Kopfdaten (Titel, Datum, Rubrik, Id). Firmendetails wie
UID, Sitz und der Text der Meldung stehen im XML der einzelnen
Publikation. Der Adapter holt deshalb erst die Liste und lädt dann je
Publikation das XML nach — mit Pause dazwischen und einer Obergrenze pro
Lauf, damit der Dienst nicht belastet wird.

NUTZUNGSBEDINGUNGEN
-------------------
Amtliche Publikationen sind öffentlich. Ob und in welchem Umfang
automatisiert abgerufen werden darf, steht in den Bedingungen des Portals
und nicht in dieser Datei. Der Adapter hält sich an bescheidene Grenzen
(Pause zwischen Anfragen, Obergrenze je Lauf, eigener User-Agent mit
Zweckangabe), aber die Entscheidung liegt beim Betreiber.

DATENSCHUTZ — WICHTIG
---------------------
Die Konkursrubriken enthalten systematisch Personendaten: Einzelfirmen
laufen auf natürliche Personen. Ein anderes quelloffenes Projekt für
dieselbe Schnittstelle sperrt genau diese Rubriken deshalb bewusst aus.
Hier werden sie gebraucht — dann aber mit Löschfrist, siehe
`loeschfrist_tage` in der Konfiguration.
"""
import json
import time
import urllib.error
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET

from .basis import Quelle

BASIS = "https://amtsblattportal.ch/api/v1"

# Unterrubriken. Bestätigt aus öffentlichen Publikationen:
#   KK01 Konkurseröffnung
#   KK02 Konkurspublikation / Schuldenruf
#   KK03 Kollokationsplan und Inventar
# Die übrigen KK-Codes decken Einstellung, Schluss und Widerruf ab; sie
# werden mitgenommen, weil auch eine Einstellung eine Information ist
# (sie senkt den Score, statt den Fall zu verschweigen).
#
# Der Umfang stammt aus der Rubrikliste des echten Dienstes (Schritt 1 von
# `python3 -m radar.pruefen`, 2026-09-19): KK01–KK12 und SB01–SB07. Die
# Oberrubriken "KK" und "SB" gehören NICHT dazu — `subRubrics` erwartet
# Unterrubriken, und eine Oberrubrik dort ist je nach Dienst ein Fehler.
KONKURS = ["KK%02d" % i for i in range(1, 13)]

# Schuldbetreibung — hier stehen die Steigerungen, also der Moment, in dem
# tatsächlich etwas verwertet wird.
BETREIBUNG = ["SB%02d" % i for i in range(1, 8)]

# Handelsregister: Auflösung und Löschung. Liefert ausserdem den
# Zweckartikel, der für die Bewertung das wichtigste Feld ist.
HANDELSREGISTER = ["HR01", "HR02", "HR03"]

STANDARD_RUBRIKEN = KONKURS + BETREIBUNG

# Zusatzparameter der Trefferliste.
#
# WARUM DAS HIER STEHT: die Rubrikliste antwortet ohne weiteres mit HTTP
# 200, die Trefferliste aber mit **401**. Ein 401 auf einem offenen Dienst
# bedeutet in aller Regel nicht „Konto fehlt", sondern „so darfst du nicht
# fragen" — bei dieser Portalsoftware wird die Abfrage erst ohne Anmeldung
# zugelassen, wenn sie sich ausdrücklich auf veröffentlichte Publikationen
# beschränkt. Genau das tut `publicationStates=PUBLISHED`.
#
# Das ist die begründete Vermutung, nicht die verifizierte Wahrheit.
# `python3 -m radar.pruefen` probiert deshalb mehrere Varianten durch und
# nennt die, die wirklich 200 liefert; sie lässt sich danach in
# radar/config.json unter "amtsblatt" → "zusatz_parameter" eintragen, ohne
# Code zu ändern.
STANDARD_ZUSATZ = {"publicationStates": "PUBLISHED"}


def _text(knoten, *namen):
    """Ersten nichtleeren Textwert unter einem dieser Tagnamen finden.

    Das XML ist verschachtelt und die Namen unterscheiden sich je nach
    Rubrik. Ueber den lokalen Tagnamen zu suchen ist robuster, als einen
    Pfad anzunehmen, den ich nicht verifizieren konnte.
    """
    gesucht = {n.lower() for n in namen}
    for k in knoten.iter():
        if k.tag.split("}")[-1].lower() in gesucht:
            if k.text and k.text.strip():
                return k.text.strip()
    return None


def _sammle_text(knoten):
    """Allen sichtbaren Text eines Knotens einsammeln."""
    teile = []
    for k in knoten.iter():
        if k.text and k.text.strip():
            teile.append(k.text.strip())
        if k.tail and k.tail.strip():
            teile.append(k.tail.strip())
    return " ".join(teile)


class AmtsblattQuelle(Quelle):

    name = "Amtsblattportal (SHAB + Kantone)"
    braucht_zugang = False
    zugang_hinweis = ("Offene Schnittstelle, kein Schlüssel nötig. Adresse "
                      "und Parameter stammen aus öffentlicher Dokumentation "
                      "und sind hier nie ausprobiert worden — der erste Lauf "
                      "auf deinem Server ist der Beweis.")

    def __init__(self, cfg=None):
        c = cfg or {}
        self.basis = c.get("basis_url") or BASIS
        self.rubriken = c.get("rubriken") or STANDARD_RUBRIKEN
        self.kantone = c.get("kantone") or []
        # Leeres dict in der Konfiguration heisst „ausdrücklich keine" —
        # deshalb `is None` und nicht `or`.
        zusatz = c.get("zusatz_parameter")
        self.zusatz = STANDARD_ZUSATZ if zusatz is None else dict(zusatz)
        self.seiten_groesse = int(c.get("seitengroesse", 100))
        self.max_seiten = int(c.get("max_seiten", 10))
        self.max_details = int(c.get("max_details", 120))
        self.pause = float(c.get("pause_sekunden", 0.4))
        self.zeitlimit = int(c.get("zeitlimit", 30))
        self.aktiv = c.get("aktiv", True)
        self.protokoll = []

    def verfuegbar(self):
        if not self.aktiv:
            return False, ('Abgeschaltet. In radar/config.json unter '
                           '"amtsblatt" → "aktiv": true setzen.')
        return True, ""

    # -- HTTP -------------------------------------------------------------

    def _hole(self, url, akzeptiere="application/json"):
        req = urllib.request.Request(url, headers={
            "Accept": akzeptiere,
            # Zweck und Kontakt im User-Agent: wer automatisiert abruft,
            # soll erkennbar sein. Das ist Anstand, nicht Vorschrift.
            "User-Agent": "konkurs-deal-radar/1.0 (+Auswertung amtlicher "
                          "Konkurspublikationen)",
        })
        with urllib.request.urlopen(req, timeout=self.zeitlimit) as r:
            return r.status, r.read()

    # -- Liste ------------------------------------------------------------

    def _liste(self, seit, bis):
        """Kopfdaten der Publikationen im Zeitraum. Paginiert."""
        raus = []
        for seite in range(self.max_seiten):
            felder = [
                ("publicationDate.start", seit),
                ("publicationDate.end", bis),
                ("pageRequest.size", str(self.seiten_groesse)),
                ("pageRequest.page", str(seite)),
            ]
            for r in self.rubriken:
                felder.append(("subRubrics", r))
            for k in self.kantone:
                felder.append(("cantons", k))
            for name, wert in sorted(self.zusatz.items()):
                felder.append((name, wert))
            url = self.basis + "/publications?" + urllib.parse.urlencode(felder)

            code, roh = self._hole(url)
            self.protokoll.append("Liste Seite %d: HTTP %d, %d Bytes"
                                  % (seite, code, len(roh)))
            eintraege = self._liste_lesen(roh)
            raus.extend(eintraege)
            if len(eintraege) < self.seiten_groesse:
                break
            time.sleep(self.pause)
        return raus

    def _liste_lesen(self, roh):
        """JSON oder XML der Trefferliste auswerten."""
        text = roh.decode("utf-8", "replace").strip()
        raus = []
        if text.startswith("{") or text.startswith("["):
            d = json.loads(text)
            if isinstance(d, dict):
                for s in ("content", "items", "publications", "results"):
                    if isinstance(d.get(s), list):
                        d = d[s]
                        break
                else:
                    d = []
            for e in d:
                if isinstance(e, dict):
                    raus.append(self._kopf_aus_dict(e))
        else:
            wurzel = ET.fromstring(text)
            for e in wurzel.iter():
                if e.tag.split("}")[-1].lower() in ("publication", "item"):
                    flach = {}
                    for k in e.iter():
                        n = k.tag.split("}")[-1]
                        if k.text and k.text.strip():
                            flach.setdefault(n, k.text.strip())
                    raus.append(self._kopf_aus_dict(flach))
        return [r for r in raus if r.get("id")]

    def _kopf_aus_dict(self, e):
        """Aus einem Listeneintrag die Kopfdaten ziehen.

        Die Feldnamen sind nicht an einer Stelle festgelegt, also werden
        mehrere Schreibweisen akzeptiert. Was fehlt, bleibt leer.
        """
        def erst(*namen):
            for n in namen:
                v = e.get(n)
                if isinstance(v, dict):
                    v = v.get("id") or v.get("code") or v.get("name")
                if v:
                    return str(v)
            return None

        return {
            "id": erst("id", "publicationId", "uuid"),
            "titel": erst("title", "titel", "name"),
            "datum": erst("publicationDate", "publicationDateTime", "date"),
            "rubrik": erst("subRubric", "subRubrics", "rubric", "rubrics"),
            "kanton": erst("cantons", "canton", "tenant"),
            "pdf": erst("pdfUrl", "pdf"),
        }

    # -- Detail -----------------------------------------------------------

    def _detail(self, pub_id):
        """Volltext-XML einer Publikation holen und auswerten."""
        url = "%s/publications/%s/xml" % (self.basis, pub_id)
        code, roh = self._hole(url, "application/xml")
        wurzel = ET.fromstring(roh.decode("utf-8", "replace"))

        d = {
            "firma": _text(wurzel, "name", "companyName", "legalEntityName",
                           "debtorName"),
            "uid": _text(wurzel, "uid", "uidNumber", "cheNumber"),
            "ort": _text(wurzel, "town", "city", "municipality", "seat",
                         "legalSeat"),
            "zweck": _text(wurzel, "purpose", "zweck", "businessPurpose"),
            "konkursamt": _text(wurzel, "officeName", "registryOffice",
                                "bankruptcyOffice", "office"),
            "aktenzeichen": _text(wurzel, "caseNumber", "referenceNumber",
                                  "fileNumber"),
            "konkursdatum": _text(wurzel, "bankruptcyDate", "decisionDate",
                                  "openingDate"),
            "gruendung": _text(wurzel, "registrationDate", "foundingDate"),
        }
        d["text"] = _sammle_text(wurzel)[:4000]
        return d

    # -- Hauptlauf --------------------------------------------------------

    def holen(self, seit=None):
        ok, grund = self.verfuegbar()
        if not ok:
            raise RuntimeError(grund)
        self.protokoll = []

        bis = time.strftime("%Y-%m-%d")
        # Ohne bekannten letzten Lauf: die vergangenen 14 Tage. Nicht mehr —
        # ein erster Lauf soll nicht das halbe Archiv ziehen.
        seit = seit or time.strftime(
            "%Y-%m-%d", time.gmtime(time.time() - 14 * 86400))

        try:
            kopfdaten = self._liste(seit, bis)
        except urllib.error.HTTPError as e:
            antwort = e.read()[:300].decode("utf-8", "replace")
            if e.code in (401, 403):
                raise RuntimeError(
                    "Das Portal antwortete mit HTTP %s auf die Trefferliste. "
                    "Die Rubrikliste geht ohne Anmeldung — es fehlt also "
                    "kein Konto, sondern die Abfrage ist so nicht "
                    "zugelassen. Am wahrscheinlichsten fehlt oder stört ein "
                    "Parameter (aktuell gesetzt: %s). "
                    "`python3 -m radar.pruefen` probiert die Varianten durch "
                    "und nennt die funktionierende; sie kommt in "
                    "radar/config.json unter \"amtsblatt\" → "
                    "\"zusatz_parameter\". Antwort: %s"
                    % (e.code, json.dumps(self.zusatz, ensure_ascii=False),
                       antwort))
            raise RuntimeError(
                "Das Portal antwortete mit HTTP %s. Prüfe Adresse und "
                "Parameter in radar/config.json — die Vorgaben stammen aus "
                "öffentlicher Dokumentation und sind nicht verifiziert. "
                "Antwort: %s" % (e.code, antwort))
        except urllib.error.URLError as e:
            raise RuntimeError(
                "Keine Verbindung zu %s (%s). Läuft der Server mit "
                "Netzzugang?" % (self.basis, e.reason))

        self.protokoll.append("%d Publikationen im Zeitraum %s bis %s"
                              % (len(kopfdaten), seit, bis))

        raus, fehler = [], 0
        for k in kopfdaten[:self.max_details]:
            satz = {
                "publikationsdatum": k.get("datum"),
                "meldungsart": k.get("titel") or k.get("rubrik"),
                "kanton": k.get("kanton"),
                "aktenzeichen": k.get("id"),
                "quelle_url": k.get("pdf") or
                              "%s/publications/%s/pdf" % (self.basis, k["id"]),
                "quelle": "Amtsblattportal",
            }
            try:
                satz.update({a: b for a, b in self._detail(k["id"]).items()
                             if b})
            except Exception as e:
                fehler += 1
                self.protokoll.append("Detail %s: %s" % (k["id"], e))
            if satz.get("firma"):
                raus.append(satz)
            time.sleep(self.pause)

        self.protokoll.append("%d verwertbare Sätze, %d Details fehlgeschlagen"
                              % (len(raus), fehler))
        if kopfdaten and not raus:
            # Wichtig: nicht schweigend nichts zurückgeben. Wenn die Liste
            # Treffer hatte, das Detail-XML aber keine Firmennamen hergab,
            # stimmen die Feldnamen nicht — und das muss auffallen.
            raise RuntimeError(
                "%d Publikationen gefunden, aber keine auswertbaren "
                "Firmendaten. Vermutlich heissen die Felder im Detail-XML "
                "anders als angenommen. Protokoll: %s"
                % (len(kopfdaten), " | ".join(self.protokoll[-5:])))
        return raus
