/* Karten-Grundlagen: Ringe dekodieren, Koordinaten projizieren.
   Bewusst ohne Bibliothek — das ist alles, was eine Karte braucht. */

/* Gegenstueck zu encode() in tools/build_map.py: Startpunkt absolut,
   danach Differenzen, Zickzack-kodiert, 5 Bit je Zeichen. */
const RING_CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-";
const RING_VAL = {};
for (let i = 0; i < RING_CHARS.length; i++) RING_VAL[RING_CHARS[i]] = i;

function decodeRing(s, grid) {
  const pts = [];
  let i = 0, x = 0, y = 0;
  while (i < s.length) {
    const d = [0, 0];
    for (let k = 0; k < 2; k++) {
      let v = 0, shift = 0, c;
      do {
        c = RING_VAL[s[i++]];
        v |= (c & 31) << shift;
        shift += 5;
      } while (c & 32);
      d[k] = (v >>> 1) ^ -(v & 1); // Zickzack rueckwaerts
    }
    x += d[0];
    y += d[1];
    pts.push([x * grid, y * grid]);
  }
  return pts;
}

/* Mercator. Fuer eine Karte, auf der man Meerengen und Seewege anschaut,
   ist Winkeltreue das Richtige: Kurse und Kuestenformen stimmen. Der Preis
   sind zu grosse Polargebiete — dort passiert hier nichts.
   Beide Achsen rechnen in derselben Einheit (Bogenmass) — sonst wird die
   Karte in einer Richtung gestaucht. */
function mercX(lon) {
  return (lon * Math.PI) / 180;
}

function mercY(lat) {
  const l = Math.max(-85, Math.min(85, lat));
  return Math.log(Math.tan(Math.PI / 4 + (l * Math.PI) / 180 / 2));
}

/* Rückwege. Begrenzungen müssen im projizierten Raum gerechnet werden:
   dort ist der Massstab linear, in Gradzahlen ist er es nicht. */
function invMercX(x) {
  return (x * 180) / Math.PI;
}

function invMercY(y) {
  return ((2 * Math.atan(Math.exp(y)) - Math.PI / 2) * 180) / Math.PI;
}

/* Ein Ausschnitt (lon/lat-Rechteck) wird auf die Leinwand abgebildet.
   Beide Achsen bekommen denselben Massstab, damit nichts verzerrt. */
function makeView(bbox, w, h) {
  const [w0, s0, e0, n0] = bbox;
  // Beide Spannen positiv halten. Bildschirm-y zeigt nach unten, Breitengrade
  // nach oben — deshalb wird y vom Nordrand aus nach unten gemessen.
  const xLinks = mercX(w0), spanX = mercX(e0) - mercX(w0);
  const yOben = mercY(n0), spanY = mercY(n0) - mercY(s0);
  const k = Math.min(w / spanX, h / spanY);
  const ox = (w - spanX * k) / 2;
  const oy = (h - spanY * k) / 2;
  return {
    bbox: bbox,
    k: k,
    project: (lon, lat) => [
      ox + (mercX(lon) - xLinks) * k,
      oy + (yOben - mercY(lat)) * k,
    ],
    invert: (px, py) => {
      const lon = (((px - ox) / k + xLinks) * 180) / Math.PI;
      const my = yOben - (py - oy) / k;
      const lat = ((2 * Math.atan(Math.exp(my)) - Math.PI / 2) * 180) / Math.PI;
      return [lon, lat];
    },
  };
}

/* Grosskreis-Entfernung in km — fuer "wie weit lagst du daneben?". */
function distKm(a, b) {
  const R = 6371, rad = Math.PI / 180;
  const dLat = (b[1] - a[1]) * rad, dLon = (b[0] - a[0]) * rad;
  const p =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(a[1] * rad) * Math.cos(b[1] * rad) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(p));
}
