#!/usr/bin/env python3
"""Deal Score 0–100 mit vollständiger Aufschlüsselung.

WAS DER SCORE IST UND WAS NICHT
-------------------------------
Er ist eine **Sortierhilfe**, keine Bewertung von Werten. Die Gewichte sind
gesetzt, nicht gemessen — es gibt keine Datengrundlage, aus der sich
ableiten liesse, dass „älter als fünf Jahre" genau 20 Punkte wert ist.
Ein Fall mit 80 Punkten ist deshalb nicht „besser" als einer mit 70,
sondern nur weiter oben in der Liste.

Was ein Konkursfall tatsächlich hergibt, steht im Inventar des Konkursamts
und nirgendwo sonst. Der Score sagt nur, wo sich das Nachfragen eher lohnt.

Deshalb liefert jede Bewertung ihre Zeilen einzeln mit — Punkte, Grund und
woher das Signal stammt. Eine Zahl ohne Herleitung wäre hier wertlos.
"""

# Ab hier lohnt das Nachfragen beim Konkursamt.
#
# WARUM 50 UND NICHT 60 — das war ein Fehler, und zwar ein grober
# ---------------------------------------------------------------
# Die 60 stammen aus der ursprünglichen Spezifikation. Dort sollten bis zu
# **45 Punkte** aus der Firmenwebsite kommen (Fahrzeuge sichtbar +15,
# eigener Standort +10, Flotte +10, mehr als zehn Mitarbeitende +10). Diese
# Anreicherung ist bewusst nicht gebaut worden — bei einer Konkursitin ist
# die Website meist schon abgeschaltet, gerade dann, wenn man sie bräuchte.
#
# Die Anreicherung fiel weg, die Schwelle blieb. Damit war sie aus
# amtlichen Daten allein nicht mehr erreichbar:
#
#     +30  Branche erkannt (das stärkste Signal, mehr gibt es nicht)
#     +20  älter als fünf Jahre
#     +5   Konkurs eröffnet
#     ---
#      55  eine zwanzigjährige Garage am Tag der Konkurseröffnung
#
# Der erste echte Lauf hat es bewiesen: 40 Fälle mit Zweckartikel, **kein
# einziger** über 60. Nicht weil nichts dabei war, sondern weil der beste
# vorstellbare Fall im häufigsten Verfahrensstadium 55 erreicht.
#
# 50 ist so gewählt, dass „Branche erkannt UND älter als fünf Jahre"
# durchkommt — genau die Kombination, bei der ein Anruf beim Konkursamt
# sich lohnt. Die Gewichte bleiben unverändert; verschoben wird nur die
# Linie, die ohne die gestrichene Anreicherung nie gestimmt hat.
SCHWELLE = 50

# Signale, die NICHT aus amtlichen Daten stammen, sondern aus Anreicherung.
# Sie werden getrennt gezählt, damit sichtbar bleibt, wie viel der Score
# auf verlässlicher Grundlage steht.
ANGEREICHERT = {"website_assets", "mitarbeitende", "standort", "flotte"}


def bewerten(fall, klass, anreicherung=None):
    """Score und Begründung für einen Fall.

    `klass` kommt aus klassierung.klassieren().
    `anreicherung` ist optional und enthält, was über die amtliche Meldung
    hinaus bekannt ist — fehlt es, wird der Score ohne diese Punkte
    gebildet und das Ergebnis als solches gekennzeichnet.
    """
    a = anreicherung or {}
    zeilen = []

    def zeile(punkte, grund, quelle):
        zeilen.append({"punkte": punkte, "grund": grund, "quelle": quelle})

    # --- Branche: das stärkste Signal, und es steht im Handelsregister ---
    if klass["branchen"]:
        b = klass["branchen"][0]
        zeile(b["punkte"], "Branche: " + b["name"] +
              " (Zweck nennt: " + ", ".join(b["wegen"]) + ")",
              "Handelsregister")
        # Eine zweite einschlägige Branche zeigt Breite, zählt aber gedämpft.
        for n in klass["branchen"][1:2]:
            if n["punkte"] >= 25:
                zeile(5, "Zusätzlich " + n["name"], "Handelsregister")
    else:
        zeile(0, "Branche aus dem Zweck nicht erkennbar", "Handelsregister")

    # --- Firmenalter ---
    alter = fall.get("alter")
    if alter is None:
        zeile(0, "Gründungsdatum unbekannt — kein Alterspunkt",
              "fehlende Angabe")
    elif alter > 5:
        zeile(20, "Besteht seit %d Jahren" % alter, "Handelsregister")
    else:
        zeile(0, "Erst %d Jahre alt — wenig angesammeltes Inventar" % alter,
              "Handelsregister")

    # --- Wörtlich genannte Gegenstände ---
    if klass["assets_genannt"]:
        zeile(10, "Gegenstände im Text genannt: " +
              ", ".join(klass["assets_genannt"][:3]), "Meldungstext")

    # --- Meldungsart: sagt etwas über den Zeitpunkt im Verfahren ---
    art = fall.get("art")
    if art == "steigerung":
        zeile(15, "Steigerung oder Verwertung angekündigt — Verwertung läuft",
              "Meldungsart")
    elif art == "kollokationsplan":
        zeile(10, "Kollokationsplan und Inventar aufgelegt — Masse ist erfasst",
              "Meldungsart")
    elif art == "konkurseroeffnung":
        zeile(5, "Konkurs eröffnet — Verwertung steht noch bevor",
              "Meldungsart")
    elif art == "konkurs_einstellung":
        zeile(-15, "Mangels Aktiven eingestellt — meist keine verwertbare Masse",
              "Meldungsart")
    elif art == "konkurs_widerruf":
        zeile(-40, "Konkurs widerrufen — keine Masse zu verwerten",
              "Meldungsart")

    # --- Abzüge aus dem Zweck ---
    for ab in klass["abzuege"]:
        zeile(ab["punkte"], ab["name"] + " (Zweck nennt: " +
              ", ".join(ab["wegen"]) + ")", "Handelsregister")

    # --- Angereicherte Signale, falls vorhanden ---
    if a.get("website_assets"):
        zeile(15, "Öffentlich sichtbare Fahrzeuge oder Maschinen",
              "Anreicherung")
    if a.get("standort"):
        zeile(10, "Eigener Lager-, Werkstatt- oder Produktionsstandort",
              "Anreicherung")
    if a.get("flotte"):
        zeile(10, "Fahrzeugflotte erkennbar", "Anreicherung")
    if a.get("mitarbeitende") and a["mitarbeitende"] > 10:
        zeile(10, "Mehr als zehn Mitarbeitende (%d)" % a["mitarbeitende"],
              "Anreicherung")

    roh = sum(z["punkte"] for z in zeilen)
    score = max(0, min(100, roh))

    amtlich = sum(z["punkte"] for z in zeilen if z["quelle"] != "Anreicherung")
    return {
        "score": score,
        "roh": roh,
        "zeilen": zeilen,
        "nur_amtlich": max(0, min(100, amtlich)),
        "hat_anreicherung": any(z["quelle"] == "Anreicherung" for z in zeilen),
        "ueber_schwelle": score >= SCHWELLE,
    }


def begruendung_text(bew):
    """Einzeiler für Tabelle und Benachrichtigung."""
    teile = []
    for z in bew["zeilen"]:
        if z["punkte"]:
            teile.append("%+d %s" % (z["punkte"], z["grund"]))
    return " · ".join(teile) or "keine Signale"


def einschraenkungen(fall, klass):
    """Was einem Kauf im Weg stehen kann. Gehört an jeden Fall.

    Das sind keine Vermutungen über diesen Einzelfall, sondern Dinge, die
    bei Konkursverwertungen regelmässig zutreffen und die man vor einem
    Gebot geklärt haben muss.
    """
    raus = [
        "Leasing, Miete und Eigentumsvorbehalt Dritter sind möglich — "
        "nicht alles auf dem Areal gehört zur Masse.",
        "Vermutete Gegenstände sind aus dem Zweckartikel abgeleitet, nicht "
        "bestätigt. Verbindlich ist allein das Inventar des Konkursamts.",
    ]
    if fall.get("art") == "kollokationsplan":
        raus.append(
            "Eine Meldung über Kollokationsplan und Inventar enthält in der "
            "Regel NICHT die Inventarliste selbst. Die Auflagefrist ist eine "
            "Anfechtungsfrist, keine Gebots- oder Verkaufsfrist.")
    if fall.get("art") == "konkurs_einstellung":
        raus.append(
            "Bei Einstellung mangels Aktiven ist meist nichts Verwertbares "
            "vorhanden.")
    return raus


def naechster_schritt(fall):
    """Die empfohlene Handlung — ausschliesslich Richtung Konkursamt.

    Nach der Konkurseröffnung gehören die Gegenstände zur Masse. Wer die
    früheren Inhaber wegen eines Kaufs anspricht, verhandelt mit jemandem,
    der nicht mehr verfügen darf. Diese Software kennt deshalb keinen
    Inhaberkontakt — das Feld existiert gar nicht.
    """
    amt = fall.get("konkursamt") or "zuständiges Konkursamt"
    if fall.get("art") == "steigerung":
        return ("Steigerungsbedingungen und Inventar beim %s anfordern, "
                "Besichtigungstermin erfragen." % amt)
    if fall.get("art") == "kollokationsplan":
        return ("Beim %s nach dem Inventar und nach geplanter Verwertung "
                "fragen — die Meldung selbst enthält die Liste nicht." % amt)
    return ("Beim %s melden und nach Inventar sowie geplanter Verwertung "
            "fragen." % amt)
