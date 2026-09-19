# Atlas — Länder und Meerengen finden

Lernwerkzeug für Geografie: Länderquiz auf der Weltkarte in drei Stufen, dazu
ein Meerengen-Quiz, Weltkarte und Meerengen-Detailansicht als Nachschlagewerk.
Siehe `README.md` für Aufbau und Bedienung.

**Der Auslieferungsstand ruft nichts ab.** Kein Konto, kein Schlüssel, keine
Hintergrundschleife. `serve.py` liefert Dateien aus und tut sonst nichts. Was
einmal an Feed, Telegram, PortWatch und Lagebild dranhing, ist entfernt — wer
es zurückholen will, findet es in der Git-Historie, aber nicht in diesem
Stand.

## Zwei Projekte in einem Repo

- **Atlas** (`static/`, `serve.py`) — Länder- und Meerengenquiz, statisch,
  keine Abrufe nach draussen.
- **Konkurs Deal Radar** (`radar/`) — Schweizer Konkursmeldungen bewerten.
  Hängt unter `/radar/` im selben Serverprozess. Eigene README dort.

Warum ein Prozess und nicht zwei Dienste: der Zielserver hat 1 GB RAM, ist
geteilt, und der Funnel zeigt auf genau einen Port. Ein zweiter Dienst
hiesse ein zweiter Port, eine Proxy-Regel und ein zweiter Neustart.

**Der Radar darf den Atlas nie mitreissen.** `serve.py` lädt ihn in einem
try/except; fehlt oder bricht er, läuft der Atlas weiter und sagt es im
Protokoll.

**Regeln, die im Radar gelten** (ausführlich in `radar/README.md`):
- Kontaktempfehlung ausschliesslich ans Konkursamt. Ein Feld für
  Inhaberkontakte existiert nicht — was es nicht gibt, kann man nicht aus
  Versehen benutzen. Ein Test prüft das.
- Vermutete Assets sind als vermutet zu kennzeichnen, immer.
- Ein nicht eingerichteter Quellen-Adapter wirft, statt eine leere Liste zu
  liefern. Sonst sieht ein leerer Lauf aus wie „nichts gefunden".
- Der Score ist eine Sortierhilfe, keine Wertangabe, und jede Zeile nennt
  Punkte, Grund und Herkunft.
- **Keinen verifizierten Live-Zugang behaupten, der keiner ist.** Der
  Amtsblatt-Adapter (`radar/quellen/amtsblatt.py`) läuft inzwischen gegen
  den echten Dienst — geprüft auf dem Server, nicht hier: aus dieser
  Umgebung ist der Host gesperrt. Was geprüft ist und was nicht, steht so
  in `radar/README.md` und gehört dort auch hin.
- **Privatpersonen gehören nicht in die Datenbank.** Ein grosser Teil der
  Konkurs- und Betreibungsrubriken betrifft natürliche Personen — der
  Dienst liefert Nachname, Vorname und Geburtsdatum. `_ist_person()`
  sortiert sie aus, bevor irgendetwas gespeichert wird. Der erste echte
  Lauf holte sie prompt herein und zeigte sie als „Firma"; was gar nicht
  erst gespeichert wird, muss auch nicht geschützt werden.
- **Ein Lauf ohne Firmen ist ein Ergebnis, kein Fehler.** Übersprungene
  Personen werden gezählt und protokolliert; nur wenn gar nichts
  auswertbar war UND keine Person dabei war, wirft der Adapter.
- **Die Antwort des Dienstes ist verschachtelt.** Kopfdaten unter `meta`,
  Titel je Sprache, PDF-Link relativ unter `links.pdf`. Flach nachgesehen
  findet sich keine `id`, jeder Eintrag fliegt raus — und eine
  antwortende Schnittstelle sieht aus wie eine leere. Das hat drei
  Runden gekostet.
- **Der Zweckartikel fehlt in Konkurspublikationen.** Er steht im
  Handelsregister, nicht in der Konkursmeldung. Für die Bewertung ist das
  die wichtigste Angabe — die Lücke wird hingeschrieben, nicht mit
  geratenen Punkten überdeckt.
- **`python3 -m radar.pruefen` ist der Beweis, nicht die Behauptung.** Vier
  Schritte gegen die echte Schnittstelle, nur lesend. Weichen Rubrikcodes
  oder Feldnamen ab, sagt es das und nennt den Eintrag, der zu ändern ist.
- **Einstellungen kriegen einen Befehl, keinen Schnipsel.**
  `python3 -m radar.einrichten --an` statt „trag das in config.json ein".
  Der JSON-Schnipsel wurde genau einmal in die Shell geklebt und ergab
  `amtsblatt:: command not found` — die Einstellung war nicht gesetzt, sah
  aber aus, als wäre etwas passiert. Der Befehl ergänzt die Datei und
  überschreibt sie nicht; `auth_token` und Port bleiben stehen.
- **Abruf standardmässig aus.** `"amtsblatt": {"aktiv": false}` im
  Auslieferungsstand; `auto` (12-Stunden-Schleife) ist eine zweite,
  getrennte Entscheidung. Der Atlas ruft weiterhin nichts ab — die Regel
  „nichts abrufen" gilt unverändert für `static/`.
- **Der Adapter wirft, statt leer zurückzukommen.** Gefundene
  Publikationen ohne auswertbare Firmendaten sind ein Fehler, kein
  Ergebnis — sonst liest sich eine kaputte Feldzuordnung als „heute nichts
  gefunden".
- **Personendaten haben eine Frist.** `loeschfrist_tage` (730) löscht
  unbearbeitete Fälle; bearbeitete bleiben, daran hängt Arbeit.

## Nach jeder Änderung: den Befehl dazuschreiben

Wenn etwas fertig und gepusht ist, gehört **immer** der Befehl in die Antwort,
mit dem es auf den Server kommt — nicht nur die Aussage, dass gepusht wurde.
Ein Push ändert den Droplet nicht, und das hat schon zweimal zu der Frage
geführt, warum sich nichts tut.

```bash
cd /opt/atlas && sudo git pull && sudo systemctl restart atlas && sudo systemctl status atlas --no-pager | head -4
```

Dazu gehört der Hinweis auf **Strg+Shift+R** und die erwartete `BAU`-Kennung
aus der Statusleiste — sonst lässt sich nicht unterscheiden, ob die Änderung
fehlt oder ob der Browser die alte Datei zeigt.

## Grundsätze

- **Keine Abhängigkeiten.** Python nur Standardbibliothek (nur für den
  Kartenbau nötig), JavaScript ohne Framework. Kein Build-Step, kein npm im
  Auslieferungsstand. Das ist Absicht.
- **Muss per Doppelklick laufen.** `static/index.html` ohne Webserver öffnen
  können — deshalb sind die Kartendaten eine `.js`-Datei und kein JSON, das
  erst per `fetch()` geladen werden müsste.
- **Inhalt getrennt von Technik.** Alles Fachliche steht in `static/data.js`.
  Wer eine Meerenge ergänzt, fasst keinen Zeichencode an.
- **Jede Zahl mit Quelle und Jahr.** Ohne Beleg kommt keine Mengenangabe rein.
  Wo die Datenlage dünn ist, wird das hingeschrieben statt geraten.
- **Lagebilder veralten.** Das Feld `lage` in `data.js` ist im UI als schnell
  veraltend markiert und hängt am Standdatum `STAND`. Geografie und Seewege
  bleiben.
- **Nichts abrufen.** Der Auslieferungsstand hat keinen Netzverkehr nach
  draussen. Wer eine Live-Quelle einbauen will, führt damit Ausfälle, Kosten
  und eine Pflegeaufgabe ein — das war schon einmal da und wurde bewusst
  entfernt.

## Fallstricke, die schon zugeschlagen haben

- **Mercator braucht beide Achsen im selben Mass.** Längengrade müssen ins
  Bogenmass, sonst wird die Karte gestaucht. Und die Nord-Süd-Spanne positiv
  halten (`mercY(nord) - mercY(süd)`) — sonst wird der Massstab negativ und die
  Karte spiegelt sich an der Ost-West-Achse.
- **Länder mit `nonzero` füllen, nie mit `evenodd`.** Ein Land besteht aus
  mehreren getrennten Landmassen; bei `evenodd` löschen die sich gegenseitig
  aus und Land und Wasser kippen um.
- **Datumsgrenze.** Ringe von Russland und Fidschi springen zwischen +180 und
  −180. Ohne `entwirre()` zieht jeder Sprung einen Strich quer über die Karte.
- **Nach dem Entwirren den Ring zurückschieben.** Je nachdem, wo ein Ring
  anfängt, schaukelt sich der Versatz um volle 360 Grad auf: Russlands
  Hauptlandmasse lag bei −333 bis −180. Gezeichnet wurde sie nur über die
  Versatzkopie — das Land erschien doppelt — und die Trefferprüfung suchte es
  am falschen Ort. `entwirre()` rückt den Ring am Ende wieder in die Mitte.
- **Am Weltrand anhalten — in BEIDEN Achsen und im projizierten Raum.**
  `begrenzeAufWelt()`. Zwei Anläufe waren nötig: erst war nur die Länge
  begrenzt (man konnte senkrecht komplett von der Karte scrollen), dann in
  Gradzahlen — was die Spannweite beim Ziehen nach oben auf 395 Grad
  aufblies. Der Mercator-Massstab ist in Grad nicht linear, und `view.bbox`
  ist der aus dem Bildschirmrechteck zurückgerechnete sichtbare Bereich,
  nicht das, was man gesetzt hat. Passt die Welt nicht ins Bild: mittig
  setzen. Sonst am Rand anhalten — verschieben, nie verwerfen, sonst klemmt
  das Ziehen fest.
- **Bedienungsfehler mit echten Maus- und Radereignissen prüfen**, nicht
  durch Aufrufen der Funktionen. Die Begrenzung sah in einem Funktionstest
  gut aus und war beim Ziehen trotzdem kaputt.
- **`BAU` in der Statusleiste hochzählen**, wenn etwas ausgeliefert wird.
  Ohne sichtbare Kennung lässt sich nicht unterscheiden, ob eine Änderung
  fehlt oder ob der Browser die alte Datei aus dem Zwischenspeicher zeigt.
- **Leinwand nach jedem Moduswechsel neu messen.** Panel und Quizleiste ändern
  die Grösse des Kartenfelds; ohne `resize()` behält der Canvas seine alte Höhe
  und überdeckt, was darunter eingeblendet wird.
- **Seewege nie von Hand raten.** `tools/seeweg.js` berechnet sie,
  `tools/pruefe_routen.js` prüft sie. Geprüft wird die gezeichnete Kurve, nicht
  die Punktfolge — die beiden weichen voneinander ab, und genau dort steckten
  die Fehler.
- **Die Kurve muss durch ihre Wegpunkte laufen.** Mit der früheren Variante
  über Mittelpunkte schnitt sie Kurven ab und lief über Land, obwohl jeder
  Wegpunkt im Wasser lag. Jetzt Catmull-Rom.
- **Nicht die Grundkarte in jedem Bild neu zeichnen.** 3600 Ringe pro Bild
  ergaben 13 Bilder pro Sekunde. Die Grundkarte liegt auf einer zweiten
  Leinwand und wird nur bei Ausschnittswechsel neu gebaut.
- **Nach jeder Änderung wirklich hinschauen.** `node --check` findet nur
  Syntaxfehler. Karten sind visuell — Screenshot machen und ansehen.

## Länderquiz

- **Die Kartendaten enthalten 245 Einträge, aber keine 245 Länder.** Darunter
  sind Militärstützpunkte (Akrotiri, Guantanamo), eine UN-Pufferzone, ein
  Gletscher, ein Weltraumbahnhof und rund fünfzig abhängige Gebiete. Was
  gefragt werden darf, steht ausdrücklich in `static/laender.js`;
  `tools/pruefe_laender.js` prüft, dass jeder Karteneintrag eingeordnet ist
  und jeder Schlüssel existiert. Nach jeder Änderung laufen lassen.
- **Die Hover-Fläche wird im Quiz NICHT beschriftet.** Der Name stünde sonst
  als Lösung unter dem Mauszeiger und das Spiel wäre wertlos. Hervorhebung
  ja, Name erst nach dem Klick — siehe `zeichneHover()`.
- **Schwierigkeit wird abgeleitet, nicht gesetzt** (`bauRangliste()`): aus der
  tatsächlichen Polygonfläche und dem BIP.
- **Über Ränge rechnen, nicht über Rohwerte.** Quadratgrad gegen Milliarden
  Dollar lässt sich nicht addieren, und Russland verzieht jede lineare Skala.
- **Fehlendes BIP heisst nicht „winzige Volkswirtschaft".** Die WTO führt
  Kuba, Nordkorea und Somalia nicht. Mit einer Null landeten sie zwischen
  Nauru und Monaco unter den schwersten Ländern. Fehlt der Wert, zählt die
  Fläche doppelt.
- **`flaeche` und `echteFlaeche` nicht verwechseln.** Ersteres ist die Summe
  der Umschliessungsrechtecke und entscheidet bei Enklaven, wer einen Klick
  gewinnt. Letzteres ist die echte Polygonfläche und geht in die
  Schwierigkeit ein — dort wäre das Rechteck irreführend, weil Indonesien ein
  riesiges Rechteck aufspannt und doch aus Inseln besteht.
- **Zwergstaaten brauchen den Vorabzoom.** 49 Länder sind bei Weltzoom kleiner
  als ein Pixel. Ohne Zoom ist die Frage nicht schwer, sondern unfair.
- **`[hidden]` allein blendet nichts aus**, wenn eine `display`-Regel
  danebensteht — dann braucht es `#id[hidden]{display:none}`.

## Handel und Abhängigkeit

- Inhalte in `static/handel.js`. **Keine erfundenen Zahlen.** Warenstruktur
  steht als Rangfolge da, nicht in Prozent — belastbare bilaterale Zahlen
  liegen nicht vor, und geraten wäre schlimmer als weggelassen.
- **Eine Linie zu einem Partnerland muss sich selbst erklären.** Beschriftung
  am Ende (Name plus ← → ⇄) und die Legende `bauBogenlegende()` neben der
  Karte. Und ausdrücklich dazu, was sie NICHT sagt: dass ein Land Hauptpartner
  ist, nicht wie viel und nicht womit. Die Warengruppen im Panel sind der
  Gesamthandel des Landes, nicht der mit diesem Partner.
- **Echte Anteile stehen in `static/wto.js`** — erzeugt aus den WTO Trade
  Profiles 2023 durch `tools/wto_lesen.py`, 197 Volkswirtschaften. Die Datei
  wird **nicht von Hand gepflegt**; wer etwas ändern will, ändert das
  Werkzeug und lässt es neu laufen.
- **Bezugsjahr je Land mitführen.** Es ist nicht überall gleich: Japan 2022,
  Saudi-Arabien 2021, einzelne Länder bis zurück zu 2000. Ein pauschales
  „Stand 2022" wäre falsch.
- **Den nicht aufgeschlüsselten Rest mitzeigen.** Bei Saudi-Arabien weist die
  WTO 80,2 % der Ausfuhr als „Other" aus. Ohne diese Angabe liest sich der
  grösste genannte Abnehmer (VAE, 5,1 %) als Hauptabnehmer — das wäre grob
  irreführend.
- **Die EU zählt bei der WTO als EIN Partner** und lässt sich nicht als Linie
  auf ein Land zeichnen. Im Panel steht sie mit Anteil, auf der Karte nicht,
  und die Legende sagt warum.
- **`pypdf` ist eine Bau-Abhängigkeit, keine Laufzeit-Abhängigkeit.** Wie
  `build_map.py`: läuft einmal beim Entwickeln, ausgeliefert wird nur die
  erzeugte `.js`-Datei.
- `ABHAENGIGKEIT` ist die eigentlich wertvolle Angabe (wie stark hängt ein
  Land an einer Enge). Jeder Eintrag nennt, worauf sich der Anteil bezieht,
  und einen Beleg. Wo nichts belegt ist, steht "Anteil nicht belegt".
- Die zweite Reihe der Betroffenen wird **abgeleitet**, nicht gepflegt.
- Live-Abruf (IMF PortWatch) in `serve.py`: fällt er aus, muss das im UI
  sichtbar sein (`LIVE: AUS`) — nie stillschweigend auf Alt-Daten fallen.

## Bedienung — Fallstricke

- **Grenzen dürfen das Verschieben nicht blockieren.** Im Weltbild ist der
  sichtbare Bereich breiter als 360°, weil die Leinwand breiter ist als die
  Karte. Eine harte Obergrenze auf die Spannweite hat deshalb jede
  Ziehbewegung verworfen. Nur ablehnen, wenn der Ausschnitt tatsächlich noch
  grösser wird.
- **Der Ziehen-Merker muss getrennt geführt werden**: beim `click` ist das
  Ziehen längst beendet und `zieht` wieder null.
- **Jedes Ein- und Ausblenden des Infofensters braucht `resize()`.** Sonst
  behält die Leinwand ihre Breite und wird nur verdeckt, statt dass die Karte
  kleiner wird. Galt schon für Panel und Quizleiste — und traf danach die
  Länderauswahl noch einmal.
- **Kein Schaltpult über der Karte.** Ebenen gehören in die Leiste unter den
  Kopf — ein Fenster über der Karte steht genau da, wo man hinschaut.

## Server-Umgebung — geteilter Droplet (falls je deployt wird)

Der Droplet `ubuntu-s-1vcpu-1gb-fra1` (Frankfurt) hostet **mehrere Projekte**:

- **NIEMALS `tailscale serve` ausführen.** Das setzt die Freigabe auf „tailnet
  only" zurück und nimmt das Nachbarprojekt **SwissIntel** (Funnel auf 443,
  App auf `127.0.0.1:8081`) vom Netz. Ist genau einmal so passiert. Wenn
  Tailscale sein muss: nur Funnel, nur **additiv**, nur auf eigenem Port,
  danach `tailscale funnel status` prüfen — SwissIntel muss weiter „Funnel on"
  auf 443 zeigen.
- **Nicht anfassen:** Port 80 (anderer Krypto-Bot), Port 8081 und Funnel 443
  (SwissIntel), alles zu `dolflights.ch`, `/root/swissintel`, die Dienste
  `swissintel-bot` / `swissintel-dash`.
- Infrastruktur-Befehle (Tailscale, fremde systemd-Dienste, Firewall) auf
  diesem geteilten Server **immer erst mit dem Besitzer abklären**.
- Altlast: `/opt/supergehirn` und der Dienst `supergehirn` (Vorgängerprojekt)
  liegen dort eventuell noch. Aufräumen entscheidet der Besitzer.
