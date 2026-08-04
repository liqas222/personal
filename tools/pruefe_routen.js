#!/usr/bin/env node
/* Prüft, ob jede gezeichnete Route im Wasser liegt.

   Das war der häufigste Fehler im Atlas: Wegpunkte sahen auf der Karte
   plausibel aus, liefen aber durch Iran, über Malaysia oder quer durch
   Lolland. Abgetastet wird nicht die Punktfolge, sondern genau die Kurve,
   die static/atlas.js zeichnet — die beiden weichen voneinander ab.

   Routen mit "kanal: true" sind ausgenommen: Suez und Panama sind durch Land
   gegraben, der Bosporus ist mit 700 m schmaler als die Kartenauflösung.

   Aufruf:  node tools/pruefe_routen.js
*/
"use strict";
const fs = require("fs");
const path = require("path");

const BASE = path.join(__dirname, "..", "static");
const laden = (f) =>
  (0, eval)(fs.readFileSync(path.join(BASE, f), "utf8").replace(/^const /gm, "var "));
laden("geo.js");
laden("world.js");
laden("data.js");

const RINGE = [];
for (const l of WORLD.laender) {
  for (const r of l.r) {
    const pts = decodeRing(r, WORLD.grid);
    let w = 999, s = 999, e = -999, n = -999;
    for (const [x, y] of pts) {
      if (x < w) w = x;
      if (x > e) e = x;
      if (y < s) s = y;
      if (y > n) n = y;
    }
    RINGE.push({ name: l.n, pts, bbox: [w, s, e, n] });
  }
}

function imRing(x, y, pts) {
  let drin = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const [xi, yi] = pts[i], [xj, yj] = pts[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) drin = !drin;
  }
  return drin;
}

function land(x, y) {
  for (const r of RINGE) {
    const [w, s, e, n] = r.bbox;
    if (x < w || x > e || y < s || y > n) continue;
    if (imRing(x, y, r.pts)) return r.name;
  }
  return null;
}

/* Dieselbe Kurve wie in atlas.js: Catmull-Rom, als Bezier ausgewertet. */
function kurvenPunkte(p) {
  const raus = [];
  const bez = (a, c1, c2, b, t) => {
    const u = 1 - t;
    return [
      u * u * u * a[0] + 3 * u * u * t * c1[0] + 3 * u * t * t * c2[0] + t * t * t * b[0],
      u * u * u * a[1] + 3 * u * u * t * c1[1] + 3 * u * t * t * c2[1] + t * t * t * b[1],
    ];
  };
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[i - 1] || p[i], p1 = p[i], p2 = p[i + 1], p3 = p[i + 2] || p[i + 1];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    for (let t = 0; t <= 1; t += 0.01) raus.push(bez(p1, c1, c2, p2, t));
  }
  return raus;
}

let fehler = 0;
for (const e of ENGEN) {
  for (const r of e.routen) {
    const name = e.kurz.padEnd(16);
    if (r.kanal) {
      console.log("~ " + name + "  Kanal oder schmaler als die Kartenauflösung");
      continue;
    }
    const treffer = [];
    for (const [x, y] of kurvenPunkte(r.p)) {
      const L = land(x, y);
      if (L) treffer.push(x.toFixed(2) + "," + y.toFixed(2) + " (" + L + ")");
    }
    if (treffer.length) {
      fehler++;
      console.log("✗ " + name + "  " + treffer.length + " Punkte auf Land: " +
        treffer.slice(0, 3).join(" | "));
    } else {
      console.log("✓ " + name + "  im Wasser");
    }
  }
}
console.log(fehler
  ? "\n" + fehler + " Route(n) laufen über Land. Neu berechnen mit tools/seeweg.js."
  : "\nAlle gezeichneten Seewege liegen im Wasser.");
process.exit(fehler ? 1 : 0);
