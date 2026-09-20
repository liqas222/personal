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


def _flach(d, praefix="", raus=None):
    """Ein verschachteltes Objekt zu Pfad → Wert flachklopfen.

    `{"meta": {"id": "x", "title": {"de": "..."}}}` wird zu
    `{"meta.id": "x", "meta.title.de": "..."}`. Listen von Skalaren werden
    mit Komma zusammengezogen (`cantons` ist mal ein Wort, mal eine
    Liste); bei Listen von Objekten zählt der erste Eintrag, weil ein
    Listeneintrag genau eine Publikation beschreibt.
    """
    if raus is None:
        raus = {}
    if isinstance(d, dict):
        for k, v in d.items():
            _flach(v, praefix + "." + k if praefix else k, raus)
    elif isinstance(d, list):
        skalare = [x for x in d if not isinstance(x, (dict, list))]
        if skalare:
            raus[praefix] = ", ".join(str(x) for x in skalare)
        elif d:
            _flach(d[0], praefix, raus)
    elif d is not None and d != "":
        raus[praefix] = d
    return raus


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
        # Zweckartikel aus Handelsregister-Publikationen nachschlagen.
        # Kostet je Firma zwei weitere Anfragen, ist aber der Unterschied
        # zwischen einer brauchbaren und einer nutzlosen Bewertung.
        self.zweck_nachschlagen = c.get("zweck_nachschlagen", True)
        self.max_zweck = int(c.get("max_zweck", 60))
        self.uid_parameter = c.get("uid_parameter")   # None = ausprobieren
        self.protokoll = []
        self._zweck_zwischenspeicher = {}

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

        WICHTIG — hier steckte ein Fehler: ein Listeneintrag ist nicht
        flach. Die Kopfdaten liegen unter `meta`, und der Titel ist ein
        Objekt mit einem Eintrag je Sprache. Flach nachgesehen fand sich
        keine `id`, jeder Eintrag flog raus, und die Prüfung meldete
        „5 Einträge in der Antwort, 0 gefunden". Deshalb wird der Eintrag
        erst flachgeklopft und dann sowohl über den vollen Pfad
        (`meta.id`) als auch über den blossen Feldnamen (`id`) gesucht.
        """
        flach = _flach(e)

        def erst(*namen):
            for n in namen:
                if n in flach:
                    return str(flach[n])
            # Nicht über den vollen Pfad gefunden: über den letzten
            # Namensteil suchen, damit auch eine unerwartete
            # Verschachtelung noch greift.
            for n in namen:
                for pfad, wert in flach.items():
                    if pfad.split(".")[-1] == n:
                        return str(wert)
            return None

        return {
            # Volle Pfade zuerst: `meta.id` ist die Id der Publikation,
            # ein blosses `id` kann irgendwo tiefer auch die Id der
            # Rubrik sein.
            "id": erst("meta.id", "id", "publicationId", "uuid"),
            "titel": erst("meta.title.de", "title.de", "meta.title",
                          "title", "titel", "name"),
            "datum": erst("meta.publicationDate", "publicationDate",
                          "publicationDateTime", "date"),
            "rubrik": erst("meta.subRubric", "subRubric", "subRubrics",
                           "meta.rubric", "rubric", "rubrics"),
            "kanton": erst("meta.cantons", "cantons", "canton",
                           "meta.tenant", "tenant"),
            "pdf": erst("meta.pdfUrl", "pdfUrl", "pdf"),
        }

    def _absolut(self, url):
        """Einen relativen Link auf den Dienst beziehen.

        Die Antwort liefert `links.pdf` als `/api/v1/publications/…/pdf`.
        Gespeichert gehört die vollständige Adresse — ein relativer Link
        in der Oberfläche führt ins Leere.
        """
        if not url or "://" in url:
            return url
        teile = urllib.parse.urlsplit(self.basis)
        return urllib.parse.urlunsplit(
            (teile.scheme, teile.netloc, url if url.startswith("/")
             else teile.path.rstrip("/") + "/" + url, "", ""))

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
            # Die echten Feldnamen aus dem Dienst (geprüft 2026-09-19):
            # das zuständige Amt steht in
            # `registrationOfficeAndCirculationAuthority`, sein Klarname
            # zusätzlich in `displayName`.
            # Das zuständige Amt heisst je nach Rubrik anders: bei KK04
            # `registrationOfficeAndCirculationAuthority`, bei KK03
            # schlicht `registrationOffice`. Beide Schreibweisen sind aus
            # echten Publikationen belegt — deshalb stehen beide hier.
            "konkursamt": _text(wurzel,
                                "registrationOfficeAndCirculationAuthority",
                                "registrationOffice", "displayName",
                                "officeName", "registryOffice",
                                "bankruptcyOffice", "office"),
            # `publicationNumber` (z. B. KK04-0000060367) ist das, was ein
            # Konkursamt am Telefon versteht — die interne uuid nicht.
            "aktenzeichen": _text(wurzel, "publicationNumber", "caseNumber",
                                  "referenceNumber", "fileNumber"),
            "konkursdatum": _text(wurzel, "bankruptcyDate", "decisionDate",
                                  "openingDate"),
            "gruendung": _text(wurzel, "registrationDate", "foundingDate"),
            # Nicht zum Speichern, sondern zum Aussortieren: siehe
            # `_ist_person()`.
            "_art": _text(wurzel, "selectType"),
            "_vorname": _text(wurzel, "prename"),
            "_geburtsdatum": _text(wurzel, "dateOfBirth"),
        }
        d["text"] = _sammle_text(wurzel)[:4000]
        return d

    @staticmethod
    def _ist_verwertung(satz, detail):
        """Wird hier etwas verkauft — oder nur über jemanden berichtet?

        Das ist die Unterscheidung, auf die es beim Datenschutz ankommt.
        Eine Steigerungsanzeige beschreibt eine **Sache, die öffentlich
        zum Verkauf steht**; sie wird publiziert, damit Bieter kommen.
        Sie aufzunehmen ist genau der Zweck, zu dem sie veröffentlicht
        wurde — auch wenn der Schuldner eine Privatperson ist.

        Ein Schuldenruf oder ein Kollokationsplan über eine Privatperson
        ist etwas anderes: er berichtet über die Person, nennt keine
        Sache und enthält ein Geburtsdatum. Der bleibt draussen.
        """
        from ..modell import art_erkennen
        text = " ".join(str(x) for x in (
            satz.get("meldungsart"), detail.get("text")) if x)
        return art_erkennen(text) == "steigerung"

    @staticmethod
    def _ist_person(d):
        """Ist diese Publikation eine natürliche Person?

        WARUM DAS SEIN MUSS — das ist der wichtigste Filter im Adapter.

        Ein grosser Teil der Konkurs- und Betreibungsrubriken betrifft
        Privatpersonen, nicht Firmen. Der Dienst liefert dazu Nachnamen,
        Vornamen und **Geburtsdaten**. Der erste echte Lauf holte prompt
        Privatleute samt Geburtsdatum herein und zeigte sie als „Firma".

        Zwei Gründe, das zu unterbinden:

        1. Sie gehören nicht zur Aufgabe. Gesucht sind Betriebe mit
           Maschinen, Fahrzeugen und Lager. Bei einer Privatperson gibt es
           keine Betriebsausstattung zu verwerten.
        2. Daten über Privatleute, die niemand braucht, gehören nicht in
           eine Datenbank. Was gar nicht erst gespeichert wird, muss auch
           nicht gelöscht, geschützt oder verantwortet werden.

        Erkannt wird es am ausdrücklichen `selectType` des Dienstes und,
        falls der fehlt, am Vornamen oder Geburtsdatum ohne UID.
        """
        art = (d.get("_art") or "").strip().lower()
        if art in ("person", "naturalperson", "natuerliche_person"):
            return True
        if art in ("company", "legalentity", "juristische_person"):
            return False
        return bool(d.get("_geburtsdatum") or d.get("_vorname")) \
            and not d.get("uid")

    # -- Zweckartikel nachschlagen ----------------------------------------
    #
    # WARUM DAS SEIN MUSS
    # -------------------
    # Eine Konkurspublikation nennt keinen Zweckartikel. Für die Bewertung
    # ist er aber die wichtigste Angabe: aus ihm kommen Branche und
    # vermutete Assets. Ohne ihn trägt nur der Firmenname, und der erste
    # echte Lauf zeigte, was das heisst — 60 erfasste Fälle, kein
    # einziger über der Schwelle.
    #
    # Der Zweck steht im Handelsregister, und dessen Publikationen liegen
    # in DERSELBEN offenen Schnittstelle (Rubriken HR01–HR03). Es braucht
    # also keine zweite Quelle, keinen Zugang und kein Konto — nur zwei
    # zusätzliche Anfragen je Firma.

    UID_PARAMETER = ("uid", "companyUid", "identificationNumber", "query",
                     "keyword", "searchTerm", "fullText")

    def _zweck_zu_uid(self, uid):
        """Nur den Zweck — für Aufrufer, die sonst nichts brauchen."""
        return (self._hr_daten(uid) or {}).get("zweck")

    def _hr_daten(self, uid):
        """Zweck UND Gründungsdatum zu einer UID suchen.

        Beides kommt aus derselben Publikation, also aus derselben
        Anfrage. Das Gründungsdatum extra zu holen wäre Verschwendung —
        es hier mitzunehmen kostet nichts.

        WARUM DAS GRÜNDUNGSDATUM WICHTIG IST: das Firmenalter ist 20 von
        maximal 55 erreichbaren Punkten. Fehlt es, kommt auch ein
        einwandfreier Fall nicht über 35. In der Konkurspublikation steht
        es oft nicht, im Handelsregistereintrag dagegen immer.

        Welcher Parameter die Suche nach einer UID entgegennimmt, ist
        nicht dokumentiert. Statt zu raten wird er einmal ausprobiert und
        dann gemerkt — das kostet beim ersten Fall ein paar Anfragen und
        danach keine mehr.
        """
        if uid in self._zweck_zwischenspeicher:
            return self._zweck_zwischenspeicher[uid]

        namen = ([self.uid_parameter] if self.uid_parameter
                 else list(self.UID_PARAMETER))
        daten = None
        for name in namen:
            try:
                treffer = self._hr_suchen(name, uid)
            except Exception:
                continue
            if not treffer:
                continue
            # Dieser Parametername funktioniert — ab jetzt nur noch der.
            if not self.uid_parameter:
                self.uid_parameter = name
                self.protokoll.append(
                    "Zwecksuche läuft über den Parameter %s" % name)
            daten = self._hr_publikation_lesen(treffer[0]["id"])
            break

        self._zweck_zwischenspeicher[uid] = daten
        return daten

    def _hr_suchen(self, parameter, uid):
        felder = [(parameter, uid), ("pageRequest.size", "5")]
        for r in HANDELSREGISTER:
            felder.append(("subRubrics", r))
        for n, w in sorted(self.zusatz.items()):
            felder.append((n, w))
        url = self.basis + "/publications?" + urllib.parse.urlencode(felder)
        code, roh = self._hole(url)
        return self._liste_lesen(roh)

    def _hr_publikation_lesen(self, pub_id):
        """Zweck und Gründungsdatum aus einer HR-Publikation."""
        url = "%s/publications/%s/xml" % (self.basis, pub_id)
        code, roh = self._hole(url, "application/xml")
        wurzel = ET.fromstring(roh.decode("utf-8", "replace"))
        return {
            "zweck": _text(wurzel, "purpose", "zweck", "businessPurpose",
                           "companyPurpose"),
            "gruendung": _text(wurzel, "registrationDate", "foundingDate",
                               "entryDate", "firstEntryDate"),
        }

    def _zweck_aus_publikation(self, pub_id):
        """Nur der Zweck — von radar.pruefen benutzt."""
        return self._hr_publikation_lesen(pub_id).get("zweck")

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

        raus, fehler, personen = [], 0, 0
        for k in kopfdaten[:self.max_details]:
            satz = {
                "publikationsdatum": k.get("datum"),
                "meldungsart": k.get("titel") or k.get("rubrik"),
                "kanton": k.get("kanton"),
                "aktenzeichen": k.get("id"),
                "quelle_url": self._absolut(k.get("pdf")) or
                              "%s/publications/%s/pdf" % (self.basis, k["id"]),
                "quelle": "Amtsblattportal",
            }
            try:
                detail = self._detail(k["id"])
            except Exception as e:
                fehler += 1
                self.protokoll.append("Detail %s: %s" % (k["id"], e))
                time.sleep(self.pause)
                continue

            if self._ist_person(detail) and not self._ist_verwertung(
                    satz, detail):
                # Privatperson ohne Verkauf: verwerfen, bevor irgendetwas
                # davon in den Satz kommt. Gezählt wird sie, damit im
                # Protokoll sichtbar bleibt, wie viel der Lauf weglässt.
                #
                # Die Ausnahme ist wichtig: eine Steigerungsanzeige gegen
                # eine Privatperson ist der einzige öffentliche Weg, auf
                # dem Einzelstücke — ein Fahrzeug, eine Uhrensammlung —
                # legal zu haben sind. Sie pauschal wegzuwerfen hiesse,
                # den halben Zweck dieses Werkzeugs wegzuwerfen.
                personen += 1
                time.sleep(self.pause)
                continue

            # Die Hilfsfelder mit `_` sind nur für diese Entscheidung da
            # und dürfen nicht weitergereicht werden.
            satz.update({a: b for a, b in detail.items()
                         if b and not a.startswith("_")})
            if satz.get("firma"):
                raus.append(satz)
            time.sleep(self.pause)

        # Zweckartikel nachschlagen — erst jetzt, damit dafür nur Firmen
        # angefragt werden, die es überhaupt in die Liste geschafft haben.
        zwecke, ohne_zweck = 0, 0
        if self.zweck_nachschlagen:
            for satz in raus[:self.max_zweck]:
                if not satz.get("uid"):
                    continue
                if satz.get("zweck") and satz.get("gruendung"):
                    continue
                try:
                    hr = self._hr_daten(satz["uid"]) or {}
                except Exception as e:
                    self.protokoll.append("Zwecksuche %s: %s"
                                          % (satz["uid"], e))
                    continue
                if hr.get("zweck") and not satz.get("zweck"):
                    satz["zweck"] = hr["zweck"]
                # Das Gründungsdatum kommt aus derselben Anfrage und ist
                # 20 von 55 möglichen Punkten wert — es hier liegen zu
                # lassen wäre die teuerste Art von Sparsamkeit.
                if hr.get("gruendung") and not satz.get("gruendung"):
                    satz["gruendung"] = hr["gruendung"]
                if hr.get("zweck"):
                    zwecke += 1
                else:
                    ohne_zweck += 1
                time.sleep(self.pause)

        # Diese Zeile ist das, was in der Fusszeile und auf der
        # Kommandozeile erscheint. Sie muss allein verständlich sein —
        # eine Erklärung, die nur weiter oben im Protokoll steht, sieht
        # niemand. Deshalb gehört der Zweckstand hier mit hinein: ohne
        # ihn bleibt offen, warum die Scores niedrig sind.
        teile = ["%d verwertbare Sätze" % len(raus)]
        if self.zweck_nachschlagen and (zwecke or ohne_zweck):
            teile.append("%d Zweckartikel gefunden, %d ohne"
                         % (zwecke, ohne_zweck))
        elif not self.zweck_nachschlagen:
            teile.append("Zwecksuche abgeschaltet")
        teile.append("%d natürliche Personen übersprungen" % personen)
        teile.append("%d Details fehlgeschlagen" % fehler)
        self.protokoll.append(", ".join(teile))
        if kopfdaten and not raus and not personen:
            # Wichtig: nicht schweigend nichts zurückgeben. Wenn die Liste
            # Treffer hatte, das Detail-XML aber keine Firmennamen hergab,
            # stimmen die Feldnamen nicht — und das muss auffallen.
            #
            # Waren es dagegen lauter Privatpersonen, ist ein leeres
            # Ergebnis richtig und kein Fehler — deshalb `not personen`.
            raise RuntimeError(
                "%d Publikationen gefunden, aber keine auswertbaren "
                "Firmendaten. Vermutlich heissen die Felder im Detail-XML "
                "anders als angenommen. Protokoll: %s"
                % (len(kopfdaten), " | ".join(self.protokoll[-5:])))
        return raus
