# Konkurs Deal Radar

Findet in Schweizer Konkurs- und Liquidationsmeldungen die Fälle, bei denen
sich das Nachfragen beim Konkursamt eher lohnt — Firmen mit wahrscheinlich
verwertbaren physischen Assets.

Erreichbar über den Knopf **◧ DEAL RADAR** im Atlas oder direkt unter
`/radar/`.

---

## Was funktioniert und was nicht

Das ist der wichtigste Abschnitt. Eine Zeile, die hier nicht als geprüft
steht, ist nicht geprüft.

| Teil | Stand |
|---|---|
| CSV-Import | **läuft**, getestet |
| JSON-Import (auch verschachtelt) | **läuft**, getestet |
| PDF-Import | **läuft**, sobald `pypdf` installiert ist; Textauswertung getestet |
| Klassierung, Assets, Scoring | **läuft**, 38 Tests |
| SQLite, Duplikate, Status, Laufprotokoll | **läuft**, getestet |
| Weboberfläche mit Filtern | **läuft**, im Browser geprüft |
| CSV- und Excel-Export | **läuft**, getestet |
| Tagesmeldung | **läuft**, getestet |
| **SHAB-Live-Abruf** | **NICHT VERIFIZIERT — siehe unten** |
| Anreicherung aus Firmenwebsites | **nicht gebaut**, bewusst |

### SHAB: warum nicht verifiziert

Der Adapter in `quellen/shab.py` ist nie gegen den echten Dienst gelaufen.
In der Umgebung, in der er entstand, sind `shab.ch`, `zefix.admin.ch`,
`opendata.swiss`, `egant.ch` und die kantonalen Amtsblätter von der
Netzrichtlinie gesperrt (403 beim Verbindungsaufbau). Adresse, Feldnamen
und Antwortformat sind deshalb **Annahmen**, keine Messung.

Er meldet sich in der Oberfläche als „nicht bereit" und verweigert den
Dienst, statt eine leere Liste zurückzugeben — ein nicht eingerichteter
Adapter darf nicht so tun, als habe er nachgesehen und nichts gefunden.

Vor dem Scharfschalten sind drei Dinge zu klären, und zwar in dieser
Reihenfolge:

1. **Nutzungsbedingungen von shab.ch lesen.** Ob und wie automatisiert
   abgerufen werden darf, steht dort.
2. **Schnittstelle bestimmen.** Gibt es einen offiziellen, freien
   strukturierten Zugang? Falls nur kommerzielle Anbieter in Frage kommen,
   ist das eine Kostenentscheidung. Der Adapter nimmt über `basis_url` und
   `kopfzeilen` auch einen solchen Dienst auf.
3. **Mit einer gespeicherten Antwort testen.** `ShabQuelle.antwort_lesen()`
   arbeitet auf Text und braucht kein Netz — damit lässt sich das Format
   prüfen, bevor der erste echte Abruf läuft.

Erst danach in `radar/config.json` `"aktiv": true` und `"verifiziert": true`
setzen.

**Kein HTML-Scraping.** Der Adapter spricht nur strukturierte Formate an.
Eine Lösung, die HTML-Seiten auseinandernimmt, wäre fragil und rechtlich
heikel; die wird hier bewusst nicht gebaut.

---

## Sofort loslegen, ohne jeden Zugang

```bash
# Server starten (liefert Atlas und Radar)
python3 serve.py
# dann http://127.0.0.1:8899/radar/ öffnen

# Beispieldaten laden — über die Oberfläche („Datei importieren")
# oder auf der Kommandozeile:
python3 -m radar.lauf --datei radar/beispiel/konkurse.csv
python3 -m radar.lauf --meldung
```

Die Beispieldatei enthält neun Fälle. Acht davon sind erfunden; der neunte,
**Burger & Simon Montagebau GmbH** (Andwil SG, CHE-113.766.916), ist der
bekannte Testfall.

### Eigene Daten importieren

CSV, JSON oder PDF. Die Spaltennamen sind grosszügig: `Firma`,
`Firmenname`, `name`, `company` und `Schuldner` landen alle im selben Feld.
Semikolon und Komma werden erkannt, ebenso das BOM aus Excel-Exporten.

Nützliche Spalten, alle ausser `Firma` freiwillig:

```
Firma ; UID ; Sitz ; Kanton ; Publikationsdatum ; Meldungsart ;
Zweck ; Gruendungsdatum ; Konkursamt ; Aktenzeichen ; URL ; Text
```

**Der Zweckartikel ist die wichtigste Spalte.** Aus ihm kommen Branche,
vermutete Assets und der grösste Teil des Scores. Ohne ihn bleibt ein Fall
weit unter der Schwelle.

---

## Wie der Score zustande kommt

Der Score ist eine **Sortierhilfe, keine Wertangabe.** Die Gewichte sind
gesetzt, nicht gemessen. Was ein Konkursfall tatsächlich hergibt, steht im
Inventar des Konkursamts und nirgendwo sonst.

Jede Zeile der Bewertung nennt Punkte, Grund und Herkunft des Signals:

```
+30  Branche: Autohandel und Garage (Zweck nennt: garage, motorfahrzeug)
+20  Besteht seit 21 Jahren
+10  Gegenstände im Text genannt: Fahrzeuge
+15  Steigerung oder Verwertung angekündigt — Verwertung läuft
```

### Abweichung von der ursprünglichen Spezifikation

Der Entwurf wollte Punkte dafür vergeben, ob die Firmenwebsite Fahrzeuge
oder Maschinen zeigt (+15), ob ein eigener Standort erkennbar ist (+10), ob
eine Flotte sichtbar ist (+10) und ob mehr als zehn Mitarbeitende öffentlich
auffindbar sind (+10).

Das ist nachgerechnet worden und geht nicht auf:

```
+30  Branche
+20  älter als fünf Jahre
= 50          Schwelle war 60
```

Alles Weitere kommt nur aus der Firmenwebsite — und die ist bei einer
Konkursitin häufig schon abgeschaltet, gerade dann, wenn man sie bräuchte.
So gebaut hätte der Radar fast täglich gemeldet, es gebe nichts.

Deshalb ist der **Zweckartikel aus dem Handelsregister** das Hauptsignal.
Er ist amtlich, immer vorhanden und ergiebig. Die Meldungsart kommt als
zweites Signal dazu: bei einer Steigerung läuft die Verwertung (+15), bei
einer Konkurseröffnung steht sie erst bevor (+5), bei Einstellung mangels
Aktiven ist meist nichts da (−15).

Die Felder für Website-Anreicherung sind im Bewertungscode vorgesehen
(`bewerten(..., anreicherung=...)`), werden aber von keinem Adapter
gefüllt. Wer sie später befüllt, bekommt sie getrennt ausgewiesen — das
Feld `nur_amtlich` zeigt, wie viel des Scores ohne Anreicherung steht.

---

## Rechtliches und Anstand

**Kontakt ausschliesslich zum Konkursamt.** Nach der Konkurseröffnung
gehören die Gegenstände zur Konkursmasse; die früheren Inhaber dürfen nicht
mehr darüber verfügen. Diese Software kennt deshalb **kein Feld für
Inhaberkontakte** — was nicht existiert, kann man nicht aus Versehen
benutzen. Ein Test prüft, dass in keinem erzeugten Text ein Inhaberkontakt
empfohlen wird.

**Fristen nicht verwechseln.** Eine Meldung über Kollokationsplan und
Inventar enthält in der Regel **nicht** die Inventarliste. Die Auflagefrist
ist eine Anfechtungsfrist, keine Gebots- oder Verkaufsfrist. Beide Hinweise
hängen automatisch an jedem betroffenen Fall.

**Nicht alles gehört zur Masse.** Leasing, Miete und Eigentumsvorbehalt
Dritter sind der Normalfall, nicht die Ausnahme. Steht bei jedem Fall dabei.

**Personendaten.** Meldungen über Einzelfirmen enthalten Personennamen. Das
ist Bearbeitung von Personendaten nach DSG. Die Datenbank hat derzeit
**keine automatische Löschfrist** — wer den Radar dauerhaft betreibt,
sollte eine festlegen.

---

## Geplanter Lauf

Der Radar bringt keinen eigenen Scheduler mit, damit sich cron, ein
systemd-Timer, GitHub Actions oder ein Hosting-Scheduler verwenden lassen.

```bash
python3 -m radar.lauf --datei liste.csv     # Datei einlesen
python3 -m radar.lauf --shab                # Adapter abrufen
python3 -m radar.lauf --meldung             # Tagesmeldung ausgeben
python3 -m radar.lauf --meldung --markieren # und als gemeldet markieren
```

Beispiel für täglich um 06:15:

```
15 6 * * *  cd /opt/atlas && python3 -m radar.lauf --shab --meldung >> /var/log/radar.log 2>&1
```

Ein nicht eingerichteter Adapter bricht mit Fehlermeldung ab, statt still
nichts zu tun — sonst merkt niemand, dass der geplante Lauf leerläuft.

---

## Technik

Python-Standardbibliothek, sonst nichts. Kein FastAPI, kein pandas, kein
pydantic — der Zielserver hat 1 GB RAM, ist mit anderen Projekten geteilt,
und der Tailscale-Funnel zeigt auf genau einen Port. So läuft der Radar im
selben Prozess wie der Atlas: ein `git pull`, ein Neustart, fertig.

`pypdf` ist die einzige optionale Abhängigkeit und wird nur für den
PDF-Import gebraucht.

```
radar/
├── app.py            Routen, Export (CSV und XLSX ohne Fremdbibliothek)
├── modell.py         Normalisierung, UID-Prüfziffer, Fall-Id
├── klassierung.py    Branche und Assets aus dem Zweckartikel
├── bewertung.py      Score, Einschränkungen, nächster Schritt
├── speicher.py       SQLite, Duplikate, Status, Laufprotokoll
├── kette.py          Verarbeitungsreihenfolge, Meldungstexte
├── lauf.py           Einstiegspunkt für geplante Läufe
├── quellen/
│   ├── basis.py      Adapter-Schnittstelle
│   ├── dateien.py    CSV, JSON, PDF
│   └── shab.py       NICHT VERIFIZIERT
├── static/           Weboberfläche
├── beispiel/         Beispieldaten
└── tests/            38 Tests, kein Netz nötig
```

### Tests

```bash
python3 radar/tests/test_radar.py      # oder: pytest radar/tests/
```

Laufen ohne Netz und ohne Fremdbibliothek. Was grün ist, ist grün — nicht
„grün, solange eine Schnittstelle antwortet".
