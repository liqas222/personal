/* Lagebild-Ebenen für den Operationsmonitor.

   WICHTIG ZUR EINORDNUNG: Alles hier stammt aus offenen Quellen —
   Presseberichte, Thinktank-Veröffentlichungen, Behördenmitteilungen. Die
   Statuseinstufungen (offen / umkämpft / bedroht) sind eine Bewertung, keine
   gemeldete Tatsache, und Bewertungen veralten. Positionen sind auf
   Kartenmassstab gerundet und benennen bekannte Standorte, keine Details.

   Das Ganze ist eine Lernhilfe im Stil eines Lagemonitors, kein
   nachrichtendienstliches Produkt und keine Grundlage für irgendetwas. */

const LAGE_STAND = "04 AUG 2026 // 15:51Z";

/* ---------- Ebene 1: Aktuelle Konflikte ---------- */

const KONFLIKTE = [
  {
    id: "golf",
    t: "PERSISCHER GOLF / HORMUZ",
    kurz: "US–Iran",
    stufe: "hoch",
    ring: [[46.5, 30.8], [50.5, 30.2], [54.0, 27.8], [56.6, 26.8], [59.0, 25.8],
           [61.5, 24.2], [60.0, 22.8], [56.8, 24.4], [53.0, 26.4], [49.0, 28.6],
           [46.8, 29.4], [45.8, 30.2]],
    text: "Anhaltende Konfrontation zwischen Iran und den USA sowie deren " +
      "Partnern. Wiederholtes Festsetzen von Tankern, Störung von " +
      "Satellitennavigation, Zwischenfälle mit Schnellbooten.",
  },
  {
    id: "rotesmeer",
    t: "ROTES MEER / BAB EL-MANDEB",
    kurz: "Huthi-Angriffe",
    stufe: "kritisch",
    ring: [[37.5, 23.5], [40.5, 20.5], [42.5, 17.0], [44.0, 14.0], [46.5, 12.2],
           [50.5, 11.5], [52.0, 13.2], [48.0, 14.4], [44.5, 15.2], [42.0, 18.5],
           [39.5, 22.0], [36.5, 25.0], [35.5, 24.0]],
    text: "Angriffe auf Handelsschiffe mit Raketen, Drohnen und unbemannten " +
      "Booten. Grosse Reedereien meiden die Route; der Verkehr durch Suez " +
      "brach um mehr als die Hälfte ein.",
  },
  {
    id: "schwarzesmeer",
    t: "SCHWARZES MEER / OSTUKRAINE",
    kurz: "Russland–Ukraine",
    stufe: "kritisch",
    ring: [[27.8, 44.6], [29.5, 42.4], [33.5, 41.4], [38.5, 41.4], [41.5, 43.2],
           [41.8, 45.4], [40.6, 46.8], [40.8, 49.0], [38.6, 50.4], [36.0, 49.6],
           [34.4, 47.6], [31.0, 47.2], [28.2, 46.6]],
    text: "Aktiver Krieg. Seedrohnen, Minen und Angriffe auf Häfen und " +
      "Getreideterminals. Das Asowsche Meer ist faktisch russisch " +
      "kontrolliert, die Kertsch-Strasse ist der Nadelöhr dafür.",
  },
  {
    id: "taiwan",
    t: "TAIWANSTRASSE",
    kurz: "China–Taiwan",
    stufe: "hoch",
    ring: [[115.5, 21.0], [119.0, 20.4], [122.5, 22.4], [124.2, 25.6], [123.0, 28.2],
           [120.2, 27.6], [117.6, 25.0], [115.2, 22.6]],
    text: "Dauerhafter Druck unterhalb der Kriegsschwelle: Überflüge jenseits " +
      "der Mittellinie, Übungen mit scharfem Schuss, Ballon- und " +
      "Küstenwachaktivität. Kein offener Krieg, aber auch kein Frieden.",
  },
];

/* ---------- Ebene 2: Militärische Ziele und Schlüsselanlagen ----------
   Ausschliesslich seit Jahren öffentlich bekannte, in Presse und
   Fachliteratur beschriebene Standorte, auf Kartenmassstab verortet. */

const ZIELE = [
  { t: "BANDAR ABBAS", p: [56.28, 27.18], typ: "iran",
    b: "Marinehauptstützpunkt und Sitz der IRGC-Marine. Von hier laufen die " +
       "Schnellbootverbände, die bei Zwischenfällen in der Enge auftreten." },
  { t: "QESHM", p: [55.90, 26.85], typ: "iran",
    b: "Vorgelagerte Insel direkt an der Fahrrinne. Öffentlich bekannt für " +
       "Radar- und Küstenraketenstellungen — die Enge liegt in Reichweite." },
  { t: "KHARG", p: [50.33, 29.25], typ: "iran",
    b: "Über diesen einen Ölterminal läuft der Grossteil der iranischen " +
       "Ausfuhr. Ein Ausfall hier träfe Irans Einnahmen sofort." },
  { t: "JASK", p: [57.77, 25.65], typ: "iran",
    b: "Irans eigener Ausweg: Terminal ausserhalb der Enge, per Pipeline " +
       "gespeist. Genau deshalb gebaut." },
  { t: "AL UDEID", p: [51.32, 25.12], typ: "usa",
    b: "Grösster US-Luftwaffenstützpunkt der Region, Katar. Führungs- und " +
       "Luftbetankungsdrehscheibe für den gesamten Raum." },
  { t: "AL DHAFRA", p: [54.55, 24.25], typ: "usa",
    b: "US-Luftwaffe in den VAE. Aufklärung und Luftverteidigung." },
  { t: "NSA BAHRAIN", p: [50.61, 26.21], typ: "usa",
    b: "Hauptquartier der 5. US-Flotte. Der Verband, der die Freiheit der " +
       "Schifffahrt in Hormuz durchsetzen würde." },
  { t: "AL HUDAYDA", p: [42.95, 14.80], typ: "huthi",
    b: "Hafen und Küstenabschnitt, von dem aus Angriffe auf Schiffe im Roten " +
       "Meer gemeldet wurden." },
  { t: "AL MUCHA", p: [43.25, 13.32], typ: "huthi",
    b: "Küste unmittelbar an der Enge. Von hier ist Bab el-Mandeb mit " +
       "einfachen Mitteln erreichbar — das ist der Kern des Problems." },
  { t: "SEWASTOPOL", p: [33.53, 44.62], typ: "russ",
    b: "Stützpunkt der russischen Schwarzmeerflotte, mehrfach angegriffen." },
  { t: "KERTSCH-BRÜCKE", p: [36.52, 45.30], typ: "russ",
    b: "Landverbindung zur Krim und Nadelöhr für Nachschub. Mehrfach " +
       "beschädigt und wiederhergestellt." },
];

const ZIEL_TYPEN = {
  iran: { c: "#ff3b30", t: "Iranische Marine / Küstenstellungen" },
  usa: { c: "#39c2ff", t: "US-Stützpunkte" },
  huthi: { c: "#ff8a1f", t: "Huthi-Küstenabschnitte" },
  russ: { c: "#ff3b30", t: "Russische Logistik" },
};

/* ---------- Ebene 3: Kontrolle und Blockadeszenarien ---------- */

const KONTROLLZONEN = [
  {
    t: "IRANISCHER KONTROLLANSPRUCH HORMUZ",
    ring: [[55.2, 27.4], [56.8, 26.9], [57.6, 26.2], [57.2, 25.6], [56.0, 26.1],
           [54.8, 26.7], [55.2, 27.4]],
    b: "Iran beansprucht Durchfahrtsregelung und hat wiederholt Schiffe " +
       "aufgebracht. Eine vollständige Sperrung würde die eigenen Exporte " +
       "und den Hauptabnehmer China genauso treffen — deshalb Nadelstiche " +
       "statt Schliessung.",
  },
  {
    t: "GRAY-ZONE-ISOLATION TAIWAN",
    ring: [[118.5, 22.0], [122.5, 22.0], [123.5, 25.5], [122.5, 26.5],
           [120.0, 26.0], [118.5, 24.0], [118.5, 22.0]],
    b: "Denkbares Szenario unterhalb einer Invasion: Küstenwache statt " +
       "Marine, Zollkontrollen statt Blockade. Schwer zu beantworten, weil " +
       "es formal kein Kriegsakt wäre.",
  },
  {
    t: "RUSSISCHE KONTROLLE ASOWSCHES MEER",
    ring: [[35.0, 45.3], [38.3, 46.6], [39.3, 47.2], [37.5, 47.3],
           [35.5, 46.2], [34.8, 45.6], [35.0, 45.3]],
    b: "Faktisch geschlossenes Binnenmeer. Der Zugang führt nur über die " +
       "Kertsch-Strasse, und die ist russisch kontrolliert.",
  },
];

/* ---------- Ebene 4: Chokepoint-Status ----------
   Bewertung, keine Meldung. Grün offen, Amber umkämpft, Rot unter
   kinetischer Bedrohung. */

const STATUS = {
  hormuz: { s: "amber", b: "Offen, aber unter dauerhafter Drohung. Zwischenfälle mit Tankern." },
  babelmandeb: { s: "rot", b: "Unter kinetischer Bedrohung. Grossreedereien meiden die Route." },
  suez: { s: "amber", b: "Passierbar, aber Verkehr stark eingebrochen — wegen des Südendes." },
  malakka: { s: "gruen", b: "Offen. Kein militärischer Druck, erhöhte Überfallgefahr." },
  taiwan: { s: "amber", b: "Offen, aber militärisch angespannt. Übungen mit scharfem Schuss." },
  bosporus: { s: "amber", b: "Offen für Handelsschiffe. Für Kriegsschiffe nach Montreux gesperrt." },
  panama: { s: "gruen", b: "Offen. Begrenzung ist der Wasserstand, nicht Militär." },
  gibraltar: { s: "gruen", b: "Offen. Routinebetrieb." },
  daenemark: { s: "amber", b: "Offen. Schattenflotte, Schäden an Leitungen am Meeresgrund." },
};

const STATUS_FARBEN = {
  gruen: { c: "#00e676", t: "OFFEN / GESICHERT" },
  amber: { c: "#ffb000", t: "UMKÄMPFT / HOHES RISIKO" },
  rot: { c: "#ff2d2d", t: "UNTER BEDROHUNG" },
};

/* ---------- Ebene 5: Kraftvektoren und Eskalationspfade ---------- */

const VEKTOREN = [
  { t: "IRGC-Schnellboote in die Enge", p: [[56.28, 27.18], [56.60, 26.70], [56.40, 26.35]] },
  { t: "Küstenraketen Qeshm → Fahrrinne", p: [[55.90, 26.85], [56.20, 26.55]] },
  { t: "Huthi-Wirkmittel → Schifffahrt", p: [[43.10, 14.20], [42.80, 13.30], [43.30, 12.75]] },
  { t: "Huthi → Rotes Meer Nord", p: [[42.95, 14.80], [41.80, 16.20]] },
  { t: "PLA über die Mittellinie", p: [[118.20, 24.60], [119.60, 24.30], [120.60, 24.10]] },
  { t: "Russischer Nachschub über Kertsch", p: [[37.60, 45.60], [36.52, 45.30], [34.50, 45.10]] },
  { t: "US-Verstärkung aus dem Golf", p: [[50.61, 26.21], [53.50, 26.20], [56.10, 26.45]] },
];

/* ---------- Ebene 6: Intel-Callouts ---------- */

const CALLOUTS = [
  { p: [56.3, 26.6], t: "HORMUZ",
    b: "Kein Ausweichweg für zwei Drittel der Golfausfuhr. Pipelines fangen " +
       "nur etwa ein Drittel auf." },
  { p: [43.4, 12.6], t: "BAB EL-MANDEB",
    b: "Erster Fall, in dem eine nichtstaatliche Gruppe eine Welthandelsroute " +
       "faktisch geschlossen hat." },
  { p: [119.5, 24.4], t: "TAIWAN",
    b: "Hier hängt nicht Ladung dran, sondern Halbleiterfertigung ohne " +
       "Ersatzteil." },
  { p: [36.6, 45.3], t: "KERTSCH",
    b: "Einziger Zugang zum Asowschen Meer. Wer die Brücke hält, hält die " +
       "Landverbindung zur Krim." },
  { p: [29.05, 41.1], t: "BOSPORUS",
    b: "Ein Vertrag von 1936 hält beide Seiten aus dem Schwarzen Meer " +
       "heraus. Selten war Papier so wirksam." },
];

/* ---------- Ebenen-Register ---------- */

const EBENEN = [
  { id: "konflikte", t: "AKTUELLE KONFLIKTE", an: true, farbe: "#ff2d2d" },
  { id: "ziele", t: "MILITÄRISCHE ZIELE", an: false, farbe: "#ff3b30" },
  { id: "kontrolle", t: "KONTROLLE / BLOCKADE", an: false, farbe: "#c04cff" },
  { id: "status", t: "CHOKEPOINT-STATUS", an: true, farbe: "#00e676" },
  { id: "vektoren", t: "KRAFTVEKTOREN", an: false, farbe: "#ffb000" },
  { id: "callouts", t: "INTEL-CALLOUTS", an: false, farbe: "#00e676" },
];
