/* Inhalte des Atlas.
   Jede Zahl steht mit Jahr und Quelle da — damit du sie nachschlagen und
   selber prüfen kannst, statt sie zu glauben. Ölmengen in Millionen Barrel
   pro Tag (Mio b/d).

   Geografie ändert sich nicht, Handelsströme und Lagebilder schon. Die mit
   "Lage" markierten Absätze veralten deshalb am schnellsten. */

const STAND = "Stand der Lagehinweise: Anfang 2026";

const ENGEN = [
  {
    id: "hormuz",
    name: "Strasse von Hormuz",
    kurz: "Hormuz",
    region: "Persischer Golf",
    pos: [56.3, 26.6],
    zoom: [54.0, 24.3, 58.5, 28.2],
    breite: "ca. 33 km an der engsten Stelle",
    menge: "ca. 20 Mio b/d Öl (2023) — rund ein Fünftel des Weltverbrauchs",
    anrainer: "Iran (Nordufer) · Oman, Exklave Musandam (Südufer) · VAE",
    warum:
      "Der Persische Golf ist eine Sackgasse. Saudi-Arabien, Irak, Kuwait, " +
      "Katar und die VAE können ihr Öl und Gas per Schiff nur hier " +
      "hinausbringen. Es gibt keinen zweiten Ausgang. Deshalb ist Hormuz die " +
      "wichtigste Meerenge der Welt — nirgends hängt so viel Energie an so " +
      "wenig Wasser.",
    detail:
      "Die Fahrrinnen sind schmaler als die Meerenge selbst: je rund 3 km pro " +
      "Richtung, getrennt durch eine Pufferzone, und beide liegen in " +
      "omanischen Hoheitsgewässern nahe der Halbinsel Musandam. Schiffe " +
      "fahren also auf wenigen Kilometern Breite, in Sichtweite der " +
      "iranischen Küste gegenüber. Auch etwa ein Fünftel des weltweiten " +
      "Flüssiggases (LNG) läuft hier durch, praktisch alles davon aus Katar.",
    lage:
      "Iran droht seit Jahrzehnten mit einer Sperrung, hat sie aber nie " +
      "vollzogen — sie würde die eigenen Exporte und die des wichtigsten " +
      "Abnehmers China genauso treffen. Realistischer als eine Schliessung " +
      "sind Nadelstiche: Festsetzen einzelner Tanker, Minen, Drohnen, " +
      "Störung von GPS-Signalen. Schon die Drohung reicht, um " +
      "Versicherungsprämien und damit Ölpreise steigen zu lassen.",
    umweg:
      "Nur teilweise. Die saudische Ost-West-Pipeline (Petroline) bringt bis " +
      "zu 5 Mio b/d ans Rote Meer, die ADCOP-Pipeline der VAE rund 1,8 Mio " +
      "b/d nach Fudschaira ausserhalb des Golfs. Zusammen etwa ein Drittel " +
      "der Menge — für den Rest gäbe es keinen Weg.",
    quellen: [
      "U.S. Energy Information Administration (EIA), World Oil Transit Chokepoints",
      "EIA, The Strait of Hormuz is the world's most important oil transit chokepoint (2023)",
    ],
    orte: [
      { t: "IRAN", p: [55.0, 27.6], k: "land" },
      { t: "V.A.E.", p: [54.9, 24.6], k: "land" },
      // Das Südufer der Meerenge ist omanisch, gehört aber zur abgetrennten
      // Exklave Musandam — deshalb steht beides in einer Marke.
      { t: "OMAN · MUSANDAM", p: [56.15, 26.0], k: "land" },
      { t: "Persischer Golf", p: [54.2, 26.8], k: "wasser" },
      { t: "Golf von Oman", p: [58.2, 25.2], k: "wasser" },
      { t: "Bandar Abbas", p: [56.28, 27.18], k: "stadt" },
    ],
    routen: [
      {
        t: "Öl aus dem Golf nach Asien und Europa",
        f: "oel",
        p: [[53.6, 27.3], [55.0, 26.9], [56.1, 26.6], [56.9, 26.0], [57.9, 25.2]],
      },
    ],
  },

  {
    id: "babelmandeb",
    name: "Bab el-Mandeb",
    kurz: "Bab el-Mandeb",
    region: "Rotes Meer / Horn von Afrika",
    pos: [43.4, 12.6],
    zoom: [41.5, 10.8, 45.5, 14.4],
    breite: "ca. 29 km, geteilt durch die Insel Perim",
    menge: "ca. 8,8 Mio b/d Öl (2023), vor dem Einbruch ab Ende 2023",
    anrainer: "Jemen (Ostufer) · Dschibuti und Eritrea (Westufer)",
    warum:
      "Das Tor zum Roten Meer und damit die Südhälfte des Wegs Asien–Europa. " +
      "Wer hier nicht durchkommt, dem nützt auch der Suezkanal nichts: Bab " +
      "el-Mandeb und Suez sind dieselbe Route, nur an zwei Enden. Der Name " +
      "heisst übersetzt „Tor der Tränen\".",
    detail:
      "Die Insel Perim teilt die Enge in zwei Kanäle: einen schmalen von rund " +
      "3 km an der jemenitischen Seite und einen breiteren von etwa 26 km, " +
      "durch den der Verkehr läuft. Beide Ufer sind vom Jemen aus mit " +
      "Küstenraketen und Drohnen erreichbar — die Enge ist militärisch " +
      "leichter zu stören als jede andere auf dieser Karte.",
    lage:
      "Seit Ende 2023 greifen die jemenitischen Huthi Handelsschiffe an. " +
      "Grosse Reedereien meiden die Route seither weitgehend und fahren um " +
      "Afrika herum; der Verkehr durch Bab el-Mandeb und Suez brach um mehr " +
      "als die Hälfte ein. Das ist der bislang deutlichste Fall, in dem eine " +
      "nichtstaatliche Gruppe eine Welthandelsroute faktisch schliessen konnte.",
    umweg:
      "Ja, aber teuer: um das Kap der Guten Hoffnung. Für Asien–Europa sind " +
      "das grob 6000 km und je nach Route 10 bis 14 Tage mehr, plus " +
      "Treibstoff. Der Weg existiert also — er kostet nur Zeit, Schiffe und " +
      "Geld, und die fehlen dann anderswo.",
    quellen: [
      "EIA, World Oil Transit Chokepoints",
      "IMF PortWatch / UNCTAD, Kennzahlen zum Rückgang der Suez-Transits",
    ],
    orte: [
      { t: "JEMEN", p: [44.8, 13.6], k: "land" },
      { t: "DSCHIBUTI", p: [42.6, 11.5], k: "land" },
      { t: "ERITREA", p: [42.0, 13.6], k: "land" },
      { t: "Perim", p: [43.30, 12.42], k: "klein" },
      { t: "Rotes Meer", p: [42.4, 14.0], k: "wasser" },
      { t: "Golf von Aden", p: [45.0, 12.0], k: "wasser" },
    ],
    routen: [
      {
        t: "Asien – Europa (über Suez)",
        f: "handel",
        p: [[45.3, 12.3], [44.2, 12.5], [43.5, 12.75], [42.9, 13.4], [42.4, 14.1]],
      },
    ],
  },

  {
    id: "suez",
    name: "Suezkanal",
    kurz: "Suez",
    region: "Ägypten",
    pos: [32.45, 30.6],
    zoom: [31.2, 29.2, 34.0, 32.0],
    breite: "193 km lang, Fahrrinne teils nur ca. 200 m breit",
    menge: "rund 12 bis 15 Prozent des Welthandels in normalen Jahren",
    anrainer: "Ägypten, allein und vollständig",
    warum:
      "Die Abkürzung zwischen Europa und Asien. Ohne den Kanal muss jedes " +
      "Schiff um ganz Afrika. Anders als Panama hat Suez keine Schleusen — " +
      "Mittelmeer und Rotes Meer liegen praktisch auf gleicher Höhe, der " +
      "Kanal ist ein Graben durch die Wüste, kein Treppenhaus.",
    detail:
      "Weil die Fahrrinne so schmal ist, fährt man im Konvoi und nach Plan. " +
      "Genau das macht ihn verwundbar: Als die Ever Given im März 2021 quer " +
      "lag, stand ein grosser Teil des Welthandels sechs Tage still — ein " +
      "Schiff, kein Angriff, keine Absicht.",
    lage:
      "Die Kanalgebühren sind eine der wichtigsten Devisenquellen Ägyptens. " +
      "Der Verkehrseinbruch durch die Angriffe am Südende trifft deshalb den " +
      "ägyptischen Staatshaushalt unmittelbar — ein gutes Beispiel dafür, wie " +
      "ein Konflikt Staaten trifft, die gar nicht beteiligt sind.",
    umweg: "Kap der Guten Hoffnung — dieselbe Rechnung wie bei Bab el-Mandeb.",
    quellen: [
      "Suez Canal Authority, Verkehrsstatistik",
      "UNCTAD Review of Maritime Transport",
    ],
    orte: [
      { t: "ÄGYPTEN", p: [31.7, 30.3], k: "land" },
      { t: "SINAI", p: [33.4, 30.0], k: "land" },
      { t: "Port Said", p: [32.3, 31.26], k: "stadt" },
      { t: "Suez", p: [32.55, 29.97], k: "stadt" },
      { t: "Mittelmeer", p: [32.0, 31.8], k: "wasser" },
      { t: "Golf von Suez", p: [32.9, 29.4], k: "wasser" },
    ],
    routen: [
      {
        t: "Kanalpassage",
        f: "handel",
        p: [[32.32, 31.5], [32.35, 31.0], [32.4, 30.5], [32.55, 30.0], [32.8, 29.5]],
      },
    ],
  },

  {
    id: "malakka",
    name: "Strasse von Malakka",
    kurz: "Malakka",
    region: "Südostasien",
    pos: [101.5, 2.5],
    zoom: [98.0, -0.5, 105.5, 6.5],
    breite: "an der engsten Stelle (Phillips Channel) nur ca. 2,8 km",
    menge: "ca. 23,7 Mio b/d Öl (2023) — die grösste Menge aller Meerengen",
    anrainer: "Indonesien · Malaysia · Singapur",
    warum:
      "Der kürzeste Weg vom Indischen Ozean nach Ostasien. Praktisch das " +
      "gesamte Öl, das aus dem Golf nach China, Japan und Korea geht, fährt " +
      "hier durch. An der engsten Stelle ist die Passage schmaler als mancher " +
      "Fluss breit ist.",
    detail:
      "China nennt seine Abhängigkeit davon selbst das „Malakka-Dilemma\": " +
      "Ein Grossteil der eigenen Energieversorgung läuft durch eine Enge, die " +
      "man nicht kontrolliert und die eine fremde Marine im Ernstfall sperren " +
      "könnte. Pipelines durch Myanmar, die Bahnverbindungen nach Europa und " +
      "der Ausbau der Hochseeflotte sind alle auch Antworten auf diesen einen " +
      "Satz.",
    lage:
      "Militärisch ruhig, aber es ist die Enge, um die sich die " +
      "Marinestrategie im Indopazifik dreht. Überfälle auf Schiffe gibt es " +
      "hier weiterhin häufiger als anderswo.",
    umweg:
      "Ja: die Sundastrasse und die Lombokstrasse weiter südlich in " +
      "Indonesien. Beide sind tiefer und für grosse Schiffe besser geeignet, " +
      "aber ein deutlicher Umweg — für Fahrten aus dem Golf nach Ostasien " +
      "mehrere Tage.",
    quellen: ["EIA, World Oil Transit Chokepoints"],
    orte: [
      { t: "MALAYSIA", p: [102.3, 4.2], k: "land" },
      { t: "SUMATRA · INDONESIEN", p: [100.5, 0.2], k: "land" },
      { t: "Singapur", p: [103.85, 1.29], k: "stadt" },
      { t: "Andamanensee", p: [98.6, 5.6], k: "wasser" },
      { t: "Südchinesisches Meer", p: [104.6, 4.2], k: "wasser" },
    ],
    routen: [
      {
        t: "Golföl nach Ostasien",
        f: "oel",
        p: [[98.6, 5.2], [100.0, 3.6], [101.6, 2.2], [103.2, 1.2], [104.6, 1.9]],
      },
    ],
  },

  {
    id: "taiwan",
    name: "Taiwanstrasse",
    kurz: "Taiwan",
    region: "Ostasien",
    pos: [119.5, 24.4],
    zoom: [116.0, 21.5, 123.5, 27.0],
    breite: "ca. 130 km an der engsten Stelle",
    menge: "ein sehr grosser Teil des weltweiten Containerverkehrs",
    anrainer: "Volksrepublik China (Westufer) · Taiwan (Ostufer)",
    warum:
      "Hier fällt Geografie mit Weltwirtschaft zusammen. Durch die Strasse " +
      "läuft ein Grossteil des Schiffsverkehrs nach Nordostasien — und auf " +
      "der Insel dahinter steht die Halbleiterfertigung, von der praktisch " +
      "die gesamte Elektronikindustrie abhängt. Eine Blockade wäre kein " +
      "regionales Ereignis.",
    detail:
      "Die Strasse ist breit genug, dass sie kein Nadelöhr im seemännischen " +
      "Sinn ist — das Problem ist nicht die Breite, sondern wer sie " +
      "kontrolliert. China betrachtet sie nicht als internationales Gewässer, " +
      "die USA und andere fahren regelmässig hindurch, um genau das zu " +
      "bestreiten. Die „Mittellinie\" ist eine informelle Grenze ohne Vertrag, " +
      "die faktisch nicht mehr eingehalten wird.",
    lage:
      "Dauerhaft angespannt, mit regelmässigen Manövern und Flügen über die " +
      "Mittellinie. Hier gilt besonders: prüfe das Datum jeder Aussage, die " +
      "du dazu hörst.",
    umweg:
      "Ja — östlich um Taiwan herum durch die Philippinensee. Kostet Zeit, " +
      "aber es ist offene See. Anders als bei Hormuz gibt es keine " +
      "geografische Sackgasse.",
    quellen: [
      "Handelsstatistiken zum Containerverkehr durch die Strasse",
      "Zu Halbleitern: Marktanteilsberichte der Auftragsfertiger",
    ],
    orte: [
      { t: "CHINA", p: [117.3, 25.6], k: "land" },
      { t: "TAIWAN", p: [121.0, 23.7], k: "land" },
      { t: "Taipeh", p: [121.5, 25.05], k: "stadt" },
      { t: "Xiamen", p: [118.1, 24.48], k: "stadt" },
      { t: "Ostchinesisches Meer", p: [122.3, 26.4], k: "wasser" },
    ],
    routen: [
      {
        t: "Containerverkehr nach Nordostasien",
        f: "handel",
        p: [[117.6, 22.0], [118.6, 23.3], [119.7, 24.6], [121.0, 26.0], [122.0, 26.7]],
      },
    ],
  },

  {
    id: "bosporus",
    name: "Bosporus und Dardanellen",
    kurz: "Bosporus",
    region: "Türkei / Schwarzes Meer",
    pos: [29.05, 41.1],
    zoom: [25.5, 39.5, 31.5, 42.5],
    breite: "Bosporus 31 km lang, an der engsten Stelle rund 700 m",
    menge: "ca. 3 Mio b/d Öl, dazu ein Grossteil der Getreideexporte der Region",
    anrainer: "Türkei, auf beiden Seiten",
    warum:
      "Der einzige Ausgang des Schwarzen Meeres. Russland, die Ukraine, " +
      "Georgien, Bulgarien und Rumänien hängen alle an dieser einen " +
      "Wasserstrasse — und sie führt mitten durch eine Stadt mit 16 " +
      "Millionen Einwohnern.",
    detail:
      "Den Verkehr regelt die Konvention von Montreux (1936): Handelsschiffe " +
      "dürfen im Frieden frei passieren, für Kriegsschiffe nicht-anrainender " +
      "Staaten gelten Obergrenzen bei Tonnage und Aufenthaltsdauer, und die " +
      "Türkei darf die Meerengen im Kriegsfall für Kriegsschiffe sperren. " +
      "Genau das tat sie 2022 — weshalb weder Russland noch die NATO ihre " +
      "Kräfte im Schwarzen Meer verstärken konnten. Ein alter Vertrag als " +
      "aktiver Faktor.",
    lage:
      "Die Getreideausfuhr der Ukraine läuft über diese Route; ihre " +
      "Sicherheit war und ist wiederholt Verhandlungsgegenstand. " +
      "Nahrungsmittelpreise in Nordafrika hängen daran direkt.",
    umweg:
      "Keiner. Das Schwarze Meer hat genau einen Ausgang. Alles andere müsste " +
      "über Land — Bahn, Strasse, Donau — und das ist ein Bruchteil der " +
      "Kapazität.",
    quellen: [
      "Konvention von Montreux (1936), Vertragstext",
      "EIA, World Oil Transit Chokepoints",
    ],
    orte: [
      { t: "TÜRKEI", p: [29.8, 40.0], k: "land" },
      { t: "GRIECHENLAND", p: [25.9, 41.2], k: "land" },
      { t: "Istanbul", p: [28.98, 41.02], k: "stadt" },
      { t: "Schwarzes Meer", p: [29.8, 42.1], k: "wasser" },
      { t: "Marmarameer", p: [28.1, 40.65], k: "wasser" },
      { t: "Ägäis", p: [25.9, 39.7], k: "wasser" },
    ],
    routen: [
      {
        t: "Getreide und Öl aus dem Schwarzen Meer",
        f: "handel",
        p: [[30.2, 42.2], [29.3, 41.5], [29.0, 41.05], [28.0, 40.7], [26.3, 40.1], [25.8, 39.7]],
      },
    ],
  },

  {
    id: "panama",
    name: "Panamakanal",
    kurz: "Panama",
    region: "Mittelamerika",
    pos: [-79.7, 9.15],
    zoom: [-81.3, 7.9, -78.2, 10.4],
    breite: "82 km lang, mit Schleusen",
    menge: "rund 5 Prozent des weltweiten Seehandels",
    anrainer: "Panama (seit 1999 in vollständiger eigener Verwaltung)",
    warum:
      "Verbindet Atlantik und Pazifik und spart den Weg um Südamerika. " +
      "Wichtig vor allem für Verkehr zwischen der US-Ostküste und Asien sowie " +
      "für südamerikanische Exporte.",
    detail:
      "Anders als Suez arbeitet Panama mit Schleusen: Schiffe werden 26 m " +
      "hoch in den Gatúnsee gehoben und auf der anderen Seite wieder " +
      "gesenkt. Jede Passage verbraucht dabei Süsswasser aus dem See. Das " +
      "macht den Kanal abhängig vom Regen — eine Dürre senkt unmittelbar die " +
      "Zahl der täglich möglichen Durchfahrten. In den Dürrejahren 2023/24 " +
      "sank sie zeitweise um rund ein Drittel.",
    lage:
      "Der begrenzende Faktor ist hier nicht Militär, sondern Wasser — und " +
      "damit das Klima. Ein Beispiel dafür, dass nicht jede Handelsstörung " +
      "einen Gegner hat.",
    umweg:
      "Um Kap Hoorn beziehungsweise durch die Magellanstrasse. Sehr weit und " +
      "in diesen Breiten unangenehm; für viele Routen nimmt man stattdessen " +
      "lieber Suez oder die Bahn quer durch die USA.",
    quellen: [
      "Autoridad del Canal de Panamá (ACP), Transitstatistik",
      "Berichte zu den Durchfahrtsbeschränkungen 2023/24",
    ],
    orte: [
      { t: "PANAMA", p: [-80.2, 8.8], k: "land" },
      { t: "Colón", p: [-79.9, 9.36], k: "stadt" },
      { t: "Panama-Stadt", p: [-79.52, 8.98], k: "stadt" },
      { t: "Karibik", p: [-79.9, 9.75], k: "wasser" },
      { t: "Pazifik", p: [-79.3, 8.5], k: "wasser" },
    ],
    routen: [
      {
        t: "Kanalpassage",
        f: "handel",
        p: [[-79.92, 9.6], [-79.88, 9.35], [-79.75, 9.15], [-79.6, 9.0], [-79.45, 8.75]],
      },
    ],
  },

  {
    id: "gibraltar",
    name: "Strasse von Gibraltar",
    kurz: "Gibraltar",
    region: "Westliches Mittelmeer",
    pos: [-5.6, 35.95],
    zoom: [-6.6, 35.3, -4.5, 36.6],
    breite: "ca. 14 km an der engsten Stelle",
    menge: "der gesamte Schiffsverkehr zwischen Mittelmeer und Atlantik",
    anrainer: "Spanien und das britische Gibraltar (Nordufer) · Marokko (Südufer)",
    warum:
      "Der einzige natürliche Zugang zum Mittelmeer. Zusammen mit Suez macht " +
      "er das Mittelmeer überhaupt erst zur Durchfahrtsroute statt zur " +
      "Sackgasse — und Europa und Afrika liegen hier nur eine Sichtweite " +
      "auseinander.",
    detail:
      "Militärisch ist die Enge seit Jahrhunderten der Grund, warum Gibraltar " +
      "britisch ist. Wer den Felsen hält, sieht jedes Schiff, das ins " +
      "Mittelmeer fährt. Unter Wasser gibt es eine Besonderheit: salzreiches " +
      "Mittelmeerwasser fliesst unten hinaus, atlantisches Wasser oben " +
      "hinein — U-Boote können sich in diesen Strömungen treiben lassen und " +
      "werden dabei schlechter geortet.",
    lage: "Ruhig. Relevant vor allem für Marinebewegungen und Migration.",
    umweg: "Keiner. Ohne Gibraltar erreicht kein Schiff das Mittelmeer.",
    quellen: [
      "Standardwerke zur Seefahrtsgeografie",
      "IMO, Verkehrstrennungsgebiete",
    ],
    orte: [
      { t: "SPANIEN", p: [-5.6, 36.4], k: "land" },
      { t: "MAROKKO", p: [-5.4, 35.5], k: "land" },
      { t: "Gibraltar", p: [-5.35, 36.14], k: "stadt" },
      { t: "Tanger", p: [-5.8, 35.78], k: "stadt" },
      { t: "Atlantik", p: [-6.3, 35.85], k: "wasser" },
      { t: "Mittelmeer", p: [-4.8, 36.0], k: "wasser" },
    ],
    routen: [
      {
        t: "Atlantik – Mittelmeer",
        f: "handel",
        p: [[-6.35, 35.92], [-5.9, 35.94], [-5.5, 36.0], [-4.8, 36.05]],
      },
    ],
  },

  {
    id: "daenemark",
    name: "Dänische Meerengen",
    kurz: "Dän. Meerengen",
    region: "Ostsee",
    pos: [11.5, 56.2],
    zoom: [9.0, 54.3, 14.0, 58.0],
    breite: "Öresund an der engsten Stelle ca. 4 km",
    menge: "ca. 3 Mio b/d Öl, überwiegend russische Exporte",
    anrainer: "Dänemark · Schweden",
    warum:
      "Der Ausgang der Ostsee. Russlands Ostseehäfen bei St. Petersburg und " +
      "Primorsk verschiffen ihr Öl hier hindurch — und der Weg führt zwischen " +
      "zwei NATO-Staaten hindurch, dicht an deren Küsten.",
    detail:
      "Es sind drei Passagen: Grosser Belt (der Hauptweg für grosse Schiffe), " +
      "Kleiner Belt und Öresund. Die Durchfahrt ist völkerrechtlich frei, was " +
      "die Handlungsmöglichkeiten der Anrainer begrenzt: Man darf beobachten, " +
      "aber nicht einfach anhalten.",
    lage:
      "Hier fährt ein grosser Teil der sogenannten Schattenflotte — alte " +
      "Tanker mit unklarer Versicherung und wechselnden Eigentümern, die " +
      "Preisobergrenzen umgehen sollen. Die Anrainer kontrollieren verstärkt; " +
      "parallel gab es wiederholt Schäden an Kabeln und Leitungen am " +
      "Ostseegrund.",
    umweg:
      "Keiner zur See. Die Ostsee ist wie das Schwarze Meer ein Binnenmeer " +
      "mit einem Ausgang.",
    quellen: [
      "EIA, World Oil Transit Chokepoints",
      "Berichte dänischer und schwedischer Behörden zum Tankerverkehr",
    ],
    orte: [
      { t: "DÄNEMARK", p: [9.6, 56.3], k: "land" },
      { t: "SCHWEDEN", p: [13.4, 57.0], k: "land" },
      { t: "DEUTSCHLAND", p: [10.3, 54.5], k: "land" },
      { t: "Kopenhagen", p: [12.57, 55.68], k: "stadt" },
      { t: "Kattegat", p: [11.6, 57.0], k: "wasser" },
      { t: "Ostsee", p: [12.8, 54.8], k: "wasser" },
    ],
    routen: [
      {
        t: "Russisches Öl aus der Ostsee",
        f: "oel",
        p: [[13.6, 55.0], [12.8, 55.5], [11.9, 56.3], [11.2, 57.2], [10.4, 57.6]],
      },
    ],
  },
];

/* Farben der Ströme. Bewusst nur zwei — mehr Kategorien braucht die Karte
   nicht, und jede weitere Farbe kostet Lesbarkeit. Beide sind gegen den
   dunklen Untergrund geprüft (Kontrast und Farbfehlsichtigkeit). */
const ROUTEN_FARBEN = {
  oel: { c: "#d95926", t: "Öl und Gas" },
  handel: { c: "#3987e5", t: "Container und Stückgut" },
};

/* Für die Übersicht: grosse Wasserflächen benennen, damit man sich
   zurechtfindet, statt nur Küstenlinien zu sehen. */
const MEERE = [
  { t: "ATLANTIK", p: [-40, 25], s: 1 },
  { t: "PAZIFIK", p: [-150, 10], s: 1 },
  { t: "PAZIFIK", p: [160, -10], s: 1 },
  { t: "INDISCHER OZEAN", p: [78, -20], s: 1 },
  { t: "Mittelmeer", p: [17, 35], s: 0 },
  { t: "Rotes Meer", p: [38, 20], s: 0 },
  { t: "Schwarzes Meer", p: [34, 43], s: 0 },
  { t: "Ostsee", p: [19, 58], s: 0 },
  { t: "Südchin. Meer", p: [114, 14], s: 0 },
  { t: "Karibik", p: [-75, 15], s: 0 },
];
