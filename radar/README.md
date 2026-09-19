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
| Klassierung, Assets, Scoring | **läuft**, 64 Tests |
| SQLite, Duplikate, Status, Laufprotokoll | **läuft**, getestet |
| Weboberfläche mit Filtern | **läuft**, im Browser geprüft |
| CSV- und Excel-Export | **läuft**, getestet |
| Tagesmeldung | **läuft**, getestet |
| **Live-Abruf Amtsblattportal** | **läuft**, gegen den echten Dienst geprüft: Trefferliste, Detailabruf und Feldzuordnung liefern echte Fälle. Einschränkung beim Zweckartikel — siehe unten |
| Automatischer Tageslauf | **läuft**, alle 12 Stunden, abschaltbar |
| Löschfrist für Personendaten | **läuft**, 730 Tage, getestet |
| Anreicherung aus Firmenwebsites | **nicht gebaut**, bewusst |

### Live-Abruf: was geprüft ist und was nicht

Die Daten kommen von **`amtsblattportal.ch/api/v1`** — dem gemeinsamen
Portal für das SHAB *und* die angeschlossenen kantonalen Amtsblätter. Damit
sind die Quellen 1 und 2 in einer offenen, strukturierten Schnittstelle
abgedeckt. Kein Schlüssel, kein Konto, kein HTML-Scraping.

```
/api/v1/publications              Trefferliste
/api/v1/publications/{id}/xml     Volltext einer Publikation
/api/v1/publications/{id}/pdf     PDF
/api/v1/rubrics                   Rubrikcodes
```

Rubriken: **KK01** Konkurseröffnung, **KK02** Schuldenruf, **KK03**
Kollokationsplan und Inventar, dazu die SB-Rubriken für Steigerungen.

**Geprüft ist:** der ganze Weg, gegen den echten Dienst — Rubrikliste,
Trefferliste, Detailabruf, Feldzuordnung. Der Adapter liest echte Fälle.
Die Fehlerwege sind zusätzlich gegen nachgebaute Dienste geprüft: falsche
Adresse, Dienst nicht erreichbar, abgelehnte Abfrage, Antwort mit
unerwarteten Feldnamen, Antwort ohne Einträge.

**Nicht geprüft ist** der Dauerbetrieb: ob die Feldnamen über alle zwölf
Konkurs- und sieben Betreibungsrubriken gleich heissen, ist an einer
Handvoll Publikationen gesehen, nicht an allen. Fällt etwas heraus, steht
es im Protokoll unter „Letzter Lauf".

**Was die echten Läufe ergeben haben** (Server, 2026-09-19, drei Runden):

* Die Schnittstelle existiert. `/rubrics` antwortet mit HTTP 200. Die
  Konkursrubriken gehen weiter als angenommen: **KK01 bis KK12**,
  Betreibung **SB01 bis SB07**. Der Adapter nimmt jetzt alle.
* Die Trefferliste wird zugelassen, **sobald `publicationStates=PUBLISHED`
  mitgeschickt wird** — ohne diesen Parameter kommt HTTP 401. Das ist kein
  fehlendes Konto, sondern eine nicht zugelassene Abfrage. Der Parameter
  ist jetzt Vorgabe. Für `www.shab.ch` gilt dasselbe.
* Die Antwort ist `{content, pageRequest, total}`, und ein Eintrag darin
  ist **verschachtelt**: die Kopfdaten liegen unter `meta`, der Titel ist
  ein Objekt mit einem Eintrag je Sprache, der PDF-Link steht unter
  `links.pdf` und ist relativ. Mein Leser sah nur flach nach, fand keine
  `id`, warf jeden Eintrag weg — und der Dienst sah leer aus, obwohl er
  fünf Publikationen geschickt hatte. Behoben: Einträge werden
  flachgeklopft und über den vollen Pfad (`meta.id`) gesucht, der Titel
  auf Deutsch genommen, der PDF-Link absolut gemacht. Zwei Tests halten
  das fest.

* Der Detailabruf liefert die Felder. Sie heissen teils anders als
  angenommen und sind nachgezogen: das zuständige Amt steht in
  `registrationOfficeAndCirculationAuthority` (Klarname zusätzlich in
  `displayName`), das Aktenzeichen in `publicationNumber` (`KK04-0000060367`
  — das ist, was ein Konkursamt am Telefon versteht; die interne uuid
  nicht). Ort ist `town`, Firmenname `name`.

### Privatpersonen werden übersprungen

Der erste echte Lauf holte **Privatleute** herein — Nachname, Vorname und
**Geburtsdatum** — und zeigte sie als „Firma": `Güney`, `Dljsselbloem`,
`Holgate`. Ein grosser Teil der Konkurs- und Betreibungsrubriken betrifft
natürliche Personen, nicht Betriebe.

Das ist abgestellt (`_ist_person()`), aus zwei Gründen:

1. **Sie gehören nicht zur Aufgabe.** Gesucht sind Betriebe mit Maschinen,
   Fahrzeugen und Lager. Bei einer Privatperson gibt es keine
   Betriebsausstattung zu verwerten.
2. **Daten über Privatleute, die niemand braucht, gehören nicht in eine
   Datenbank.** Was gar nicht erst gespeichert wird, muss nicht gelöscht,
   geschützt oder verantwortet werden.

Erkannt wird es am `selectType` des Dienstes und, falls der fehlt, an
Vorname oder Geburtsdatum ohne UID. Übersprungene Publikationen werden
**gezählt und protokolliert** — ein Lauf ohne Firmen ist damit ein
Ergebnis und kein Fehlschlag.

### Welche Kantone — und warum das an der Sprache hängt

`--kantone deutsch` nimmt die 19 deutschsprachigen Kantone: AG, AI, AR,
BE, BL, BS, GL, GR, LU, NW, OW, SG, SH, SO, SZ, TG, UR, ZG, ZH. Bern und
Graubünden sind mehrsprachig, haben aber eine deutschsprachige Mehrheit.

Die Sprache ist hier kein Randthema. Die Klassierung in `klassierung.py`
sucht nach **deutschen Wörtern** — „Garage", „Transport",
„Schweissarbeiten". Bei einer französischen oder italienischen Meldung
greift kein einziges davon: der Fall bekäme Score 0 und fiele still
durch, auch wenn er der beste des Tages wäre. Die Romandie und das Tessin
aufzunehmen wäre also nicht grosszügig, sondern irreführend — sie
erschienen als „nichts dabei".

`--kantone alle` geht trotzdem, wenn du es willst. Dann stehen die
welschen Fälle in der Liste, aber mit Branche „—" und niedrigem Score;
die Vorauswahl trifft dann dein Auge, nicht der Radar.

Ein Tippfehler wird abgewiesen statt übernommen: ein Kanton, den es nicht
gibt, filtert sonst alles weg, und der Radar meldet tagelang „nichts
gefunden".

Die **Kantonsknöpfe in der Oberfläche** kommen aus den Daten — gezeigt
wird, was tatsächlich erfasst ist. Vorher waren sie fest auf sechs
verdrahtet; bei 19 Kantonen wäre der Rest nicht filterbar gewesen.

### Was fehlt: der Zweckartikel

Die Konkurspublikationen enthalten **keinen Zweckartikel**. Der steht im
Handelsregister, nicht in der Konkursmeldung. Für die Bewertung ist das
die wichtigste Angabe — ohne sie tragen nur der Firmenname („… Transport
AG", „Garage …") und der Meldungstext, und viele Fälle bleiben deshalb
unter der Schwelle.

Das ist eine echte Lücke und keine Kleinigkeit. Sie wird hier
hingeschrieben statt mit geratenen Punkten überdeckt.

**Deshalb zuerst das hier ausführen:**

```bash
python3 -m radar.pruefen
```

Das klopft die Schnittstelle in vier Schritten ab und schreibt auf, was
zurückkommt: Rubrikcodes, Trefferliste, die tatsächlichen Feldnamen im
Detail-XML und ein vollständiger Adapterlauf. Weicht etwas ab, steht genau
da, was in `radar/config.json` zu ändern ist. Es schreibt nichts in die
Datenbank.

Wenn etwas beim laufenden Betrieb schiefgeht, steht der Grund in der
Oberfläche unter „Letzter Lauf" und im Serverprotokoll. Ein Abruf, der
nichts findet, ist im Protokoll von einem unterscheidbar, der gescheitert
ist — genau dafür bricht der Adapter mit Fehlermeldung ab, statt eine leere
Liste zu liefern.

### Automatischer Lauf

```bash
python3 -m radar.einrichten --an --kantone deutsch
sudo systemctl restart atlas
```

Der Serverprozess holt dann alle zwölf Stunden die neuen Publikationen seit
dem letzten erfolgreichen Lauf. Ein Fehler beendet die Schleife nicht —
eine Quelle, die heute nicht antwortet, antwortet morgen vielleicht.

| Option | Wirkung |
|---|---|
| (keine) | zeigt nur den aktuellen Stand |
| `--an` | Abruf ein, Tageslauf dazu |
| `--an --kein-auto` | Abruf ein, aber nur über „Jetzt abrufen" |
| `--aus` | Abruf ab |
| `--kantone deutsch` | alle 19 deutschsprachigen Kantone |
| `--kantone alle` | keine Einschränkung, alle 26 |
| `--kantone ZH,SG` | genau diese |
| `--loeschfrist 730` | Tage bis unbearbeitete Fälle wegfallen (0 = nie) |

Der Befehl **ergänzt** `radar/config.json` und überschreibt sie nicht;
Port, `auth_token` und eigene Adressen bleiben stehen. Das ersetzt die
frühere Anleitung „trag diesen JSON-Schnipsel ein" — in eine Shell geklebt
ergab der `amtsblatt:: command not found`, und die Einstellung war nicht
gesetzt, sah aber aus, als wäre etwas passiert.

Wer lieber cron benutzt, nimmt `--an --kein-auto` und ruft
`python3 -m radar.lauf --shab` auf.

### Nutzungsbedingungen

Amtliche Publikationen sind öffentlich. Ob und in welchem Umfang
automatisiert abgerufen werden darf, steht in den Bedingungen des Portals.
Der Adapter hält sich an bescheidene Grenzen — Pause zwischen Anfragen,
Obergrenze je Lauf, erkennbarer User-Agent mit Zweckangabe — aber die
Entscheidung liegt beim Betreiber.

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
ist Bearbeitung von Personendaten nach DSG — und die Konkursrubriken sind
genau die, die ein anderes quelloffenes Projekt für dieselbe Schnittstelle
aus Datenschutzgründen bewusst aussperrt.

Hier werden sie gebraucht, deshalb mit **Löschfrist**: `loeschfrist_tage`
in `radar/config.json`, voreingestellt 730 Tage. Nach jedem Abruf werden
ältere Fälle gelöscht — ausser solchen, an denen gearbeitet wurde
(Status „Inventarliste angefragt", „Besichtigung", „Kontakt empfohlen").
`0` schaltet die Löschung ab; dann ist es eine bewusste Entscheidung.

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
└── tests/            64 Tests, kein Netz nötig
```

### Tests

```bash
python3 radar/tests/test_radar.py      # oder: pytest radar/tests/
```

Laufen ohne Netz und ohne Fremdbibliothek. Was grün ist, ist grün — nicht
„grün, solange eine Schnittstelle antwortet".
