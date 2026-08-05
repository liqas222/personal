# Atlas — Meerengen der Weltpolitik

Lernwerkzeug für Geopolitik: Weltkarte mit den maritimen Nadelöhren, Zoom in
die einzelne Meerenge mit Seewegen und Fakten, dazu ein Quiz zum Verorten.
Siehe `README.md` für Aufbau und Bedienung.

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
- **Lagebilder veralten.** Das Feld `lage` ist im UI als schnell veraltend
  markiert und hängt am Standdatum `STAND`. Geografie und Seewege bleiben.

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

## Lagebild-Ebenen

- Inhalte in `static/lagen.js`, Zeichnen in `atlas.js`, Schaltpult rechts.
- **Nur offene Quellen, nur Kartenmassstab.** Bekannte Standorte benennen ist
  in Ordnung; alles Feinkörnigere gehört nicht hinein.
- **Statuseinstufungen sind Bewertung, keine Meldung** — und müssen im UI als
  solche kenntlich bleiben, samt Datum.
- **Der Status folgt den Zahlen, wo es Zahlen gibt.** `statusVon()` leitet aus
  der Abweichung der Durchfahrten vom 60-Tage-Median einen eigenen Status ab
  und nimmt den **schlechteren** von Zahl und Handbewertung; im Panel steht,
  welcher gewonnen hat. Ein handgesetzter Status allein veraltet unbemerkt —
  genau das war bei Hormuz der Fall.
- **Zwischengespeicherte Live-Werte nie wegwerfen, wenn ein Abruf scheitert.**
  Stattdessen "ABRUF GESTÖRT" dazuschreiben.
- **Der Übungsvermerk neben dem Klassifizierungsbanner bleibt stehen.** Die
  Aufmachung imitiert ein Verschlusssachen-Produkt; ohne den Vermerk wäre die
  Seite ausserhalb des eigenen Bildschirms missverständlich.
- Beim Zoomen die Theaterflächen dämpfen, sonst überdecken sie die Karte.

## Meldungen und Kriegsschauplätze

- **Nie an der Meerenge filtern.** Der Feed liess früher nur Texte durch, in
  denen wörtlich eine Meerenge vorkam (`zuordnen(text) != []`). Damit fiel jede
  Kriegsmeldung durch — ein Angriff auf Kiew nennt keine Meerenge. Genau daran
  lag „gibt noch keine meldungen". Jetzt entscheidet `meldenswert()`:
  Ereignisart **oder** Meerenge.
- **Ein Ort, nicht eine Enge.** Ereignisse werden dort gezeichnet, wo sie
  passiert sind (`b.ort` aus `ort_treffer()`), Enge nur als Rückfall. Vorher
  sass ein Angriff auf Odessa am Bosporus.
- **Ortsnamen brauchen Wortgrenzen.** Ohne `\b` steckt „mali" in „Somalia" und
  „oman" in „Roman". Gilt für `ORTE`, `VON_WORTE` und `NACH_WORTE`.
- **Zeitangaben vereinheitlichen.** RSS liefert RFC-822, Atom ISO, die
  Telegram-Vorschau etwas Drittes. Ungemischt sortiert nichts und ein
  24-Stunden-Fenster lässt sich gar nicht erst bilden — `zeit_normieren()`.
- **Alle Quellenpfade durch `anreichern()`.** Bot, Kanalvorschau, RSS und HTML
  haben das früher je für sich gemacht; der Bot-Pfad hat `arten` und `bahn`
  schlicht vergessen und seine Meldungen waren auf der Karte unsichtbar.
- **Die Kacheln zählen Meldungen, nicht Ereignisse.** Zwei Kanäle über denselben
  Angriff ergeben zwei Meldungen. Der Vergleich mit dem Vortag ist belastbar,
  die absolute Zahl nicht — und das steht im UI auch so da.
- **Der Kachelstatus folgt den Zahlen** (`lageStatus()`), nie von Hand gesetzt.
- **Wer den Server hier lokal testet**, braucht `NO_PROXY=127.0.0.1` und muss
  wissen, dass der erste `hole_feed()`-Lauf startet, bevor der eigene Socket
  lauscht — eine Stub-Quelle auf demselben Server geht im ersten Zyklus leer aus.

## Handel und Abhängigkeit

- Inhalte in `static/handel.js`. **Keine erfundenen Zahlen.** Warenstruktur
  steht als Rangfolge da, nicht in Prozent — belastbare bilaterale Zahlen
  liegen nicht vor, und geraten wäre schlimmer als weggelassen.
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
