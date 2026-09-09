/* Prüft die Länderliste gegen die Kartendaten.
 *
 * Ein Tippfehler im Schlüssel fällt sonst erst im Spiel auf — und zwar als
 * Frage, die sich nicht beantworten lässt, weil das Land nicht existiert.
 *
 *   node tools/pruefe_laender.js
 */
const fs = require("fs");
const vm = require("vm");
const path = require("path");

const BASE = path.join(__dirname, "..", "static");
const ctx = { console, Math, JSON };
vm.createContext(ctx);
for (const f of ["world.js", "geo.js", "wto.js", "laender.js"]) {
  vm.runInContext(fs.readFileSync(path.join(BASE, f), "utf8"), ctx);
}

// `const` in einem vm-Kontext landet NICHT auf dem globalen Objekt — die
// Werte müssen von innen herausgereicht werden.
const D = vm.runInContext(
  "({world: WORLD, quiz: LAENDER_QUIZ, keinStaat: KEIN_STAAT," +
  " zweifel: ZWEIFELHAFT, wto: WTO})", ctx);

const karte = new Set(D.world.laender.map((l) => l.n));
const quiz = Object.keys(D.quiz);
let fehler = 0;

// 1. Jeder Schlüssel muss auf der Karte existieren.
const unbekannt = quiz.filter((n) => !karte.has(n));
if (unbekannt.length) {
  fehler += unbekannt.length;
  console.log("NICHT AUF DER KARTE (" + unbekannt.length + "):");
  unbekannt.forEach((n) => console.log("   " + JSON.stringify(n)));
}

// 2. Jedes Kartenland muss eingeordnet sein — als Quizland, als Nichtstaat
//    oder als umstritten. Vergessene fallen sonst stillschweigend raus.
const eingeordnet = new Set([...quiz, ...D.keinStaat, ...D.zweifel]);
const vergessen = [...karte].filter((n) => !eingeordnet.has(n));
if (vergessen.length) {
  fehler += vergessen.length;
  console.log("NICHT EINGEORDNET (" + vergessen.length + "):");
  vergessen.forEach((n) => console.log("   " + JSON.stringify(n)));
}

// 3. Doppelte deutsche Namen wären im Spiel nicht unterscheidbar.
const gesehen = {};
for (const [k, v] of Object.entries(D.quiz)) {
  if (gesehen[v]) {
    fehler++;
    console.log("DOPPELTER NAME: " + v + " (" + gesehen[v] + " und " + k + ")");
  }
  gesehen[v] = k;
}

// 4. Wie viele Quizländer haben ein BIP? Davon hängt die Schwierigkeit ab.
const mitBip = quiz.filter((n) => D.wto[n] && D.wto[n].bip).length;

console.log("");
console.log("Kartenländer:        " + karte.size);
console.log("Quizländer:          " + quiz.length);
console.log("  davon mit BIP:     " + mitBip);
console.log("Kein Staat:          " + D.keinStaat.length);
console.log("Umstritten:          " + D.zweifel.length);
console.log(fehler ? "\nFEHLER: " + fehler : "\nAlles sauber.");
process.exit(fehler ? 1 : 0);
