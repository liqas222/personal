# Atlas — Meerengen der Weltpolitik

Ein Lernwerkzeug für Geopolitik: die Karte, die beim Zuhören fehlt. Wo liegt
die Strasse von Hormuz, warum ist sie wichtig, was passiert, wenn sie zugeht —
und wo genau ist das eigentlich auf dem Globus?

Drei Ansichten:

- **Weltkarte** — alle Meerengen als Marker. Klick zoomt an die Enge heran.
- **Meerengen** — dieselben Orte als Liste zum Durchblättern.
- **Quiz** — „Wo liegt Bab el-Mandeb?", du klickst auf die Weltkarte, es misst
  die Entfernung zur richtigen Stelle in Kilometern. Das ist der Teil, von dem
  Geografie tatsächlich hängen bleibt.

Enthalten sind neun Nadelöhre: Hormuz, Bab el-Mandeb, Suez, Malakka, Taiwan,
Bosporus/Dardanellen, Panama, Gibraltar, Dänische Meerengen.

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
| `static/atlas.js` | Zeichnen auf Canvas, Zoomflug, Klicks, Quiz |
| `static/world.js` | Erzeugte Kartengeometrie (nicht von Hand ändern) |
| `tools/build_map.py` | Erzeugt `world.js` aus den Natural-Earth-Daten |
| `tools/seeweg.js` | Sucht Seewege automatisch durchs Wasser (Autorenwerkzeug) |
| `tools/pruefe_routen.js` | Prüft, ob jede gezeichnete Route im Wasser liegt |
| `data/` | Quelldaten (Natural Earth 1:50 m, Public Domain) |
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

## Zu den Inhalten

Geografie und Seewege sind stabil. Die Absätze unter **Lage** sind es nicht —
sie sind im Dashboard deshalb ausdrücklich als schnell veraltend markiert und
tragen ein Standdatum (`STAND` in `data.js`).

Jede Mengenangabe nennt ihre Quelle, meist die *World Oil Transit Chokepoints*
der U.S. Energy Information Administration. Das ist Absicht: Zahlen zu
Meerengen werden in Debatten gern gerundet, verwechselt oder ohne Jahr zitiert.
Wenn hier etwas steht, sollst du es nachschlagen können — auch und gerade dann,
wenn du es anderswo anders gehört hast.
