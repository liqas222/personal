# Atlas — Länder und Meerengen finden

Ein Lernwerkzeug für Geografie und Geopolitik. Ein Land wird genannt, du
klickst es auf der Weltkarte an. Beim Überfahren leuchtet die Landfläche auf,
aber ohne Namen — der käme sonst als Lösung unter dem Mauszeiger. Nach dem
Klick wird aufgedeckt: richtig oder falsch, wie weit daneben, und was das
Land eigentlich handelt.

**Drei Schwierigkeitsstufen**, abgeleitet statt gesetzt: aus der tatsächlichen
Landfläche und dem Bruttoinlandsprodukt (WTO Trade Profiles 2023). Gross und
wirtschaftlich gewichtig heisst bekannt, klein und abgelegen heisst schwer.

- **Einfach** — 40 Länder, von den Vereinigten Staaten bis Saudi-Arabien
- **Mittel** — 90 Länder
- **Schwer** — alle 194, bis hinunter zu Nauru, San Marino und Tuvalu

Bei Zwergstaaten fährt die Karte vorher in die Region. Ohne das wäre die Frage
nicht schwer, sondern unfair: 49 Länder sind bei Weltzoom kleiner als ein
Pixel.

**Zweite Quizvariante: Meerengen.** „Wo liegt Bab el-Mandeb?" — hier zählt die
Entfernung statt des Ländertreffers, denn eine Meerenge ist eine Stelle und
kein Gebiet.

**Weltkarte und Meerengen** bleiben als Nachschlagewerk erhalten: Klick auf ein
Land zeigt sein Handelsprofil mit echten Anteilen, Klick auf einen Marker
zoomt an die Enge heran, mit Seewegen, Anrainern und wovon wer abhängt.

Enthalten sind neun Nadelöhre: Hormuz, Bab el-Mandeb, Suez, Malakka, Taiwan,
Bosporus/Dardanellen, Panama, Gibraltar, Dänische Meerengen.

## Was NICHT drin ist

Kein Konto, kein Schlüssel, kein Abruf nach draussen, keine laufenden Kosten.
Die Seite besteht aus statischen Dateien. `serve.py` liefert sie aus und tut
sonst nichts — er wird nur gebraucht, wenn die Seite unter einer festen
Adresse und hinter einem Passwort stehen soll.

## Starten

Kein Build, keine Installation, keine Abhängigkeiten:

```bash
python3 -m http.server 8899 --directory static
# dann http://127.0.0.1:8899/ öffnen
```

`static/index.html` lässt sich auch direkt per Doppelklick öffnen — die
Kartendaten liegen bewusst als `.js`-Datei vor und nicht als JSON, damit kein
`fetch()` und damit kein Webserver nötig ist.

Für den Betrieb auf einem Server liegt `serve.py` bei: liefert `static/` aus,
optional hinter HTTP-Basic-Auth (`auth_token` in `config.json`). Ebenfalls nur
Standardbibliothek. Copy-Paste-Befehle stehen in `DEPLOY.md`.

## Aufbau

| Datei | Zweck |
|---|---|
| `static/index.html` | Gerüst und Gestaltung |
| `static/geo.js` | Ringe dekodieren, Mercator-Projektion, Entfernungen |
| `static/data.js` | **Die Inhalte** — Meerengen, Fakten, Seewege, Quellen |
| `static/lagen.js` | **Das Lagebild** — Konflikte, Ziele, Status, Vektoren |
| `static/handel.js` | **Handelsprofile** — Waren, Partner, Abhängigkeitsanteile |
| `static/atlas.js` | Zeichnen auf Canvas, Zoomflug, Klicks, Quiz |
| `static/world.js` | Erzeugte Kartengeometrie (nicht von Hand ändern) |
| `tools/build_map.py` | Erzeugt `world.js` aus den Natural-Earth-Daten |
| `tools/seeweg.js` | Sucht Seewege automatisch durchs Wasser (Autorenwerkzeug) |
| `tools/pruefe_routen.js` | Prüft, ob jede gezeichnete Route im Wasser liegt |
| `data/` | Quelldaten (Natural Earth 1:10 m, Public Domain) |
| `serve.py` | Auslieferung mit optionalem Passwortschutz |
| `deploy/atlas.service` | systemd-Unit |

Reine Standardbibliothek auf beiden Seiten: Python ohne pip, JavaScript ohne
Framework. Die Karte ist handgezeichnetes Canvas, kein Leaflet, kein D3.

## Eine Meerenge ergänzen

Alles Inhaltliche steht in `static/data.js`. Ein Eintrag braucht:

```js
{
  id: "kertsch",
  name: "Strasse von Kertsch",
  kurz: "Kertsch",                  // Beschriftung auf der Weltkarte
  region: "Schwarzes Meer",
  pos: [36.6, 45.3],                // [Längengrad, Breitengrad] des Markers
  zoom: [35.4, 44.6, 37.8, 46.0],   // Ausschnitt der Detailansicht
  breite: "…", menge: "…", anrainer: "…",
  warum: "…", detail: "…", lage: "…", umweg: "…",
  quellen: ["…"],
  orte: [{ t: "UKRAINE", p: [35.0, 45.5], k: "land" }],  // k: land|wasser|stadt|klein
  routen: [{ t: "…", f: "handel", p: [[lon,lat], …] }],  // f: oel|handel
}
```

Wegpunkte einer Route sollten **innerhalb des Zoomausschnitts enden**, sonst
läuft die Pfeilspitze aus dem Bild.

Dazu gehört ein `betroffen`-Block mit den Ländern, die an der Enge hängen —
`kontrolle`, `ausfuhr`, `einfuhr`, jeweils mit `ne` (Name in den Kartendaten)
und `t` (deutsche Beschriftung).

**Wegpunkte nie von Hand raten.** Das ging viermal schief: Routen liefen durch
Iran, über Malaysia und quer durch Lolland. Stattdessen:

```bash
node tools/seeweg.js 53.2 26.2 58.3 25.1     # Start- und Zielpunkt im Wasser
node tools/pruefe_routen.js                  # danach immer prüfen
```

`seeweg.js` legt ein Raster über die Landmasken, sucht den kürzesten Wasserweg
und gibt fertige Wegpunkte aus. `pruefe_routen.js` tastet **genau die Kurve
ab, die gezeichnet wird** — die weicht von der Punktfolge ab, und in dieser
Lücke steckten die letzten Fehler.

Ausgenommen sind Routen mit `kanal: true`: Suez und Panama sind durch Land
gegraben, der Bosporus ist mit 700 m schmaler als die Kartenauflösung. Sie
bekommen beim Zeichnen ein Wasserband untergelegt, damit die Linie nicht wie
ein Fehler aussieht.

## Karte neu bauen

Nur nötig, wenn du Auflösung oder Quelle änderst:

```bash
python3 tools/build_map.py    # data/…topo.json  ->  static/world.js
```

Das Skript dekodiert TopoJSON, rundet auf ein Raster von 0,015° (rund 1,5 km)
und kodiert die Ringe als Differenzen in Textform — sonst wäre die Datei
fünfmal so gross. Winzige Inseln und entartete Splitter (Streifen von einer
Rasterzeile Höhe, die das Runden erzeugt) fallen weg.

**Grenze der Daten:** Natural Earth schneidet sehr schmale Kanäle in den
Länderpolygonen nicht aus. Der Bosporus ist dort massives Land, egal welche
Auflösung — deshalb die `kanal`-Kennzeichnung statt feinerer Daten.

## Bedienung

- **Ziehen** verschiebt die Karte, **Mausrad** zoomt auf den Mauszeiger,
  **Doppelklick** zoomt hinein (mit Shift heraus).
- **Tasten:** `+` / `−` zoomen, `0` zurück zur Übersicht, `Esc` leert die
  Auswahl oder verlässt die Detailansicht.
- Fährt man über ein Land, wird es umrandet und benannt — sonst wäre nicht
  erkennbar, dass Länder überhaupt anklickbar sind.
- Ein Klick ins Meer wählt **nichts** ab. Die Auswahl versehentlich zu
  verlieren war der ärgerlichste Fehlgriff; Leeren geht über den Chip oder
  `Esc`.
- Ein Ziehen, das auf einem Land endet, wählt nichts aus.
- Der Knopf **⟲ ÜBERSICHT** erscheint erst, wenn der Ausschnitt von Hand
  verstellt wurde.

## Länder anklicken

Auf der Lagekarte lässt sich jedes Land anklicken — mehrere gleichzeitig. Für
jedes ausgewählte Land zeigen Bögen die Handelspartner (orange hinaus, blau
herein), das Panel listet Warenstruktur, Partner und die Meerengen, an denen
das Land hängt. Ein Klick ins Meer löscht die Auswahl.

In der Ansicht „Wer hängt daran" laufen dieselben Bögen von der Meerenge zu
den betroffenen Ländern. **Die Dicke des Bogens entspricht der
Abhängigkeit**, und am Land steht der Anteil: Japan bezieht rund 90 % seines
Rohöls über Hormuz, Indien rund 40 % — dieselbe Enge, zwei völlig
verschiedene Lagen.

Zusätzlich wird die **zweite Reihe** eingefärbt: Länder, die nicht selbst an
der Enge hängen, aber an einem Land, das dort hängt. Die Liste wird aus den
Handelspartnern der ersten Reihe abgeleitet, nicht von Hand gepflegt.

## Telegram-Kanäle verfolgen

`serve.py` liest Telegram-Nachrichten und ordnet sie den Meerengen zu. Sie
erscheinen im Detailpanel der jeweiligen Enge. Die Bot-API ist **kostenlos**.

1. Bei `@BotFather` einen Bot anlegen, Token kopieren.
2. In `config.json`: `"tg_token": "123456:ABC…"`
3. Den Bot in eine eigene Gruppe oder einen eigenen Kanal aufnehmen.

**Der Bot sieht nur, wo er selbst Mitglied ist.** Einen fremden Kanal, den du
nur liest, kann er nicht mitlesen — dort leitest du die interessanten
Nachrichten in deine eigene Gruppe weiter, in der der Bot sitzt. Ohne Token
bleibt die Ebene sichtbar leer, der Atlas läuft vollständig weiter.

Die Auswertung ist bewusst eine **Stichwortzuordnung**, keine Bewertung:
eine Nachricht, die „Strait of Hormuz" enthält, landet bei Hormuz. Keine
Stimmungsanalyse und keine Prüfung des Wahrheitsgehalts — das kann eine
Stichwortsuche nicht, und so zu tun wäre irreführend. Deshalb steht an den
Meldungen „ungeprüft".

## Live-Daten und Status

Der Chokepoint-Status ist **nicht mehr nur handgesetzt**: aus den täglichen
Durchfahrten wird die Abweichung vom 60-Tage-Median berechnet. Ein Einbruch
ab 15 % stuft auf Amber, ab 35 % auf Rot. Genommen wird der **schlechtere**
Wert aus Zahl und Handbewertung — die Zahlen sehen den Verkehrseinbruch, die
Bewertung kennt den militärischen Zusammenhang. Im Panel steht, welcher
gewonnen hat.


`serve.py` holt alle sechs Stunden die täglichen Durchfahrten je Meerenge von
**IMF PortWatch** (offen zugänglich) und legt sie unter `/api/live` ab. Die
Zahlen erscheinen unter den Markern und im Detailpanel.

Fällt der Abruf aus, zeigt die Statusleiste `LIVE: AUS` — der Atlas bleibt
vollständig nutzbar, aber der Ausfall ist sichtbar und nicht still. Status
prüfen:

```bash
curl -s http://127.0.0.1/api/live | head -c 300
```

**Grenze:** Bilaterale Handelsdaten in Echtzeit gibt es nicht kostenlos. Die
Warenstruktur und die Abhängigkeitsanteile in `handel.js` sind kuratiert und
mit Quelle versehen, nicht live.

## Ebenen ergänzen

Alles Lagebezogene steht in `static/lagen.js`: `KONFLIKTE` (Theaterflächen als
lon/lat-Ringe), `ZIELE`, `KONTROLLZONEN`, `STATUS` je Meerenge, `VEKTOREN`,
`CALLOUTS`. Eine neue Ebene braucht zusätzlich einen Eintrag in `EBENEN` und
eine Zeichenfunktion in `atlas.js`.

Zwei Regeln für Inhalte dieser Art: nur öffentlich bekannte, seit Jahren
beschriebene Standorte auf Kartenmassstab — nichts Feinkörniges. Und jede
Statuseinstufung ist als Bewertung kenntlich, nicht als Meldung.

## Zu den Inhalten

Geografie und Seewege sind stabil. Die Absätze unter **Lage** sind es nicht —
sie sind im Dashboard deshalb ausdrücklich als schnell veraltend markiert und
tragen ein Standdatum (`STAND` in `data.js`).

Jede Mengenangabe nennt ihre Quelle, meist die *World Oil Transit Chokepoints*
der U.S. Energy Information Administration. Das ist Absicht: Zahlen zu
Meerengen werden in Debatten gern gerundet, verwechselt oder ohne Jahr zitiert.
Wenn hier etwas steht, sollst du es nachschlagen können — auch und gerade dann,
wenn du es anderswo anders gehört hast.
