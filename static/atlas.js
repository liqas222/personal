/* Der Atlas: zeichnen, zoomen, klicken.
   Reines Canvas, keine Bibliothek. */

const WELT_BBOX = [-180, -58, 180, 80];

let cv, ctx, W = 0, H = 0, DPR = 1;
let LAENDER = [];          // dekodierte Ringe mit vorberechneter Bounding-Box
let view = null;           // aktuelle Projektion
let ziel = null;           // Ziel-Ausschnitt der laufenden Animation
let anim = null;
let modus = "welt";        // welt | detail | quiz
let ansicht = "enge";      // innerhalb von detail: enge | betroffen
let aktiv = null;          // angezeigte Meerenge
let hover = null;
let t0 = performance.now();

/* Quiz-Zustand */
let quiz = { frage: null, rest: [], antwort: null, punkte: 0, runden: 0 };

/* Welche Lagebild-Ebenen eingeschaltet sind. Voreinstellung kommt aus
   lagen.js — nur Konflikte und Chokepoint-Status, damit die Karte lesbar
   startet und man den Rest bewusst dazuschaltet. */
const AN = {};
for (const e of EBENEN) AN[e.id] = e.an;

/* Rollen der betroffenen Länder. Die drei Farben sind gegen den dunklen
   Untergrund und gegen Farbfehlsichtigkeit geprüft; zusätzlich trägt jedes
   Land seinen Namen, Farbe allein muss also nie ausreichen. */
const ROLLEN = {
  kontrolle: { c: "#199e70", fill: "#1b6b52", t: "Kontrolliert die Enge" },
  ausfuhr: { c: "#d95926", fill: "#8a3c1e", t: "Verschifft hier hinaus" },
  einfuhr: { c: "#3987e5", fill: "#2a5a94", t: "Empfängt über diese Route" },
};

const F = {
  see: "#050a0c",
  land: "#16211f",
  landAktiv: "#1b2926",
  kueste: "#2f4f45",
  ink: "#dfeae6",
  ink2: "#8fa6a0",
  dim: "#5d726f",
  marke: "#ff2d2d",
  markeAus: "#4e6b62",
};

/* Laender an der Datumsgrenze (Russland, Fidschi) springen in den Rohdaten
   zwischen +180 und -180 hin und her. Zeichnet man das direkt, zieht jeder
   Sprung einen Strich quer ueber die ganze Karte. Deshalb wird der Ring
   fortlaufend gemacht: Laengengrade duerfen ueber 180 hinauslaufen, und die
   Kopie 360 Grad weiter links deckt den anderen Kartenrand ab. */
function entwirre(pts) {
  const out = [pts[0]];
  let off = 0;
  for (let i = 1; i < pts.length; i++) {
    const d = pts[i][0] - pts[i - 1][0];
    if (d > 180) off -= 360;
    else if (d < -180) off += 360;
    out.push([pts[i][0] + off, pts[i][1]]);
  }
  return out;
}

/* ---------- Aufbau ---------- */

function init() {
  cv = document.getElementById("karte");
  ctx = cv.getContext("2d");

  LAENDER = WORLD.laender.map((l) => {
    const polys = l.r.map((s) => {
      const pts = entwirre(decodeRing(s, WORLD.grid));
      let w = 999, s2 = 999, e = -999, n = -999;
      for (const [x, y] of pts) {
        if (x < w) w = x;
        if (x > e) e = x;
        if (y < s2) s2 = y;
        if (y > n) n = y;
      }
      return { pts: pts, bbox: [w, s2, e, n] };
    });
    return { n: l.n, id: l.id, polys: polys };
  });

  resize();
  addEventListener("resize", resize);
  cv.addEventListener("mousemove", onMove);
  cv.addEventListener("click", onClick);
  cv.addEventListener("mouseleave", () => {
    hover = null;
    cv.style.cursor = "default";
  });

  bauListe();
  bauEbenen();
  bauStatuslegende();
  document.querySelectorAll("nav button[data-modus]").forEach((b) => {
    b.onclick = () => setModus(b.dataset.modus);
  });
  document.getElementById("zurueck").onclick = () => setModus("welt");
  document.querySelectorAll("#ansichten button").forEach((b) => {
    b.onclick = () => setAnsicht(b.dataset.ansicht);
  });
  document.getElementById("weiter").onclick = naechsteFrage;
  document.getElementById("stand").textContent = STAND;

  view = makeView(WELT_BBOX, W, H);
  setModus("welt");
  requestAnimationFrame(tick);
}

function resize() {
  DPR = Math.min(devicePixelRatio || 1, 2);
  const r = cv.parentElement.getBoundingClientRect();
  W = Math.max(320, r.width);
  H = Math.max(280, r.height);
  cv.width = W * DPR;
  cv.height = H * DPR;
  cv.style.width = W + "px";
  cv.style.height = H + "px";
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  const b = (ziel && ziel.bbox) || (view && view.bbox) || WELT_BBOX;
  view = makeView(b, W, H);
}

/* Zuordnung Land -> Rolle für die aktuelle Ansicht. Ein Land kann mehrere
   Rollen haben (Iran kontrolliert Hormuz und exportiert dadurch); dann
   gewinnt die Kontrolle, weil das die politisch entscheidende ist. */
function rollenKarte() {
  if (modus !== "detail" || ansicht !== "betroffen" || !aktiv) return {};
  const b = aktiv.betroffen;
  const m = {};
  for (const l of b.einfuhr) m[l.ne] = "einfuhr";
  for (const l of b.ausfuhr) m[l.ne] = "ausfuhr";
  for (const l of b.kontrolle) m[l.ne] = "kontrolle";
  return m;
}

/* Beschriftet die eingefärbten Länder. Als Ankerpunkt dient die Mitte des
   grössten Rings — bei Ländern mit vielen Inseln ist das der Hauptteil. */
function zeichneRollenNamen(e) {
  const rollen = rollenKarte();
  const namen = {};
  for (const gruppe of ["kontrolle", "ausfuhr", "einfuhr"]) {
    for (const l of e.betroffen[gruppe]) if (rollen[l.ne] === gruppe) namen[l.ne] = l.t;
  }
  const gesetzt = [];
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "600 11px ui-sans-serif,system-ui,sans-serif";
  for (const l of LAENDER) {
    const rolle = rollen[l.n];
    if (!rolle || !namen[l.n]) continue;
    let best = null;
    for (const p of l.polys) {
      const [w, s, en, n] = p.bbox;
      const flaeche = (en - w) * (n - s);
      if (!best || flaeche > best.f) best = { f: flaeche, x: (w + en) / 2, y: (s + n) / 2 };
    }
    if (!best) continue;
    const [x, y] = view.project(best.x, best.y);
    if (x < 4 || x > W - 4 || y < 4 || y > H - 4) continue;
    const b = ctx.measureText(namen[l.n]).width / 2 + 3;
    const kasten = [x - b, y - 8, x + b, y + 8];
    // Überlappende Namen weglassen statt übereinanderdrucken.
    if (gesetzt.some((m) => !(kasten[2] < m[0] || kasten[0] > m[2] ||
                              kasten[3] < m[1] || kasten[1] > m[3]))) continue;
    gesetzt.push(kasten);
    ctx.fillStyle = "#f2f4f7";
    halo(namen[l.n], x, y);
  }
  // Die Enge selbst bleibt der Bezugspunkt.
  const [mx, my] = view.project(e.pos[0], e.pos[1]);
  ctx.beginPath();
  ctx.arc(mx, my, 6, 0, 7);
  ctx.fillStyle = F.marke;
  ctx.fill();
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = F.see;
  ctx.stroke();
  ctx.font = "600 13px ui-sans-serif,system-ui,sans-serif";
  ctx.fillStyle = F.ink;
  halo(e.kurz, mx, my - 16);
}

/* ---------- Ansichten ---------- */

function setModus(m) {
  modus = m;
  document.querySelectorAll("nav button[data-modus]").forEach((b) => {
    b.classList.toggle("an", b.dataset.modus === m);
  });
  document.body.dataset.modus = m;
  // Der Moduswechsel aendert die Groesse des Kartenfelds (Panel, Quizleiste).
  // Ohne Neumessung behaelt die Leinwand ihre alte Hoehe und ueberdeckt das,
  // was darunter eingeblendet wird.
  requestAnimationFrame(resize);
  if (m === "welt") {
    aktiv = null;
    fliegeZu(WELT_BBOX);
  } else if (m === "liste") {
    aktiv = null;
  } else if (m === "quiz") {
    aktiv = null;
    quiz.punkte = 0;
    quiz.runden = 0;
    quiz.rest = [];
    fliegeZu(WELT_BBOX);
    naechsteFrage();
  }
}

function zeigeEnge(e) {
  aktiv = e;
  ansicht = "enge";
  modus = "detail";
  document.body.dataset.modus = "detail";
  requestAnimationFrame(resize);
  document.querySelectorAll("nav button[data-modus]").forEach((b) =>
    b.classList.remove("an")
  );
  fliegeZu(e.zoom);
  bauPanel(e);
  bauLegende(e);
  document.body.dataset.ansicht = "enge";
  document.querySelectorAll("#ansichten button").forEach((b) =>
    b.classList.toggle("an", b.dataset.ansicht === "enge"));
  document.getElementById("legende").hidden = true;
}

/* Zwischen Nahaufnahme und Betroffenen-Ansicht wechseln. */
function setAnsicht(a) {
  if (!aktiv) return;
  ansicht = a;
  document.body.dataset.ansicht = a;
  document.querySelectorAll("#ansichten button").forEach((b) =>
    b.classList.toggle("an", b.dataset.ansicht === a));
  fliegeZu(a === "betroffen" ? aktiv.betroffen.bbox : aktiv.zoom);
  document.getElementById("legende").hidden = a !== "betroffen";
}

/* Weicher Flug von einem Ausschnitt zum naechsten. Der Sprung waere
   billiger, aber genau die Bewegung ist es, die haengen bleibt: man sieht,
   WO die Enge liegt, nicht nur wie sie aussieht. */
function fliegeZu(bbox) {
  const von = view ? view.bbox.slice() : bbox.slice();
  ziel = { bbox: bbox.slice() };
  anim = { von: von, nach: bbox.slice(), start: performance.now(), dauer: 900 };
}

function ease(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function tick(now) {
  if (anim) {
    const p = Math.min(1, (now - anim.start) / anim.dauer);
    const e = ease(p);
    const b = [0, 1, 2, 3].map((i) => {
      const a = anim.von[i], z = anim.nach[i];
      // Zoomstufen interpolieren sich logarithmisch natuerlicher, aber fuer
      // die Spannweiten hier reicht linear und bleibt vorhersehbar.
      return a + (z - a) * e;
    });
    view = makeView(b, W, H);
    if (p >= 1) anim = null;
  }
  zeichne(now);
  requestAnimationFrame(tick);
}

/* ---------- Zeichnen ---------- */

/* Die Grundkarte ist teuer (rund 4000 Ringe) und ändert sich nur, wenn sich
   der Ausschnitt bewegt. Marker und Pfeile ändern sich dagegen in jedem Bild.
   Also: Land einmal auf eine zweite Leinwand zeichnen und die nur noch
   kopieren. Ohne das lief der Atlas mit 13 Bildern pro Sekunde. */
let basis = null, basisSchluessel = "";

function grundkarte() {
  const rollen = rollenKarte();
  const schluessel = [W, H, DPR, view.bbox.join(","), aktiv ? aktiv.id : "",
                      ansicht, Object.keys(rollen).length].join("|");
  if (basis && basisSchluessel === schluessel) return basis;
  if (!basis) basis = document.createElement("canvas");
  basis.width = W * DPR;
  basis.height = H * DPR;
  const c = basis.getContext("2d");
  c.setTransform(DPR, 0, 0, DPR, 0, 0);
  zeichneLand(c, rollen);
  zeichneRaster(c);
  basisSchluessel = schluessel;
  return basis;
}

function zeichne(now) {
  ctx.drawImage(grundkarte(), 0, 0, W, H);

  if (modus === "detail" && aktiv) {
    if (ansicht === "betroffen") {
      zeichneRollenNamen(aktiv);
    } else {
      // Die Lagebild-Ebenen gelten auch im Zoom — dort sind sie sogar
      // nuetzlicher, weil sich die Ziele nicht mehr gegenseitig verdecken.
      if (AN.konflikte) zeichneKonflikte(now);
      if (AN.kontrolle) zeichneKontrollzonen();
      zeichneRouten(aktiv, now);
      if (AN.vektoren) zeichneVektoren(now);
      zeichneOrte(aktiv);
      zeichneEngenName(aktiv);
      if (AN.ziele) zeichneZiele(now);
      if (AN.callouts) zeichneCallouts();
    }
  } else {
    zeichneMeere(markenKaesten());
    if (AN.konflikte) zeichneKonflikte(now);
    if (AN.kontrolle) zeichneKontrollzonen();
    if (AN.vektoren) zeichneVektoren(now);
    zeichneMarken(now);
    if (AN.ziele) zeichneZiele(now);
    if (AN.callouts) zeichneCallouts();
  }
  zeichneFadenkreuz();
}

/* ---------- Lagebild-Ebenen ---------- */

function ringPfad(c, ring) {
  c.beginPath();
  ring.forEach((p, i) => {
    const [x, y] = view.project(p[0], p[1]);
    i ? c.lineTo(x, y) : c.moveTo(x, y);
  });
  c.closePath();
}

/* Ebene 1 — Konfliktzonen. Der Puls macht sie ohne Legende als "aktiv"
   lesbar; die Farbe unterscheidet hoch von kritisch. */
function zeichneKonflikte(now) {
  const puls = 0.5 + 0.5 * Math.sin(now / 620);
  // Im Zoom fuellt die Theaterflaeche das halbe Bild und ueberdeckt alles.
  // Dann nur noch die Kante zeichnen.
  const nah = view.bbox[2] - view.bbox[0] < 25;
  const daempfer = nah ? 0.12 : 1;
  for (const k of KONFLIKTE) {
    const farbe = k.stufe === "kritisch" ? "#ff2d2d" : "#ff7a1f";
    ringPfad(ctx, k.ring);
    ctx.fillStyle = k.stufe === "kritisch"
      ? "rgba(255,45,45," + (0.10 + 0.10 * puls) + ")"
      : "rgba(255,122,31," + (0.08 + 0.08 * puls) + ")";
    ctx.fill();
    ctx.strokeStyle = farbe;
    ctx.lineWidth = 2.5;
    ctx.setLineDash([]);
    ctx.globalAlpha = 0.55 + 0.45 * puls;
    ctx.stroke();
    ctx.globalAlpha = 1;

    // Eckwinkel wie in einem Zielrahmen
    let w = 1e9, s = 1e9, e = -1e9, n = -1e9;
    for (const p of k.ring) {
      const [x, y] = view.project(p[0], p[1]);
      w = Math.min(w, x); e = Math.max(e, x);
      s = Math.min(s, y); n = Math.max(n, y);
    }
    ctx.strokeStyle = farbe;
    ctx.lineWidth = 1.5;
    const L = 13;
    ctx.beginPath();
    for (const [cx, cy, sx, sy] of [[w, s, 1, 1], [e, s, -1, 1], [w, n, 1, -1], [e, n, -1, -1]]) {
      ctx.moveTo(cx, cy + sy * L); ctx.lineTo(cx, cy); ctx.lineTo(cx + sx * L, cy);
    }
    ctx.stroke();

    ctx.font = "700 10px var(--mono)";
    ctx.font = '700 10px ui-monospace,Menlo,Consolas,monospace';
    ctx.textAlign = "left";
    ctx.textBaseline = "bottom";
    ctx.fillStyle = farbe;
    ctx.letterSpacing = "1.5px";
    halo(k.t, w, s - 6);
    ctx.letterSpacing = "0px";
  }
}

/* Ebene 3 — Kontroll- und Blockadezonen, schraffiert statt gefuellt,
   damit sie sich von den Konfliktflaechen unterscheiden. */
function zeichneKontrollzonen() {
  for (const z of KONTROLLZONEN) {
    ringPfad(ctx, z.ring);
    ctx.save();
    ctx.clip();
    let w = 1e9, s = 1e9, e = -1e9, n = -1e9;
    for (const p of z.ring) {
      const [x, y] = view.project(p[0], p[1]);
      w = Math.min(w, x); e = Math.max(e, x);
      s = Math.min(s, y); n = Math.max(n, y);
    }
    ctx.strokeStyle = "rgba(192,76,255,.5)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let d = w - (n - s); d < e; d += 9) {
      ctx.moveTo(d, n);
      ctx.lineTo(d + (n - s), s);
    }
    ctx.stroke();
    ctx.restore();
    ringPfad(ctx, z.ring);
    ctx.strokeStyle = "#c04cff";
    ctx.lineWidth = 1.8;
    ctx.setLineDash([7, 4]);
    ctx.stroke();
    ctx.setLineDash([]);
    const [mx, my] = view.project(
      z.ring.reduce((a, p) => a + p[0], 0) / z.ring.length,
      z.ring.reduce((a, p) => a + p[1], 0) / z.ring.length);
    ctx.font = '700 9px ui-monospace,Menlo,Consolas,monospace';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#d79bff";
    ctx.letterSpacing = "1.2px";
    halo(z.t, mx, my);
    ctx.letterSpacing = "0px";
  }
}

/* Ebene 2 — Ziele und Schluesselanlagen als Rauten mit Datenkaestchen. */
function zeichneZiele(now) {
  const blink = 0.6 + 0.4 * Math.sin(now / 400);
  const gesetzt = [];
  for (const z of ZIELE) {
    const [x, y] = view.project(z.p[0], z.p[1]);
    if (x < -40 || x > W + 40 || y < -20 || y > H + 20) continue;
    const farbe = ZIEL_TYPEN[z.typ].c;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(Math.PI / 4);
    ctx.strokeStyle = farbe;
    ctx.lineWidth = 1.8;
    ctx.globalAlpha = blink;
    ctx.strokeRect(-5, -5, 10, 10);
    ctx.globalAlpha = 1;
    ctx.fillStyle = farbe;
    ctx.fillRect(-2, -2, 4, 4);
    ctx.restore();

    ctx.font = '700 9px ui-monospace,Menlo,Consolas,monospace';
    ctx.letterSpacing = "1px";
    const b = ctx.measureText(z.t).width;
    // Kaestchen abwechselnd rechts/links, damit sie sich seltener decken
    let lx = x + 11, ly = y - 13;
    const stoert = () => gesetzt.some((m) =>
      !(lx + b + 6 < m[0] || lx > m[2] || ly + 12 < m[1] || ly - 4 > m[3]));
    if (stoert()) { ly = y + 15; }
    if (stoert()) { lx = x - b - 17; ly = y - 13; }
    gesetzt.push([lx - 3, ly - 4, lx + b + 6, ly + 12]);
    ctx.fillStyle = "rgba(4,8,10,.82)";
    ctx.fillRect(lx - 3, ly - 3, b + 8, 13);
    ctx.strokeStyle = farbe;
    ctx.lineWidth = 1;
    ctx.strokeRect(lx - 3, ly - 3, b + 8, 13);
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillStyle = farbe;
    ctx.fillText(z.t, lx + 1, ly);
    ctx.letterSpacing = "0px";
  }
}

/* Ebene 5 — Kraftvektoren. Duenn, gestrichelt, laufend. */
function zeichneVektoren(now) {
  for (const v of VEKTOREN) {
    const pts = v.p.map((p) => view.project(p[0], p[1]));
    ctx.strokeStyle = "#ffb000";
    ctx.lineWidth = 1.4;
    ctx.setLineDash([9, 6]);
    ctx.lineDashOffset = -(now / 40) % 15;
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
    ctx.stroke();
    ctx.setLineDash([]);
    const a = pts[pts.length - 1], b = pts[pts.length - 2];
    const w = Math.atan2(a[1] - b[1], a[0] - b[0]);
    ctx.save();
    ctx.translate(a[0], a[1]);
    ctx.rotate(w);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-9, -4.5);
    ctx.lineTo(-9, 4.5);
    ctx.closePath();
    ctx.fillStyle = "#ffb000";
    ctx.fill();
    ctx.restore();
  }
}

/* Ebene 6 — Intel-Callouts: warum diese Stelle ueberhaupt zaehlt. */
function zeichneCallouts() {
  ctx.font = '10px ui-monospace,Menlo,Consolas,monospace';
  // Boxen duerfen sich nicht ueberdecken — sonst ist die Ebene unlesbar,
  // und genau das soll die Ebenensteuerung ja verhindern.
  const belegt = [];
  const frei = (r) => !belegt.some((m) =>
    !(r[2] < m[0] || r[0] > m[2] || r[3] < m[1] || r[1] > m[3]));
  for (const c of CALLOUTS) {
    const [x, y] = view.project(c.p[0], c.p[1]);
    if (x < 0 || x > W || y < 0 || y > H) continue;
    const zeilen = umbruch(c.b, 30);
    const bw = 190, bh = 16 + zeilen.length * 12;
    // Vier Ankerstellen durchprobieren, sonst weglassen.
    let bx = null, by = null;
    for (const [dx, dy] of [[18, -bh - 14], [18, 16], [-bw - 18, -bh - 14], [-bw - 18, 16]]) {
      const px = Math.min(Math.max(8, x + dx), W - bw - 8);
      const py = Math.min(Math.max(8, y + dy), H - bh - 8);
      if (frei([px - 4, py - 4, px + bw + 4, py + bh + 4])) { bx = px; by = py; break; }
    }
    if (bx === null) continue;
    belegt.push([bx - 4, by - 4, bx + bw + 4, by + bh + 4]);
    ctx.strokeStyle = "rgba(0,230,118,.55)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(bx + 10, by + bh);
    ctx.stroke();
    ctx.fillStyle = "rgba(4,10,8,.9)";
    ctx.fillRect(bx, by, bw, bh);
    ctx.strokeStyle = "#00e676";
    ctx.strokeRect(bx, by, bw, bh);
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillStyle = "#00e676";
    ctx.letterSpacing = "1.4px";
    ctx.font = '700 10px ui-monospace,Menlo,Consolas,monospace';
    ctx.fillText(c.t, bx + 7, by + 5);
    ctx.letterSpacing = "0px";
    ctx.font = '10px ui-monospace,Menlo,Consolas,monospace';
    ctx.fillStyle = "#9fd8bd";
    zeilen.forEach((z, i) => ctx.fillText(z, bx + 7, by + 19 + i * 12));
  }
}

function umbruch(t, n) {
  const worte = t.split(" ");
  const raus = [];
  let z = "";
  for (const w of worte) {
    if ((z + " " + w).trim().length > n) { raus.push(z.trim()); z = w; }
    else z += " " + w;
  }
  if (z.trim()) raus.push(z.trim());
  return raus;
}

/* Fadenkreuz-Markierungen an den Kartenraendern. */
function zeichneFadenkreuz() {
  ctx.strokeStyle = "rgba(0,230,118,.32)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  const L = 16;
  for (const [x, y, sx, sy] of [[6, 6, 1, 1], [W - 6, 6, -1, 1],
                                [6, H - 6, 1, -1], [W - 6, H - 6, -1, -1]]) {
    ctx.moveTo(x, y + sy * L); ctx.lineTo(x, y); ctx.lineTo(x + sx * L, y);
  }
  ctx.moveTo(W / 2 - 8, 6); ctx.lineTo(W / 2 + 8, 6);
  ctx.moveTo(W / 2, 6); ctx.lineTo(W / 2, 14);
  ctx.stroke();
}

/* Gradnetz als dezentes Raster — gehoert zum Erscheinungsbild eines
   Lagemonitors und hilft beim Abschaetzen von Entfernungen. */
function zeichneRaster(ctx) {
  const [vw, vs, ve, vn] = view.bbox;
  const spanne = ve - vw;
  const schritt = spanne > 120 ? 20 : spanne > 40 ? 10 : spanne > 12 ? 5 : spanne > 4 ? 1 : 0.5;
  ctx.strokeStyle = "rgba(0,230,118,.07)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let lon = Math.ceil(vw / schritt) * schritt; lon <= ve; lon += schritt) {
    const [x] = view.project(lon, 0);
    ctx.moveTo(x, 0);
    ctx.lineTo(x, H);
  }
  for (let lat = Math.ceil(vs / schritt) * schritt; lat <= vn; lat += schritt) {
    const [, y] = view.project(0, lat);
    if (y >= 0 && y <= H) {
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
    }
  }
  ctx.stroke();
}

function zeichneLand(ctx, rollen) {
  ctx.fillStyle = F.see;
  ctx.fillRect(0, 0, W, H);

  const [vw, vs, ve, vn] = view.bbox;
  const detail = ve - vw < 60;

  // Land
  ctx.lineJoin = "round";
  for (const l of LAENDER) {
    let ist = false;
    ctx.beginPath();
    for (const p of l.polys) {
      const [w, s, e, n] = p.bbox;
      if (n < vs || s > vn) continue;
      // Winzige Inseln bei weitem Zoom weglassen — sie kosten Zeit und
      // waeren ohnehin kleiner als ein Pixel.
      if (!detail && e - w < 0.4 && n - s < 0.4) continue;
      // Drei Laengengrad-Lagen pruefen, damit Ringe an der Datumsgrenze auf
      // beiden Kartenraendern erscheinen.
      for (const off of [-360, 0, 360]) {
        if (e + off < vw || w + off > ve) continue;
        ist = true;
        const pts = p.pts;
        let px = null, py = null;
        for (let i = 0; i < pts.length; i++) {
          const [x, y] = view.project(pts[i][0] + off, pts[i][1]);
          // Punkte, die auf denselben Bildpunkt fallen, ueberspringen.
          if (i && i < pts.length - 1 &&
              Math.abs(x - px) < 0.7 && Math.abs(y - py) < 0.7) continue;
          i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
          px = x;
          py = y;
        }
        ctx.closePath();
      }
    }
    if (!ist) continue;
    const rolle = rollen[l.n];
    ctx.fillStyle = rolle ? ROLLEN[rolle].fill : aktiv ? F.landAktiv : F.land;
    // Nonzero, nicht evenodd: ein Land besteht aus mehreren getrennten
    // Landmassen plus echten Loechern (Enklaven, Seen). Bei evenodd loeschen
    // sich zwei uebereinanderliegende Flaechen gegenseitig aus — dann kippen
    // Land und Wasser um. Die Umlaufrichtung der Ringe traegt die Information,
    // welcher Ring ein Loch ist.
    ctx.fill("nonzero");
    ctx.strokeStyle = rolle ? ROLLEN[rolle].c : F.kueste;
    ctx.lineWidth = rolle ? 1.4 : detail ? 1 : 0.6;
    ctx.stroke();
  }
}

/* Bildschirmflaeche, die Punkt und Beschriftung eines Markers belegen. */
function markenKaesten() {
  ctx.font = "11px ui-sans-serif,system-ui,sans-serif";
  return ENGEN.map((e) => {
    const [x, y] = view.project(e.pos[0], e.pos[1]);
    const b = ctx.measureText(e.kurz).width;
    return [x - 12, y - 20, x + 14 + b, y + 12];
  });
}

function ueberschneidet(k, kaesten) {
  return kaesten.some(
    (m) => !(k[2] < m[0] || k[0] > m[2] || k[3] < m[1] || k[1] > m[3])
  );
}

function zeichneMeere(kaesten) {
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (const m of MEERE) {
    const [x, y] = view.project(m.p[0], m.p[1]);
    if (x < -60 || x > W + 60 || y < 0 || y > H) continue;
    ctx.fillStyle = m.s ? F.dim : "#55627a";
    ctx.font = m.s
      ? "600 11px ui-sans-serif,system-ui,sans-serif"
      : "10px ui-sans-serif,system-ui,sans-serif";
    const b = ctx.measureText(m.t).width / 2 + (m.s ? 14 : 4);
    if (kaesten && ueberschneidet([x - b, y - 8, x + b, y + 8], kaesten)) continue;
    ctx.letterSpacing = m.s ? "2px" : "0.5px";
    ctx.fillText(m.t, x, y);
    ctx.letterSpacing = "0px";
  }
}

/* Im Detailbild den Namen der Meerenge selbst setzen — sonst sieht man eine
   Kueste, weiss aber nicht, worauf man schaut. */
function zeichneEngenName(e) {
  const [x, y] = view.project(e.pos[0], e.pos[1]);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "600 15px ui-sans-serif,system-ui,sans-serif";
  ctx.letterSpacing = "1.5px";
  ctx.fillStyle = F.ink;
  // Etwas oberhalb des Punktes, damit der Name nicht auf kleinen
  // Ortsmarken derselben Stelle liegt (etwa der Insel Perim).
  halo(e.name.toUpperCase(), x, y - 26);
  ctx.letterSpacing = "0px";
}

/* Marker der Meerengen auf der Weltkarte. */
function zeichneMarken(now) {
  const puls = 1 + 0.35 * Math.sin(now / 520);
  for (const e of ENGEN) {
    const [x, y] = view.project(e.pos[0], e.pos[1]);
    const ist = hover === e;
    const geloest = modus === "quiz" && quiz.antwort && quiz.frage === e;

    if (modus === "quiz" && !geloest) {
      // Im Quiz keine Beschriftung — sonst waere die Frage schon beantwortet.
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, 7);
      ctx.fillStyle = "#455063";
      ctx.fill();
      continue;
    }

    // Farbe nach Chokepoint-Status, wenn die Ebene an ist — sonst neutral.
    const st = AN.status && STATUS[e.id] ? STATUS_FARBEN[STATUS[e.id].s].c : F.markeAus;
    const r = ist ? 7 * puls : 5.5;
    ctx.strokeStyle = st;
    ctx.lineWidth = 1.8;
    ctx.strokeRect(x - r, y - r, r * 2, r * 2);
    ctx.fillStyle = st;
    ctx.fillRect(x - 2, y - 2, 4, 4);
    if (AN.status && STATUS[e.id] && STATUS[e.id].s !== "gruen") {
      // Bedrohte Engen bekommen einen laufenden Ring — faellt im
      // Randbereich des Blickfelds auf, ohne die Karte zuzukleistern.
      ctx.globalAlpha = 0.75 - 0.55 * (puls - 0.65);
      ctx.beginPath();
      ctx.arc(x, y, r + 5 + 4 * puls, 0, 7);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    ctx.font = (ist ? "700 " : "") + '10px ui-monospace,Menlo,Consolas,monospace';
    ctx.letterSpacing = "1.2px";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    const tx = x + 10, ty = y - 9;
    ctx.lineWidth = 3;
    ctx.strokeStyle = F.see;
    ctx.strokeText(e.kurz.toUpperCase(), tx, ty);
    ctx.fillStyle = ist ? F.ink : F.ink2;
    ctx.fillText(e.kurz.toUpperCase(), tx, ty);
    ctx.letterSpacing = "0px";
  }

  // Im Quiz zusaetzlich: der geklickte Punkt und die Luftlinie zur Loesung.
  if (modus === "quiz" && quiz.antwort) {
    const a = view.project(quiz.antwort[0], quiz.antwort[1]);
    const b = view.project(quiz.frage.pos[0], quiz.frage.pos[1]);
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = F.ink2;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(a[0], a[1]);
    ctx.lineTo(b[0], b[1]);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.arc(a[0], a[1], 5, 0, 7);
    ctx.fillStyle = "#3987e5";
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = F.see;
    ctx.stroke();
  }
}

/* Beschriftung im Detailbild: Laender, Meere, Staedte. */
function zeichneOrte(e) {
  ctx.textBaseline = "middle";
  for (const o of e.orte) {
    const [x, y] = view.project(o.p[0], o.p[1]);
    if (x < 0 || x > W || y < 0 || y > H) continue;
    ctx.textAlign = "center";
    if (o.k === "stadt") {
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, 7);
      ctx.fillStyle = F.ink2;
      ctx.fill();
      ctx.font = "11px ui-sans-serif,system-ui,sans-serif";
      ctx.fillStyle = F.ink2;
      ctx.textAlign = "left";
      halo(o.t, x + 7, y);
      continue;
    }
    if (o.k === "land") {
      ctx.font = "600 12px ui-sans-serif,system-ui,sans-serif";
      ctx.letterSpacing = "2.5px";
      ctx.fillStyle = "#93a0b4";
    } else if (o.k === "wasser") {
      ctx.font = "italic 12px ui-sans-serif,system-ui,sans-serif";
      ctx.fillStyle = "#63799b";
    } else {
      ctx.font = "10px ui-sans-serif,system-ui,sans-serif";
      ctx.fillStyle = F.dim;
    }
    halo(o.t, x, y);
    ctx.letterSpacing = "0px";
  }
}

function halo(t, x, y) {
  const f = ctx.fillStyle;
  ctx.lineWidth = 3.5;
  ctx.strokeStyle = "rgba(14,21,32,.85)";
  ctx.strokeText(t, x, y);
  ctx.fillStyle = f;
  ctx.fillText(t, x, y);
}

/* Seewege als Pfeile. Die Bewegung laeuft in Fahrtrichtung — damit ist ohne
   Legende klar, wohin die Ladung geht. */
function zeichneRouten(e, now) {
  for (const r of e.routen) {
    const farbe = ROUTEN_FARBEN[r.f].c;
    const pts = r.p.map((p) => view.project(p[0], p[1]));

    // Catmull-Rom als Bezier: die Kurve laeuft durch jeden Wegpunkt.
    // Die frueher genutzte Variante mit Mittelpunkten schnitt Kurven ab und
    // lief dadurch ueber Land, obwohl die Wegpunkte selbst im Wasser lagen.
    const bahn = () => {
      ctx.beginPath();
      ctx.moveTo(pts[0][0], pts[0][1]);
      for (let i = 0; i < pts.length - 1; i++) {
        const p0 = pts[i - 1] || pts[i], p1 = pts[i];
        const p2 = pts[i + 1], p3 = pts[i + 2] || pts[i + 1];
        ctx.bezierCurveTo(
          p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6,
          p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6,
          p2[0], p2[1]);
      }
    };

    // Kanaele und sehr schmale Engen sind in den Kartendaten kein Wasser:
    // Suez und Panama sind durch Land gegraben, der Bosporus ist mit 700 m
    // schmaler als die Aufloesung. Damit die Linie nicht wie ein Fehler
    // aussieht, wird der Fahrweg als Wasserband unter die Route gelegt.
    if (r.kanal) {
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = F.see;
      ctx.lineWidth = 9;
      bahn();
      ctx.stroke();
    }

    ctx.strokeStyle = farbe;
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.setLineDash([14, 10]);
    ctx.lineDashOffset = -(now / 45) % 24;
    bahn();
    ctx.stroke();
    ctx.setLineDash([]);

    // Pfeilspitzen. Fast jede dieser Routen wird in beide Richtungen
    // befahren — ein einzelner Pfeil hat das falsch dargestellt.
    const spitze = (an, von) => {
      const a = Math.atan2(an[1] - von[1], an[0] - von[0]);
      ctx.save();
      ctx.translate(an[0], an[1]);
      ctx.rotate(a);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-13, -7);
      ctx.lineTo(-13, 7);
      ctx.closePath();
      ctx.fillStyle = farbe;
      ctx.fill();
      ctx.restore();
    };
    spitze(pts[pts.length - 1], pts[pts.length - 2]);
    if (r.richtung !== "vor") spitze(pts[0], pts[1]);

    // Direkte Beschriftung statt Legende — eine Route, ein Name. Nicht in
    // die Mitte: dort steht der Name der Meerenge.
    const m = pts[Math.max(1, Math.floor(pts.length * 0.25))];
    ctx.font = "600 11px ui-sans-serif,system-ui,sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    ctx.fillStyle = farbe;
    halo(r.t, m[0], m[1] - 12);
  }
}

/* ---------- Interaktion ---------- */

function mausPos(ev) {
  const r = cv.getBoundingClientRect();
  return [ev.clientX - r.left, ev.clientY - r.top];
}

function trefferMarke(mx, my) {
  for (const e of ENGEN) {
    const [x, y] = view.project(e.pos[0], e.pos[1]);
    if ((x - mx) ** 2 + (y - my) ** 2 < 20 * 20) return e;
  }
  return null;
}

function onMove(ev) {
  if (modus !== "welt") {
    hover = null;
    cv.style.cursor = modus === "quiz" && !quiz.antwort ? "crosshair" : "default";
    return;
  }
  const [mx, my] = mausPos(ev);
  hover = trefferMarke(mx, my);
  cv.style.cursor = hover ? "pointer" : "default";
}

function onClick(ev) {
  const [mx, my] = mausPos(ev);
  if (modus === "quiz") {
    if (quiz.antwort) return;
    pruefeAntwort(view.invert(mx, my));
    return;
  }
  if (modus !== "welt") return;
  const e = trefferMarke(mx, my);
  if (e) zeigeEnge(e);
}

/* ---------- Ebenen-Schaltpult ---------- */

/* Wie viele Objekte eine Ebene beisteuert — steht im Schalter, damit man
   vorher weiss, was man sich auf die Karte holt. */
function ebenenAnzahl(id) {
  return { konflikte: KONFLIKTE.length, ziele: ZIELE.length,
           kontrolle: KONTROLLZONEN.length, status: Object.keys(STATUS).length,
           vektoren: VEKTOREN.length, callouts: CALLOUTS.length }[id];
}

function bauEbenen() {
  const el = document.getElementById("ebenen");
  el.innerHTML =
    '<div class="kopf">EBENEN <span id="ebZahl"></span></div>' +
    EBENEN.map((e) =>
      '<div class="zeile" data-eb="' + e.id + '" style="color:' + e.farbe + '">' +
        '<span class="sw"></span>' +
        '<span class="txt">' + e.t + '</span>' +
        '<span class="anz">' + ebenenAnzahl(e.id) + '</span>' +
      "</div>").join("") +
    '<div class="fuss">Bewertung aus offenen Quellen. Statusangaben ' +
    'veralten schnell — Datum prüfen.</div>';
  el.querySelectorAll(".zeile").forEach((z) => {
    z.onclick = () => schalteEbene(z.dataset.eb);
  });
  malEbenen();
}

function schalteEbene(id) {
  AN[id] = !AN[id];
  // Die Grundkarte muss neu, weil die Statusfarben dort nicht drinstecken —
  // aber der Schluessel enthaelt die Ebenen nicht, also von Hand ungueltig.
  basisSchluessel = "";
  malEbenen();
}

function malEbenen() {
  document.querySelectorAll("#ebenen .zeile").forEach((z) => {
    z.classList.toggle("an", !!AN[z.dataset.eb]);
  });
  const n = EBENEN.filter((e) => AN[e.id]).length;
  document.getElementById("ebZahl").textContent = n + "/" + EBENEN.length;
  const lg = document.getElementById("lgEbenen");
  if (lg) lg.textContent = n + " / " + EBENEN.length;
}

function bauStatuslegende() {
  document.getElementById("statuslegende").innerHTML =
    '<div class="z" style="color:var(--ink2);letter-spacing:1.6px;' +
    'margin-bottom:6px">CHOKEPOINT-STATUS</div>' +
    Object.keys(STATUS_FARBEN).map((k) =>
      '<div class="z"><i style="background:' + STATUS_FARBEN[k].c +
      ';box-shadow:0 0 7px ' + STATUS_FARBEN[k].c + '"></i>' +
      STATUS_FARBEN[k].t + "</div>").join("");
}

/* ---------- Panel und Liste ---------- */

function bauLegende(e) {
  const zaehl = { kontrolle: e.betroffen.kontrolle.length,
                  ausfuhr: e.betroffen.ausfuhr.length,
                  einfuhr: e.betroffen.einfuhr.length };
  document.getElementById("legende").innerHTML =
    Object.keys(ROLLEN).map((k) =>
      '<div class="z"><i style="background:' + ROLLEN[k].fill +
      ';border-color:' + ROLLEN[k].c + '"></i>' + ROLLEN[k].t +
      ' <span style="color:var(--dim)">· ' + zaehl[k] + ' Länder</span></div>').join("") +
    '<div class="hw">' + e.betroffen.hinweis + '</div>';
}

function bauPanel(e) {
  const rf = (r) => ROUTEN_FARBEN[r.f];
  const zeile = (k, v) =>
    '<div class="z"><span class="k">' + k + '</span><span class="v">' + v + "</span></div>";
  document.getElementById("panel").innerHTML =
    '<h2>' + e.name + "</h2>" +
    '<div class="reg">' + e.region + "</div>" +
    '<div class="fakten">' +
      zeile("Breite", e.breite) +
      zeile("Verkehr", e.menge) +
      zeile("Anrainer", e.anrainer) +
      (STATUS[e.id] ? zeile("Status",
        '<span style="color:' + STATUS_FARBEN[STATUS[e.id].s].c + '">■ ' +
        STATUS_FARBEN[STATUS[e.id].s].t + "</span><br>" + STATUS[e.id].b) : "") +
      zeile("Kontrolle", e.betroffen.kontrolle
        .map((k) => "<b>" + k.t + "</b> — " + k.rolle).join("<br>")) +
    "</div>" +
    '<button class="bt" onclick="setAnsicht(\'betroffen\')">Betroffene Länder auf der Karte zeigen</button>' +
    "<h3>Warum sie zählt</h3><p>" + e.warum + "</p>" +
    "<h3>Was man wissen sollte</h3><p>" + e.detail + "</p>" +
    '<h3>Lage <span class="tag">veraltet schnell</span></h3><p>' + e.lage + "</p>" +
    "<h3>Gibt es einen Umweg?</h3><p>" + e.umweg + "</p>" +
    '<div class="legende">' +
      e.routen
        .map((r) => '<span><i style="background:' + rf(r).c + '"></i>' + rf(r).t + "</span>")
        .join("") +
    "</div>" +
    '<h3>Quellen</h3><ul class="q">' +
      e.quellen.map((q) => "<li>" + q + "</li>").join("") +
    "</ul>";
  document.getElementById("panel").scrollTop = 0;
}

/* An der Wortgrenze abschneiden — "Nordostasien — und auf der Insel dahi…"
   liest sich wie ein Fehler. */
function kuerze(t, n) {
  if (t.length <= n) return t;
  const s = t.slice(0, n);
  return s.slice(0, s.lastIndexOf(" ")).replace(/[ ,;:—-]+$/, "") + " …";
}

function bauListe() {
  document.getElementById("liste").innerHTML = ENGEN.map(
    (e) =>
      '<button class="karte" data-id="' + e.id + '">' +
      "<h3>" + e.name + "</h3>" +
      '<div class="reg">' + e.region + "</div>" +
      "<p>" + kuerze(e.warum, 150) + "</p>" +
      '<div class="mini">' + e.breite + "</div>" +
      "</button>"
  ).join("");
  document.querySelectorAll("#liste .karte").forEach((b) => {
    b.onclick = () => zeigeEnge(ENGEN.find((e) => e.id === b.dataset.id));
  });
}

/* ---------- Quiz ---------- */

function naechsteFrage() {
  if (!quiz.rest.length) quiz.rest = ENGEN.slice().sort(() => Math.random() - 0.5);
  quiz.frage = quiz.rest.pop();
  quiz.antwort = null;
  fliegeZu(WELT_BBOX);
  document.getElementById("qfrage").textContent =
    "Wo liegt: " + quiz.frage.name + "?";
  document.getElementById("qhilfe").textContent = "Klick auf die Karte.";
  document.getElementById("qergebnis").textContent = "";
  document.getElementById("weiter").hidden = true;
  zeigePunkte();
}

function pruefeAntwort(ll) {
  quiz.antwort = ll;
  const km = Math.round(distKm(ll, quiz.frage.pos));
  quiz.runden++;
  // Bewertung nach Entfernung: unter 500 km hat man die Stelle wirklich
  // getroffen, unter 1500 die Region.
  let txt, cls;
  if (km < 500) {
    txt = "Sitzt. " + km + " km daneben.";
    cls = "gut";
    quiz.punkte++;
  } else if (km < 1500) {
    txt = "Richtige Ecke — " + km + " km daneben.";
    cls = "ok";
  } else {
    txt = km + " km daneben.";
    cls = "schlecht";
  }
  const el = document.getElementById("qergebnis");
  el.textContent = txt + " " + quiz.frage.name + ": " + quiz.frage.region + ".";
  el.className = cls;
  document.getElementById("qhilfe").textContent = "";
  document.getElementById("weiter").hidden = false;
  zeigePunkte();
}

function zeigePunkte() {
  document.getElementById("qpunkte").textContent =
    quiz.punkte + " / " + quiz.runden;
}

addEventListener("DOMContentLoaded", init);
