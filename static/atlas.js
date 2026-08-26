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

/* Mehrfachauswahl von Ländern. Ein Klick schaltet ein Land dazu oder weg. */
const AUSWAHL = new Set();

/* Rollen der betroffenen Länder. Die drei Farben sind gegen den dunklen
   Untergrund und gegen Farbfehlsichtigkeit geprüft; zusätzlich trägt jedes
   Land seinen Namen, Farbe allein muss also nie ausreichen. */
const ROLLEN = {
  kontrolle: { c: "#199e70", fill: "#1b6b52", t: "Kontrolliert die Enge" },
  ausfuhr: { c: "#d95926", fill: "#8a3c1e", t: "Verschifft hier hinaus" },
  einfuhr: { c: "#3987e5", fill: "#2a5a94", t: "Empfängt über diese Route" },
  folge: { c: "#9085e9", fill: "#403a72", t: "Zweite Reihe — hängt an einem Betroffenen" },
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
  // Danach den Ring wieder in die Nähe der Karte rücken.
  //
  // Ohne das landete Russlands Hauptlandmasse bei Längengrad −333 bis −180:
  // je nachdem, wo der Ring anfängt, schaukelt sich der Versatz beim
  // Entwirren um volle 360 Grad auf. Gezeichnet wurde sie dann nur über die
  // Versatzkopie — das Land erschien doppelt — und die Trefferprüfung suchte
  // sie am falschen Ort.
  let w = Infinity, e = -Infinity;
  for (const [x] of out) { if (x < w) w = x; if (x > e) e = x; }
  const schub = Math.round((w + e) / 2 / 360) * 360;
  return schub ? out.map(([x, y]) => [x - schub, y]) : out;
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
    // Grobe Grösse, nur zum Vergleichen. Sie entscheidet bei Enklaven, wer
    // gewinnt: Liechtenstein liegt in Österreich, Monaco in Frankreich —
    // wer beide trifft, meint das kleinere.
    let flaeche = 0;
    for (const p of polys) {
      flaeche += (p.bbox[2] - p.bbox[0]) * (p.bbox[3] - p.bbox[1]);
    }
    return { n: l.n, id: l.id, polys: polys, flaeche: flaeche };
  });

  resize();
  addEventListener("resize", resize);
  cv.addEventListener("mousemove", onMove);
  cv.addEventListener("click", onClick);
  cv.addEventListener("wheel", onWheel, { passive: false });
  cv.addEventListener("mousedown", onDown);
  addEventListener("mouseup", onUp);
  cv.addEventListener("dblclick", (ev) => {
    const [x, y] = mausPos(ev);
    zoome(ev.shiftKey ? 0.5 : 2, x, y);
  });
  cv.addEventListener("mouseleave", () => {
    hover = null;
    hoverLand = null;
    cv.style.cursor = "default";
  });
  cv.style.cursor = "grab";
  // Tastatur: Zoomen, zurück zur Übersicht, Auswahl leeren.
  addEventListener("keydown", (ev) => {
    if (/^(INPUT|TEXTAREA)$/.test((ev.target || {}).tagName || "")) return;
    if (ev.key === "+" || ev.key === "=") zoome(1.5, W / 2, H / 2);
    else if (ev.key === "-") zoome(1 / 1.5, W / 2, H / 2);
    else if (ev.key === "0") zurueckZurUebersicht();
    else if (ev.key === "Escape") {
      if (AUSWAHL.size) { AUSWAHL.clear(); malAuswahl(); }
      else if (modus === "detail") setModus("welt");
    }
  });
  document.getElementById("zuruecksetzen").onclick = zurueckZurUebersicht;
  document.getElementById("pZu").onclick = () => {
    if (AUSWAHL.size) { AUSWAHL.clear(); malAuswahl(); }
    else setModus("welt");
  };

  bauListe();
  bauFenster();
  bauEbenen();
  bauStatuslegende();
  malAuswahl();
  bauFeedPanel();
  document.querySelectorAll("nav button[data-modus]").forEach((b) => {
    b.onclick = () => setModus(b.dataset.modus);
  });
  document.getElementById("zurueck").onclick = () => setModus("welt");
  document.querySelectorAll("#ansichten button").forEach((b) => {
    b.onclick = () => setAnsicht(b.dataset.ansicht);
  });
  document.getElementById("weiter").onclick = naechsteFrage;
  document.getElementById("stand").textContent = STAND;

  holeLive();
  holeFeed();
  holeVerlauf();
  holeLage();
  setInterval(holeFeed, 5 * 60 * 1000);
  document.body.dataset.frei = "nein";
  view = makeView(WELT_BBOX, W, H);
  // Startbild ist die Karte. Die Lage steht daneben im Panel — beides auf
  // einen Blick, ohne einen Klick.
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
  // Erste Reihe: unmittelbar an der Enge.
  for (const l of b.einfuhr) m[l.ne] = "einfuhr";
  for (const l of b.ausfuhr) m[l.ne] = "ausfuhr";
  for (const l of b.kontrolle) m[l.ne] = "kontrolle";
  // Zweite Reihe: wer mit einem Betroffenen Handel treibt, ist mitbetroffen —
  // eine gesperrte Enge trifft nicht nur den Anrainer, sondern dessen
  // Lieferanten und Abnehmer gleich mit. Wird aus den Handelspartnern der
  // ersten Reihe abgeleitet, nicht von Hand gepflegt.
  const erste = Object.keys(m);
  for (const name of erste) {
    const h = HANDEL[name];
    if (!h) continue;
    for (const p of h.pAus.concat(h.pEin)) if (!m[p]) m[p] = "folge";
  }
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
  // Die zweite Reihe bekommt ihren deutschen Namen aus den Handelsprofilen.
  for (const n of Object.keys(rollen)) {
    if (!namen[n]) namen[n] = (HANDEL[n] && HANDEL[n].t) || n;
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
    // Wie stark hängt dieses Land an genau dieser Enge? Das ist die
    // eigentliche Aussage — ohne sie sieht Japan aus wie Indien.
    const a = (ABHAENGIGKEIT[e.id] || {})[l.n];
    if (a) {
      ctx.font = '700 11px ui-monospace,Menlo,Consolas,monospace';
      ctx.fillStyle = a.wert >= 80 ? "#ff6b6b" : a.wert >= 50 ? "#ffb000" : "#8fd6b4";
      halo(a.wert + " %", x, y + 13);
      ctx.font = "600 11px ui-sans-serif,system-ui,sans-serif";
    }
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
  if (m === "lage") {
    aktiv = null;
    bauKacheln();
    if (!LAGE) holeLage();
  } else if (m === "welt") {
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
  document.getElementById("pTitel").textContent = e.name.toUpperCase();
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
  frei = false;
  document.body.dataset.frei = "nein";
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
      zeichneBetroffenBoegen(aktiv, now);
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
    zeichneHover();
  } else {
    zeichneHover();
    zeichneMeere(markenKaesten());
    if (AN.konflikte) zeichneKonflikte(now);
    if (AN.kontrolle) zeichneKontrollzonen();
    if (AN.vektoren) zeichneVektoren(now);
    if (AUSWAHL.size) zeichneAuswahlBoegen(now);
    zeichneMarken(now);
    if (AN.ziele) zeichneZiele(now);
    if (AN.callouts) zeichneCallouts();
  }
  if (AN.ereignisse) { zeichneBahnen(now); zeichneEreignisse(now); }
  zeichneAlarme(now);
  zeichneFadenkreuz();
}

/* ---------- Live-Daten ---------- */

/* Tägliche Durchfahrten je Enge, vom eigenen Server geholt (der wiederum
   IMF PortWatch abfragt). Beim Öffnen per Doppelklick vom Dateisystem gibt es
   keinen Server — dann bleibt es schlicht aus, statt Fehler zu werfen. */
let LIVE = null;
let FEED = null;
let FEED_VERSUCHT = false;   // erst nach dem ersten Abruf etwas behaupten
let FEED_FEHLER = null;

/* Die Statuszeile unten muss dasselbe zählen wie die Karte zeigt — sonst
   steht dort "7 Meldungen", während vier zu sehen sind. */
function malFeedStatus() {
  const feld = document.getElementById("lgFeed");
  if (!feld || !FEED || FEED.fehler) return;
  const b = beitraegeImFenster();
  const ereig = b.filter((x) => (x.arten || []).length).length;
  feld.innerHTML = '<b style="color:' + (ereig ? "var(--blut)" : "var(--phos)") +
    '">' + (ereig ? ereig + (ereig === 1 ? " EREIGNIS · " : " EREIGNISSE · ") : "") +
    b.length + (b.length === 1 ? " MELDUNG" : " MELDUNGEN") + "</b>";
  feld.title = "Zeitraum " + fensterText() + " · Stand " + (FEED.stand || "?");
}

/* ---------- Zeitfenster ----------

   Ohne das blieb jedes Ereignis für immer auf der Karte stehen: gezeichnet
   wurde schlicht alles, was der Feed hergab (bis zu 400 Meldungen), ohne
   Rücksicht auf das Alter. Nach zwei Tagen war die Karte zugepflastert und
   man sah nicht mehr, was gerade passiert.

   "alles" bleibt als Wahl erhalten — aber nicht als Voreinstellung. */

const FENSTER = [
  { id: "1", t: "1 STD", h: 1 },
  { id: "12", t: "12 STD", h: 12 },
  { id: "24", t: "1 TAG", h: 24 },
  { id: "168", t: "1 WOCHE", h: 168 },
  { id: "alle", t: "ALLES", h: 0 },
];
let fenster = "24";

/* Zeitpunkt einer Meldung als Millisekunden, oder null. Die Zeitangaben
   kommen normiert vom Server ("YYYY-MM-DDTHH:MM", UTC ohne Kennzeichnung) —
   das Z muss hier dran, sonst liest der Browser sie als Ortszeit und alles
   verschiebt sich um den eigenen Zeitzonenversatz. */
function zeitpunkt(iso) {
  if (!iso) return null;
  const t = Date.parse(iso + (/[Zz]|[+-]\d\d:?\d\d$/.test(iso) ? "" : "Z"));
  return isNaN(t) ? null : t;
}

/* Fällt die Meldung ins gewählte Fenster?

   Meldungen ohne Zeitstempel werden NICHT stillschweigend behalten: sie
   liessen sich sonst durch kein Fenster mehr wegfiltern und wären genau das
   Problem, das hier behoben wird. Sie erscheinen unter "ALLES" und die
   Meldungsspalte sagt, wie viele es sind. */
function imFenster(b) {
  const h = (FENSTER.find((f) => f.id === fenster) || {}).h || 0;
  if (!h) return true;
  const t = zeitpunkt(b.zeit);
  if (t === null) return false;
  return Date.now() - t <= h * 3600 * 1000;
}

function beitraegeImFenster() {
  return ((FEED || {}).beitraege || []).filter(imFenster);
}

function fensterText() {
  return (FENSTER.find((f) => f.id === fenster) || {}).t || "";
}

function bauFenster() {
  const el = document.getElementById("fenster");
  if (!el) return;
  el.innerHTML = FENSTER.map((f) =>
    '<button class="fb' + (f.id === fenster ? " an" : "") +
    '" data-f="' + f.id + '">' + f.t + "</button>").join("");
  el.querySelectorAll(".fb").forEach((b) => {
    b.onclick = () => {
      fenster = b.dataset.f;
      bauFenster();
      // Alles neu bauen, was gefiltert wird — Karte zeichnet sich ohnehin
      // in jedem Bild neu, die Listen nicht.
      GESEHEN.clear();
      ALARME.length = 0;
      bauEbenen();
      malFeedStatus();
      if (modus === "lage") bauKacheln();
      else if (!AUSWAHL.size && modus !== "detail") bauFeedPanel();
      else if (aktiv && modus === "detail") bauPanel(aktiv);
    };
  });
}
let VERLAUF = null;

async function holeLive() {
  const feld = document.getElementById("lgLive");
  try {
    const r = await fetch("api/live", { cache: "no-store" });
    if (!r.ok) throw new Error("HTTP " + r.status);
    const d = await r.json();
    // Zwischengespeicherte Werte nicht wegwerfen, nur weil der letzte Abruf
    // gestört war — sie bleiben brauchbar, müssen aber als solche
    // gekennzeichnet sein.
    const hatWerte = d.werte && Object.keys(d.werte).length;
    if (!hatWerte) throw new Error(d.fehler || "keine Daten");
    LIVE = d;
    feld.innerHTML = '<b style="color:' + (d.fehler ? "var(--amber)" : "var(--phos)") +
      '">' + d.stand + (d.fehler ? " · ABRUF GESTÖRT" : "") + "</b>";
    feld.title = d.quelle + (d.fehler ? " — letzter Abruf: " + d.fehler : "");
    basisSchluessel = "";
  } catch (e) {
    LIVE = null;
    // Sichtbar aus, nicht heimlich aus.
    feld.innerHTML = '<b style="color:var(--dim)">AUS</b>';
    feld.title = "Kein Live-Abruf: " + e.message;
  }
}

/* Status einer Meerenge: die Bewertung aus lagen.js ist von Hand gesetzt und
   veraltet. Wo Live-Zahlen vorliegen, wird daraus ein eigener Status
   abgeleitet und der SCHLECHTERE der beiden genommen — die Zahlen sehen den
   Verkehrseinbruch, die Bewertung kennt den militärischen Zusammenhang.
   Welcher gewonnen hat, steht im Panel. */
const RANG = { gruen: 0, amber: 1, rot: 2 };

function statusVon(id) {
  const hand = STATUS[id];
  const w = LIVE && LIVE.werte ? LIVE.werte[id] : null;
  if (!w || w.abw === undefined) {
    return hand ? { s: hand.s, b: hand.b, quelle: "Bewertung, " + STAND } : null;
  }
  // Verkehr weit unter dem Normalwert heisst: die Enge wird gemieden.
  const abw = w.abw;
  const ausZahl = abw <= -35 ? "rot" : abw <= -15 ? "amber" : "gruen";
  const zahlText = "Durchfahrten " + w.n + "/Tag gegenüber sonst " + w.mittel +
    " (" + (abw > 0 ? "+" : "") + abw + " %).";
  if (!hand) return { s: ausZahl, b: zahlText, quelle: "aus Live-Zahlen" };
  const schlechter = RANG[ausZahl] >= RANG[hand.s] ? ausZahl : hand.s;
  return {
    s: schlechter,
    b: zahlText + " " + hand.b,
    quelle: RANG[ausZahl] > RANG[hand.s] ? "aus Live-Zahlen hochgestuft"
      : RANG[ausZahl] < RANG[hand.s] ? "Bewertung, " + STAND + " (Zahlen wären milder)"
      : "Zahlen und Bewertung stimmen überein",
  };
}

/* Beiträge aus den verfolgten Telegram-Kanälen. Ohne eingerichteten Zugang bleibt die
   Anzeige sichtbar leer statt stillschweigend zu fehlen. */
async function holeFeed() {
  const feld = document.getElementById("lgFeed");
  try {
    const r = await fetch("api/feed", { cache: "no-store" });
    if (!r.ok) throw new Error("HTTP " + r.status);
    const d = await r.json();
    FEED = d;
    if (d.fehler) {
      feld.innerHTML = '<b style="color:var(--dim)">' +
        (d.fehler === "nicht eingerichtet" ? "NICHT EINGERICHTET" : "FEHLER") + "</b>";
      feld.title = d.fehler;
    } else {
      malFeedStatus();
    }
  } catch (e) {
    FEED = null;
    FEED_FEHLER = e.message;
    feld.innerHTML = '<b style="color:var(--dim)">AUS</b>';
    feld.title = e.message;
  }
  FEED_VERSUCHT = true;
  // Nach dem Abruf muss auch das gerendert werden, was den Feed anzeigt.
  // Fehlte das: das Meldungspanel blieb auf "wird geladen …" stehen, obwohl
  // die Daten längst da waren.
  pruefeAlarme();
  bauEbenen();
  if (aktiv && modus === "detail") bauPanel(aktiv);
  else if (!AUSWAHL.size) bauFeedPanel();
  if (modus === "lage") bauKacheln();
  holeLage();
}

async function holeVerlauf() {
  try {
    const r = await fetch("api/verlauf", { cache: "no-store" });
    if (r.ok) VERLAUF = await r.json();
  } catch (e) { VERLAUF = null; }
  if (aktiv && modus === "detail") bauPanel(aktiv);
}

/* Wie viel wurde über diese Enge geschrieben, und wann? Wochenweise, weil
   Tageswerte bei Kanälen zu zackig sind, um etwas zu erkennen. Der Ausschlag
   ist die Information — nicht die einzelne Nachricht. */
function verlaufBlock(engeId) {
  if (!VERLAUF || !VERLAUF.gesamt) return "";
  const wochen = {};
  for (const [tag, zaehl] of Object.entries(VERLAUF.tage)) {
    if (!zaehl[engeId]) continue;
    // Auf den Wochenanfang runden.
    const d = new Date(tag + "T00:00:00Z");
    d.setUTCDate(d.getUTCDate() - d.getUTCDay());
    const k = d.toISOString().slice(0, 10);
    wochen[k] = (wochen[k] || 0) + zaehl[engeId];
  }
  const keys = Object.keys(wochen).sort();
  if (!keys.length) {
    return '<h3>Verlauf der Erwähnungen</h3><p style="color:var(--dim);' +
      'font-size:11px">In ' + VERLAUF.gesamt + " ausgewerteten Nachrichten " +
      "kommt diese Enge nicht vor.</p>";
  }
  const werte = keys.map((k) => wochen[k]);
  const max = Math.max(...werte);
  const summe = werte.reduce((a, b) => a + b, 0);
  const spitze = keys[werte.indexOf(max)];
  const W = 360, H = 54;
  const punkte = werte.map((v, i) =>
    (keys.length < 2 ? W / 2 : (i / (keys.length - 1)) * W).toFixed(1) + "," +
    (H - (v / max) * (H - 6)).toFixed(1)).join(" ");
  return '<h3>Verlauf der Erwähnungen <span class="tag">Telegram</span></h3>' +
    '<svg class="spark" viewBox="0 0 ' + W + " " + H + '" preserveAspectRatio="none">' +
    '<polyline points="' + punkte + '" fill="none" stroke="#00e676" ' +
    'stroke-width="1.8" vector-effect="non-scaling-stroke"/></svg>' +
    '<div class="sparkf"><span>' + keys[0] + "</span><span>" +
    keys[keys.length - 1] + "</span></div>" +
    '<div class="hz"><span class="hk">Gesamt</span><span class="hv">' + summe +
    " Nachrichten in " + keys.length + " Wochen</span></div>" +
    '<div class="hz"><span class="hk">Spitze</span><span class="hv">' + max +
    " in der Woche ab " + spitze + "</span></div>";
}

/* Laufende Einschlagsdarstellungen. Eine neue Drohnen- oder Raketenmeldung
   soll man sehen, ohne ins Panel zu schauen — deshalb die Animation auf der
   Karte statt nur einer Zeile im Text. */
const ALARME = [];
const GESEHEN = new Set();
const HEFTIG = ["drohne", "rakete", "explosion", "angriff", "mine"];

function pruefeAlarme() {
  if (!FEED || !FEED.beitraege) return;
  let erster = GESEHEN.size === 0;
  for (const b of beitraegeImFenster()) {
    if (GESEHEN.has(b.id)) continue;
    GESEHEN.add(b.id);
    // Beim allerersten Abruf nicht die ganze Historie durchspielen.
    if (erster) continue;
    const arten = (b.arten || []).filter((a) => HEFTIG.includes(a));
    if (!arten.length) continue;
    // Am Ort des Geschehens, Enge nur als Rueckfall — wie bei den Symbolen.
    if (b.ort) {
      ALARME.push({ p: b.ort, art: arten[0], start: performance.now(),
                    text: ART_TEXT[arten[0]] || arten[0] });
      continue;
    }
    for (const id of b.engen || []) {
      const e = ENGEN.find((x) => x.id === id);
      if (e) ALARME.push({ p: e.pos, art: arten[0], start: performance.now(),
                           text: ART_TEXT[arten[0]] || arten[0] });
    }
  }
  while (ALARME.length > 12) ALARME.shift();
}

/* Ein Einschlag: eine Flugbahn, die aus der Tiefe kommt und auf den Punkt
   zuläuft, dann Druckwellen-Ringe. Der Höheneindruck entsteht durch den
   Bogen und seinen Schatten auf der Karte. */
function zeichneAlarme(now) {
  for (let i = ALARME.length - 1; i >= 0; i--) {
    const a = ALARME[i];
    const t = (now - a.start) / 4200;      // Gesamtdauer der Animation
    if (t > 1) { ALARME.splice(i, 1); continue; }
    const [x, y] = view.project(a.p[0], a.p[1]);
    if (x < -80 || x > W + 80) continue;

    // Phase 1: Anflug
    if (t < 0.42) {
      const f = t / 0.42;
      const w = -Math.PI / 4;
      const weit = Math.min(W, H) * 0.5;
      const sx = x + Math.cos(w) * weit, sy = y + Math.sin(w) * weit - 60;
      const px = sx + (x - sx) * f;
      const py = sy + (y - sy) * f - Math.sin(Math.PI * f) * 70;
      ctx.strokeStyle = "rgba(255,45,45,.35)";
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 5]);
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(px, py);
      ctx.stroke();
      ctx.setLineDash([]);
      // Schatten auf der Karte gibt dem Bogen seine Höhe
      const gx = sx + (x - sx) * f, gy = sy + 60 + (y - sy - 60) * f;
      ctx.globalAlpha = 0.3;
      ctx.beginPath();
      ctx.ellipse(gx, gy, 5, 2, 0, 0, 7);
      ctx.fillStyle = "#000";
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.beginPath();
      ctx.arc(px, py, 3.5, 0, 7);
      ctx.fillStyle = "#fff";
      ctx.fill();
      continue;
    }

    // Phase 2: Einschlag und Druckwellen
    const e = (t - 0.42) / 0.58;
    for (let k = 0; k < 3; k++) {
      const r = ((e * 1.5 - k * 0.22) % 1);
      if (r <= 0) continue;
      ctx.beginPath();
      ctx.arc(x, y, 6 + r * 55, 0, 7);
      ctx.strokeStyle = "rgba(255,45,45," + (0.7 * (1 - r)).toFixed(3) + ")";
      ctx.lineWidth = 2.5 * (1 - r) + 0.5;
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.arc(x, y, 5 * (1 - e) + 3, 0, 7);
    ctx.fillStyle = "#ff2d2d";
    ctx.fill();
    ctx.font = '700 10px ui-monospace,Menlo,Consolas,monospace';
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    ctx.fillStyle = "#ff8a8a";
    ctx.globalAlpha = Math.max(0, 1 - e);
    ctx.letterSpacing = "1.5px";
    halo(a.text.toUpperCase(), x, y - 16 - e * 14);
    ctx.letterSpacing = "0px";
    ctx.globalAlpha = 1;
  }
}

/* Symbole der Ereignisarten. Handgezeichnet, weil eine Bilddatei den
   Grundsatz "eine Datei, keine Abhängigkeiten" bräche — und weil sich
   Strichzeichnungen sauber in jeder Grösse zeichnen lassen. */
const ART_SYMBOL = {
  // Quadrokopter von oben: vier Ausleger mit Rotoren, Rumpf in der Mitte
  drohne: (c) => {
    for (const [x, y] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
      c.beginPath();
      c.moveTo(0, 0);
      c.lineTo(x * 5, y * 5);
      c.stroke();
      c.beginPath();
      c.arc(x * 6.5, y * 6.5, 2.6, 0, 7);
      c.stroke();
    }
    c.beginPath();
    c.rect(-2, -2, 4, 4);
    c.fill();
  },
  // Rakete im Anflug: Spitze, Rumpf, Leitwerk, Abgasfahne
  rakete: (c) => {
    c.beginPath();
    c.moveTo(0, -8);
    c.lineTo(2.6, -2);
    c.lineTo(2.6, 4);
    c.lineTo(-2.6, 4);
    c.lineTo(-2.6, -2);
    c.closePath();
    c.fill();
    c.beginPath();
    c.moveTo(-2.6, 2); c.lineTo(-5.5, 6); c.lineTo(-2.6, 5);
    c.moveTo(2.6, 2); c.lineTo(5.5, 6); c.lineTo(2.6, 5);
    c.stroke();
    c.beginPath();
    c.moveTo(0, 5); c.lineTo(0, 9);
    c.stroke();
  },
  // Explosion: Zackenstern
  explosion: (c) => {
    c.beginPath();
    for (let i = 0; i < 12; i++) {
      const w = (i / 12) * Math.PI * 2;
      const r = i % 2 ? 3.4 : 8.5;
      i ? c.lineTo(Math.cos(w) * r, Math.sin(w) * r)
        : c.moveTo(Math.cos(w) * r, Math.sin(w) * r);
    }
    c.closePath();
    c.fill();
  },
  // Angriff: gekreuzte Klingen
  angriff: (c) => {
    c.beginPath();
    c.moveTo(-6, -6); c.lineTo(6, 6);
    c.moveTo(6, -6); c.lineTo(-6, 6);
    c.lineWidth = 2.2;
    c.stroke();
  },
  // Seemine: Kugel mit Zündhörnern
  mine: (c) => {
    c.beginPath();
    c.arc(0, 0, 4.2, 0, 7);
    c.fill();
    for (let i = 0; i < 8; i++) {
      const w = (i / 8) * Math.PI * 2;
      c.beginPath();
      c.moveTo(Math.cos(w) * 4.2, Math.sin(w) * 4.2);
      c.lineTo(Math.cos(w) * 8, Math.sin(w) * 8);
      c.stroke();
    }
  },
  // Aufgebrachtes Schiff: Rumpf mit Haken darüber
  aufbringung: (c) => {
    c.beginPath();
    c.moveTo(-7, 2); c.lineTo(7, 2); c.lineTo(4.5, 6); c.lineTo(-4.5, 6);
    c.closePath();
    c.fill();
    c.beginPath();
    c.moveTo(0, -8); c.lineTo(0, -2);
    c.arc(0, -2, 2.6, -Math.PI / 2, Math.PI, true);
    c.stroke();
  },
  // Sperrung: Schlagbaum
  sperrung: (c) => {
    c.beginPath();
    c.moveTo(-8, 0); c.lineTo(8, 0);
    c.lineWidth = 3;
    c.stroke();
    c.beginPath();
    c.moveTo(-8, -4); c.lineTo(-8, 5);
    c.moveTo(8, -4); c.lineTo(8, 5);
    c.lineWidth = 1.6;
    c.stroke();
  },
  // Brand: Flamme
  brand: (c) => {
    c.beginPath();
    c.moveTo(0, -9);
    c.bezierCurveTo(5, -4, 6, 1, 2.5, 5);
    c.bezierCurveTo(1, 6.5, -1, 6.5, -2.5, 5);
    c.bezierCurveTo(-6, 1, -4, -3, 0, -9);
    c.closePath();
    c.fill();
  },
};

/* Flugbahnen: nur wenn Start UND Ziel im Text standen. Fehlt eines, wird
   keine Linie gezeichnet — eine erfundene Richtung wäre schlimmer als keine. */
function zeichneBahnen(now) {
  if (!FEED || !FEED.beitraege) return;
  let k = 0;
  for (const b of beitraegeImFenster()) {
    const bahn = b.bahn || [];
    const von = bahn[0], nach = bahn[1];
    if (!von || !nach || !(b.arten || []).length) continue;
    const geo = grosskreis(von, nach, 40);
    const pts = geo.map((p) => view.project(p[0], p[1]));
    const d = Math.hypot(pts[pts.length - 1][0] - pts[0][0],
                         pts[pts.length - 1][1] - pts[0][1]);
    const hoehe = Math.min(d * 0.28, H * 0.3);
    const bogen = pts.map((p, i) => {
      const t = i / (pts.length - 1);
      return [p[0], p[1] - Math.sin(Math.PI * t) * hoehe];
    });
    const pfad = (arr) => {
      ctx.beginPath();
      ctx.moveTo(arr[0][0], arr[0][1]);
      for (let i = 1; i < arr.length; i++) ctx.lineTo(arr[i][0], arr[i][1]);
    };
    // Bodenspur zeigt, worüber die Bahn läuft
    ctx.save();
    ctx.globalAlpha = 0.22;
    ctx.setLineDash([3, 5]);
    ctx.strokeStyle = "#ff2d2d";
    ctx.lineWidth = 1;
    pfad(pts);
    ctx.stroke();
    ctx.restore();
    ctx.strokeStyle = "rgba(255,45,45,.75)";
    ctx.lineWidth = 1.6;
    ctx.setLineDash([10, 7]);
    ctx.lineDashOffset = -(now / 38) % 17;
    pfad(bogen);
    ctx.stroke();
    ctx.setLineDash([]);
    // Symbol der Waffenart wandert die Bahn entlang
    const t = ((now / 5200) + (k++ * 0.19)) % 1;
    const i = Math.min(bogen.length - 2, Math.floor(t * (bogen.length - 1)));
    const [x, y] = bogen[i];
    const w = Math.atan2(bogen[i + 1][1] - y, bogen[i + 1][0] - x);
    const art = b.arten.find((a) => ART_SYMBOL[a]) || "rakete";
    ctx.save();
    ctx.translate(x, y);
    // Raketen und Drohnen zeigen in Flugrichtung; die Symbole sind nach
    // oben gezeichnet, deshalb eine Vierteldrehung dazu.
    ctx.rotate(w + Math.PI / 2);
    ctx.scale(0.8, 0.8);
    ctx.strokeStyle = "#ffb3b3";
    ctx.fillStyle = "#ffb3b3";
    ctx.lineWidth = 1.6;
    ctx.lineCap = "round";
    ART_SYMBOL[art](ctx);
    ctx.restore();
    // Zielmarkierung
    const z = pts[pts.length - 1];
    ctx.beginPath();
    ctx.arc(z[0], z[1], 5 + 2 * Math.sin(now / 300), 0, 7);
    ctx.strokeStyle = "#ff2d2d";
    ctx.lineWidth = 1.4;
    ctx.stroke();
  }
}

/* Alle bekannten Ereignisse als Symbole an ihrer Meerenge. Mehrere am
   selben Ort werden aufgefächert, sonst liegen sie übereinander. */
function zeichneEreignisse(now) {
  if (!FEED || !FEED.beitraege) return;
  // Gruppiert wird nach ORT, nicht nach Meerenge. Vorher sass ein Angriff
  // auf Odessa am Bosporus, weil das die einzige Position war, die es gab.
  const proOrt = {};
  const merke = (pos, art, b) => {
    const k = pos[0].toFixed(2) + "," + pos[1].toFixed(2);
    const g = (proOrt[k] = proOrt[k] || { pos: pos, liste: [] });
    g.liste.push({ art: art, b: b });
  };
  // Beim Zeichnen merken, wo welches Symbol landet — sonst liesse es sich
  // nicht anklicken. Die Liste wird in jedem Bild neu gefüllt.
  EREIGNIS_TREFFER.length = 0;
  for (const b of beitraegeImFenster()) {
    for (const art of b.arten || []) {
      if (!ART_SYMBOL[art]) continue;
      if (b.ort) {
        merke(b.ort, art, b);
        continue;
      }
      // Kein erkannter Ort — dann wenigstens an der genannten Meerenge.
      for (const id of b.engen || []) {
        const e = ENGEN.find((x) => x.id === id);
        if (e) merke(e.pos, art, b);
      }
    }
  }
  const puls = 0.72 + 0.28 * Math.sin(now / 480);
  for (const gruppe of Object.values(proOrt)) {
    const liste = gruppe.liste;
    const [mx, my] = view.project(gruppe.pos[0], gruppe.pos[1]);
    if (mx < -60 || mx > W + 60) continue;
    // Nur die jüngsten sechs, sonst wird der Ort unlesbar.
    const zeigen = liste.slice(0, 6);
    zeigen.forEach((z, i) => {
      // Halbkreis oberhalb des Markers auffächern.
      const w = -Math.PI / 2 + (i - (zeigen.length - 1) / 2) * 0.52;
      const r = 30;
      const x = mx + Math.cos(w) * r, y = my + Math.sin(w) * r;
      EREIGNIS_TREFFER.push({ x: x, y: y, art: z.art, b: z.b });
      ctx.save();
      ctx.translate(x, y);
      // Verbindungslinie zum Ort
      ctx.strokeStyle = "rgba(255,45,45,.3)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(mx - x, my - y);
      ctx.stroke();
      // Scheibe als Hintergrund, damit das Symbol auf der Karte lesbar ist
      ctx.beginPath();
      ctx.arc(0, 0, 11, 0, 7);
      ctx.fillStyle = "rgba(8,4,4,.88)";
      ctx.fill();
      const istMarkiert = z.b.id === MARKIERT;
      ctx.strokeStyle = istMarkiert ? "#ffb000" : "#ff2d2d";
      ctx.lineWidth = istMarkiert ? 2.2 : 1.4;
      ctx.globalAlpha = istMarkiert ? 1 : (i === 0 ? puls : 0.75);
      ctx.stroke();
      if (istMarkiert) {
        ctx.beginPath();
        ctx.arc(0, 0, 16 + Math.sin(now / 300) * 2, 0, 7);
        ctx.strokeStyle = "#ffb000";
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      ctx.strokeStyle = "#ff8a8a";
      ctx.fillStyle = "#ff8a8a";
      ctx.lineWidth = 1.4;
      ctx.lineCap = "round";
      ART_SYMBOL[z.art](ctx);
      ctx.restore();
    });
    // Anzahl, wenn mehr da sind als gezeigt
    if (liste.length > zeigen.length) {
      ctx.font = '700 9px ui-monospace,Menlo,Consolas,monospace';
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#ff8a8a";
      halo("+" + (liste.length - zeigen.length), mx + 34, my - 30);
    }
  }
}

const ART_TEXT = {
  drohne: "Drohne", rakete: "Rakete", explosion: "Explosion",
  angriff: "Angriff", mine: "Mine", aufbringung: "Schiff aufgebracht",
  sperrung: "Sperrung", brand: "Brand",
};

/* Ereignisse zu dieser Enge — das, wonach man tatsächlich Ausschau hält.
   Steht vor den übrigen Meldungen, damit man es nicht suchen muss. */
function ereignisBlock(engeId) {
  if (!FEED || FEED.fehler) return "";
  const tr = (FEED.beitraege || []).filter(
    (b) => b.engen.includes(engeId) && (b.arten || []).length);
  if (!tr.length) return "";
  return '<h3 style="color:#ff6b6b">Ereignisse <span class="tag">ungeprüft</span></h3>' +
    tr.slice(0, 6).map((b) =>
      '<div class="ereig"><div class="ek">' +
      (b.arten.map((a) => ART_TEXT[a] || a).join(" · ")) +
      "<span>" + (b.zeit || "").slice(0, 16).replace("T", " ") + "</span></div>" +
      '<div class="mt">' + b.text.replace(/[<>&]/g, "") + "</div>" +
      '<div class="eq">@' + b.konto + "</div></div>").join("");
}

/* Meldungen zu genau dieser Meerenge, als Block fürs Panel. */
function meldungsBlock(engeId) {
  if (!FEED) return "";
  const treffer = (FEED.beitraege || []).filter((b) => b.engen.includes(engeId));
  const kopf = '<h3>Meldungen <span class="tag">X · ungeprüft</span></h3>';
  if (FEED.fehler) {
    return kopf + '<p style="color:var(--dim);font-size:11px">' +
      (FEED.fehler === "nicht eingerichtet"
        ? "Keine X-Konten hinterlegt. Zugangstoken und Konten in config.json eintragen."
        : "Abruf fehlgeschlagen: " + FEED.fehler) + "</p>";
  }
  if (!treffer.length) {
    return kopf + '<p style="color:var(--dim);font-size:11px">Keine der ' +
      FEED.beitraege.length + " abgerufenen Meldungen erwähnt diese Enge.</p>";
  }
  return kopf + treffer.slice(0, 8).map((b) =>
    '<div class="meld"><div class="mk">@' + b.konto +
    '<span>' + (b.zeit || "").slice(0, 16).replace("T", " ") + "</span></div>" +
    "<div class=\"mt\">" + b.text.replace(/[<>&]/g, "") + "</div></div>").join("");
}

/* Welches Land liegt an diesem Punkt? Ungerade Zahl von Ringkreuzungen
   heisst drin — Löcher (Enklaven, Seen) kippen die Parität und fallen damit
   automatisch heraus. */
function landBei(lon, lat) {
  // Die Ringe sind entwirrt, laufen also bei Russland und Fidschi über
  // ±180 hinaus. Ein Klick kommt dagegen immer normiert an. Ohne die
  // verschobenen Kopien war die russische Pazifikküste nicht anklickbar.
  const kandidaten = [lon, lon + 360, lon - 360];
  // Nicht der erste Treffer gewinnt, sondern der kleinste. Vorher stand
  // Österreich in der Liste vor Liechtenstein und schnappte jeden Klick auf
  // die Enklave weg — auch beim Heranzoomen, denn an der Reihenfolge ändert
  // Zoom nichts.
  let bestes = null, kleinste = Infinity;
  for (const l of LAENDER) {
    if (l.flaeche >= kleinste) continue;
    for (const x0 of kandidaten) {
      let drin = false;
      for (const p of l.polys) {
        const [w, s, e, n] = p.bbox;
        if (x0 < w || x0 > e || lat < s || lat > n) continue;
        const pts = p.pts;
        for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
          const [xi, yi] = pts[i], [xj, yj] = pts[j];
          if (yi > lat !== yj > lat &&
              x0 < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) drin = !drin;
        }
      }
      if (drin) { bestes = l.n; kleinste = l.flaeche; break; }
    }
  }
  return bestes;
}

/* Das nächstgelegene Land innerhalb eines Umkreises in Bildschirmpunkten.

   Eine reine Punkt-in-Fläche-Prüfung reicht nicht: 38 der 245 Länder sind so
   klein, dass sie bei Weltzoom weniger als einen Pixel einnehmen — Singapur,
   Malta, Monaco, Liechtenstein, die Malediven, Barbados, Macao. Die waren
   schlicht nicht anklickbar, egal wie genau man zielt.

   Deshalb: zuerst exakt prüfen, und nur wenn das nichts ergibt, das nächste
   Land im Umkreis nehmen. So bleibt ein Klick mitten in Frankreich Frankreich
   und wird nicht von einem Nachbarn weggeschnappt. */
function landNahe(mx, my, radius) {
  let bestes = null, besteD = radius * radius;
  for (const l of LAENDER) {
    for (const p of l.polys) {
      // Grober Vorfilter über die Ecken des Umrisses, damit nicht bei jedem
      // Klick alle Stützpunkte der Welt durchgerechnet werden.
      const [w, s, e, n] = p.bbox;
      const [x1, y1] = view.project(w, n);
      const [x2, y2] = view.project(e, s);
      const dx = mx < x1 ? x1 - mx : mx > x2 ? mx - x2 : 0;
      const dy = my < y1 ? y1 - my : my > y2 ? my - y2 : 0;
      if (dx * dx + dy * dy > besteD) continue;
      for (const [lo, la] of p.pts) {
        const [px, py] = view.project(lo, la);
        const d = (px - mx) ** 2 + (py - my) ** 2;
        if (d < besteD) { besteD = d; bestes = l.n; }
      }
    }
  }
  return bestes;
}

/* Grosskreis zwischen zwei Punkten. Eine gerade Linie auf der Mercatorkarte
   wäre der falsche Weg — Flug- und Seewege folgen dem Grosskreis, und bei
   Verbindungen über den halben Globus sieht man den Unterschied sofort. */
function grosskreis(a, b, n) {
  const rad = Math.PI / 180;
  const v = (p) => [Math.cos(p[1] * rad) * Math.cos(p[0] * rad),
                    Math.cos(p[1] * rad) * Math.sin(p[0] * rad),
                    Math.sin(p[1] * rad)];
  const A = v(a), B = v(b);
  let punkt = A[0] * B[0] + A[1] * B[1] + A[2] * B[2];
  punkt = Math.max(-1, Math.min(1, punkt));
  const w = Math.acos(punkt);
  const raus = [];
  let vorher = null, off = 0;
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    let x, y, z;
    if (w < 1e-6) { x = A[0]; y = A[1]; z = A[2]; }
    else {
      const s1 = Math.sin((1 - t) * w) / Math.sin(w);
      const s2 = Math.sin(t * w) / Math.sin(w);
      x = s1 * A[0] + s2 * B[0];
      y = s1 * A[1] + s2 * B[1];
      z = s1 * A[2] + s2 * B[2];
    }
    let lon = Math.atan2(y, x) / rad;
    const lat = Math.atan2(z, Math.hypot(x, y)) / rad;
    // Datumsgrenze: fortlaufend halten, sonst springt der Bogen quer
    // über die ganze Karte.
    if (vorher !== null) {
      if (lon + off - vorher > 180) off -= 360;
      else if (lon + off - vorher < -180) off += 360;
    }
    lon += off;
    vorher = lon;
    raus.push([lon, lat]);
  }
  return raus;
}

/* Ein Bogen mit Höhe — das ist der räumliche Eindruck: Bodenspur unten,
   der eigentliche Bogen darüber, plus ein Leuchten. */
function zeichneBogen(a, b, farbe, opt) {
  opt = opt || {};
  const geo = grosskreis(a, b, 64);
  const auf = geo.map((p) => view.project(p[0], p[1]));
  const d = Math.hypot(auf[auf.length - 1][0] - auf[0][0],
                       auf[auf.length - 1][1] - auf[0][1]);
  const hoehe = Math.min(d * 0.30, H * 0.42) * (opt.hoehe || 1);
  const bogen = auf.map((p, i) => {
    const t = i / (auf.length - 1);
    return [p[0], p[1] - Math.sin(Math.PI * t) * hoehe];
  });

  const pfad = (pts) => {
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  };

  // Bodenspur: zeigt, wo der Bogen tatsächlich langläuft
  ctx.save();
  ctx.globalAlpha = 0.20;
  ctx.setLineDash([3, 5]);
  ctx.strokeStyle = farbe;
  ctx.lineWidth = 1;
  pfad(auf);
  ctx.stroke();
  ctx.restore();

  // Schein
  ctx.save();
  ctx.globalAlpha = 0.22;
  ctx.strokeStyle = farbe;
  ctx.lineWidth = (opt.breite || 2) + 7;
  ctx.lineCap = "round";
  pfad(bogen);
  ctx.stroke();
  ctx.restore();

  // Der Bogen selbst
  ctx.strokeStyle = farbe;
  ctx.lineWidth = opt.breite || 2;
  ctx.lineCap = "round";
  pfad(bogen);
  ctx.stroke();

  // Laufender Punkt in Flussrichtung
  if (opt.now !== undefined) {
    const t = ((opt.now / 2600) + (opt.phase || 0)) % 1;
    const i = Math.min(bogen.length - 1, Math.floor(t * (bogen.length - 1)));
    ctx.beginPath();
    ctx.arc(bogen[i][0], bogen[i][1], 3.2, 0, 7);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(bogen[i][0], bogen[i][1], 6, 0, 7);
    ctx.fillStyle = farbe;
    ctx.globalAlpha = 0.35;
    ctx.fill();
    ctx.globalAlpha = 1;
  }
  return bogen;
}

/* Mittelpunkt des grössten Rings eines Landes — Ankerpunkt für Bögen. */
const MITTEN = {};
function landMitte(name) {
  if (MITTEN[name]) return MITTEN[name];
  const l = LAENDER.find((x) => x.n === name);
  if (!l) return null;
  let best = null;
  for (const p of l.polys) {
    const [w, s, e, n] = p.bbox;
    const f = (e - w) * (n - s);
    if (!best || f > best.f) best = { f: f, ring: p, bbox: [w, s, e, n] };
  }
  if (!best) return (MITTEN[name] = null);
  // Mittelpunkt der Bounding-Box liegt bei gebogenen Ländern im Meer — bei
  // Japan mitten in der See. Der Durchschnitt der Eckpunkte trifft die
  // Landmasse deutlich zuverlässiger.
  let sx = 0, sy = 0;
  for (const [x, y] of best.ring.pts) { sx += x; sy += y; }
  MITTEN[name] = [sx / best.ring.pts.length, sy / best.ring.pts.length];
  return MITTEN[name];
}

/* Bögen von einer Meerenge zu allen betroffenen Ländern. */
function zeichneBetroffenBoegen(e, now) {
  const gruppen = [["einfuhr", ROLLEN.einfuhr.c], ["ausfuhr", ROLLEN.ausfuhr.c]];
  const anteile = ABHAENGIGKEIT[e.id] || {};
  let k = 0;
  for (const [gruppe, farbe] of gruppen) {
    for (const l of e.betroffen[gruppe]) {
      const m = landMitte(l.ne);
      if (!m) continue;
      // Je stärker die Abhängigkeit, desto dicker der Bogen. Wo keine Zahl
      // belegt ist, bleibt es die Grundstärke — nicht geraten.
      const a = anteile[l.ne];
      const breite = a ? 1.2 + (a.wert / 100) * 3.4 : 1.8;
      // Ausfuhr zeigt zur Enge hin, Einfuhr von ihr weg — die Laufrichtung
      // des Punktes erzählt damit die Richtung der Ladung.
      const von = gruppe === "ausfuhr" ? m : e.pos;
      const nach = gruppe === "ausfuhr" ? e.pos : m;
      zeichneBogen(von, nach, farbe,
        { now: now, phase: (k++ * 0.13) % 1, breite: breite });
    }
  }
}

/* Bögen von den ausgewählten Ländern zu ihren Handelspartnern. */
function zeichneAuswahlBoegen(now) {
  let k = 0;
  for (const name of AUSWAHL) {
    const h = HANDEL[name];
    const m = landMitte(name);
    if (!h || !m) continue;
    for (const p of h.pAus) {
      const z = landMitte(p);
      if (z) zeichneBogen(m, z, ROLLEN.ausfuhr.c,
        { now: now, phase: (k++ * 0.17) % 1, breite: 2 });
    }
    for (const p of h.pEin) {
      const z = landMitte(p);
      if (z) zeichneBogen(z, m, ROLLEN.einfuhr.c,
        { now: now, phase: (k++ * 0.17) % 1, breite: 2, hoehe: 0.78 });
    }
  }
  // Die Partnerländer beschriften. Ohne Namen an den Enden ist eine Linie
  // nur eine Linie — man sieht, DASS es eine Verbindung gibt, aber nicht
  // wohin und schon gar nicht wofür.
  // Erst sammeln, wer in welcher Richtung Partner ist, dann einmal
  // beschriften. Getrennt gezeichnet stand jedes Land doppelt da — einmal
  // als Abnehmer und einmal als Lieferant.
  const rollen = {};
  for (const name of AUSWAHL) {
    const h = HANDEL[name];
    if (!h) continue;
    for (const p of h.pAus) {
      if (!AUSWAHL.has(p)) (rollen[p] = rollen[p] || {}).aus = true;
    }
    for (const p of h.pEin) {
      if (!AUSWAHL.has(p)) (rollen[p] = rollen[p] || {}).ein = true;
    }
  }
  for (const [p, r] of Object.entries(rollen)) {
    const z = landMitte(p);
    if (!z) continue;
    const [x, y] = view.project(z[0], z[1]);
    if (x < -40 || x > W + 40 || y < 0 || y > H) continue;
    const beides = r.aus && r.ein;
    const farbe = beides ? "#c9b06a"
      : r.aus ? ROLLEN.ausfuhr.c : ROLLEN.einfuhr.c;
    ctx.font = '600 9.5px ui-monospace,Menlo,Consolas,monospace';
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillStyle = farbe;
    halo(((HANDEL[p] && HANDEL[p].t) || p).toUpperCase() +
      (beides ? " \u21c4" : r.aus ? " \u2190" : " \u2192"), x, y + 8);
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, 7);
    ctx.fillStyle = farbe;
    ctx.fill();
  }
  // Ausgewählte Länder markieren
  for (const name of AUSWAHL) {
    const m = landMitte(name);
    if (!m) continue;
    const [x, y] = view.project(m[0], m[1]);
    ctx.beginPath();
    ctx.arc(x, y, 7, 0, 7);
    ctx.strokeStyle = "#00e676";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.font = '700 11px ui-monospace,Menlo,Consolas,monospace';
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    ctx.fillStyle = "#00e676";
    ctx.letterSpacing = "1.2px";
    halo(((HANDEL[name] && HANDEL[name].t) || name).toUpperCase(), x, y - 11);
    ctx.letterSpacing = "0px";
  }
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
    const sv = AN.status ? statusVon(e.id) : null;
    const st = sv ? STATUS_FARBEN[sv.s].c : F.markeAus;
    const r = ist ? 7 * puls : 5.5;
    ctx.strokeStyle = st;
    ctx.lineWidth = 1.8;
    ctx.strokeRect(x - r, y - r, r * 2, r * 2);
    ctx.fillStyle = st;
    ctx.fillRect(x - 2, y - 2, 4, 4);
    if (sv && sv.s !== "gruen") {
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
    // Live-Durchfahrten unter den Marker, wenn vorhanden.
    if (LIVE && LIVE.werte[e.id]) {
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#00e676";
      ctx.font = '9px ui-monospace,Menlo,Consolas,monospace';
      halo(LIVE.werte[e.id].n + " SCHIFFE/TAG", x + 10, y + 5);
      ctx.font = (ist ? "700 " : "") + '10px ui-monospace,Menlo,Consolas,monospace';
    }
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

/* ---------- Ereignisse anklicken ----------

   Die Symbole werden beim Zeichnen mit ihrer Bildschirmposition in
   EREIGNIS_TREFFER abgelegt. Anders geht es nicht: wo ein Symbol landet,
   ergibt sich erst aus der Auffächerung um den Ort und ist nicht aus den
   Daten allein zu berechnen. */

const EREIGNIS_TREFFER = [];

function trefferEreignis(mx, my) {
  // Rückwärts, damit das zuletzt Gezeichnete — also das oben liegende —
  // zuerst trifft.
  for (let i = EREIGNIS_TREFFER.length - 1; i >= 0; i--) {
    const t = EREIGNIS_TREFFER[i];
    if ((t.x - mx) ** 2 + (t.y - my) ** 2 < 14 * 14) return t;
  }
  return null;
}

/* Alles, was über ein einzelnes Ereignis bekannt ist — und ausdrücklich
   auch, was nicht bekannt ist. Eine Meldung ist keine Bestätigung. */
function zeigeEreignis(tr) {
  const b = tr.b;
  aktiv = null;
  AUSWAHL.clear();
  malAuswahl();
  document.body.dataset.modus = "welt";
  modus = "welt";
  requestAnimationFrame(resize);
  document.getElementById("pTitel").textContent =
    (ART_TEXT[tr.art] || tr.art).toUpperCase();

  const zp = zeitpunkt(b.zeit);
  const ort = b.ortname
    ? b.ortname.charAt(0).toUpperCase() + b.ortname.slice(1)
    : null;
  const zeile = (k, v) => v
    ? '<div class="ez"><span class="ek2">' + k + "</span><span>" + v +
      "</span></div>" : "";

  // Flugbahn nur beschreiben, wenn beide Enden im Text standen.
  const bahn = b.bahn || [];
  const bahnText = (bahn[0] && bahn[1])
    ? "Start und Ziel wurden im Text genannt und sind auf der Karte "
      + "verbunden. Die Linie ist der kürzeste Weg zwischen beiden Punkten, "
      + "keine gemessene Flugbahn."
    : null;

  const engen = (b.engen || []).map((id) => {
    const e = ENGEN.find((y) => y.id === id);
    return e ? e.name : id;
  });
  const sp = SCHAUPLATZ_NACH_ID[b.schauplatz || "sonstige"];

  document.getElementById("pInhalt").innerHTML =
    '<div class="ekopf">' +
    (b.arten || []).map((a) => '<span class="eart">' + (ART_TEXT[a] || a) +
      "</span>").join("") + "</div>" +
    '<div class="etext">' + String(b.text || "").replace(/[<>&]/g, "") +
    "</div>" +
    '<div class="efeld">' +
    zeile("Ort", ort || "nicht erkannt") +
    zeile("Schauplatz", sp ? sp.name : null) +
    zeile("Zeit", b.zeit
      ? b.zeit.replace("T", " ") + " UTC · " + vorZeit(b.zeit)
      : "kein Zeitstempel in der Quelle") +
    zeile("Quelle", "@" + (b.konto || "?")) +
    zeile("Meerengen", engen.length ? engen.join(" · ") : null) +
    "</div>" +
    (bahnText ? '<div class="ehinweis">' + bahnText + "</div>" : "") +
    '<div class="ewarn"><b>Ungeprüfte Meldung.</b> Was hier steht, ist der ' +
    "Text der Quelle, nicht eine Bestätigung. Die Ereignisart wurde aus " +
    "Stichworten im Text abgeleitet — ein Text über eine Drohne kann auch " +
    "eine Ankündigung oder ein Dementi sein. Der Ort ist der erste im Text " +
    "erkannte Ortsname und muss nicht der Ort des Geschehens sein.</div>" +
    (ort && b.ort
      ? '<button class="ebtn" id="ezoom">Auf der Karte heranholen</button>'
      : "") +
    '<button class="ebtn zweit" id="ezurueck">Zurück zu den Meldungen</button>';

  const zoom = document.getElementById("ezoom");
  if (zoom) zoom.onclick = () => {
    const [x, y] = b.ort;
    fliegeZu([x - 8, y - 6, x + 8, y + 6]);
  };
  document.getElementById("ezurueck").onclick = bauFeedPanel;
  if (zp !== null) markiere(b);
}

/* Das angeklickte Ereignis auf der Karte hervorheben, damit klar ist,
   welches Symbol gerade im Panel steht. */
let MARKIERT = null;
function markiere(b) { MARKIERT = b ? b.id : null; }

function trefferMarke(mx, my) {
  for (const e of ENGEN) {
    const [x, y] = view.project(e.pos[0], e.pos[1]);
    if ((x - mx) ** 2 + (y - my) ** 2 < 20 * 20) return e;
  }
  return null;
}

/* ---------- Freies Navigieren ----------

   Bisher konnte man nur zu festen Ausschnitten springen. Jetzt ist die Karte
   frei beweglich: ziehen zum Verschieben, Mausrad zum Zoomen.

   Der Ausschnitt bleibt dabei die einzige Wahrheit. Statt an den Grenzen zu
   rechnen, wird der neue Ausschnitt aus dem Bildschirmrechteck zurückgerechnet
   — das ist exakt und macht auch beim Zoomen auf den Mauszeiger keine Mühe.
   Nebeneffekt: das Ergebnis hat immer das Seitenverhältnis der Leinwand, also
   entstehen keine Ränder und nichts driftet. */

let zieht = null;         // {x, y, bewegt} während des Ziehens
let gezogen = false;      // war die letzte Mausgeste ein Ziehen?
let frei = false;         // hat der Nutzer den Ausschnitt selbst verstellt?

function bboxAusRechteck(x0, y0, x1, y1) {
  const a = view.invert(x0, y0);   // oben links
  const b = view.invert(x1, y1);   // unten rechts
  return [a[0], b[1], b[0], a[1]];
}

function setzeAusschnitt(bbox, vonHand) {
  const spanne = bbox[2] - bbox[0];
  const bisher = view.bbox[2] - view.bbox[0];
  // Nicht enger als ~5 km, und nicht weiter herauszoomen als die Welt.
  //
  // Die Grenze darf das Verschieben nicht mitblockieren: im Weltbild ist der
  // sichtbare Bereich breiter als 360 Grad (die Leinwand ist breiter als die
  // Karte), und eine harte Obergrenze hat deshalb jede Bewegung abgelehnt.
  // Also nur ablehnen, wenn der Ausschnitt tatsächlich noch grösser wird.
  if (spanne < 0.05) return;
  if (spanne > 500 && spanne > bisher + 0.01) return;
  // Seitlich am Rand der Welt anhalten, statt weiterzulaufen. Vorher liess
  // sich beliebig weit schieben; ab 360 Grad Versatz kam die Karte ein
  // zweites Mal ins Bild und man wusste nicht mehr, welches Russland man
  // vor sich hat. Verschoben statt verworfen — sonst klemmt das Ziehen.
  if (spanne >= 360) {
    bbox = [-180, bbox[1], -180 + spanne, bbox[3]];
  } else if (bbox[0] < -180) {
    bbox = [-180, bbox[1], -180 + spanne, bbox[3]];
  } else if (bbox[2] > 180) {
    bbox = [180 - spanne, bbox[1], 180, bbox[3]];
  }
  // Breitengrade begrenzen, statt die Bewegung zu verwerfen — sonst klemmt
  // die Karte am Rand fest.
  if (bbox[3] > 89) { const d = bbox[3] - 89; bbox = [bbox[0], bbox[1] - d, bbox[2], 89]; }
  if (bbox[1] < -89) { const d = -89 - bbox[1]; bbox = [bbox[0], -89, bbox[2], bbox[3] + d]; }
  anim = null;
  ziel = null;
  view = makeView(bbox, W, H);
  basisSchluessel = "";
  if (vonHand) {
    frei = true;
    document.body.dataset.frei = "ja";
  }
}

function zoome(faktor, cx, cy) {
  const f = Math.max(0.2, Math.min(5, faktor));
  const x0 = cx - cx / f, y0 = cy - cy / f;
  setzeAusschnitt(bboxAusRechteck(x0, y0, x0 + W / f, y0 + H / f), true);
}

function zurueckZurUebersicht() {
  frei = false;
  document.body.dataset.frei = "nein";
  fliegeZu(modus === "detail" && aktiv
    ? (ansicht === "betroffen" ? aktiv.betroffen.bbox : aktiv.zoom)
    : WELT_BBOX);
}

function onWheel(ev) {
  ev.preventDefault();
  const [mx, my] = mausPos(ev);
  // Trackpads liefern kleine Beträge, Mausräder grosse — beides auf einen
  // gleichmässigen Faktor bringen.
  const schritt = Math.max(-1, Math.min(1, -ev.deltaY / 100));
  zoome(Math.exp(schritt * 0.42), mx, my);
}

function onDown(ev) {
  if (ev.button !== 0) return;
  const [x, y] = mausPos(ev);
  zieht = { x: x, y: y, bewegt: 0 };
  gezogen = false;
  cv.style.cursor = "grabbing";
}

function onUp() {
  zieht = null;
  cv.style.cursor = hover || hoverLand ? "pointer" : "grab";
}

/* ---------- Zeigen und Anwählen ---------- */

let hoverLand = null;
let hoverPos = [0, 0];
let letzterTest = 0;

function onMove(ev) {
  const [mx, my] = mausPos(ev);
  hoverPos = [mx, my];

  if (zieht) {
    const dx = mx - zieht.x, dy = my - zieht.y;
    zieht.bewegt += Math.abs(dx) + Math.abs(dy);
    if (zieht.bewegt > 5) gezogen = true;
    setzeAusschnitt(bboxAusRechteck(-dx, -dy, W - dx, H - dy), true);
    // Nach dem Verschieben zeigt derselbe Punkt auf neue Koordinaten.
    zieht.x = mx;
    zieht.y = my;
    return;
  }

  if (modus === "quiz") {
    hover = null;
    hoverLand = null;
    cv.style.cursor = quiz.antwort ? "default" : "crosshair";
    return;
  }

  hover = trefferMarke(mx, my);
  // Landsuche ist teurer als der Markertest — nur anstossen, wenn sich die
  // Maus spürbar bewegt hat.
  if (!hover && performance.now() - letzterTest > 60) {
    letzterTest = performance.now();
    const [lon, lat] = view.invert(mx, my);
    hoverLand = landBei(((lon + 180) % 360 + 360) % 360 - 180, lat);
  } else if (hover) {
    hoverLand = null;
  }
  cv.style.cursor = hover || hoverLand ? "pointer" : "grab";
}

/* Zeigt an, was unter dem Zeiger liegt — ohne das ist nicht erkennbar, dass
   Länder überhaupt anklickbar sind. */
function zeichneHover() {
  if (!hoverLand || zieht || modus === "quiz") return;
  const l = LAENDER.find((x) => x.n === hoverLand);
  if (!l) return;
  const [vw, vs, ve, vn] = view.bbox;
  ctx.beginPath();
  for (const p of l.polys) {
    const [w, s, e, n] = p.bbox;
    if (e < vw || w > ve || n < vs || s > vn) continue;
    p.pts.forEach((pt, i) => {
      const [x, y] = view.project(pt[0], pt[1]);
      i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    });
    ctx.closePath();
  }
  ctx.fillStyle = AUSWAHL.has(hoverLand)
    ? "rgba(255,45,45,.12)" : "rgba(0,230,118,.13)";
  ctx.fill("nonzero");
  ctx.strokeStyle = AUSWAHL.has(hoverLand) ? "#ff6b6b" : "#00e676";
  ctx.lineWidth = 1.6;
  ctx.stroke();

  const name = (HANDEL[hoverLand] && HANDEL[hoverLand].t) || hoverLand;
  const zusatz = AUSWAHL.has(hoverLand) ? "  ABWÄHLEN"
    : HANDEL[hoverLand] ? "  ANWÄHLEN" : "  KEIN PROFIL";
  ctx.font = '700 11px ui-monospace,Menlo,Consolas,monospace';
  ctx.letterSpacing = "1.2px";
  const t = name.toUpperCase() + zusatz;
  const b = ctx.measureText(t).width;
  let bx = hoverPos[0] + 14, by = hoverPos[1] + 14;
  if (bx + b + 12 > W) bx = hoverPos[0] - b - 26;
  if (by + 22 > H) by = hoverPos[1] - 30;
  ctx.fillStyle = "rgba(4,10,8,.92)";
  ctx.fillRect(bx, by, b + 12, 20);
  ctx.strokeStyle = "#00e676";
  ctx.lineWidth = 1;
  ctx.strokeRect(bx, by, b + 12, 20);
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#00e676";
  ctx.fillText(t, bx + 6, by + 11);
  ctx.letterSpacing = "0px";
}

function onClick(ev) {
  const [mx, my] = mausPos(ev);
  if (modus === "quiz") {
    if (quiz.antwort) return;
    pruefeAntwort(view.invert(mx, my));
    return;
  }
  // Ein Klick, der eigentlich ein Ziehen war, darf nichts auswählen.
  // Der Merker muss getrennt geführt werden: beim Klick ist das Ziehen
  // bereits beendet und zieht wieder null.
  if (gezogen) { gezogen = false; return; }
  // Ereignisse haben Vorrang: sie liegen oben auf der Karte, also muss sie
  // ein Klick auch zuerst erwischen.
  const tr = trefferEreignis(mx, my);
  if (tr) { zeigeEreignis(tr); return; }
  const e = trefferMarke(mx, my);
  if (e) { zeigeEnge(e); return; }
  // In der Rollen-Ansicht bedeuten die Farben etwas anderes — dort keine
  // Auswahl, sonst überall.
  if (modus === "detail" && ansicht === "betroffen") return;
  // Kein Marker getroffen: dann das Land darunter aus- oder abwählen.
  // Mehrfachauswahl ist der Normalfall — genau der Vergleich zweier Länder
  // ist ja die interessante Frage.
  const [lon, lat] = view.invert(mx, my);
  const name = landBei(((lon + 180) % 360 + 360) % 360 - 180, lat)
    || landNahe(mx, my, 12);
  // Klick ins Meer wählt nichts ab. Die Auswahl versehentlich zu verlieren
  // war der ärgerlichste Fehlgriff — Leeren geht über den Knopf oder Esc.
  if (!name) return;
  AUSWAHL.has(name) ? AUSWAHL.delete(name) : AUSWAHL.add(name);
  malAuswahl();
}

/* Auswahlleiste und Panel neu aufbauen. */
function malAuswahl() {
  const leiste = document.getElementById("auswahl");
  const vorher = document.body.dataset.auswahl;
  document.body.dataset.auswahl = AUSWAHL.size ? "ja" : "nein";
  // Das Infofenster nimmt der Karte Breite weg. Ohne Neumessung behält die
  // Leinwand ihre alte Grösse und wird nur verdeckt — die Karte muss aber
  // kleiner werden, damit weiterhin alles sichtbar bleibt.
  if (vorher !== document.body.dataset.auswahl) requestAnimationFrame(resize);
  leiste.innerHTML = AUSWAHL.size
    ? '<span class="tit">AUSWAHL</span>' +
      [...AUSWAHL].map((n) =>
        '<button class="chip" data-l="' + n + '">' +
        ((HANDEL[n] && HANDEL[n].t) || n) + ' <span>×</span></button>').join("") +
      '<button class="chip leer">ALLE LÖSCHEN</button>'
    : "";
  leiste.querySelectorAll(".chip").forEach((c) => {
    c.onclick = () => {
      c.classList.contains("leer") ? AUSWAHL.clear() : AUSWAHL.delete(c.dataset.l);
      malAuswahl();
    };
  });
  bauBogenlegende();
  if (!AUSWAHL.size) bauFeedPanel();
  if (AUSWAHL.size) {
    document.getElementById("pTitel").textContent =
      "HANDELSPROFIL · " + AUSWAHL.size;
    bauHandelPanel();
  }
}

/* Was die Bögen bedeuten — direkt neben der Karte, nicht nur im Panel.

   Eine wichtige Ehrlichkeit steht hier mit drin: die Bögen sagen, DASS ein
   Land zu den Hauptpartnern gehört, nicht WIE VIEL und nicht WOMIT.
   Belastbare bilaterale Zahlen liegen nicht vor (siehe handel.js), und eine
   erfundene Mengenangabe an einer Linie wäre schlimmer als keine. Die
   Warengruppen im Panel sind die Gesamtausfuhr des Landes, nicht die Ausfuhr
   an diesen einen Partner. */
function bauBogenlegende() {
  const el = document.getElementById("bogenlegende");
  if (!el) return;
  if (!AUSWAHL.size) { el.innerHTML = ""; return; }
  const namen = [...AUSWAHL].map((n) => (HANDEL[n] && HANDEL[n].t) || n);
  const mit = [...AUSWAHL].filter((n) => HANDEL[n]);
  if (!mit.length) {
    el.innerHTML = '<div class="bt2">LINIEN</div>' +
      "Für " + namen.join(", ") + " liegt kein Handelsprofil vor — deshalb " +
      "sind keine Linien gezeichnet.";
    return;
  }
  const waren = mit.map((n) => {
    const h = HANDEL[n];
    return "<b>" + h.t + "</b> führt vor allem " + h.aus.slice(0, 3).join(", ") +
      " aus und " + h.ein.slice(0, 3).join(", ") + " ein.";
  }).join("<br>");
  el.innerHTML =
    '<div class="bt2">WAS DIE LINIEN ZEIGEN</div>' +
    '<div class="bz"><span class="bl" style="border-color:' +
    ROLLEN.ausfuhr.c + '"></span><span>Ausfuhr — ' + namen.join(", ") +
    " liefert dorthin</span></div>" +
    '<div class="bz"><span class="bl" style="border-color:' +
    ROLLEN.einfuhr.c + '"></span><span>Einfuhr — kommt von dort</span></div>' +
    '<div class="bz"><span class="bl" style="border-color:#c9b06a"></span>' +
    "<span>⇄ Partner in beide Richtungen</span></div>" +
    '<div class="bw">' + waren +
    "<br><br><b>Grenze:</b> Eine Linie sagt, dass das Land zu den " +
    "Hauptpartnern zählt — nicht wie viel und nicht womit. Bilaterale " +
    "Mengen liegen nicht belegt vor. Die Warengruppen oben sind der " +
    "Gesamthandel des Landes, nicht der mit diesem Partner.</div>";
}

function bauHandelPanel() {
  const liste = (t, arr) =>
    '<div class="hz"><span class="hk">' + t + '</span><span class="hv">' +
    arr.join(" · ") + "</span></div>";
  const namen = (arr) => arr.map((n) => (HANDEL[n] && HANDEL[n].t) || n);
  document.getElementById("pInhalt").innerHTML =
    '<h2>Handelsprofile</h2><div class="reg">' + AUSWAHL.size +
    " Land(e) ausgewählt</div>" +
    [...AUSWAHL].map((n) => {
      const h = HANDEL[n];
      if (!h) {
        return '<div class="hbox"><h3>' + n + "</h3><p>" + HANDEL_FEHLT + "</p></div>";
      }
      // An welchen Engen hängt das Land, und wie stark?
      const engen = h.engen.map((id) => {
        const e = ENGEN.find((x) => x.id === id);
        const a = (ABHAENGIGKEIT[id] || {})[n];
        const st = STATUS[id] ? STATUS_FARBEN[STATUS[id].s].c : "#8fa6a0";
        return '<div class="eng"><span class="pkt" style="background:' + st +
          '"></span><b>' + (e ? e.name : id) + "</b>" +
          (a ? '<span class="pct">' + a.wert + " % " + a.was + "</span>" +
               '<span class="qq">' + a.q + "</span>"
             : '<span class="qq">Anteil nicht belegt</span>') + "</div>";
      }).join("");
      return '<div class="hbox"><h3>' + h.t + "</h3>" +
        '<p class="kern">' + h.kern + "</p>" +
        liste("Führt aus", h.aus) + liste("Führt ein", h.ein) +
        liste("Abnehmer (Linien hinaus)", namen(h.pAus)) +
        liste("Lieferanten (Linien herein)", namen(h.pEin)) +
        '<div class="hz"><span class="hk"></span><span class="hv hinw">' +
        "Die Warengruppen oben sind der Gesamthandel des Landes. Welche " +
        "Ware zu welchem Partner geht, steht hier bewusst nicht — dafür " +
        "liegen keine belastbaren bilateralen Zahlen vor." +
        "</span></div>" +
        '<div class="hz"><span class="hk">Engpässe</span></div>' + engen +
        "</div>";
    }).join("") +
    '<div class="quelle">' + HANDEL_QUELLE + "</div>";
}

/* ---------- Ebenen-Schaltpult ---------- */

/* Wie viele Objekte eine Ebene beisteuert — steht im Schalter, damit man
   vorher weiss, was man sich auf die Karte holt. */
function ebenenAnzahl(id) {
  // Die Ereignisse kommen aus dem laufenden Abruf, nicht aus einer Datei —
  // ihre Zahl steht erst fest, wenn Meldungen da sind.
  if (id === "ereignisse") {
    return beitraegeImFenster().filter((b) => (b.arten || []).length).length;
  }
  return { konflikte: KONFLIKTE.length, ziele: ZIELE.length,
           kontrolle: KONTROLLZONEN.length, status: Object.keys(STATUS).length,
           vektoren: VEKTOREN.length, callouts: CALLOUTS.length }[id];
}

function bauEbenen() {
  const el = document.getElementById("ebenen");
  el.innerHTML =
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
  const z = document.getElementById("ebZahl2");
  if (z) z.textContent = n + " / " + EBENEN.length + " AKTIV";
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

/* Die Meldungsspalte ist der Normalzustand des rechten Fensters. Erst wenn
   man ein Land oder eine Enge anwählt, tritt sie zurück. */
function bauFeedPanel() {
  if (AUSWAHL.size || (modus === "detail" && aktiv)) return;
  markiere(null);
  document.getElementById("pTitel").textContent = "LAGEMELDUNGEN";
  const el = document.getElementById("pInhalt");
  if (!FEED_VERSUCHT) {
    el.innerHTML = '<div class="leerhinweis">Meldungen werden geladen …</div>';
    return;
  }
  if (!FEED || FEED.fehler) {
    el.innerHTML = '<div class="leerhinweis">' +
      (!FEED ? "Der Abruf von <code>api/feed</code> ist fehlgeschlagen: " +
        (FEED_FEHLER || "unbekannt") +
        "<br><br>Läuft die Seite über <b>serve.py</b>? Prüfen mit " +
        "<code>curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1/api/feed</code> " +
        "— das muss 200 ergeben."
        : FEED.fehler === "nicht eingerichtet"
          ? 'Noch keine Quelle eingetragen. Oben rechts auf <b>⚙ ZUGÄNGE</b>.'
          : "Abruf gestört: " + FEED.fehler) + "</div>";
    return;
  }
  const alle = FEED.beitraege || [];
  const b = beitraegeImFenster();
  const ereig = b.filter((x) => (x.arten || []).length);
  const ohneZeit = alle.filter((x) => !x.zeit).length;
  // Kurzlage über den Meldungen: eine Zeile je Kriegsschauplatz, sortiert
  // nach Betrieb. Damit steht beim Start die Karte im Bild UND daneben,
  // was gerade wo passiert — ohne einen Klick.
  const kurz = lageKurz();
  const zeile = (x, alarm) =>
    '<div class="' + (alarm ? "ereig" : "meld") + '" data-id="' +
    String(x.id).replace(/"/g, "") + '">' +
    '<div class="' + (alarm ? "ek" : "mk") + '">' +
    (alarm ? x.arten.map((a) => ART_TEXT[a] || a).join(" · ") : "@" + x.konto) +
    "<span>" + (x.zeit || "").slice(0, 16).replace("T", " ") + "</span></div>" +
    '<div class="mt">' + x.text.replace(/[<>&]/g, "") + "</div>" +
    (x.engen.length ? '<div class="eq">' + x.engen.map((id) => {
      const e = ENGEN.find((y) => y.id === id);
      return e ? e.kurz : id;
    }).join(" · ") + (alarm ? " · @" + x.konto : "") + "</div>" : "") + "</div>";
  el.innerHTML = kurz +
    '<div class="feedkopf">' + b.length +
    (b.length === 1 ? " Meldung in " : " Meldungen in ") + fensterText() +
    " · " +
    (ereig.length
      ? '<b style="color:#ff6b6b">' + ereig.length +
        (ereig.length === 1 ? " Ereignis</b>" : " Ereignisse</b>")
      : "keine Ereignisse") +
    (b.length < alle.length
      ? '<div class="fkl">' + (alle.length - b.length) +
        ((alle.length - b.length) === 1
          ? " weitere Meldung ausserhalb des Zeitfensters"
          : " weitere Meldungen ausserhalb des Zeitfensters") +
        (ohneZeit && fenster !== "alle"
          ? ", davon " + ohneZeit + " ohne Zeitstempel in der Quelle" : "") +
        "</div>"
      : "") + "</div>" +
    (ereig.length ? "<h3>Ereignisse</h3>" + ereig.slice(0, 12).map((x) => zeile(x, 1)).join("")
      : "") +
    "<h3>Alle Meldungen</h3>" +
    (b.length ? b.slice(0, 40).map((x) => zeile(x, 0)).join("")
      : '<div class="leerhinweis">Nichts in diesem Zeitfenster.' +
        (alle.length ? " Mit <b>ALLES</b> siehst du die älteren." : "") +
        "</div>");
  kurzlageKlicks();
  meldungsKlicks(b);
}

/* Meldungen in der Liste sind dieselben Ereignisse wie auf der Karte —
   also muss ein Klick dort dasselbe Fenster oeffnen. */
function meldungsKlicks(liste) {
  document.querySelectorAll("#pInhalt .ereig, #pInhalt .meld").forEach((el) => {
    const b = liste.find((x) => String(x.id) === el.dataset.id);
    if (!b) return;
    el.style.cursor = "pointer";
    el.onclick = () => zeigeEreignis({ art: (b.arten || [])[0] || "angriff",
                                       b: b });
  });
}

/* ---------- Lagebild: eine Kachel je Kriegsschauplatz ----------

   Das Startbild. Wer die Seite aufmacht, soll ohne einen Klick sehen, wo
   gerade etwas passiert — und in Worten, nicht in Symbolen.

   Wichtige Einschränkung, die im UI auch dransteht: gezählt werden
   MELDUNGEN, nicht Ereignisse in der Welt. Zwei Kanäle, die denselben
   Angriff berichten, ergeben zwei Meldungen. Der Wert taugt für den
   Vergleich mit dem Vortag — nicht als Angabe darüber, wie viel wirklich
   geschehen ist. Alles andere wäre eine erfundene Zahl. */

let LAGE = null;

async function holeLage() {
  try {
    const r = await fetch("api/lage", { cache: "no-store" });
    if (r.ok) LAGE = await r.json();
  } catch (e) { LAGE = null; }
  if (modus === "lage") bauKacheln();
  else if (!AUSWAHL.size && modus !== "detail") bauFeedPanel();
}

/* Status aus den Zahlen ableiten — nie von Hand setzen. Ein handgesetzter
   Status veraltet unbemerkt; genau das war bei Hormuz schon der Fall. */
function lageStatus(k) {
  if (!k || !k.n24) return { s: "still", t: "keine Meldungen in 24 h" };
  if (k.n24 >= 5 && k.n24 >= 2 * Math.max(k.n48, 1))
    return { s: "rot", t: "deutlich mehr als am Vortag" };
  if (k.n24 > k.n48) return { s: "amber", t: "mehr als am Vortag" };
  if (k.n24 < k.n48) return { s: "gruen", t: "weniger als am Vortag" };
  return { s: "gruen", t: "wie am Vortag" };
}

function vorZeit(iso) {
  if (!iso) return "Zeit unbekannt";
  const t = Date.parse(iso + (/[Zz+]/.test(iso) ? "" : "Z"));
  if (isNaN(t)) return "Zeit unbekannt";
  const min = Math.round((Date.now() - t) / 60000);
  if (min < 2) return "gerade eben";
  if (min < 60) return "vor " + min + " Min.";
  if (min < 48 * 60) return "vor " + Math.round(min / 60) + " Std.";
  return "vor " + Math.round(min / 1440) + " Tagen";
}

/* Der eine Satz, der die Kachel erklärt. */
function lageSatz(k) {
  if (!k || !k.gesamt) return "Bisher keine Meldung zu diesem Schauplatz.";
  const arten = Object.entries(k.arten || {}).sort((a, b) => b[1] - a[1]);
  const teile = [];
  teile.push(k.n24 + " " + (k.n24 === 1 ? "Meldung" : "Meldungen") +
    " in 24 Std." + (k.n48 ? " (Vortag: " + k.n48 + ")" : ""));
  if (arten.length)
    teile.push("vor allem " +
      arten.slice(0, 2).map((a) => (ART_TEXT[a[0]] || a[0]).toLowerCase())
        .join(" und "));
  if (k.letzte) teile.push("zuletzt " + vorZeit(k.letzte));
  return teile.join(" · ") + ".";
}

/* Kurzfassung des Lagebilds für die Spalte neben der Karte: eine Zeile je
   Schauplatz, an dem etwas läuft. Klick springt auf die Karte. */
function lageKurz() {
  // Aus dem gewählten Zeitfenster gerechnet, nicht aus /api/lage. Sonst
  // stand hier "letzte 24 Std." während oben eine Woche gewählt war — zwei
  // verschiedene Zahlen fürs selbe, das verwirrt mehr als es hilft.
  const b = beitraegeImFenster();
  if (!b.length) return "";
  const pro = {};
  for (const x of b) {
    const id = x.schauplatz || "sonstige";
    const k = (pro[id] = pro[id] || { id: id, n: 0, arten: {}, letzte: null });
    k.n++;
    for (const a of x.arten || []) k.arten[a] = (k.arten[a] || 0) + 1;
    if (x.zeit && (!k.letzte || x.zeit > k.letzte)) k.letzte = x.zeit;
  }
  const liste = Object.values(pro).sort((p, q) => q.n - p.n);
  return '<div class="kurzlage"><div class="klk">LAGE — ' + fensterText() +
    "</div>" +
    liste.slice(0, 7).map((k) => {
      const s = SCHAUPLATZ_NACH_ID[k.id] || { name: k.id };
      const arten = Object.entries(k.arten).sort((p, q) => q[1] - p[1]);
      return '<button class="klz" data-sp="' + k.id + '">' +
        '<span class="led ' + (arten.length ? "rot" : "gruen") + '"></span>' +
        '<span class="kln">' + s.name.split(" — ")[0] + "</span>" +
        '<span class="kla">' +
        (arten.length
          ? arten.slice(0, 2).map((a) => ART_TEXT[a[0]] || a[0]).join(", ")
          : (k.letzte ? vorZeit(k.letzte) : "—")) + "</span>" +
        '<span class="klc">' + k.n + "</span></button>";
    }).join("") +
    '<div class="klf">Meldungen, keine Ereigniszählung · alle ungeprüft · ' +
    "Klick zoomt die Karte</div></div>";
}

/* Die Klicks der Kurzlage anhängen — das Panel wird als HTML gebaut, die
   Knöpfe brauchen ihre Handler danach. */
function kurzlageKlicks() {
  document.querySelectorAll("#pInhalt .klz").forEach((b) => {
    b.onclick = () => zeigeSchauplatz(b.dataset.sp);
  });
}

function bauKacheln() {
  const el = document.getElementById("kacheln");
  if (!el) return;
  const proId = {};
  ((LAGE || {}).kacheln || []).forEach((k) => { proId[k.id] = k; });

  if (!LAGE) {
    el.innerHTML = '<div class="leerhinweis">Lagebild wird geladen … ' +
      "Kommt hier nichts an, läuft die Seite nicht über <b>serve.py</b>.</div>";
    return;
  }
  // Reihenfolge: was am meisten los ist, steht vorn. Leere Schauplätze
  // bleiben trotzdem sichtbar — "hier ist nichts gemeldet" ist auch eine
  // Aussage, und ein verschwundener Schauplatz wäre irreführend.
  const sortiert = SCHAUPLAETZE.slice().sort((a, b) =>
    ((proId[b.id] || {}).n24 || 0) - ((proId[a.id] || {}).n24 || 0));

  const kopf = '<div class="lagekopf">' +
    "<b>LAGEBILD</b> · Stand " +
    ((LAGE.stand || "").replace("T", " ") || "?") + " UTC · " +
    (LAGE.meldungen || 0) + " Meldungen ausgewertet" +
    (LAGE.fehler ? ' · <span class="warn">Quelle gestört: ' +
      String(LAGE.fehler).replace(/[<>&]/g, "").slice(0, 120) + "</span>" : "") +
    (LAGE.ohne_zeit ? ' · <span class="warn">' + LAGE.ohne_zeit +
      " ohne Zeitstempel (nicht im 24-Std-Fenster)</span>" : "") +
    '<div class="lagenote">Gezählt werden <b>Meldungen</b>, nicht Ereignisse. ' +
    "Zwei Kanäle über denselben Angriff ergeben zwei Meldungen. " +
    "Der Vergleich mit dem Vortag ist belastbar, die absolute Zahl nicht. " +
    "Alle Meldungen sind <b>ungeprüft</b>.</div></div>";

  const kacheln = sortiert.map((s) => {
    const k = proId[s.id];
    const st = lageStatus(k);
    const bsp = ((k || {}).beispiele || []).map((b) =>
      '<div class="kb"><span class="kba">' +
      (b.arten || []).map((a) => ART_TEXT[a] || a).join(" · ") + "</span>" +
      (b.ortname ? '<span class="kbo">' + b.ortname + "</span>" : "") +
      '<span class="kbz">' + vorZeit(b.zeit) + "</span>" +
      '<div class="kbt">' + String(b.text).replace(/[<>&]/g, "") + "</div></div>"
    ).join("") || '<div class="kbleer">Keine Ereignismeldung.</div>';

    const engen = (s.engen || []).map((id) => {
      const e = ENGEN.find((y) => y.id === id);
      return e ? e.kurz || e.name : id;
    });

    return '<button class="kachel" data-sp="' + s.id + '">' +
      '<div class="kk"><span class="led ' + st.s + '"></span>' +
      '<span class="kn">' + s.name + "</span>" +
      '<span class="kz">' + ((k || {}).n24 || 0) + "</span></div>" +
      '<div class="ks">' + lageSatz(k) + "</div>" +
      '<div class="kt">' + st.t + "</div>" +
      '<div class="kbs">' + bsp + "</div>" +
      (engen.length ? '<div class="ke">Betrifft: ' + engen.join(" · ") +
        "</div>" : "") + "</button>";
  }).join("");

  const legende = '<div class="symlegende"><b>Zeichen auf der Karte</b>' +
    Object.keys(ART_TEXT).map((a) =>
      '<span class="sl"><canvas width="26" height="26" data-art="' + a +
      '"></canvas>' + ART_TEXT[a] + "</span>").join("") + "</div>";

  el.innerHTML = kopf + '<div class="kachelgitter">' + kacheln + "</div>" + legende;

  el.querySelectorAll(".kachel").forEach((b) => {
    b.onclick = () => zeigeSchauplatz(b.dataset.sp);
  });
  // Die Legende zeichnet dieselben Symbole wie die Karte — aus derselben
  // Funktion, damit sie nicht auseinanderlaufen können.
  el.querySelectorAll(".symlegende canvas").forEach((c) => {
    const g = c.getContext("2d");
    g.translate(13, 13);
    g.strokeStyle = "#ff8a8a";
    g.fillStyle = "#ff8a8a";
    g.lineWidth = 1.4;
    g.lineCap = "round";
    if (ART_SYMBOL[c.dataset.art]) ART_SYMBOL[c.dataset.art](g);
  });
}

/* Klick auf eine Kachel: Karte auf den Schauplatz, Panel mit Erklärung
   und allen Meldungen dazu. */
function zeigeSchauplatz(id) {
  const s = SCHAUPLATZ_NACH_ID[id];
  if (!s) return;
  aktiv = null;
  AUSWAHL.clear();
  setModus("welt");
  fliegeZu(s.bbox);
  document.getElementById("pTitel").textContent = s.name.toUpperCase();
  const b = ((FEED || {}).beitraege || []).filter(
    (x) => (x.schauplatz || "sonstige") === id);
  const zeile = (x) =>
    '<div class="' + ((x.arten || []).length ? "ereig" : "meld") + '">' +
    '<div class="' + ((x.arten || []).length ? "ek" : "mk") + '">' +
    ((x.arten || []).length
      ? x.arten.map((a) => ART_TEXT[a] || a).join(" · ")
      : "@" + x.konto) +
    "<span>" + vorZeit(x.zeit) + "</span></div>" +
    (x.ortname ? '<div class="eq">' + x.ortname + "</div>" : "") +
    '<div class="mt">' + String(x.text).replace(/[<>&]/g, "") + "</div>" +
    '<div class="eq">@' + x.konto + " · ungeprüft</div></div>";
  document.getElementById("pInhalt").innerHTML =
    '<div class="worum"><b>Worum geht es hier</b><p>' + s.worum + "</p></div>" +
    '<div class="feedkopf">' + b.length + " Meldungen zu diesem Schauplatz" +
    "</div>" +
    (b.length ? b.slice(0, 60).map(zeile).join("")
      : '<div class="leerhinweis">Keine Meldung zugeordnet. Das heisst ' +
        "nicht, dass nichts passiert — nur, dass die eingetragenen Quellen " +
        "nichts dazu geliefert haben.</div>");
}

/* ---------- Panel und Liste ---------- */

function bauLegende(e) {
  // Aus derselben Quelle zählen, aus der auch gefärbt wird — sonst weicht
  // die Legende von der Karte ab, sobald sich die Kaskade ändert.
  const vorher = [modus, ansicht, aktiv];
  modus = "detail"; ansicht = "betroffen"; aktiv = e;
  const rollen = rollenKarte();
  modus = vorher[0]; ansicht = vorher[1]; aktiv = vorher[2];
  const zaehl = { kontrolle: 0, ausfuhr: 0, einfuhr: 0, folge: 0 };
  for (const n of Object.keys(rollen)) zaehl[rollen[n]]++;
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
  document.getElementById("pInhalt").innerHTML =
    '<h2>' + e.name + "</h2>" +
    '<div class="reg">' + e.region + "</div>" +
    '<div class="fakten">' +
      zeile("Breite", e.breite) +
      zeile("Verkehr", e.menge) +
      zeile("Anrainer", e.anrainer) +
      (LIVE && LIVE.werte[e.id] ? zeile("Live",
        '<b style="color:var(--phos)">' + LIVE.werte[e.id].n +
        " Schiffe/Tag</b><br><span style=\"color:var(--dim)\">Stand " +
        LIVE.werte[e.id].d + " · IMF PortWatch</span>") : "") +
      (statusVon(e.id) ? (function (sv) {
        return zeile("Status",
          '<span style="color:' + STATUS_FARBEN[sv.s].c + '">■ ' +
          STATUS_FARBEN[sv.s].t + "</span><br>" + sv.b +
          '<br><span style="color:var(--dim);font-size:10px">Quelle: ' +
          sv.quelle + "</span>");
      })(statusVon(e.id)) : "") +
      zeile("Kontrolle", e.betroffen.kontrolle
        .map((k) => "<b>" + k.t + "</b> — " + k.rolle).join("<br>")) +
    "</div>" +
    '<button class="bt" onclick="setAnsicht(\'betroffen\')">Betroffene Länder auf der Karte zeigen</button>' +
    "<h3>Warum sie zählt</h3><p>" + e.warum + "</p>" +
    "<h3>Was man wissen sollte</h3><p>" + e.detail + "</p>" +
    '<h3>Lage <span class="tag">veraltet schnell</span></h3><p>' + e.lage + "</p>" +
    ereignisBlock(e.id) +
    verlaufBlock(e.id) +
    meldungsBlock(e.id) +
    "<h3>Gibt es einen Umweg?</h3><p>" + e.umweg + "</p>" +
    '<div class="legende">' +
      e.routen
        .map((r) => '<span><i style="background:' + rf(r).c + '"></i>' + rf(r).t + "</span>")
        .join("") +
    "</div>" +
    '<h3>Quellen</h3><ul class="q">' +
      e.quellen.map((q) => "<li>" + q + "</li>").join("") +
    "</ul>";
  document.getElementById("pInhalt").scrollTop = 0;
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
