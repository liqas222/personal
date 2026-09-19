#!/usr/bin/env python3
"""Schnittstelle, die jeder Quellen-Adapter erfüllt.

Ein Adapter liefert ROHE Datensätze als dicts. Er normalisiert nicht, er
bewertet nicht, er entscheidet nicht über Relevanz — das macht die
Verarbeitungskette danach. So lässt sich eine neue Quelle anschliessen,
ohne die Bewertung anzufassen.

Feldnamen, die die Verarbeitung versteht (alle optional ausser `firma`):

    firma, uid, ort, kanton, publikationsdatum, konkursdatum, art,
    zweck, gruendung, konkursamt, aktenzeichen, quelle_url, text

Jeder Adapter setzt ausserdem `quelle` auf einen sprechenden Namen.
"""


class Quelle:
    """Basisklasse. `name` erscheint im Laufprotokoll und in der Oberfläche."""

    name = "unbenannt"
    braucht_zugang = False      # True -> Oberfläche kennzeichnet den Adapter
    zugang_hinweis = ""

    def verfuegbar(self):
        """Kann der Adapter jetzt laufen? Sonst Grund als Text."""
        return True, ""

    def holen(self, seit=None):
        """Rohe Datensätze liefern.

        `seit` ist ein ISO-Datum des letzten erfolgreichen Laufs oder None.
        Adapter, die filtern können, sollen es tun; die anderen liefern
        alles, die Duplikaterkennung fängt den Rest ab.
        """
        raise NotImplementedError
