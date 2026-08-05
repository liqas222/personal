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


def ereignisarten(text):
    """Welche Ereignisarten kommen im Text vor?"""
    t = text.lower()
    return [art for art, worte in EREIGNIS_ARTEN.items()
            if any(w in t for w in worte)]


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
        neu.append({
            "id": str(chat.get("id")) + ":" + str(m.get("message_id")),
            "konto": chat.get("title") or chat.get("username") or "Direktnachricht",
            "zeit": time.strftime("%Y-%m-%dT%H:%M",
                                  time.gmtime(m.get("date", time.time()))),
            "text": text[:600],
            "engen": zuordnen(text),
        })
    return _feed_zusammenfuehren(neu + web, webfehler, letzte)


def _feed_zusammenfuehren(neu, webfehler=None, offset=None):
    """Neues mit Bekanntem mischen, doppelte Einträge fallen weg."""
    alt = FEED.get("beitraege", [])
    gesehen = set()
    zusammen = []
    for b in neu + alt:
        if b["id"] in gesehen:
            continue
        gesehen.add(b["id"])
        zusammen.append(b)
    zusammen.sort(key=lambda b: b["zeit"] or "", reverse=True)
    zusammen = zusammen[:120]
    for b in neu:
        if b["id"] not in {x["id"] for x in alt}:
            verlauf_zaehlen((b["zeit"] or "")[:10], b["engen"])
    verlauf_speichern()
    FEED.update({"beitraege": zusammen, "fehler": webfehler,
                 "quelle": "Telegram",
                 "konten": sorted({b["konto"] for b in zusammen}),
                 "stand": zusammen[0]["zeit"] if zusammen else None})
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
                                  "arten": ereignisarten(text)})
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
            raus.append({"id": "web:" + name + ":" + (b["zeit"] or ""),
                         "konto": "@" + name,
                         "zeit": b["zeit"] or "",
                         "text": b["text"][:600],
                         "engen": zuordnen(b["text"]),
                         "arten": ereignisarten(b["text"])})
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
        raus.append({"id": "web:" + quelle + ":" + (hol("guid", "link", "a:id") or ganz[:40]),
                     "konto": quelle, "zeit": zeit[:25], "text": ganz[:600],
                     "engen": zuordnen(ganz), "arten": ereignisarten(ganz)})
    return raus


def hole_web():
    """Liest alle in web_quellen eingetragenen Adressen."""
    quellen = CFG.get("web_quellen") or []
    if not quellen:
        return [], None
    raus, fehler = [], []
    for url in quellen[:15]:
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
                engen = zuordnen(t)
                if engen:
                    eintraege.append({"id": "web:" + name + ":" + str(hash(t)),
                                      "konto": name, "zeit": "",
                                      "text": t[:600], "engen": engen,
                                      "arten": ereignisarten(t)})
            if not eintraege:
                fehler.append(name + ": kein Feed und kein Text mit Bezug gefunden")
        raus.extend(eintraege)
    return raus, ("; ".join(fehler) if fehler else None)


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
        if pfad in ("/api/live", "/api/feed", "/api/verlauf", "/api/zustand"):
            daten = {"/api/live": LIVE, "/api/feed": FEED,
                     "/api/verlauf": VERLAUF,
                     "/api/zustand": {
                         "telegram": bool(CFG.get("tg_token")),
                         "kanaele": CFG.get("tg_kanaele") or [],
                         "web": CFG.get("web_quellen") or [],
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
