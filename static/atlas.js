/* Der Atlas: zeichnen, zoomen, klicken.
   Reines Canvas, keine Bibliothek. */

const WELT_BBOX = [-180, -58, 180, 80];

let cv, ctx, W = 0, H = 0, DPR = 1;
let LAENDER = [];          // dekodierte Ringe mit vorberechneter Bounding-Box
let view = null;           // aktuelle Projektion
let ziel = null;           // Ziel-Ausschnitt der laufenden Animation
let anim = null;
let modus = "welt";        // welt | detail | quiz
let aktiv = null;          // angezeigte Meerenge
let hover = null;
let t0 = performance.now();

/* Quiz-Zustand */
let quiz = { frage: null, rest: [], antwort: null, punkte: 0, runden: 0 };

const F = {
  see: "#0e1520",
  land: "#232a33",
  landAktiv: "#2c3540",
  kueste: "#465264",
  ink: "#f2f4f7",
  ink2: "#a8b2c1",
  dim: "#6f7a8a",
  marke: "#e66767",
  markeAus: "#8d99ab",
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
  document.querySelectorAll("nav button[data-modus]").forEach((b) => {
    b.onclick = () => setModus(b.dataset.modus);
  });
  document.getElementById("zurueck").onclick = () => setModus("welt");
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
  modus = "detail";
  document.body.dataset.modus = "detail";
  requestAnimationFrame(resize);
  document.querySelectorAll("nav button[data-modus]").forEach((b) =>
    b.classList.remove("an")
  );
  fliegeZu(e.zoom);
  bauPanel(e);
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

function zeichne(now) {
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
    ctx.fillStyle = aktiv ? F.landAktiv : F.land;
    // Nonzero, nicht evenodd: ein Land besteht aus mehreren getrennten
    // Landmassen plus echten Loechern (Enklaven, Seen). Bei evenodd loeschen
    // sich zwei uebereinanderliegende Flaechen gegenseitig aus — dann kippen
    // Land und Wasser um. Die Umlaufrichtung der Ringe traegt die Information,
    // welcher Ring ein Loch ist.
    ctx.fill("nonzero");
    ctx.strokeStyle = F.kueste;
    ctx.lineWidth = detail ? 1 : 0.6;
    ctx.stroke();
  }

  if (modus === "detail" && aktiv) {
    zeichneRouten(aktiv, now);
    zeichneOrte(aktiv);
    zeichneEngenName(aktiv);
  } else {
    // Erst die Marker vermessen, dann die Meeresnamen zeichnen: ein
    // Meeresname, der unter einem Marker liegt, wird weggelassen statt
    // uebereinandergedruckt.
    zeichneMeere(markenKaesten());
    zeichneMarken(now);
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

    ctx.beginPath();
    ctx.arc(x, y, (ist ? 7 : 5) * (ist ? puls : 1), 0, 7);
    ctx.fillStyle = ist || geloest ? F.marke : F.markeAus;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = F.see;
    ctx.stroke();

    ctx.font = (ist ? "600 " : "") + "11px ui-sans-serif,system-ui,sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    const tx = x + 10, ty = y - 9;
    ctx.lineWidth = 3;
    ctx.strokeStyle = F.see;
    ctx.strokeText(e.kurz, tx, ty);
    ctx.fillStyle = ist ? F.ink : F.ink2;
    ctx.fillText(e.kurz, tx, ty);
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

    ctx.strokeStyle = farbe;
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.setLineDash([14, 10]);
    ctx.lineDashOffset = -(now / 45) % 24;
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) {
      const p = pts[i - 1], q = pts[i];
      ctx.quadraticCurveTo(p[0], p[1], (p[0] + q[0]) / 2, (p[1] + q[1]) / 2);
    }
    const last = pts[pts.length - 1];
    ctx.lineTo(last[0], last[1]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Pfeilspitze am Ende
    const vor = pts[pts.length - 2];
    const a = Math.atan2(last[1] - vor[1], last[0] - vor[0]);
    ctx.save();
    ctx.translate(last[0], last[1]);
    ctx.rotate(a);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-13, -7);
    ctx.lineTo(-13, 7);
    ctx.closePath();
    ctx.fillStyle = farbe;
    ctx.fill();
    ctx.restore();

    // Direkte Beschriftung statt Legende — eine Route, ein Name. Nicht in
    // die Mitte: dort steht der Name der Meerenge.
    const m = pts[Math.max(1, Math.floor(pts.length * 0.25))];
    ctx.font = "600 11px ui-sans-serif,system-ui,sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    ctx.fillStyle = farbe;
    halo(r.t, m[0], m[1] - 10);
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

/* ---------- Panel und Liste ---------- */

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
    "</div>" +
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
