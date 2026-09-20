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
| Klassierung, Assets, Scoring | **läuft**, 80 Tests |
| SQLite, Duplikate, Status, Laufprotokoll | **läuft**, getestet |
| Weboberfläche mit Filtern | **läuft**, im Browser geprüft |
| CSV- und Excel-Export | **läuft**, getestet |
| Tagesmeldung | **läuft**, getestet |
| **Live-Abruf Amtsblattportal** | **läuft**, gegen den echten Dienst geprüft: 60 Fälle beim ersten 7-Tage-Lauf |
| Zweckartikel aus dem Handelsregister | **läuft**, gegen den echten Dienst geprüft: 38 von 38 gefunden |
| HR-Daten für bestehende Fälle nachtragen | **läuft**, Knopf „HR-Daten nachtragen“ bzw. `--zweck-nachtragen` |
| Verwertungen (Steigerungen) | **läuft**, eigener Bewertungsweg, Filter „◆ NUR VERWERTUNGEN“ |
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
  angenommen und sind nachgezogen: das Aktenzeichen steht in
  `publicationNumber` (`KK04-0000060367` — das ist, was ein Konkursamt am
  Telefon versteht; die interne uuid nicht), Ort ist `town`, Firmenname
  `name`.
* **Feldnamen unterscheiden sich je Rubrik.** Das zuständige Amt heisst
  bei KK04 `registrationOfficeAndCirculationAuthority`, bei KK03 schlicht
  `registrationOffice`. Beide stehen jetzt im Adapter. Ein einzelnes
  Beispiel beweist einen Feldnamen also nicht — und genau deshalb sucht
  sich `radar.pruefen` in Schritt 3 eine **Firma** aus statt einfach die
  erste Publikation zu nehmen: beim ersten Lauf war das eine
  Privatperson, und „UID NICHT GEFUNDEN" las sich wie ein Befund, war
  aber völlig normal.

### Privatpersonen werden übersprungen — ausser bei Verwertungen

Der erste echte Lauf holte **Privatleute** herein — Nachname, Vorname und
**Geburtsdatum** — und zeigte sie als „Firma": `Güney`, `Dljsselbloem`,
`Holgate`. Ein grosser Teil der Konkurs- und Betreibungsrubriken betrifft
natürliche Personen, nicht Betriebe. Das ist abgestellt
(`_ist_person()`), aus zwei Gründen:

1. **Sie gehören nicht zur Aufgabe.** Bei einer Privatperson gibt es
   keine Betriebsausstattung zu verwerten.
2. **Daten über Privatleute, die niemand braucht, gehören nicht in eine
   Datenbank.** Was gar nicht erst gespeichert wird, muss nicht gelöscht,
   geschützt oder verantwortet werden.

**Die Ausnahme sind Steigerungsanzeigen** (`_ist_verwertung()`).
Entscheidend ist nicht, *wen* die Meldung betrifft, sondern *was sie ist*:

| Meldung | Was sie beschreibt | Aufgenommen |
|---|---|---|
| Steigerungsanzeige | eine **Sache**, die öffentlich zum Verkauf steht | ja, auch bei Privatpersonen |
| Schuldenruf, Kollokationsplan, Einstellung über eine Privatperson | die **Person** — keine Sache, dafür ein Geburtsdatum | nein |

Eine Steigerungsanzeige wird publiziert, **damit Bieter kommen**. Sie
aufzunehmen ist genau der Zweck, zu dem sie veröffentlicht wurde. Sie
pauschal wegzuwerfen hiesse, den einzigen öffentlichen Kanal wegzuwerfen,
auf dem Einzelstücke — ein Fahrzeug, eine Uhrensammlung — legal zu haben
sind. Das Geburtsdatum wird auch hier nie gespeichert; ein Test prüft das.

### Verwertungen haben einen eigenen Bewertungsweg

Die Firmenlogik trägt hier nichts: Branche, Zweckartikel und Firmenalter
gibt es bei einer Pfändung gegen eine Privatperson nicht. Dafür gibt es
etwas Besseres — den Gegenstand. Eine Steigerung ist kein Hinweis auf
einen möglichen Deal, sie **ist** der Verkauf, mit Datum und Amt.

```
+30  Öffentliche Steigerung — hier wird verkauft, nicht nur gemeldet
+20  Gegenstände in der Anzeige genannt: Fahrzeuge
---
 50  Steigerung eines Personenwagens (Schwelle 50)
```

Eine Anzeige ohne genannten Gegenstand bleibt bei 30 und damit bewusst
unter der Schwelle: sie ist eine Spur, kein Angebot. Der Filter
**„◆ NUR VERWERTUNGEN"** in der Leiste zeigt sie allein — in einer Liste
voller Konkurseröffnungen gehen sie sonst unter.

Die Gegenstandswörter decken dafür auch Einzelstücke ab (Fahrzeuge,
Wertgegenstände, Boote). Nur eindeutige Wörter: `kunstgegenstand`, nicht
`kunst` — sonst wäre jede **Kunst**stoffverarbeitung ein Treffer, genau
wie „bau" in „Baumwolle". Ein Test hält das fest.

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

### Welcher Zeitraum geholt wird

| Lage | Zeitraum |
|---|---|
| noch nie etwas gelesen | die letzten **30 Tage** (`erstlauf_tage`) |
| es gab schon einen Lauf mit Daten | ab dessen Datum minus **3 Tage** (`ueberlappung_tage`) |
| ausdrücklich gefordert | genau so weit zurück |

Ausdrücklich fordern geht in der Oberfläche über die Auswahl neben „Jetzt
abrufen" (7 / 30 / 90 Tage, ein Jahr) oder auf der Kommandozeile:

```bash
python3 -m radar.lauf --abrufen --tage 90
```

**Hier steckte ein Fehler, der echte Daten gekostet hat.** Die Marke war
der letzte Lauf *ohne Fehler* — und ein kaputter Adapter lief einmal
fehlerfrei durch, las null Sätze und schob die Marke damit auf heute.
Alles davor lag hinter der Marke und wurde nie wieder geholt; jeder
weitere Abruf durchsuchte nur noch den laufenden Tag.

Die Marke ist jetzt der letzte Lauf, der **tatsächlich etwas gelesen
hat** (`letzter_lauf_mit_daten`). Dazu die Überlappung von drei Tagen,
damit nichts verlorengeht, was zwischen zwei Läufen nachgetragen wird —
doppelt Geholtes erkennt die Duplikatprüfung ohnehin.

Jeder Abruf sagt danach, ab wann er gesucht hat: „ab 2026-08-20: 12
gelesen · 12 neu".

### Der Zweckartikel — das Problem und die Lösung

Eine Konkurspublikation nennt **keinen Zweckartikel**. Für die Bewertung
ist er aber die wichtigste Angabe: aus ihm kommen Branche und vermutete
Assets. Der erste echte Lauf zeigte, was das heisst:

```
60 Fälle erfasst · AB SCORE 60: 0
```

Sechzig Firmen gefunden, keine einzige über der Schwelle — weil nur der
Firmenname zu bewerten war.

**Die Lösung liegt in derselben Schnittstelle.** Der Zweck steht im
Handelsregister, und dessen Publikationen sind die Rubriken **HR01–HR03**
desselben Portals. Keine zweite Quelle, kein Zugang, kein Konto — zwei
zusätzliche Anfragen je Firma:

1. HR-Publikationen zur UID suchen,
2. aus der neuesten den `purpose` lesen.

Welcher Parameter die Suche nach einer UID entgegennimmt, ist nicht
dokumentiert. Der Adapter probiert deshalb einmal eine Reihe durch (`uid`,
`companyUid`, `query`, …), merkt sich den, der funktioniert, und fragt ab
dann nur noch damit. `python3 -m radar.pruefen` zeigt in **Schritt 5**,
welcher es beim echten Dienst ist.

Findet keine Variante etwas, bleibt der Zweck leer und der Lauf geht
trotzdem durch — dann hilft nur Score ab 0 und eigenes Sichten.
Abschalten lässt sich die Suche mit `"zweck_nachschlagen": false`.

### Bestehende Fälle nachrüsten

Die HR-Suche kam später dazu als die ersten Läufe. Fälle, die schon in der
Datenbank liegen, bekommen ihre Daten nicht von selbst — dafür gibt es den
Knopf **„HR-Daten nachtragen“** und:

```bash
python3 -m radar.lauf --zweck-nachtragen
```

Nachgetragen werden **Zweck und Gründungsdatum**. Das „und" ist der Punkt:
die erste Fassung suchte nur nach fehlendem Zweck, und nach dem ersten
echten Lauf hatten alle vierzig Fälle einen — also tat sie nichts, obwohl
vielen das Gründungsdatum fehlte. Das sind 20 von 55 Punkten, genug um
einen guten Fall unter der Schwelle zu halten.

Anschliessend wird **neu bewertet**, sonst bliebe der alte Score stehen.
Status und Notiz bleiben unangetastet — daran hängt Arbeit.

Was das ausmacht:

```
vorher:   35  Meier & Co. AG   Gründung —
nachher:  55  Meier & Co. AG   Gründung 2006-01-11 · 20 Jahre
```

**Fälle ohne gültige UID** lassen sich nicht ergänzen — die HR-Suche geht
über die UID. Das steht im Bericht („3 ohne gültige UID"), statt sie
stillschweigend als vollständig zu zählen.

### Wenn die Liste leer aussieht

„Keine Fälle" und „nichts über der Schwelle" sind zwei verschiedene
Lagen. Sind Fälle erfasst, sagt die Oberfläche das jetzt auch — mit der
Zahl, dem Grund und einem Knopf „Alle Fälle zeigen (Score ab 0)". Vorher
stand dort „Importiere eine CSV-Datei", obwohl sechzig Fälle in der
Datenbank lagen.

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

### Die Schwelle war falsch — 50 statt 60

Der erste echte Lauf mit Zweckartikeln: **40 Fälle, keiner über 60.**
Nicht weil nichts dabei war, sondern weil die Schwelle unerreichbar war.

```
+30  Branche erkannt (das stärkste Signal, mehr gibt es nicht)
+20  älter als fünf Jahre
+5   Konkurs eröffnet
---
 55  eine zwanzigjährige Garage am Tag der Konkurseröffnung
```

Die 60 stammen aus der ursprünglichen Spezifikation, in der zusätzlich
**45 Punkte aus der Firmenwebsite** kommen sollten. Diese Anreicherung
wurde gestrichen (siehe unten) — die Schwelle blieb stehen. Das war ein
Fehler: eine Linie, die zu einer Rechnung gehörte, die es nicht mehr gibt.

**50** ist so gewählt, dass „Branche erkannt UND älter als fünf Jahre"
durchkommt. Genau die Kombination, bei der ein Anruf beim Konkursamt sich
lohnt. Die Gewichte sind unverändert; verschoben wurde nur die Linie.

Die Schwelle steht an **einer** Stelle (`bewertung.SCHWELLE`) und wird von
Oberfläche, Zählung und Tagesmeldung von dort geholt.

### Das Gründungsdatum kommt auch aus dem Handelsregister

Das Firmenalter ist 20 von 55 erreichbaren Punkten. In der
Konkurspublikation steht es oft nicht — im Handelsregistereintrag immer,
und den holen wir für den Zweck ohnehin schon. Es wird deshalb aus
derselben Anfrage mitgenommen. Ohne das bliebe eine zwanzigjährige Garage
bei 35 statt 55.

### Der Score filtert nicht mehr, er sortiert

Die Oberfläche startete mit „Score ab 60" als hartem Filter und zeigte
deshalb zweimal eine leere Liste, obwohl Fälle da waren. Das widersprach
dem eigenen Grundsatz — der Score ist eine **Sortierhilfe**. Jetzt startet
sie bei 0, sortiert nach Score, und die Fusszeile sagt, wie viele über der
Schwelle liegen. Wer filtern will, stellt es ein.

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
└── tests/            80 Tests, kein Netz nötig
```

### Tests

```bash
python3 radar/tests/test_radar.py      # oder: pytest radar/tests/
```

Laufen ohne Netz und ohne Fremdbibliothek. Was grün ist, ist grün — nicht
„grün, solange eine Schnittstelle antwortet".
