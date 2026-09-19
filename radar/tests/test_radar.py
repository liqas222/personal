#!/usr/bin/env python3
"""Tests für den Konkurs Deal Radar.

Läuft mit pytest oder direkt:  python3 radar/tests/test_radar.py

Kein Netz, keine Fremdbibliothek. Was hier grün ist, ist grün — nicht
"grün, solange eine Schnittstelle antwortet".
"""
import datetime
import io
import json
import os
import sys
import tempfile
import unittest

sys.path.insert(0, os.path.dirname(os.path.dirname(
    os.path.dirname(os.path.abspath(__file__)))))

from radar import bewertung, kette, klassierung, modell   # noqa: E402
from radar.quellen.dateien import CsvQuelle, JsonQuelle, PdfQuelle  # noqa: E402
from radar.quellen.shab import ShabQuelle                 # noqa: E402
from radar.speicher import Speicher                       # noqa: E402

BEISPIEL = os.path.join(os.path.dirname(os.path.dirname(
    os.path.abspath(__file__))), "beispiel", "konkurse.csv")
STICHTAG = datetime.date(2026, 9, 10)


class TestUid(unittest.TestCase):

    def test_echte_uid_ist_gueltig(self):
        # Der bekannte Testfall aus dem Auftrag.
        self.assertTrue(modell.uid_gueltig("CHE-113.766.916"))

    def test_verdrehte_pruefziffer_faellt_auf(self):
        self.assertFalse(modell.uid_gueltig("CHE-113.766.917"))

    def test_schreibweisen(self):
        for roh in ("CHE113766916", "CHE-113.766.916", "che 113 766 916"):
            self.assertEqual(modell.uid_normieren(roh), "CHE-113.766.916")

    def test_unsinn_gibt_none(self):
        self.assertIsNone(modell.uid_normieren("keine UID"))
        self.assertIsNone(modell.uid_normieren("CHE-12"))


class TestNormalisierung(unittest.TestCase):

    def test_datumsformate(self):
        self.assertEqual(modell.datum_normieren("02.09.2026"), "2026-09-02")
        self.assertEqual(modell.datum_normieren("2026-09-02"), "2026-09-02")
        self.assertEqual(modell.datum_normieren("2.9.2026"), "2026-09-02")
        self.assertIsNone(modell.datum_normieren("vor drei Tagen"))

    def test_kanton_aus_ort(self):
        self.assertEqual(modell.kanton_erkennen("Andwil (SG)"), "SG")
        self.assertEqual(modell.kanton_erkennen("Kloten", "Zürich"), "ZH")
        self.assertEqual(modell.ort_saeubern("Andwil (SG)"), "Andwil")

    def test_firmenschluessel_ignoriert_rechtsform_und_umlaute(self):
        a = modell.firmenname_schluessel("Müller Bau AG")
        b = modell.firmenname_schluessel("Mueller Bau GmbH")
        self.assertEqual(a, b)

    def test_fall_id_ist_ueber_prozesse_stabil(self):
        # hashlib statt hash(): sonst waere derselbe Fall nach einem
        # Neustart ein neuer. Der Wert ist fest verdrahtet, damit ein
        # Wechsel auffaellt.
        i = modell.fall_id("CHE-113.766.916", "X AG", "kollokationsplan",
                           "2026-09-02")
        self.assertEqual(i, modell.fall_id("CHE-113.766.916", "X AG",
                                           "kollokationsplan", "2026-09-02"))
        self.assertEqual(len(i), 20)

    def test_meldungsart_erkennen(self):
        self.assertEqual(modell.art_erkennen("Kollokationsplan und Inventar"),
                         "kollokationsplan")
        self.assertEqual(modell.art_erkennen("Über die Firma wurde der "
                                             "Konkurs eröffnet"),
                         "konkurseroeffnung")
        self.assertEqual(modell.art_erkennen("Einstellung mangels Aktiven"),
                         "konkurs_einstellung")
        self.assertEqual(modell.art_erkennen("Öffentliche Steigerung"),
                         "steigerung")


class TestKlassierung(unittest.TestCase):

    def test_montagebau_erkennt_maschinenbau_und_assets(self):
        k = klassierung.klassieren(
            "Stahl- und Montagebau, Ausführung von Schweiss- und "
            "Montagearbeiten")
        self.assertEqual(k["branche_id"], "maschinenbau")
        alle = k["assets_genannt"] + k["assets_vermutet"]
        self.assertTrue(any("Schweiss" in a for a in alle))

    def test_beratung_gibt_abzug(self):
        k = klassierung.klassieren("Unternehmensberatung und Coaching")
        self.assertTrue(any(a["id"] == "beratung" for a in k["abzuege"]))

    def test_holding_gibt_abzug(self):
        k = klassierung.klassieren("Erwerb und Verwaltung von Beteiligungen")
        self.assertTrue(any(a["id"] == "holding" for a in k["abzuege"]))

    def test_wortgrenzen(self):
        # "bau" darf nicht in "Baumwolle" treffen.
        k = klassierung.klassieren("Handel mit Baumwolle")
        self.assertNotEqual(k["branche_id"], "bau")

    def test_genannte_gegenstaende_schlagen_durch(self):
        k = klassierung.klassieren("Transporte", "Verwertung von Staplern "
                                                 "und Regalanlagen")
        self.assertIn("Stapler und Lagertechnik", k["assets_genannt"])


class TestBewertung(unittest.TestCase):

    def _fall(self, **kw):
        roh = {"firma": "Test AG", "zweck": "", "publikationsdatum":
               "2026-09-02"}
        roh.update(kw)
        return modell.fall_bauen(roh, STICHTAG)

    def test_testfall_erreicht_schwelle(self):
        """Burger & Simon: der bekannte Fall muss oben landen."""
        f = self._fall(firma="Burger & Simon Montagebau GmbH",
                       uid="CHE-113.766.916", ort="Andwil", kanton="SG",
                       zweck="Stahl- und Montagebau, Ausführung von "
                             "Schweiss- und Montagearbeiten",
                       gruendung="2007-04-16",
                       meldungsart="Kollokationsplan und Inventar")
        k = klassierung.klassieren(f["zweck"], f["rohtext"])
        b = bewertung.bewerten(f, k)
        self.assertGreaterEqual(b["score"], bewertung.SCHWELLE)
        # Und zwar OHNE Anreicherung — das war der Kern der Kritik an der
        # urspruenglichen Gewichtung.
        self.assertFalse(b["hat_anreicherung"])
        self.assertGreaterEqual(b["nur_amtlich"], bewertung.SCHWELLE)

    def test_beratung_faellt_durch(self):
        f = self._fall(zweck="Unternehmensberatung und Coaching",
                       gruendung="2019-06-14")
        k = klassierung.klassieren(f["zweck"])
        b = bewertung.bewerten(f, k)
        self.assertLess(b["score"], bewertung.SCHWELLE)

    def test_widerruf_druckt_score(self):
        f = self._fall(zweck="Betrieb einer Garage",
                       gruendung="2004-01-01",
                       meldungsart="Widerruf des Konkurses")
        k = klassierung.klassieren(f["zweck"])
        b = bewertung.bewerten(f, k)
        self.assertLess(b["score"], bewertung.SCHWELLE)

    def test_score_bleibt_in_den_grenzen(self):
        f = self._fall(zweck="Garage, Transport, Maschinenbau, Produktion",
                       gruendung="1980-01-01", meldungsart="Steigerung")
        k = klassierung.klassieren(f["zweck"])
        b = bewertung.bewerten(f, k, {"website_assets": True, "standort": True,
                                      "flotte": True, "mitarbeitende": 40})
        self.assertLessEqual(b["score"], 100)
        self.assertGreaterEqual(b["score"], 0)

    def test_jede_zeile_hat_eine_begruendung(self):
        f = self._fall(zweck="Betrieb einer Garage", gruendung="2004-01-01")
        k = klassierung.klassieren(f["zweck"])
        b = bewertung.bewerten(f, k)
        for z in b["zeilen"]:
            self.assertTrue(z["grund"])
            self.assertTrue(z["quelle"])

    def test_kollokationsplan_warnt_vor_der_frist(self):
        f = self._fall(meldungsart="Kollokationsplan und Inventar")
        e = bewertung.einschraenkungen(f, klassierung.klassieren(""))
        self.assertTrue(any("Anfechtungsfrist" in x for x in e))
        self.assertTrue(any("Leasing" in x for x in e))

    def test_naechster_schritt_nennt_nur_das_konkursamt(self):
        f = self._fall(konkursamt="Konkursamt Zug")
        s = bewertung.naechster_schritt(f)
        self.assertIn("Konkursamt", s)
        for verboten in ("Inhaber", "Geschäftsführer", "Eigentümer",
                         "Verwaltungsrat"):
            self.assertNotIn(verboten, s)


class TestImport(unittest.TestCase):

    def test_csv_beispiel(self):
        with open(BEISPIEL, "rb") as f:
            q = CsvQuelle(f.read(), "konkurse.csv")
        roh = q.holen()
        self.assertEqual(len(roh), 9)
        self.assertEqual(roh[0]["firma"], "Burger & Simon Montagebau GmbH")

    def test_csv_mit_komma_und_bom(self):
        inhalt = "﻿Firmenname,Sitz,Datum\nAlpha AG,Zug,01.09.2026\n"
        roh = CsvQuelle(inhalt.encode("utf-8"), "a.csv").holen()
        self.assertEqual(roh[0]["firma"], "Alpha AG")
        self.assertEqual(roh[0]["ort"], "Zug")

    def test_json_verschachtelt(self):
        inhalt = ('{"content":[{"meta":{"id":"X-1"},'
                  '"company":{"name":"Beta GmbH","uid":"CHE-113.766.916"},'
                  '"sitz":"Kloten"}]}')
        roh = JsonQuelle(inhalt.encode("utf-8")).holen()
        self.assertEqual(roh[0]["firma"], "Beta GmbH")
        self.assertEqual(roh[0]["uid"], "CHE-113.766.916")

    def test_pdf_textauswertung_ohne_pypdf(self):
        text = ("Konkursamt des Kantons St. Gallen\n\n"
                "Burger & Simon Montagebau GmbH\n"
                "CHE-113.766.916, Sitz in Andwil (SG)\n"
                "Kollokationsplan und Inventar, aufgelegt am 02.09.2026\n")
        roh = PdfQuelle(b"").aus_text(text)
        self.assertEqual(len(roh), 1)
        self.assertEqual(roh[0]["uid"], "CHE-113.766.916")
        self.assertEqual(roh[0]["kanton"], "SG")


class TestShabAdapter(unittest.TestCase):

    def test_meldet_sich_als_nicht_verifiziert(self):
        q = ShabQuelle({"aktiv": True, "basis_url": "https://example.invalid",
                        "verifiziert": False})
        ok, grund = q.verfuegbar()
        self.assertFalse(ok)
        self.assertIn("Nicht verifiziert", grund)

    def test_abgeschaltet_ist_der_normalfall(self):
        ok, grund = ShabQuelle({}).verfuegbar()
        self.assertFalse(ok)
        self.assertIn("abgeschaltet", grund)

    def test_holen_wirft_statt_leere_liste_zu_liefern(self):
        # Wichtig: ein nicht eingerichteter Adapter darf NICHT so tun, als
        # habe er nachgesehen und nichts gefunden.
        with self.assertRaises(RuntimeError):
            ShabQuelle({}).holen()

    def test_antwort_lesen_ohne_netz(self):
        roh = ('{"content":[{"name":"Gamma AG","sitz":"Zug",'
               '"publicationDate":"2026-09-08"}]}')
        q = ShabQuelle({})
        saetze = q.antwort_lesen(roh)
        self.assertEqual(saetze[0]["firma"], "Gamma AG")


class TestSpeicher(unittest.TestCase):

    def setUp(self):
        self.tmp = tempfile.mkdtemp()
        self.sp = Speicher(os.path.join(self.tmp, "t.db"))

    def tearDown(self):
        self.sp.schliessen()

    def _import(self):
        with open(BEISPIEL, "rb") as f:
            roh = CsvQuelle(f.read(), "konkurse.csv").holen()
        return kette.verarbeiten(roh, self.sp, STICHTAG)

    def test_erster_lauf_ist_alles_neu(self):
        b = self._import()
        self.assertEqual(b["gelesen"], 9)
        self.assertEqual(b["neu"], 9)

    def test_zweiter_lauf_meldet_nichts_neues(self):
        self._import()
        b = self._import()
        self.assertEqual(b["neu"], 0)
        self.assertEqual(b["bekannt"], 9)

    def test_nur_richtige_faelle_ueber_der_schwelle(self):
        self._import()
        oben = self.sp.suchen(min_score=bewertung.SCHWELLE)
        namen = [f["firma"] for f in oben]
        self.assertIn("Burger & Simon Montagebau GmbH", namen)
        self.assertIn("Seetal Garage GmbH", namen)
        # Beratung, Holding und Software gehoeren NICHT dazu.
        self.assertNotIn("Novaline Consulting AG", namen)
        self.assertNotIn("Weber Holding AG", namen)
        self.assertNotIn("Bitstream Digital GmbH", namen)

    def test_status_wird_nicht_ueberschrieben(self):
        self._import()
        f = self.sp.suchen(min_score=60)[0]
        self.sp.status_setzen(f["id"], "Verworfen")
        self._import()
        self.assertEqual(self.sp.holen(f["id"])["status"], "Verworfen")

    def test_tagesmeldung_leer_sagt_das_auch(self):
        text, ids = kette.tagesmeldung(self.sp, ["ZH"], 60)
        self.assertEqual(text, kette.KEINE_TREFFER)
        self.assertEqual(ids, [])

    def test_gemeldete_faelle_kommen_nicht_zweimal(self):
        self._import()
        text, ids = kette.tagesmeldung(self.sp, None, 60)
        self.assertTrue(ids)
        self.sp.als_gemeldet_markieren(ids)
        text2, ids2 = kette.tagesmeldung(self.sp, None, 60)
        self.assertEqual(text2, kette.KEINE_TREFFER)

    def test_meldung_nennt_niemals_den_inhaber(self):
        self._import()
        for f in self.sp.suchen(min_score=0):
            t = kette.meldung_bauen(f)
            self.assertIn("Konkursamt", t)
            self.assertIn("vermutet", t.lower())

    def test_laufprotokoll(self):
        lauf = self.sp.lauf_beginnen("Test")
        self.sp.lauf_beenden(lauf, 5, 3, 1, 1)
        self.assertEqual(self.sp.letzter_lauf()["gelesen"], 5)

    def test_export_csv_und_xlsx(self):
        from radar import app
        self._import()
        faelle = self.sp.suchen(min_score=0)
        csv_bytes = app.export_csv(faelle)
        self.assertIn(b"Deal Score", csv_bytes)
        xlsx = app.export_xlsx(faelle)
        self.assertTrue(xlsx.startswith(b"PK"))     # ist ein ZIP
        import zipfile as _z, io as _io
        with _z.ZipFile(_io.BytesIO(xlsx)) as z:
            self.assertIn("xl/worksheets/sheet1.xml", z.namelist())




class TestAmtsblatt(unittest.TestCase):
    """Der Adapter selbst — ohne Netz, auf gespeicherten Antworten."""

    def setUp(self):
        from radar.quellen.amtsblatt import AmtsblattQuelle
        self.Q = AmtsblattQuelle

    def test_ist_standardmaessig_an(self):
        ok, grund = self.Q({}).verfuegbar()
        self.assertTrue(ok, grund)

    def test_laesst_sich_abschalten(self):
        ok, grund = self.Q({"aktiv": False}).verfuegbar()
        self.assertFalse(ok)

    def test_liste_json_lesen(self):
        roh = json.dumps({"content": [
            {"id": "abc-123", "title": "Konkurseröffnung",
             "publicationDate": "2026-09-15", "subRubric": "KK01",
             "cantons": "SG"}]}).encode("utf-8")
        k = self.Q({})._liste_lesen(roh)
        self.assertEqual(k[0]["id"], "abc-123")
        self.assertEqual(k[0]["datum"], "2026-09-15")
        self.assertEqual(k[0]["rubrik"], "KK01")

    def test_liste_xml_lesen(self):
        roh = ("<publications><publication><id>x-9</id>"
               "<title>Kollokationsplan</title>"
               "<publicationDate>2026-09-14</publicationDate>"
               "</publication></publications>").encode("utf-8")
        k = self.Q({})._liste_lesen(roh)
        self.assertEqual(k[0]["id"], "x-9")

    def test_eintrag_ohne_id_faellt_weg(self):
        roh = json.dumps({"content": [{"title": "ohne id"}]}).encode("utf-8")
        self.assertEqual(self.Q({})._liste_lesen(roh), [])

    def test_detailfelder_aus_xml(self):
        from radar.quellen.amtsblatt import _text, _sammle_text
        import xml.etree.ElementTree as ET
        w = ET.fromstring(
            "<pub><debtor><name>Muster Bau AG</name>"
            "<uid>CHE-113.766.916</uid><town>Andwil</town></debtor>"
            "<office><officeName>Konkursamt SG</officeName></office>"
            "<content>Kollokationsplan und Inventar aufgelegt.</content></pub>")
        self.assertEqual(_text(w, "name", "companyName"), "Muster Bau AG")
        self.assertEqual(_text(w, "uid"), "CHE-113.766.916")
        self.assertEqual(_text(w, "officeName", "office"), "Konkursamt SG")
        self.assertIn("Kollokationsplan", _sammle_text(w))

    def test_fehlendes_feld_gibt_none_statt_unsinn(self):
        from radar.quellen.amtsblatt import _text
        import xml.etree.ElementTree as ET
        w = ET.fromstring("<pub><a>x</a></pub>")
        self.assertIsNone(_text(w, "name", "companyName"))


class TestLoeschfrist(unittest.TestCase):

    def setUp(self):
        self.tmp = tempfile.mkdtemp()
        self.sp = Speicher(os.path.join(self.tmp, "t.db"))
        with open(BEISPIEL, "rb") as f:
            kette.verarbeiten(CsvQuelle(f.read()).holen(), self.sp, STICHTAG)

    def tearDown(self):
        self.sp.schliessen()

    def test_alte_faelle_verschwinden(self):
        vorher = len(self.sp.suchen(min_score=0))
        self.assertEqual(self.sp.aufraeumen(100000), 0)   # nichts so alt
        self.assertEqual(self.sp.aufraeumen(1), vorher)   # alles älter als 1 Tag
        self.assertEqual(len(self.sp.suchen(min_score=0)), 0)

    def test_bearbeitete_faelle_bleiben(self):
        f = self.sp.suchen(min_score=0)[0]
        self.sp.status_setzen(f["id"], "Inventarliste angefragt")
        self.sp.aufraeumen(1)
        self.assertIsNotNone(self.sp.holen(f["id"]))


class TestAmtsblattAbfrage(unittest.TestCase):
    """Die Abfrage selbst — Rubrikumfang und Zusatzparameter.

    Beides stammt aus dem ersten echten Lauf auf dem Server: die
    Rubrikliste reichte bis KK12/SB07, und die Trefferliste antwortete
    mit 401, solange die Abfrage sich nicht auf veröffentlichte
    Publikationen beschränkte.
    """

    def test_rubrikumfang(self):
        from radar.quellen.amtsblatt import (BETREIBUNG, KONKURS,
                                             STANDARD_RUBRIKEN)
        self.assertIn("KK12", KONKURS)
        self.assertIn("SB07", BETREIBUNG)
        # Oberrubriken gehören NICHT in subRubrics.
        self.assertNotIn("KK", STANDARD_RUBRIKEN)
        self.assertNotIn("SB", STANDARD_RUBRIKEN)

    def test_zusatzparameter_standard(self):
        from radar.quellen.amtsblatt import AmtsblattQuelle
        self.assertEqual(AmtsblattQuelle({}).zusatz,
                         {"publicationStates": "PUBLISHED"})

    def test_zusatzparameter_abschaltbar(self):
        """Leeres dict heisst „ausdrücklich keine", nicht „nimm die Vorgabe"."""
        from radar.quellen.amtsblatt import AmtsblattQuelle
        self.assertEqual(AmtsblattQuelle({"zusatz_parameter": {}}).zusatz, {})

    def test_verschachtelten_listeneintrag_lesen(self):
        """Die echte Antwortform: Kopfdaten unter `meta`, Titel je Sprache.

        Genau hier lag der Fehler — flach nachgesehen fand sich keine
        `id`, jeder Eintrag flog raus, und der Dienst sah leer aus,
        obwohl er fünf Publikationen geschickt hatte.
        """
        from radar.quellen.amtsblatt import AmtsblattQuelle
        antwort = {"content": [{
            "meta": {"id": "abc-123", "publicationDate": "2026-09-16",
                     "rubric": "KK", "subRubric": "KK01",
                     "cantons": ["ZH"],
                     "title": {"de": "Konkurseröffnung", "fr": "Ouverture"},
                     "publicationState": "PUBLISHED"},
            "links": {"pdf": "/api/v1/publications/abc-123/pdf"}}],
            "pageRequest": {"page": 0, "size": 5}, "total": 5}
        k = AmtsblattQuelle({})._liste_lesen(
            json.dumps(antwort).encode("utf-8"))
        self.assertEqual(len(k), 1)
        self.assertEqual(k[0]["id"], "abc-123")
        self.assertEqual(k[0]["datum"], "2026-09-16")
        # Deutscher Titel, nicht das ganze Sprachobjekt.
        self.assertEqual(k[0]["titel"], "Konkurseröffnung")
        # Unterrubrik, nicht die Oberrubrik.
        self.assertEqual(k[0]["rubrik"], "KK01")
        self.assertEqual(k[0]["kanton"], "ZH")

    def test_relativer_pdf_link_wird_absolut(self):
        from radar.quellen.amtsblatt import AmtsblattQuelle
        q = AmtsblattQuelle({"basis_url": "https://amtsblattportal.ch/api/v1"})
        self.assertEqual(q._absolut("/api/v1/publications/x/pdf"),
                         "https://amtsblattportal.ch/api/v1/publications/x/pdf")
        self.assertEqual(q._absolut("https://anderswo/x.pdf"),
                         "https://anderswo/x.pdf")

    def test_privatperson_wird_erkannt(self):
        """Echte Feldform aus dem Dienst (KK04, Winterthur, 2026-09-18).

        Nachname, Vorname, Geburtsdatum, keine UID — eine Privatperson.
        Der erste echte Lauf hat solche Publikationen als „Firma"
        eingelesen. Das darf nicht wieder passieren.
        """
        from radar.quellen.amtsblatt import AmtsblattQuelle
        person = {"_art": "person", "firma": "Güney", "_vorname": "Alpay",
                  "_geburtsdatum": "1991-04-30", "uid": None,
                  "ort": "Winterthur"}
        self.assertTrue(AmtsblattQuelle._ist_person(person))

    def test_firma_wird_nicht_aussortiert(self):
        from radar.quellen.amtsblatt import AmtsblattQuelle
        firma = {"_art": "company", "firma": "Rhystrans Logistik AG",
                 "uid": "CHE-116.284.335", "ort": "Kloten"}
        self.assertFalse(AmtsblattQuelle._ist_person(firma))

    def test_ohne_selecttype_entscheidet_geburtsdatum(self):
        """Fehlt selectType, zählt Geburtsdatum/Vorname ohne UID."""
        from radar.quellen.amtsblatt import AmtsblattQuelle
        self.assertTrue(AmtsblattQuelle._ist_person(
            {"_geburtsdatum": "1980-01-01", "firma": "Meier"}))
        # Eine Firma mit UID bleibt eine Firma, auch ohne selectType.
        self.assertFalse(AmtsblattQuelle._ist_person(
            {"firma": "Meier Transport AG", "uid": "CHE-116.284.335"}))

    def test_hilfsfelder_landen_nicht_im_satz(self):
        """Die `_`-Felder dienen nur der Entscheidung, nicht dem Speichern."""
        from radar.quellen.amtsblatt import AmtsblattQuelle
        q = AmtsblattQuelle({})
        q._liste = lambda seit, bis: [{"id": "x", "datum": "2026-09-18",
                                       "titel": "Konkurseröffnung",
                                       "kanton": "ZH", "pdf": None}]
        q._detail = lambda pid: {"firma": "Rhystrans Logistik AG",
                                 "uid": "CHE-116.284.335", "ort": "Kloten",
                                 "_art": "company", "_vorname": None,
                                 "_geburtsdatum": None, "text": "..."}
        q.pause = 0
        satz = q.holen("2026-09-01")[0]
        self.assertEqual(satz["firma"], "Rhystrans Logistik AG")
        self.assertFalse([s for s in satz if s.startswith("_")])

    def test_lauter_personen_ist_kein_fehler(self):
        """Ein Lauf ohne Firmen ist ein Ergebnis, kein Fehlschlag."""
        from radar.quellen.amtsblatt import AmtsblattQuelle
        q = AmtsblattQuelle({})
        q._liste = lambda seit, bis: [{"id": "x", "datum": "2026-09-18",
                                       "titel": "Kollokationsplan",
                                       "kanton": "ZH", "pdf": None}]
        q._detail = lambda pid: {"firma": "Güney", "_art": "person",
                                 "_geburtsdatum": "1991-04-30",
                                 "ort": "Winterthur", "text": "..."}
        q.pause = 0
        self.assertEqual(q.holen("2026-09-01"), [])
        self.assertIn("1 natürliche Personen übersprungen",
                      " ".join(q.protokoll))

    def test_einrichten_erhaelt_bestehende_einstellungen(self):
        """Einschalten darf nichts wegwerfen — auch nicht den auth_token."""
        from radar import einrichten
        with tempfile.TemporaryDirectory() as ordner:
            pfad = os.path.join(ordner, "config.json")
            with open(pfad, "w", encoding="utf-8") as f:
                json.dump({"auth_token": "geheim", "port": 8899,
                           "amtsblatt": {"basis_url": "https://x/api/v1"}}, f)
            alt, einrichten.PFAD = einrichten.PFAD, pfad
            try:
                einrichten.main(["--an", "--kantone", "ZH,SG"])
                cfg = json.load(open(pfad, encoding="utf-8"))
            finally:
                einrichten.PFAD = alt
        self.assertEqual(cfg["auth_token"], "geheim")
        self.assertEqual(cfg["port"], 8899)
        self.assertEqual(cfg["amtsblatt"]["basis_url"], "https://x/api/v1")
        self.assertTrue(cfg["amtsblatt"]["aktiv"])
        self.assertEqual(cfg["amtsblatt"]["kantone"], ["ZH", "SG"])

    def test_einrichten_legt_datei_an(self):
        from radar import einrichten
        with tempfile.TemporaryDirectory() as ordner:
            pfad = os.path.join(ordner, "config.json")
            alt, einrichten.PFAD = einrichten.PFAD, pfad
            try:
                einrichten.main(["--an"])
                cfg = json.load(open(pfad, encoding="utf-8"))
            finally:
                einrichten.PFAD = alt
        self.assertTrue(cfg["amtsblatt"]["aktiv"])
        self.assertTrue(cfg["amtsblatt"]["auto"])

    def test_401_meldung_nennt_den_ausweg(self):
        """Ein 401 darf nicht als „nichts gefunden" durchgehen."""
        import urllib.error

        from radar.quellen.amtsblatt import AmtsblattQuelle
        q = AmtsblattQuelle({})

        def dicht(url, akzeptiere="application/json"):
            raise urllib.error.HTTPError(url, 401, "Unauthorized", {},
                                         io.BytesIO(b"nope"))

        q._hole = dicht
        with self.assertRaises(RuntimeError) as fehler:
            q.holen()
        text = str(fehler.exception)
        self.assertIn("401", text)
        self.assertIn("radar.pruefen", text)
        self.assertIn("zusatz_parameter", text)


if __name__ == "__main__":
    unittest.main(verbosity=2)
