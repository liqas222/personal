// Kriegsschauplätze — der Inhalt des Startbildes.
//
// Hier steht nur Fachliches: wie ein Schauplatz heisst, welcher Kartenaus-
// schnitt ihn zeigt, worum dort gekämpft wird und welche Meerengen daran
// hängen. Wer einen Schauplatz ergänzt, fasst keinen Zeichencode an.
//
// Die Zuordnung "welche Meldung gehört zu welchem Schauplatz" passiert NICHT
// hier, sondern im Server (SCHAUPLATZ_ORTE in serve.py) — dort liegen die
// Ortsnamen, nach denen im Meldungstext gesucht wird. Beide Listen müssen
// dieselben Ids benutzen.
//
// bbox: [west, süd, ost, nord] in Grad.

const SCHAUPLAETZE = [
  {
    id: "nahost",
    name: "Naher Osten — Iran, Israel, Golf",
    bbox: [30, 12, 62, 40],
    worum:
      "Der Schlagabtausch zwischen Israel und Iran samt dessen Verbündeten " +
      "in Libanon, Syrien und Irak. Wirtschaftlich hängt daran die Strasse " +
      "von Hormuz: durch sie läuft ein Fünftel des weltweit gehandelten Öls, " +
      "und sie ist von iranischem Ufer aus auf ganzer Länge erreichbar.",
    engen: ["hormuz"],
  },
  {
    id: "rotesmeer",
    name: "Rotes Meer — Jemen, Bab el-Mandeb",
    bbox: [30, 5, 55, 33],
    worum:
      "Die Huthi-Bewegung beschiesst seit dem Gaza-Krieg Handelsschiffe im " +
      "Roten Meer. Reedereien weichen um das Kap der Guten Hoffnung aus — " +
      "rund zwei Wochen längere Fahrt. Bab el-Mandeb und der Suezkanal " +
      "hängen zusammen: wer das eine meidet, braucht das andere nicht.",
    engen: ["babelmandeb", "suez"],
  },
  {
    id: "ukraine",
    name: "Ukraine — Schwarzes Meer",
    bbox: [22, 40, 50, 60],
    worum:
      "Landkrieg mit einer maritimen Seite: Getreidekorridor, Angriffe auf " +
      "Hafenanlagen in Odessa und auf russische Ölhäfen. Der Bosporus ist " +
      "der einzige Ausgang des Schwarzen Meeres; die Türkei regelt die " +
      "Durchfahrt von Kriegsschiffen nach dem Vertrag von Montreux.",
    engen: ["bosporus"],
  },
  {
    id: "ostsee",
    name: "Ostsee — Kabel, Schattenflotte",
    bbox: [8, 52, 32, 66],
    worum:
      "Kein offener Krieg, aber beschädigte Datenkabel und Pipelines, " +
      "Störungen der Satellitennavigation und eine Tankerflotte, die " +
      "Sanktionen umgeht. Alles muss durch die dänischen Meerengen — die " +
      "engste Stelle des russischen Ostseehandels.",
    engen: ["daenemark"],
  },
  {
    id: "ostasien",
    name: "Ostasien — Taiwan, Südchinesisches Meer",
    bbox: [100, 0, 135, 30],
    worum:
      "Manöver, Luftraumverletzungen und Zusammenstösse um Taiwan und um " +
      "Riffe im Südchinesischen Meer. Durch die Strasse von Taiwan und die " +
      "Strasse von Malakka läuft der Grossteil des ostasiatischen " +
      "Aussenhandels und fast die gesamte Ölzufuhr Chinas, Japans und Koreas.",
    engen: ["taiwan", "malakka"],
  },
  {
    id: "afrika",
    name: "Sudan und Sahel",
    bbox: [-15, 2, 45, 26],
    worum:
      "Bürgerkrieg im Sudan und bewaffnete Konflikte im Sahel. Die " +
      "Datenlage ist hier deutlich dünner als bei den anderen Schauplätzen " +
      "— wenige Meldungen heissen nicht, dass wenig passiert, sondern dass " +
      "wenig berichtet wird.",
    engen: ["babelmandeb"],
  },
  {
    id: "sonstige",
    name: "Nicht zugeordnet",
    bbox: [-180, -58, 180, 80],
    worum:
      "Meldungen, in denen kein bekannter Ort vorkam. Landen hier viele " +
      "Meldungen, fehlt dem Server ein Ortsname — die Liste steht in " +
      "serve.py unter ORTE und lässt sich erweitern.",
    engen: [],
  },
];

const SCHAUPLATZ_NACH_ID = {};
SCHAUPLAETZE.forEach((s) => { SCHAUPLATZ_NACH_ID[s.id] = s; });
