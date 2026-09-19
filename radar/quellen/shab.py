#!/usr/bin/env python3
"""SHAB-Adapter — NICHT VERIFIZIERT.

LIES DAS, BEVOR DU DICH DARAUF VERLÄSST
---------------------------------------
Dieser Adapter ist eine Hülle. Er ist **nie gegen den echten Dienst
gelaufen**. In der Umgebung, in der er geschrieben wurde, sind shab.ch,
zefix.admin.ch, opendata.swiss und egant.ch von der Netzrichtlinie
gesperrt (HTTP 403 beim Verbindungsaufbau). Es wäre also gelogen, hier
einen funktionierenden Zugang zu behaupten.

Was das konkret heisst:

* Die Adresse, die Feldnamen und das Antwortformat unten sind eine
  **Annahme**, kein geprüftes Wissen. Sie stehen in der Konfiguration und
  lassen sich ändern, ohne den Code anzufassen.
* Der Adapter meldet sich in der Oberfläche als „nicht verifiziert".
* Bevor er scharf geschaltet wird, gehören zwei Dinge geklärt:
  die tatsächliche Schnittstelle und die Nutzungsbedingungen.

VORGEHEN AUF DEM ZIELRECHNER
----------------------------
1. Nutzungsbedingungen von shab.ch lesen. Ob und wie automatisiert
   abgerufen werden darf, steht dort — nicht hier.
2. Prüfen, ob es einen offiziellen, freien strukturierten Zugang gibt.
   Falls nur kommerzielle Anbieter (z. B. Firmenwatch, Apify) in Frage
   kommen: das ist eine Kostenentscheidung, und der Adapter unten nimmt
   über `basis_url` und `kopfzeilen` auch einen solchen Dienst auf.
3. `radar/config.json` anpassen und einen Probelauf machen.
4. Erst wenn ein Lauf echte Daten liefert, den Adapter in der Oberfläche
   auf „verifiziert" setzen (Feld `verifiziert` in der Konfiguration).

KEIN HTML-SCRAPING
------------------
Dieser Adapter spricht ausschliesslich strukturierte Formate an (JSON oder
XML). Eine Lösung, die HTML-Seiten auseinandernimmt, wäre fragil und
rechtlich heikel — die wird hier bewusst nicht gebaut.
"""
import json
import urllib.error
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET

from .basis import Quelle
from .dateien import _zeile_umlegen, _flach

# Rubriken, die im SHAB Konkurs- und Liquidationsmeldungen tragen.
# Die Kürzel sind eine Annahme und stehen deshalb in der Konfiguration.
STANDARD_RUBRIKEN = ["SB01", "SB02", "SB03", "KK01", "KK02", "KK03",
                     "HR01", "HR02", "HR03"]


class ShabQuelle(Quelle):

    name = "SHAB"
    braucht_zugang = True
    zugang_hinweis = (
        "Nicht verifiziert. Adresse, Felder und Nutzungsbedingungen müssen "
        "auf dem Zielrechner geprüft werden — siehe Kopf von "
        "radar/quellen/shab.py.")

    def __init__(self, cfg):
        self.cfg = cfg or {}
        self.basis_url = self.cfg.get("basis_url", "")
        self.kopfzeilen = self.cfg.get("kopfzeilen", {})
        self.rubriken = self.cfg.get("rubriken", STANDARD_RUBRIKEN)
        self.kantone = self.cfg.get("kantone", [])
        self.verifiziert = bool(self.cfg.get("verifiziert"))
        self.aktiv = bool(self.cfg.get("aktiv"))

    def verfuegbar(self):
        if not self.aktiv:
            return False, ("Adapter ist abgeschaltet. In radar/config.json "
                           "unter \"shab\" aktivieren.")
        if not self.basis_url:
            return False, ("Keine Adresse gesetzt. basis_url in "
                           "radar/config.json eintragen.")
        if not self.verifiziert:
            return False, self.zugang_hinweis
        return True, ""

    def holen(self, seit=None):
        ok, grund = self.verfuegbar()
        if not ok:
            raise RuntimeError(grund)

        felder = {"pageRequest.size": str(self.cfg.get("seitengroesse", 100))}
        if seit:
            felder[self.cfg.get("feld_ab", "publicationDate.start")] = seit
        for r in self.rubriken:
            felder.setdefault("subRubrics", r)
        if self.kantone:
            felder[self.cfg.get("feld_kanton", "cantons")] = \
                ",".join(self.kantone)
        felder.update(self.cfg.get("zusatzfelder", {}))

        url = self.basis_url + ("&" if "?" in self.basis_url else "?") + \
            urllib.parse.urlencode(felder)
        req = urllib.request.Request(url, headers=dict(
            {"User-Agent": "konkurs-deal-radar/1.0",
             "Accept": "application/json, application/xml"},
            **self.kopfzeilen))
        with urllib.request.urlopen(req, timeout=40) as r:
            roh = r.read(20 * 1024 * 1024)
        return self.antwort_lesen(roh)

    def antwort_lesen(self, roh):
        """JSON oder XML in rohe Datensätze umsetzen.

        Getrennt von holen(), damit sich das Format mit einer gespeicherten
        Antwort testen lässt, ohne das Netz zu brauchen — genau so sollte
        der Adapter auf dem Zielrechner zuerst geprüft werden.
        """
        text = roh.decode("utf-8", "replace") if isinstance(roh, bytes) else roh
        text = text.strip()
        raus = []
        if text.startswith("{") or text.startswith("["):
            daten = json.loads(text)
            if isinstance(daten, dict):
                for s in ("content", "items", "publications", "results"):
                    if isinstance(daten.get(s), list):
                        daten = daten[s]
                        break
                else:
                    daten = [daten]
            for e in daten:
                if isinstance(e, dict):
                    d = _zeile_umlegen(_flach(e))
                    if d.get("firma"):
                        d["quelle"] = "SHAB"
                        raus.append(d)
        else:
            wurzel = ET.fromstring(text)
            for e in wurzel.iter():
                if e.tag.split("}")[-1].lower() not in (
                        "publication", "meldung", "item"):
                    continue
                flach = {}
                for kind in e.iter():
                    name = kind.tag.split("}")[-1]
                    if kind.text and kind.text.strip():
                        flach[name] = kind.text.strip()
                d = _zeile_umlegen(flach)
                if d.get("firma"):
                    d["quelle"] = "SHAB"
                    raus.append(d)
        return raus
