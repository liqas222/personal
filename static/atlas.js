/* Der Atlas: zeichnen, zoomen, klicken.
   Reines Canvas, keine Bibliothek. */

const WELT_BBOX = [-180, -58, 180, 80];

/* Sichtbare Kennung der ausgelieferten Fassung, unten in der Statusleiste.
   Ohne die lässt sich nicht unterscheiden, ob eine Änderung fehlt oder ob
   der Browser noch die alte Datei aus seinem Zwischenspeicher zeigt — und
   genau darüber haben wir schon zweimal aneinander vorbeigeredet. */
const BAU = "2026-09-09 · 8";

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
    // Zwei Grössen, zwei Zwecke — nicht verwechseln:
    //
    // `flaeche` ist die Summe der Umschliessungsrechtecke. Sie entscheidet
    // bei Enklaven, wer einen Klick gewinnt: Liechtenstein liegt in
    // Österreich, Monaco in Frankreich — wer beide trifft, meint das
    // kleinere. Dafür reicht ein grober Vergleichswert.
    //
    // `echteFlaeche` ist die tatsächliche Polygonfläche (Gauss'sche
    // Trapezformel). Sie geht in die Schwierigkeit des Quiz ein, und dort
    // wäre das Rechteck irreführend: Indonesien spannt ein riesiges
    // Rechteck auf und besteht doch aus Inseln.
    let flaeche = 0, echteFlaeche = 0;
    for (const p of polys) {
      flaeche += (p.bbox[2] - p.bbox[0]) * (p.bbox[3] - p.bbox[1]);
      const pts = p.pts;
      let a = 0;
      for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
        a += pts[j][0] * pts[i][1] - pts[i][0] * pts[j][1];
      }
      echteFlaeche += Math.abs(a / 2);
    }
    return { n: l.n, id: l.id, polys: polys, flaeche: flaeche,
             echteFlaeche: echteFlaeche };
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
  malAuswahl();
  document.querySelectorAll("nav button[data-modus]").forEach((b) => {
    b.onclick = () => setModus(b.dataset.modus);
  });
  document.getElementById("zurueck").onclick = () => setModus("welt");
  document.querySelectorAll("#ansichten button").forEach((b) => {
    b.onclick = () => setAnsicht(b.dataset.ansicht);
  });
  document.getElementById("weiter").onclick = naechsteFrage;
  document.getElementById("stand").textContent = STAND;
  const bau = document.getElementById("lgBau");
  if (bau) bau.textContent = BAU;

  // Quizart umschalten. Punktestand wird zurückgesetzt — er bezöge sich
  // sonst auf zwei verschiedene Spiele.
  document.querySelectorAll("#quizart .qa").forEach((b) => {
    b.onclick = () => {
      quizArt = b.dataset.q;
      document.querySelectorAll("#quizart .qa").forEach((x) =>
        x.classList.toggle("an", x.dataset.q === quizArt));
      document.getElementById("stufen").hidden = quizArt !== "land";
      document.querySelector('#leiste .lb.tr').hidden = quizArt !== "land";
      quiz.rest = [];
      quiz.punkte = 0;
      quiz.runden = 0;
      naechsteFrage();
    };
  });
  bauStufen();

  document.body.dataset.frei = "nein";
  view = makeView(WELT_BBOX, W, H);
  // Startbild ist das Quiz — dafür ist die Seite jetzt da.
  setModus("quiz");
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
      zeichneRouten(aktiv, now);
      zeichneOrte(aktiv);
      zeichneEngenName(aktiv);
    }
    zeichneHover();
  } else {
    zeichneHover();
    zeichneMeere(markenKaesten());
    if (AUSWAHL.size) zeichneAuswahlBoegen(now);
    zeichneMarken(now);
  }
}

/* ---------- Live-Daten ---------- */

/* Tägliche Durchfahrten je Enge, vom eigenen Server geholt (der wiederum
   IMF PortWatch abfragt). Beim Öffnen per Doppelklick vom Dateisystem gibt es
   keinen Server — dann bleibt es schlicht aus, statt Fehler zu werfen. */

/* Die Statuszeile unten muss dasselbe zählen wie die Karte zeigt — sonst
   steht dort "7 Meldungen", während vier zu sehen sind. */


/* ---------- Zeitfenster ----------

   Ohne das blieb jedes Ereignis für immer auf der Karte stehen: gezeichnet
   wurde schlicht alles, was der Feed hergab (bis zu 400 Meldungen), ohne
   Rücksicht auf das Alter. Nach zwei Tagen war die Karte zugepflastert und
   man sah nicht mehr, was gerade passiert.

   "alles" bleibt als Wahl erhalten — aber nicht als Voreinstellung. */


/* Zeitpunkt einer Meldung als Millisekunden, oder null. Die Zeitangaben
   kommen normiert vom Server ("YYYY-MM-DDTHH:MM", UTC ohne Kennzeichnung) —
   das Z muss hier dran, sonst liest der Browser sie als Ortszeit und alles
   verschiebt sich um den eigenen Zeitzonenversatz. */


/* Fällt die Meldung ins gewählte Fenster?

   Meldungen ohne Zeitstempel werden NICHT stillschweigend behalten: sie
   liessen sich sonst durch kein Fenster mehr wegfiltern und wären genau das
   Problem, das hier behoben wird. Sie erscheinen unter "ALLES" und die
   Meldungsspalte sagt, wie viele es sind. */
/* Der Zeitpunkt, nach dem gefiltert wird — echte Meldezeit, ersatzweise
   wann der Server die Meldung zuerst gesehen hat. Ohne diesen Ersatz fielen
   alle Meldungen aus Quellen ohne Zeitstempel (eine Webseite ohne RSS hat
   keinen) aus jedem Fenster ausser "alles" heraus, und der Monitor sah leer
   aus, obwohl Meldungen da waren.

   Der Ersatz wird nie als Ereigniszeit ausgegeben — siehe zeitText(). */


/* Wie eine Zeit dasteht. Geschätzt heisst geschätzt. */











/* Status einer Meerenge: die Bewertung aus lagen.js ist von Hand gesetzt und
   veraltet. Wo Live-Zahlen vorliegen, wird daraus ein eigener Status
   abgeleitet und der SCHLECHTERE der beiden genommen — die Zahlen sehen den
   Verkehrseinbruch, die Bewertung kennt den militärischen Zusammenhang.
   Welcher gewonnen hat, steht im Panel. */




/* Beiträge aus den verfolgten Telegram-Kanälen. Ohne eingerichteten Zugang bleibt die
   Anzeige sichtbar leer statt stillschweigend zu fehlen. */




/* Wie viel wurde über diese Enge geschrieben, und wann? Wochenweise, weil
   Tageswerte bei Kanälen zu zackig sind, um etwas zu erkennen. Der Ausschlag
   ist die Information — nicht die einzelne Nachricht. */


/* Laufende Einschlagsdarstellungen. Eine neue Drohnen- oder Raketenmeldung
   soll man sehen, ohne ins Panel zu schauen — deshalb die Animation auf der
   Karte statt nur einer Zeile im Text. */



/* Ein Einschlag: eine Flugbahn, die aus der Tiefe kommt und auf den Punkt
   zuläuft, dann Druckwellen-Ringe. Der Höheneindruck entsteht durch den
   Bogen und seinen Schatten auf der Karte. */


/* Symbole der Ereignisarten. Handgezeichnet, weil eine Bilddatei den
   Grundsatz "eine Datei, keine Abhängigkeiten" bräche — und weil sich
   Strichzeichnungen sauber in jeder Grösse zeichnen lassen. */


/* Flugbahnen: nur wenn Start UND Ziel im Text standen. Fehlt eines, wird
   keine Linie gezeichnet — eine erfundene Richtung wäre schlimmer als keine. */


/* Alle bekannten Ereignisse als Symbole an ihrer Meerenge. Mehrere am
   selben Ort werden aufgefächert, sonst liegen sie übereinander. */




/* Ereignisse zu dieser Enge — das, wonach man tatsächlich Ausschau hält.
   Steht vor den übrigen Meldungen, damit man es nicht suchen muss. */


/* Meldungen zu genau dieser Meerenge, als Block fürs Panel. */


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

/* Die Handelspartner eines Landes, mit Anteil in Prozent, wo die WTO ihn
   ausweist. Ohne Zahlen bleibt die kuratierte Liste aus handel.js — dann
   aber ohne Prozentangabe, statt eine zu erfinden. */
function partnerVon(name) {
  const w = WTO[name];
  if (w && (w.pAus || w.pEin)) {
    return {
      quelle: "wto",
      jahr: w.pJahr,
      aus: (w.pAus || []).map((x) => ({ l: x.l, p: x.p })),
      ein: (w.pEin || []).map((x) => ({ l: x.l, p: x.p })),
      restAus: w.restAus, restEin: w.restEin,
    };
  }
  const h = HANDEL[name];
  if (!h) return null;
  return {
    quelle: "liste",
    aus: h.pAus.map((l) => ({ l: l })),
    ein: h.pEin.map((l) => ({ l: l })),
  };
}

/* Bögen von den ausgewählten Ländern zu ihren Handelspartnern.

   Die Stärke der Linie folgt dem Anteil: 20 Prozent des Aussenhandels
   sollen anders aussehen als 3. Ohne Zahl bleibt sie dünn und gleichmässig
   — eine dicke Linie ohne Beleg wäre eine Behauptung. */
function zeichneAuswahlBoegen(now) {
  let k = 0;
  for (const name of AUSWAHL) {
    const pa = partnerVon(name);
    const m = landMitte(name);
    if (!pa || !m) continue;
    const staerke = (x) => x.p ? 1.2 + Math.min(x.p, 60) / 12 : 2;
    for (const x of pa.aus) {
      const z = landMitte(x.l);
      if (z) zeichneBogen(m, z, ROLLEN.ausfuhr.c,
        { now: now, phase: (k++ * 0.17) % 1, breite: staerke(x) });
    }
    for (const x of pa.ein) {
      const z = landMitte(x.l);
      if (z) zeichneBogen(z, m, ROLLEN.einfuhr.c,
        { now: now, phase: (k++ * 0.17) % 1, breite: staerke(x), hoehe: 0.78 });
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
    const pa = partnerVon(name);
    if (!pa) continue;
    for (const x of pa.aus) {
      if (!AUSWAHL.has(x.l)) {
        const r = (rollen[x.l] = rollen[x.l] || {});
        r.aus = true;
        if (x.p) r.pAus = Math.max(r.pAus || 0, x.p);
      }
    }
    for (const x of pa.ein) {
      if (!AUSWAHL.has(x.l)) {
        const r = (rollen[x.l] = rollen[x.l] || {});
        r.ein = true;
        if (x.p) r.pEin = Math.max(r.pEin || 0, x.p);
      }
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
    const pfeil = beides ? " \u21c4" : r.aus ? " \u2190" : " \u2192";
    // Prozentzahl direkt an die Linie. Ohne sie sagt der Bogen nur "ist
    // Partner", und genau das war die Kritik.
    const anteil = beides
      ? (r.pAus ? " " + zahl1(r.pAus) + "/" + zahl1(r.pEin) + " %" : "")
      : (r.aus ? r.pAus : r.pEin) ? " " + zahl1(r.aus ? r.pAus : r.pEin) + " %" : "";
    halo(((HANDEL[p] && HANDEL[p].t) || p).toUpperCase() + pfeil + anteil,
      x, y + 8);
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



/* Ebene 1 — Konfliktzonen. Der Puls macht sie ohne Legende als "aktiv"
   lesbar; die Farbe unterscheidet hoch von kritisch. */


/* Ebene 3 — Kontroll- und Blockadezonen, schraffiert statt gefuellt,
   damit sie sich von den Konfliktflaechen unterscheiden. */


/* Ebene 2 — Ziele und Schluesselanlagen als Rauten mit Datenkaestchen. */


/* Ebene 5 — Kraftvektoren. Duenn, gestrichelt, laufend. */


/* Ebene 6 — Intel-Callouts: warum diese Stelle ueberhaupt zaehlt. */




/* Fadenkreuz-Markierungen an den Kartenraendern. */


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

/* Nach der Antwort das gesuchte Land aufdecken.

   Grün, wenn getroffen; amber als Auflösung, wenn nicht. Erst hier fällt
   der Name — vorher wäre er die Lösung. */
function zeichneQuizLand() {
  if (!quiz.antwort || !quiz.frage) return;
  const l = LAENDER.find((x) => x.n === quiz.frage.n);
  if (!l) return;
  const richtig = quiz.antwort === quiz.frage.n;
  const farbe = richtig ? "#00e676" : "#ffb000";
  const [vw, vs, ve, vn] = view.bbox;
  ctx.beginPath();
  let sx = 0, sy = 0, n = 0;
  for (const p of l.polys) {
    const [w, s, e, nn] = p.bbox;
    if (e < vw || w > ve || nn < vs || s > vn) continue;
    p.pts.forEach((pt, i) => {
      const [x, y] = view.project(pt[0], pt[1]);
      i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      sx += x; sy += y; n++;
    });
    ctx.closePath();
  }
  ctx.fillStyle = richtig ? "rgba(0,230,118,.20)" : "rgba(255,176,0,.20)";
  ctx.fill("nonzero");
  ctx.strokeStyle = farbe;
  ctx.lineWidth = 2;
  ctx.stroke();

  // Ein Ring um den Ort, damit ein Zwergstaat überhaupt zu sehen ist.
  const m = landMitte(quiz.frage.n);
  if (m) {
    const [x, y] = view.project(m[0], m[1]);
    const puls = 16 + 4 * Math.sin(performance.now() / 320);
    ctx.beginPath();
    ctx.arc(x, y, puls, 0, 7);
    ctx.lineWidth = 1.4;
    ctx.stroke();
    ctx.font = '700 12px ui-monospace,Menlo,Consolas,monospace';
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    ctx.fillStyle = farbe;
    halo(quiz.frage.de.toUpperCase(), x, y - puls - 6);
  }
}

/* Marker der Meerengen auf der Weltkarte. */
function zeichneMarken(now) {
  const puls = 1 + 0.35 * Math.sin(now / 520);
  // Im Länderquiz haben die Meerengen nichts zu suchen — sie lenken ab und
  // beantworten die Frage nicht.
  if (modus === "quiz" && quizArt === "land") return zeichneQuizLand();
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

    const st = F.markeAus;
    const r = ist ? 7 * puls : 5.5;
    ctx.strokeStyle = st;
    ctx.lineWidth = 1.8;
    ctx.strokeRect(x - r, y - r, r * 2, r * 2);
    ctx.fillStyle = st;
    ctx.fillRect(x - 2, y - 2, 4, 4);

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

  // Im Meerengen-Quiz zusaetzlich: der geklickte Punkt und die Luftlinie
  // zur Loesung. Im Laenderquiz ist quiz.antwort ein Name, keine Koordinate.
  if (modus === "quiz" && quizArt === "enge" && Array.isArray(quiz.antwort)) {
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



/* Das angeklickte Ereignis auf der Karte hervorheben, damit klar ist,
   welches Symbol gerade im Panel steht. */


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

/* Den Ausschnitt in der Welt halten.

   Gerechnet wird im projizierten Raum, nicht in Gradzahlen: der Mercator-
   Massstab ist in Grad nicht linear, und ein Versatz in Grad verschiebt oben
   anders als am Äquator.

   Wichtig ist ausserdem, WAS begrenzt wird. `view.bbox` ist der sichtbare
   Bereich, aus dem Bildschirmrechteck zurückgerechnet — bei einer Leinwand,
   die breiter ist als die Karte, ist er grösser als die Welt. Ein Versuch,
   das in Gradzahlen zu begrenzen, hat deshalb beim Ziehen nach oben die
   Spannweite auf 395 Grad aufgeblasen, statt anzuhalten.

   Passt die Welt nicht ins Bild, wird mittig gesetzt — sonst am Rand
   angehalten. In beiden Fällen verschoben statt verworfen, sonst klemmt das
   Ziehen fest. */
function begrenzeAufWelt(bbox) {
  const [wW, wS, wO, wN] = WELT_BBOX;
  const gx0 = mercX(wW), gx1 = mercX(wO);
  const gyU = mercY(wS), gyO = mercY(wN);

  let x0 = mercX(bbox[0]), x1 = mercX(bbox[2]);
  let yU = mercY(bbox[1]), yO = mercY(bbox[3]);
  const breit = x1 - x0, hoch = yO - yU;

  if (breit >= gx1 - gx0) x0 = (gx0 + gx1) / 2 - breit / 2;
  else x0 = Math.max(gx0, Math.min(gx1 - breit, x0));
  if (hoch >= gyO - gyU) yU = (gyU + gyO) / 2 - hoch / 2;
  else yU = Math.max(gyU, Math.min(gyO - hoch, yU));

  return [invMercX(x0), invMercY(yU),
          invMercX(x0 + breit), invMercY(yU + hoch)];
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
  bbox = begrenzeAufWelt(bbox);
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
    // Im Länderquiz bleibt die Hervorhebung an — das ist die Rückmeldung,
    // die zeigt, welche Fläche man gerade treffen würde. Vorher war die
    // Landsuche hier abgeschaltet und die Karte fühlte sich tot an.
    // (Beschriftet wird sie nicht, siehe zeichneHover.)
    if (quizArt === "land" && !quiz.antwort) {
      if (performance.now() - letzterTest > 60) {
        letzterTest = performance.now();
        const [lon, lat] = view.invert(mx, my);
        hoverLand = landBei(((lon + 180) % 360 + 360) % 360 - 180, lat)
          || landNahe(mx, my, 12);
      }
      cv.style.cursor = hoverLand && LAENDER_QUIZ[hoverLand]
        ? "pointer" : "crosshair";
    } else {
      hoverLand = null;
      cv.style.cursor = quiz.antwort ? "default" : "crosshair";
    }
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
/* Hervorhebung des Landes unter dem Zeiger.

   IM QUIZ WIRD DIE FLÄCHE HERVORGEHOBEN, ABER NICHT BESCHRIFTET.
   Das ist kein Schönheitsdetail: die Namensbox stünde sonst als Lösung
   unter dem Mauszeiger, und das Spiel wäre wertlos. Der Name erscheint
   erst nach dem Klick, zusammen mit richtig oder falsch. */
function zeichneHover() {
  if (!hoverLand || zieht) return;
  // Im Quiz nur Länder hervorheben, die überhaupt gefragt werden können —
  // sonst leuchtet Guantanamo Bay auf und führt in die Irre.
  if (modus === "quiz" && (quizArt !== "land" || !LAENDER_QUIZ[hoverLand])) {
    return;
  }
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

  // Ab hier nur noch die Beschriftung — im Quiz endet es hier.
  if (modus === "quiz") return;

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
    pruefeAntwort(mx, my);
    return;
  }
  // Ein Klick, der eigentlich ein Ziehen war, darf nichts auswählen.
  // Der Merker muss getrennt geführt werden: beim Klick ist das Ziehen
  // bereits beendet und zieht wieder null.
  if (gezogen) { gezogen = false; return; }
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
  if (AUSWAHL.size) {
    document.getElementById("pTitel").textContent =
      "HANDELSPROFIL · " + AUSWAHL.size;
    bauHandelPanel();
  }
}

/* Deutsche Zahl mit einer Nachkommastelle, ohne unnötige ",0". */
function zahl1(v) {
  if (v === undefined || v === null) return "?";
  return (Math.round(v * 10) / 10).toString().replace(".", ",");
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
  const mitZahlen = [...AUSWAHL].filter((n) => WTO[n] && WTO[n].pAus);
  if (!mitZahlen.length && ![...AUSWAHL].some((n) => HANDEL[n])) {
    el.innerHTML = '<div class="bt2">LINIEN</div>' +
      "Für " + namen.join(", ") + " liegen keine Handelsdaten vor — deshalb " +
      "sind keine Linien gezeichnet.";
    return;
  }
  // Was die WTO nicht aufschlüsselt, gehört sichtbar dazu: bei
  // Saudi-Arabien sind das 80 Prozent der Ausfuhr, und ohne diese Angabe
  // liest sich der grösste genannte Abnehmer (5,1 %) als Hauptabnehmer.
  const rest = mitZahlen.map((n) => {
    const w = WTO[n];
    const t = (HANDEL[n] && HANDEL[n].t) || n;
    const teile = [];
    if (w.restAus != null) teile.push(zahl1(w.restAus) + " % der Ausfuhr");
    if (w.restEin != null) teile.push(zahl1(w.restEin) + " % der Einfuhr");
    return teile.length
      ? "<b>" + t + ":</b> " + teile.join(" und ") +
        " schlüsselt die WTO nicht nach Ländern auf."
      : "";
  }).filter(Boolean).join("<br>");

  const jahre = [...new Set(mitZahlen.map((n) => WTO[n].pJahr).filter(Boolean))];

  el.innerHTML =
    '<div class="bt2">ANTEIL AM WARENHANDEL</div>' +
    '<div class="bz"><span class="bl" style="border-color:' +
    ROLLEN.ausfuhr.c + '"></span><span>Ausfuhr — Anteil am gesamten ' +
    "Warenexport</span></div>" +
    '<div class="bz"><span class="bl" style="border-color:' +
    ROLLEN.einfuhr.c + '"></span><span>Einfuhr — Anteil am Warenimport' +
    "</span></div>" +
    '<div class="bz"><span class="bl" style="border-color:#c9b06a"></span>' +
    "<span>⇄ beides, Ausfuhr/Einfuhr</span></div>" +
    '<div class="bw">Die Linienstärke folgt dem Anteil.' +
    (rest ? "<br><br>" + rest : "") +
    "<br><br><b>Die EU zählt als ein Partner</b> und wird deshalb nicht als " +
    "Linie gezeichnet — im Panel steht sie mit ihrem Anteil." +
    "<br><br>Quelle: WTO, Trade Profiles 2023" +
    (jahre.length ? " · Anteile " + jahre.sort().join("/") : "") + "</div>";
}

/* Die WTO-Zahlen zu einem Land, als Block fürs Panel.

   Hier stehen zum ersten Mal echte Anteile statt Rangfolgen. Zwei Dinge
   müssen mitlaufen, sonst führen die Zahlen in die Irre:
   das Bezugsjahr (es reicht von 2000 bis 2022, je nachdem, was das Land
   gemeldet hat) und der Anteil, den die WTO nicht nach Ländern aufschlüsselt. */
function wtoBlock(n) {
  const w = WTO[n];
  if (!w) {
    return '<div class="hz"><span class="hk">Anteile</span>' +
      '<span class="hv hinw">Für dieses Land führt die WTO kein Profil. ' +
      "Oben stehen Warengruppen als Rangfolge, ohne Mengenangabe.</span></div>";
  }
  const zeile = (t, v) =>
    '<div class="hz"><span class="hk">' + t + '</span><span class="hv">' +
    v + "</span></div>";
  const mio = (v) => v == null ? "nicht ausgewiesen"
    : (v >= 1000 ? zahl1(v / 1000) + " Mrd." : Math.round(v) + " Mio.") + " US$";
  const gruppen = (g) => !g ? "nicht ausgewiesen" :
    [["Agrar", g.agrar], ["Brennstoffe/Bergbau", g.energie],
     ["Industriegüter", g.industrie], ["Sonstige", g.sonst]]
      .filter((x) => x[1] != null)
      .map((x) => x[0] + " " + zahl1(x[1]) + " %").join(" · ");
  const partner = (liste, rest) => !liste ? "nicht ausgewiesen" :
    liste.map((x) => '<span class="pz">' +
      ((HANDEL[x.l] && HANDEL[x.l].t) || x.l) + " <b>" + zahl1(x.p) +
      " %</b></span>").join("") +
    (rest != null ? '<span class="pz rest">nicht aufgeschlüsselt <b>' +
      zahl1(rest) + " %</b></span>" : "");

  return zeile("Warenausfuhr", mio(w.aus)) +
    zeile("Wareneinfuhr", mio(w.ein)) +
    zeile("Ausfuhr, Waren", gruppen(w.wAus)) +
    zeile("Einfuhr, Waren", gruppen(w.wEin)) +
    zeile("Geht nach", partner(w.pAus, w.restAus)) +
    zeile("Kommt aus", partner(w.pEin, w.restEin)) +
    (w.waren && w.waren.length
      ? zeile("Grösste Posten", w.waren.slice(0, 5).map((x) =>
          '<span class="pz">' + x.t + " <b>" + mio(x.v) + "</b></span>").join(""))
      : "") +
    '<div class="hz"><span class="hk"></span><span class="hv hinw">' +
    "WTO, Trade Profiles 2023, S. " + w.seite +
    (w.pJahr ? " · Länderanteile " + w.pJahr : "") +
    (w.wJahr ? ", Warengruppen " + w.wJahr : "") + ". " +
    "Die EU zählt als ein Partner. Anteile beziehen sich auf den " +
    "Warenhandel des Landes insgesamt — welche Ware zu welchem Partner " +
    "geht, weist die WTO nicht aus." +
    "</span></div>";
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
        // Kein kuratiertes Profil, aber vielleicht WTO-Zahlen: die decken
        // 197 Volkswirtschaften ab, handel.js nur rund 45.
        const w = WTO[n];
        return '<div class="hbox"><h3>' + ((w && w.name) || n) + "</h3>" +
          (w ? wtoBlock(n)
             : "<p>" + HANDEL_FEHLT + "</p>") + "</div>";
      }
      // An welchen Engen hängt das Land, und wie stark?
      const engen = h.engen.map((id) => {
        const e = ENGEN.find((x) => x.id === id);
        const a = (ABHAENGIGKEIT[id] || {})[n];
        const st = "#8fa6a0";
        return '<div class="eng"><span class="pkt" style="background:' + st +
          '"></span><b>' + (e ? e.name : id) + "</b>" +
          (a ? '<span class="pct">' + a.wert + " % " + a.was + "</span>" +
               '<span class="qq">' + a.q + "</span>"
             : '<span class="qq">Anteil nicht belegt</span>') + "</div>";
      }).join("");
      return '<div class="hbox"><h3>' + h.t + "</h3>" +
        '<p class="kern">' + h.kern + "</p>" +
        liste("Führt aus", h.aus) + liste("Führt ein", h.ein) +
        wtoBlock(n) +
        '<div class="hz"><span class="hk">Engpässe</span></div>' + engen +
        "</div>";
    }).join("") +
    '<div class="quelle">' + HANDEL_QUELLE + "</div>";
}

/* ---------- Ebenen-Schaltpult ---------- */

/* Wie viele Objekte eine Ebene beisteuert — steht im Schalter, damit man
   vorher weiss, was man sich auf die Karte holt. */










/* Die Meldungsspalte ist der Normalzustand des rechten Fensters. Erst wenn
   man ein Land oder eine Enge anwählt, tritt sie zurück. */


/* Meldungen in der Liste sind dieselben Ereignisse wie auf der Karte —
   also muss ein Klick dort dasselbe Fenster oeffnen. */


/* ---------- Lagebild: eine Kachel je Kriegsschauplatz ----------

   Das Startbild. Wer die Seite aufmacht, soll ohne einen Klick sehen, wo
   gerade etwas passiert — und in Worten, nicht in Symbolen.

   Wichtige Einschränkung, die im UI auch dransteht: gezählt werden
   MELDUNGEN, nicht Ereignisse in der Welt. Zwei Kanäle, die denselben
   Angriff berichten, ergeben zwei Meldungen. Der Wert taugt für den
   Vergleich mit dem Vortag — nicht als Angabe darüber, wie viel wirklich
   geschehen ist. Alles andere wäre eine erfundene Zahl. */




/* Der eine Satz, der die Kachel erklärt. */


/* Kurzfassung des Lagebilds für die Spalte neben der Karte: eine Zeile je
   Schauplatz, an dem etwas läuft. Klick springt auf die Karte. */


/* Die Klicks der Kurzlage anhängen — das Panel wird als HTML gebaut, die
   Knöpfe brauchen ihre Handler danach. */




/* Klick auf eine Kachel: Karte auf den Schauplatz, Panel mit Erklärung
   und allen Meldungen dazu. */


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

/* ---------- Länderquiz ----------

   Ein Land wird genannt, man klickt es auf der Karte an.

   SCHWIERIGKEIT WIRD ABGELEITET, NICHT GESETZT.
   Aus zwei Grössen, die beide schon vorliegen: der Fläche aus der Geometrie
   und dem Bruttoinlandsprodukt aus den WTO-Daten. Gross und wirtschaftlich
   gewichtig heisst bekannt; klein und abgelegen heisst schwer. Eine
   handgepflegte Einstufung würde veralten und wäre reine Geschmackssache —
   dieselbe Regel wie überall im Projekt.

   Beide Grössen gehen logarithmisch ein, sonst erschlägt Russland alles. */

let quizArt = "land";        // land | enge

const STUFEN = [
  { id: "einfach", t: "EINFACH", n: 40 },
  { id: "mittel", t: "MITTEL", n: 90 },
  { id: "schwer", t: "SCHWER", n: 999 },
];
let stufe = "einfach";

/* Nach Bekanntheit sortierte Länderliste, einmal berechnet. */
let RANGLISTE = null;

function bauRangliste() {
  const roh = [];
  for (const l of LAENDER) {
    const de = LAENDER_QUIZ[l.n];
    if (!de) continue;               // Gebiet, Stützpunkt, umstritten
    roh.push({ n: l.n, de: de, flaeche: l.echteFlaeche,
               bip: (WTO[l.n] && WTO[l.n].bip) || null });
  }

  // Über RÄNGE rechnen, nicht über die Rohwerte. Zwei Gründe: die
  // Grössenordnungen sind völlig verschieden (Quadratgrad gegen Milliarden
  // Dollar), und Ausreisser wie Russland würden jede Skala verziehen.
  const rang = (feld, liste) => {
    const mit = liste.filter((x) => x[feld] != null)
      .sort((a, b) => a[feld] - b[feld]);
    const m = {};
    mit.forEach((x, i) => { m[x.n] = i / Math.max(1, mit.length - 1); });
    return m;
  };
  const rFlaeche = rang("flaeche", roh);
  const rBip = rang("bip", roh);

  for (const x of roh) {
    // Fehlt das BIP, zählt die Fläche doppelt — NICHT null einsetzen.
    // Kuba, Nordkorea und Somalia führt die WTO nicht; mit einer Null
    // landeten sie zwischen Nauru und Monaco unter den schwersten Ländern,
    // was offensichtlich falsch ist.
    const rb = rBip[x.n] !== undefined ? rBip[x.n] : rFlaeche[x.n];
    x.wert = rFlaeche[x.n] * 0.6 + rb * 0.4;
    x.geschaetzt = rBip[x.n] === undefined;
  }
  roh.sort((a, b) => b.wert - a.wert);
  return roh;
}

/* Die Länder einer Stufe. Jede Stufe enthält alles Leichtere mit —
   „schwer" heisst mehr Auswahl, nicht nur die Zwergstaaten. */
function laenderDerStufe(id) {
  if (!RANGLISTE) RANGLISTE = bauRangliste();
  const s = STUFEN.find((x) => x.id === id) || STUFEN[0];
  return RANGLISTE.slice(0, Math.min(s.n, RANGLISTE.length));
}

function bauStufen() {
  const el = document.getElementById("stufen");
  if (!el) return;
  el.innerHTML = STUFEN.map((s) =>
    '<button class="sb' + (s.id === stufe ? " an" : "") + '" data-s="' + s.id +
    '">' + s.t + " <span>" + laenderDerStufe(s.id).length + "</span></button>"
  ).join("");
  el.querySelectorAll(".sb").forEach((b) => {
    b.onclick = () => {
      stufe = b.dataset.s;
      bauStufen();
      quiz.rest = [];
      quiz.punkte = 0;
      quiz.runden = 0;
      naechsteFrage();
    };
  });
}

/* ---------- Quiz ---------- */

/* Die nächste Frage stellen.

   Bei Zwergstaaten fährt die Karte vorher in die Region. Ohne das wäre die
   Frage unfair statt schwer: 49 Länder sind bei Weltzoom kleiner als ein
   Pixel — Monaco, Nauru, Malta, Singapur. Man muss immer noch wissen, wo
   sie liegen, aber man sieht das Ziel. */
function naechsteFrage() {
  if (quizArt === "enge") return naechsteEngenFrage();
  const pool = laenderDerStufe(stufe);
  if (!quiz.rest.length) {
    quiz.rest = pool.slice().sort(() => Math.random() - 0.5);
  }
  quiz.frage = quiz.rest.pop();
  quiz.antwort = null;
  quiz.gezeigt = null;

  const mitte = landMitte(quiz.frage.n);
  // Schwelle in Quadratgrad: darunter ist ein Land auf der Weltkarte nicht
  // mehr als Fläche erkennbar.
  const winzig = quiz.frage.flaeche < 2.5;
  quiz.gezoomt = winzig && !!mitte;
  if (quiz.gezoomt) {
    // Weit genug, dass die Nachbarschaft sichtbar bleibt — es soll eine
    // Ortskenntnisfrage bleiben, keine Klickübung auf ein leeres Feld.
    const r = Math.max(9, Math.sqrt(quiz.frage.flaeche) * 8);
    fliegeZu([mitte[0] - r, mitte[1] - r * 0.62,
              mitte[0] + r, mitte[1] + r * 0.62]);
  } else {
    fliegeZu(WELT_BBOX);
  }

  document.getElementById("qfrage").textContent = quiz.frage.de;
  document.getElementById("qhilfe").textContent = quiz.gezoomt
    ? "Kleines Land — die Karte ist schon herangefahren."
    : "Klick das Land auf der Karte an.";
  document.getElementById("qergebnis").textContent = "";
  document.getElementById("qergebnis").className = "";
  document.getElementById("weiter").hidden = true;
  zeigePunkte();
}

/* Antwort prüfen.

   Gewertet wird der Ländertreffer, nicht die Entfernung: Entweder man hat
   das richtige Land angeklickt oder nicht. Die Entfernung steht trotzdem
   dabei — „800 km daneben" sagt einem mehr als ein blosses Falsch. */
function pruefeAntwort(mx, my) {
  if (quiz.antwort) return;
  if (quizArt === "enge") return pruefeEngenAntwort(mx, my);
  const [lon, lat] = view.invert(mx, my);
  const getroffen = landBei(((lon + 180) % 360 + 360) % 360 - 180, lat)
    || landNahe(mx, my, 12);
  quiz.antwort = getroffen || "—";
  quiz.runden++;

  const richtig = getroffen === quiz.frage.n;
  if (richtig) quiz.punkte++;
  quiz.gezeigt = quiz.frage.n;

  const el = document.getElementById("qergebnis");
  if (richtig) {
    el.textContent = "Richtig.";
    el.className = "gut";
  } else {
    const ziel = landMitte(quiz.frage.n);
    const km = ziel ? Math.round(distKm([lon, lat], ziel)) : null;
    const wo = getroffen
      ? (LAENDER_QUIZ[getroffen] || getroffen)
      : "ins Wasser";
    el.textContent = "Das war " + wo +
      (km !== null ? " — " + km.toLocaleString("de-CH") + " km daneben." : ".");
    el.className = km !== null && km < 1200 ? "ok" : "schlecht";
  }
  document.getElementById("qhilfe").textContent = "";
  document.getElementById("weiter").hidden = false;

  // Das gesuchte Land aufdecken und, falls es weit weg liegt, hinfahren.
  if (!richtig) {
    const m = landMitte(quiz.frage.n);
    if (m && !quiz.gezoomt) {
      const r = Math.max(14, Math.sqrt(quiz.frage.flaeche) * 6);
      fliegeZu([m[0] - r, m[1] - r * 0.62, m[0] + r, m[1] + r * 0.62]);
    }
  }
  zeigeInfokarte(quiz.frage.n);
  zeigePunkte();
}

/* Nach der Antwort: was man über das Land wissen kann.

   Das ist der Unterschied zwischen einem Klickspiel und einem Lernwerkzeug.
   Die Zahlen liegen ohnehin da (WTO Trade Profiles) — hier bekommen sie
   einen Anlass. */
function zeigeInfokarte(name) {
  const el = document.getElementById("qinfo");
  if (!el) return;
  const w = WTO[name];
  const h = HANDEL[name];
  const de = LAENDER_QUIZ[name] || name;
  if (!w && !h) {
    el.innerHTML = '<b>' + de + "</b> — für dieses Land liegen keine " +
      "Handelsdaten vor.";
    el.hidden = false;
    return;
  }
  const teile = [];
  if (h && h.kern) teile.push(h.kern);
  if (w && w.wAus) {
    const g = [["Agrarprodukte", w.wAus.agrar],
               ["Brennstoffe und Bergbau", w.wAus.energie],
               ["Industriegüter", w.wAus.industrie]]
      .filter((x) => x[1] != null).sort((a, b) => b[1] - a[1])[0];
    if (g) teile.push("führt überwiegend " + g[0] + " aus (" +
      zahl1(g[1]) + " %)");
  }
  if (w && w.pAus && w.pAus.length) {
    const ab = w.pAus[0];
    const abName = ab.l === "European Union" ? "die EU"
      : (HANDEL[ab.l] && HANDEL[ab.l].t) || LAENDER_QUIZ[ab.l] || ab.l;
    teile.push("grösster Abnehmer " + abName + " (" + zahl1(ab.p) + " %)");
  }
  if (h && h.engen && h.engen.length) {
    teile.push("hängt an " + h.engen.map((id) => {
      const e = ENGEN.find((x) => x.id === id);
      return e ? e.kurz || e.name : id;
    }).join(" und "));
  }
  el.innerHTML = "<b>" + de + "</b> " + teile.join(" · ") +
    (w ? '<span class="q">— WTO Trade Profiles 2023, S. ' + w.seite +
         "</span>" : "");
  el.hidden = false;
}

/* ---------- Meerengen-Quiz ----------

   Die zweite Variante, unverändert im Wesen: hier zählt die Entfernung,
   nicht der Ländertreffer — eine Meerenge ist eine Stelle, kein Gebiet. */

function naechsteEngenFrage() {
  if (!quiz.rest.length) {
    quiz.rest = ENGEN.slice().sort(() => Math.random() - 0.5);
  }
  quiz.frage = quiz.rest.pop();
  quiz.antwort = null;
  quiz.gezoomt = false;
  fliegeZu(WELT_BBOX);
  document.getElementById("qfrage").textContent = quiz.frage.name;
  document.getElementById("qhilfe").textContent =
    "Klick auf die Stelle in der Karte.";
  document.getElementById("qergebnis").textContent = "";
  document.getElementById("qergebnis").className = "";
  document.getElementById("qinfo").hidden = true;
  document.getElementById("weiter").hidden = true;
  zeigePunkte();
}

function pruefeEngenAntwort(mx, my) {
  const ll = view.invert(mx, my);
  quiz.antwort = ll;
  const km = Math.round(distKm(ll, quiz.frage.pos));
  quiz.runden++;
  let txt, cls;
  if (km < 500) {
    txt = "Sitzt. " + km + " km daneben.";
    cls = "gut";
    quiz.punkte++;
  } else if (km < 1500) {
    txt = "Richtige Ecke — " + km + " km daneben.";
    cls = "ok";
  } else {
    txt = km.toLocaleString("de-CH") + " km daneben.";
    cls = "schlecht";
  }
  const el = document.getElementById("qergebnis");
  el.textContent = txt;
  el.className = cls;
  const info = document.getElementById("qinfo");
  info.innerHTML = "<b>" + quiz.frage.name + "</b> " + quiz.frage.region +
    " · " + quiz.frage.breite + " · " + quiz.frage.menge;
  info.hidden = false;
  document.getElementById("qhilfe").textContent = "";
  document.getElementById("weiter").hidden = false;
  zeigePunkte();
}

function zeigePunkte() {
  document.getElementById("qpunkte").textContent =
    quiz.punkte + " / " + quiz.runden;
  const a = document.getElementById("lgAnzahl");
  const st = document.getElementById("lgStufe");
  const p = document.getElementById("lgPunkte");
  if (a) a.textContent = quizArt === "land"
    ? laenderDerStufe(stufe).length : ENGEN.length;
  if (st) st.textContent = quizArt === "land"
    ? (STUFEN.find((x) => x.id === stufe) || {}).t : "MEERENGEN";
  if (p) p.textContent = quiz.runden
    ? quiz.punkte + " / " + quiz.runden +
      " (" + Math.round(quiz.punkte / quiz.runden * 100) + " %)"
    : "–";
}

addEventListener("DOMContentLoaded", init);
