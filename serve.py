#!/usr/bin/env python3
"""Winziger Webserver für den Atlas.

Liefert den Inhalt von static/ aus, optional hinter HTTP-Basic-Auth. Nur
Standardbibliothek — keine Abhängigkeiten, kein Build.

Einstellungen kommen aus config.json im selben Verzeichnis (siehe
config.example.json). Ohne config.json läuft er auf Port 8899 ohne Passwort,
was für lokales Ausprobieren genau richtig ist.

    python3 serve.py
"""
import base64
import datetime
import hashlib
import email.utils
import hmac
import re
import json
import os
import sys
import threading
import time
import urllib.error
import urllib.parse
import urllib.request
from functools import partial
from html.parser import HTMLParser
import xml.etree.ElementTree as ET
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

BASE = os.path.dirname(os.path.abspath(__file__))
STATIC = os.path.join(BASE, "static")


def load_config():
    pfad = os.path.join(BASE, "config.json")
    cfg = {"host": "0.0.0.0", "port": 8899, "auth_token": ""}
    if os.path.exists(pfad):
        try:
            with open(pfad) as f:
                cfg.update(json.load(f))
        except ValueError as e:
            # Lieber hier sauber abbrechen als mit halber Konfiguration
            # starten — ein fehlendes Anführungszeichen hat das schon einmal
            # zu einer Neustartschleife gemacht.
            sys.exit("config.json ist kein gültiges JSON: %s" % e)
    return cfg


CFG = load_config()

# ---------------------------------------------------------------------------
# Live-Daten: tägliche Schiffsdurchfahrten je Meerenge (IMF PortWatch, offen).
#
# EHRLICH ZUR EINORDNUNG: Handelsdaten in Echtzeit für jedes Land gibt es
# nicht kostenlos. Was es gibt, ist die tägliche Zahl der Durchfahrten je
# Chokepoint — und die ist für diesen Atlas die aussagekräftigste Live-Zahl:
# man sieht unmittelbar, ob eine Enge gemieden wird.
#
# Fällt der Abruf aus, bleibt der Atlas vollständig nutzbar; die Oberfläche
# zeigt dann "LIVE: aus". Kein stiller Ausfall.
# ---------------------------------------------------------------------------

PORTWATCH_URL = os.environ.get(
    "ATLAS_PORTWATCH_URL",
    "https://services9.arcgis.com/weJ1QsnbMYJlCHdG/arcgis/rest/services/"
    "Daily_Chokepoints_Data/FeatureServer/0/query"
    "?where=1%3D1&outFields=portname,date,n_total&resultRecordCount=2000"
    "&orderByFields=date%20DESC&f=json")

# Namen bei PortWatch -> ids im Atlas
CHOKE_NAMEN = {
    "strait of hormuz": "hormuz",
    "bab el-mandeb strait": "babelmandeb",
    "suez canal": "suez",
    "strait of malacca": "malakka",
    "taiwan strait": "taiwan",
    "bosporus strait": "bosporus",
    "panama canal": "panama",
    "strait of gibraltar": "gibraltar",
}

CACHE = os.path.join(BASE, "data", "live.json")
LIVE = {"stand": None, "quelle": "IMF PortWatch", "werte": {}, "fehler": None}


def _cache_laden():
    try:
        with open(CACHE) as f:
            LIVE.update(json.load(f))
    except Exception:
        pass


def _cache_schreiben():
    try:
        os.makedirs(os.path.dirname(CACHE), exist_ok=True)
        tmp = CACHE + ".tmp"
        with open(tmp, "w") as f:
            json.dump(LIVE, f)
        os.replace(tmp, CACHE)
    except OSError:
        pass


def hole_live():
    """Holt die Durchfahrten und legt sie in LIVE ab. Wirft nie."""
    try:
        req = urllib.request.Request(
            PORTWATCH_URL, headers={"User-Agent": "atlas/1.0"})
        with urllib.request.urlopen(req, timeout=25) as r:
            roh = json.loads(r.read().decode("utf-8", "replace"))
    except (urllib.error.URLError, ValueError, OSError) as e:
        LIVE["fehler"] = "%s: %s" % (type(e).__name__, e)
        return False

    merkmale = roh.get("features")
    if not isinstance(merkmale, list):
        LIVE["fehler"] = "Unerwartete Antwort — kein Feld 'features'."
        return False

    # Je Enge den jüngsten Wert UND einen Vergleichswert der Vorwochen
    # sammeln. Ohne Vergleich sagt eine Tageszahl nichts: 61 Schiffe sind
    # nur dann eine Meldung, wenn sonst 90 fahren.
    reihen = {}
    werte, stand = {}, None
    for m in merkmale:
        a = (m or {}).get("attributes") or {}
        name = str(a.get("portname", "")).strip().lower()
        eid = CHOKE_NAMEN.get(name)
        if not eid:
            continue
        datum, n = a.get("date"), a.get("n_total")
        if datum is None or n is None:
            continue
        reihen.setdefault(eid, []).append((datum, float(n)))
        if eid not in werte or datum > werte[eid]["d"]:
            werte[eid] = {"d": datum, "n": round(float(n), 1)}
        stand = max(stand, datum) if stand else datum

    # Vergleichswert: Median der 60 Tage vor dem jüngsten. Median statt
    # Mittelwert, damit einzelne Ausreisser ihn nicht verziehen.
    for eid, reihe in reihen.items():
        reihe.sort(reverse=True)
        vor = sorted(v for _, v in reihe[1:61])
        if len(vor) >= 10:
            m = vor[len(vor) // 2]
            werte[eid]["mittel"] = round(m, 1)
            werte[eid]["tage"] = len(vor)
            if m > 0:
                werte[eid]["abw"] = round((werte[eid]["n"] - m) / m * 100)

    if not werte:
        LIVE["fehler"] = "Antwort enthielt keine bekannten Chokepoints."
        return False
    LIVE.update({"werte": werte, "stand": stand, "fehler": None,
                 "geholt": int(time.time())})
    _cache_schreiben()
    return True


def live_schleife():
    """Einmal beim Start, danach alle sechs Stunden."""
    while True:
        hole_live()
        time.sleep(6 * 3600)


# ---------------------------------------------------------------------------
# Telegram-Kanäle verfolgen und Nachrichten auswerten.
#
# Die Telegram-Bot-API ist kostenlos — anders als das Lesen bei X. Ohne
# Token bleibt diese Ebene schlicht aus, sichtbar und nicht heimlich.
# In config.json:
#
#   "tg_token": "123456:ABC..."   von @BotFather, kostenlos
#
# Ausgewertet wird bewusst simpel und nachvollziehbar: Beiträge werden nach
# Stichworten den Meerengen zugeordnet. Keine Stimmungsanalyse und keine
# Bewertung des Wahrheitsgehalts — das kann eine Stichwortsuche nicht, und so
# zu tun wäre irreführend.
# ---------------------------------------------------------------------------

TG_API = "https://api.telegram.org/bot"

TG_STICH = {
    "hormuz": ["hormuz", "hormus", "persian gulf", "persischer golf"],
    "babelmandeb": ["bab el-mandeb", "bab al-mandab", "bab-el-mandeb",
                    "red sea", "rotes meer", "houthi", "huthi"],
    "suez": ["suez", "suezkanal", "suez canal"],
    "malakka": ["malacca", "malakka"],
    "taiwan": ["taiwan strait", "taiwanstrasse", "taiwan-strasse"],
    "bosporus": ["bosphorus", "bosporus", "dardanelles", "montreux"],
    "panama": ["panama canal", "panamakanal"],
    "gibraltar": ["gibraltar"],
    "daenemark": ["baltic sea", "ostsee", "oresund", "great belt",
                  "danish strait", "shadow fleet", "schattenflotte"],
}

# Ereignisarten. Wonach man tatsächlich Ausschau hält: nicht "wurde die Enge
# erwähnt", sondern "ist dort etwas passiert". Bewusst grobe Stichworte —
# lieber ein Treffer zu viel, den man selbst verwirft, als einer zu wenig.
EREIGNIS_ARTEN = {
    "drohne": ["drone", "drohne", "uav", "usv", "unmanned", "shahed", "kamikaze"],
    "rakete": ["missile", "rakete", "ballistic", "cruise missile", "anti-ship"],
    "explosion": ["explosion", "blast", "detonat", "anschlag", "bomb",
                  "ied", "struck", "hit by"],
    "angriff": ["attack", "angriff", "attacked", "assault", "strike", "airstrike"],
    "mine": ["naval mine", "seemine", "mine laid", "mining"],
    "aufbringung": ["seized", "seizure", "boarded", "beschlagnahm",
                    "aufgebracht", "hijack", "detained vessel"],
    "sperrung": ["blockade", "closed", "gesperrt", "shut down", "suspend"],
    "brand": ["fire on board", "ablaze", "brand", "burning vessel"],
}


# Orte, die in Meldungen vorkommen und die man verorten kann. Bewusst
# überschaubar: lieber wenige sichere Treffer als viele falsche.
ORTE = {
    "yemen": [45.0, 15.5], "jemen": [45.0, 15.5],
    "houthi": [44.2, 15.3], "huthi": [44.2, 15.3],
    "hodeidah": [42.95, 14.80], "hudaydah": [42.95, 14.80],
    "iran": [53.0, 32.0], "bandar abbas": [56.28, 27.18],
    "qeshm": [55.90, 26.85], "kharg": [50.33, 29.25],
    "israel": [34.9, 31.5], "eilat": [34.95, 29.55],
    "saudi": [45.0, 24.0], "riyadh": [46.7, 24.7],
    "uae": [54.4, 24.3], "dubai": [55.3, 25.2], "fujairah": [56.33, 25.13],
    "qatar": [51.2, 25.3], "kuwait": [47.9, 29.3], "iraq": [43.7, 33.2],
    "oman": [57.0, 21.5], "bahrain": [50.55, 26.07],
    "red sea": [38.5, 20.0], "rotes meer": [38.5, 20.0],
    "gulf of aden": [47.0, 12.5], "golf von aden": [47.0, 12.5],
    "persian gulf": [51.5, 27.0], "persischer golf": [51.5, 27.0],
    "suez": [32.45, 30.6], "port said": [32.3, 31.26],
    "black sea": [34.0, 43.5], "schwarzes meer": [34.0, 43.5],
    "crimea": [34.2, 45.2], "krim": [34.2, 45.2],
    "sevastopol": [33.53, 44.62], "odesa": [30.7, 46.5], "odessa": [30.7, 46.5],
    "ukraine": [31.5, 49.0], "russia": [40.0, 55.0], "russland": [40.0, 55.0],
    "taiwan": [121.0, 23.7], "china": [104.0, 35.0],
    "baltic": [19.0, 57.0], "ostsee": [19.0, 57.0],
    # Kriegsorte. Ohne die fiel jede Meldung durch, in der keine Meerenge
    # vorkam — also fast jede: ein Angriff auf Kiew nennt den Bosporus nicht.
    "tehran": [51.39, 35.69], "teheran": [51.39, 35.69],
    "isfahan": [51.68, 32.65], "natanz": [51.73, 33.72],
    "tel aviv": [34.78, 32.08], "jerusalem": [35.21, 31.78],
    "haifa": [35.0, 32.82], "gaza": [34.45, 31.5],
    "lebanon": [35.8, 33.9], "libanon": [35.8, 33.9],
    "beirut": [35.5, 33.89], "hezbollah": [35.5, 33.6],
    "syria": [38.5, 35.0], "syrien": [38.5, 35.0],
    "damascus": [36.3, 33.51], "damaskus": [36.3, 33.51],
    "sanaa": [44.21, 15.37], "aden": [45.03, 12.79],
    "kyiv": [30.52, 50.45], "kiev": [30.52, 50.45], "kiew": [30.52, 50.45],
    "kharkiv": [36.23, 49.99], "charkiw": [36.23, 49.99],
    "donetsk": [37.8, 48.0], "donezk": [37.8, 48.0],
    "zaporizhzhia": [35.14, 47.84], "cherson": [32.62, 46.64],
    "kherson": [32.62, 46.64], "mykolaiv": [31.99, 46.98],
    "moscow": [37.62, 55.75], "moskau": [37.62, 55.75],
    "belgorod": [36.59, 50.6], "kursk": [36.19, 51.73],
    "novorossiysk": [37.77, 44.72], "primorsk": [28.61, 60.36],
    "poland": [19.4, 52.0], "polen": [19.4, 52.0],
    "finland": [25.7, 62.0], "finnland": [25.7, 62.0],
    "estonia": [25.5, 58.8], "estland": [25.5, 58.8],
    "lithuania": [23.9, 55.2], "litauen": [23.9, 55.2],
    "kaliningrad": [20.5, 54.7], "gotland": [18.5, 57.5],
    "sudan": [30.2, 15.6], "port sudan": [37.22, 19.62],
    "mali": [-4.0, 17.0], "niger": [8.1, 17.6],
    "burkina": [-1.6, 12.3], "somalia": [45.0, 5.5],
    "philippines": [122.0, 12.5], "philippinen": [122.0, 12.5],
    "south china sea": [114.0, 13.0], "südchinesisches meer": [114.0, 13.0],
    "spratly": [114.3, 9.7], "scarborough": [117.75, 15.15],
    "korea": [127.5, 37.5], "north korea": [127.5, 40.0],
    "pakistan": [69.3, 30.4], "india": [78.9, 22.0], "indien": [78.9, 22.0],
    "afghanistan": [66.0, 33.9], "venezuela": [-66.6, 6.4],
}

# Welcher Ort gehört zu welchem Kriegsschauplatz. Absichtlich eine flache
# Tabelle über die vorhandenen ORTE — kein zweites Ortsverzeichnis, das man
# getrennt pflegen müsste und das dann auseinanderläuft.
SCHAUPLATZ_ORTE = {
    "nahost": ["iran", "tehran", "teheran", "isfahan", "natanz", "bandar abbas",
               "qeshm", "kharg", "israel", "tel aviv", "jerusalem", "haifa",
               "eilat", "gaza", "lebanon", "libanon", "beirut", "hezbollah",
               "syria", "syrien", "damascus", "damaskus", "iraq", "saudi",
               "riyadh", "uae", "dubai", "fujairah", "qatar", "kuwait", "oman",
               "bahrain", "persian gulf", "persischer golf"],
    "rotesmeer": ["yemen", "jemen", "houthi", "huthi", "hodeidah", "hudaydah",
                  "sanaa", "aden", "red sea", "rotes meer", "gulf of aden",
                  "golf von aden", "suez", "port said", "somalia"],
    "ukraine": ["ukraine", "russia", "russland", "kyiv", "kiev", "kiew",
                "kharkiv", "charkiw", "donetsk", "donezk", "zaporizhzhia",
                "cherson", "kherson", "mykolaiv", "odesa", "odessa", "crimea",
                "krim", "sevastopol", "moscow", "moskau", "belgorod", "kursk",
                "novorossiysk", "black sea", "schwarzes meer"],
    "ostsee": ["baltic", "ostsee", "poland", "polen", "finland", "finnland",
               "estonia", "estland", "lithuania", "litauen", "kaliningrad",
               "gotland", "primorsk"],
    "ostasien": ["taiwan", "china", "philippines", "philippinen",
                 "south china sea", "südchinesisches meer", "spratly",
                 "scarborough", "korea", "north korea"],
    "afrika": ["sudan", "port sudan", "mali", "niger", "burkina"],
}

# Umgedreht, damit die Zuordnung eines Ortes ein Nachschlagen ist.
ORT_SCHAUPLATZ = {ort: sid for sid, orte in SCHAUPLATZ_ORTE.items()
                  for ort in orte}

# Wörter, die auf Herkunft bzw. Ziel hindeuten.
VON_WORTE = ["from", "aus", "von", "launched from", "fired from", "abgefeuert aus"]
NACH_WORTE = ["toward", "towards", "at", "on", "against", "auf", "gegen",
              "richtung", "in the direction of", "struck", "hit"]


def _enthaelt(text, worte):
    return any(re.search(r"\b" + re.escape(w) + r"\b", text) for w in worte)


def orte_finden(text):
    """Liefert (start, ziel) als Koordinaten, soweit erkennbar.

    Sehr einfach gehalten: Es wird geschaut, welches Wort vor einem Ortsnamen
    steht. Steht dort 'from', ist es die Herkunft; steht dort 'toward' oder
    'on', ist es das Ziel. Findet sich nur eines von beidem, bleibt das andere
    offen — dann wird keine Linie gezeichnet, statt etwas zu erfinden.
    """
    t = text.lower()
    # Erst alle Fundstellen sammeln, in Textreihenfolge.
    stellen = []
    for name, pos in ORTE.items():
        for m in re.finditer(r"\b" + re.escape(name) + r"\b", t):
            stellen.append((m.start(), m.end(), pos))
    stellen.sort()

    von = nach = None
    vorheriges_ende = 0
    for start, ende, pos in stellen:
        # Das Rückblickfenster darf NICHT über einen anderen Ortsnamen
        # hinweglesen. Sonst bezog "Missile toward Eilat — Houthi ..." das
        # "toward" auf Houthi, und der Absender wurde zum Ziel erklärt.
        # Satzzeichen begrenzen zusätzlich: über einen Punkt hinweg gehört
        # kein Richtungswort mehr zum folgenden Ort.
        davor = t[max(vorheriges_ende, start - 22):start]
        davor = re.split(r"[.;:—–—]", davor)[-1]
        vorheriges_ende = ende
        # Wortgrenzen sind hier zwingend: "on" steckt in "drone", "at" in
        # "attack". Ohne \b hielt die Suche den Absender fuer das Ziel.
        if _enthaelt(davor, NACH_WORTE) and not nach:
            nach = pos
        elif _enthaelt(davor, VON_WORTE) and not von:
            von = pos
    return von, nach


def ereignisarten(text):
    """Welche Ereignisarten kommen im Text vor?"""
    t = text.lower()
    return [art for art, worte in EREIGNIS_ARTEN.items()
            if any(w in t for w in worte)]


def ort_treffer(text):
    """Der am weitesten vorn stehende Ortsname im Text, samt Koordinate.

    Der erste genannte Ort ist in Meldungen fast immer der, um den es geht —
    spätere Nennungen sind Einordnung ("... wie schon in Syrien").
    """
    t = text.lower()
    bester = None
    for name, pos in ORTE.items():
        i = t.find(name)
        if i < 0:
            continue
        # Wortgrenze prüfen, sonst findet "oman" in "Roman" und "iran" in
        # "Iranian" ist zwar richtig, "mali" in "Somalia" aber nicht.
        if not re.search(r"\b" + re.escape(name) + r"\b", t):
            continue
        if bester is None or i < bester[0]:
            bester = (i, name, pos)
    return (bester[1], bester[2]) if bester else (None, None)


# Fällt kein Ortsname, hilft die genannte Meerenge weiter: "Tanker seized in
# the Strait of Hormuz" nennt kein Land, gehört aber eindeutig in den Golf.
ENGE_SCHAUPLATZ = {
    "hormuz": "nahost", "babelmandeb": "rotesmeer", "suez": "rotesmeer",
    "bosporus": "ukraine", "daenemark": "ostsee", "taiwan": "ostasien",
    "malakka": "ostasien",
}


def schauplatz_von(text):
    """Welcher Kriegsschauplatz? Abgeleitet aus Ort, ersatzweise aus Enge."""
    t = text.lower()
    treffer = []
    for name, sid in ORT_SCHAUPLATZ.items():
        i = t.find(name)
        if i >= 0 and re.search(r"\b" + re.escape(name) + r"\b", t):
            treffer.append((i, sid))
    if treffer:
        return min(treffer)[1]
    for e in zuordnen(text):
        if e in ENGE_SCHAUPLATZ:
            return ENGE_SCHAUPLATZ[e]
    return "sonstige"


def zeit_normieren(roh):
    """Beliebige Zeitangabe auf 'YYYY-MM-DDTHH:MM' bringen.

    RSS liefert RFC-822 ("Tue, 04 Aug 2026 15:51:00 +0000"), Atom liefert
    ISO, die Telegram-Vorschau etwas Drittes. Ungemischt sortiert das nicht
    und ein 24-Stunden-Fenster lässt sich gar nicht erst bilden.
    """
    if not roh:
        return ""
    roh = roh.strip()
    if re.match(r"^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}", roh):
        return roh[:16].replace(" ", "T")
    if re.match(r"^\d{4}-\d{2}-\d{2}$", roh):
        return roh + "T00:00"
    try:
        d = email.utils.parsedate_to_datetime(roh)
    except (TypeError, ValueError):
        return ""
    if d.tzinfo is not None:
        d = d.astimezone(datetime.timezone.utc)
    return d.strftime("%Y-%m-%dT%H:%M")


def anreichern(text, zeit=""):
    """Alles, was sich aus einem Meldungstext ableiten lässt, an einer Stelle.

    Vier Quellenpfade (Bot, Kanalvorschau, RSS, HTML) haben das früher je für
    sich gemacht — der Bot-Pfad hat 'arten' und 'bahn' schlicht vergessen, und
    die Meldung war damit auf der Karte unsichtbar.
    """
    von, nach = orte_finden(text)
    name, pos = ort_treffer(text)
    return {
        "zeit": zeit_normieren(zeit),
        "engen": zuordnen(text),
        "arten": ereignisarten(text),
        "bahn": [von, nach],
        "schauplatz": schauplatz_von(text),
        "ort": pos,
        "ortname": name,
    }


def meldenswert(text):
    """Kommt der Text überhaupt in den Feed?

    Früher galt: nur wenn eine Meerenge im Text steht. Damit fiel praktisch
    jede Kriegsmeldung durch — ein Angriff auf Kiew nennt keine Meerenge.
    Jetzt zählt auch, ob überhaupt ein Ereignis beschrieben wird.
    """
    return bool(ereignisarten(text) or zuordnen(text))


FEED = {"stand": None, "beitraege": [], "konten": [],
        "fehler": "nicht eingerichtet"}
FEED_CACHE = os.path.join(BASE, "data", "feed.json")


def _tg_get(methode, params):
    url = TG_API + CFG["tg_token"] + "/" + methode + "?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers={"User-Agent": "atlas/1.0"})
    with urllib.request.urlopen(req, timeout=35) as r:
        return json.loads(r.read().decode("utf-8", "replace"))


def zuordnen(text):
    """Welche Meerengen kommen in diesem Text vor?"""
    t = text.lower()
    return [eid for eid, worte in TG_STICH.items() if any(w in t for w in worte)]


def hole_feed():
    """Holt neue Telegram-Nachrichten und ordnet sie den Meerengen zu.

    Der Bot sieht nur Kanäle und Gruppen, in denen er selbst Mitglied ist.
    Für einen fremden Kanal, den man nur liest, geht das nicht — dort leitet
    man die interessanten Nachrichten in eine eigene Gruppe weiter, in der
    der Bot sitzt. Das ist der praktikable Weg und kostet nichts.
    """
    web, webfehler = hole_kanaele()
    netz, netzfehler = hole_web()
    web = web + netz
    webfehler = "; ".join(x for x in (webfehler, netzfehler) if x) or None
    if not CFG.get("tg_token"):
        # Ohne Bot ist die Web-Vorschau der einzige laufende Kanal.
        if not web:
            FEED.update({"fehler": webfehler or "nicht eingerichtet",
                         "beitraege": FEED.get("beitraege", [])})
            return False
        return _feed_zusammenfuehren(web, webfehler)
    try:
        d = _tg_get("getUpdates", {
            "offset": FEED.get("offset", 0),
            "timeout": 0,
            "limit": 100,
            "allowed_updates": json.dumps(["message", "channel_post"]),
        })
    except Exception as e:
        FEED.update({"fehler": "%s: %s" % (type(e).__name__, e)})
        return False
    if not d.get("ok"):
        FEED.update({"fehler": str(d.get("description"))[:200]})
        return False

    alt = FEED.get("beitraege", [])
    neu = []
    letzte = FEED.get("offset", 0)
    for u in d.get("result", []):
        letzte = max(letzte, u.get("update_id", 0) + 1)
        m = u.get("channel_post") or u.get("message") or {}
        text = m.get("text") or m.get("caption") or ""
        if not text:
            continue
        chat = m.get("chat") or {}
        eintrag = {
            "id": str(chat.get("id")) + ":" + str(m.get("message_id")),
            "konto": chat.get("title") or chat.get("username") or "Direktnachricht",
            "text": text[:600],
        }
        eintrag.update(anreichern(text, time.strftime(
            "%Y-%m-%dT%H:%M", time.gmtime(m.get("date", time.time())))))
        neu.append(eintrag)
    return _feed_zusammenfuehren(neu + web, webfehler, letzte)


def lage_auswerten():
    """Zählt je Kriegsschauplatz, was in den letzten 24 Stunden ankam.

    Wichtig für die Beschriftung im UI: das hier zählt MELDUNGEN, nicht
    Ereignisse in der Welt. Zwei Kanäle, die dasselbe berichten, ergeben zwei
    Meldungen. Der Wert taugt für den Vergleich mit dem Vortag — nicht als
    Angabe darüber, wie viele Drohnen geflogen sind.
    """
    jetzt = datetime.datetime.now(datetime.timezone.utc)
    grenze24 = (jetzt - datetime.timedelta(hours=24)).strftime("%Y-%m-%dT%H:%M")
    grenze48 = (jetzt - datetime.timedelta(hours=48)).strftime("%Y-%m-%dT%H:%M")

    kacheln = {}
    for b in FEED.get("beitraege", []):
        sid = b.get("schauplatz") or "sonstige"
        k = kacheln.setdefault(sid, {
            "id": sid, "n24": 0, "n48": 0, "gesamt": 0,
            "arten": {}, "engen": [], "letzte": None, "beispiele": [],
        })
        k["gesamt"] += 1
        z = wann(b)
        if z >= grenze24:
            k["n24"] += 1
            for a in b.get("arten") or []:
                k["arten"][a] = k["arten"].get(a, 0) + 1
        elif z >= grenze48:
            k["n48"] += 1
        for e in b.get("engen") or []:
            if e not in k["engen"]:
                k["engen"].append(e)
        if z and (k["letzte"] is None or z > k["letzte"]):
            k["letzte"] = z
        if (b.get("arten") or []) and len(k["beispiele"]) < 3:
            k["beispiele"].append({"zeit": z, "geschaetzt": not b.get("zeit"),
                                   "text": b["text"][:200],
                                   "arten": b["arten"],
                                   "ortname": b.get("ortname"),
                                   "konto": b.get("konto")})

    # Ohne Zeitstempel lässt sich kein Fenster bilden. Das kommt vor (der
    # HTML-Notpfad liefert keine Zeit) und muss sichtbar sein, statt als
    # "nichts passiert" durchzugehen.
    ohne_zeit = sum(1 for b in FEED.get("beitraege", []) if not b.get("zeit"))
    return {"stand": jetzt.strftime("%Y-%m-%dT%H:%M"),
            "kacheln": sorted(kacheln.values(),
                              key=lambda k: (-k["n24"], -k["gesamt"])),
            "ohne_zeit": ohne_zeit,
            "meldungen": len(FEED.get("beitraege", [])),
            "fehler": FEED.get("fehler")}


def wann(b):
    """Der Zeitpunkt, nach dem sortiert und gefiltert wird.

    Nicht jede Quelle liefert einen Zeitstempel: der HTML-Notpfad (eine Seite
    ohne RSS) hat gar keinen, und manche Feeds liefern ein Datum, das sich
    nicht lesen lässt. Solche Meldungen fielen aus jedem Zeitfenster heraus
    und tauchten nur unter "alles" auf — der Monitor sah dann leer aus,
    obwohl Meldungen da waren.

    Ersatzweise gilt deshalb, wann der Server die Meldung zum ersten Mal
    gesehen hat. Das ist NICHT der Zeitpunkt des Ereignisses und wird im UI
    auch nie als solcher ausgegeben — es heisst dort "erstmals gesehen".
    Für die Frage "ist das neu?" taugt es, für "wann ist es passiert?" nicht.
    """
    return b.get("zeit") or b.get("gesehen") or ""


def _feed_zusammenfuehren(neu, webfehler=None, offset=None):
    """Neues mit Bekanntem mischen, doppelte Einträge fallen weg."""
    alt = FEED.get("beitraege", [])
    # Wann wurde welche Meldung zuerst gesehen? Muss über den Abruf hinweg
    # erhalten bleiben — sonst gilt eine bekannte Meldung bei jedem Zyklus
    # wieder als frisch und wandert im Zeitfenster nach vorn.
    frueher = {x["id"]: x.get("gesehen") for x in alt if x.get("gesehen")}
    jetzt = datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M")
    gesehen = set()
    zusammen = []
    for b in neu + alt:
        if b["id"] in gesehen:
            continue
        gesehen.add(b["id"])
        b["gesehen"] = frueher.get(b["id"], b.get("gesehen") or jetzt)
        zusammen.append(b)
    zusammen.sort(key=wann, reverse=True)
    # 120 war zu knapp, sobald mehrere Kanäle laufen: ein 24-Stunden-Fenster
    # wurde abgeschnitten und die Kachelzahlen stimmten nicht mehr.
    zusammen = zusammen[:400]
    for b in neu:
        if b["id"] not in {x["id"] for x in alt}:
            verlauf_zaehlen(wann(b)[:10], b["engen"])
    verlauf_speichern()
    FEED.update({"beitraege": zusammen, "fehler": webfehler,
                 "quelle": "Telegram",
                 "konten": sorted({b["konto"] for b in zusammen}),
                 "stand": wann(zusammen[0]) if zusammen else None})
    if offset is not None:
        FEED["offset"] = offset
    try:
        with open(FEED_CACHE, "w") as f:
            json.dump(FEED, f)
    except OSError:
        pass
    return True


# ---------------------------------------------------------------------------
# Verlauf auswerten: Zeitreihe der Erwähnungen je Meerenge.
#
# Aus einzelnen Nachrichten wird erst dann etwas Verstehbares, wenn man sieht,
# WANN wie viel darüber geschrieben wurde. Ein Ausschlag im Verlauf ist die
# Information — die einzelne Nachricht ist nur der Beleg dazu.
# ---------------------------------------------------------------------------

VERLAUF_DATEI = os.path.join(BASE, "data", "verlauf.json")
VERLAUF = {"tage": {}, "gesamt": 0, "von": None, "bis": None, "quelle": None}


def verlauf_laden():
    try:
        with open(VERLAUF_DATEI) as f:
            VERLAUF.update(json.load(f))
    except Exception:
        pass


def verlauf_speichern():
    try:
        os.makedirs(os.path.dirname(VERLAUF_DATEI), exist_ok=True)
        tmp = VERLAUF_DATEI + ".tmp"
        with open(tmp, "w") as f:
            json.dump(VERLAUF, f)
        os.replace(tmp, VERLAUF_DATEI)
    except OSError:
        pass


def verlauf_zaehlen(datum, engen):
    """Eine Nachricht in die Tageszählung einsortieren."""
    if not datum:
        return
    tag = VERLAUF["tage"].setdefault(datum, {})
    for eid in engen:
        tag[eid] = tag.get(eid, 0) + 1
    VERLAUF["gesamt"] += 1
    if not VERLAUF["von"] or datum < VERLAUF["von"]:
        VERLAUF["von"] = datum
    if not VERLAUF["bis"] or datum > VERLAUF["bis"]:
        VERLAUF["bis"] = datum


def export_einlesen(roh):
    """Verarbeitet einen Telegram-Desktop-Export (JSON).

    Der Export enthält 'messages' mit 'date' und 'text'. Das Textfeld ist
    entweder eine Zeichenkette oder eine Liste aus Stücken und Verweisen —
    beides muss behandelt werden, sonst fehlt jede Nachricht mit einem Link.
    """
    nachrichten = roh.get("messages")
    if not isinstance(nachrichten, list):
        return None, "Kein Feld 'messages' — ist das ein Telegram-Export?"

    def text_von(m):
        t = m.get("text")
        if isinstance(t, str):
            return t
        if isinstance(t, list):
            return "".join(x if isinstance(x, str) else (x or {}).get("text", "")
                           for x in t)
        return ""

    VERLAUF["tage"] = {}
    VERLAUF["gesamt"] = 0
    VERLAUF["von"] = VERLAUF["bis"] = None
    VERLAUF["quelle"] = roh.get("name") or "Telegram-Export"
    treffer = 0
    beispiele = []
    for m in nachrichten:
        text = text_von(m)
        if not text:
            continue
        datum = str(m.get("date") or "")[:10]
        engen = zuordnen(text)
        verlauf_zaehlen(datum, engen)
        if engen:
            treffer += 1
            if len(beispiele) < 60:
                beispiele.append({"id": "exp:" + str(m.get("id")),
                                  "konto": VERLAUF["quelle"],
                                  "zeit": str(m.get("date") or "")[:16],
                                  "text": text[:600], "engen": engen,
                                  "arten": ereignisarten(text),
                     "bahn": orte_finden(text)})
    verlauf_speichern()
    # Die jüngsten Treffer aus dem Verlauf wandern in die Anzeige.
    beispiele.sort(key=lambda b: b["zeit"], reverse=True)
    FEED.update({"beitraege": (beispiele + FEED.get("beitraege", []))[:120],
                 "fehler": None, "quelle": "Telegram-Export",
                 "stand": beispiele[0]["zeit"] if beispiele else None})
    return {"nachrichten": len(nachrichten), "mit_bezug": treffer,
            "von": VERLAUF["von"], "bis": VERLAUF["bis"]}, None


# ---------------------------------------------------------------------------
# Öffentliche Kanäle über die Web-Vorschau mitlesen.
#
# Ein Bot sieht nur, wo er Mitglied ist — in fremden Kanälen geht das nicht.
# Öffentliche Kanäle haben aber eine Vorschauseite unter t.me/s/<name>, die
# ohne Anmeldung die letzten Beiträge zeigt. Genau die wird hier gelesen.
#
# Grenzen, klar benannt: nur öffentliche Kanäle (die mit @name), nur die
# letzten rund 20 Beiträge je Abruf, und keine Garantie — es ist eine
# Webseite, kein zugesicherter Zugang. Für private Kanäle bleibt der Export.
# ---------------------------------------------------------------------------

LEER_TAGS = {"br", "img", "hr", "input", "meta", "link", "source", "wbr"}


class VorschauLeser(HTMLParser):
    """Zieht Text und Zeitstempel aus der Vorschauseite eines Kanals."""

    def __init__(self):
        HTMLParser.__init__(self)
        self.beitraege = []
        self._imText = 0
        self._puffer = []

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        klasse = a.get("class", "")
        if tag == "div" and "tgme_widget_message_text" in klasse:
            self._imText = 1
            self._puffer = []
        elif self._imText:
            # Leere Elemente haben kein schliessendes Gegenstück — sie dürfen
            # den Zähler nicht erhöhen, sonst bleibt der Textblock offen und
            # verschluckt alles Folgende samt Zeitstempel.
            if tag in LEER_TAGS:
                if tag == "br":
                    self._puffer.append(" ")
            else:
                self._imText += 1
        elif tag == "time" and a.get("datetime"):
            # Der Zeitstempel steht im Seitenquelltext NACH dem Text, nicht
            # davor. Er gehört deshalb an den zuletzt gelesenen Beitrag.
            if self.beitraege and not self.beitraege[-1]["zeit"]:
                self.beitraege[-1]["zeit"] = a["datetime"][:16]

    def handle_endtag(self, tag):
        if self._imText:
            self._imText -= 1
            if self._imText == 0:
                # Zeilenumbrüche und Einrückung der Seite zusammenfassen,
                # sonst steht der Beitrag zerrissen im Panel.
                text = " ".join("".join(self._puffer).split())
                if text:
                    self.beitraege.append({"text": text, "zeit": None})

    def handle_data(self, daten):
        if self._imText:
            self._puffer.append(daten)


def kanalname(eingabe):
    """Holt den Kanalnamen aus allem, was man üblicherweise einfügt.

    Erlaubt sind der blosse Name, @Name, ein t.me-Link und Adressen von
    Statistikseiten wie tgstat. Der angezeigte Titel eines Kanals ist dagegen
    kein Name — der hat Leerzeichen und taugt nicht als Adresse.
    """
    t = (eingabe or "").strip()
    if not t:
        return None
    # Aus einer Adresse das letzte Wegstück nehmen.
    if "/" in t:
        teile = [x for x in t.split("?")[0].rstrip("/").split("/") if x]
        # Links auf einen einzelnen Beitrag enden mit dessen Nummer —
        # dann ist der Kanalname das Stück davor.
        while teile and (teile[-1].isdigit() or teile[-1] == "s"):
            teile.pop()
        t = teile[-1] if teile else ""
    t = t.lstrip("@")
    return t if re.match(r"^[A-Za-z0-9_]{3,40}$", t) else None


def hole_kanaele():
    """Liest alle in tg_kanaele eingetragenen öffentlichen Kanäle."""
    kanaele = CFG.get("tg_kanaele") or []
    if not kanaele:
        return [], None
    raus, fehler = [], []
    for eingabe in kanaele[:15]:
        name = kanalname(eingabe)
        if not name:
            fehler.append("Kanal „%s“: daraus kann ich keinen Kanalnamen "
                          "lesen. Erwartet wird der @Name oder ein Link wie "
                          "t.me/name — nicht der angezeigte Titel."
                          % eingabe.strip()[:40])
            continue
        try:
            url = CFG.get("tg_vorschau_url", "https://t.me/s/") + name
            req = urllib.request.Request(url, headers={
                "User-Agent": "Mozilla/5.0 (compatible; atlas/1.0)"})
            with urllib.request.urlopen(req, timeout=25) as r:
                html = r.read().decode("utf-8", "replace")
        except Exception as e:
            fehler.append("%s: %s" % (name, type(e).__name__))
            continue
        leser = VorschauLeser()
        leser.feed(html)
        if not leser.beitraege:
            fehler.append(name + ": keine Beiträge gefunden "
                          "(privater Kanal oder Seite geändert?)")
        for b in leser.beitraege:
            eintrag = {"id": "web:" + name + ":" + (b["zeit"] or ""),
                       "konto": "@" + name,
                       "text": b["text"][:600]}
            eintrag.update(anreichern(b["text"], b["zeit"] or ""))
            raus.append(eintrag)
    return raus, ("; ".join(fehler) if fehler else None)


# ---------------------------------------------------------------------------
# Beliebige Webseiten als Quelle.
#
# Zuerst wird geprüft, ob die Adresse ein RSS- oder Atom-Feed ist. Feeds sind
# dafür gemacht: sauberer Text, echte Zeitstempel, stabile Struktur. Nur wenn
# das nichts hergibt, wird die Seite als HTML durchsucht — das ist immer eine
# Notlösung, weil sich Seitenaufbauten jederzeit ändern.
#
# Viele Seiten, die Beiträge spiegeln, bieten einen Feed an. Meist reicht
# /rss, /feed oder /rss.xml hinter der Adresse.
# ---------------------------------------------------------------------------

class TextLeser(HTMLParser):
    """Sammelt sichtbare Textabschnitte einer Seite."""

    UEBERSPRINGEN = {"script", "style", "nav", "header", "footer", "svg"}

    def __init__(self):
        HTMLParser.__init__(self)
        self.stuecke = []
        self._aus = 0

    def handle_starttag(self, tag, attrs):
        if tag in self.UEBERSPRINGEN:
            self._aus += 1

    def handle_endtag(self, tag):
        if tag in self.UEBERSPRINGEN and self._aus:
            self._aus -= 1

    def handle_data(self, daten):
        if self._aus:
            return
        t = " ".join(daten.split())
        # Kurze Schnipsel sind Menüpunkte und Knöpfe, keine Beiträge.
        if len(t) >= 40:
            self.stuecke.append(t)


def _feed_lesen(roh, quelle):
    """RSS oder Atom auswerten. Gibt None zurück, wenn es keiner ist."""
    try:
        wurzel = ET.fromstring(roh)
    except ET.ParseError:
        return None
    ns = {"a": "http://www.w3.org/2005/Atom"}
    eintraege = wurzel.findall(".//item") or wurzel.findall(".//a:entry", ns)
    if not eintraege:
        return None
    raus = []
    for e in eintraege[:40]:
        def hol(*namen):
            for n in namen:
                k = e.find(n) if not n.startswith("a:") else e.find(n, ns)
                if k is not None and (k.text or "").strip():
                    return " ".join(k.text.split())
            return ""
        titel = hol("title", "a:title")
        text = hol("description", "summary", "a:summary", "a:content")
        # Beschreibungen enthalten oft HTML — Rohtext daraus ziehen.
        if "<" in text:
            leser = TextLeser()
            leser.feed(text)
            text = " ".join(leser.stuecke) or text
        ganz = (titel + " — " + text).strip(" —") if titel else text
        if not ganz:
            continue
        zeit = hol("pubDate", "published", "a:published", "a:updated", "date")
        eintrag = {"id": "web:" + quelle + ":"
                         + (hol("guid", "link", "a:id") or ganz[:40]),
                   "konto": quelle, "text": ganz[:600]}
        eintrag.update(anreichern(ganz, zeit))
        raus.append(eintrag)
    return raus


# ---------------------------------------------------------------------------
# Standardquellen.
#
# Wer den Monitor aufmacht, soll etwas sehen, ohne erst Adressen zu suchen.
# Ausgewählt nach einem Kriterium: berichtet die Quelle laufend und mit
# Ortsangabe über Kampfhandlungen? Nachrichtenagenturen für die Breite,
# Regionalquellen für die Tiefe, Schifffahrtsdienste für die Meerengen.
#
# EHRLICHE EINSCHRÄNKUNG: Diese Adressen sind nach Aufbau und Betreiber
# gewählt, aber von hier aus nicht abrufbar — die Sandbox kommt nicht ins
# offene Netz. Ob ein Feed heute noch existiert, sagt erst der Prüfknopf auf
# der Einstellungsseite. Tote Feeds werden dort namentlich gemeldet, statt
# stillschweigend nichts zu liefern.
#
# Es sind Nachrichtenquellen, keine Aufklärung: sie berichten, was
# veröffentlicht wurde. Mehrere Quellen über dasselbe Ereignis ergeben
# mehrere Meldungen — deshalb zählen die Kacheln Meldungen, nicht Ereignisse.
# ---------------------------------------------------------------------------

STANDARD_QUELLEN = [
    # Breite Abdeckung, alle Schauplätze
    ["https://www.aljazeera.com/xml/rss/all.xml",
     "Al Jazeera — dichteste Berichterstattung aus Nahost"],
    ["https://feeds.bbci.co.uk/news/world/rss.xml",
     "BBC World — Agenturbreite, verlässliche Zeitstempel"],
    ["https://moxie.foxnews.com/google-publisher/world.xml",
     "Fox News World"],
    # Nahost
    ["https://www.timesofisrael.com/feed/",
     "Times of Israel — israelische Sicht, meldet Abschüsse und Einschläge"],
    ["https://www.middleeasteye.net/rss",
     "Middle East Eye — Gegengewicht zur israelischen Sicht"],
    ["https://english.alarabiya.net/tools/rss",
     "Al Arabiya — Golfstaaten"],
    # Ukraine
    ["https://kyivindependent.com/feed/",
     "Kyiv Independent — ukrainische Lage, englisch"],
    ["https://www.understandingwar.org/rss.xml",
     "ISW — tägliche Lagebeurteilung Ukraine und Iran"],
    # Militär und Rüstung, alle Schauplätze
    ["https://www.twz.com/feed",
     "The War Zone — Waffensysteme, Verlegungen, Satellitenbilder"],
    ["https://www.navalnews.com/feed/",
     "Naval News — Flottenbewegungen"],
    # Schifffahrt: der Teil, der die Meerengen betrifft
    ["https://gcaptain.com/feed/",
     "gCaptain — Zwischenfälle in der Handelsschifffahrt"],
    ["https://maritime-executive.com/articles/rss",
     "Maritime Executive — Aufbringungen, Minen, Sperrungen"],
]


def web_quellen():
    """Die tatsächlich abzurufenden Adressen.

    Ohne eigene Eintragung laufen die Standardquellen. Sonst stünde der
    Monitor beim ersten Start leer da und man müsste erst Adressen suchen,
    um zu sehen, ob er überhaupt etwas tut.
    """
    eigene = [u.strip() for u in (CFG.get("web_quellen") or []) if u.strip()]
    if eigene:
        return eigene
    if CFG.get("standard_quellen") is False:
        return []
    return [u for u, _ in STANDARD_QUELLEN]


def hole_web():
    """Liest alle in web_quellen eingetragenen Adressen."""
    quellen = web_quellen()
    if not quellen:
        return [], None
    raus, fehler = [], []
    for url in quellen[:25]:
        url = url.strip()
        if not url.startswith(("http://", "https://")):
            fehler.append(url[:40] + ": muss mit http:// oder https:// beginnen")
            continue
        name = urllib.parse.urlparse(url).netloc or url
        try:
            req = urllib.request.Request(url, headers={
                "User-Agent": "Mozilla/5.0 (compatible; atlas/1.0)",
                "Accept": "application/rss+xml, application/atom+xml, text/html"})
            with urllib.request.urlopen(req, timeout=25) as r:
                roh = r.read(4 * 1024 * 1024)
        except Exception as e:
            fehler.append("%s: %s" % (name, type(e).__name__))
            continue

        eintraege = _feed_lesen(roh, name)
        if eintraege is None:
            # Kein Feed — Seite als Text durchsuchen.
            leser = TextLeser()
            leser.feed(roh.decode("utf-8", "replace"))
            gesehen, eintraege = set(), []
            for t in leser.stuecke[:400]:
                if t in gesehen:
                    continue
                gesehen.add(t)
                # Nicht mehr nur "nennt eine Meerenge" — sonst fällt jede
                # Kriegsmeldung durch, die keinen Kanalnamen enthält.
                if meldenswert(t):
                    # hashlib statt hash(): das eingebaute hash() ist in
                    # Python pro Prozess zufällig gesalzen. Nach jedem
                    # Neustart bekam dieselbe Meldung eine neue Kennung und
                    # stand ein zweites Mal im Feed.
                    kennung = hashlib.md5(t.encode("utf-8")).hexdigest()[:16]
                    eintrag = {"id": "web:" + name + ":" + kennung,
                               "konto": name, "text": t[:600]}
                    eintrag.update(anreichern(t))
                    eintraege.append(eintrag)
            if not eintraege:
                fehler.append(name + ": kein Feed und kein Text mit Bezug gefunden")
        raus.extend(eintraege)
    return raus, ("; ".join(fehler) if fehler else None)


def quellen_pruefen():
    """Sagt für jede eingetragene Quelle, was tatsächlich ankommt.

    Ohne das rät man: "keine Meldungen" kann heissen, dass die Seite nicht
    antwortet, dass sie nichts Auswertbares enthält, oder dass schlicht nichts
    zum Thema drinsteht. Das sind drei verschiedene Probleme.
    """
    berichte = []
    for eingabe in (CFG.get("tg_kanaele") or []):
        name = kanalname(eingabe)
        b = {"quelle": eingabe, "art": "Telegram-Kanal"}
        if not name:
            b["ergebnis"] = "Kein gültiger Kanalname erkennbar."
            berichte.append(b)
            continue
        b["quelle"] = "@" + name
        try:
            url = CFG.get("tg_vorschau_url", "https://t.me/s/") + name
            req = urllib.request.Request(url, headers={
                "User-Agent": "Mozilla/5.0 (compatible; atlas/1.0)"})
            with urllib.request.urlopen(req, timeout=25) as r:
                html = r.read().decode("utf-8", "replace")
                b["status"] = r.status
        except Exception as e:
            b["ergebnis"] = "Nicht erreichbar: %s" % e
            berichte.append(b)
            continue
        leser = VorschauLeser()
        leser.feed(html)
        mit = [x for x in leser.beitraege if meldenswert(x["text"])]
        b["gefunden"] = len(leser.beitraege)
        b["mit_bezug"] = len(mit)
        b["ergebnis"] = (
            "Kanal privat oder nicht öffentlich — die Vorschauseite zeigt "
            "keine Beiträge." if not leser.beitraege else
            "%d Beiträge gelesen, davon %d mit erkennbarem Ereignis."
            % (len(leser.beitraege), len(mit)))
        if leser.beitraege:
            b["beispiel"] = leser.beitraege[0]["text"][:180]
        berichte.append(b)

    for url in web_quellen():
        b = {"quelle": url, "art": "Webseite"}
        try:
            req = urllib.request.Request(url, headers={
                "User-Agent": "Mozilla/5.0 (compatible; atlas/1.0)"})
            with urllib.request.urlopen(req, timeout=25) as r:
                roh = r.read(4 * 1024 * 1024)
                b["status"] = r.status
        except Exception as e:
            b["ergebnis"] = "Nicht erreichbar: %s" % e
            berichte.append(b)
            continue
        eintraege = _feed_lesen(roh, "test")
        if eintraege is not None:
            mit = [x for x in eintraege if x["arten"] or x["engen"]]
            orte = len([x for x in eintraege if x.get("ort")])
            b["ergebnis"] = ("RSS/Atom erkannt: %d Einträge, davon %d mit "
                             "erkennbarem Ereignis und %d mit verortbarem Ort."
                             % (len(eintraege), len(mit), orte))
            if eintraege:
                b["beispiel"] = eintraege[0]["text"][:180]
        else:
            leser = TextLeser()
            leser.feed(roh.decode("utf-8", "replace"))
            mit = [t for t in leser.stuecke if meldenswert(t)]
            b["ergebnis"] = (
                "Kein Feed. %d Textabschnitte gefunden, davon %d mit "
                "erkennbarem Ereignis. %s"
                % (len(leser.stuecke), len(mit),
                   "Die Seite liefert vermutlich erst per JavaScript Inhalte — "
                   "dann hilft nur ein RSS-Feed." if len(leser.stuecke) < 5
                   else ""))
            if leser.stuecke:
                b["beispiel"] = leser.stuecke[0][:180]
        berichte.append(b)
    return berichte


def feed_schleife():
    """Alle zwei Minuten — Telegram kostet nichts."""
    while True:
        hole_feed()
        time.sleep(120)


def _feed_cache_laden():
    try:
        with open(FEED_CACHE) as f:
            FEED.update(json.load(f))
    except Exception:
        pass


_cache_laden()
_feed_cache_laden()
verlauf_laden()


class Handler(SimpleHTTPRequestHandler):
    # Keep-alive: die Seite lädt vier Dateien, darunter die 218 KB grosse
    # Karte. Mit HTTP/1.0 würde für jede eine neue Verbindung aufgebaut.
    protocol_version = "HTTP/1.1"

    def do_GET(self):
        if not self.pruefe_auth():
            return
        pfad = self.path.split("?")[0]
        if pfad == "/einstellungen":
            self.path = "/einstellungen.html"
            return super().do_GET()
        if pfad in ("/api/live", "/api/feed", "/api/verlauf", "/api/zustand",
                    "/api/lage"):
            daten = {"/api/live": LIVE, "/api/feed": FEED,
                     "/api/verlauf": VERLAUF,
                     "/api/lage": lage_auswerten(),
                     "/api/zustand": {
                         "telegram": bool(CFG.get("tg_token")),
                         "kanaele": CFG.get("tg_kanaele") or [],
                         "web": CFG.get("web_quellen") or [],
                         "standard": [{"url": u, "warum": w}
                                      for u, w in STANDARD_QUELLEN],
                         "standard_aktiv":
                             web_quellen() == [u for u, _ in STANDARD_QUELLEN],
                         "passwort": bool(CFG.get("auth_token")),
                         "verlauf": {k: VERLAUF[k] for k in
                                     ("gesamt", "von", "bis", "quelle")},
                     }}[pfad]
            koerper = json.dumps(daten).encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(koerper)))
            self.send_header("Cache-Control", "no-store")
            self.end_headers()
            self.wfile.write(koerper)
            return
        super().do_GET()

    def do_POST(self):
        if not self.pruefe_auth():
            return
        pfad = self.path.split("?")[0]
        laenge = int(self.headers.get("Content-Length") or 0)
        if laenge > 200 * 1024 * 1024:
            return self._antwort({"fehler": "Datei zu gross (max 200 MB)."}, 413)
        roh = self.rfile.read(laenge) if laenge else b""
        try:
            daten = json.loads(roh.decode("utf-8", "replace")) if roh else {}
        except ValueError as e:
            return self._antwort({"fehler": "Kein gültiges JSON: %s" % e}, 400)

        if pfad == "/api/einstellungen":
            token = (daten.get("tg_token") or "").strip()
            # Format grob prüfen, bevor etwas gespeichert wird — ein falsch
            # eingefügter Token führt sonst zu stillem Nichtstun.
            if token and not re.match(r"^\d{6,}:[\w-]{30,}$", token):
                return self._antwort(
                    {"fehler": "Das sieht nicht wie ein Bot-Token aus. "
                               "Erwartet: 123456789:ABCdef…"}, 400)
            neu = dict(CFG)
            # Nur setzen, was mitgeschickt wurde — sonst löscht das Speichern
            # der Kanäle den Bot-Token und umgekehrt.
            if "tg_token" in daten and token:
                neu["tg_token"] = token
            elif "tg_token" in daten and not token and "tg_kanaele" not in daten:
                neu["tg_token"] = ""
            if "web_quellen" in daten:
                neu["web_quellen"] = [u.strip() for u in
                                      (daten.get("web_quellen") or []) if u.strip()]
            if "tg_kanaele" in daten:
                neu["tg_kanaele"] = [k.strip().lstrip("@") for k in
                                     (daten.get("tg_kanaele") or []) if k.strip()]
            pfad_cfg = os.path.join(BASE, "config.json")
            tmp = pfad_cfg + ".tmp"
            with open(tmp, "w") as f:
                json.dump(neu, f, indent=2, ensure_ascii=False)
            os.chmod(tmp, 0o600)
            os.replace(tmp, pfad_cfg)
            CFG.clear()
            CFG.update(neu)
            # Immer neu abrufen, nicht nur bei gesetztem Bot-Token — sonst
            # zeigt die Rückmeldung einen Fehler vom letzten Durchlauf und
            # nicht das Ergebnis dessen, was gerade gespeichert wurde.
            ok = hole_feed()
            return self._antwort({"ok": True, "abruf": ok,
                                  "fehler": FEED.get("fehler")})

        if pfad == "/api/pruefen":
            return self._antwort({"berichte": quellen_pruefen()})

        if pfad == "/api/import":
            bericht, fehler = export_einlesen(daten)
            if fehler:
                return self._antwort({"fehler": fehler}, 400)
            return self._antwort({"ok": True, "bericht": bericht})

        return self._antwort({"fehler": "Unbekannter Pfad"}, 404)

    def _antwort(self, obj, code=200):
        koerper = json.dumps(obj).encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(koerper)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(koerper)

    def do_HEAD(self):
        if not self.pruefe_auth():
            return
        super().do_HEAD()

    def pruefe_auth(self):
        """True, wenn die Anfrage weiterlaufen darf."""
        token = CFG.get("auth_token") or ""
        if not token:
            return True
        kopf = self.headers.get("Authorization", "")
        if kopf.startswith("Basic "):
            try:
                roh = base64.b64decode(kopf[6:]).decode("utf-8", "replace")
            except Exception:
                roh = ""
            # Benutzername ist egal, es zählt das Passwort. compare_digest
            # statt == , damit die Laufzeit nichts über den Token verrät.
            passwort = roh.split(":", 1)[1] if ":" in roh else ""
            if hmac.compare_digest(passwort, token):
                return True
        self.send_response(401)
        self.send_header("WWW-Authenticate", 'Basic realm="Atlas"')
        self.send_header("Content-Length", "0")
        self.end_headers()
        return False

    def end_headers(self):
        # Ohne das zeigt der Browser nach einem Update hartnäckig die alte
        # Fassung. Die Kartendatei darf dagegen liegen bleiben, sie ist gross
        # und ändert sich praktisch nie.
        if self.path.rstrip("/").endswith("world.js"):
            self.send_header("Cache-Control", "public, max-age=86400")
        else:
            self.send_header("Cache-Control", "no-store, must-revalidate")
        super().end_headers()

    def log_message(self, fmt, *args):
        # Zugriffe nicht mitschreiben — journalctl soll lesbar bleiben.
        pass


def main():
    threading.Thread(target=live_schleife, daemon=True).start()
    threading.Thread(target=feed_schleife, daemon=True).start()
    handler = partial(Handler, directory=STATIC)
    srv = ThreadingHTTPServer((CFG["host"], int(CFG["port"])), handler)
    schutz = "mit Passwort" if CFG.get("auth_token") else "OHNE Passwort"
    print("Atlas läuft auf %s:%s (%s)" % (CFG["host"], CFG["port"], schutz))
    print("Live-Daten: IMF PortWatch, Abruf alle 6 h — Status unter /api/live")
    print("Telegram: %s — Status unter /api/feed"
          % ("Bot eingerichtet" if CFG.get("tg_token") else "kein Token"))
    srv.serve_forever()


if __name__ == "__main__":
    main()
