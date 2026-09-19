#!/usr/bin/env python3
"""Die Verarbeitungskette: roh rein, bewerteter Fall raus.

Reihenfolge, und warum sie so ist:

  1. Normalisieren      — ohne einheitliche Daten lässt sich nichts weiter tun
  2. Prüfen             — kaputte Sätze (UID falsch, kein Name) gehen nicht rein
  3. Kanton filtern     — aber nur für die Anzeige, gespeichert wird alles
  4. Klassieren         — Branche und Assets aus dem Zweck
  5. Bewerten           — Score mit Aufschlüsselung
  6. Einschränkungen    — was einem Kauf im Weg stehen kann
  7. Ablegen            — mit Duplikaterkennung

Was hier NICHT passiert: irgendetwas aus dem Internet nachladen. Die Kette
arbeitet auf dem, was der Adapter geliefert hat.
"""
from . import bewertung, klassierung, modell


def verarbeiten(rohsaetze, speicher, stichtag=None):
    """Rohe Datensätze durch die Kette schicken und ablegen.

    Gibt einen Bericht zurück: was ist reingekommen, was war neu, was
    wurde verworfen und warum.
    """
    bericht = {"gelesen": 0, "neu": 0, "aktualisiert": 0, "bekannt": 0,
               "verworfen": 0, "probleme": [], "faelle": []}

    for roh in rohsaetze:
        bericht["gelesen"] += 1
        fall = modell.fall_bauen(roh, stichtag)

        if not fall["firma"]:
            bericht["verworfen"] += 1
            bericht["probleme"].append("Satz ohne Firmenname übersprungen")
            continue
        if fall["fehler"]:
            # Kein Abbruch: ein Satz mit unlesbarer UID ist trotzdem
            # brauchbar, die UID fehlt dann eben. Gemeldet wird es aber.
            bericht["probleme"].append(
                "%s: %s" % (fall["firma"], "; ".join(fall["fehler"])))

        klass = klassierung.klassieren(fall["zweck"], fall["rohtext"])
        bew = bewertung.bewerten(fall, klass)
        fall["einschraenkungen"] = bewertung.einschraenkungen(fall, klass)
        fall["naechster_schritt"] = bewertung.naechster_schritt(fall)

        schluessel = modell.firmenname_schluessel(fall["firma"])
        was = speicher.aufnehmen(fall, klass, bew, schluessel)
        bericht[was] += 1
        bericht["faelle"].append({"id": fall["id"], "firma": fall["firma"],
                                  "score": bew["score"], "was": was})
    return bericht


def _liste(wert):
    """JSON-Text oder fertige Liste -> Liste."""
    import json as _json
    if wert is None or wert == "":
        return []
    if isinstance(wert, (list, tuple)):
        return list(wert)
    try:
        return _json.loads(wert)
    except (ValueError, TypeError):
        return []


def meldung_bauen(fall):
    """Text einer Benachrichtigung zu einem Fall.

    Der letzte Satz ist immer der nächste Schritt, und der geht immer an
    das Konkursamt. Ein Kontakt zu den früheren Inhabern kommt hier nicht
    vor und ist im Datenmodell auch nicht vorgesehen.
    """
    # Die Felder kommen entweder roh aus der Datenbank (JSON-Text) oder
    # bereits ausgepackt aus der Weboberfläche. Beides zulassen, statt sich
    # auf eine Aufrufreihenfolge zu verlassen — genau daran ist es beim
    # ersten Durchlauf gescheitert.
    zeilen = _liste(fall.get("begruendung"))
    assets = _liste(fall.get("assets"))
    einschr = _liste(fall.get("einschraenkungen"))

    t = []
    t.append("%s — %s (%s)" % (fall["firma"], fall["ort"] or "Ort unbekannt",
                               fall["kanton"] or "?"))
    t.append("%s, publiziert %s" % (fall.get("art_text") or "Meldung",
                                    fall.get("publikationsdatum") or "ohne Datum"))
    if assets:
        t.append("Vermutete Assets: " + ", ".join(assets[:6]) +
                 "  (vermutet, nicht bestätigt)")
    t.append("Score %d/100" % (fall.get("score") or 0))
    for z in zeilen:
        if z["punkte"]:
            t.append("   %+d  %s" % (z["punkte"], z["grund"]))
    t.append("Zuständig: " + (fall.get("konkursamt") or "Konkursamt unbekannt"))
    if fall.get("quelle_url"):
        t.append("Quelle: " + fall["quelle_url"])
    for e in einschr:
        t.append("Achtung: " + e)
    t.append("Nächster Schritt: " + (fall.get("naechster_schritt") or
             "Beim zuständigen Konkursamt nach dem Inventar fragen."))
    return "\n".join(t)


KEINE_TREFFER = "Heute wurden keine neuen Deals mit einem Score ab 60 gefunden."


def tagesmeldung(speicher, kantone=None, min_score=None):
    """Die Zusammenstellung für den Tag. Leer heisst: das auch sagen."""
    from .bewertung import SCHWELLE
    faelle = speicher.suchen(kantone=kantone,
                             min_score=min_score or SCHWELLE,
                             nur_ungemeldet=True)
    if not faelle:
        return KEINE_TREFFER, []
    text = "\n\n".join(meldung_bauen(f) for f in faelle)
    return text, [f["id"] for f in faelle]
