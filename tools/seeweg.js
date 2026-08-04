#!/usr/bin/env node
/* Sucht einen Seeweg zwischen zwei Punkten — nur für die Autorenarbeit,
   nichts davon läuft im Browser.

   Wegpunkte von Hand zu setzen geht schief: Routen liefen durch Iran, über
   Malaysia und quer durch Lolland. Dieses Skript legt ein Raster über die
   Landmasken aus static/world.js, sucht darin den kürzesten Wasserweg und
   dünnt ihn danach auf wenige Stützpunkte aus.

   Aufruf:
     node tools/seeweg.js <lon1> <lat1> <lon2> <lat2> [Rasterweite] [Abstand]

   Abstand = Sicherheitsabstand zur Küste in Grad (Standard 0.05, ca. 5 km).

   Beispiel (Persischer Golf -> Golf von Oman):
     node tools/seeweg.js 53.2 26.2 58.3 25.1
*/
"use strict";

/* Groesster Abstand zweier Stuetzpunkte in Grad. Je enger die Fahrrinne,
   desto kleiner muss der Wert sein, damit die gezeichnete Kurve zwischen den
   Punkten nicht an Land ausschwingt. Ueber das siebte Argument einstellbar. */
let MAX_SPRUNG = 0.6;
const fs = require("fs");
const path = require("path");

const BASE = path.join(__dirname, "..", "static");
const laden = (f) =>
  (0, eval)(fs.readFileSync(path.join(BASE, f), "utf8").replace(/^const /gm, "var "));
laden("geo.js");
laden("world.js");

/* Alle Landringe mit Bounding-Box, damit die Punktprüfung schnell bleibt. */
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

/** Name des Landes an dieser Stelle, sonst null. */
function land(x, y) {
  for (const r of RINGE) {
    const [w, s, e, n] = r.bbox;
    if (x < w || x > e || y < s || y > n) continue;
    if (imRing(x, y, r.pts)) return r.name;
  }
  return null;
}

/** Liegt die Strecke a->b vollständig im Wasser? */
function freieSicht(a, b, schritt) {
  const d = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const n = Math.max(2, Math.ceil(d / schritt));
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    if (land(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t)) return false;
  }
  return true;
}

/** Wasser mit Sicherheitsabstand: auch die Umgebung muss frei sein. */
function wasserFrei(x, y, abstand) {
  if (land(x, y)) return false;
  for (const [dx, dy] of [[abstand, 0], [-abstand, 0], [0, abstand], [0, -abstand]]) {
    if (land(x + dx, y + dy)) return false;
  }
  return true;
}

function suche(start, ziel, weite, abstand) {
  // Suchfeld: Rechteck um beide Punkte, grosszügig gepolstert, damit die
  // Route auch weit ausholen darf.
  const pad = 3;
  const x0 = Math.min(start[0], ziel[0]) - pad, x1 = Math.max(start[0], ziel[0]) + pad;
  const y0 = Math.min(start[1], ziel[1]) - pad, y1 = Math.max(start[1], ziel[1]) + pad;
  const nx = Math.round((x1 - x0) / weite) + 1;
  const ny = Math.round((y1 - y0) / weite) + 1;
  const idx = (i, j) => j * nx + i;
  const zuGrad = (i, j) => [x0 + i * weite, y0 + j * weite];

  const frei = new Uint8Array(nx * ny);
  for (let j = 0; j < ny; j++) {
    for (let i = 0; i < nx; i++) {
      const [x, y] = zuGrad(i, j);
      frei[idx(i, j)] = wasserFrei(x, y, abstand) ? 1 : 0;
    }
  }

  const zuZelle = (p) => [
    Math.max(0, Math.min(nx - 1, Math.round((p[0] - x0) / weite))),
    Math.max(0, Math.min(ny - 1, Math.round((p[1] - y0) / weite))),
  ];
  const [si, sj] = zuZelle(start), [zi, zj] = zuZelle(ziel);
  for (const [i, j, was] of [[si, sj, "Start"], [zi, zj, "Ziel"]]) {
    if (!frei[idx(i, j)]) {
      console.error(was + " liegt auf Land oder zu nah an der Küste: " +
        zuGrad(i, j).map((v) => v.toFixed(2)).join(","));
      process.exit(1);
    }
  }

  // Dijkstra mit acht Nachbarn; diagonal kostet entsprechend mehr.
  const INF = Infinity;
  const dist = new Float64Array(nx * ny).fill(INF);
  const prev = new Int32Array(nx * ny).fill(-1);
  const start_i = idx(si, sj);
  dist[start_i] = 0;
  const offen = [[0, start_i]];
  const nachbarn = [[1,0,1],[-1,0,1],[0,1,1],[0,-1,1],
                    [1,1,1.414],[1,-1,1.414],[-1,1,1.414],[-1,-1,1.414]];
  const ziel_i = idx(zi, zj);
  while (offen.length) {
    // Kleine Felder — eine lineare Suche ist schnell genug und spart einen
    // Heap, den sonst niemand liest.
    let b = 0;
    for (let k = 1; k < offen.length; k++) if (offen[k][0] < offen[b][0]) b = k;
    const [d, cur] = offen.splice(b, 1)[0];
    if (cur === ziel_i) break;
    if (d > dist[cur]) continue;
    const ci = cur % nx, cj = (cur - ci) / nx;
    for (const [dx, dy, kosten] of nachbarn) {
      const ni = ci + dx, nj = cj + dy;
      if (ni < 0 || nj < 0 || ni >= nx || nj >= ny) continue;
      const n = idx(ni, nj);
      if (!frei[n]) continue;
      const nd = d + kosten;
      if (nd < dist[n]) {
        dist[n] = nd;
        prev[n] = cur;
        offen.push([nd, n]);
      }
    }
  }
  if (dist[ziel_i] === INF) return null;

  const roh = [];
  for (let c = ziel_i; c !== -1; c = prev[c]) {
    const i = c % nx;
    roh.push(zuGrad(i, (c - i) / nx));
  }
  roh.reverse();

  // Ausduennen: solange der naechste Punkt in freier Sicht liegt, die
  // Zwischenpunkte weglassen. Aber nie zu weit springen — die gezeichnete
  // Kurve laeuft zwar durch jeden Stuetzpunkt, schwingt zwischen weit
  // auseinanderliegenden Punkten aber aus und landet dann doch an Land.
  const duenn = [roh[0]];
  let i = 0;
  while (i < roh.length - 1) {
    let j = roh.length - 1;
    while (j > i + 1 &&
           (!freieSicht(roh[i], roh[j], weite / 2) ||
            Math.hypot(roh[j][0] - roh[i][0], roh[j][1] - roh[i][1]) > MAX_SPRUNG)) j--;
    duenn.push(roh[j]);
    i = j;
  }
  return duenn;
}

const a = process.argv.slice(2).map(Number);
if (a.length < 4 || a.slice(0, 4).some(isNaN)) {
  console.error("Aufruf: node tools/seeweg.js <lon1> <lat1> <lon2> <lat2> [Rasterweite] [Abstand]");
  process.exit(1);
}
const weite = a[4] || 0.1;
const abstand = a[5] !== undefined ? a[5] : 0.05;
if (a[6] !== undefined && !isNaN(a[6])) MAX_SPRUNG = a[6];
const weg = suche([a[0], a[1]], [a[2], a[3]], weite, abstand);
if (!weg) {
  console.error("Kein durchgehender Wasserweg gefunden. Raster feiner stellen " +
    "oder den Sicherheitsabstand verringern.");
  process.exit(1);
}
console.log("p: [" + weg.map((p) => "[" + p[0].toFixed(2) + ", " + p[1].toFixed(2) + "]").join(", ") + "],");
console.error(weg.length + " Stützpunkte");
