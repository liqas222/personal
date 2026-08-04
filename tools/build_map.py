#!/usr/bin/env python3
"""Erzeugt static/world.js aus den Natural-Earth-Daten.

Eingabe ist eine TopoJSON-Datei (data/ne_countries_50m.topo.json, Public
Domain). Ausgabe ist eine JS-Datei, die per <script src> geladen wird — damit
laeuft der Atlas auch per Doppelklick vom Dateisystem, ohne Webserver und ohne
fetch(). Nur Standardbibliothek.

Aufruf:  python3 tools/build_map.py
"""
import json
import os

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(BASE, "data", "ne_countries_50m.topo.json")
OUT = os.path.join(BASE, "static", "world.js")

# Aufloesung der Ausgabe in Grad. 0.02 ist ca. 2 km am Aequator — fuer eine
# Uebersichtskarte mehr als genug und rund viermal kleiner als das Original.
GRID = 0.02


def decode_arcs(topo):
    """TopoJSON-Arcs (delta-kodierte Ganzzahlen) -> Listen aus [lon, lat]."""
    sx, sy = topo["transform"]["scale"]
    tx, ty = topo["transform"]["translate"]
    out = []
    for arc in topo["arcs"]:
        x = y = 0
        pts = []
        for dx, dy in arc:
            x += dx
            y += dy
            pts.append((x * sx + tx, y * sy + ty))
        out.append(pts)
    return out


def ring_points(arc_idx, arcs):
    """Setzt einen Ring aus seinen Arc-Verweisen zusammen.

    Ein negativer Index bedeutet: dieser Arc rueckwaerts, und zwar ab ~i
    (also -1 -> Arc 0 umgedreht). Der erste Punkt wird weggelassen, weil er
    dem letzten des vorherigen Arcs entspricht.
    """
    pts = []
    for i in arc_idx:
        seg = arcs[~i][::-1] if i < 0 else arcs[i]
        pts.extend(seg[1:] if pts else seg)
    return pts


def simplify(pts):
    """Punkte aufs Raster runden und direkte Wiederholungen entfernen."""
    out = []
    for lon, lat in pts:
        p = (round(lon / GRID) * GRID, round(lat / GRID) * GRID)
        if not out or p != out[-1]:
            out.append(p)
    return out


CHARS = ("ABCDEFGHIJKLMNOPQRSTUVWXYZ"
         "abcdefghijklmnopqrstuvwxyz0123456789+-")  # 64 Zeichen, JSON-sicher


def encode(pts):
    """Ring als Zeichenkette: Startpunkt absolut, danach Differenzen.

    Nachbarpunkte einer Kuestenlinie liegen dicht beieinander, ihre Differenz
    passt darum fast immer in ein einziges Zeichen. Als JSON-Zahlenpaare war
    dieselbe Karte rund fuenfmal so gross.

    Kodierung je Zahl: Zickzack (Vorzeichen ins niedrigste Bit), dann 5 Bit je
    Zeichen; Bit 6 gesetzt heisst 'es folgt ein weiteres Zeichen'.
    """
    out = []
    px = py = 0
    for lon, lat in pts:
        x, y = int(round(lon / GRID)), int(round(lat / GRID))
        for v in (x - px, y - py):
            v = (v << 1) ^ (v >> 31)  # Zickzack
            while True:
                c = v & 31
                v >>= 5
                out.append(CHARS[c | 32] if v else CHARS[c])
                if not v:
                    break
        px, py = x, y
    return "".join(out)


def polygons(geom):
    """Liefert die Ringe einer Geometrie, egal ob Polygon oder MultiPolygon."""
    t = geom.get("type")
    if t == "Polygon":
        return list(geom["arcs"])
    if t == "MultiPolygon":
        return [ring for poly in geom["arcs"] for ring in poly]
    return []


def main():
    with open(SRC) as f:
        topo = json.load(f)
    arcs = decode_arcs(topo)

    laender = []
    for g in topo["objects"]["countries"]["geometries"]:
        ringe = []
        for arc_idx in polygons(g):
            pts = simplify(ring_points(arc_idx, arcs))
            # Unter vier Punkten bleibt keine Flaeche uebrig — Splitter aus
            # dem Runden, die nur Bytes kosten.
            if len(pts) >= 4:
                ringe.append(encode(pts))
        if not ringe:
            continue
        laender.append({
            "n": g.get("properties", {}).get("name", "?"),
            "id": g.get("id", ""),
            "r": ringe,
        })

    laender.sort(key=lambda l: l["n"])
    js = ("// Automatisch erzeugt von tools/build_map.py — nicht von Hand aendern.\n"
          "// Quelle: Natural Earth 1:50m via world-atlas (Public Domain).\n"
          "// Ringe sind kodiert — siehe decodeRing() in static/atlas.js.\n"
          "const WORLD=" + json.dumps({"grid": GRID, "laender": laender},
                                      separators=(",", ":")) + ";\n")
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w") as f:
        f.write(js)

    print("%d Laender, %d Ringe -> %s (%.0f KB)"
          % (len(laender), sum(len(l["r"]) for l in laender),
             os.path.relpath(OUT, BASE), os.path.getsize(OUT) / 1024))


if __name__ == "__main__":
    main()
