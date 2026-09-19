#!/usr/bin/env node
"use strict";
/* Das <script> aus einer HTML-Datei auf Syntaxfehler prüfen.
 *
 * WARUM ES DAS GIBT: in der Radar-Oberfläche stand ein gerades
 * Anführungszeichen mitten in einem JavaScript-String ("„Jetzt abrufen"").
 * Damit war das ganze Skript kaputt — die Seite lud, blieb aber leer. Im
 * Browser sieht man das sofort, nur schaut man nicht nach jeder
 * Textänderung hin. `node --check` findet genau solche Fehler in einer
 * Sekunde.
 *
 *     node tools/pruefe_ui.js radar/static/index.html
 *
 * Ersetzt keinen Blick auf die Seite: was syntaktisch geht, kann fachlich
 * trotzdem falsch sein.
 */
const fs = require("fs");
const os = require("os");
const path = require("path");
const { execFileSync } = require("child_process");

const dateien = process.argv.slice(2);
if (!dateien.length) {
  console.error("Aufruf: node tools/pruefe_ui.js <datei.html> ...");
  process.exit(2);
}

let fehler = 0;
for (const datei of dateien) {
  const html = fs.readFileSync(datei, "utf8");
  const bloecke = [...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)];
  if (!bloecke.length) {
    console.log(`${datei}: kein eingebettetes Skript`);
    continue;
  }
  bloecke.forEach((b, i) => {
    // Zeilen vor dem Block als Leerzeilen mitgeben, damit die
    // Fehlermeldung die Zeilennummer der HTML-Datei nennt.
    const davor = html.slice(0, b.index).split("\n").length - 1;
    const tmp = path.join(os.tmpdir(),
      `ui-${path.basename(datei)}-${i}-${process.pid}.js`);
    fs.writeFileSync(tmp, "\n".repeat(davor) + b[1]);
    try {
      execFileSync(process.execPath, ["--check", tmp], { stdio: "pipe" });
      console.log(`${datei}: Skript ${i + 1} ok (${b[1].split("\n").length} Zeilen)`);
    } catch (e) {
      fehler++;
      console.error(`${datei}: Skript ${i + 1} KAPUTT`);
      console.error(String(e.stderr || e).replace(new RegExp(tmp, "g"), datei));
    } finally {
      fs.unlinkSync(tmp);
    }
  });
}
process.exit(fehler ? 1 : 0);
