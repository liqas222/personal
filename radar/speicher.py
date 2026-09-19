#!/usr/bin/env python3
"""SQLite-Speicher: Fälle, Duplikaterkennung, Status, Laufprotokoll.

Warum SQLite und nicht eine Datei: der Radar muss wissen, was er schon
gemeldet hat. Ohne das meldet er jeden Tag dieselben Fälle erneut, und die
tägliche Benachrichtigung wird wertlos.

Duplikate werden auf zwei Ebenen erkannt:
  1. Gleiche Fall-Id (gleiche Firma, gleiche Meldungsart, gleiches Datum).
  2. Gleiche Firma mit einer neuen Meldung — das ist kein Duplikat, sondern
     eine Aktualisierung, und wird als solche geführt.
"""
import json
import os
import sqlite3
import time

SCHEMA = """
CREATE TABLE IF NOT EXISTS faelle (
    id              TEXT PRIMARY KEY,
    firma           TEXT NOT NULL,
    firma_schluessel TEXT NOT NULL,
    uid             TEXT,
    ort             TEXT,
    kanton          TEXT,
    publikationsdatum TEXT,
    konkursdatum    TEXT,
    art             TEXT,
    art_text        TEXT,
    zweck           TEXT,
    gruendung       TEXT,
    alter_jahre     INTEGER,
    branche         TEXT,
    assets          TEXT,
    score           INTEGER,
    score_amtlich   INTEGER,
    begruendung     TEXT,
    einschraenkungen TEXT,
    naechster_schritt TEXT,
    konkursamt      TEXT,
    aktenzeichen    TEXT,
    quelle          TEXT,
    quelle_url      TEXT,
    rohtext         TEXT,
    status          TEXT DEFAULT 'Neu',
    notiz           TEXT DEFAULT '',
    erstmals        TEXT,
    zuletzt         TEXT,
    gemeldet        INTEGER DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_schluessel ON faelle(firma_schluessel);
CREATE INDEX IF NOT EXISTS idx_score ON faelle(score);
CREATE INDEX IF NOT EXISTS idx_kanton ON faelle(kanton);

CREATE TABLE IF NOT EXISTS laeufe (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    quelle      TEXT,
    begonnen    TEXT,
    beendet     TEXT,
    gelesen     INTEGER DEFAULT 0,
    neu         INTEGER DEFAULT 0,
    aktualisiert INTEGER DEFAULT 0,
    verworfen   INTEGER DEFAULT 0,
    fehler      TEXT,
    bemerkung   TEXT
);
"""

# Felder, deren Änderung eine Meldung als "wesentlich aktualisiert" gilt.
# Eine geänderte Schreibweise des Orts ist keine Neuigkeit; eine neue
# Meldungsart oder ein gesprungener Score schon.
WESENTLICH = ("art", "score", "konkursdatum", "konkursamt")


def jetzt():
    return time.strftime("%Y-%m-%dT%H:%M:%S")


class Speicher:

    def __init__(self, pfad):
        neu = not os.path.exists(pfad)
        os.makedirs(os.path.dirname(os.path.abspath(pfad)), exist_ok=True)
        self.db = sqlite3.connect(pfad, check_same_thread=False)
        self.db.row_factory = sqlite3.Row
        self.db.executescript(SCHEMA)
        self._nachruesten()
        self.db.commit()
        self.neu_angelegt = neu

    def _nachruesten(self):
        """Spalten ergänzen, die es in älteren Datenbanken noch nicht gibt.

        `CREATE TABLE IF NOT EXISTS` ändert eine vorhandene Tabelle nicht.
        Ohne das hier bekäme eine Datenbank, die schon Fälle enthält, die
        neue Spalte nie — und die Abfrage stürbe mit „no such column".
        Eine bestehende Datenbank wegzuwerfen ist keine Option: daran
        hängt Arbeit.
        """
        vorhanden = {r["name"] for r in
                     self.db.execute("PRAGMA table_info(laeufe)")}
        if "bemerkung" not in vorhanden:
            self.db.execute("ALTER TABLE laeufe ADD COLUMN bemerkung TEXT")

    def schliessen(self):
        self.db.close()

    # -- Schreiben ---------------------------------------------------------

    def aufnehmen(self, fall, klass, bew, schluessel):
        """Einen bewerteten Fall ablegen.

        Gibt zurück, was passiert ist: 'neu', 'aktualisiert' oder 'bekannt'.
        """
        vorher = self.db.execute(
            "SELECT * FROM faelle WHERE id = ?", (fall["id"],)).fetchone()

        assets = (klass["assets_genannt"] + klass["assets_vermutet"])
        daten = {
            "id": fall["id"],
            "firma": fall["firma"],
            "firma_schluessel": schluessel,
            "uid": fall["uid"],
            "ort": fall["ort"],
            "kanton": fall["kanton"],
            "publikationsdatum": fall["publikationsdatum"],
            "konkursdatum": fall["konkursdatum"],
            "art": fall["art"],
            "art_text": fall["art_text"],
            "zweck": fall["zweck"],
            "gruendung": fall["gruendung"],
            "alter_jahre": fall["alter"],
            "branche": klass["branche"],
            "assets": json.dumps(assets, ensure_ascii=False),
            "score": bew["score"],
            "score_amtlich": bew["nur_amtlich"],
            "begruendung": json.dumps(bew["zeilen"], ensure_ascii=False),
            "einschraenkungen": json.dumps(fall.get("einschraenkungen", []),
                                           ensure_ascii=False),
            "naechster_schritt": fall.get("naechster_schritt", ""),
            "konkursamt": fall["konkursamt"],
            "aktenzeichen": fall["aktenzeichen"],
            "quelle": fall["quelle"],
            "quelle_url": fall["quelle_url"],
            "rohtext": fall["rohtext"],
            "zuletzt": jetzt(),
        }

        if vorher is None:
            daten["erstmals"] = daten["zuletzt"]
            daten["status"] = "Neu"
            spalten = ", ".join(daten)
            platz = ", ".join("?" for _ in daten)
            self.db.execute("INSERT INTO faelle (%s) VALUES (%s)"
                            % (spalten, platz), list(daten.values()))
            self.db.commit()
            return "neu"

        # Bekannt — hat sich etwas Wesentliches geändert?
        geaendert = [f for f in WESENTLICH
                     if str(vorher[f if f != "score" else "score"]) !=
                        str(daten[f if f != "score" else "score"])]
        # Den Status des Nutzers NICHT überschreiben: wer einen Fall auf
        # "Verworfen" gesetzt hat, will ihn nicht morgen wieder als "Neu".
        daten.pop("erstmals", None)
        satz = ", ".join("%s = ?" % k for k in daten if k != "id")
        werte = [v for k, v in daten.items() if k != "id"] + [fall["id"]]
        self.db.execute("UPDATE faelle SET %s WHERE id = ?" % satz, werte)
        if geaendert and vorher["status"] in ("Neu", "Aktualisiert"):
            self.db.execute(
                "UPDATE faelle SET status = 'Aktualisiert', gemeldet = 0 "
                "WHERE id = ?", (fall["id"],))
        self.db.commit()
        return "aktualisiert" if geaendert else "bekannt"

    def status_setzen(self, fall_id, status, notiz=None):
        felder = ["status = ?"]
        werte = [status]
        if notiz is not None:
            felder.append("notiz = ?")
            werte.append(notiz)
        werte.append(fall_id)
        self.db.execute("UPDATE faelle SET %s WHERE id = ?"
                        % ", ".join(felder), werte)
        self.db.commit()

    def als_gemeldet_markieren(self, ids):
        self.db.executemany("UPDATE faelle SET gemeldet = 1 WHERE id = ?",
                            [(i,) for i in ids])
        self.db.commit()

    # -- Lesen -------------------------------------------------------------

    def suchen(self, kantone=None, min_score=None, branche=None,
               status=None, nur_ungemeldet=False, limit=500):
        wo, werte = [], []
        if kantone:
            wo.append("kanton IN (%s)" % ",".join("?" * len(kantone)))
            werte.extend(kantone)
        if min_score is not None:
            wo.append("score >= ?")
            werte.append(min_score)
        if branche:
            wo.append("branche = ?")
            werte.append(branche)
        if status:
            wo.append("status = ?")
            werte.append(status)
        if nur_ungemeldet:
            wo.append("gemeldet = 0")
        sql = "SELECT * FROM faelle"
        if wo:
            sql += " WHERE " + " AND ".join(wo)
        sql += " ORDER BY score DESC, publikationsdatum DESC LIMIT ?"
        werte.append(limit)
        return [dict(r) for r in self.db.execute(sql, werte).fetchall()]

    def holen(self, fall_id):
        r = self.db.execute("SELECT * FROM faelle WHERE id = ?",
                            (fall_id,)).fetchone()
        return dict(r) if r else None

    def verwandte(self, schluessel, ausser_id):
        """Andere Meldungen zur selben Firma — für den Verlauf eines Falls."""
        return [dict(r) for r in self.db.execute(
            "SELECT id, art_text, publikationsdatum, score FROM faelle "
            "WHERE firma_schluessel = ? AND id != ? "
            "ORDER BY publikationsdatum DESC", (schluessel, ausser_id))]

    def zahlen(self):
        z = {}
        z["gesamt"] = self.db.execute(
            "SELECT COUNT(*) c FROM faelle").fetchone()["c"]
        z["ueber_schwelle"] = self.db.execute(
            "SELECT COUNT(*) c FROM faelle WHERE score >= 60").fetchone()["c"]
        z["nach_kanton"] = {r["kanton"] or "?": r["c"] for r in self.db.execute(
            "SELECT kanton, COUNT(*) c FROM faelle GROUP BY kanton")}
        z["nach_status"] = {r["status"]: r["c"] for r in self.db.execute(
            "SELECT status, COUNT(*) c FROM faelle GROUP BY status")}
        z["branchen"] = [r["branche"] for r in self.db.execute(
            "SELECT DISTINCT branche FROM faelle ORDER BY branche")]
        return z

    def aufraeumen(self, tage):
        """Fälle löschen, die älter sind als `tage` und unbearbeitet.

        Bearbeitete Fälle (Status ungleich Neu/Aktualisiert/Verworfen)
        bleiben: daran hängt Arbeit, und ihr Verschwinden wäre ein
        Datenverlust. Alles andere ist Vorrat, der irgendwann weg muss.
        """
        import datetime as _dt
        grenze = (_dt.date.today() - _dt.timedelta(days=tage)).isoformat()
        c = self.db.execute(
            "DELETE FROM faelle WHERE COALESCE(publikationsdatum, "
            "substr(erstmals,1,10)) < ? AND status IN "
            "('Neu','Aktualisiert','Verworfen')", (grenze,))
        self.db.commit()
        return c.rowcount

    # -- Laufprotokoll -----------------------------------------------------

    def lauf_beginnen(self, quelle):
        c = self.db.execute(
            "INSERT INTO laeufe (quelle, begonnen) VALUES (?, ?)",
            (quelle, jetzt()))
        self.db.commit()
        return c.lastrowid

    def lauf_beenden(self, lauf_id, gelesen, neu, aktualisiert, verworfen,
                     fehler=None, bemerkung=None):
        """`bemerkung` erklärt ein Ergebnis, das sonst rätselhaft wäre.

        „0 gelesen" ohne Grund ist die nutzloseste Meldung überhaupt: es
        kann heissen, dass nichts da war, dass alles Privatpersonen waren
        oder dass die Feldzuordnung nicht passt. Der Unterschied gehört in
        die Oberfläche, nicht in die Serverkonsole.
        """
        self.db.execute(
            "UPDATE laeufe SET beendet = ?, gelesen = ?, neu = ?, "
            "aktualisiert = ?, verworfen = ?, fehler = ?, bemerkung = ? "
            "WHERE id = ?",
            (jetzt(), gelesen, neu, aktualisiert, verworfen,
             fehler, bemerkung, lauf_id))
        self.db.commit()

    def letzter_lauf(self, quelle=None):
        sql = ("SELECT * FROM laeufe WHERE beendet IS NOT NULL "
               "AND fehler IS NULL")
        werte = []
        if quelle:
            sql += " AND quelle = ?"
            werte.append(quelle)
        sql += " ORDER BY id DESC LIMIT 1"
        r = self.db.execute(sql, werte).fetchone()
        return dict(r) if r else None

    def laeufe(self, limit=20):
        return [dict(r) for r in self.db.execute(
            "SELECT * FROM laeufe ORDER BY id DESC LIMIT ?", (limit,))]
