/* Handelszahlen der WTO — ERZEUGT, nicht von Hand pflegen.

   Quelle: WTO, Trade Profiles 2023 (ISBN 978-92-870-7449-4).
   Bezugsjahr steht je Land in pJahr/wJahr — es ist NICHT überall
   gleich (Japan 2022, Saudi-Arabien 2021).
   Erzeugt von tools/wto_lesen.py aus trade_profiles23_e.pdf.
   Das Feld `seite` nennt die gedruckte Seite zum Nachschlagen.

   Felder je Volkswirtschaft:
     bip    Bruttoinlandsprodukt, Mio. US$
     aus    Warenausfuhr, Mio. US$ (f.o.b.)
     ein    Wareneinfuhr, Mio. US$ (c.i.f.)
     wAus   Ausfuhr nach Warengruppe, Prozent
     wEin   Einfuhr nach Warengruppe, Prozent
     pAus   Zielländer mit Anteil an der Ausfuhr, Prozent
     pEin   Herkunftsländer mit Anteil an der Einfuhr, Prozent
     waren  fünf grösste Waren je Richtung, Mio. US$
     restAus/restEin  Anteil, den die WTO nicht aufschlüsselt.
            Nicht weglassen: bei Saudi-Arabien sind das 80.2 % der
            Ausfuhr, und ohne diese Angabe liest sich der grösste
            genannte Abnehmer (5.1 %) als Hauptabnehmer.

   ZUR EINORDNUNG: Die EU zählt als EIN Partner. Anteile beziehen
   sich auf den Warenhandel, nicht auf Dienstleistungen, und
   summieren sich mit 'Other' auf 100. */
const WTO = {
"Afghanistan": {
"aus": 992.0,
"bip": 20136.0,
"bipJahr": 2020,
"ein": 5762.0,
"name": "Afghanistan",
"pAus": [
{
"l": "India",
"p": 47.1
},
{
"l": "Pakistan",
"p": 34.3
},
{
"l": "China",
"p": 3.6
},
{
"l": "Turkey",
"p": 2.9
},
{
"l": "United Arab Emirates",
"p": 2.9
}
],
"pEin": [
{
"l": "Iran",
"p": 14.6
},
{
"l": "China",
"p": 13.9
},
{
"l": "Pakistan",
"p": 12.9
},
{
"l": "United States of America",
"p": 9.1
},
{
"l": "Turkmenistan",
"p": 8.1
}
],
"pJahr": 2019,
"restAus": 9.3,
"restEin": 41.5,
"seite": 6,
"wAus": {
"agrar": 70.7,
"energie": 15.3,
"industrie": 13.8,
"sonst": 0.1
},
"wEin": {
"agrar": 41.1,
"energie": 11.4,
"industrie": 47.0,
"sonst": 0.5
},
"wJahr": 2021,
"waren": [
{
"hs": "HS0806",
"t": "Grapes, fresh or dried   130 HS1101 Wheat or meslin flour",
"v": 565.0
},
{
"hs": "HS1302",
"t": "Vegetable saps and extracts   115 HS1518 Animal or vegetable fats and oils",
"v": 384.0
},
{
"hs": "HS0802",
"t": "Other nuts, fresh or dried   101 HS1701 Cane or beet sugar",
"v": 215.0
},
{
"hs": "HS0804",
"t": "Dates, figs, pineapples, avocados   86 HS0902 Tea",
"v": 123.0
},
{
"hs": "HS0703",
"t": "Onions, shallots, garlic, leeks   36 HS1001 Wheat and meslin",
"v": 98.0
},
{
"hs": "HS2701",
"t": "Coal; briquettes, ovoids   70 HS2703 Peat (including peat litter)",
"v": 799.0
},
{
"hs": "HS5701",
"t": "Textile floor covering, knotted   25 HS2710 Petroleum oils, other than crude",
"v": 791.0
},
{
"hs": "HS2526",
"t": "Natural steatite   19 HS6801 Setts, curbstones and flagstones",
"v": 364.0
},
{
"hs": "HS7806",
"t": "Other articles of lead   7 HS5309 Woven fabrics of flax",
"v": 355.0
},
{
"hs": "HS5204",
"t": "Cotton sewing thread   4 HS9028 Gas, liquid or electricity supply",
"v": 241.0
}
]
},
"Albania": {
"aus": 4309.0,
"bip": 18509.0,
"bipJahr": 2022,
"ein": 8399.0,
"name": "Albania",
"pAus": [
{
"l": "European Union",
"p": 72.6
},
{
"l": "Serbia",
"p": 10.2
},
{
"l": "Montenegro",
"p": 7.9
},
{
"l": "Macedonia",
"p": 5.5
},
{
"l": "Turkey",
"p": 1.7
}
],
"pEin": [
{
"l": "European Union",
"p": 57.4
},
{
"l": "Turkey",
"p": 12.0
},
{
"l": "Serbia",
"p": 6.3
},
{
"l": "China",
"p": 4.2
},
{
"l": "Macedonia",
"p": 2.8
}
],
"pJahr": 2022,
"restAus": 2.1,
"restEin": 17.3,
"seite": 8,
"wAus": {
"agrar": 12.6,
"energie": 21.1,
"industrie": 66.2,
"sonst": 0.2
},
"wEin": {
"agrar": 16.9,
"energie": 16.2,
"industrie": 66.6,
"sonst": 0.3
},
"wJahr": 2021,
"waren": [
{
"hs": "HS0707",
"t": "Cucumbers and gherkins,   9 HS2208 Alcohol of less than 80% volume",
"v": 12.0
},
{
"hs": "HS1211",
"t": "Plants and parts of plants   8 HS1209 Seeds, fruit and spores for sowing",
"v": 3.0
},
{
"hs": "HS0709",
"t": "Other vegetables, fresh or chilled   7 HS1905 Bread, pastry,  other bakers' wares",
"v": 3.0
},
{
"hs": "HS0702",
"t": "Tomatoes, fresh or chilled   4 HS2106 Other food preparations",
"v": 3.0
},
{
"hs": "HS0704",
"t": "Cabbages, cauliflowers, kohlrabi   4 HS0207 Meat and edible offal of poultry",
"v": 3.0
},
{
"hs": "HS7202",
"t": "Ferro-alloys   210 HS3004 Medicaments in measured doses",
"v": 51.0
},
{
"hs": "HS6403",
"t": "Footwear, uppers of leather   31 HS8703 Motor cars for transport of persons",
"v": 39.0
},
{
"hs": "HS6205",
"t": "Men's or boys' shirts   12 HS0306 Crustaceans whether in shell or not",
"v": 33.0
},
{
"hs": "HS2716",
"t": "Electrical energy   8 HS2710 Petroleum oils, other than crude",
"v": 22.0
},
{
"hs": "HS7314",
"t": "Cloth, netting, of iron/steel wire   8 HS8708 Parts for motor vehicles 8701-8075",
"v": 20.0
}
]
},
"Algeria": {
"aus": 60924.0,
"bip": 195415.0,
"bipJahr": 2022,
"ein": 39027.0,
"name": "Algeria",
"pAus": [
{
"l": "European Union",
"p": 53.3
},
{
"l": "United States of America",
"p": 9.9
},
{
"l": "Brazil",
"p": 6.0
},
{
"l": "Turkey",
"p": 5.2
},
{
"l": "United Kingdom",
"p": 4.6
}
],
"pEin": [
{
"l": "European Union",
"p": 42.8
},
{
"l": "China",
"p": 18.1
},
{
"l": "Turkey",
"p": 4.4
},
{
"l": "United States of America",
"p": 4.0
},
{
"l": "South Korea",
"p": 3.7
}
],
"pJahr": 2017,
"restAus": 21.0,
"restEin": 27.1,
"seite": 10,
"wAus": {
"agrar": 1.3,
"energie": 88.7,
"industrie": 10.0,
"sonst": 0.1
},
"wEin": {
"agrar": 27.4,
"energie": 5.9,
"industrie": 62.1,
"sonst": 4.6
},
"wJahr": 2021,
"waren": [
{
"hs": "HS1701",
"t": "Cane or beet sugar   225 HS1001 Wheat and meslin",
"v": 1789.0
},
{
"hs": "HS0804",
"t": "Dates, figs, pineapples, avocados   52 HS0402 Milk and cream, concentrated",
"v": 1239.0
},
{
"hs": "HS2202",
"t": "Waters containing added sugar   13 HS1701 Cane or beet sugar",
"v": 988.0
},
{
"hs": "HS1804",
"t": "Cocoa butter, fat and oil   9 HS1005 Maize (corn)",
"v": 776.0
},
{
"hs": "HS1507",
"t": "Soya-bean oil and its fractions   8 HS1507 Soya-bean oil and its fractions",
"v": 601.0
},
{
"hs": "HS2711",
"t": "Petroleum gases  14 074 HS8703 Motor cars for transport of persons",
"v": 1674.0
},
{
"hs": "HS2709",
"t": "Petroleum oils, crude  12 719 HS2710 Petroleum oils, other than crude",
"v": 1604.0
},
{
"hs": "HS2710",
"t": "Petroleum oils, other than crude  6 451 HS3004 Medicaments in measured doses",
"v": 1169.0
},
{
"hs": "HS2707",
"t": "Coal tars   561 HS7304 Tubes, pipes, of iron or steel",
"v": 999.0
},
{
"hs": "HS2814",
"t": "Ammonia   342 HS7308 Structures of iron and steel",
"v": 934.0
}
]
},
"Angola": {
"aus": 51275.0,
"bip": 121417.0,
"bipJahr": 2022,
"ein": 17803.0,
"name": "Angola",
"pAus": [
{
"l": "China",
"p": 42.7
},
{
"l": "European Union",
"p": 24.3
},
{
"l": "India",
"p": 10.0
},
{
"l": "United Arab Emirates",
"p": 3.2
},
{
"l": "United Kingdom",
"p": 2.8
}
],
"pEin": [
{
"l": "European Union",
"p": 31.7
},
{
"l": "China",
"p": 16.0
},
{
"l": "South Korea",
"p": 9.2
},
{
"l": "India",
"p": 6.1
},
{
"l": "United States of America",
"p": 4.7
}
],
"pJahr": 2022,
"restAus": 16.9,
"restEin": 32.3,
"seite": 12,
"wAus": {
"agrar": 0.3,
"energie": 98.9,
"industrie": 0.8,
"sonst": 0.0
},
"wEin": {
"agrar": 18.7,
"energie": 16.1,
"industrie": 61.4,
"sonst": 3.7
},
"wJahr": 2021,
"waren": [
{
"hs": "HS2302",
"t": "Bran, sharps and other residues   15 HS0207 Meat and edible offal of poultry",
"v": 416.0
},
{
"hs": "HS2208",
"t": "Alcohol of less than 80% volume   11 HS1001 Wheat and meslin",
"v": 386.0
},
{
"hs": "HS0803",
"t": "Bananas, including plantains   6 HS1006 Rice",
"v": 370.0
},
{
"hs": "HS2203",
"t": "Beer made from malt   6 HS1511 Palm oil and its fractions",
"v": 336.0
},
{
"hs": "HS1101",
"t": "Wheat or meslin flour   6 HS1507 Soya-bean oil and its fractions",
"v": 237.0
},
{
"hs": "HS2709",
"t": "Petroleum oils, crude  40 311 HS2710 Petroleum oils, other than crude",
"v": 3911.0
},
{
"hs": "HS2711",
"t": "Petroleum gases  6 549 HS8703 Motor cars for transport of persons",
"v": 485.0
},
{
"hs": "HS7102",
"t": "Diamonds, whether or not worked  1 982 HS8704 Motor vehicles for goods transport",
"v": 401.0
},
{
"hs": "HS8905",
"t": "Vessels not mainly for navigability   574 HS3002 Human and animal blood",
"v": 344.0
},
{
"hs": "HS2710",
"t": "Petroleum oils, other than crude   480 HS3004 Medicaments in measured doses",
"v": 313.0
}
]
},
"Antigua and Barb.": {
"aus": 22.0,
"bip": 1682.0,
"bipJahr": 2022,
"ein": 820.0,
"name": "Antigua and Barbuda",
"pAus": [
{
"l": "United Arab Emirates",
"p": 52.7
},
{
"l": "European Union",
"p": 10.6
},
{
"l": "United States of America",
"p": 9.8
},
{
"l": "St-Martin",
"p": 6.0
},
{
"l": "Saint Lucia",
"p": 3.2
}
],
"pEin": [
{
"l": "United States of America",
"p": 48.2
},
{
"l": "European Union",
"p": 8.1
},
{
"l": "China",
"p": 7.4
},
{
"l": "Japan",
"p": 4.4
},
{
"l": "Trinidad and Tobago",
"p": 4.0
}
],
"pJahr": 2019,
"restAus": 17.7,
"restEin": 27.8,
"seite": 14,
"wAus": {
"agrar": 17.6,
"energie": 61.1,
"industrie": 21.0,
"sonst": 0.2
},
"wEin": {
"agrar": 26.9,
"energie": 2.0,
"industrie": 70.8,
"sonst": 0.2
},
"wJahr": 2021,
"waren": [
{
"hs": "HS2208",
"t": "Alcohol of less than 80% volume   3 HS0207 Meat and edible offal of poultry",
"v": 13.0
},
{
"hs": "HS2402",
"t": "Cigars, cheroots, cigarillos 0.2 HS2202 Waters containing added sugar",
"v": 12.0
},
{
"hs": "HS2204",
"t": "Wine of fresh grapes 0.1 HS2106 Other food preparations",
"v": 8.0
},
{
"hs": "HS2201",
"t": "Waters, natural or artificial 0.1 HS2208 Alcohol of less than 80% volume",
"v": 7.0
},
{
"hs": "HS0901",
"t": "Coffee 0.05 HS2203 Beer made from malt",
"v": 5.0
},
{
"hs": "HS7112",
"t": "Waste and scrap of precious metal   20 HS8703 Motor cars for transport of persons",
"v": 32.0
},
{
"hs": "HS2710",
"t": "Petroleum oils, other than crude   4 HS7112 Waste and scrap of precious metal",
"v": 18.0
},
{
"hs": "HS0306",
"t": "Crustaceans whether in shell or not   1 HS9403 Other furniture and parts thereof",
"v": 12.0
},
{
"hs": "HS7113",
"t": "Articles and parts of jewellery   1 HS7326 Other articles of iron or steel",
"v": 11.0
},
{
"hs": "HS9102",
"t": "Other wristwatches 0.6 HS3004 Medicaments in measured doses",
"v": 10.0
}
]
},
"Argentina": {
"aus": 88445.0,
"bip": 632241.0,
"bipJahr": 2022,
"ein": 81522.0,
"name": "Argentina",
"pAus": [
{
"l": "Brazil",
"p": 14.3
},
{
"l": "European Union",
"p": 12.3
},
{
"l": "China",
"p": 9.0
},
{
"l": "United States of America",
"p": 7.6
},
{
"l": "Chile",
"p": 5.7
}
],
"pEin": [
{
"l": "China",
"p": 21.5
},
{
"l": "Brazil",
"p": 19.6
},
{
"l": "European Union",
"p": 13.6
},
{
"l": "United States of America",
"p": 12.7
},
{
"l": "Bolivia",
"p": 2.7
}
],
"pJahr": 2022,
"restAus": 51.2,
"restEin": 29.9,
"seite": 16,
"wAus": {
"agrar": 54.8,
"energie": 2.7,
"industrie": 13.6,
"sonst": 29.0
},
"wEin": {
"agrar": 8.5,
"energie": 13.1,
"industrie": 77.3,
"sonst": 1.1
},
"wJahr": 2021,
"waren": [
{
"hs": "HS2304",
"t": "Solid residues from soya-bean oil  11 427 HS1201 Soya beans, whether or not broken",
"v": 2121.0
},
{
"hs": "HS1005",
"t": "Maize (corn)  9 261 HS0803 Bananas, including plantains",
"v": 318.0
},
{
"hs": "HS1507",
"t": "Soya-bean oil and its fractions  6 246 HS0901 Coffee",
"v": 170.0
},
{
"hs": "HS1001",
"t": "Wheat and meslin  4 001 HS2106 Other food preparations",
"v": 159.0
},
{
"hs": "HS1201",
"t": "Soya beans, whether or not broken  3 082 HS1507 Soya-bean oil and its fractions",
"v": 139.0
},
{
"hs": "HS8704",
"t": "Motor vehicles for goods transport  4 152 HS2710 Petroleum oils, other than crude",
"v": 6756.0
},
{
"hs": "HS2709",
"t": "Petroleum oils, crude  3 073 HS2711 Petroleum gases",
"v": 4270.0
},
{
"hs": "HS3824",
"t": "Prepared binders for foundry moulds  1 867 HS8708 Parts for motor vehicles 8701-8075",
"v": 3729.0
},
{
"hs": "HS8703",
"t": "Motor cars for transport of persons  1 389 HS8703 Motor cars for transport of persons",
"v": 1998.0
},
{
"hs": "HS2711",
"t": "Petroleum gases  1 376 HS8517 Line telephony electrical apparatus",
"v": 1737.0
}
]
},
"Armenia": {
"aus": 5360.0,
"bip": 19503.0,
"bipJahr": 2022,
"ein": 8769.0,
"name": "Armenia",
"pAus": [
{
"l": "Russia",
"p": 44.6
},
{
"l": "European Union",
"p": 14.6
},
{
"l": "United Arab Emirates",
"p": 10.1
},
{
"l": "China",
"p": 7.0
},
{
"l": "Switzerland",
"p": 4.8
}
],
"pEin": [
{
"l": "Russia",
"p": 30.4
},
{
"l": "European Union",
"p": 16.7
},
{
"l": "China",
"p": 15.4
},
{
"l": "Iran",
"p": 6.9
},
{
"l": "United States of America",
"p": 4.1
}
],
"pJahr": 2022,
"restAus": 19.1,
"restEin": 26.5,
"seite": 18,
"wAus": {
"agrar": 28.8,
"energie": 38.2,
"industrie": 26.7,
"sonst": 6.4
},
"wEin": {
"agrar": 18.4,
"energie": 19.3,
"industrie": 60.0,
"sonst": 2.4
},
"wJahr": 2021,
"waren": [
{
"hs": "HS2402",
"t": "Cigars, cheroots, cigarillos   320 HS1001 Wheat and meslin",
"v": 102.0
},
{
"hs": "HS2208",
"t": "Alcohol of less than 80% volume   292 HS2309 Preparations of a kind used in animal feeding",
"v": 63.0
},
{
"hs": "HS0702",
"t": "Tomatoes, fresh or chilled   48 HS1806 Chocolate and other cocoa food",
"v": 63.0
},
{
"hs": "HS2008",
"t": "Plants' parts otherwise preserved   45 HS0207 Meat and edible offal of poultry",
"v": 58.0
},
{
"hs": "HS2309",
"t": "Preparations of a kind used in animal feeding   24 HS1512 Sunflower-seed,or cotton oil",
"v": 50.0
},
{
"hs": "HS2603",
"t": "Copper ores and concentrates   663 HS8703 Motor cars for transport of persons",
"v": 599.0
},
{
"hs": "HS7102",
"t": "Diamonds, whether or not worked   418 HS2710 Petroleum oils, other than crude",
"v": 574.0
},
{
"hs": "HS7108",
"t": "Gold   414 HS2711 Petroleum gases",
"v": 542.0
},
{
"hs": "HS8525",
"t": "Radio-telephony transmission tools   274 HS7102 Diamonds, whether or not worked",
"v": 390.0
},
{
"hs": "HS7202",
"t": "Ferro-alloys   252 HS8525 Radio-telephony transmission tools",
"v": 384.0
}
]
},
"Aruba, the Netherlands with respect to": {
"aus": 208.0,
"bip": 3493.0,
"bipJahr": 2022,
"ein": 1371.0,
"name": "Aruba, the Netherlands with respect to",
"pAus": [
{
"l": "Colombia",
"p": 49.4
},
{
"l": "United States of America",
"p": 23.0
},
{
"l": "Curaçao",
"p": 9.6
},
{
"l": "European Union",
"p": 5.5
},
{
"l": "Panama",
"p": 2.1
}
],
"pEin": [
{
"l": "United States of America",
"p": 50.8
},
{
"l": "European Union",
"p": 17.6
},
{
"l": "Panama",
"p": 4.3
},
{
"l": "China",
"p": 3.4
},
{
"l": "Colombia",
"p": 2.9
}
],
"pJahr": 2021,
"restAus": 10.4,
"restEin": 21.0,
"seite": 20,
"wAus": {
"agrar": 44.7,
"energie": 33.9,
"industrie": 19.0,
"sonst": 2.4
},
"wEin": {
"agrar": 37.6,
"energie": 6.8,
"industrie": 55.5,
"sonst": 0.1
},
"wJahr": 2021,
"waren": [
{
"hs": "HS2402",
"t": "Cigars, cheroots, cigarillos   44 HS2402 Cigars, cheroots, cigarillos",
"v": 54.0
},
{
"hs": "HS2208",
"t": "Alcohol of less than 80% volume   12 HS2208 Alcohol of less than 80% volume",
"v": 23.0
},
{
"hs": "HS2202",
"t": "Waters containing added sugar 0.7 HS0202 Meat of bovine animals, frozen",
"v": 18.0
},
{
"hs": "HS2106",
"t": "Other food preparations 0.2 HS0406 Cheese and curd",
"v": 15.0
},
{
"hs": "HS2204",
"t": "Wine of fresh grapes 0.2 HS2202 Waters containing added sugar",
"v": 15.0
},
{
"hs": "HS7113",
"t": "Articles and parts of jewellery   6 HS2710 Petroleum oils, other than crude",
"v": 60.0
},
{
"hs": "HS7204",
"t": "Ferrous waste and scrap   2 HS8703 Motor cars for transport of persons",
"v": 30.0
},
{
"hs": "HS9102",
"t": "Other wristwatches   1 HS3004 Medicaments in measured doses",
"v": 29.0
},
{
"hs": "HS3401",
"t": "Soap   1 HS7113 Articles and parts of jewellery",
"v": 29.0
},
{
"hs": "HS4202",
"t": "Trunks, suit-cases, vanity-cases   1 HS9403 Other furniture and parts thereof",
"v": 15.0
}
]
},
"Australia": {
"aus": 412562.0,
"bip": 1701893.0,
"bipJahr": 2022,
"ein": 309189.0,
"name": "Australia",
"pAus": [
{
"l": "China",
"p": 24.9
},
{
"l": "Japan",
"p": 12.8
},
{
"l": "South Korea",
"p": 6.0
},
{
"l": "India",
"p": 4.7
},
{
"l": "European Union",
"p": 4.0
}
],
"pEin": [
{
"l": "China",
"p": 27.1
},
{
"l": "European Union",
"p": 13.9
},
{
"l": "United States of America",
"p": 10.0
},
{
"l": "South Korea",
"p": 6.2
},
{
"l": "Japan",
"p": 5.8
}
],
"pJahr": 2022,
"restAus": 47.5,
"restEin": 37.1,
"seite": 22,
"wAus": {
"agrar": 13.5,
"energie": 70.0,
"industrie": 8.2,
"sonst": 8.3
},
"wEin": {
"agrar": 7.2,
"energie": 12.1,
"industrie": 77.2,
"sonst": 3.5
},
"wJahr": 2021,
"waren": [
{
"hs": "HS1001",
"t": "Wheat and meslin  10 008 HS2106 Other food preparations",
"v": 1790.0
},
{
"hs": "HS1205",
"t": "Rape or colza seeds  5 067 HS1905 Bread, pastry,  other bakers' wares",
"v": 1000.0
},
{
"hs": "HS0202",
"t": "Meat of bovine animals, frozen  4 501 HS2208 Alcohol of less than 80% volume",
"v": 861.0
},
{
"hs": "HS0204",
"t": "Meat of sheep or goats, fresh  3 390 HS2204 Wine of fresh grapes",
"v": 777.0
},
{
"hs": "HS5201",
"t": "Cotton, not carded or combed  3 021 HS2309 Preparations of a kind used in animal feeding",
"v": 730.0
},
{
"hs": "HS2701",
"t": "Coal; briquettes, ovoids  98 238 HS2710 Petroleum oils, other than crude",
"v": 38076.0
},
{
"hs": "HS2601",
"t": "Iron ores and concentrates  85 979 HS8703 Motor cars for transport of persons",
"v": 19832.0
},
{
"hs": "HS2711",
"t": "Petroleum gases  63 897 HS8471 Automatic data-processing machines",
"v": 9915.0
},
{
"hs": "HS7108",
"t": "Gold  16 305 HS8704 Motor vehicles for goods transport",
"v": 9679.0
},
{
"hs": "HS2709",
"t": "Petroleum oils, crude  10 054 HS8525 Radio-telephony transmission tools",
"v": 9561.0
}
]
},
"Austria": {
"aus": 211392.0,
"bip": 471685.0,
"bipJahr": 2022,
"ein": 231941.0,
"name": "Austria",
"pAus": [
{
"l": "European Union",
"p": 69.2
},
{
"l": "United States of America",
"p": 6.3
},
{
"l": "Switzerland",
"p": 5.2
},
{
"l": "China",
"p": 2.6
},
{
"l": "United Kingdom",
"p": 2.6
}
],
"pEin": [
{
"l": "European Union",
"p": 74.3
},
{
"l": "Switzerland",
"p": 4.7
},
{
"l": "China",
"p": 4.1
},
{
"l": "United States of America",
"p": 2.1
},
{
"l": "United Kingdom",
"p": 1.2
}
],
"pJahr": 2022,
"restAus": 14.1,
"restEin": 13.5,
"seite": 24,
"wAus": {
"agrar": 10.5,
"energie": 6.2,
"industrie": 81.3,
"sonst": 2.0
},
"wEin": {
"agrar": 9.4,
"energie": 12.8,
"industrie": 75.3,
"sonst": 2.5
},
"wJahr": 2021,
"waren": [
{
"hs": "HS2202",
"t": "Waters containing added sugar  3 534 HS1905 Bread, pastry,  other bakers' wares",
"v": 825.0
},
{
"hs": "HS2309",
"t": "Preparations of a kind used in animal feeding   871 HS2202 Waters containing added sugar",
"v": 699.0
},
{
"hs": "HS0406",
"t": "Cheese and curd   866 HS0406 Cheese and curd",
"v": 696.0
},
{
"hs": "HS2106",
"t": "Other food preparations   797 HS2106 Other food preparations",
"v": 672.0
},
{
"hs": "HS1905",
"t": "Bread, pastry,  other bakers' wares   789 HS2309 Preparations of a kind used in animal feeding",
"v": 664.0
},
{
"hs": "HS8703",
"t": "Motor cars for transport of persons  7 924 HS8703 Motor cars for transport of persons",
"v": 9002.0
},
{
"hs": "HS3002",
"t": "Human and animal blood  6 667 HS2710 Petroleum oils, other than crude",
"v": 8302.0
},
{
"hs": "HS3004",
"t": "Medicaments in measured doses  6 157 HS7108 Gold",
"v": 6409.0
},
{
"hs": "HS2716",
"t": "Electrical energy  4 746 HS8525 Radio-telephony transmission tools",
"v": 6376.0
},
{
"hs": "HS8525",
"t": "Radio-telephony transmission tools  4 696 HS8708 Parts for motor vehicles 8701-8075",
"v": 5166.0
}
]
},
"Azerbaijan": {
"aus": 38147.0,
"bip": 69906.0,
"bipJahr": 2022,
"ein": 14540.0,
"name": "Azerbaijan",
"pAus": [
{
"l": "European Union",
"p": 65.6
},
{
"l": "Turkey",
"p": 9.3
},
{
"l": "Israel",
"p": 4.4
},
{
"l": "India",
"p": 4.4
},
{
"l": "Russia",
"p": 2.6
}
],
"pEin": [
{
"l": "Russia",
"p": 18.8
},
{
"l": "European Union",
"p": 16.0
},
{
"l": "Turkey",
"p": 15.8
},
{
"l": "China",
"p": 14.4
},
{
"l": "Turkmenistan",
"p": 3.5
}
],
"pJahr": 2022,
"restAus": 13.8,
"restEin": 31.5,
"seite": 26,
"wAus": {
"agrar": 4.6,
"energie": 89.6,
"industrie": 4.8,
"sonst": 0.9
},
"wEin": {
"agrar": 20.2,
"energie": 4.1,
"industrie": 74.3,
"sonst": 1.4
},
"wJahr": 2021,
"waren": [
{
"hs": "HS5201",
"t": "Cotton, not carded or combed   174 HS1001 Wheat and meslin",
"v": 437.0
},
{
"hs": "HS0810",
"t": "Other fruit, fresh   173 HS1701 Cane or beet sugar",
"v": 176.0
},
{
"hs": "HS0702",
"t": "Tomatoes, fresh or chilled   168 HS1511 Palm oil and its fractions",
"v": 116.0
},
{
"hs": "HS0802",
"t": "Other nuts, fresh or dried   112 HS0405 Butter and other fats and oils",
"v": 108.0
},
{
"hs": "HS0809",
"t": "Apricots, cherries, peaches   82 HS1905 Bread, pastry,  other bakers' wares",
"v": 100.0
},
{
"hs": "HS2709",
"t": "Petroleum oils, crude  19 484 HS8703 Motor cars for transport of persons",
"v": 845.0
},
{
"hs": "HS2711",
"t": "Petroleum gases  14 995 HS2710 Petroleum oils, other than crude",
"v": 693.0
},
{
"hs": "HS2710",
"t": "Petroleum oils, other than crude   527 HS3004 Medicaments in measured doses",
"v": 505.0
},
{
"hs": "HS3102",
"t": "Nitrogenous fertilisers   210 HS2709 Petroleum oils, crude",
"v": 451.0
},
{
"hs": "HS7108",
"t": "Gold   185 HS8525 Radio-telephony transmission tools",
"v": 278.0
}
]
},
"Bahamas": {
"aus": 838.0,
"bip": 13038.0,
"bipJahr": 2022,
"ein": 3754.0,
"name": "Bahamas",
"pAus": [
{
"l": "United States of America",
"p": 79.3
},
{
"l": "European Union",
"p": 7.5
},
{
"l": "Turks and Caicos Is.",
"p": 3.9
},
{
"l": "United Kingdom",
"p": 0.8
},
{
"l": "Canada",
"p": 0.4
}
],
"pEin": [
{
"l": "United States of America",
"p": 79.8
},
{
"l": "European Union",
"p": 3.4
},
{
"l": "Canada",
"p": 2.3
},
{
"l": "Turks and Caicos Is.",
"p": 2.3
},
{
"l": "China",
"p": 1.5
}
],
"pJahr": 2020,
"restAus": 8.1,
"restEin": 10.7,
"seite": 28,
"wAus": {
"agrar": 8.3,
"energie": 15.1,
"industrie": 62.3,
"sonst": 14.3
},
"wEin": {
"agrar": 18.1,
"energie": 16.9,
"industrie": 45.7,
"sonst": 19.2
},
"wJahr": 2021,
"waren": [
{
"hs": "HS0508",
"t": "Coral and similar materials 0.6 HS0207 Meat and edible offal of poultry",
"v": 31.0
},
{
"hs": "HS0511",
"t": "Other animal products 0.5 HS1905 Bread, pastry,  other bakers' wares",
"v": 28.0
},
{
"hs": "HS2202",
"t": "Waters containing added sugar 0.1 HS2106 Other food preparations",
"v": 23.0
},
{
"hs": "HS2208",
"t": "Alcohol of less than 80% volume 0.1 HS2208 Alcohol of less than 80% volume",
"v": 23.0
},
{
"hs": "HS2402",
"t": "Cigars, cheroots, cigarillos 0.1 HS2202 Waters containing added sugar",
"v": 16.0
},
{
"hs": "HS2710",
"t": "Petroleum oils, other than crude   96 HS2710 Petroleum oils, other than crude",
"v": 376.0
},
{
"hs": "HS3903",
"t": "Polymers of styrene   56 HS8703 Motor cars for transport of persons",
"v": 91.0
},
{
"hs": "HS5702",
"t": "Textile floor covering, woven   29 HS9403 Other furniture and parts thereof",
"v": 43.0
},
{
"hs": "HS0306",
"t": "Crustaceans whether in shell or not   23 HS3004 Medicaments in measured doses",
"v": 29.0
},
{
"hs": "HS8903",
"t": "Vessels for pleasure or sports   18 HS8502 Electric generating sets",
"v": 23.0
}
]
},
"Bahrain": {
"aus": 30194.0,
"bip": 44388.0,
"bipJahr": 2022,
"ein": 15537.0,
"name": "Bahrain, Kingdom of",
"pAus": [
{
"l": "Saudi Arabia",
"p": 13.7
},
{
"l": "European Union",
"p": 9.8
},
{
"l": "United States of America",
"p": 8.6
},
{
"l": "United Arab Emirates",
"p": 7.4
},
{
"l": "Oman",
"p": 2.9
}
],
"pEin": [
{
"l": "China",
"p": 14.5
},
{
"l": "European Union",
"p": 14.3
},
{
"l": "Brazil",
"p": 10.6
},
{
"l": "Australia",
"p": 8.7
},
{
"l": "United Arab Emirates",
"p": 8.3
}
],
"pJahr": 2022,
"restAus": 57.6,
"restEin": 43.6,
"seite": 30,
"wAus": {
"agrar": 3.1,
"energie": 75.2,
"industrie": 20.7,
"sonst": 1.0
},
"wEin": {
"agrar": 13.0,
"energie": 28.2,
"industrie": 56.9,
"sonst": 1.9
},
"wJahr": 2021,
"waren": [
{
"hs": "HS0406",
"t": "Cheese and curd   420 HS0207 Meat and edible offal of poultry",
"v": 142.0
},
{
"hs": "HS1905",
"t": "Bread, pastry,  other bakers' wares   136 HS0405 Butter and other fats and oils",
"v": 137.0
},
{
"hs": "HS2106",
"t": "Other food preparations   95 HS2106 Other food preparations",
"v": 97.0
},
{
"hs": "HS0402",
"t": "Milk and cream, concentrated   48 HS0406 Cheese and curd",
"v": 96.0
},
{
"hs": "HS2402",
"t": "Cigars, cheroots, cigarillos   22 HS1905 Bread, pastry,  other bakers' wares",
"v": 95.0
},
{
"hs": "HS7601",
"t": "Unwrought aluminium  5 309 HS2601 Iron ores and concentrates",
"v": 1857.0
},
{
"hs": "HS2601",
"t": "Iron ores and concentrates  2 150 HS2818 Artificial corundum",
"v": 1246.0
},
{
"hs": "HS7605",
"t": "Aluminium wire   722 HS8703 Motor cars for transport of persons",
"v": 744.0
},
{
"hs": "HS7606",
"t": "Aluminium plates, sheets and strip   480 HS8409 Parts suitable for 8407 or 8408",
"v": 476.0
},
{
"hs": "HS3102",
"t": "Nitrogenous fertilisers   427 HS7108 Gold",
"v": 405.0
}
]
},
"Bangladesh": {
"aus": 54695.0,
"bip": 460201.0,
"bipJahr": 2022,
"ein": 88234.0,
"name": "Bangladesh",
"pAus": [
{
"l": "European Union",
"p": 43.5
},
{
"l": "United States of America",
"p": 19.3
},
{
"l": "United Kingdom",
"p": 11.0
},
{
"l": "Canada",
"p": 3.3
},
{
"l": "Japan",
"p": 3.0
}
],
"pEin": [
{
"l": "China",
"p": 21.5
},
{
"l": "India",
"p": 12.2
},
{
"l": "Singapore",
"p": 9.2
},
{
"l": "European Union",
"p": 5.6
},
{
"l": "Hong Kong",
"p": 5.5
}
],
"pJahr": 2015,
"restAus": 19.7,
"restEin": 45.9,
"seite": 32,
"wAus": {
"agrar": 3.6,
"energie": 0.6,
"industrie": 95.6,
"sonst": 0.2
},
"wEin": {
"agrar": 19.7,
"energie": 15.5,
"industrie": 64.0,
"sonst": 0.9
},
"wJahr": 2021,
"waren": [
{
"hs": "HS2009",
"t": "Fruit juices and vegetable juices   55 HS5201 Cotton, not carded or combed",
"v": 2230.0
},
{
"hs": "HS0711",
"t": "Vegetables provisionally preserved   46 HS1511 Palm oil and its fractions",
"v": 1785.0
},
{
"hs": "HS2401",
"t": "Unmanufactured tobacco   44 HS1001 Wheat and meslin",
"v": 991.0
},
{
"hs": "HS1905",
"t": "Bread, pastry,  other bakers' wares   35 HS1507 Soya-bean oil and its fractions",
"v": 945.0
},
{
"hs": "HS1901",
"t": "Malt extract   33 HS1701 Cane or beet sugar",
"v": 822.0
},
{
"hs": "HS6109",
"t": "T-shirts, singlets and other vests  6 101 HS2710 Petroleum oils, other than crude",
"v": 4359.0
},
{
"hs": "HS6203",
"t": "Men's or boys' suits  5 973 HS5208 Woven fabrics, 85% cotton small",
"v": 1762.0
},
{
"hs": "HS6204",
"t": "Women's or girls' suits  3 395 HS5209 Woven fabrics, 85% cotton big",
"v": 1471.0
},
{
"hs": "HS6110",
"t": "Jerseys, pullovers, cardigans  2 953 HS5205 Cotton yarn, 85% or more of cotton",
"v": 954.0
},
{
"hs": "HS6205",
"t": "Men's or boys' shirts  2 325 HS6217 Other made-up clothing accessories",
"v": 857.0
}
]
},
"Barbados": {
"aus": 498.0,
"bip": 5665.0,
"bipJahr": 2022,
"ein": 2151.0,
"name": "Barbados",
"pAus": [
{
"l": "United States of America",
"p": 17.1
},
{
"l": "Jamaica",
"p": 7.3
},
{
"l": "Trinidad and Tobago",
"p": 6.6
},
{
"l": "Guyana",
"p": 5.7
},
{
"l": "Saint Lucia",
"p": 4.2
}
],
"pEin": [
{
"l": "United States of America",
"p": 40.3
},
{
"l": "Trinidad and Tobago",
"p": 19.1
},
{
"l": "European Union",
"p": 9.3
},
{
"l": "United Kingdom",
"p": 4.5
},
{
"l": "China",
"p": 4.4
}
],
"pJahr": 2022,
"restAus": 59.2,
"restEin": 22.3,
"seite": 34,
"wAus": {
"agrar": 27.4,
"energie": 25.6,
"industrie": 46.1,
"sonst": 0.9
},
"wEin": {
"agrar": 23.2,
"energie": 21.2,
"industrie": 55.1,
"sonst": 0.5
},
"wJahr": 2021,
"waren": [
{
"hs": "HS2208",
"t": "Alcohol of less than 80% volume   55 HS2106 Other food preparations",
"v": 28.0
},
{
"hs": "HS1905",
"t": "Bread, pastry,  other bakers' wares   14 HS0406 Cheese and curd",
"v": 19.0
},
{
"hs": "HS1517",
"t": "Margarine; edible mixtures oil   12 HS0202 Meat of bovine animals, frozen",
"v": 17.0
},
{
"hs": "HS2202",
"t": "Waters containing added sugar   5 HS1201 Soya beans, whether or not broken",
"v": 17.0
},
{
"hs": "HS1101",
"t": "Wheat or meslin flour   4 HS1905 Bread, pastry,  other bakers' wares",
"v": 16.0
},
{
"hs": "HS2710",
"t": "Petroleum oils, other than crude   176 HS2710 Petroleum oils, other than crude",
"v": 535.0
},
{
"hs": "HS3004",
"t": "Medicaments in measured doses   24 HS8703 Motor cars for transport of persons",
"v": 45.0
},
{
"hs": "HS4821",
"t": "Paper or paperboard labels   14 HS3004 Medicaments in measured doses",
"v": 41.0
},
{
"hs": "HS2709",
"t": "Petroleum oils, crude   13 HS8471 Automatic data-processing machines",
"v": 29.0
},
{
"hs": "HS3808",
"t": "Insecticides, rodenticides   12 HS8704 Motor vehicles for goods transport",
"v": 22.0
}
]
},
"Belarus": {
"aus": 22793.0,
"bip": 73120.0,
"bipJahr": 2022,
"ein": 38655.0,
"name": "Belarus",
"pAus": [
{
"l": "Russia",
"p": 35.0
},
{
"l": "European Union",
"p": 13.6
},
{
"l": "Ukraine",
"p": 3.0
},
{
"l": "Kazakhstan",
"p": 1.9
},
{
"l": "China",
"p": 1.4
}
],
"pEin": [
{
"l": "Russia",
"p": 28.6
},
{
"l": "European Union",
"p": 14.2
},
{
"l": "China",
"p": 8.1
},
{
"l": "Ukraine",
"p": 3.4
},
{
"l": "Turkey",
"p": 1.6
}
],
"pJahr": 2021,
"restAus": 45.0,
"restEin": 44.0,
"seite": 36,
"wAus": {
"agrar": 20.3,
"energie": 18.5,
"industrie": 38.6,
"sonst": 22.7
},
"wEin": {
"agrar": 11.7,
"energie": 33.1,
"industrie": 49.9,
"sonst": 5.2
},
"wJahr": 2021,
"waren": [
{
"hs": "HS0406",
"t": "Cheese and curd  1 190 HS2304 Solid residues from soya-bean oil",
"v": 228.0
},
{
"hs": "HS0402",
"t": "Milk and cream, concentrated   546 HS2106 Other food preparations",
"v": 197.0
},
{
"hs": "HS0405",
"t": "Butter and other fats and oils   451 HS1201 Soya beans, whether or not broken",
"v": 180.0
},
{
"hs": "HS1514",
"t": "Rape, colza or mustard oil   420 HS1205 Rape or colza seeds",
"v": 164.0
},
{
"hs": "HS0207",
"t": "Meat and edible offal of poultry   336 HS2306 Solid residues from other oil",
"v": 149.0
},
{
"hs": "HS4407",
"t": "Wood sawn or chipped lengthwise   802 HS8703 Motor cars for transport of persons",
"v": 1207.0
},
{
"hs": "HS9403",
"t": "Other furniture and parts thereof   628 HS3004 Medicaments in measured doses",
"v": 569.0
},
{
"hs": "HS7214",
"t": "Other iron bar not further worked   550 HS8708 Parts for motor vehicles 8701-8075",
"v": 506.0
},
{
"hs": "HS8703",
"t": "Motor cars for transport of persons   437 HS8525 Radio-telephony transmission tools",
"v": 463.0
},
{
"hs": "HS8708",
"t": "Parts for motor vehicles 8701-8075   432 HS7204 Ferrous waste and scrap",
"v": 457.0
}
]
},
"Belgium": {
"aus": 635245.0,
"bip": 582210.0,
"bipJahr": 2022,
"ein": 623686.0,
"name": "Belgium",
"pAus": [
{
"l": "European Union",
"p": 64.8
},
{
"l": "United States of America",
"p": 6.8
},
{
"l": "United Kingdom",
"p": 5.1
},
{
"l": "Japan",
"p": 2.2
},
{
"l": "Nigeria",
"p": 1.7
}
],
"pEin": [
{
"l": "European Union",
"p": 61.8
},
{
"l": "United Kingdom",
"p": 6.3
},
{
"l": "United States of America",
"p": 5.3
},
{
"l": "Norway",
"p": 3.7
},
{
"l": "China",
"p": 3.6
}
],
"pJahr": 2022,
"restAus": 19.5,
"restEin": 19.2,
"seite": 38,
"wAus": {
"agrar": 10.6,
"energie": 13.7,
"industrie": 74.8,
"sonst": 0.9
},
"wEin": {
"agrar": 10.1,
"energie": 19.2,
"industrie": 70.5,
"sonst": 0.2
},
"wJahr": 2021,
"waren": [
{
"hs": "HS2004",
"t": "Other vegetables,frozen  3 088 HS0406 Cheese and curd",
"v": 1668.0
},
{
"hs": "HS1806",
"t": "Chocolate and other cocoa food  2 798 HS1905 Bread, pastry,  other bakers' wares",
"v": 1299.0
},
{
"hs": "HS1905",
"t": "Bread, pastry,  other bakers' wares  2 375 HS1001 Wheat and meslin",
"v": 1257.0
},
{
"hs": "HS2309",
"t": "Preparations of a kind used in animal feeding  1 701 HS1205 Rape or colza seeds",
"v": 1225.0
},
{
"hs": "HS2203",
"t": "Beer made from malt  1 651 HS2309 Preparations of a kind used in animal feeding",
"v": 1216.0
},
{
"hs": "HS2711",
"t": "Petroleum gases  49 996 HS2711 Petroleum gases",
"v": 64350.0
},
{
"hs": "HS3002",
"t": "Human and animal blood  46 770 HS3002 Human and animal blood",
"v": 26923.0
},
{
"hs": "HS2710",
"t": "Petroleum oils, other than crude  32 348 HS8703 Motor cars for transport of persons",
"v": 25357.0
},
{
"hs": "HS3004",
"t": "Medicaments in measured doses  28 135 HS3004 Medicaments in measured doses",
"v": 24309.0
},
{
"hs": "HS8703",
"t": "Motor cars for transport of persons  23 361 HS2709 Petroleum oils, crude",
"v": 23849.0
}
]
},
"Belize": {
"aus": 494.0,
"bip": 2950.0,
"bipJahr": 2022,
"ein": 1381.0,
"name": "Belize",
"pAus": [
{
"l": "United States of America",
"p": 24.9
},
{
"l": "United Kingdom",
"p": 20.2
},
{
"l": "European Union",
"p": 15.1
},
{
"l": "Guatemala",
"p": 11.0
},
{
"l": "Honduras",
"p": 6.9
}
],
"pEin": [
{
"l": "United States of America",
"p": 41.6
},
{
"l": "China",
"p": 17.6
},
{
"l": "Mexico",
"p": 10.2
},
{
"l": "Guatemala",
"p": 7.7
},
{
"l": "European Union",
"p": 3.9
}
],
"pJahr": 2022,
"restAus": 21.9,
"restEin": 19.1,
"seite": 40,
"wAus": {
"agrar": 55.4,
"energie": 3.2,
"industrie": 3.5,
"sonst": 37.9
},
"wEin": {
"agrar": 22.6,
"energie": 13.2,
"industrie": 64.0,
"sonst": 0.3
},
"wJahr": 2021,
"waren": [
{
"hs": "HS1701",
"t": "Cane or beet sugar   77 HS2402 Cigars, cheroots, cigarillos",
"v": 66.0
},
{
"hs": "HS0803",
"t": "Bananas, including plantains   40 HS2106 Other food preparations",
"v": 15.0
},
{
"hs": "HS2302",
"t": "Bran, sharps and other residues   24 HS1517 Margarine; edible mixtures oil",
"v": 12.0
},
{
"hs": "HS2402",
"t": "Cigars, cheroots, cigarillos   17 HS2309 Preparations of a kind used in animal feeding",
"v": 12.0
},
{
"hs": "HS2009",
"t": "Fruit juices and vegetable juices   16 HS1001 Wheat and meslin",
"v": 10.0
},
{
"hs": "HS2710",
"t": "Petroleum oils, other than crude   21 HS2710 Petroleum oils, other than crude",
"v": 184.0
},
{
"hs": "HS0306",
"t": "Crustaceans whether in shell or not   18 HS6404 Footwear, uppers textile material",
"v": 29.0
},
{
"hs": "HS0307",
"t": "Molluscs whether in shell or not   9 HS3105 Mineral or chemical fertilisers",
"v": 23.0
},
{
"hs": "HS4418",
"t": "Builders'  wood joinery, carpentry   4 HS4202 Trunks, suit-cases, vanity-cases",
"v": 22.0
},
{
"hs": "HS4407",
"t": "Wood sawn or chipped lengthwise   2 HS3808 Insecticides, rodenticides",
"v": 22.0
}
]
},
"Benin": {
"aus": 3547.0,
"bip": 17413.0,
"bipJahr": 2022,
"ein": 4784.0,
"name": "Benin",
"pAus": [
{
"l": "Bangladesh",
"p": 45.3
},
{
"l": "India",
"p": 11.9
},
{
"l": "China",
"p": 6.1
},
{
"l": "Egypt",
"p": 4.5
},
{
"l": "European Union",
"p": 4.2
}
],
"pEin": [
{
"l": "European Union",
"p": 21.4
},
{
"l": "India",
"p": 15.7
},
{
"l": "China",
"p": 13.1
},
{
"l": "United Arab Emirates",
"p": 6.7
},
{
"l": "Nigeria",
"p": 5.1
}
],
"pJahr": 2022,
"restAus": 28.0,
"restEin": 37.9,
"seite": 42,
"wAus": {
"agrar": 24.2,
"energie": 1.1,
"industrie": 3.9,
"sonst": 70.7
},
"wEin": {
"agrar": 28.6,
"energie": 10.5,
"industrie": 34.2,
"sonst": 26.7
},
"wJahr": 2021,
"waren": [
{
"hs": "HS5201",
"t": "Cotton, not carded or combed   580 HS1006 Rice",
"v": 665.0
},
{
"hs": "HS1207",
"t": "Other oil seeds, oleaginous fruits   42 HS0207 Meat and edible offal of poultry",
"v": 110.0
},
{
"hs": "HS0801",
"t": "Coconuts, Brazil nuts, cashew nuts   33 HS1511 Palm oil and its fractions",
"v": 47.0
},
{
"hs": "HS2306",
"t": "Solid residues from other oil   29 HS1001 Wheat and meslin",
"v": 38.0
},
{
"hs": "HS1512",
"t": "Sunflower-seed,or cotton oil   13 HS1701 Cane or beet sugar",
"v": 28.0
},
{
"hs": "HS2710",
"t": "Petroleum oils, other than crude   38 HS2710 Petroleum oils, other than crude",
"v": 548.0
},
{
"hs": "HS4407",
"t": "Wood sawn or chipped lengthwise   14 HS3004 Medicaments in measured doses",
"v": 121.0
},
{
"hs": "HS7214",
"t": "Other iron bar not further worked   13 HS3105 Mineral or chemical fertilisers",
"v": 116.0
},
{
"hs": "HS5208",
"t": "Woven fabrics, 85% cotton small   10 HS0303 Fish, frozen, excluding fish fillet",
"v": 100.0
},
{
"hs": "HS7213",
"t": "Bars and rods, hot-rolled   9 HS2716 Electrical energy",
"v": 80.0
}
]
},
"Bermuda": {
"aus": 34.0,
"ein": 1192.0,
"name": "Bermuda",
"pAus": [
{
"l": "United States of America",
"p": 84.6
},
{
"l": "United Kingdom",
"p": 9.6
},
{
"l": "Canada",
"p": 2.9
},
{
"l": "European Union",
"p": 2.2
},
{
"l": "New Zealand",
"p": 0.2
}
],
"pEin": [
{
"l": "United States of America",
"p": 71.5
},
{
"l": "Canada",
"p": 8.5
},
{
"l": "United Kingdom",
"p": 5.4
},
{
"l": "European Union",
"p": 4.6
},
{
"l": "China",
"p": 2.9
}
],
"pJahr": 2022,
"restAus": 0.3,
"restEin": 7.1,
"seite": 44,
"wAus": {
"agrar": 19.3,
"energie": 0.1,
"industrie": 68.9,
"sonst": 11.7
},
"wEin": {
"agrar": 21.9,
"energie": 8.6,
"industrie": 53.8,
"sonst": 15.7
},
"wJahr": 2021,
"waren": [
{
"hs": "HS2208",
"t": "Alcohol of less than 80% volume   2 HS2204 Wine of fresh grapes",
"v": 17.0
},
{
"hs": "HS1905",
"t": "Bread, pastry,  other bakers' wares 0.1 HS1905 Bread, pastry,  other bakers' wares",
"v": 16.0
},
{
"hs": "HS0207",
"t": "Meat and edible offal of poultry 0.1 HS2202 Waters containing added sugar",
"v": 13.0
},
{
"hs": "HS0406",
"t": "Cheese and curd 0.02 HS2208 Alcohol of less than 80% volume",
"v": 11.0
},
{
"hs": "HS0208",
"t": "Other meat and edible meat offal 0.01 HS0207 Meat and edible offal of poultry",
"v": 11.0
},
{
"hs": "HS8407",
"t": "Spark-ignition piston engines   2 HS2710 Petroleum oils, other than crude",
"v": 138.0
},
{
"hs": "HS8502",
"t": "Electric generating sets 0.9 HS4907 Other documents of title",
"v": 61.0
},
{
"hs": "HS8479",
"t": "Machines with individual functions 0.7 HS3004 Medicaments in measured doses",
"v": 27.0
},
{
"hs": "HS8427",
"t": "Trucks with lifting equipment 0.5 HS9403 Other furniture and parts thereof",
"v": 25.0
},
{
"hs": "HS9007",
"t": "Cinematographic cameras, projectors 0.5 HS8703 Motor cars for transport of persons",
"v": 25.0
}
]
},
"Bhutan": {
"aus": 724.0,
"bip": 2642.0,
"bipJahr": 2022,
"ein": 1511.0,
"name": "Bhutan",
"pAus": [
{
"l": "India",
"p": 93.7
},
{
"l": "Bangladesh",
"p": 4.1
},
{
"l": "European Union",
"p": 0.9
},
{
"l": "Japan",
"p": 0.4
},
{
"l": "Nepal",
"p": 0.4
}
],
"pEin": [
{
"l": "India",
"p": 78.8
},
{
"l": "European Union",
"p": 4.5
},
{
"l": "South Korea",
"p": 3.1
},
{
"l": "China",
"p": 2.5
},
{
"l": "Japan",
"p": 2.4
}
],
"pJahr": 2012,
"restAus": 0.5,
"restEin": 8.7,
"seite": 46,
"wAus": {
"agrar": 8.1,
"energie": 40.6,
"industrie": 50.6,
"sonst": 0.6
},
"wEin": {
"agrar": 17.9,
"energie": 18.9,
"industrie": 63.1,
"sonst": 0.1
},
"wJahr": 2015,
"waren": [
{
"hs": "HS0805",
"t": "Citrus fruit, fresh or dried   8 HS1006 Rice",
"v": 23.0
},
{
"hs": "HS0908",
"t": "Nutmeg, mace and cardamoms   8 HS1507 Soya-bean oil and its fractions",
"v": 10.0
},
{
"hs": "HS0701",
"t": "Potatoes, fresh or chilled   6 HS0402 Milk and cream, concentrated",
"v": 10.0
},
{
"hs": "HS2202",
"t": "Waters containing added sugar   2 HS0201 Bovine meat, fresh, chilled",
"v": 8.0
},
{
"hs": "HS1101",
"t": "Wheat or meslin flour   2 HS1902 Pasta",
"v": 6.0
},
{
"hs": "HS2716",
"t": "Electrical energy   171 HS2710 Petroleum oils, other than crude",
"v": 131.0
},
{
"hs": "HS7202",
"t": "Ferro-alloys   128 HS7203 Ferrous products",
"v": 41.0
},
{
"hs": "HS2849",
"t": "Carbides   30 HS7308 Structures of iron and steel",
"v": 30.0
},
{
"hs": "HS7214",
"t": "Other iron bar not further worked   27 HS7408 Copper wire",
"v": 27.0
},
{
"hs": "HS2523",
"t": "Portland cement, aluminous cement   25 HS7204 Ferrous waste and scrap",
"v": 21.0
}
]
},
"Bolivia": {
"aus": 13653.0,
"bip": 43221.0,
"bipJahr": 2022,
"ein": 13049.0,
"name": "Bolivia, Plurinational State of",
"pAus": [
{
"l": "India",
"p": 16.5
},
{
"l": "Brazil",
"p": 13.9
},
{
"l": "Argentina",
"p": 12.8
},
{
"l": "Colombia",
"p": 7.8
},
{
"l": "European Union",
"p": 7.4
}
],
"pEin": [
{
"l": "China",
"p": 19.4
},
{
"l": "Brazil",
"p": 15.1
},
{
"l": "Argentina",
"p": 12.5
},
{
"l": "Chile",
"p": 10.9
},
{
"l": "United States of America",
"p": 8.6
}
],
"pJahr": 2022,
"restAus": 41.7,
"restEin": 33.5,
"seite": 48,
"wAus": {
"agrar": 20.0,
"energie": 52.0,
"industrie": 5.3,
"sonst": 22.7
},
"wEin": {
"agrar": 8.6,
"energie": 24.5,
"industrie": 66.9,
"sonst": 0.0
},
"wJahr": 2021,
"waren": [
{
"hs": "HS2304",
"t": "Solid residues from soya-bean oil   981 HS2106 Other food preparations",
"v": 123.0
},
{
"hs": "HS1507",
"t": "Soya-bean oil and its fractions   857 HS1101 Wheat or meslin flour",
"v": 66.0
},
{
"hs": "HS1201",
"t": "Soya beans, whether or not broken   334 HS2309 Preparations of a kind used in animal feeding",
"v": 58.0
},
{
"hs": "HS0801",
"t": "Coconuts, Brazil nuts, cashew nuts   197 HS1901 Malt extract",
"v": 41.0
},
{
"hs": "HS1512",
"t": "Sunflower-seed,or cotton oil   132 HS1704 Sugar confectionery",
"v": 36.0
},
{
"hs": "HS2711",
"t": "Petroleum gases  3 049 HS2710 Petroleum oils, other than crude",
"v": 4351.0
},
{
"hs": "HS7108",
"t": "Gold  3 003 HS8703 Motor cars for transport of persons",
"v": 444.0
},
{
"hs": "HS2608",
"t": "Zinc ores and concentrates  1 818 HS3808 Insecticides, rodenticides",
"v": 369.0
},
{
"hs": "HS2616",
"t": "Precious metal ores and concentrate   755 HS7214 Other iron bar not further worked",
"v": 230.0
},
{
"hs": "HS8001",
"t": "Unwrought tin   511 HS8704 Motor vehicles for goods transport",
"v": 197.0
}
]
},
"Bosnia and Herz.": {
"aus": 9674.0,
"bip": 25484.0,
"bipJahr": 2022,
"ein": 15377.0,
"name": "Bosnia and Herzegovina",
"pAus": [
{
"l": "European Union",
"p": 73.6
},
{
"l": "Serbia",
"p": 13.9
},
{
"l": "Montenegro",
"p": 3.2
},
{
"l": "Turkey",
"p": 1.7
},
{
"l": "Switzerland",
"p": 1.4
}
],
"pEin": [
{
"l": "European Union",
"p": 56.9
},
{
"l": "Serbia",
"p": 10.8
},
{
"l": "China",
"p": 8.1
},
{
"l": "Turkey",
"p": 5.9
},
{
"l": "United States of America",
"p": 3.3
}
],
"pJahr": 2022,
"restAus": 6.2,
"restEin": 15.0,
"seite": 50,
"wAus": {
"agrar": 11.3,
"energie": 18.1,
"industrie": 69.0,
"sonst": 1.7
},
"wEin": {
"agrar": 16.8,
"energie": 18.0,
"industrie": 65.2,
"sonst": 0.1
},
"wJahr": 2021,
"waren": [
{
"hs": "HS1512",
"t": "Sunflower-seed,or cotton oil   67 HS0201 Bovine meat, fresh, chilled",
"v": 137.0
},
{
"hs": "HS1905",
"t": "Bread, pastry,  other bakers' wares   46 HS2106 Other food preparations",
"v": 124.0
},
{
"hs": "HS1602",
"t": "Other prepared or preserved meat   39 HS2202 Waters containing added sugar",
"v": 106.0
},
{
"hs": "HS0401",
"t": "Milk and cream, not concentrated   38 HS1905 Bread, pastry,  other bakers' wares",
"v": 106.0
},
{
"hs": "HS0811",
"t": "Fruit and nuts, uncooked or cooked   38 HS1001 Wheat and meslin",
"v": 104.0
},
{
"hs": "HS2716",
"t": "Electrical energy   588 HS2710 Petroleum oils, other than crude",
"v": 1571.0
},
{
"hs": "HS7601",
"t": "Unwrought aluminium   476 HS7601 Unwrought aluminium",
"v": 609.0
},
{
"hs": "HS9401",
"t": "Seats and parts thereof   337 HS2701 Coal; briquettes, ovoids",
"v": 489.0
},
{
"hs": "HS7308",
"t": "Structures of iron and steel   336 HS8703 Motor cars for transport of persons",
"v": 446.0
},
{
"hs": "HS8544",
"t": "Insulated electric conductors   327 HS3004 Medicaments in measured doses",
"v": 310.0
}
]
},
"Botswana": {
"aus": 8323.0,
"bip": 19176.0,
"bipJahr": 2022,
"ein": 8093.0,
"name": "Botswana",
"pAus": [
{
"l": "United Arab Emirates",
"p": 27.2
},
{
"l": "European Union",
"p": 18.9
},
{
"l": "India",
"p": 15.2
},
{
"l": "South Africa",
"p": 10.1
},
{
"l": "Hong Kong",
"p": 6.5
}
],
"pEin": [
{
"l": "South Africa",
"p": 62.8
},
{
"l": "European Union",
"p": 7.8
},
{
"l": "Namibia",
"p": 7.2
},
{
"l": "India",
"p": 4.4
},
{
"l": "Canada",
"p": 3.6
}
],
"pJahr": 2022,
"restAus": 22.1,
"restEin": 14.1,
"seite": 52,
"wAus": {
"agrar": 1.9,
"energie": 3.0,
"industrie": 95.1,
"sonst": 0.0
},
"wEin": {
"agrar": 12.4,
"energie": 12.7,
"industrie": 74.4,
"sonst": 0.5
},
"wJahr": 2021,
"waren": [
{
"hs": "HS0102",
"t": "Live bovine animals   96 HS1701 Cane or beet sugar",
"v": 140.0
},
{
"hs": "HS0202",
"t": "Meat of bovine animals, frozen   8 HS1001 Wheat and meslin",
"v": 71.0
},
{
"hs": "HS2302",
"t": "Bran, sharps and other residues   7 HS1005 Maize (corn)",
"v": 66.0
},
{
"hs": "HS0708",
"t": "Leguminous vegetables   7 HS2202 Waters containing added sugar",
"v": 53.0
},
{
"hs": "HS0713",
"t": "Dried leguminous vegetables   6 HS1512 Sunflower-seed,or cotton oil",
"v": 50.0
},
{
"hs": "HS7102",
"t": "Diamonds, whether or not worked  7 216 HS7102 Diamonds, whether or not worked",
"v": 2206.0
},
{
"hs": "HS2603",
"t": "Copper ores and concentrates   321 HS2710 Petroleum oils, other than crude",
"v": 1344.0
},
{
"hs": "HS8544",
"t": "Insulated electric conductors   145 HS8703 Motor cars for transport of persons",
"v": 140.0
},
{
"hs": "HS2836",
"t": "Carbonates; peroxocarbonates   56 HS8704 Motor vehicles for goods transport",
"v": 133.0
},
{
"hs": "HS2701",
"t": "Coal; briquettes, ovoids   52 HS8431 Parts for machinery of 8425 to 8430",
"v": 101.0
}
]
},
"Brazil": {
"aus": 334136.0,
"bip": 1924134.0,
"bipJahr": 2022,
"ein": 292245.0,
"name": "Brazil",
"pAus": [
{
"l": "China",
"p": 26.8
},
{
"l": "European Union",
"p": 15.2
},
{
"l": "United States of America",
"p": 11.4
},
{
"l": "Argentina",
"p": 4.6
},
{
"l": "Chile",
"p": 2.7
}
],
"pEin": [
{
"l": "China",
"p": 23.2
},
{
"l": "United States of America",
"p": 18.6
},
{
"l": "European Union",
"p": 16.0
},
{
"l": "Argentina",
"p": 4.7
},
{
"l": "India",
"p": 3.3
}
],
"pJahr": 2022,
"restAus": 39.3,
"restEin": 34.3,
"seite": 54,
"wAus": {
"agrar": 39.6,
"energie": 33.4,
"industrie": 25.0,
"sonst": 2.0
},
"wEin": {
"agrar": 6.5,
"energie": 17.5,
"industrie": 75.9,
"sonst": 0.1
},
"wJahr": 2021,
"waren": [
{
"hs": "HS1201",
"t": "Soya beans, whether or not broken  46 664 HS1001 Wheat and meslin",
"v": 2264.0
},
{
"hs": "HS1005",
"t": "Maize (corn)  12 264 HS1107 Malt, whether or not roasted",
"v": 827.0
},
{
"hs": "HS1701",
"t": "Cane or beet sugar  11 004 HS1005 Maize (corn)",
"v": 654.0
},
{
"hs": "HS0202",
"t": "Meat of bovine animals, frozen  10 938 HS1509 Olive oil and its fractions",
"v": 560.0
},
{
"hs": "HS2304",
"t": "Solid residues from soya-bean oil  10 340 HS2204 Wine of fresh grapes",
"v": 486.0
},
{
"hs": "HS2709",
"t": "Petroleum oils, crude  42 688 HS2710 Petroleum oils, other than crude",
"v": 24684.0
},
{
"hs": "HS2601",
"t": "Iron ores and concentrates  28 889 HS2709 Petroleum oils, crude",
"v": 10145.0
},
{
"hs": "HS2710",
"t": "Petroleum oils, other than crude  13 036 HS3104 Potassic fertilisers",
"v": 9600.0
},
{
"hs": "HS4703",
"t": "Chemical wood pulp, soda /sulphate  7 906 HS3105 Mineral or chemical fertilisers",
"v": 8237.0
},
{
"hs": "HS7207",
"t": "Iron's semi-finished products  5 589 HS8708 Parts for motor vehicles 8701-8075",
"v": 8204.0
}
]
},
"Brunei": {
"aus": 14230.0,
"bip": 16639.0,
"bipJahr": 2022,
"ein": 9184.0,
"name": "Brunei Darussalam",
"pAus": [
{
"l": "Australia",
"p": 20.6
},
{
"l": "Japan",
"p": 17.4
},
{
"l": "China",
"p": 15.6
},
{
"l": "Singapore",
"p": 13.6
},
{
"l": "Malaysia",
"p": 10.1
}
],
"pEin": [
{
"l": "Malaysia",
"p": 24.0
},
{
"l": "United Arab Emirates",
"p": 12.2
},
{
"l": "China",
"p": 8.8
},
{
"l": "Qatar",
"p": 6.1
},
{
"l": "Singapore",
"p": 5.4
}
],
"pJahr": 2022,
"restAus": 22.8,
"restEin": 43.5,
"seite": 56,
"wAus": {
"agrar": 0.4,
"energie": 79.0,
"industrie": 20.6,
"sonst": 0.0
},
"wEin": {
"agrar": 7.3,
"energie": 67.2,
"industrie": 25.5,
"sonst": 0.0
},
"wJahr": 2021,
"waren": [
{
"hs": "HS2309",
"t": "Preparations of a kind used in animal feeding   7 HS2202 Waters containing added sugar",
"v": 46.0
},
{
"hs": "HS1212",
"t": "Locust beans, seaweeds and algae 0.7 HS2309 Preparations of a kind used in animal feeding",
"v": 43.0
},
{
"hs": "HS2106",
"t": "Other food preparations 0.6 HS1905 Bread, pastry,  other bakers' wares",
"v": 35.0
},
{
"hs": "HS1602",
"t": "Other prepared or preserved meat 0.5 HS1006 Rice",
"v": 26.0
},
{
"hs": "HS0807",
"t": "Melons and papaws, fresh 0.4 HS2106 Other food preparations",
"v": 19.0
},
{
"hs": "HS2710",
"t": "Petroleum oils, other than crude  5 159 HS2709 Petroleum oils, crude",
"v": 5441.0
},
{
"hs": "HS2711",
"t": "Petroleum gases  4 007 HS2710 Petroleum oils, other than crude",
"v": 596.0
},
{
"hs": "HS2709",
"t": "Petroleum oils, crude  2 170 HS8703 Motor cars for transport of persons",
"v": 192.0
},
{
"hs": "HS2902",
"t": "Cyclic hydrocarbons  2 015 HS2701 Coal; briquettes, ovoids",
"v": 185.0
},
{
"hs": "HS3102",
"t": "Nitrogenous fertilisers   249 HS8803 Parts of goods 8801, 8802",
"v": 145.0
}
]
},
"Bulgaria": {
"aus": 50239.0,
"bip": 89115.0,
"bipJahr": 2022,
"ein": 58049.0,
"name": "Bulgaria",
"pAus": [
{
"l": "European Union",
"p": 62.8
},
{
"l": "Turkey",
"p": 5.9
},
{
"l": "Serbia",
"p": 2.6
},
{
"l": "Ukraine",
"p": 2.4
},
{
"l": "United States of America",
"p": 2.2
}
],
"pEin": [
{
"l": "European Union",
"p": 55.3
},
{
"l": "Russia",
"p": 10.8
},
{
"l": "Turkey",
"p": 8.4
},
{
"l": "China",
"p": 5.8
},
{
"l": "Ukraine",
"p": 3.2
}
],
"pJahr": 2022,
"restAus": 24.1,
"restEin": 16.5,
"seite": 58,
"wAus": {
"agrar": 17.9,
"energie": 20.9,
"industrie": 58.8,
"sonst": 2.4
},
"wEin": {
"agrar": 12.0,
"energie": 20.8,
"industrie": 65.1,
"sonst": 2.0
},
"wJahr": 2021,
"waren": [
{
"hs": "HS1512",
"t": "Sunflower-seed,or cotton oil  1 663 HS1206 Sunflower seeds",
"v": 1012.0
},
{
"hs": "HS1001",
"t": "Wheat and meslin  1 453 HS1512 Sunflower-seed,or cotton oil",
"v": 461.0
},
{
"hs": "HS1206",
"t": "Sunflower seeds   725 HS0203 Swine meat, fresh, chilled, frozen",
"v": 295.0
},
{
"hs": "HS1905",
"t": "Bread, pastry,  other bakers' wares   335 HS1806 Chocolate and other cocoa food",
"v": 238.0
},
{
"hs": "HS2306",
"t": "Solid residues from other oil   333 HS1518 Animal or vegetable fats and oils",
"v": 227.0
},
{
"hs": "HS2710",
"t": "Petroleum oils, other than crude  3 964 HS2709 Petroleum oils, crude",
"v": 4124.0
},
{
"hs": "HS7403",
"t": "Refined copper and copper alloys  1 621 HS2711 Petroleum gases",
"v": 3430.0
},
{
"hs": "HS7402",
"t": "Unrefined copper  1 430 HS2603 Copper ores and concentrates",
"v": 2186.0
},
{
"hs": "HS3824",
"t": "Prepared binders for foundry moulds  1 332 HS3004 Medicaments in measured doses",
"v": 1421.0
},
{
"hs": "HS3004",
"t": "Medicaments in measured doses  1 053 HS2710 Petroleum oils, other than crude",
"v": 1339.0
}
]
},
"Burkina Faso": {
"aus": 4518.0,
"bip": 19568.0,
"bipJahr": 2022,
"ein": 5504.0,
"name": "Burkina Faso",
"pAus": [
{
"l": "Switzerland",
"p": 72.7
},
{
"l": "India",
"p": 9.6
},
{
"l": "Singapore",
"p": 3.8
},
{
"l": "Côte d'Ivoire",
"p": 3.6
},
{
"l": "European Union",
"p": 2.5
}
],
"pEin": [
{
"l": "European Union",
"p": 22.1
},
{
"l": "China",
"p": 13.9
},
{
"l": "Côte d'Ivoire",
"p": 8.5
},
{
"l": "United States of America",
"p": 6.9
},
{
"l": "Ghana",
"p": 5.9
}
],
"pJahr": 2021,
"restAus": 7.7,
"restEin": 42.8,
"seite": 60,
"wAus": {
"agrar": 15.8,
"energie": 3.7,
"industrie": 3.2,
"sonst": 77.3
},
"wEin": {
"agrar": 12.4,
"energie": 30.1,
"industrie": 57.4,
"sonst": 0.0
},
"wJahr": 2021,
"waren": [
{
"hs": "HS5201",
"t": "Cotton, not carded or combed   454 HS1001 Wheat and meslin",
"v": 75.0
},
{
"hs": "HS0801",
"t": "Coconuts, Brazil nuts, cashew nuts   116 HS1006 Rice",
"v": 71.0
},
{
"hs": "HS1207",
"t": "Other oil seeds, oleaginous fruits   106 HS2403 Other manufactured tobacco",
"v": 64.0
},
{
"hs": "HS0804",
"t": "Dates, figs, pineapples, avocados   32 HS1901 Malt extract",
"v": 42.0
},
{
"hs": "HS1515",
"t": "Other fixed vegetable fats and oils   29 HS2106 Other food preparations",
"v": 27.0
},
{
"hs": "HS7108",
"t": "Gold  3 917 HS2710 Petroleum oils, other than crude",
"v": 1075.0
},
{
"hs": "HS2608",
"t": "Zinc ores and concentrates   158 HS3004 Medicaments in measured doses",
"v": 199.0
},
{
"hs": "HS2523",
"t": "Portland cement, aluminous cement   35 HS2523 Portland cement, aluminous cement",
"v": 191.0
},
{
"hs": "HS8704",
"t": "Motor vehicles for goods transport   23 HS2716 Electrical energy",
"v": 147.0
},
{
"hs": "HS8429",
"t": "Self-propelled bulldozers   16 HS8703 Motor cars for transport of persons",
"v": 132.0
}
]
},
"Burundi": {
"aus": 199.0,
"bip": 3894.0,
"bipJahr": 2022,
"ein": 1206.0,
"name": "Burundi",
"pAus": [
{
"l": "United Arab Emirates",
"p": 28.0
},
{
"l": "Dem. Rep. Congo",
"p": 18.6
},
{
"l": "European Union",
"p": 11.5
},
{
"l": "Switzerland",
"p": 9.5
},
{
"l": "Pakistan",
"p": 4.9
}
],
"pEin": [
{
"l": "Saudi Arabia",
"p": 14.7
},
{
"l": "China",
"p": 14.1
},
{
"l": "United Arab Emirates",
"p": 13.9
},
{
"l": "European Union",
"p": 9.7
},
{
"l": "Tanzania",
"p": 9.1
}
],
"pJahr": 2022,
"restAus": 27.5,
"restEin": 38.6,
"seite": 62,
"wAus": {
"agrar": 47.5,
"energie": 11.7,
"industrie": 13.2,
"sonst": 27.6
},
"wEin": {
"agrar": 15.1,
"energie": 18.5,
"industrie": 61.7,
"sonst": 4.7
},
"wJahr": 2021,
"waren": [
{
"hs": "HS0901",
"t": "Coffee   54 HS1001 Wheat and meslin",
"v": 34.0
},
{
"hs": "HS0902",
"t": "Tea   23 HS1701 Cane or beet sugar",
"v": 26.0
},
{
"hs": "HS2402",
"t": "Cigars, cheroots, cigarillos   10 HS1006 Rice",
"v": 12.0
},
{
"hs": "HS2203",
"t": "Beer made from malt   10 HS1107 Malt, whether or not roasted",
"v": 11.0
},
{
"hs": "HS1101",
"t": "Wheat or meslin flour   9 HS2403 Other manufactured tobacco",
"v": 8.0
},
{
"hs": "HS7108",
"t": "Gold   52 HS2710 Petroleum oils, other than crude",
"v": 296.0
},
{
"hs": "HS2710",
"t": "Petroleum oils, other than crude   7 HS3103 Phosphatic fertilisers",
"v": 79.0
},
{
"hs": "HS2615",
"t": "Niobium, tantalum, vanadium or zirc   5 HS3004 Medicaments in measured doses",
"v": 44.0
},
{
"hs": "HS7210",
"t": "Flat-rolled products of iron +600   5 HS8703 Motor cars for transport of persons",
"v": 39.0
},
{
"hs": "HS7010",
"t": "Carboys, bottles, flasks, jars   5 HS2523 Portland cement, aluminous cement",
"v": 34.0
}
]
},
"Cabo Verde": {
"aus": 46.0,
"bip": 2224.0,
"bipJahr": 2022,
"ein": 882.0,
"name": "Cabo Verde",
"pAus": [
{
"l": "European Union",
"p": 92.9
},
{
"l": "United States of America",
"p": 5.6
},
{
"l": "Morocco",
"p": 1.0
},
{
"l": "Guinea-Bissau",
"p": 0.4
},
{
"l": "Tunisia",
"p": 0.0
}
],
"pEin": [
{
"l": "European Union",
"p": 79.6
},
{
"l": "China",
"p": 6.1
},
{
"l": "United States of America",
"p": 3.2
},
{
"l": "Brazil",
"p": 2.3
},
{
"l": "Argentina",
"p": 0.9
}
],
"pJahr": 2020,
"restAus": 0.1,
"restEin": 7.8,
"seite": 64,
"wAus": {
"agrar": 66.2,
"energie": 7.1,
"industrie": 26.4,
"sonst": 0.3
},
"wEin": {
"agrar": 27.0,
"energie": 12.3,
"industrie": 59.0,
"sonst": 1.7
},
"wJahr": 2021,
"waren": [
{
"hs": "HS2208",
"t": "Alcohol of less than 80% volume 1.0 HS1006 Rice",
"v": 18.0
},
{
"hs": "HS1905",
"t": "Bread, pastry,  other bakers' wares 0.4 HS0402 Milk and cream, concentrated",
"v": 17.0
},
{
"hs": "HS0407",
"t": "Birds' eggs, in shell 0.1 HS0207 Meat and edible offal of poultry",
"v": 15.0
},
{
"hs": "HS0405",
"t": "Butter and other fats and oils 0.1 HS2106 Other food preparations",
"v": 10.0
},
{
"hs": "HS2201",
"t": "Waters, natural or artificial 0.03 HS2203 Beer made from malt",
"v": 10.0
},
{
"hs": "HS1604",
"t": "Prepared or preserved fish   33 HS2710 Petroleum oils, other than crude",
"v": 363.0
},
{
"hs": "HS0303",
"t": "Fish, frozen, excluding fish fillet   9 HS8609 Containers designed for transport",
"v": 41.0
},
{
"hs": "HS6406",
"t": "Parts of footwear   3 HS2523 Portland cement, aluminous cement",
"v": 31.0
},
{
"hs": "HS6107",
"t": "Men's or boys' underpants   1 HS8703 Motor cars for transport of persons",
"v": 26.0
},
{
"hs": "HS6109",
"t": "T-shirts, singlets and other vests   1 HS7214 Other iron bar not further worked",
"v": 19.0
}
]
},
"Cambodia": {
"aus": 22472.0,
"bip": 28544.0,
"bipJahr": 2022,
"ein": 29805.0,
"name": "Cambodia",
"pAus": [
{
"l": "United States of America",
"p": 42.6
},
{
"l": "European Union",
"p": 18.4
},
{
"l": "China",
"p": 8.6
},
{
"l": "Japan",
"p": 6.2
},
{
"l": "Canada",
"p": 5.4
}
],
"pEin": [
{
"l": "China",
"p": 33.7
},
{
"l": "Singapore",
"p": 17.8
},
{
"l": "Thailand",
"p": 12.1
},
{
"l": "Vietnam",
"p": 11.0
},
{
"l": "Taiwan",
"p": 3.4
}
],
"pJahr": 2021,
"restAus": 18.7,
"restEin": 22.1,
"seite": 66,
"wAus": {
"agrar": 7.8,
"energie": 1.0,
"industrie": 91.2,
"sonst": 0.0
},
"wEin": {
"agrar": 7.8,
"energie": 10.7,
"industrie": 61.3,
"sonst": 20.3
},
"wJahr": 2021,
"waren": [
{
"hs": "HS1006",
"t": "Rice   423 HS4301 Raw furskins",
"v": 475.0
},
{
"hs": "HS0803",
"t": "Bananas, including plantains   168 HS2202 Waters containing added sugar",
"v": 257.0
},
{
"hs": "HS2006",
"t": "Plants' parts preserved by sugar   53 HS2402 Cigars, cheroots, cigarillos",
"v": 212.0
},
{
"hs": "HS1511",
"t": "Palm oil and its fractions   51 HS2309 Preparations of a kind used in animal feeding",
"v": 136.0
},
{
"hs": "HS1701",
"t": "Cane or beet sugar   44 HS1005 Maize (corn)",
"v": 80.0
},
{
"hs": "HS4202",
"t": "Trunks, suit-cases, vanity-cases  1 495 HS7108 Gold",
"v": 5940.0
},
{
"hs": "HS6110",
"t": "Jerseys, pullovers, cardigans  1 345 HS6006 Other knitted or crocheted fabrics",
"v": 1848.0
},
{
"hs": "HS6104",
"t": "Women's or girls' suits, ensembles  1 183 HS2710 Petroleum oils, other than crude",
"v": 1594.0
},
{
"hs": "HS6204",
"t": "Women's or girls' suits   784 HS6004 Knitted fabrics over 30",
"v": 1041.0
},
{
"hs": "HS6109",
"t": "T-shirts, singlets and other vests   739 HS5515 Other woven fabrics of synthetic",
"v": 826.0
}
]
},
"Cameroon": {
"aus": 5900.0,
"bip": 43716.0,
"bipJahr": 2022,
"ein": 7800.0,
"name": "Cameroon",
"pAus": [
{
"l": "European Union",
"p": 43.4
},
{
"l": "China",
"p": 24.8
},
{
"l": "India",
"p": 5.5
},
{
"l": "Bangladesh",
"p": 3.3
},
{
"l": "Vietnam",
"p": 3.1
}
],
"pEin": [
{
"l": "European Union",
"p": 28.1
},
{
"l": "China",
"p": 18.5
},
{
"l": "Nigeria",
"p": 5.6
},
{
"l": "Thailand",
"p": 4.2
},
{
"l": "United States of America",
"p": 3.9
}
],
"pJahr": 2018,
"restAus": 19.9,
"restEin": 39.7,
"seite": 68,
"wAus": {
"agrar": 36.0,
"energie": 55.9,
"industrie": 6.1,
"sonst": 2.0
},
"wEin": {
"agrar": 18.4,
"energie": 5.9,
"industrie": 75.1,
"sonst": 0.6
},
"wJahr": 2021,
"waren": [
{
"hs": "HS1801",
"t": "Cocoa beans, whole or broken   420 HS1006 Rice",
"v": 260.0
},
{
"hs": "HS5201",
"t": "Cotton, not carded or combed   211 HS1001 Wheat and meslin",
"v": 209.0
},
{
"hs": "HS1803",
"t": "Cocoa paste   73 HS1107 Malt, whether or not roasted",
"v": 49.0
},
{
"hs": "HS0803",
"t": "Bananas, including plantains   62 HS0402 Milk and cream, concentrated",
"v": 49.0
},
{
"hs": "HS1804",
"t": "Cocoa butter, fat and oil   49 HS1511 Palm oil and its fractions",
"v": 44.0
},
{
"hs": "HS2709",
"t": "Petroleum oils, crude  1 553 HS2710 Petroleum oils, other than crude",
"v": 853.0
},
{
"hs": "HS4407",
"t": "Wood sawn or chipped lengthwise   284 HS2709 Petroleum oils, crude",
"v": 311.0
},
{
"hs": "HS2711",
"t": "Petroleum gases   225 HS0303 Fish, frozen, excluding fish fillet",
"v": 278.0
},
{
"hs": "HS4403",
"t": "Wood in the rough   218 HS3004 Medicaments in measured doses",
"v": 207.0
},
{
"hs": "HS7601",
"t": "Unwrought aluminium   122 HS2523 Portland cement, aluminous cement",
"v": 162.0
}
]
},
"Canada": {
"aus": 599056.0,
"bip": 2139840.0,
"bipJahr": 2022,
"ein": 581937.0,
"name": "Canada",
"pAus": [
{
"l": "United States of America",
"p": 76.9
},
{
"l": "European Union",
"p": 4.6
},
{
"l": "China",
"p": 3.7
},
{
"l": "United Kingdom",
"p": 2.4
},
{
"l": "Japan",
"p": 2.3
}
],
"pEin": [
{
"l": "United States of America",
"p": 49.2
},
{
"l": "China",
"p": 13.5
},
{
"l": "European Union",
"p": 10.8
},
{
"l": "Mexico",
"p": 5.5
},
{
"l": "Japan",
"p": 2.3
}
],
"pJahr": 2022,
"restAus": 10.1,
"restEin": 18.7,
"seite": 70,
"wAus": {
"agrar": 17.2,
"energie": 31.8,
"industrie": 42.1,
"sonst": 8.9
},
"wEin": {
"agrar": 9.6,
"energie": 10.4,
"industrie": 75.4,
"sonst": 4.7
},
"wJahr": 2021,
"waren": [
{
"hs": "HS1001",
"t": "Wheat and meslin  7 945 HS2204 Wine of fresh grapes",
"v": 2270.0
},
{
"hs": "HS1514",
"t": "Rape, colza or mustard oil  4 849 HS1905 Bread, pastry,  other bakers' wares",
"v": 2041.0
},
{
"hs": "HS1905",
"t": "Bread, pastry,  other bakers' wares  4 756 HS2106 Other food preparations",
"v": 2040.0
},
{
"hs": "HS1205",
"t": "Rape or colza seeds  4 392 HS0901 Coffee",
"v": 1912.0
},
{
"hs": "HS0713",
"t": "Dried leguminous vegetables  3 327 HS2309 Preparations of a kind used in animal feeding",
"v": 1651.0
},
{
"hs": "HS2709",
"t": "Petroleum oils, crude  119 775 HS8703 Motor cars for transport of persons",
"v": 32571.0
},
{
"hs": "HS8703",
"t": "Motor cars for transport of persons  29 437 HS2710 Petroleum oils, other than crude",
"v": 20245.0
},
{
"hs": "HS2711",
"t": "Petroleum gases  24 270 HS8704 Motor vehicles for goods transport",
"v": 18651.0
},
{
"hs": "HS2710",
"t": "Petroleum oils, other than crude  17 004 HS8708 Parts for motor vehicles 8701-8075",
"v": 16926.0
},
{
"hs": "HS7108",
"t": "Gold  15 193 HS2709 Petroleum oils, crude",
"v": 16529.0
}
]
},
"Cayman Is.": {
"aus": 25.0,
"ein": 1906.0,
"name": "Cayman Islands",
"pAus": [
{
"l": "United States of America",
"p": 77.8
},
{
"l": "Jamaica",
"p": 13.1
},
{
"l": "United Kingdom",
"p": 9.1
}
],
"pEin": [
{
"l": "United States of America",
"p": 81.5
},
{
"l": "Jamaica",
"p": 3.4
},
{
"l": "United Kingdom",
"p": 2.5
},
{
"l": "European Union",
"p": 2.4
},
{
"l": "Mexico",
"p": 1.3
}
],
"pJahr": 2022,
"restAus": 0.0,
"restEin": 9.0,
"seite": 72,
"wAus": {
"agrar": 3.9,
"energie": 12.0,
"industrie": 41.7,
"sonst": 42.4
},
"wEin": {
"agrar": 20.3,
"energie": 11.5,
"industrie": 65.0,
"sonst": 3.3
},
"wJahr": 2021,
"waren": [
{
"hs": "HS0904",
"t": "Pepper of the genus Piper 0.5 HS2106 Other food preparations",
"v": 34.0
},
{
"hs": "HS3301",
"t": "Essential oils (terpeneless or not) 0.2 HS2204 Wine of fresh grapes",
"v": 20.0
},
{
"hs": "HS2402",
"t": "Cigars, cheroots, cigarillos 0.2 HS0207 Meat and edible offal of poultry",
"v": 16.0
},
{
"hs": "HS1209",
"t": "Seeds, fruit and spores for sowing 0.1 HS1905 Bread, pastry,  other bakers' wares",
"v": 14.0
},
{
"hs": "HS0906",
"t": "Cinnamon and cinnamon-tree flowers 0.1 HS0201 Bovine meat, fresh, chilled",
"v": 10.0
},
{
"hs": "HS8525",
"t": "Radio-telephony transmission tools   7 HS2710 Petroleum oils, other than crude",
"v": 149.0
},
{
"hs": "HS7204",
"t": "Ferrous waste and scrap   2 HS8703 Motor cars for transport of persons",
"v": 76.0
},
{
"hs": "HS7404",
"t": "Copper waste and scrap 0.9 HS9403 Other furniture and parts thereof",
"v": 50.0
},
{
"hs": "HS3821",
"t": "Prepared culture media 0.8 HS3924 Household and toilet articles",
"v": 35.0
},
{
"hs": "HS9031",
"t": "Other measuring instruments 0.7 HS7108 Gold",
"v": 27.0
}
]
},
"Central African Rep.": {
"aus": 143.0,
"bip": 2462.0,
"bipJahr": 2022,
"ein": 496.0,
"name": "Central African Republic",
"pAus": [
{
"l": "European Union",
"p": 30.8
},
{
"l": "United Arab Emirates",
"p": 24.6
},
{
"l": "Switzerland",
"p": 8.1
},
{
"l": "Uganda",
"p": 7.0
},
{
"l": "China",
"p": 7.0
}
],
"pEin": [
{
"l": "European Union",
"p": 35.0
},
{
"l": "Cameroon",
"p": 26.2
},
{
"l": "China",
"p": 17.1
},
{
"l": "United States of America",
"p": 3.6
},
{
"l": "India",
"p": 3.4
}
],
"pJahr": 2020,
"restAus": 22.5,
"restEin": 14.7,
"seite": 74,
"wAus": {
"agrar": 3.8,
"energie": 0.3,
"industrie": 16.9,
"sonst": 79.0
},
"wEin": {
"agrar": 15.3,
"energie": 15.4,
"industrie": 68.9,
"sonst": 0.4
},
"wJahr": 2021,
"waren": [
{
"hs": "HS5203",
"t": "Cotton, carded or combed 0.3 HS1006 Rice",
"v": 11.0
},
{
"hs": "HS1103",
"t": "Cereal groats, meal and pellets 0.2 HS2106 Other food preparations",
"v": 10.0
},
{
"hs": "HS1521",
"t": "Vegetable waxes 0.03 HS1701 Cane or beet sugar",
"v": 7.0
},
{
"hs": "HS1207",
"t": "Other oil seeds, oleaginous fruits 0.02 HS0207 Meat and edible offal of poultry",
"v": 7.0
},
{
"hs": "HS4101",
"t": "Raw hides and skins of bovine 0.01 HS1101 Wheat or meslin flour",
"v": 4.0
},
{
"hs": "HS7108",
"t": "Gold   10 HS2710 Petroleum oils, other than crude",
"v": 68.0
},
{
"hs": "HS8704",
"t": "Motor vehicles for goods transport   9 HS8703 Motor cars for transport of persons",
"v": 44.0
},
{
"hs": "HS7102",
"t": "Diamonds, whether or not worked   7 HS3004 Medicaments in measured doses",
"v": 32.0
},
{
"hs": "HS4403",
"t": "Wood in the rough   5 HS8704 Motor vehicles for goods transport",
"v": 20.0
},
{
"hs": "HS4407",
"t": "Wood sawn or chipped lengthwise   3 HS3002 Human and animal blood",
"v": 20.0
}
]
},
"Chad": {
"aus": 3500.0,
"bip": 11909.0,
"bipJahr": 2022,
"ein": 2100.0,
"name": "Chad",
"seite": 76,
"waren": []
},
"Chile": {
"aus": 98549.0,
"bip": 300729.0,
"bipJahr": 2022,
"ein": 104529.0,
"name": "Chile",
"pAus": [
{
"l": "China",
"p": 39.4
},
{
"l": "United States of America",
"p": 13.9
},
{
"l": "European Union",
"p": 7.8
},
{
"l": "Japan",
"p": 7.6
},
{
"l": "South Korea",
"p": 6.2
}
],
"pEin": [
{
"l": "China",
"p": 25.3
},
{
"l": "United States of America",
"p": 20.9
},
{
"l": "European Union",
"p": 11.1
},
{
"l": "Brazil",
"p": 9.7
},
{
"l": "Argentina",
"p": 5.8
}
],
"pJahr": 2022,
"restAus": 25.1,
"restEin": 27.2,
"seite": 78,
"wAus": {
"agrar": 25.3,
"energie": 63.0,
"industrie": 10.7,
"sonst": 0.9
},
"wEin": {
"agrar": 12.1,
"energie": 17.0,
"industrie": 70.7,
"sonst": 0.2
},
"wJahr": 2021,
"waren": [
{
"hs": "HS0809",
"t": "Apricots, cherries, peaches  2 395 HS0201 Bovine meat, fresh, chilled",
"v": 1298.0
},
{
"hs": "HS2204",
"t": "Wine of fresh grapes  1 912 HS1005 Maize (corn)",
"v": 855.0
},
{
"hs": "HS0806",
"t": "Grapes, fresh or dried  1 172 HS2304 Solid residues from soya-bean oil",
"v": 586.0
},
{
"hs": "HS0808",
"t": "Apples, pears and quinces, fresh   709 HS1001 Wheat and meslin",
"v": 521.0
},
{
"hs": "HS0207",
"t": "Meat and edible offal of poultry   700 HS2309 Preparations of a kind used in animal feeding",
"v": 500.0
},
{
"hs": "HS2603",
"t": "Copper ores and concentrates  22 719 HS2710 Petroleum oils, other than crude",
"v": 12428.0
},
{
"hs": "HS7403",
"t": "Refined copper and copper alloys  18 233 HS8703 Motor cars for transport of persons",
"v": 5222.0
},
{
"hs": "HS2836",
"t": "Carbonates; peroxocarbonates  7 764 HS2709 Petroleum oils, crude",
"v": 4924.0
},
{
"hs": "HS0304",
"t": "Fish fillets and other fish meat  3 912 HS8704 Motor vehicles for goods transport",
"v": 3624.0
},
{
"hs": "HS7402",
"t": "Unrefined copper  2 898 HS2711 Petroleum gases",
"v": 3475.0
}
]
},
"China": {
"aus": 3593523.0,
"bip": 18100044.0,
"bipJahr": 2022,
"ein": 2716151.0,
"name": "China",
"pAus": [
{
"l": "United States of America",
"p": 16.2
},
{
"l": "European Union",
"p": 15.7
},
{
"l": "Hong Kong",
"p": 8.3
},
{
"l": "Japan",
"p": 4.8
},
{
"l": "South Korea",
"p": 4.5
}
],
"pEin": [
{
"l": "European Union",
"p": 10.5
},
{
"l": "Taiwan",
"p": 8.8
},
{
"l": "South Korea",
"p": 7.4
},
{
"l": "Japan",
"p": 6.8
},
{
"l": "United States of America",
"p": 6.6
}
],
"pJahr": 2022,
"restAus": 50.5,
"restEin": 60.0,
"seite": 80,
"wAus": {
"agrar": 2.6,
"energie": 2.6,
"industrie": 93.5,
"sonst": 1.3
},
"wEin": {
"agrar": 10.1,
"energie": 29.4,
"industrie": 58.1,
"sonst": 2.4
},
"wJahr": 2021,
"waren": [
{
"hs": "HS2106",
"t": "Other food preparations  3 269 HS1201 Soya beans, whether or not broken",
"v": 61236.0
},
{
"hs": "HS2309",
"t": "Preparations of a kind used in animal feeding  2 987 HS0202 Meat of bovine animals, frozen",
"v": 17084.0
},
{
"hs": "HS2008",
"t": "Plants' parts otherwise preserved  2 944 HS1005 Maize (corn)",
"v": 7104.0
},
{
"hs": "HS1302",
"t": "Vegetable saps and extracts  2 753 HS0810 Other fruit, fresh",
"v": 6102.0
},
{
"hs": "HS0703",
"t": "Onions, shallots, garlic, leeks  2 404 HS1511 Palm oil and its fractions",
"v": 5842.0
},
{
"hs": "HS8525",
"t": "Radio-telephony transmission tools  248 409 HS8542 Electronic integrated circuits",
"v": 416886.0
},
{
"hs": "HS8471",
"t": "Automatic data-processing machines  210 062 HS2709 Petroleum oils, crude",
"v": 365512.0
},
{
"hs": "HS8542",
"t": "Electronic integrated circuits  156 305 HS2601 Iron ores and concentrates",
"v": 128097.0
},
{
"hs": "HS8541",
"t": "Diodes, transistors devices  65 483 HS2711 Petroleum gases",
"v": 90727.0
},
{
"hs": "HS8507",
"t": "Electric accumulators  57 228 HS7108 Gold",
"v": 76654.0
}
]
},
"Colombia": {
"aus": 56999.0,
"bip": 343939.0,
"bipJahr": 2022,
"ein": 77413.0,
"name": "Colombia",
"pAus": [
{
"l": "United States of America",
"p": 28.1
},
{
"l": "European Union",
"p": 10.8
},
{
"l": "China",
"p": 8.8
},
{
"l": "Panama",
"p": 5.8
},
{
"l": "India",
"p": 5.4
}
],
"pEin": [
{
"l": "China",
"p": 24.2
},
{
"l": "United States of America",
"p": 23.2
},
{
"l": "European Union",
"p": 13.5
},
{
"l": "Mexico",
"p": 6.2
},
{
"l": "Brazil",
"p": 5.7
}
],
"pJahr": 2021,
"restAus": 41.1,
"restEin": 27.1,
"seite": 82,
"wAus": {
"agrar": 23.4,
"energie": 49.3,
"industrie": 22.2,
"sonst": 5.1
},
"wEin": {
"agrar": 14.8,
"energie": 8.1,
"industrie": 76.0,
"sonst": 1.2
},
"wJahr": 2021,
"waren": [
{
"hs": "HS0901",
"t": "Coffee  3 189 HS1005 Maize (corn)",
"v": 1776.0
},
{
"hs": "HS0603",
"t": "Cut flowers and flower buds  1 727 HS2304 Solid residues from soya-bean oil",
"v": 759.0
},
{
"hs": "HS0803",
"t": "Bananas, including plantains  1 017 HS1001 Wheat and meslin",
"v": 655.0
},
{
"hs": "HS1511",
"t": "Palm oil and its fractions   469 HS1507 Soya-bean oil and its fractions",
"v": 395.0
},
{
"hs": "HS1701",
"t": "Cane or beet sugar   318 HS0203 Swine meat, fresh, chilled, frozen",
"v": 302.0
},
{
"hs": "HS2709",
"t": "Petroleum oils, crude  11 201 HS2710 Petroleum oils, other than crude",
"v": 3515.0
},
{
"hs": "HS2701",
"t": "Coal; briquettes, ovoids  4 380 HS8525 Radio-telephony transmission tools",
"v": 2721.0
},
{
"hs": "HS7108",
"t": "Gold  3 132 HS8703 Motor cars for transport of persons",
"v": 2344.0
},
{
"hs": "HS2710",
"t": "Petroleum oils, other than crude  2 144 HS3004 Medicaments in measured doses",
"v": 1832.0
},
{
"hs": "HS2704",
"t": "Coke and semi-coke of coal  1 272 HS3002 Human and animal blood",
"v": 1810.0
}
]
},
"Comoros": {
"aus": 54.0,
"bip": 1233.0,
"bipJahr": 2022,
"ein": 348.0,
"name": "Comoros",
"pAus": [
{
"l": "European Union",
"p": 28.8
},
{
"l": "India",
"p": 24.7
},
{
"l": "Tanzania",
"p": 21.3
},
{
"l": "United States of America",
"p": 5.6
},
{
"l": "Madagascar",
"p": 4.6
}
],
"pEin": [
{
"l": "United Arab Emirates",
"p": 43.4
},
{
"l": "European Union",
"p": 17.9
},
{
"l": "Pakistan",
"p": 7.2
},
{
"l": "China",
"p": 6.4
},
{
"l": "India",
"p": 4.3
}
],
"pJahr": 2021,
"restAus": 15.0,
"restEin": 20.8,
"seite": 84,
"wAus": {
"agrar": 52.2,
"energie": 6.6,
"industrie": 41.0,
"sonst": 0.2
},
"wEin": {
"agrar": 38.2,
"energie": 11.7,
"industrie": 49.9,
"sonst": 0.3
},
"wJahr": 2021,
"waren": [
{
"hs": "HS0907",
"t": "Cloves   14 HS1006 Rice",
"v": 34.0
},
{
"hs": "HS3301",
"t": "Essential oils (terpeneless or not)   6 HS0207 Meat and edible offal of poultry",
"v": 30.0
},
{
"hs": "HS0905",
"t": "Vanilla   5 HS1101 Wheat or meslin flour",
"v": 7.0
},
{
"hs": "HS2402",
"t": "Cigars, cheroots, cigarillos 0.03 HS0402 Milk and cream, concentrated",
"v": 5.0
},
{
"hs": "HS1806",
"t": "Chocolate and other cocoa food 0.02 HS2202 Waters containing added sugar",
"v": 5.0
},
{
"hs": "HS8903",
"t": "Vessels for pleasure or sports   3 HS2710 Petroleum oils, other than crude",
"v": 148.0
},
{
"hs": "HS8407",
"t": "Spark-ignition piston engines   2 HS2523 Portland cement, aluminous cement",
"v": 25.0
},
{
"hs": "HS7602",
"t": "Aluminium waste and scrap   2 HS8703 Motor cars for transport of persons",
"v": 25.0
},
{
"hs": "HS7311",
"t": "Containers for gas, of iron/steel 0.7 HS7214 Other iron bar not further worked",
"v": 10.0
},
{
"hs": "HS8704",
"t": "Motor vehicles for goods transport 0.4 HS8525 Radio-telephony transmission tools",
"v": 8.0
}
]
},
"Congo": {
"aus": 10661.0,
"bip": 12530.0,
"bipJahr": 2022,
"ein": 3060.0,
"name": "Congo",
"pAus": [
{
"l": "China",
"p": 45.8
},
{
"l": "Côte d'Ivoire",
"p": 8.6
},
{
"l": "Togo",
"p": 7.5
},
{
"l": "European Union",
"p": 6.4
},
{
"l": "Cameroon",
"p": 5.4
}
],
"pEin": [
{
"l": "European Union",
"p": 30.8
},
{
"l": "China",
"p": 19.6
},
{
"l": "Russia",
"p": 4.4
},
{
"l": "United States of America",
"p": 4.2
},
{
"l": "Namibia",
"p": 3.7
}
],
"pJahr": 2021,
"restAus": 26.4,
"restEin": 37.4,
"seite": 86,
"wAus": {
"agrar": 5.1,
"energie": 20.2,
"industrie": 8.5,
"sonst": 66.1
},
"wEin": {
"agrar": 33.8,
"energie": 5.3,
"industrie": 60.6,
"sonst": 0.2
},
"wJahr": 2021,
"waren": [
{
"hs": "HS2302",
"t": "Bran, sharps and other residues   4 HS0207 Meat and edible offal of poultry",
"v": 162.0
},
{
"hs": "HS1701",
"t": "Cane or beet sugar   3 HS1001 Wheat and meslin",
"v": 95.0
},
{
"hs": "HS2204",
"t": "Wine of fresh grapes   2 HS1511 Palm oil and its fractions",
"v": 57.0
},
{
"hs": "HS1801",
"t": "Cocoa beans, whole or broken   1 HS380910 #N/A",
"v": 48.0
},
{
"hs": "HS1103",
"t": "Cereal groats, meal and pellets   1 HS1901 Malt extract",
"v": 42.0
},
{
"hs": "HS2709",
"t": "Petroleum oils, crude  1 072 HS8905 Vessels not mainly for navigability",
"v": 119.0
},
{
"hs": "HS2710",
"t": "Petroleum oils, other than crude   217 HS8901 Vessels for transport",
"v": 95.0
},
{
"hs": "HS8905",
"t": "Vessels not mainly for navigability   170 HS2710 Petroleum oils, other than crude",
"v": 91.0
},
{
"hs": "HS4403",
"t": "Wood in the rough   168 HS3004 Medicaments in measured doses",
"v": 74.0
},
{
"hs": "HS4407",
"t": "Wood sawn or chipped lengthwise   164 HS8703 Motor cars for transport of persons",
"v": 68.0
}
]
},
"Costa Rica": {
"aus": 17752.0,
"bip": 68385.0,
"bipJahr": 2022,
"ein": 22685.0,
"name": "Costa Rica",
"pAus": [
{
"l": "United States of America",
"p": 43.7
},
{
"l": "European Union",
"p": 18.4
},
{
"l": "Guatemala",
"p": 4.9
},
{
"l": "Panama",
"p": 4.1
},
{
"l": "Nicaragua",
"p": 4.0
}
],
"pEin": [
{
"l": "United States of America",
"p": 37.8
},
{
"l": "China",
"p": 15.9
},
{
"l": "European Union",
"p": 9.3
},
{
"l": "Mexico",
"p": 6.4
},
{
"l": "Guatemala",
"p": 2.7
}
],
"pJahr": 2021,
"restAus": 25.0,
"restEin": 27.9,
"seite": 88,
"wAus": {
"agrar": 35.4,
"energie": 1.6,
"industrie": 55.4,
"sonst": 7.6
},
"wEin": {
"agrar": 12.7,
"energie": 9.8,
"industrie": 66.4,
"sonst": 11.1
},
"wJahr": 2021,
"waren": [
{
"hs": "HS0803",
"t": "Bananas, including plantains  1 075 HS1005 Maize (corn)",
"v": 315.0
},
{
"hs": "HS0804",
"t": "Dates, figs, pineapples, avocados  1 050 HS1201 Soya beans, whether or not broken",
"v": 169.0
},
{
"hs": "HS2106",
"t": "Other food preparations   652 HS2106 Other food preparations",
"v": 145.0
},
{
"hs": "HS0901",
"t": "Coffee   332 HS2309 Preparations of a kind used in animal feeding",
"v": 115.0
},
{
"hs": "HS1511",
"t": "Palm oil and its fractions   222 HS1001 Wheat and meslin",
"v": 93.0
},
{
"hs": "HS9018",
"t": "Instruments for medical sciences  4 097 HS2710 Petroleum oils, other than crude",
"v": 1530.0
},
{
"hs": "HS9021",
"t": "Orthopaedic appliances   851 HS3004 Medicaments in measured doses",
"v": 632.0
},
{
"hs": "HS8544",
"t": "Insulated electric conductors   249 HS8703 Motor cars for transport of persons",
"v": 514.0
},
{
"hs": "HS4011",
"t": "New pneumatic tyres, of rubber   200 HS9018 Instruments for medical sciences",
"v": 475.0
},
{
"hs": "HS3002",
"t": "Human and animal blood   175 HS8525 Radio-telephony transmission tools",
"v": 471.0
}
]
},
"Croatia": {
"aus": 25306.0,
"bip": 71019.0,
"bipJahr": 2022,
"ein": 44301.0,
"name": "Croatia",
"pAus": [
{
"l": "European Union",
"p": 68.7
},
{
"l": "Bosnia and Herz.",
"p": 10.4
},
{
"l": "Serbia",
"p": 6.2
},
{
"l": "United States of America",
"p": 2.3
},
{
"l": "Turkey",
"p": 1.5
}
],
"pEin": [
{
"l": "European Union",
"p": 70.6
},
{
"l": "United States of America",
"p": 7.6
},
{
"l": "Serbia",
"p": 3.5
},
{
"l": "Bosnia and Herz.",
"p": 3.4
},
{
"l": "China",
"p": 3.3
}
],
"pJahr": 2022,
"restAus": 10.9,
"restEin": 11.6,
"seite": 92,
"wAus": {
"agrar": 19.0,
"energie": 20.3,
"industrie": 59.8,
"sonst": 1.0
},
"wEin": {
"agrar": 13.8,
"energie": 19.0,
"industrie": 67.1,
"sonst": 0.1
},
"wJahr": 2021,
"waren": [
{
"hs": "HS1005",
"t": "Maize (corn)   318 HS0203 Swine meat, fresh, chilled, frozen",
"v": 262.0
},
{
"hs": "HS1806",
"t": "Chocolate and other cocoa food   231 HS1905 Bread, pastry,  other bakers' wares",
"v": 247.0
},
{
"hs": "HS1001",
"t": "Wheat and meslin   210 HS2309 Preparations of a kind used in animal feeding",
"v": 245.0
},
{
"hs": "HS1905",
"t": "Bread, pastry,  other bakers' wares   143 HS1806 Chocolate and other cocoa food",
"v": 204.0
},
{
"hs": "HS2106",
"t": "Other food preparations   131 HS0406 Cheese and curd",
"v": 192.0
},
{
"hs": "HS2710",
"t": "Petroleum oils, other than crude  1 587 HS2711 Petroleum gases",
"v": 4128.0
},
{
"hs": "HS2716",
"t": "Electrical energy  1 485 HS2710 Petroleum oils, other than crude",
"v": 3025.0
},
{
"hs": "HS2711",
"t": "Petroleum gases  1 410 HS2716 Electrical energy",
"v": 2246.0
},
{
"hs": "HS3004",
"t": "Medicaments in measured doses   693 HS8703 Motor cars for transport of persons",
"v": 1504.0
},
{
"hs": "HS4407",
"t": "Wood sawn or chipped lengthwise   578 HS2709 Petroleum oils, crude",
"v": 1293.0
}
]
},
"Cuba": {
"aus": 1763.0,
"ein": 8431.0,
"name": "Cuba",
"pAus": [
{
"l": "Venezuela",
"p": 12.8
},
{
"l": "European Union",
"p": 9.4
},
{
"l": "Russia",
"p": 3.2
},
{
"l": "Bolivia",
"p": 1.6
},
{
"l": "Mexico",
"p": 1.2
}
],
"pEin": [
{
"l": "European Union",
"p": 21.4
},
{
"l": "China",
"p": 13.4
},
{
"l": "United States of America",
"p": 4.5
},
{
"l": "Canada",
"p": 3.5
},
{
"l": "Brazil",
"p": 3.1
}
],
"pJahr": 2006,
"restAus": 71.7,
"restEin": 54.1,
"seite": 94,
"waren": []
},
"Curaçao": {
"aus": 553.0,
"ein": 2023.0,
"name": "Curaçao",
"seite": 96,
"waren": []
},
"Cyprus": {
"aus": 4342.0,
"bip": 28467.0,
"bipJahr": 2022,
"ein": 12015.0,
"name": "Cyprus",
"pAus": [
{
"l": "European Union",
"p": 21.1
},
{
"l": "Hong Kong",
"p": 10.7
},
{
"l": "Lebanon",
"p": 7.5
},
{
"l": "Liberia",
"p": 5.8
},
{
"l": "United Kingdom",
"p": 5.6
}
],
"pEin": [
{
"l": "European Union",
"p": 60.3
},
{
"l": "China",
"p": 8.0
},
{
"l": "Israel",
"p": 7.4
},
{
"l": "United Kingdom",
"p": 3.1
},
{
"l": "Singapore",
"p": 2.2
}
],
"pJahr": 2022,
"restAus": 49.4,
"restEin": 19.0,
"seite": 98,
"wAus": {
"agrar": 14.7,
"energie": 22.8,
"industrie": 61.1,
"sonst": 1.5
},
"wEin": {
"agrar": 15.5,
"energie": 20.7,
"industrie": 62.6,
"sonst": 1.2
},
"wJahr": 2021,
"waren": [
{
"hs": "HS0406",
"t": "Cheese and curd   304 HS1005 Maize (corn)",
"v": 117.0
},
{
"hs": "HS0701",
"t": "Potatoes, fresh or chilled   45 HS2202 Waters containing added sugar",
"v": 83.0
},
{
"hs": "HS2009",
"t": "Fruit juices and vegetable juices   36 HS2304 Solid residues from soya-bean oil",
"v": 79.0
},
{
"hs": "HS2402",
"t": "Cigars, cheroots, cigarillos   34 HS2402 Cigars, cheroots, cigarillos",
"v": 77.0
},
{
"hs": "HS2202",
"t": "Waters containing added sugar   16 HS0406 Cheese and curd",
"v": 76.0
},
{
"hs": "HS8901",
"t": "Vessels for transport  1 317 HS2710 Petroleum oils, other than crude",
"v": 2257.0
},
{
"hs": "HS2710",
"t": "Petroleum oils, other than crude   891 HS8901 Vessels for transport",
"v": 917.0
},
{
"hs": "HS3004",
"t": "Medicaments in measured doses   391 HS8703 Motor cars for transport of persons",
"v": 492.0
},
{
"hs": "HS3302",
"t": "Odoriferous substances and mixture   111 HS2707 Coal tars",
"v": 407.0
},
{
"hs": "HS8533",
"t": "Electrical resistors   107 HS3004 Medicaments in measured doses",
"v": 365.0
}
]
},
"Czechia": {
"aus": 241931.0,
"bip": 290397.0,
"bipJahr": 2022,
"ein": 236276.0,
"name": "Czech Republic",
"pAus": [
{
"l": "European Union",
"p": 81.5
},
{
"l": "United Kingdom",
"p": 3.6
},
{
"l": "United States of America",
"p": 2.5
},
{
"l": "Switzerland",
"p": 1.4
},
{
"l": "China",
"p": 1.1
}
],
"pEin": [
{
"l": "European Union",
"p": 54.6
},
{
"l": "China",
"p": 18.8
},
{
"l": "Russia",
"p": 4.8
},
{
"l": "United States of America",
"p": 2.6
},
{
"l": "South Korea",
"p": 1.9
}
],
"pJahr": 2022,
"restAus": 9.8,
"restEin": 17.2,
"seite": 100,
"wAus": {
"agrar": 6.1,
"energie": 3.9,
"industrie": 89.2,
"sonst": 0.8
},
"wEin": {
"agrar": 6.6,
"energie": 9.2,
"industrie": 83.7,
"sonst": 0.4
},
"wJahr": 2021,
"waren": [
{
"hs": "HS2309",
"t": "Preparations of a kind used in animal feeding   912 HS0203 Swine meat, fresh, chilled, frozen",
"v": 789.0
},
{
"hs": "HS1001",
"t": "Wheat and meslin   763 HS2106 Other food preparations",
"v": 612.0
},
{
"hs": "HS2106",
"t": "Other food preparations   689 HS2309 Preparations of a kind used in animal feeding",
"v": 600.0
},
{
"hs": "HS2402",
"t": "Cigars, cheroots, cigarillos   661 HS1905 Bread, pastry,  other bakers' wares",
"v": 579.0
},
{
"hs": "HS1905",
"t": "Bread, pastry,  other bakers' wares   618 HS0406 Cheese and curd",
"v": 566.0
},
{
"hs": "HS8703",
"t": "Motor cars for transport of persons  25 275 HS8525 Radio-telephony transmission tools",
"v": 16264.0
},
{
"hs": "HS8525",
"t": "Radio-telephony transmission tools  15 902 HS8471 Automatic data-processing machines",
"v": 12102.0
},
{
"hs": "HS8471",
"t": "Automatic data-processing machines  15 732 HS8708 Parts for motor vehicles 8701-8075",
"v": 11083.0
},
{
"hs": "HS8708",
"t": "Parts for motor vehicles 8701-8075  14 409 HS2711 Petroleum gases",
"v": 9872.0
},
{
"hs": "HS2716",
"t": "Electrical energy  5 085 HS8703 Motor cars for transport of persons",
"v": 5160.0
}
]
},
"Côte d'Ivoire": {
"aus": 16436.0,
"bip": 70046.0,
"bipJahr": 2022,
"ein": 17948.0,
"name": "Côte d’Ivoire",
"pAus": [
{
"l": "European Union",
"p": 32.6
},
{
"l": "United States of America",
"p": 6.7
},
{
"l": "Switzerland",
"p": 6.5
},
{
"l": "Vietnam",
"p": 6.4
},
{
"l": "Mali",
"p": 5.3
}
],
"pEin": [
{
"l": "European Union",
"p": 28.2
},
{
"l": "China",
"p": 15.0
},
{
"l": "Nigeria",
"p": 13.1
},
{
"l": "India",
"p": 5.1
},
{
"l": "United States of America",
"p": 4.0
}
],
"pJahr": 2020,
"restAus": 42.4,
"restEin": 34.6,
"seite": 90,
"wAus": {
"agrar": 68.5,
"energie": 12.5,
"industrie": 9.8,
"sonst": 9.1
},
"wEin": {
"agrar": 22.6,
"energie": 18.5,
"industrie": 58.9,
"sonst": 0.1
},
"wJahr": 2021,
"waren": [
{
"hs": "HS1801",
"t": "Cocoa beans, whole or broken  3 629 HS1006 Rice",
"v": 550.0
},
{
"hs": "HS0801",
"t": "Coconuts, Brazil nuts, cashew nuts   925 HS1001 Wheat and meslin",
"v": 201.0
},
{
"hs": "HS1803",
"t": "Cocoa paste   711 HS2401 Unmanufactured tobacco",
"v": 93.0
},
{
"hs": "HS1804",
"t": "Cocoa butter, fat and oil   399 HS0206 Edible offal of bovine animals",
"v": 89.0
},
{
"hs": "HS5201",
"t": "Cotton, not carded or combed   287 HS1901 Malt extract",
"v": 77.0
},
{
"hs": "HS7108",
"t": "Gold  1 465 HS2709 Petroleum oils, crude",
"v": 1437.0
},
{
"hs": "HS4001",
"t": "Natural rubber, balata  1 039 HS0303 Fish, frozen, excluding fish fillet",
"v": 573.0
},
{
"hs": "HS2710",
"t": "Petroleum oils, other than crude   657 HS2710 Petroleum oils, other than crude",
"v": 395.0
},
{
"hs": "HS2709",
"t": "Petroleum oils, crude   446 HS3004 Medicaments in measured doses",
"v": 352.0
},
{
"hs": "HS3304",
"t": "Preparations care of the skin   181 HS8703 Motor cars for transport of persons",
"v": 260.0
}
]
},
"Dem. Rep. Congo": {
"aus": 28200.0,
"bip": 62859.0,
"bipJahr": 2022,
"ein": 11000.0,
"name": "Democratic Republic of the Congo",
"pAus": [
{
"l": "China",
"p": 47.4
},
{
"l": "Tanzania",
"p": 8.9
},
{
"l": "South Africa",
"p": 8.8
},
{
"l": "Singapore",
"p": 8.7
},
{
"l": "Zambia",
"p": 6.0
}
],
"pEin": [
{
"l": "China",
"p": 26.9
},
{
"l": "European Union",
"p": 13.4
},
{
"l": "South Africa",
"p": 13.4
},
{
"l": "United States of America",
"p": 9.5
},
{
"l": "India",
"p": 7.0
}
],
"pJahr": 2021,
"restAus": 20.1,
"restEin": 29.8,
"seite": 102,
"wAus": {
"agrar": 1.2,
"energie": 73.6,
"industrie": 24.5,
"sonst": 0.8
},
"wEin": {
"agrar": 9.7,
"energie": 7.3,
"industrie": 66.8,
"sonst": 16.2
},
"wJahr": 2021,
"waren": [
{
"hs": "HS1801",
"t": "Cocoa beans, whole or broken   96 HS1001 Wheat and meslin",
"v": 184.0
},
{
"hs": "HS0901",
"t": "Coffee   21 HS0207 Meat and edible offal of poultry",
"v": 74.0
},
{
"hs": "HS1211",
"t": "Plants and parts of plants   18 HS1006 Rice",
"v": 47.0
},
{
"hs": "HS2302",
"t": "Bran, sharps and other residues   5 HS1515 Other fixed vegetable fats and oils",
"v": 44.0
},
{
"hs": "HS1302",
"t": "Vegetable saps and extracts   4 HS1107 Malt, whether or not roasted",
"v": 43.0
},
{
"hs": "HS7403",
"t": "Refined copper and copper alloys  14 190 HS4907 Other documents of title",
"v": 428.0
},
{
"hs": "HS2822",
"t": "Cobalt oxides and hydroxides  5 713 HS2710 Petroleum oils, other than crude",
"v": 367.0
},
{
"hs": "HS2603",
"t": "Copper ores and concentrates  1 580 HS2503 Sulphur of all kinds",
"v": 338.0
},
{
"hs": "HS7402",
"t": "Unrefined copper  1 397 HS3004 Medicaments in measured doses",
"v": 239.0
},
{
"hs": "HS2617",
"t": "Other ores and concentrates   348 HS8704 Motor vehicles for goods transport",
"v": 213.0
}
]
},
"Denmark": {
"aus": 130220.0,
"bip": 390677.0,
"bipJahr": 2022,
"ein": 126440.0,
"name": "Denmark",
"pAus": [
{
"l": "European Union",
"p": 47.5
},
{
"l": "Norway",
"p": 5.6
},
{
"l": "United States of America",
"p": 4.7
},
{
"l": "United Kingdom",
"p": 4.0
},
{
"l": "China",
"p": 2.8
}
],
"pEin": [
{
"l": "European Union",
"p": 66.0
},
{
"l": "China",
"p": 8.4
},
{
"l": "Norway",
"p": 4.5
},
{
"l": "United States of America",
"p": 4.0
},
{
"l": "United Kingdom",
"p": 2.5
}
],
"pJahr": 2022,
"restAus": 35.3,
"restEin": 14.6,
"seite": 104,
"wAus": {
"agrar": 19.9,
"energie": 7.2,
"industrie": 72.4,
"sonst": 0.5
},
"wEin": {
"agrar": 15.9,
"energie": 8.9,
"industrie": 74.0,
"sonst": 1.2
},
"wJahr": 2021,
"waren": [
{
"hs": "HS0203",
"t": "Swine meat, fresh, chilled, frozen  2 755 HS2204 Wine of fresh grapes",
"v": 870.0
},
{
"hs": "HS0406",
"t": "Cheese and curd  1 976 HS2304 Solid residues from soya-bean oil",
"v": 777.0
},
{
"hs": "HS2106",
"t": "Other food preparations   987 HS2309 Preparations of a kind used in animal feeding",
"v": 600.0
},
{
"hs": "HS0103",
"t": "Live swine   960 HS2106 Other food preparations",
"v": 524.0
},
{
"hs": "HS1901",
"t": "Malt extract   781 HS1905 Bread, pastry,  other bakers' wares",
"v": 513.0
},
{
"hs": "HS3004",
"t": "Medicaments in measured doses  16 028 HS8703 Motor cars for transport of persons",
"v": 5401.0
},
{
"hs": "HS3002",
"t": "Human and animal blood  3 429 HS3004 Medicaments in measured doses",
"v": 3885.0
},
{
"hs": "HS2716",
"t": "Electrical energy  3 287 HS2710 Petroleum oils, other than crude",
"v": 3717.0
},
{
"hs": "HS2710",
"t": "Petroleum oils, other than crude  2 549 HS2709 Petroleum oils, crude",
"v": 3638.0
},
{
"hs": "HS2937",
"t": "Hormones, prostaglandins  1 852 HS8471 Automatic data-processing machines",
"v": 3292.0
}
]
},
"Djibouti": {
"aus": 4497.0,
"bip": 3646.0,
"bipJahr": 2022,
"ein": 5405.0,
"name": "Djibouti",
"pAus": [
{
"l": "Ethiopia",
"p": 35.3
},
{
"l": "European Union",
"p": 20.6
},
{
"l": "Somalia",
"p": 11.9
},
{
"l": "Brazil",
"p": 8.7
},
{
"l": "Qatar",
"p": 6.3
}
],
"pEin": [
{
"l": "European Union",
"p": 36.7
},
{
"l": "United Arab Emirates",
"p": 18.5
},
{
"l": "Saudi Arabia",
"p": 6.0
},
{
"l": "Japan",
"p": 5.5
},
{
"l": "Ethiopia",
"p": 5.0
}
],
"pJahr": 2009,
"restAus": 17.2,
"restEin": 28.3,
"seite": 106,
"waren": []
},
"Dominica": {
"aus": 22.0,
"bip": 612.0,
"bipJahr": 2022,
"ein": 266.0,
"name": "Dominica",
"pAus": [
{
"l": "Trinidad and Tobago",
"p": 18.8
},
{
"l": "Jamaica",
"p": 16.2
},
{
"l": "St. Kitts and Nevis",
"p": 14.3
},
{
"l": "European Union",
"p": 10.0
},
{
"l": "Guyana",
"p": 9.5
}
],
"pEin": [
{
"l": "United States of America",
"p": 36.8
},
{
"l": "Trinidad and Tobago",
"p": 17.0
},
{
"l": "European Union",
"p": 5.0
},
{
"l": "United Kingdom",
"p": 4.0
},
{
"l": "China",
"p": 2.4
}
],
"pJahr": 2012,
"restAus": 31.1,
"restEin": 34.8,
"seite": 108,
"wAus": {
"agrar": 10.4,
"energie": 13.6,
"industrie": 51.2,
"sonst": 24.9
},
"wEin": {
"agrar": 22.7,
"energie": 14.1,
"industrie": 45.8,
"sonst": 17.4
},
"wJahr": 2015,
"waren": [
{
"hs": "HS0714",
"t": "Manioc, arrowroot, salep   1 HS0207 Meat and edible offal of poultry",
"v": 5.0
},
{
"hs": "HS0803",
"t": "Bananas, including plantains   1 HS2202 Waters containing added sugar",
"v": 4.0
},
{
"hs": "HS3301",
"t": "Essential oils (terpeneless or not) 0.4 HS1502 Fats of bovine animals, sheep or goat",
"v": 3.0
},
{
"hs": "HS0804",
"t": "Dates, figs, pineapples, avocados 0.3 HS1101 Wheat or meslin flour",
"v": 3.0
},
{
"hs": "HS0805",
"t": "Citrus fruit, fresh or dried 0.3 HS0402 Milk and cream, concentrated",
"v": 3.0
},
{
"hs": "HS3401",
"t": "Soap   16 HS2710 Petroleum oils, other than crude",
"v": 43.0
},
{
"hs": "HS4907",
"t": "Other documents of title   4 HS2523 Portland cement, aluminous cement",
"v": 4.0
},
{
"hs": "HS2517",
"t": "Pebbles, gravel   2 HS8703 Motor cars for transport of persons",
"v": 4.0
},
{
"hs": "HS8518",
"t": "Microphones and stands therefor   2 HS8525 Radio-telephony transmission tools",
"v": 3.0
},
{
"hs": "HS3210",
"t": "Other paints and varnishes   1 HS2711 Petroleum gases",
"v": 3.0
}
]
},
"Dominican Rep.": {
"aus": 13777.0,
"bip": 112502.0,
"bipJahr": 2022,
"ein": 30743.0,
"name": "Dominican Republic",
"pAus": [
{
"l": "United States of America",
"p": 51.8
},
{
"l": "Switzerland",
"p": 10.5
},
{
"l": "Haiti",
"p": 10.4
},
{
"l": "European Union",
"p": 7.1
},
{
"l": "India",
"p": 3.4
}
],
"pEin": [
{
"l": "United States of America",
"p": 42.3
},
{
"l": "China",
"p": 17.8
},
{
"l": "European Union",
"p": 13.0
},
{
"l": "Brazil",
"p": 4.8
},
{
"l": "Mexico",
"p": 4.5
}
],
"pJahr": 2022,
"restAus": 16.9,
"restEin": 17.6,
"seite": 110,
"wAus": {
"agrar": 22.1,
"energie": 3.1,
"industrie": 53.7,
"sonst": 21.1
},
"wEin": {
"agrar": 18.2,
"energie": 19.2,
"industrie": 62.6,
"sonst": 0.0
},
"wJahr": 2021,
"waren": [
{
"hs": "HS2401",
"t": "Unmanufactured tobacco   187 HS2401 Unmanufactured tobacco",
"v": 522.0
},
{
"hs": "HS2208",
"t": "Alcohol of less than 80% volume   149 HS1005 Maize (corn)",
"v": 482.0
},
{
"hs": "HS1701",
"t": "Cane or beet sugar   131 HS1507 Soya-bean oil and its fractions",
"v": 316.0
},
{
"hs": "HS2008",
"t": "Plants' parts otherwise preserved   80 HS1001 Wheat and meslin",
"v": 285.0
},
{
"hs": "HS1905",
"t": "Bread, pastry,  other bakers' wares   69 HS0203 Swine meat, fresh, chilled, frozen",
"v": 250.0
},
{
"hs": "HS9018",
"t": "Instruments for medical sciences  1 379 HS2711 Petroleum gases",
"v": 1490.0
},
{
"hs": "HS7108",
"t": "Gold  1 378 HS8703 Motor cars for transport of persons",
"v": 1341.0
},
{
"hs": "HS8536",
"t": "Electrical circuits protector   849 HS2710 Petroleum oils, other than crude",
"v": 1139.0
},
{
"hs": "HS7202",
"t": "Ferro-alloys   536 HS2709 Petroleum oils, crude",
"v": 886.0
},
{
"hs": "HS6109",
"t": "T-shirts, singlets and other vests   406 HS3004 Medicaments in measured doses",
"v": 799.0
}
]
},
"Ecuador": {
"aus": 32658.0,
"bip": 116360.0,
"bipJahr": 2022,
"ein": 33049.0,
"name": "Ecuador",
"pAus": [
{
"l": "United States of America",
"p": 24.0
},
{
"l": "China",
"p": 15.3
},
{
"l": "Panama",
"p": 14.9
},
{
"l": "European Union",
"p": 14.1
},
{
"l": "Chile",
"p": 4.2
}
],
"pEin": [
{
"l": "China",
"p": 23.5
},
{
"l": "United States of America",
"p": 22.1
},
{
"l": "European Union",
"p": 10.1
},
{
"l": "Colombia",
"p": 7.0
},
{
"l": "Brazil",
"p": 3.9
}
],
"pJahr": 2021,
"restAus": 27.6,
"restEin": 33.4,
"seite": 112,
"wAus": {
"agrar": 52.8,
"energie": 38.9,
"industrie": 6.0,
"sonst": 2.3
},
"wEin": {
"agrar": 13.3,
"energie": 20.5,
"industrie": 65.0,
"sonst": 1.2
},
"wJahr": 2021,
"waren": [
{
"hs": "HS0803",
"t": "Bananas, including plantains  3 500 HS2304 Solid residues from soya-bean oil",
"v": 730.0
},
{
"hs": "HS0603",
"t": "Cut flowers and flower buds   927 HS1001 Wheat and meslin",
"v": 499.0
},
{
"hs": "HS1801",
"t": "Cocoa beans, whole or broken   819 HS2309 Preparations of a kind used in animal feeding",
"v": 332.0
},
{
"hs": "HS0710",
"t": "Vegetables frozen   168 HS2106 Other food preparations",
"v": 243.0
},
{
"hs": "HS2008",
"t": "Plants' parts otherwise preserved   143 HS1507 Soya-bean oil and its fractions",
"v": 147.0
},
{
"hs": "HS2709",
"t": "Petroleum oils, crude  7 278 HS2710 Petroleum oils, other than crude",
"v": 2467.0
},
{
"hs": "HS0306",
"t": "Crustaceans whether in shell or not  5 327 HS2707 Coal tars",
"v": 1582.0
},
{
"hs": "HS2710",
"t": "Petroleum oils, other than crude  1 320 HS8703 Motor cars for transport of persons",
"v": 882.0
},
{
"hs": "HS1604",
"t": "Prepared or preserved fish  1 263 HS3004 Medicaments in measured doses",
"v": 851.0
},
{
"hs": "HS2603",
"t": "Copper ores and concentrates   920 HS2711 Petroleum gases",
"v": 707.0
}
]
},
"Egypt": {
"aus": 48845.0,
"bip": 475231.0,
"bipJahr": 2022,
"ein": 85844.0,
"name": "Egypt",
"pAus": [
{
"l": "European Union",
"p": 33.6
},
{
"l": "Turkey",
"p": 7.9
},
{
"l": "Saudi Arabia",
"p": 5.0
},
{
"l": "United States of America",
"p": 4.5
},
{
"l": "South Korea",
"p": 4.1
}
],
"pEin": [
{
"l": "European Union",
"p": 22.5
},
{
"l": "China",
"p": 14.3
},
{
"l": "Saudi Arabia",
"p": 8.9
},
{
"l": "United States of America",
"p": 7.2
},
{
"l": "India",
"p": 4.3
}
],
"pJahr": 2022,
"restAus": 45.1,
"restEin": 42.9,
"seite": 114,
"wAus": {
"agrar": 14.7,
"energie": 33.6,
"industrie": 42.5,
"sonst": 9.2
},
"wEin": {
"agrar": 19.5,
"energie": 18.3,
"industrie": 49.1,
"sonst": 13.1
},
"wJahr": 2021,
"waren": [
{
"hs": "HS0805",
"t": "Citrus fruit, fresh or dried   815 HS1001 Wheat and meslin",
"v": 3803.0
},
{
"hs": "HS0701",
"t": "Potatoes, fresh or chilled   316 HS1005 Maize (corn)",
"v": 2501.0
},
{
"hs": "HS0811",
"t": "Fruit and nuts, uncooked or cooked   289 HS1201 Soya beans, whether or not broken",
"v": 2152.0
},
{
"hs": "HS0710",
"t": "Vegetables frozen   286 HS1511 Palm oil and its fractions",
"v": 1126.0
},
{
"hs": "HS0810",
"t": "Other fruit, fresh   254 HS0202 Meat of bovine animals, frozen",
"v": 1007.0
},
{
"hs": "HS2711",
"t": "Petroleum gases  10 316 HS2710 Petroleum oils, other than crude",
"v": 6203.0
},
{
"hs": "HS2710",
"t": "Petroleum oils, other than crude  4 525 HS2709 Petroleum oils, crude",
"v": 4390.0
},
{
"hs": "HS2709",
"t": "Petroleum oils, crude  2 963 HS2711 Petroleum gases",
"v": 3230.0
},
{
"hs": "HS3102",
"t": "Nitrogenous fertilisers  1 877 HS3004 Medicaments in measured doses",
"v": 2981.0
},
{
"hs": "HS7108",
"t": "Gold  1 608 HS8703 Motor cars for transport of persons",
"v": 1610.0
}
]
},
"El Salvador": {
"aus": 7115.0,
"bip": 31605.0,
"bipJahr": 2022,
"ein": 17108.0,
"name": "El Salvador",
"pAus": [
{
"l": "United States of America",
"p": 39.2
},
{
"l": "Guatemala",
"p": 17.1
},
{
"l": "Honduras",
"p": 16.7
},
{
"l": "Nicaragua",
"p": 7.0
},
{
"l": "Costa Rica",
"p": 4.3
}
],
"pEin": [
{
"l": "United States of America",
"p": 29.8
},
{
"l": "China",
"p": 16.6
},
{
"l": "Guatemala",
"p": 9.9
},
{
"l": "Mexico",
"p": 8.2
},
{
"l": "European Union",
"p": 5.8
}
],
"pJahr": 2022,
"restAus": 15.8,
"restEin": 29.6,
"seite": 116,
"wAus": {
"agrar": 19.7,
"energie": 4.9,
"industrie": 75.4,
"sonst": 0.0
},
"wEin": {
"agrar": 19.6,
"energie": 14.3,
"industrie": 65.9,
"sonst": 0.2
},
"wJahr": 2021,
"waren": [
{
"hs": "HS1701",
"t": "Cane or beet sugar   229 HS1005 Maize (corn)",
"v": 287.0
},
{
"hs": "HS0901",
"t": "Coffee   177 HS2106 Other food preparations",
"v": 196.0
},
{
"hs": "HS2202",
"t": "Waters containing added sugar   134 HS0406 Cheese and curd",
"v": 179.0
},
{
"hs": "HS1905",
"t": "Bread, pastry,  other bakers' wares   128 HS1001 Wheat and meslin",
"v": 140.0
},
{
"hs": "HS2106",
"t": "Other food preparations   59 HS1511 Palm oil and its fractions",
"v": 139.0
},
{
"hs": "HS6109",
"t": "T-shirts, singlets and other vests   819 HS2710 Petroleum oils, other than crude",
"v": 2130.0
},
{
"hs": "HS6110",
"t": "Jerseys, pullovers, cardigans   529 HS2711 Petroleum gases",
"v": 526.0
},
{
"hs": "HS3923",
"t": "Conveyance of goods' articles   316 HS3004 Medicaments in measured doses",
"v": 477.0
},
{
"hs": "HS8532",
"t": "Electrical capacitors   260 HS8525 Radio-telephony transmission tools",
"v": 354.0
},
{
"hs": "HS4818",
"t": "Toilet paper and similar paper   211 HS8703 Motor cars for transport of persons",
"v": 330.0
}
]
},
"Eq. Guinea": {
"aus": 7500.0,
"bip": 16451.0,
"bipJahr": 2022,
"ein": 2800.0,
"name": "Equatorial Guinea",
"seite": 118,
"waren": []
},
"Eritrea": {
"aus": 578.0,
"bip": 2383.0,
"bipJahr": 2022,
"ein": 726.0,
"name": "Eritrea",
"pAus": [
{
"l": "European Union",
"p": 33.5
},
{
"l": "Sudan",
"p": 19.5
},
{
"l": "Singapore",
"p": 12.4
},
{
"l": "India",
"p": 7.2
},
{
"l": "Russia",
"p": 2.9
}
],
"pEin": [
{
"l": "European Union",
"p": 23.3
},
{
"l": "United States of America",
"p": 15.9
},
{
"l": "United Arab Emirates",
"p": 12.3
},
{
"l": "Saudi Arabia",
"p": 10.5
},
{
"l": "India",
"p": 6.3
}
],
"pJahr": 2003,
"restAus": 24.5,
"restEin": 31.8,
"seite": 120,
"waren": []
},
"Estonia": {
"aus": 22405.0,
"bip": 38131.0,
"bipJahr": 2022,
"ein": 26228.0,
"name": "Estonia",
"pAus": [
{
"l": "European Union",
"p": 66.3
},
{
"l": "Russia",
"p": 6.0
},
{
"l": "United States of America",
"p": 5.3
},
{
"l": "Norway",
"p": 3.4
},
{
"l": "United Kingdom",
"p": 2.2
}
],
"pEin": [
{
"l": "European Union",
"p": 56.6
},
{
"l": "China",
"p": 8.8
},
{
"l": "Russia",
"p": 8.4
},
{
"l": "United States of America",
"p": 2.0
},
{
"l": "United Kingdom",
"p": 1.5
}
],
"pJahr": 2022,
"restAus": 16.9,
"restEin": 22.6,
"seite": 122,
"wAus": {
"agrar": 14.9,
"energie": 19.5,
"industrie": 62.8,
"sonst": 2.9
},
"wEin": {
"agrar": 12.6,
"energie": 17.7,
"industrie": 65.0,
"sonst": 4.6
},
"wJahr": 2021,
"waren": [
{
"hs": "HS1511",
"t": "Palm oil and its fractions   343 HS1511 Palm oil and its fractions",
"v": 305.0
},
{
"hs": "HS1001",
"t": "Wheat and meslin   206 HS2106 Other food preparations",
"v": 106.0
},
{
"hs": "HS0401",
"t": "Milk and cream, not concentrated   134 HS2204 Wine of fresh grapes",
"v": 94.0
},
{
"hs": "HS0406",
"t": "Cheese and curd   125 HS2208 Alcohol of less than 80% volume",
"v": 93.0
},
{
"hs": "HS1514",
"t": "Rape, colza or mustard oil   93 HS2309 Preparations of a kind used in animal feeding",
"v": 87.0
},
{
"hs": "HS2716",
"t": "Electrical energy  1 331 HS2710 Petroleum oils, other than crude",
"v": 2195.0
},
{
"hs": "HS8525",
"t": "Radio-telephony transmission tools  1 207 HS2716 Electrical energy",
"v": 1479.0
},
{
"hs": "HS2710",
"t": "Petroleum oils, other than crude  1 188 HS8703 Motor cars for transport of persons",
"v": 1286.0
},
{
"hs": "HS2707",
"t": "Coal tars  1 109 HS2707 Coal tars",
"v": 753.0
},
{
"hs": "HS8703",
"t": "Motor cars for transport of persons   634 HS2711 Petroleum gases",
"v": 641.0
}
]
},
"Ethiopia": {
"aus": 3970.0,
"bip": 120369.0,
"bipJahr": 2022,
"ein": 18663.0,
"name": "Ethiopia",
"pAus": [
{
"l": "European Union",
"p": 24.9
},
{
"l": "Somalia",
"p": 11.8
},
{
"l": "United States of America",
"p": 10.8
},
{
"l": "Saudi Arabia",
"p": 7.0
},
{
"l": "United Arab Emirates",
"p": 6.2
}
],
"pEin": [
{
"l": "China",
"p": 26.4
},
{
"l": "India",
"p": 15.7
},
{
"l": "European Union",
"p": 9.2
},
{
"l": "United States of America",
"p": 7.6
},
{
"l": "Turkey",
"p": 5.0
}
],
"pJahr": 2021,
"restAus": 39.3,
"restEin": 36.1,
"seite": 126,
"wAus": {
"agrar": 77.3,
"energie": 0.3,
"industrie": 6.6,
"sonst": 15.8
},
"wEin": {
"agrar": 21.0,
"energie": 8.5,
"industrie": 55.1,
"sonst": 15.5
},
"wJahr": 2021,
"waren": [
{
"hs": "HS0901",
"t": "Coffee  1 189 HS1001 Wheat and meslin",
"v": 939.0
},
{
"hs": "HS1207",
"t": "Other oil seeds, oleaginous fruits   325 HS1511 Palm oil and its fractions",
"v": 883.0
},
{
"hs": "HS0709",
"t": "Other vegetables, fresh or chilled   271 HS1006 Rice",
"v": 687.0
},
{
"hs": "HS0603",
"t": "Cut flowers and flower buds   255 HS1701 Cane or beet sugar",
"v": 582.0
},
{
"hs": "HS0713",
"t": "Dried leguminous vegetables   188 HS1512 Sunflower-seed,or cotton oil",
"v": 446.0
},
{
"hs": "HS6203",
"t": "Men's or boys' suits   28 HS2710 Petroleum oils, other than crude",
"v": 949.0
},
{
"hs": "HS6111",
"t": "Babies' clothing accessories   27 HS8703 Motor cars for transport of persons",
"v": 505.0
},
{
"hs": "HS8525",
"t": "Radio-telephony transmission tools   18 HS3004 Medicaments in measured doses",
"v": 502.0
},
{
"hs": "HS4112",
"t": "Sheeps or lambs' leather   16 HS8704 Motor vehicles for goods transport",
"v": 417.0
},
{
"hs": "HS6204",
"t": "Women's or girls' suits   14 HS3105 Mineral or chemical fertilisers",
"v": 363.0
}
]
},
"European Union": {
"aus": 2703778.0,
"bip": 16642598.0,
"bipJahr": 2022,
"ein": 3154645.0,
"name": "European Union",
"pAus": [
{
"l": "United States of America",
"p": 19.5
},
{
"l": "United Kingdom",
"p": 12.7
},
{
"l": "China",
"p": 8.8
},
{
"l": "Switzerland",
"p": 7.3
},
{
"l": "Turkey",
"p": 3.9
}
],
"pEin": [
{
"l": "China",
"p": 20.8
},
{
"l": "United States of America",
"p": 11.8
},
{
"l": "United Kingdom",
"p": 6.8
},
{
"l": "Russia",
"p": 6.2
},
{
"l": "Switzerland",
"p": 4.9
}
],
"pJahr": 2022,
"restAus": 47.8,
"restEin": 49.5,
"seite": 128,
"wAus": {
"agrar": 10.2,
"energie": 7.6,
"industrie": 80.4,
"sonst": 1.8
},
"wEin": {
"agrar": 8.0,
"energie": 23.2,
"industrie": 67.1,
"sonst": 1.7
},
"wJahr": 2021,
"waren": [
{
"hs": "HS2204",
"t": "Wine of fresh grapes  18 661 HS0901 Coffee",
"v": 13493.0
},
{
"hs": "HS1001",
"t": "Wheat and meslin  11 796 HS2304 Solid residues from soya-bean oil",
"v": 9180.0
},
{
"hs": "HS2208",
"t": "Alcohol of less than 80% volume  10 261 HS1201 Soya beans, whether or not broken",
"v": 8808.0
},
{
"hs": "HS2106",
"t": "Other food preparations  10 180 HS1005 Maize (corn)",
"v": 7500.0
},
{
"hs": "HS1901",
"t": "Malt extract  9 497 HS1511 Palm oil and its fractions",
"v": 6710.0
},
{
"hs": "HS8703",
"t": "Motor cars for transport of persons  166 035 HS2709 Petroleum oils, crude",
"v": 349009.0
},
{
"hs": "HS3004",
"t": "Medicaments in measured doses  163 339 HS2711 Petroleum gases",
"v": 247449.0
},
{
"hs": "HS2710",
"t": "Petroleum oils, other than crude  136 421 HS2710 Petroleum oils, other than crude",
"v": 107042.0
},
{
"hs": "HS3002",
"t": "Human and animal blood  115 264 HS8525 Radio-telephony transmission tools",
"v": 92514.0
},
{
"hs": "HS8708",
"t": "Parts for motor vehicles 8701-8075  56 838 HS8471 Automatic data-processing machines",
"v": 82869.0
}
]
},
"Faeroe Is.": {
"aus": 1778.0,
"ein": 1698.0,
"name": "Faeroe Islands",
"pAus": [
{
"l": "European Union",
"p": 45.4
},
{
"l": "United Kingdom",
"p": 17.3
},
{
"l": "Norway",
"p": 8.2
},
{
"l": "United States of America",
"p": 7.5
},
{
"l": "Nigeria",
"p": 4.1
}
],
"pEin": [
{
"l": "European Union",
"p": 56.2
},
{
"l": "Norway",
"p": 18.1
},
{
"l": "Chile",
"p": 6.6
},
{
"l": "China",
"p": 4.3
},
{
"l": "United Kingdom",
"p": 3.2
}
],
"pJahr": 2009,
"restAus": 17.5,
"restEin": 11.5,
"seite": 130,
"wAus": {
"agrar": 81.6,
"energie": 2.3,
"industrie": 15.7,
"sonst": 0.4
},
"wEin": {
"agrar": 17.4,
"energie": 22.2,
"industrie": 59.1,
"sonst": 1.4
},
"wJahr": 2012,
"waren": []
},
"Fiji": {
"aus": 1055.0,
"bip": 4837.0,
"bipJahr": 2022,
"ein": 2997.0,
"name": "Fiji",
"pAus": [
{
"l": "United States of America",
"p": 21.0
},
{
"l": "Australia",
"p": 10.5
},
{
"l": "Tonga",
"p": 6.8
},
{
"l": "New Zealand",
"p": 6.2
},
{
"l": "European Union",
"p": 5.7
}
],
"pEin": [
{
"l": "Singapore",
"p": 25.9
},
{
"l": "China",
"p": 15.7
},
{
"l": "Australia",
"p": 15.6
},
{
"l": "New Zealand",
"p": 13.5
},
{
"l": "Malaysia",
"p": 3.9
}
],
"pJahr": 2022,
"restAus": 49.8,
"restEin": 25.5,
"seite": 132,
"wAus": {
"agrar": 54.2,
"energie": 12.4,
"industrie": 25.7,
"sonst": 7.7
},
"wEin": {
"agrar": 20.6,
"energie": 17.4,
"industrie": 61.8,
"sonst": 0.2
},
"wJahr": 2021,
"waren": [
{
"hs": "HS2201",
"t": "Waters, natural or artificial   164 HS1001 Wheat and meslin",
"v": 78.0
},
{
"hs": "HS1701",
"t": "Cane or beet sugar   60 HS0402 Milk and cream, concentrated",
"v": 30.0
},
{
"hs": "HS1905",
"t": "Bread, pastry,  other bakers' wares   27 HS0204 Meat of sheep or goats, fresh",
"v": 29.0
},
{
"hs": "HS1211",
"t": "Plants and parts of plants   19 HS1507 Soya-bean oil and its fractions",
"v": 28.0
},
{
"hs": "HS1101",
"t": "Wheat or meslin flour   17 HS1006 Rice",
"v": 23.0
},
{
"hs": "HS2710",
"t": "Petroleum oils, other than crude   245 HS2710 Petroleum oils, other than crude",
"v": 696.0
},
{
"hs": "HS0303",
"t": "Fish, frozen, excluding fish fillet   77 HS8703 Motor cars for transport of persons",
"v": 68.0
},
{
"hs": "HS7108",
"t": "Gold   46 HS8525 Radio-telephony transmission tools",
"v": 52.0
},
{
"hs": "HS4401",
"t": "Fuel wood, in logs, in billets   22 HS8704 Motor vehicles for goods transport",
"v": 48.0
},
{
"hs": "HS4407",
"t": "Wood sawn or chipped lengthwise   19 HS3903 Polymers of styrene",
"v": 35.0
}
]
},
"Finland": {
"aus": 86008.0,
"bip": 281047.0,
"bipJahr": 2022,
"ein": 97285.0,
"name": "Finland",
"pAus": [
{
"l": "European Union",
"p": 54.8
},
{
"l": "United States of America",
"p": 9.3
},
{
"l": "China",
"p": 4.7
},
{
"l": "United Kingdom",
"p": 3.6
},
{
"l": "Norway",
"p": 2.8
}
],
"pEin": [
{
"l": "European Union",
"p": 52.6
},
{
"l": "China",
"p": 9.1
},
{
"l": "Norway",
"p": 6.9
},
{
"l": "Russia",
"p": 6.7
},
{
"l": "United States of America",
"p": 4.4
}
],
"pJahr": 2022,
"restAus": 24.8,
"restEin": 20.3,
"seite": 134,
"wAus": {
"agrar": 11.0,
"energie": 15.1,
"industrie": 72.1,
"sonst": 1.8
},
"wEin": {
"agrar": 9.2,
"energie": 23.5,
"industrie": 66.4,
"sonst": 0.8
},
"wJahr": 2021,
"waren": [
{
"hs": "HS4301",
"t": "Raw furskins   245 HS1518 Animal or vegetable fats and oils",
"v": 653.0
},
{
"hs": "HS0402",
"t": "Milk and cream, concentrated   175 HS0901 Coffee",
"v": 424.0
},
{
"hs": "HS0405",
"t": "Butter and other fats and oils   173 HS1905 Bread, pastry,  other bakers' wares",
"v": 341.0
},
{
"hs": "HS2208",
"t": "Alcohol of less than 80% volume   127 HS0406 Cheese and curd",
"v": 331.0
},
{
"hs": "HS0203",
"t": "Swine meat, fresh, chilled, frozen   98 HS2309 Preparations of a kind used in animal feeding",
"v": 270.0
},
{
"hs": "HS2710",
"t": "Petroleum oils, other than crude  7 005 HS2709 Petroleum oils, crude",
"v": 7347.0
},
{
"hs": "HS4810",
"t": "Paper coated with kaolin  4 024 HS2710 Petroleum oils, other than crude",
"v": 4921.0
},
{
"hs": "HS7219",
"t": "Flat-rolled steel more than 600  3 660 HS8703 Motor cars for transport of persons",
"v": 3550.0
},
{
"hs": "HS4703",
"t": "Chemical wood pulp, soda /sulphate  2 852 HS2716 Electrical energy",
"v": 3164.0
},
{
"hs": "HS4407",
"t": "Wood sawn or chipped lengthwise  2 717 HS7501 Nickel mattes, nickel oxide sinters",
"v": 1896.0
}
]
},
"France": {
"aus": 617855.0,
"bip": 2784020.0,
"bipJahr": 2022,
"ein": 818260.0,
"name": "France",
"pAus": [
{
"l": "European Union",
"p": 55.4
},
{
"l": "United States of America",
"p": 7.9
},
{
"l": "United Kingdom",
"p": 5.7
},
{
"l": "China",
"p": 4.0
},
{
"l": "Switzerland",
"p": 3.5
}
],
"pEin": [
{
"l": "European Union",
"p": 61.2
},
{
"l": "United States of America",
"p": 6.9
},
{
"l": "China",
"p": 6.3
},
{
"l": "United Kingdom",
"p": 3.5
},
{
"l": "Switzerland",
"p": 2.4
}
],
"pJahr": 2022,
"restAus": 23.4,
"restEin": 19.7,
"seite": 136,
"wAus": {
"agrar": 14.7,
"energie": 6.0,
"industrie": 76.5,
"sonst": 2.8
},
"wEin": {
"agrar": 11.0,
"energie": 12.7,
"industrie": 74.9,
"sonst": 1.4
},
"wJahr": 2021,
"waren": [
{
"hs": "HS2204",
"t": "Wine of fresh grapes  12 936 HS0901 Coffee",
"v": 3200.0
},
{
"hs": "HS1001",
"t": "Wheat and meslin  7 360 HS0406 Cheese and curd",
"v": 2696.0
},
{
"hs": "HS2208",
"t": "Alcohol of less than 80% volume  6 124 HS1905 Bread, pastry,  other bakers' wares",
"v": 2685.0
},
{
"hs": "HS0406",
"t": "Cheese and curd  3 758 HS1806 Chocolate and other cocoa food",
"v": 2408.0
},
{
"hs": "HS2309",
"t": "Preparations of a kind used in animal feeding  3 363 HS0207 Meat and edible offal of poultry",
"v": 1926.0
},
{
"hs": "HS8802",
"t": "Other aircraft  25 901 HS2711 Petroleum gases",
"v": 60595.0
},
{
"hs": "HS3004",
"t": "Medicaments in measured doses  25 724 HS8703 Motor cars for transport of persons",
"v": 37405.0
},
{
"hs": "HS8703",
"t": "Motor cars for transport of persons  20 858 HS2710 Petroleum oils, other than crude",
"v": 36757.0
},
{
"hs": "HS8411",
"t": "Turbo-jets, turbo-propellers and ot  15 782 HS2709 Petroleum oils, crude",
"v": 34708.0
},
{
"hs": "HS8708",
"t": "Parts for motor vehicles 8701-8075  13 026 HS3004 Medicaments in measured doses",
"v": 17302.0
}
]
},
"Gabon": {
"aus": 9200.0,
"bip": 21931.0,
"bipJahr": 2022,
"ein": 4600.0,
"name": "Gabon",
"pAus": [
{
"l": "United States of America",
"p": 59.0
},
{
"l": "European Union",
"p": 15.8
},
{
"l": "China",
"p": 8.0
},
{
"l": "Malaysia",
"p": 4.0
},
{
"l": "United Kingdom",
"p": 2.1
}
],
"pEin": [
{
"l": "European Union",
"p": 62.3
},
{
"l": "United States of America",
"p": 7.1
},
{
"l": "China",
"p": 4.9
},
{
"l": "United Kingdom",
"p": 2.9
},
{
"l": "Japan",
"p": 2.1
}
],
"pJahr": 2009,
"restAus": 11.0,
"restEin": 20.7,
"seite": 138,
"wAus": {
"agrar": 6.6,
"energie": 88.2,
"industrie": 5.2,
"sonst": 0.1
},
"wEin": {
"agrar": 28.1,
"energie": 5.2,
"industrie": 65.9,
"sonst": 0.8
},
"wJahr": 2021,
"waren": []
},
"Gambia": {
"aus": 40.0,
"bip": 2133.0,
"bipJahr": 2022,
"ein": 694.0,
"name": "The Gambia",
"pAus": [
{
"l": "Mali",
"p": 44.7
},
{
"l": "China",
"p": 29.1
},
{
"l": "Senegal",
"p": 10.9
},
{
"l": "Guinea-Bissau",
"p": 4.5
},
{
"l": "India",
"p": 3.7
}
],
"pEin": [
{
"l": "Togo",
"p": 25.5
},
{
"l": "European Union",
"p": 18.9
},
{
"l": "Côte d'Ivoire",
"p": 12.4
},
{
"l": "China",
"p": 7.6
},
{
"l": "India",
"p": 5.6
}
],
"pJahr": 2021,
"restAus": 7.2,
"restEin": 30.1,
"seite": 140,
"wAus": {
"agrar": 35.1,
"energie": 39.8,
"industrie": 8.6,
"sonst": 16.6
},
"wEin": {
"agrar": 27.5,
"energie": 29.7,
"industrie": 42.7,
"sonst": 0.0
},
"wJahr": 2021,
"waren": [
{
"hs": "HS1002",
"t": "Rye   4 HS1006 Rice",
"v": 38.0
},
{
"hs": "HS1202",
"t": "Ground-nuts, not cooked   2 HS1515 Other fixed vegetable fats and oils",
"v": 21.0
},
{
"hs": "HS0801",
"t": "Coconuts, Brazil nuts, cashew nuts   1 HS1701 Cane or beet sugar",
"v": 19.0
},
{
"hs": "HS1207",
"t": "Other oil seeds, oleaginous fruits 0.8 HS1001 Wheat and meslin",
"v": 12.0
},
{
"hs": "HS1701",
"t": "Cane or beet sugar 0.4 HS0207 Meat and edible offal of poultry",
"v": 10.0
},
{
"hs": "HS2710",
"t": "Petroleum oils, other than crude   12 HS2710 Petroleum oils, other than crude",
"v": 271.0
},
{
"hs": "HS8465",
"t": "Machine-tools for working wood   1 HS8703 Motor cars for transport of persons",
"v": 69.0
},
{
"hs": "HS1605",
"t": "Crustaceans, molluscs 0.8 HS2523 Portland cement, aluminous cement",
"v": 19.0
},
{
"hs": "HS8703",
"t": "Motor cars for transport of persons 0.7 HS8207 Interchangeable tools for hand tool",
"v": 15.0
},
{
"hs": "HS2505",
"t": "Natural sands of all kinds 0.5 HS5408 Woven fabrics of artificial filamen",
"v": 8.0
}
]
},
"Georgia": {
"aus": 5583.0,
"bip": 24606.0,
"bipJahr": 2022,
"ein": 13548.0,
"name": "Georgia",
"pAus": [
{
"l": "European Union",
"p": 15.4
},
{
"l": "China",
"p": 13.2
},
{
"l": "Azerbaijan",
"p": 12.0
},
{
"l": "Russia",
"p": 11.5
},
{
"l": "Armenia",
"p": 10.5
}
],
"pEin": [
{
"l": "European Union",
"p": 22.6
},
{
"l": "Turkey",
"p": 17.5
},
{
"l": "Russia",
"p": 13.5
},
{
"l": "China",
"p": 8.3
},
{
"l": "United States of America",
"p": 7.5
}
],
"pJahr": 2022,
"restAus": 37.3,
"restEin": 30.5,
"seite": 142,
"wAus": {
"agrar": 27.3,
"energie": 24.8,
"industrie": 46.0,
"sonst": 1.8
},
"wEin": {
"agrar": 13.6,
"energie": 21.5,
"industrie": 64.3,
"sonst": 0.6
},
"wJahr": 2021,
"waren": [
{
"hs": "HS2204",
"t": "Wine of fresh grapes   253 HS2402 Cigars, cheroots, cigarillos",
"v": 130.0
},
{
"hs": "HS2208",
"t": "Alcohol of less than 80% volume   139 HS0207 Meat and edible offal of poultry",
"v": 94.0
},
{
"hs": "HS2201",
"t": "Waters, natural or artificial   113 HS1701 Cane or beet sugar",
"v": 89.0
},
{
"hs": "HS0802",
"t": "Other nuts, fresh or dried   103 HS1806 Chocolate and other cocoa food",
"v": 78.0
},
{
"hs": "HS2202",
"t": "Waters containing added sugar   83 HS1101 Wheat or meslin flour",
"v": 68.0
},
{
"hs": "HS2603",
"t": "Copper ores and concentrates  1 024 HS8703 Motor cars for transport of persons",
"v": 1714.0
},
{
"hs": "HS8703",
"t": "Motor cars for transport of persons   906 HS2710 Petroleum oils, other than crude",
"v": 1335.0
},
{
"hs": "HS7202",
"t": "Ferro-alloys   460 HS2603 Copper ores and concentrates",
"v": 775.0
},
{
"hs": "HS3102",
"t": "Nitrogenous fertilisers   281 HS2711 Petroleum gases",
"v": 458.0
},
{
"hs": "HS3004",
"t": "Medicaments in measured doses   110 HS3004 Medicaments in measured doses",
"v": 404.0
}
]
},
"Germany": {
"aus": 1657577.0,
"bip": 4075395.0,
"bipJahr": 2022,
"ein": 1570752.0,
"name": "Germany",
"pAus": [
{
"l": "European Union",
"p": 53.5
},
{
"l": "United States of America",
"p": 9.9
},
{
"l": "China",
"p": 6.8
},
{
"l": "United Kingdom",
"p": 4.7
},
{
"l": "Switzerland",
"p": 4.6
}
],
"pEin": [
{
"l": "European Union",
"p": 48.0
},
{
"l": "China",
"p": 13.0
},
{
"l": "United States of America",
"p": 6.2
},
{
"l": "Switzerland",
"p": 3.8
},
{
"l": "United Kingdom",
"p": 2.5
}
],
"pJahr": 2022,
"restAus": 20.5,
"restEin": 26.5,
"seite": 144,
"wAus": {
"agrar": 6.4,
"energie": 6.2,
"industrie": 85.9,
"sonst": 1.5
},
"wEin": {
"agrar": 9.1,
"energie": 14.3,
"industrie": 73.3,
"sonst": 3.2
},
"wJahr": 2021,
"waren": [
{
"hs": "HS0406",
"t": "Cheese and curd  6 208 HS0406 Cheese and curd",
"v": 5313.0
},
{
"hs": "HS1806",
"t": "Chocolate and other cocoa food  5 639 HS0901 Coffee",
"v": 5087.0
},
{
"hs": "HS1905",
"t": "Bread, pastry,  other bakers' wares  4 848 HS1205 Rape or colza seeds",
"v": 4367.0
},
{
"hs": "HS2106",
"t": "Other food preparations  4 827 HS2309 Preparations of a kind used in animal feeding",
"v": 3119.0
},
{
"hs": "HS2309",
"t": "Preparations of a kind used in animal feeding  4 705 HS1905 Bread, pastry,  other bakers' wares",
"v": 3097.0
},
{
"hs": "HS8703",
"t": "Motor cars for transport of persons  156 480 HS2711 Petroleum gases",
"v": 77560.0
},
{
"hs": "HS3004",
"t": "Medicaments in measured doses  74 505 HS8703 Motor cars for transport of persons",
"v": 68614.0
},
{
"hs": "HS8708",
"t": "Parts for motor vehicles 8701-8075  60 613 HS2709 Petroleum oils, crude",
"v": 62368.0
},
{
"hs": "HS3002",
"t": "Human and animal blood  45 650 HS3002 Human and animal blood",
"v": 41590.0
},
{
"hs": "HS2710",
"t": "Petroleum oils, other than crude  25 083 HS8708 Parts for motor vehicles 8701-8075",
"v": 40042.0
}
]
},
"Ghana": {
"aus": 17494.0,
"bip": 72839.0,
"bipJahr": 2022,
"ein": 14621.0,
"name": "Ghana",
"pAus": [
{
"l": "China",
"p": 16.7
},
{
"l": "European Union",
"p": 15.2
},
{
"l": "Switzerland",
"p": 14.7
},
{
"l": "India",
"p": 14.2
},
{
"l": "South Africa",
"p": 11.8
}
],
"pEin": [
{
"l": "European Union",
"p": 18.6
},
{
"l": "China",
"p": 18.2
},
{
"l": "United States of America",
"p": 9.4
},
{
"l": "United Kingdom",
"p": 6.6
},
{
"l": "India",
"p": 5.6
}
],
"pJahr": 2019,
"restAus": 27.4,
"restEin": 41.7,
"seite": 146,
"wAus": {
"agrar": 54.3,
"energie": 3.4,
"industrie": 14.7,
"sonst": 27.6
},
"wEin": {
"agrar": 9.9,
"energie": 1.3,
"industrie": 40.8,
"sonst": 48.1
},
"wJahr": 2021,
"waren": [
{
"hs": "HS1801",
"t": "Cocoa beans, whole or broken  1 852 HS1006 Rice",
"v": 375.0
},
{
"hs": "HS1803",
"t": "Cocoa paste   410 HS1001 Wheat and meslin",
"v": 140.0
},
{
"hs": "HS1804",
"t": "Cocoa butter, fat and oil   337 HS1701 Cane or beet sugar",
"v": 139.0
},
{
"hs": "HS0801",
"t": "Coconuts, Brazil nuts, cashew nuts   246 HS1511 Palm oil and its fractions",
"v": 137.0
},
{
"hs": "HS1511",
"t": "Palm oil and its fractions   109 HS1104 Cereal grains otherwise worked",
"v": 122.0
},
{
"hs": "HS7108",
"t": "Gold  6 199 HS8703 Motor cars for transport of persons",
"v": 882.0
},
{
"hs": "HS2709",
"t": "Petroleum oils, crude  5 252 HS8704 Motor vehicles for goods transport",
"v": 442.0
},
{
"hs": "HS2602",
"t": "Manganese ores and concentrates   350 HS2523 Portland cement, aluminous cement",
"v": 320.0
},
{
"hs": "HS1604",
"t": "Prepared or preserved fish   146 HS2710 Petroleum oils, other than crude",
"v": 236.0
},
{
"hs": "HS2843",
"t": "Colloidal precious metals   121 HS4406 Railway or tramway sleepers of wood",
"v": 218.0
}
]
},
"Greece": {
"aus": 57392.0,
"bip": 219237.0,
"bipJahr": 2022,
"ein": 97696.0,
"name": "Greece",
"pAus": [
{
"l": "European Union",
"p": 54.0
},
{
"l": "Turkey",
"p": 4.6
},
{
"l": "United States of America",
"p": 4.1
},
{
"l": "United Kingdom",
"p": 3.9
},
{
"l": "Libya",
"p": 3.4
}
],
"pEin": [
{
"l": "European Union",
"p": 40.0
},
{
"l": "Russia",
"p": 10.0
},
{
"l": "China",
"p": 8.5
},
{
"l": "Iraq",
"p": 7.3
},
{
"l": "United States of America",
"p": 3.7
}
],
"pJahr": 2022,
"restAus": 30.0,
"restEin": 30.5,
"seite": 148,
"wAus": {
"agrar": 21.6,
"energie": 37.4,
"industrie": 39.3,
"sonst": 1.8
},
"wEin": {
"agrar": 12.9,
"energie": 31.0,
"industrie": 55.0,
"sonst": 1.0
},
"wJahr": 2021,
"waren": [
{
"hs": "HS1509",
"t": "Olive oil and its fractions   844 HS0406 Cheese and curd",
"v": 720.0
},
{
"hs": "HS0406",
"t": "Cheese and curd   805 HS0201 Bovine meat, fresh, chilled",
"v": 590.0
},
{
"hs": "HS2005",
"t": "Other vegetables not frozen   686 HS0203 Swine meat, fresh, chilled, frozen",
"v": 546.0
},
{
"hs": "HS5201",
"t": "Cotton, not carded or combed   663 HS1001 Wheat and meslin",
"v": 400.0
},
{
"hs": "HS2008",
"t": "Plants' parts otherwise preserved   512 HS0901 Coffee",
"v": 352.0
},
{
"hs": "HS2710",
"t": "Petroleum oils, other than crude  17 261 HS2709 Petroleum oils, crude",
"v": 15697.0
},
{
"hs": "HS2711",
"t": "Petroleum gases  2 678 HS2711 Petroleum gases",
"v": 10448.0
},
{
"hs": "HS3004",
"t": "Medicaments in measured doses  2 549 HS2710 Petroleum oils, other than crude",
"v": 6822.0
},
{
"hs": "HS7606",
"t": "Aluminium plates, sheets and strip  1 123 HS3004 Medicaments in measured doses",
"v": 2766.0
},
{
"hs": "HS8471",
"t": "Automatic data-processing machines   960 HS8703 Motor cars for transport of persons",
"v": 2296.0
}
]
},
"Grenada": {
"aus": 37.0,
"bip": 1193.0,
"bipJahr": 2022,
"ein": 589.0,
"name": "Grenada",
"pAus": [
{
"l": "United States of America",
"p": 16.1
},
{
"l": "St. Vin. and Gren.",
"p": 3.3
},
{
"l": "Hong Kong",
"p": 2.5
},
{
"l": "Barbados",
"p": 1.9
},
{
"l": "Saint Lucia",
"p": 1.9
}
],
"pEin": [
{
"l": "United States of America",
"p": 34.0
},
{
"l": "Trinidad and Tobago",
"p": 17.3
},
{
"l": "Cayman Is.",
"p": 11.8
},
{
"l": "European Union",
"p": 4.3
},
{
"l": "China",
"p": 3.0
}
],
"pJahr": 2022,
"restAus": 74.4,
"restEin": 29.6,
"seite": 150,
"wAus": {
"agrar": 67.6,
"energie": 0.3,
"industrie": 31.9,
"sonst": 0.1
},
"wEin": {
"agrar": 26.2,
"energie": 15.6,
"industrie": 57.0,
"sonst": 1.1
},
"wJahr": 2021,
"waren": [
{
"hs": "HS1101",
"t": "Wheat or meslin flour   6 HS0207 Meat and edible offal of poultry",
"v": 15.0
},
{
"hs": "HS0908",
"t": "Nutmeg, mace and cardamoms   6 HS2106 Other food preparations",
"v": 10.0
},
{
"hs": "HS2309",
"t": "Preparations of a kind used in animal feeding   4 HS1101 Wheat or meslin flour",
"v": 8.0
},
{
"hs": "HS0810",
"t": "Other fruit, fresh   3 HS2202 Waters containing added sugar",
"v": 8.0
},
{
"hs": "HS2202",
"t": "Waters containing added sugar   2 HS1905 Bread, pastry,  other bakers' wares",
"v": 7.0
},
{
"hs": "HS0302",
"t": "Fish, fresh, chilled   2 HS2710 Petroleum oils, other than crude",
"v": 110.0
},
{
"hs": "HS4818",
"t": "Toilet paper and similar paper   2 HS8703 Motor cars for transport of persons",
"v": 12.0
},
{
"hs": "HS3209",
"t": "Paints and varnishes, aqueous   2 HS2523 Portland cement, aluminous cement",
"v": 10.0
},
{
"hs": "HS7204",
"t": "Ferrous waste and scrap   1 HS8704 Motor vehicles for goods transport",
"v": 8.0
},
{
"hs": "HS8703",
"t": "Motor cars for transport of persons 0.5 HS2711 Petroleum gases",
"v": 8.0
}
]
},
"Guatemala": {
"aus": 15695.0,
"bip": 93655.0,
"bipJahr": 2022,
"ein": 32116.0,
"name": "Guatemala",
"pAus": [
{
"l": "United States of America",
"p": 32.3
},
{
"l": "El Salvador",
"p": 13.0
},
{
"l": "Honduras",
"p": 10.0
},
{
"l": "European Union",
"p": 9.6
},
{
"l": "Nicaragua",
"p": 6.3
}
],
"pEin": [
{
"l": "United States of America",
"p": 32.0
},
{
"l": "China",
"p": 18.2
},
{
"l": "Mexico",
"p": 10.1
},
{
"l": "European Union",
"p": 7.0
},
{
"l": "El Salvador",
"p": 3.3
}
],
"pJahr": 2022,
"restAus": 28.8,
"restEin": 29.3,
"seite": 152,
"wAus": {
"agrar": 49.0,
"energie": 4.1,
"industrie": 46.8,
"sonst": 0.2
},
"wEin": {
"agrar": 17.3,
"energie": 16.4,
"industrie": 66.2,
"sonst": 0.1
},
"wJahr": 2021,
"waren": [
{
"hs": "HS0901",
"t": "Coffee  1 116 HS1005 Maize (corn)",
"v": 571.0
},
{
"hs": "HS0803",
"t": "Bananas, including plantains  1 068 HS2106 Other food preparations",
"v": 411.0
},
{
"hs": "HS1511",
"t": "Palm oil and its fractions   920 HS1001 Wheat and meslin",
"v": 330.0
},
{
"hs": "HS1701",
"t": "Cane or beet sugar   800 HS2304 Solid residues from soya-bean oil",
"v": 290.0
},
{
"hs": "HS0908",
"t": "Nutmeg, mace and cardamoms   419 HS1507 Soya-bean oil and its fractions",
"v": 217.0
},
{
"hs": "HS6110",
"t": "Jerseys, pullovers, cardigans   518 HS2710 Petroleum oils, other than crude",
"v": 4465.0
},
{
"hs": "HS7202",
"t": "Ferro-alloys   469 HS8517 Line telephony electrical apparatus",
"v": 816.0
},
{
"hs": "HS6109",
"t": "T-shirts, singlets and other vests   366 HS8703 Motor cars for transport of persons",
"v": 775.0
},
{
"hs": "HS6105",
"t": "Men's or boys' shirts   359 HS3004 Medicaments in measured doses",
"v": 760.0
},
{
"hs": "HS3004",
"t": "Medicaments in measured doses   335 HS8704 Motor vehicles for goods transport",
"v": 641.0
}
]
},
"Guinea": {
"aus": 7650.0,
"bip": 20469.0,
"bipJahr": 2022,
"ein": 4679.0,
"name": "Guinea",
"pAus": [
{
"l": "United Arab Emirates",
"p": 27.6
},
{
"l": "European Union",
"p": 24.4
},
{
"l": "Ghana",
"p": 15.3
},
{
"l": "India",
"p": 9.1
},
{
"l": "Switzerland",
"p": 7.7
}
],
"pEin": [
{
"l": "European Union",
"p": 31.8
},
{
"l": "China",
"p": 16.8
},
{
"l": "United Arab Emirates",
"p": 13.4
},
{
"l": "India",
"p": 8.3
},
{
"l": "United Kingdom",
"p": 6.4
}
],
"pJahr": 2016,
"restAus": 15.9,
"restEin": 23.3,
"seite": 154,
"wAus": {
"agrar": 3.3,
"energie": 50.6,
"industrie": 0.4,
"sonst": 45.6
},
"wEin": {
"agrar": 22.7,
"energie": 3.1,
"industrie": 73.5,
"sonst": 0.7
},
"wJahr": 2021,
"waren": [
{
"hs": "HS0801",
"t": "Coconuts, Brazil nuts, cashew nuts   29 HS0804 Dates, figs, pineapples, avocados",
"v": 333.0
},
{
"hs": "HS0901",
"t": "Coffee   20 HS1006 Rice",
"v": 288.0
},
{
"hs": "HS1801",
"t": "Cocoa beans, whole or broken   9 HS1701 Cane or beet sugar",
"v": 45.0
},
{
"hs": "HS5201",
"t": "Cotton, not carded or combed   7 HS1001 Wheat and meslin",
"v": 41.0
},
{
"hs": "HS0802",
"t": "Other nuts, fresh or dried   4 HS2402 Cigars, cheroots, cigarillos",
"v": 41.0
},
{
"hs": "HS7108",
"t": "Gold  1 529 HS2710 Petroleum oils, other than crude",
"v": 471.0
},
{
"hs": "HS2606",
"t": "Aluminium ores and concentrates   615 HS8429 Self-propelled bulldozers",
"v": 368.0
},
{
"hs": "HS7102",
"t": "Diamonds, whether or not worked   33 HS8704 Motor vehicles for goods transport",
"v": 200.0
},
{
"hs": "HS4001",
"t": "Natural rubber, balata   27 HS3004 Medicaments in measured doses",
"v": 172.0
},
{
"hs": "HS3924",
"t": "Household and toilet articles   27 HS8708 Parts for motor vehicles 8701-8075",
"v": 74.0
}
]
},
"Guinea-Bissau": {
"aus": 213.0,
"bip": 1705.0,
"bipJahr": 2022,
"ein": 474.0,
"name": "Guinea-Bissau",
"pAus": [
{
"l": "India",
"p": 86.6
},
{
"l": "Singapore",
"p": 12.1
},
{
"l": "European Union",
"p": 0.8
},
{
"l": "Panama",
"p": 0.2
},
{
"l": "North Korea",
"p": 0.2
}
],
"pEin": [
{
"l": "European Union",
"p": 46.8
},
{
"l": "Senegal",
"p": 40.9
},
{
"l": "Thailand",
"p": 7.0
},
{
"l": "China",
"p": 2.4
},
{
"l": "Gambia",
"p": 1.6
}
],
"pJahr": 2005,
"restAus": 0.1,
"restEin": 1.3,
"seite": 156,
"waren": []
},
"Guyana": {
"aus": 11299.0,
"bip": 14521.0,
"bipJahr": 2022,
"ein": 3617.0,
"name": "Guyana",
"pAus": [
{
"l": "United States of America",
"p": 34.4
},
{
"l": "Trinidad and Tobago",
"p": 25.9
},
{
"l": "Singapore",
"p": 10.2
},
{
"l": "Barbados",
"p": 6.3
},
{
"l": "United Arab Emirates",
"p": 6.1
}
],
"pEin": [
{
"l": "Bahamas",
"p": 59.6
},
{
"l": "United States of America",
"p": 14.3
},
{
"l": "Trinidad and Tobago",
"p": 4.9
},
{
"l": "China",
"p": 4.0
},
{
"l": "European Union",
"p": 2.7
}
],
"pJahr": 2022,
"restAus": 17.2,
"restEin": 14.5,
"seite": 158,
"wAus": {
"agrar": 9.0,
"energie": 69.5,
"industrie": 6.4,
"sonst": 15.1
},
"wEin": {
"agrar": 8.8,
"energie": 14.6,
"industrie": 71.7,
"sonst": 5.0
},
"wJahr": 2021,
"waren": [
{
"hs": "HS1006",
"t": "Rice   208 HS2202 Waters containing added sugar",
"v": 39.0
},
{
"hs": "HS2208",
"t": "Alcohol of less than 80% volume   61 HS0402 Milk and cream, concentrated",
"v": 30.0
},
{
"hs": "HS1701",
"t": "Cane or beet sugar   17 HS1905 Bread, pastry,  other bakers' wares",
"v": 29.0
},
{
"hs": "HS0801",
"t": "Coconuts, Brazil nuts, cashew nuts   7 HS1001 Wheat and meslin",
"v": 26.0
},
{
"hs": "HS2202",
"t": "Waters containing added sugar   3 HS1005 Maize (corn)",
"v": 21.0
},
{
"hs": "HS2709",
"t": "Petroleum oils, crude  4 290 HS8905 Vessels not mainly for navigability",
"v": 5134.0
},
{
"hs": "HS8609",
"t": "Containers designed for transport  2 357 HS2710 Petroleum oils, other than crude",
"v": 1068.0
},
{
"hs": "HS7108",
"t": "Gold   383 HS8429 Self-propelled bulldozers",
"v": 111.0
},
{
"hs": "HS8905",
"t": "Vessels not mainly for navigability   163 HS8481 Appliances for pipes, boiler shells",
"v": 93.0
},
{
"hs": "HS2606",
"t": "Aluminium ores and concentrates   100 HS8703 Motor cars for transport of persons",
"v": 82.0
}
]
},
"Haiti": {
"aus": 1282.0,
"bip": 20535.0,
"bipJahr": 2022,
"ein": 4622.0,
"name": "Haiti",
"seite": 160,
"wAus": {
"agrar": 6.0,
"energie": 2.8,
"industrie": 91.1,
"sonst": 0.1
},
"wEin": {
"agrar": 23.4,
"energie": 21.4,
"industrie": 49.2,
"sonst": 6.0
},
"wJahr": 2021,
"waren": []
},
"Honduras": {
"aus": 12169.0,
"bip": 31521.0,
"bipJahr": 2022,
"ein": 17581.0,
"name": "Honduras",
"pAus": [
{
"l": "United States of America",
"p": 43.3
},
{
"l": "European Union",
"p": 19.4
},
{
"l": "El Salvador",
"p": 5.9
},
{
"l": "Guatemala",
"p": 4.5
},
{
"l": "Nicaragua",
"p": 4.3
}
],
"pEin": [
{
"l": "United States of America",
"p": 34.3
},
{
"l": "China",
"p": 17.9
},
{
"l": "Mexico",
"p": 7.6
},
{
"l": "European Union",
"p": 5.9
},
{
"l": "Guatemala",
"p": 5.6
}
],
"pJahr": 2021,
"restAus": 22.4,
"restEin": 28.7,
"seite": 162,
"wAus": {
"agrar": 30.8,
"energie": 1.1,
"industrie": 55.1,
"sonst": 13.0
},
"wEin": {
"agrar": 16.3,
"energie": 11.4,
"industrie": 64.3,
"sonst": 8.1
},
"wJahr": 2021,
"waren": [
{
"hs": "HS0901",
"t": "Coffee  1 292 HS2106 Other food preparations",
"v": 224.0
},
{
"hs": "HS1511",
"t": "Palm oil and its fractions   236 HS1005 Maize (corn)",
"v": 223.0
},
{
"hs": "HS0803",
"t": "Bananas, including plantains   137 HS2304 Solid residues from soya-bean oil",
"v": 150.0
},
{
"hs": "HS0709",
"t": "Other vegetables, fresh or chilled   101 HS0203 Swine meat, fresh, chilled, frozen",
"v": 118.0
},
{
"hs": "HS0807",
"t": "Melons and papaws, fresh   89 HS2309 Preparations of a kind used in animal feeding",
"v": 111.0
},
{
"hs": "HS8544",
"t": "Insulated electric conductors   812 HS2710 Petroleum oils, other than crude",
"v": 1574.0
},
{
"hs": "HS0306",
"t": "Crustaceans whether in shell or not   510 HS3004 Medicaments in measured doses",
"v": 552.0
},
{
"hs": "HS7108",
"t": "Gold   163 HS7210 Flat-rolled products of iron +600",
"v": 349.0
},
{
"hs": "HS7210",
"t": "Flat-rolled products of iron +600   83 HS8704 Motor vehicles for goods transport",
"v": 328.0
},
{
"hs": "HS7306",
"t": "Other tubes, pipes of iron or steel   70 HS8703 Motor cars for transport of persons",
"v": 258.0
}
]
},
"Hong Kong": {
"aus": 609925.0,
"bip": 360983.0,
"bipJahr": 2022,
"ein": 667554.0,
"name": "Hong Kong, China",
"pAus": [
{
"l": "China",
"p": 57.4
},
{
"l": "European Union",
"p": 6.5
},
{
"l": "United States of America",
"p": 6.2
},
{
"l": "India",
"p": 3.7
},
{
"l": "Taiwan",
"p": 3.3
}
],
"pEin": [
{
"l": "China",
"p": 40.1
},
{
"l": "Taiwan",
"p": 11.3
},
{
"l": "Singapore",
"p": 7.7
},
{
"l": "South Korea",
"p": 5.6
},
{
"l": "Japan",
"p": 5.3
}
],
"pJahr": 2022,
"restAus": 22.8,
"restEin": 30.0,
"seite": 164,
"wAus": {
"agrar": 1.4,
"energie": 2.3,
"industrie": 91.5,
"sonst": 4.8
},
"wEin": {
"agrar": 3.8,
"energie": 3.5,
"industrie": 88.3,
"sonst": 4.4
},
"wJahr": 2021,
"waren": [
{
"hs": "HS0809",
"t": "Apricots, cherries, peaches  1 443 HS0809 Apricots, cherries, peaches",
"v": 1540.0
},
{
"hs": "HS2106",
"t": "Other food preparations   869 HS2106 Other food preparations",
"v": 1209.0
},
{
"hs": "HS0810",
"t": "Other fruit, fresh   657 HS2204 Wine of fresh grapes",
"v": 1020.0
},
{
"hs": "HS0101",
"t": "Live horses, asses, mules, hinnies   576 HS0810 Other fruit, fresh",
"v": 953.0
},
{
"hs": "HS1905",
"t": "Bread, pastry,  other bakers' wares   456 HS0207 Meat and edible offal of poultry",
"v": 732.0
},
{
"hs": "HS8542",
"t": "Electronic integrated circuits  214 203 HS8542 Electronic integrated circuits",
"v": 222405.0
},
{
"hs": "HS8525",
"t": "Radio-telephony transmission tools  55 946 HS8525 Radio-telephony transmission tools",
"v": 59030.0
},
{
"hs": "HS7108",
"t": "Gold  30 126 HS7108 Gold",
"v": 38014.0
},
{
"hs": "HS8473",
"t": "Parts and accessories for 8469-8472  29 996 HS8473 Parts and accessories for 8469-8472",
"v": 25425.0
},
{
"hs": "HS8471",
"t": "Automatic data-processing machines  27 910 HS8471 Automatic data-processing machines",
"v": 24577.0
}
]
},
"Hungary": {
"aus": 151540.0,
"bip": 168294.0,
"bipJahr": 2022,
"ein": 164294.0,
"name": "Hungary",
"pAus": [
{
"l": "European Union",
"p": 76.7
},
{
"l": "United States of America",
"p": 3.5
},
{
"l": "United Kingdom",
"p": 3.2
},
{
"l": "Serbia",
"p": 2.5
},
{
"l": "Ukraine",
"p": 1.6
}
],
"pEin": [
{
"l": "European Union",
"p": 68.8
},
{
"l": "China",
"p": 6.8
},
{
"l": "Russia",
"p": 6.1
},
{
"l": "South Korea",
"p": 3.9
},
{
"l": "United States of America",
"p": 1.9
}
],
"pJahr": 2022,
"restAus": 12.5,
"restEin": 12.6,
"seite": 166,
"wAus": {
"agrar": 8.9,
"energie": 5.4,
"industrie": 83.5,
"sonst": 2.2
},
"wEin": {
"agrar": 6.7,
"energie": 12.2,
"industrie": 79.4,
"sonst": 1.7
},
"wJahr": 2021,
"waren": [
{
"hs": "HS2309",
"t": "Preparations of a kind used in animal feeding  1 061 HS1005 Maize (corn)",
"v": 618.0
},
{
"hs": "HS1512",
"t": "Sunflower-seed,or cotton oil  1 002 HS1206 Sunflower seeds",
"v": 537.0
},
{
"hs": "HS1005",
"t": "Maize (corn)   917 HS2309 Preparations of a kind used in animal feeding",
"v": 518.0
},
{
"hs": "HS1001",
"t": "Wheat and meslin   718 HS2106 Other food preparations",
"v": 414.0
},
{
"hs": "HS2207",
"t": "Alcohol of 80% or more volume   703 HS1905 Bread, pastry,  other bakers' wares",
"v": 368.0
},
{
"hs": "HS8703",
"t": "Motor cars for transport of persons  12 163 HS2711 Petroleum gases",
"v": 9851.0
},
{
"hs": "HS8708",
"t": "Parts for motor vehicles 8701-8075  7 771 HS2716 Electrical energy",
"v": 7594.0
},
{
"hs": "HS8507",
"t": "Electric accumulators  7 427 HS8708 Parts for motor vehicles 8701-8075",
"v": 6652.0
},
{
"hs": "HS8471",
"t": "Automatic data-processing machines  5 008 HS8542 Electronic integrated circuits",
"v": 3798.0
},
{
"hs": "HS3004",
"t": "Medicaments in measured doses  3 995 HS8525 Radio-telephony transmission tools",
"v": 3542.0
}
]
},
"Iceland": {
"aus": 7389.0,
"bip": 27842.0,
"bipJahr": 2022,
"ein": 9591.0,
"name": "Iceland",
"pAus": [
{
"l": "European Union",
"p": 66.0
},
{
"l": "United Kingdom",
"p": 9.0
},
{
"l": "United States of America",
"p": 7.8
},
{
"l": "Norway",
"p": 5.3
},
{
"l": "Japan",
"p": 2.2
}
],
"pEin": [
{
"l": "European Union",
"p": 45.1
},
{
"l": "Norway",
"p": 12.3
},
{
"l": "China",
"p": 9.4
},
{
"l": "United States of America",
"p": 6.3
},
{
"l": "United Kingdom",
"p": 3.9
}
],
"pJahr": 2022,
"restAus": 9.7,
"restEin": 23.0,
"seite": 168,
"wAus": {
"agrar": 46.5,
"energie": 40.9,
"industrie": 11.9,
"sonst": 0.7
},
"wEin": {
"agrar": 12.5,
"energie": 17.5,
"industrie": 69.9,
"sonst": 0.0
},
"wJahr": 2021,
"waren": [
{
"hs": "HS2201",
"t": "Waters, natural or artificial   31 HS2309 Preparations of a kind used in animal feeding",
"v": 137.0
},
{
"hs": "HS0208",
"t": "Other meat and edible meat offal   20 HS2106 Other food preparations",
"v": 57.0
},
{
"hs": "HS0511",
"t": "Other animal products   20 HS1905 Bread, pastry,  other bakers' wares",
"v": 50.0
},
{
"hs": "HS0204",
"t": "Meat of sheep or goats, fresh   20 HS2202 Waters containing added sugar",
"v": 46.0
},
{
"hs": "HS0101",
"t": "Live horses, asses, mules, hinnies   12 HS2204 Wine of fresh grapes",
"v": 35.0
},
{
"hs": "HS7601",
"t": "Unwrought aluminium  2 651 HS2710 Petroleum oils, other than crude",
"v": 1319.0
},
{
"hs": "HS0304",
"t": "Fish fillets and other fish meat  1 152 HS8703 Motor cars for transport of persons",
"v": 737.0
},
{
"hs": "HS0302",
"t": "Fish, fresh, chilled   466 HS2818 Artificial corundum",
"v": 698.0
},
{
"hs": "HS0303",
"t": "Fish, frozen, excluding fish fillet   362 HS8545 Articles of graphite/other carbon",
"v": 494.0
},
{
"hs": "HS7202",
"t": "Ferro-alloys   344 HS8471 Automatic data-processing machines",
"v": 306.0
}
]
},
"India": {
"aus": 453400.0,
"bip": 3386403.0,
"bipJahr": 2022,
"ein": 720441.0,
"name": "India",
"pAus": [
{
"l": "United States of America",
"p": 17.7
},
{
"l": "European Union",
"p": 16.2
},
{
"l": "United Arab Emirates",
"p": 6.9
},
{
"l": "China",
"p": 3.3
},
{
"l": "Bangladesh",
"p": 3.1
}
],
"pEin": [
{
"l": "China",
"p": 14.0
},
{
"l": "European Union",
"p": 7.5
},
{
"l": "United Arab Emirates",
"p": 7.4
},
{
"l": "United States of America",
"p": 7.1
},
{
"l": "Saudi Arabia",
"p": 6.3
}
],
"pJahr": 2022,
"restAus": 52.7,
"restEin": 57.9,
"seite": 170,
"wAus": {
"agrar": 12.8,
"energie": 19.1,
"industrie": 67.9,
"sonst": 0.2
},
"wEin": {
"agrar": 6.7,
"energie": 35.2,
"industrie": 47.7,
"sonst": 10.4
},
"wJahr": 2021,
"waren": [
{
"hs": "HS1006",
"t": "Rice  10 767 HS1511 Palm oil and its fractions",
"v": 11729.0
},
{
"hs": "HS1701",
"t": "Cane or beet sugar  5 742 HS1507 Soya-bean oil and its fractions",
"v": 6096.0
},
{
"hs": "HS0202",
"t": "Meat of bovine animals, frozen  2 860 HS1512 Sunflower-seed,or cotton oil",
"v": 3041.0
},
{
"hs": "HS1001",
"t": "Wheat and meslin  2 131 HS0713 Dried leguminous vegetables",
"v": 1960.0
},
{
"hs": "HS1515",
"t": "Other fixed vegetable fats and oils  1 206 HS0801 Coconuts, Brazil nuts, cashew nuts",
"v": 1912.0
},
{
"hs": "HS2710",
"t": "Petroleum oils, other than crude  94 399 HS2709 Petroleum oils, crude",
"v": 173516.0
},
{
"hs": "HS7102",
"t": "Diamonds, whether or not worked  23 920 HS2701 Coal; briquettes, ovoids",
"v": 48986.0
},
{
"hs": "HS3004",
"t": "Medicaments in measured doses  17 451 HS7108 Gold",
"v": 36575.0
},
{
"hs": "HS7113",
"t": "Articles and parts of jewellery  12 306 HS2711 Petroleum gases",
"v": 32369.0
},
{
"hs": "HS8525",
"t": "Radio-telephony transmission tools  8 452 HS7102 Diamonds, whether or not worked",
"v": 27302.0
}
]
},
"Indonesia": {
"aus": 291979.0,
"bip": 1318807.0,
"bipJahr": 2022,
"ein": 237447.0,
"name": "Indonesia",
"pAus": [
{
"l": "China",
"p": 23.2
},
{
"l": "United States of America",
"p": 11.2
},
{
"l": "European Union",
"p": 7.8
},
{
"l": "Japan",
"p": 7.7
},
{
"l": "India",
"p": 5.7
}
],
"pEin": [
{
"l": "China",
"p": 28.7
},
{
"l": "Singapore",
"p": 7.9
},
{
"l": "Japan",
"p": 7.5
},
{
"l": "United States of America",
"p": 5.8
},
{
"l": "European Union",
"p": 5.7
}
],
"pJahr": 2021,
"restAus": 44.4,
"restEin": 44.6,
"seite": 172,
"wAus": {
"agrar": 28.3,
"energie": 26.5,
"industrie": 45.2,
"sonst": 0.0
},
"wEin": {
"agrar": 14.2,
"energie": 18.8,
"industrie": 65.3,
"sonst": 1.7
},
"wJahr": 2021,
"waren": [
{
"hs": "HS1511",
"t": "Palm oil and its fractions  26 665 HS1001 Wheat and meslin",
"v": 3548.0
},
{
"hs": "HS3823",
"t": "Industrial monocarboxylic acids  5 299 HS2304 Solid residues from soya-bean oil",
"v": 2679.0
},
{
"hs": "HS1513",
"t": "Coconut (copra), or palm kernel oil  2 885 HS1701 Cane or beet sugar",
"v": 2382.0
},
{
"hs": "HS1517",
"t": "Margarine; edible mixtures oil  1 634 HS1201 Soya beans, whether or not broken",
"v": 1483.0
},
{
"hs": "HS2306",
"t": "Solid residues from other oil  1 327 HS5201 Cotton, not carded or combed",
"v": 1104.0
},
{
"hs": "HS2701",
"t": "Coal; briquettes, ovoids  26 538 HS2710 Petroleum oils, other than crude",
"v": 13971.0
},
{
"hs": "HS2711",
"t": "Petroleum gases  7 483 HS2709 Petroleum oils, crude",
"v": 7047.0
},
{
"hs": "HS7202",
"t": "Ferro-alloys  7 125 HS8517 Line telephony electrical apparatus",
"v": 4270.0
},
{
"hs": "HS7219",
"t": "Flat-rolled steel more than 600  6 586 HS2711 Petroleum gases",
"v": 4091.0
},
{
"hs": "HS2603",
"t": "Copper ores and concentrates  5 386 HS3002 Human and animal blood",
"v": 3400.0
}
]
},
"Iran": {
"aus": 77200.0,
"bip": 352213.0,
"bipJahr": 2022,
"ein": 55446.0,
"name": "Iran",
"pAus": [
{
"l": "China",
"p": 9.5
},
{
"l": "Iraq",
"p": 9.3
},
{
"l": "United Arab Emirates",
"p": 6.2
},
{
"l": "Afghanistan",
"p": 3.0
},
{
"l": "South Korea",
"p": 2.7
}
],
"pEin": [
{
"l": "China",
"p": 24.9
},
{
"l": "European Union",
"p": 19.9
},
{
"l": "United Arab Emirates",
"p": 13.8
},
{
"l": "India",
"p": 6.4
},
{
"l": "Turkey",
"p": 6.3
}
],
"pJahr": 2018,
"restAus": 69.3,
"restEin": 28.7,
"seite": 174,
"wAus": {
"agrar": 8.0,
"energie": 36.8,
"industrie": 32.9,
"sonst": 22.4
},
"wEin": {
"agrar": 33.4,
"energie": 2.9,
"industrie": 60.6,
"sonst": 3.0
},
"wJahr": 2021,
"waren": [
{
"hs": "HS0802",
"t": "Other nuts, fresh or dried   488 HS1005 Maize (corn)",
"v": 2115.0
},
{
"hs": "HS0804",
"t": "Dates, figs, pineapples, avocados   372 HS1006 Rice",
"v": 1629.0
},
{
"hs": "HS0910",
"t": "Ginger, saffron, turmeric, thyme   354 HS1201 Soya beans, whether or not broken",
"v": 1161.0
},
{
"hs": "HS1905",
"t": "Bread, pastry,  other bakers' wares   322 HS2304 Solid residues from soya-bean oil",
"v": 651.0
},
{
"hs": "HS0702",
"t": "Tomatoes, fresh or chilled   245 HS1003 Barley",
"v": 603.0
},
{
"hs": "HS2709",
"t": "Petroleum oils, crude  50 823 HS3004 Medicaments in measured doses",
"v": 1115.0
},
{
"hs": "HS2710",
"t": "Petroleum oils, other than crude  9 012 HS8525 Radio-telephony transmission tools",
"v": 782.0
},
{
"hs": "HS2711",
"t": "Petroleum gases  5 276 HS8419 Machinery, plant equipment",
"v": 743.0
},
{
"hs": "HS3901",
"t": "Polymers of ethylene, primary forms  3 386 HS8708 Parts for motor vehicles 8701-8075",
"v": 690.0
},
{
"hs": "HS2905",
"t": "Acyclic alcohols, their derivatives  2 186 HS8545 Articles of graphite/other carbon",
"v": 655.0
}
]
},
"Iraq": {
"aus": 138291.0,
"bip": 270364.0,
"bipJahr": 2022,
"ein": 87216.0,
"name": "Iraq",
"pAus": [
{
"l": "Singapore",
"p": 0.2
},
{
"l": "United Arab Emirates",
"p": 0.0
},
{
"l": "European Union",
"p": 0.0
},
{
"l": "Lebanon",
"p": 0.0
},
{
"l": "Iran",
"p": 0.0
}
],
"pEin": [
{
"l": "China",
"p": 28.3
},
{
"l": "United Arab Emirates",
"p": 14.9
},
{
"l": "South Korea",
"p": 7.8
},
{
"l": "European Union",
"p": 7.1
},
{
"l": "United States of America",
"p": 6.6
}
],
"pJahr": 2016,
"restAus": 99.8,
"restEin": 35.2,
"seite": 176,
"wAus": {
"agrar": 1.1,
"energie": 97.4,
"industrie": 0.3,
"sonst": 1.1
},
"wEin": {
"agrar": 21.6,
"energie": 10.9,
"industrie": 67.2,
"sonst": 0.3
},
"wJahr": 2021,
"waren": [
{
"hs": "HS4102",
"t": "Raw skins of sheep or lambs   2 HS1001 Wheat and meslin",
"v": 562.0
},
{
"hs": "HS0504",
"t": "Animals' guts, bladders, stomachs   2 HS1006 Rice",
"v": 451.0
},
{
"hs": "HS1704",
"t": "Sugar confectionery 0.1 HS1701 Cane or beet sugar",
"v": 382.0
},
{
"hs": "HS4103",
"t": "Other raw hides and skins 0.1 HS0402 Milk and cream, concentrated",
"v": 137.0
},
{
"hs": "HS0106",
"t": "Other live animals 0.1 HS0207 Meat and edible offal of poultry",
"v": 104.0
},
{
"hs": "HS2709",
"t": "Petroleum oils, crude  43 623 HS2711 Petroleum gases",
"v": 6387.0
},
{
"hs": "HS2710",
"t": "Petroleum oils, other than crude   145 HS7305 Other tubes and pipes",
"v": 4051.0
},
{
"hs": "HS4107",
"t": "Bovine or equine-animals' leather   1 HS7306 Other tubes, pipes of iron or steel",
"v": 3899.0
},
{
"hs": "HS5105",
"t": "Wool and fine or coarse animal hair 0.1 HS2710 Petroleum oils, other than crude",
"v": 2093.0
},
{
"hs": "HS4901",
"t": "Printed books, brochures, leaflets 0.1 HS8504 Electrical transformers",
"v": 1730.0
}
]
},
"Ireland": {
"aus": 213688.0,
"bip": 529661.0,
"bipJahr": 2022,
"ein": 146048.0,
"name": "Ireland",
"pAus": [
{
"l": "European Union",
"p": 38.3
},
{
"l": "United States of America",
"p": 30.3
},
{
"l": "United Kingdom",
"p": 10.6
},
{
"l": "China",
"p": 6.3
},
{
"l": "Japan",
"p": 2.0
}
],
"pEin": [
{
"l": "European Union",
"p": 29.4
},
{
"l": "United Kingdom",
"p": 20.9
},
{
"l": "United States of America",
"p": 15.7
},
{
"l": "China",
"p": 10.3
},
{
"l": "Switzerland",
"p": 4.6
}
],
"pJahr": 2022,
"restAus": 12.6,
"restEin": 19.1,
"seite": 178,
"wAus": {
"agrar": 9.1,
"energie": 1.5,
"industrie": 89.1,
"sonst": 0.3
},
"wEin": {
"agrar": 9.3,
"energie": 7.3,
"industrie": 82.5,
"sonst": 0.9
},
"wJahr": 2021,
"waren": [
{
"hs": "HS0201",
"t": "Bovine meat, fresh, chilled  2 070 HS1905 Bread, pastry,  other bakers' wares",
"v": 578.0
},
{
"hs": "HS0405",
"t": "Butter and other fats and oils  1 778 HS2309 Preparations of a kind used in animal feeding",
"v": 545.0
},
{
"hs": "HS1901",
"t": "Malt extract  1 773 HS1005 Maize (corn)",
"v": 531.0
},
{
"hs": "HS2208",
"t": "Alcohol of less than 80% volume  1 578 HS2202 Waters containing added sugar",
"v": 389.0
},
{
"hs": "HS0406",
"t": "Cheese and curd  1 358 HS0401 Milk and cream, not concentrated",
"v": 387.0
},
{
"hs": "HS3002",
"t": "Human and animal blood  48 496 HS8802 Other aircraft",
"v": 15959.0
},
{
"hs": "HS3004",
"t": "Medicaments in measured doses  23 921 HS2933 Heterocyclic compounds nitrogen",
"v": 14400.0
},
{
"hs": "HS2933",
"t": "Heterocyclic compounds nitrogen  23 333 HS8542 Electronic integrated circuits",
"v": 6510.0
},
{
"hs": "HS8542",
"t": "Electronic integrated circuits  11 996 HS3002 Human and animal blood",
"v": 6100.0
},
{
"hs": "HS2934",
"t": "Nucleic acids and their salts, whet  11 087 HS2710 Petroleum oils, other than crude",
"v": 5253.0
}
]
},
"Israel": {
"aus": 73585.0,
"bip": 522530.0,
"bipJahr": 2022,
"ein": 107269.0,
"name": "Israel",
"pAus": [
{
"l": "United States of America",
"p": 25.4
},
{
"l": "European Union",
"p": 24.2
},
{
"l": "China",
"p": 6.4
},
{
"l": "India",
"p": 5.4
},
{
"l": "United Kingdom",
"p": 4.3
}
],
"pEin": [
{
"l": "European Union",
"p": 25.1
},
{
"l": "China",
"p": 18.2
},
{
"l": "United States of America",
"p": 9.4
},
{
"l": "Turkey",
"p": 6.3
},
{
"l": "India",
"p": 2.9
}
],
"pJahr": 2022,
"restAus": 34.4,
"restEin": 38.1,
"seite": 180,
"wAus": {
"agrar": 4.2,
"energie": 5.4,
"industrie": 88.0,
"sonst": 2.4
},
"wEin": {
"agrar": 10.4,
"energie": 11.5,
"industrie": 76.2,
"sonst": 1.9
},
"wJahr": 2021,
"waren": [
{
"hs": "HS0804",
"t": "Dates, figs, pineapples, avocados   464 HS0202 Meat of bovine animals, frozen",
"v": 713.0
},
{
"hs": "HS2106",
"t": "Other food preparations   254 HS1001 Wheat and meslin",
"v": 617.0
},
{
"hs": "HS0805",
"t": "Citrus fruit, fresh or dried   194 HS1005 Maize (corn)",
"v": 477.0
},
{
"hs": "HS2009",
"t": "Fruit juices and vegetable juices   193 HS0102 Live bovine animals",
"v": 332.0
},
{
"hs": "HS1209",
"t": "Seeds, fruit and spores for sowing   175 HS0201 Bovine meat, fresh, chilled",
"v": 305.0
},
{
"hs": "HS7102",
"t": "Diamonds, whether or not worked  10 880 HS2709 Petroleum oils, crude",
"v": 9747.0
},
{
"hs": "HS8542",
"t": "Electronic integrated circuits  4 966 HS8703 Motor cars for transport of persons",
"v": 6573.0
},
{
"hs": "HS3824",
"t": "Prepared binders for foundry moulds  3 227 HS7102 Diamonds, whether or not worked",
"v": 5924.0
},
{
"hs": "HS3105",
"t": "Mineral or chemical fertilisers  2 551 HS8525 Radio-telephony transmission tools",
"v": 2918.0
},
{
"hs": "HS9018",
"t": "Instruments for medical sciences  2 447 HS8471 Automatic data-processing machines",
"v": 2678.0
}
]
},
"Italy": {
"aus": 657039.0,
"bip": 2012013.0,
"bipJahr": 2022,
"ein": 689256.0,
"name": "Italy",
"pAus": [
{
"l": "European Union",
"p": 52.2
},
{
"l": "United States of America",
"p": 10.4
},
{
"l": "Switzerland",
"p": 4.9
},
{
"l": "United Kingdom",
"p": 4.4
},
{
"l": "China",
"p": 2.7
}
],
"pEin": [
{
"l": "European Union",
"p": 50.5
},
{
"l": "China",
"p": 8.9
},
{
"l": "Russia",
"p": 4.1
},
{
"l": "United States of America",
"p": 3.9
},
{
"l": "Azerbaijan",
"p": 3.1
}
],
"pJahr": 2022,
"restAus": 25.4,
"restEin": 29.5,
"seite": 182,
"wAus": {
"agrar": 10.4,
"energie": 6.3,
"industrie": 80.7,
"sonst": 2.5
},
"wEin": {
"agrar": 11.5,
"energie": 19.0,
"industrie": 67.4,
"sonst": 2.0
},
"wJahr": 2021,
"waren": [
{
"hs": "HS2204",
"t": "Wine of fresh grapes  8 290 HS1001 Wheat and meslin",
"v": 2819.0
},
{
"hs": "HS0406",
"t": "Cheese and curd  4 638 HS0406 Cheese and curd",
"v": 2647.0
},
{
"hs": "HS1902",
"t": "Pasta  4 177 HS0901 Coffee",
"v": 2595.0
},
{
"hs": "HS1905",
"t": "Bread, pastry,  other bakers' wares  3 526 HS0203 Swine meat, fresh, chilled, frozen",
"v": 2339.0
},
{
"hs": "HS2002",
"t": "Tomatoes prepared or preserved  2 588 HS1005 Maize (corn)",
"v": 2306.0
},
{
"hs": "HS3004",
"t": "Medicaments in measured doses  34 330 HS2711 Petroleum gases",
"v": 68698.0
},
{
"hs": "HS2710",
"t": "Petroleum oils, other than crude  25 000 HS2709 Petroleum oils, crude",
"v": 44918.0
},
{
"hs": "HS8703",
"t": "Motor cars for transport of persons  15 982 HS8703 Motor cars for transport of persons",
"v": 25543.0
},
{
"hs": "HS8708",
"t": "Parts for motor vehicles 8701-8075  15 006 HS3004 Medicaments in measured doses",
"v": 20723.0
},
{
"hs": "HS3002",
"t": "Human and animal blood  11 915 HS2716 Electrical energy",
"v": 15065.0
}
]
},
"Jamaica": {
"aus": 1901.0,
"bip": 16039.0,
"bipJahr": 2022,
"ein": 7731.0,
"name": "Jamaica",
"pAus": [
{
"l": "United States of America",
"p": 50.7
},
{
"l": "European Union",
"p": 12.9
},
{
"l": "Canada",
"p": 6.8
},
{
"l": "United Kingdom",
"p": 4.4
},
{
"l": "Russia",
"p": 3.1
}
],
"pEin": [
{
"l": "United States of America",
"p": 40.8
},
{
"l": "Brazil",
"p": 8.6
},
{
"l": "China",
"p": 7.8
},
{
"l": "European Union",
"p": 6.0
},
{
"l": "Japan",
"p": 3.5
}
],
"pJahr": 2021,
"restAus": 22.1,
"restEin": 33.4,
"seite": 184,
"wAus": {
"agrar": 29.1,
"energie": 58.3,
"industrie": 5.0,
"sonst": 7.6
},
"wEin": {
"agrar": 21.6,
"energie": 16.6,
"industrie": 58.7,
"sonst": 3.1
},
"wJahr": 2021,
"waren": [
{
"hs": "HS2208",
"t": "Alcohol of less than 80% volume   64 HS2106 Other food preparations",
"v": 148.0
},
{
"hs": "HS0714",
"t": "Manioc, arrowroot, salep   44 HS1005 Maize (corn)",
"v": 89.0
},
{
"hs": "HS2103",
"t": "Sauces and preparations therefor   34 HS1001 Wheat and meslin",
"v": 58.0
},
{
"hs": "HS2203",
"t": "Beer made from malt   31 HS2207 Alcohol of 80% or more volume",
"v": 53.0
},
{
"hs": "HS2205",
"t": "Vermouth and other wine   29 HS1006 Rice",
"v": 53.0
},
{
"hs": "HS2710",
"t": "Petroleum oils, other than crude   419 HS2710 Petroleum oils, other than crude",
"v": 670.0
},
{
"hs": "HS2818",
"t": "Artificial corundum   399 HS2709 Petroleum oils, crude",
"v": 581.0
},
{
"hs": "HS2606",
"t": "Aluminium ores and concentrates   72 HS2711 Petroleum gases",
"v": 285.0
},
{
"hs": "HS2711",
"t": "Petroleum gases   47 HS8703 Motor cars for transport of persons",
"v": 272.0
},
{
"hs": "HS0306",
"t": "Crustaceans whether in shell or not   15 HS3004 Medicaments in measured doses",
"v": 151.0
}
]
},
"Japan": {
"aus": 746920.0,
"bip": 4233538.0,
"bipJahr": 2022,
"ein": 897242.0,
"name": "Japan",
"pAus": [
{
"l": "China",
"p": 19.4
},
{
"l": "United States of America",
"p": 18.7
},
{
"l": "European Union",
"p": 9.5
},
{
"l": "South Korea",
"p": 7.2
},
{
"l": "Taiwan",
"p": 7.0
}
],
"pEin": [
{
"l": "China",
"p": 21.0
},
{
"l": "United States of America",
"p": 10.1
},
{
"l": "Australia",
"p": 9.8
},
{
"l": "European Union",
"p": 9.6
},
{
"l": "United Arab Emirates",
"p": 5.1
}
],
"pJahr": 2022,
"restAus": 38.2,
"restEin": 44.3,
"seite": 186,
"wAus": {
"agrar": 1.9,
"energie": 4.9,
"industrie": 85.7,
"sonst": 7.6
},
"wEin": {
"agrar": 11.1,
"energie": 29.5,
"industrie": 58.1,
"sonst": 1.2
},
"wJahr": 2021,
"waren": [
{
"hs": "HS2106",
"t": "Other food preparations   935 HS1005 Maize (corn)",
"v": 5813.0
},
{
"hs": "HS2208",
"t": "Alcohol of less than 80% volume   602 HS0203 Swine meat, fresh, chilled, frozen",
"v": 4210.0
},
{
"hs": "HS2103",
"t": "Sauces and preparations therefor   479 HS1602 Other prepared or preserved meat",
"v": 3325.0
},
{
"hs": "HS1905",
"t": "Bread, pastry,  other bakers' wares   406 HS2403 Other manufactured tobacco",
"v": 3002.0
},
{
"hs": "HS2206",
"t": "Other fermented beverages   370 HS1201 Soya beans, whether or not broken",
"v": 2579.0
},
{
"hs": "HS8703",
"t": "Motor cars for transport of persons  86 573 HS2709 Petroleum oils, crude",
"v": 100922.0
},
{
"hs": "HS8479",
"t": "Machines with individual functions  39 591 HS2711 Petroleum gases",
"v": 72164.0
},
{
"hs": "HS8542",
"t": "Electronic integrated circuits  33 744 HS2701 Coal; briquettes, ovoids",
"v": 59273.0
},
{
"hs": "HS8708",
"t": "Parts for motor vehicles 8701-8075  28 885 HS8542 Electronic integrated circuits",
"v": 32548.0
},
{
"hs": "HS2710",
"t": "Petroleum oils, other than crude  14 660 HS8525 Radio-telephony transmission tools",
"v": 29309.0
}
]
},
"Jordan": {
"aus": 12380.0,
"bip": 48836.0,
"bipJahr": 2022,
"ein": 27290.0,
"name": "Jordan",
"pAus": [
{
"l": "United States of America",
"p": 20.0
},
{
"l": "India",
"p": 14.6
},
{
"l": "Saudi Arabia",
"p": 9.9
},
{
"l": "Iraq",
"p": 7.5
},
{
"l": "European Union",
"p": 5.1
}
],
"pEin": [
{
"l": "European Union",
"p": 15.5
},
{
"l": "China",
"p": 15.3
},
{
"l": "Saudi Arabia",
"p": 14.9
},
{
"l": "United Arab Emirates",
"p": 7.8
},
{
"l": "United States of America",
"p": 5.5
}
],
"pJahr": 2022,
"restAus": 43.0,
"restEin": 41.0,
"seite": 188,
"wAus": {
"agrar": 14.5,
"energie": 8.7,
"industrie": 75.7,
"sonst": 1.0
},
"wEin": {
"agrar": 22.0,
"energie": 14.4,
"industrie": 52.9,
"sonst": 10.7
},
"wJahr": 2021,
"waren": [
{
"hs": "HS0104",
"t": "Live sheep and goats   119 HS1001 Wheat and meslin",
"v": 301.0
},
{
"hs": "HS0809",
"t": "Apricots, cherries, peaches   61 HS1003 Barley",
"v": 299.0
},
{
"hs": "HS1602",
"t": "Other prepared or preserved meat   57 HS1005 Maize (corn)",
"v": 218.0
},
{
"hs": "HS2106",
"t": "Other food preparations   54 HS0104 Live sheep and goats",
"v": 193.0
},
{
"hs": "HS0702",
"t": "Tomatoes, fresh or chilled   52 HS1006 Rice",
"v": 183.0
},
{
"hs": "HS6114",
"t": "Other garments  1 500 HS2710 Petroleum oils, other than crude",
"v": 1604.0
},
{
"hs": "HS3104",
"t": "Potassic fertilisers  1 057 HS7108 Gold",
"v": 1478.0
},
{
"hs": "HS2510",
"t": "Natural calcium phosphates   760 HS2709 Petroleum oils, crude",
"v": 921.0
},
{
"hs": "HS2809",
"t": "Diphosphorus pentaoxide   473 HS8703 Motor cars for transport of persons",
"v": 799.0
},
{
"hs": "HS3102",
"t": "Nitrogenous fertilisers   445 HS6006 Other knitted or crocheted fabrics",
"v": 467.0
}
]
},
"Kazakhstan": {
"aus": 84663.0,
"bip": 225784.0,
"bipJahr": 2022,
"ein": 49586.0,
"name": "Kazakhstan",
"pAus": [
{
"l": "European Union",
"p": 38.4
},
{
"l": "China",
"p": 15.6
},
{
"l": "Russia",
"p": 10.4
},
{
"l": "Turkey",
"p": 5.6
},
{
"l": "South Korea",
"p": 5.4
}
],
"pEin": [
{
"l": "Russia",
"p": 34.7
},
{
"l": "China",
"p": 21.9
},
{
"l": "European Union",
"p": 15.2
},
{
"l": "United States of America",
"p": 3.8
},
{
"l": "Turkey",
"p": 3.2
}
],
"pJahr": 2022,
"restAus": 24.6,
"restEin": 21.2,
"seite": 190,
"wAus": {
"agrar": 6.5,
"energie": 77.1,
"industrie": 16.4,
"sonst": 0.1
},
"wEin": {
"agrar": 11.9,
"energie": 7.1,
"industrie": 80.1,
"sonst": 1.0
},
"wJahr": 2021,
"waren": [
{
"hs": "HS1001",
"t": "Wheat and meslin  1 920 HS1701 Cane or beet sugar",
"v": 368.0
},
{
"hs": "HS1101",
"t": "Wheat or meslin flour   753 HS1001 Wheat and meslin",
"v": 332.0
},
{
"hs": "HS1204",
"t": "Linseed, whether or not broken   358 HS1905 Bread, pastry,  other bakers' wares",
"v": 247.0
},
{
"hs": "HS1512",
"t": "Sunflower-seed,or cotton oil   350 HS2202 Waters containing added sugar",
"v": 247.0
},
{
"hs": "HS1003",
"t": "Barley   216 HS1806 Chocolate and other cocoa food",
"v": 238.0
},
{
"hs": "HS2709",
"t": "Petroleum oils, crude  46 920 HS8703 Motor cars for transport of persons",
"v": 1817.0
},
{
"hs": "HS7403",
"t": "Refined copper and copper alloys  3 747 HS8525 Radio-telephony transmission tools",
"v": 1495.0
},
{
"hs": "HS7202",
"t": "Ferro-alloys  3 231 HS3004 Medicaments in measured doses",
"v": 1369.0
},
{
"hs": "HS2844",
"t": "Radioactive chemical elements  2 642 HS8471 Automatic data-processing machines",
"v": 1325.0
},
{
"hs": "HS2603",
"t": "Copper ores and concentrates  2 366 HS8707 Bodies for motor vehicles 8701-8075",
"v": 1054.0
}
]
},
"Kenya": {
"aus": 7411.0,
"bip": 115989.0,
"bipJahr": 2022,
"ein": 21166.0,
"name": "Kenya",
"pAus": [
{
"l": "European Union",
"p": 15.7
},
{
"l": "Uganda",
"p": 12.3
},
{
"l": "United States of America",
"p": 8.0
},
{
"l": "Pakistan",
"p": 7.2
},
{
"l": "United Kingdom",
"p": 6.7
}
],
"pEin": [
{
"l": "China",
"p": 20.5
},
{
"l": "India",
"p": 10.8
},
{
"l": "European Union",
"p": 10.6
},
{
"l": "United Arab Emirates",
"p": 8.3
},
{
"l": "Saudi Arabia",
"p": 5.3
}
],
"pJahr": 2021,
"restAus": 50.1,
"restEin": 44.4,
"seite": 192,
"wAus": {
"agrar": 58.0,
"energie": 9.9,
"industrie": 32.0,
"sonst": 0.0
},
"wEin": {
"agrar": 18.7,
"energie": 15.5,
"industrie": 65.3,
"sonst": 0.5
},
"wJahr": 2021,
"waren": [
{
"hs": "HS0902",
"t": "Tea  1 193 HS1511 Palm oil and its fractions",
"v": 991.0
},
{
"hs": "HS0603",
"t": "Cut flowers and flower buds   726 HS1001 Wheat and meslin",
"v": 568.0
},
{
"hs": "HS0901",
"t": "Coffee   248 HS1006 Rice",
"v": 283.0
},
{
"hs": "HS0804",
"t": "Dates, figs, pineapples, avocados   175 HS1701 Cane or beet sugar",
"v": 236.0
},
{
"hs": "HS1511",
"t": "Palm oil and its fractions   131 HS1005 Maize (corn)",
"v": 124.0
},
{
"hs": "HS2710",
"t": "Petroleum oils, other than crude   274 HS2710 Petroleum oils, other than crude",
"v": 3059.0
},
{
"hs": "HS2614",
"t": "Titanium ores and concentrates   192 HS3004 Medicaments in measured doses",
"v": 616.0
},
{
"hs": "HS7210",
"t": "Flat-rolled products of iron +600   128 HS8703 Motor cars for transport of persons",
"v": 483.0
},
{
"hs": "HS3004",
"t": "Medicaments in measured doses   128 HS7208 Hot-rolled products of iron +600",
"v": 473.0
},
{
"hs": "HS6203",
"t": "Men's or boys' suits   111 HS7207 Iron's semi-finished products",
"v": 357.0
}
]
},
"Kiribati": {
"aus": 11.0,
"bip": 224.0,
"bipJahr": 2022,
"ein": 106.0,
"name": "Kiribati",
"pAus": [
{
"l": "Japan",
"p": 31.8
},
{
"l": "Malaysia",
"p": 17.3
},
{
"l": "Australia",
"p": 11.5
},
{
"l": "United States of America",
"p": 10.8
},
{
"l": "Fiji",
"p": 7.1
}
],
"pEin": [
{
"l": "Fiji",
"p": 18.0
},
{
"l": "Australia",
"p": 15.6
},
{
"l": "China",
"p": 14.1
},
{
"l": "Singapore",
"p": 11.9
},
{
"l": "New Zealand",
"p": 8.6
}
],
"pJahr": 2020,
"restAus": 21.5,
"restEin": 31.8,
"seite": 194,
"wAus": {
"agrar": 87.4,
"energie": 0.1,
"industrie": 12.4,
"sonst": 0.1
},
"wEin": {
"agrar": 30.2,
"energie": 3.9,
"industrie": 61.9,
"sonst": 4.0
},
"wJahr": 2021,
"waren": [
{
"hs": "HS1513",
"t": "Coconut (copra), or palm kernel oil   3 HS1006 Rice",
"v": 7.0
},
{
"hs": "HS1203",
"t": "Copra 0.2 HS1211 Plants and parts of plants",
"v": 6.0
},
{
"hs": "HS2203",
"t": "Beer made from malt 0.02 HS2403 Other manufactured tobacco",
"v": 4.0
},
{
"hs": "HS1211",
"t": "Plants and parts of plants 0.002 HS1701 Cane or beet sugar",
"v": 3.0
},
{
"hs": "HS0207",
"t": "Meat and edible offal of poultry",
"v": 3.0
},
{
"hs": "HS0303",
"t": "Fish, frozen, excluding fish fillet   5 HS2710 Petroleum oils, other than crude",
"v": 15.0
},
{
"hs": "HS8427",
"t": "Trucks with lifting equipment 0.4 HS8702 Motor vehicles trasport 10 persons",
"v": 2.0
},
{
"hs": "HS2710",
"t": "Petroleum oils, other than crude 0.3 HS8703 Motor cars for transport of persons",
"v": 2.0
},
{
"hs": "HS4907",
"t": "Other documents of title 0.2 HS4901 Printed books, brochures, leaflets",
"v": 2.0
},
{
"hs": "HS8407",
"t": "Spark-ignition piston engines 0.1 HS1604 Prepared or preserved fish",
"v": 1.0
}
]
},
"Kuwait": {
"aus": 101270.0,
"bip": 184558.0,
"bipJahr": 2022,
"ein": 32356.0,
"name": "Kuwait, the State of",
"pAus": [
{
"l": "United Arab Emirates",
"p": 1.3
},
{
"l": "Saudi Arabia",
"p": 1.2
},
{
"l": "China",
"p": 1.1
},
{
"l": "India",
"p": 1.1
},
{
"l": "Iraq",
"p": 0.8
}
],
"pEin": [
{
"l": "European Union",
"p": 18.7
},
{
"l": "China",
"p": 18.0
},
{
"l": "United Arab Emirates",
"p": 11.9
},
{
"l": "United States of America",
"p": 8.0
},
{
"l": "Japan",
"p": 5.8
}
],
"pJahr": 2021,
"restAus": 94.5,
"restEin": 37.7,
"seite": 198,
"wAus": {
"agrar": 0.5,
"energie": 92.4,
"industrie": 6.9,
"sonst": 0.2
},
"wEin": {
"agrar": 15.4,
"energie": 12.2,
"industrie": 70.5,
"sonst": 1.9
},
"wJahr": 2021,
"waren": [
{
"hs": "HS1101",
"t": "Wheat or meslin flour   50 HS0207 Meat and edible offal of poultry",
"v": 248.0
},
{
"hs": "HS0402",
"t": "Milk and cream, concentrated   41 HS1006 Rice",
"v": 223.0
},
{
"hs": "HS2202",
"t": "Waters containing added sugar   37 HS1905 Bread, pastry,  other bakers' wares",
"v": 210.0
},
{
"hs": "HS1602",
"t": "Other prepared or preserved meat   34 HS0406 Cheese and curd",
"v": 201.0
},
{
"hs": "HS0401",
"t": "Milk and cream, not concentrated   29 HS2402 Cigars, cheroots, cigarillos",
"v": 196.0
},
{
"hs": "HS2709",
"t": "Petroleum oils, crude  41 771 HS8703 Motor cars for transport of persons",
"v": 2952.0
},
{
"hs": "HS2710",
"t": "Petroleum oils, other than crude  13 132 HS7113 Articles and parts of jewellery",
"v": 1194.0
},
{
"hs": "HS2711",
"t": "Petroleum gases  2 958 HS3004 Medicaments in measured doses",
"v": 1118.0
},
{
"hs": "HS2904",
"t": "Other derivatives of hydrocarbons  1 016 HS7108 Gold",
"v": 1036.0
},
{
"hs": "HS8703",
"t": "Motor cars for transport of persons   755 HS8525 Radio-telephony transmission tools",
"v": 768.0
}
]
},
"Kyrgyzstan": {
"aus": 2187.0,
"bip": 11052.0,
"bipJahr": 2022,
"ein": 9629.0,
"name": "Kyrgyz Republic",
"pAus": [
{
"l": "Russia",
"p": 44.1
},
{
"l": "Kazakhstan",
"p": 20.0
},
{
"l": "Uzbekistan",
"p": 10.8
},
{
"l": "Turkey",
"p": 6.4
},
{
"l": "United Arab Emirates",
"p": 4.6
}
],
"pEin": [
{
"l": "China",
"p": 42.3
},
{
"l": "Russia",
"p": 23.6
},
{
"l": "Kazakhstan",
"p": 7.8
},
{
"l": "European Union",
"p": 5.4
},
{
"l": "Turkey",
"p": 5.1
}
],
"pJahr": 2022,
"restAus": 14.1,
"restEin": 15.9,
"seite": 200,
"wAus": {
"agrar": 21.7,
"energie": 21.3,
"industrie": 39.5,
"sonst": 17.5
},
"wEin": {
"agrar": 15.2,
"energie": 15.8,
"industrie": 66.2,
"sonst": 2.9
},
"wJahr": 2021,
"waren": [
{
"hs": "HS0713",
"t": "Dried leguminous vegetables   87 HS1701 Cane or beet sugar",
"v": 79.0
},
{
"hs": "HS0104",
"t": "Live sheep and goats   48 HS2202 Waters containing added sugar",
"v": 77.0
},
{
"hs": "HS5201",
"t": "Cotton, not carded or combed   37 HS2005 Other vegetables not frozen",
"v": 71.0
},
{
"hs": "HS0813",
"t": "Other fruit, dried   33 HS1001 Wheat and meslin",
"v": 58.0
},
{
"hs": "HS1905",
"t": "Bread, pastry,  other bakers' wares   25 HS0713 Dried leguminous vegetables",
"v": 51.0
},
{
"hs": "HS2710",
"t": "Petroleum oils, other than crude   144 HS2710 Petroleum oils, other than crude",
"v": 867.0
},
{
"hs": "HS2616",
"t": "Precious metal ores and concentrate   134 HS6004 Knitted fabrics over 30",
"v": 540.0
},
{
"hs": "HS7404",
"t": "Copper waste and scrap   87 HS8703 Motor cars for transport of persons",
"v": 539.0
},
{
"hs": "HS5205",
"t": "Cotton yarn, 85% or more of cotton   85 HS8302 Base metal mountings, fittings",
"v": 443.0
},
{
"hs": "HS8525",
"t": "Radio-telephony transmission tools   83 HS6406 Parts of footwear",
"v": 365.0
}
]
},
"Laos": {
"aus": 8198.0,
"bip": 15304.0,
"bipJahr": 2022,
"ein": 7244.0,
"name": "Lao People’s Democratic Republic",
"pAus": [
{
"l": "Thailand",
"p": 32.2
},
{
"l": "China",
"p": 31.4
},
{
"l": "Vietnam",
"p": 17.5
},
{
"l": "Australia",
"p": 4.9
},
{
"l": "European Union",
"p": 3.2
}
],
"pEin": [
{
"l": "Thailand",
"p": 46.7
},
{
"l": "China",
"p": 22.6
},
{
"l": "Vietnam",
"p": 7.9
},
{
"l": "United States of America",
"p": 4.5
},
{
"l": "Switzerland",
"p": 4.5
}
],
"pJahr": 2021,
"restAus": 10.9,
"restEin": 13.7,
"seite": 202,
"wAus": {
"agrar": 27.4,
"energie": 30.8,
"industrie": 22.4,
"sonst": 19.4
},
"wEin": {
"agrar": 20.7,
"energie": 14.5,
"industrie": 54.2,
"sonst": 10.7
},
"wJahr": 2021,
"waren": [
{
"hs": "HS0714",
"t": "Manioc, arrowroot, salep   284 HS2202 Waters containing added sugar",
"v": 227.0
},
{
"hs": "HS0803",
"t": "Bananas, including plantains   238 HS0102 Live bovine animals",
"v": 212.0
},
{
"hs": "HS0102",
"t": "Live bovine animals   222 HS2309 Preparations of a kind used in animal feeding",
"v": 72.0
},
{
"hs": "HS2202",
"t": "Waters containing added sugar   217 HS1701 Cane or beet sugar",
"v": 61.0
},
{
"hs": "HS1701",
"t": "Cane or beet sugar   96 HS0103 Live swine",
"v": 38.0
},
{
"hs": "HS2716",
"t": "Electrical energy  1 633 HS2710 Petroleum oils, other than crude",
"v": 653.0
},
{
"hs": "HS7108",
"t": "Gold   962 HS7108 Gold",
"v": 267.0
},
{
"hs": "HS4805",
"t": "Other uncoated paper and paperboard   525 HS4707 Recovered (waste and scrap) paper",
"v": 217.0
},
{
"hs": "HS2603",
"t": "Copper ores and concentrates   331 HS8704 Motor vehicles for goods transport",
"v": 193.0
},
{
"hs": "HS4001",
"t": "Natural rubber, balata   280 HS8703 Motor cars for transport of persons",
"v": 174.0
}
]
},
"Latvia": {
"aus": 24121.0,
"bip": 42225.0,
"bipJahr": 2022,
"ein": 29497.0,
"name": "Latvia",
"pAus": [
{
"l": "European Union",
"p": 69.2
},
{
"l": "Russia",
"p": 5.6
},
{
"l": "United Kingdom",
"p": 5.3
},
{
"l": "United States of America",
"p": 2.9
},
{
"l": "Ukraine",
"p": 2.4
}
],
"pEin": [
{
"l": "European Union",
"p": 77.8
},
{
"l": "Russia",
"p": 6.9
},
{
"l": "China",
"p": 3.8
},
{
"l": "Canada",
"p": 2.5
},
{
"l": "Belarus",
"p": 1.1
}
],
"pJahr": 2022,
"restAus": 14.6,
"restEin": 8.0,
"seite": 204,
"wAus": {
"agrar": 31.2,
"energie": 9.0,
"industrie": 58.9,
"sonst": 0.9
},
"wEin": {
"agrar": 19.6,
"energie": 11.1,
"industrie": 66.8,
"sonst": 2.5
},
"wJahr": 2021,
"waren": [
{
"hs": "HS1001",
"t": "Wheat and meslin   951 HS2208 Alcohol of less than 80% volume",
"v": 267.0
},
{
"hs": "HS2208",
"t": "Alcohol of less than 80% volume   371 HS1001 Wheat and meslin",
"v": 187.0
},
{
"hs": "HS0401",
"t": "Milk and cream, not concentrated   250 HS1514 Rape, colza or mustard oil",
"v": 168.0
},
{
"hs": "HS1205",
"t": "Rape or colza seeds   237 HS2204 Wine of fresh grapes",
"v": 162.0
},
{
"hs": "HS2204",
"t": "Wine of fresh grapes   168 HS2309 Preparations of a kind used in animal feeding",
"v": 136.0
},
{
"hs": "HS4407",
"t": "Wood sawn or chipped lengthwise  1 285 HS2711 Petroleum gases",
"v": 2659.0
},
{
"hs": "HS2711",
"t": "Petroleum gases  1 273 HS2710 Petroleum oils, other than crude",
"v": 1599.0
},
{
"hs": "HS8525",
"t": "Radio-telephony transmission tools   843 HS2716 Electrical energy",
"v": 1349.0
},
{
"hs": "HS2716",
"t": "Electrical energy   710 HS8703 Motor cars for transport of persons",
"v": 817.0
},
{
"hs": "HS4401",
"t": "Fuel wood, in logs, in billets   706 HS8525 Radio-telephony transmission tools",
"v": 761.0
}
]
},
"Lebanon": {
"aus": 4370.0,
"bip": 24494.0,
"bipJahr": 2020,
"ein": 19503.0,
"name": "Lebanese Republic",
"pAus": [
{
"l": "United Arab Emirates",
"p": 23.3
},
{
"l": "European Union",
"p": 12.5
},
{
"l": "Syria",
"p": 9.6
},
{
"l": "Turkey",
"p": 4.5
},
{
"l": "Egypt",
"p": 4.4
}
],
"pEin": [
{
"l": "European Union",
"p": 32.0
},
{
"l": "China",
"p": 13.8
},
{
"l": "Turkey",
"p": 12.4
},
{
"l": "United States of America",
"p": 5.0
},
{
"l": "United Arab Emirates",
"p": 3.7
}
],
"pJahr": 2022,
"restAus": 45.7,
"restEin": 33.1,
"seite": 206,
"wAus": {
"agrar": 22.2,
"energie": 9.0,
"industrie": 50.3,
"sonst": 18.5
},
"wEin": {
"agrar": 17.5,
"energie": 30.0,
"industrie": 47.6,
"sonst": 4.9
},
"wJahr": 2021,
"waren": [
{
"hs": "HS2103",
"t": "Sauces and preparations therefor   51 HS1001 Wheat and meslin",
"v": 228.0
},
{
"hs": "HS2202",
"t": "Waters containing added sugar   50 HS0102 Live bovine animals",
"v": 178.0
},
{
"hs": "HS0806",
"t": "Grapes, fresh or dried   47 HS1512 Sunflower-seed,or cotton oil",
"v": 160.0
},
{
"hs": "HS0808",
"t": "Apples, pears and quinces, fresh   47 HS1005 Maize (corn)",
"v": 149.0
},
{
"hs": "HS1806",
"t": "Chocolate and other cocoa food   33 HS1701 Cane or beet sugar",
"v": 111.0
},
{
"hs": "HS7102",
"t": "Diamonds, whether or not worked   436 HS2710 Petroleum oils, other than crude",
"v": 5504.0
},
{
"hs": "HS3907",
"t": "Polyacetals, other polyethers   267 HS8703 Motor cars for transport of persons",
"v": 1435.0
},
{
"hs": "HS7108",
"t": "Gold   196 HS7108 Gold",
"v": 1035.0
},
{
"hs": "HS7113",
"t": "Articles and parts of jewellery   172 HS7102 Diamonds, whether or not worked",
"v": 506.0
},
{
"hs": "HS7204",
"t": "Ferrous waste and scrap   148 HS8541 Diodes, transistors devices",
"v": 416.0
}
]
},
"Lesotho": {
"aus": 894.0,
"bip": 2480.0,
"bipJahr": 2022,
"ein": 1856.0,
"name": "Lesotho",
"pAus": [
{
"l": "South Africa",
"p": 44.9
},
{
"l": "United States of America",
"p": 30.2
},
{
"l": "European Union",
"p": 19.4
},
{
"l": "eSwatini",
"p": 1.1
},
{
"l": "Canada",
"p": 0.6
}
],
"pEin": [
{
"l": "South Africa",
"p": 74.9
},
{
"l": "China",
"p": 8.6
},
{
"l": "Taiwan",
"p": 5.7
},
{
"l": "European Union",
"p": 1.7
},
{
"l": "India",
"p": 1.4
}
],
"pJahr": 2021,
"restAus": 3.8,
"restEin": 7.7,
"seite": 208,
"wAus": {
"agrar": 10.4,
"energie": 0.3,
"industrie": 89.2,
"sonst": 0.0
},
"wEin": {
"agrar": 27.9,
"energie": 15.9,
"industrie": 55.9,
"sonst": 0.3
},
"wJahr": 2021,
"waren": [
{
"hs": "HS2201",
"t": "Waters, natural or artificial   83 HS1102 Other cereal flours",
"v": 30.0
},
{
"hs": "HS5101",
"t": "Wool, not carded or combed   38 HS0207 Meat and edible offal of poultry",
"v": 28.0
},
{
"hs": "HS5102",
"t": "Fine or coarse animal hair   9 HS5201 Cotton, not carded or combed",
"v": 20.0
},
{
"hs": "HS1101",
"t": "Wheat or meslin flour   7 HS2402 Cigars, cheroots, cigarillos",
"v": 20.0
},
{
"hs": "HS1211",
"t": "Plants and parts of plants   4 HS1214 Swedes, mangolds, fodder roots",
"v": 15.0
},
{
"hs": "HS7102",
"t": "Diamonds, whether or not worked   175 HS2710 Petroleum oils, other than crude",
"v": 165.0
},
{
"hs": "HS6104",
"t": "Women's or girls' suits, ensembles   127 HS6003 Knitted fabrics under 30 minus 6002",
"v": 63.0
},
{
"hs": "HS6203",
"t": "Men's or boys' suits   104 HS5407 Woven fabrics of synthetic filament",
"v": 54.0
},
{
"hs": "HS6109",
"t": "T-shirts, singlets and other vests   46 HS6004 Knitted fabrics over 30",
"v": 39.0
},
{
"hs": "HS6110",
"t": "Jerseys, pullovers, cardigans   40 HS8703 Motor cars for transport of persons",
"v": 38.0
}
]
},
"Liberia": {
"aus": 1058.0,
"bip": 3974.0,
"bipJahr": 2022,
"ein": 1528.0,
"name": "Liberia",
"seite": 210,
"waren": []
},
"Libya": {
"aus": 37686.0,
"bip": 44066.0,
"bipJahr": 2022,
"ein": 29634.0,
"name": "Libya",
"pAus": [
{
"l": "European Union",
"p": 60.1
},
{
"l": "China",
"p": 22.5
},
{
"l": "United Arab Emirates",
"p": 4.1
},
{
"l": "United States of America",
"p": 2.7
},
{
"l": "Australia",
"p": 1.9
}
],
"pEin": [
{
"l": "European Union",
"p": 32.2
},
{
"l": "China",
"p": 15.7
},
{
"l": "Turkey",
"p": 13.2
},
{
"l": "United Arab Emirates",
"p": 8.6
},
{
"l": "Egypt",
"p": 5.3
}
],
"pJahr": 2019,
"restAus": 8.7,
"restEin": 25.0,
"seite": 212,
"wAus": {
"agrar": 0.1,
"energie": 98.0,
"industrie": 1.9,
"sonst": 0.0
},
"wEin": {
"agrar": 22.0,
"energie": 20.2,
"industrie": 57.6,
"sonst": 0.1
},
"wJahr": 2021,
"waren": [
{
"hs": "HS1006",
"t": "Rice   3 HS2402 Cigars, cheroots, cigarillos",
"v": 441.0
},
{
"hs": "HS0804",
"t": "Dates, figs, pineapples, avocados   3 HS1001 Wheat and meslin",
"v": 263.0
},
{
"hs": "HS4101",
"t": "Raw hides and skins of bovine   2 HS1003 Barley",
"v": 143.0
},
{
"hs": "HS5101",
"t": "Wool, not carded or combed   2 HS0104 Live sheep and goats",
"v": 142.0
},
{
"hs": "HS4102",
"t": "Raw skins of sheep or lambs   1 HS1905 Bread, pastry,  other bakers' wares",
"v": 134.0
},
{
"hs": "HS2709",
"t": "Petroleum oils, crude  24 183 HS2710 Petroleum oils, other than crude",
"v": 2008.0
},
{
"hs": "HS2711",
"t": "Petroleum gases  2 612 HS8703 Motor cars for transport of persons",
"v": 965.0
},
{
"hs": "HS7108",
"t": "Gold  1 192 HS8525 Radio-telephony transmission tools",
"v": 636.0
},
{
"hs": "HS2710",
"t": "Petroleum oils, other than crude   853 HS7113 Articles and parts of jewellery",
"v": 293.0
},
{
"hs": "HS7204",
"t": "Ferrous waste and scrap   100 HS3004 Medicaments in measured doses",
"v": 265.0
}
]
},
"Liechtenstein": {
"name": "Liechtenstein",
"seite": 214,
"waren": []
},
"Lithuania": {
"aus": 46340.0,
"bip": 70523.0,
"bipJahr": 2022,
"ein": 54938.0,
"name": "Lithuania",
"pAus": [
{
"l": "European Union",
"p": 62.2
},
{
"l": "Russia",
"p": 6.2
},
{
"l": "United States of America",
"p": 5.3
},
{
"l": "United Kingdom",
"p": 3.5
},
{
"l": "Belarus",
"p": 3.2
}
],
"pEin": [
{
"l": "European Union",
"p": 63.2
},
{
"l": "United States of America",
"p": 7.5
},
{
"l": "Russia",
"p": 5.1
},
{
"l": "Norway",
"p": 4.8
},
{
"l": "Saudi Arabia",
"p": 4.1
}
],
"pJahr": 2022,
"restAus": 19.6,
"restEin": 15.3,
"seite": 216,
"wAus": {
"agrar": 19.7,
"energie": 13.3,
"industrie": 66.4,
"sonst": 0.5
},
"wEin": {
"agrar": 14.0,
"energie": 19.2,
"industrie": 65.3,
"sonst": 1.4
},
"wJahr": 2021,
"waren": [
{
"hs": "HS1001",
"t": "Wheat and meslin  1 021 HS0401 Milk and cream, not concentrated",
"v": 323.0
},
{
"hs": "HS2402",
"t": "Cigars, cheroots, cigarillos   863 HS2204 Wine of fresh grapes",
"v": 285.0
},
{
"hs": "HS1205",
"t": "Rape or colza seeds   434 HS1514 Rape, colza or mustard oil",
"v": 227.0
},
{
"hs": "HS0401",
"t": "Milk and cream, not concentrated   328 HS2309 Preparations of a kind used in animal feeding",
"v": 207.0
},
{
"hs": "HS2309",
"t": "Preparations of a kind used in animal feeding   298 HS0901 Coffee",
"v": 205.0
},
{
"hs": "HS2710",
"t": "Petroleum oils, other than crude  5 410 HS2709 Petroleum oils, crude",
"v": 6111.0
},
{
"hs": "HS9403",
"t": "Other furniture and parts thereof  2 165 HS2711 Petroleum gases",
"v": 5250.0
},
{
"hs": "HS2711",
"t": "Petroleum gases  1 442 HS2716 Electrical energy",
"v": 2528.0
},
{
"hs": "HS8703",
"t": "Motor cars for transport of persons  1 137 HS8703 Motor cars for transport of persons",
"v": 1907.0
},
{
"hs": "HS3102",
"t": "Nitrogenous fertilisers   919 HS2710 Petroleum oils, other than crude",
"v": 1172.0
}
]
},
"Luxembourg": {
"aus": 17274.0,
"bip": 82340.0,
"bipJahr": 2022,
"ein": 26528.0,
"name": "Luxembourg",
"pAus": [
{
"l": "European Union",
"p": 79.4
},
{
"l": "United States of America",
"p": 2.9
},
{
"l": "United Kingdom",
"p": 2.6
},
{
"l": "China",
"p": 1.5
},
{
"l": "Switzerland",
"p": 1.4
}
],
"pEin": [
{
"l": "European Union",
"p": 75.5
},
{
"l": "China",
"p": 3.0
},
{
"l": "United States of America",
"p": 2.4
},
{
"l": "Japan",
"p": 1.9
},
{
"l": "United Kingdom",
"p": 1.4
}
],
"pJahr": 2022,
"restAus": 12.2,
"restEin": 15.7,
"seite": 218,
"wAus": {
"agrar": 10.2,
"energie": 5.4,
"industrie": 82.4,
"sonst": 2.0
},
"wEin": {
"agrar": 14.0,
"energie": 16.3,
"industrie": 68.8,
"sonst": 0.9
},
"wJahr": 2021,
"waren": [
{
"hs": "HS0406",
"t": "Cheese and curd   349 HS0406 Cheese and curd",
"v": 403.0
},
{
"hs": "HS0401",
"t": "Milk and cream, not concentrated   184 HS2208 Alcohol of less than 80% volume",
"v": 185.0
},
{
"hs": "HS2008",
"t": "Plants' parts otherwise preserved   98 HS0901 Coffee",
"v": 149.0
},
{
"hs": "HS2402",
"t": "Cigars, cheroots, cigarillos   85 HS2202 Waters containing added sugar",
"v": 141.0
},
{
"hs": "HS2106",
"t": "Other food preparations   73 HS2204 Wine of fresh grapes",
"v": 133.0
},
{
"hs": "HS7216",
"t": "Angles, shapes and sections of iron  1 574 HS8703 Motor cars for transport of persons",
"v": 2215.0
},
{
"hs": "HS8703",
"t": "Motor cars for transport of persons   693 HS2710 Petroleum oils, other than crude",
"v": 2082.0
},
{
"hs": "HS4011",
"t": "New pneumatic tyres, of rubber   691 HS7204 Ferrous waste and scrap",
"v": 829.0
},
{
"hs": "HS7301",
"t": "Sheet piling of iron or steel   559 HS3004 Medicaments in measured doses",
"v": 531.0
},
{
"hs": "HS4811",
"t": "Paper, paperboard rettangular   505 HS7602 Aluminium waste and scrap",
"v": 361.0
}
]
},
"Macao": {
"aus": 1677.0,
"bip": 21979.0,
"bipJahr": 2022,
"ein": 17338.0,
"name": "Macao, China",
"pAus": [
{
"l": "Hong Kong",
"p": 84.4
},
{
"l": "China",
"p": 9.3
},
{
"l": "United States of America",
"p": 3.8
},
{
"l": "Vietnam",
"p": 0.7
},
{
"l": "Singapore",
"p": 0.5
}
],
"pEin": [
{
"l": "European Union",
"p": 32.6
},
{
"l": "China",
"p": 30.6
},
{
"l": "Switzerland",
"p": 7.1
},
{
"l": "United States of America",
"p": 6.8
},
{
"l": "Japan",
"p": 6.4
}
],
"pJahr": 2022,
"restAus": 1.2,
"restEin": 16.4,
"seite": 220,
"wAus": {
"agrar": 4.2,
"energie": 1.7,
"industrie": 79.3,
"sonst": 14.8
},
"wEin": {
"agrar": 11.2,
"energie": 3.6,
"industrie": 84.3,
"sonst": 0.8
},
"wJahr": 2021,
"waren": [
{
"hs": "HS2204",
"t": "Wine of fresh grapes   34 HS2208 Alcohol of less than 80% volume",
"v": 479.0
},
{
"hs": "HS2208",
"t": "Alcohol of less than 80% volume   14 HS2204 Wine of fresh grapes",
"v": 368.0
},
{
"hs": "HS2402",
"t": "Cigars, cheroots, cigarillos   14 HS0410 Edible products of animal origin",
"v": 166.0
},
{
"hs": "HS1905",
"t": "Bread, pastry,  other bakers' wares   13 HS1901 Malt extract",
"v": 97.0
},
{
"hs": "HS2106",
"t": "Other food preparations   3 HS2106 Other food preparations",
"v": 94.0
},
{
"hs": "HS7113",
"t": "Articles and parts of jewellery   272 HS3304 Preparations care of the skin",
"v": 2400.0
},
{
"hs": "HS8525",
"t": "Radio-telephony transmission tools   187 HS7113 Articles and parts of jewellery",
"v": 1617.0
},
{
"hs": "HS9101",
"t": "Wristwatches with  precious metal   145 HS8525 Radio-telephony transmission tools",
"v": 1514.0
},
{
"hs": "HS4202",
"t": "Trunks, suit-cases, vanity-cases   86 HS4202 Trunks, suit-cases, vanity-cases",
"v": 1326.0
},
{
"hs": "HS6204",
"t": "Women's or girls' suits   74 HS9101 Wristwatches with  precious metal",
"v": 763.0
}
]
},
"Macedonia": {
"aus": 8727.0,
"bip": 13671.0,
"bipJahr": 2022,
"ein": 12755.0,
"name": "North Macedonia",
"pAus": [
{
"l": "European Union",
"p": 78.3
},
{
"l": "Serbia",
"p": 9.2
},
{
"l": "Turkey",
"p": 2.5
},
{
"l": "United Kingdom",
"p": 2.0
},
{
"l": "Albania",
"p": 1.2
}
],
"pEin": [
{
"l": "European Union",
"p": 46.8
},
{
"l": "United Kingdom",
"p": 15.8
},
{
"l": "China",
"p": 7.8
},
{
"l": "Serbia",
"p": 7.1
},
{
"l": "Turkey",
"p": 6.3
}
],
"pJahr": 2022,
"restAus": 6.8,
"restEin": 16.1,
"seite": 270,
"wAus": {
"agrar": 9.2,
"energie": 7.0,
"industrie": 83.8,
"sonst": 0.1
},
"wEin": {
"agrar": 10.2,
"energie": 26.1,
"industrie": 63.7,
"sonst": 0.0
},
"wJahr": 2021,
"waren": [
{
"hs": "HS2401",
"t": "Unmanufactured tobacco   115 HS2106 Other food preparations",
"v": 69.0
},
{
"hs": "HS1905",
"t": "Bread, pastry,  other bakers' wares   73 HS0207 Meat and edible offal of poultry",
"v": 65.0
},
{
"hs": "HS2204",
"t": "Wine of fresh grapes   60 HS1512 Sunflower-seed,or cotton oil",
"v": 65.0
},
{
"hs": "HS2005",
"t": "Other vegetables not frozen   51 HS1905 Bread, pastry,  other bakers' wares",
"v": 52.0
},
{
"hs": "HS0704",
"t": "Cabbages, cauliflowers, kohlrabi   27 HS1701 Cane or beet sugar",
"v": 46.0
},
{
"hs": "HS3815",
"t": "Reaction initiators, accelerators  2 626 HS7110 Platinum",
"v": 1433.0
},
{
"hs": "HS8544",
"t": "Insulated electric conductors   632 HS2710 Petroleum oils, other than crude",
"v": 1138.0
},
{
"hs": "HS9401",
"t": "Seats and parts thereof   266 HS2716 Electrical energy",
"v": 620.0
},
{
"hs": "HS8708",
"t": "Parts for motor vehicles 8701-8075   255 HS2843 Colloidal precious metals",
"v": 512.0
},
{
"hs": "HS7208",
"t": "Hot-rolled products of iron +600   240 HS2711 Petroleum gases",
"v": 400.0
}
]
},
"Madagascar": {
"aus": 3609.0,
"bip": 15233.0,
"bipJahr": 2022,
"ein": 5471.0,
"name": "Madagascar",
"pAus": [
{
"l": "European Union",
"p": 32.3
},
{
"l": "United States of America",
"p": 18.1
},
{
"l": "China",
"p": 13.2
},
{
"l": "Japan",
"p": 8.7
},
{
"l": "Canada",
"p": 5.2
}
],
"pEin": [
{
"l": "China",
"p": 19.4
},
{
"l": "European Union",
"p": 17.4
},
{
"l": "Oman",
"p": 10.2
},
{
"l": "India",
"p": 8.3
},
{
"l": "United Arab Emirates",
"p": 5.9
}
],
"pJahr": 2021,
"restAus": 22.4,
"restEin": 38.9,
"seite": 222,
"wAus": {
"agrar": 40.0,
"energie": 31.9,
"industrie": 27.2,
"sonst": 0.9
},
"wEin": {
"agrar": 23.7,
"energie": 18.2,
"industrie": 56.9,
"sonst": 1.2
},
"wJahr": 2021,
"waren": [
{
"hs": "HS0905",
"t": "Vanilla   619 HS1006 Rice",
"v": 273.0
},
{
"hs": "HS0907",
"t": "Cloves   116 HS1511 Palm oil and its fractions",
"v": 113.0
},
{
"hs": "HS3301",
"t": "Essential oils (terpeneless or not)   77 HS1701 Cane or beet sugar",
"v": 89.0
},
{
"hs": "HS0713",
"t": "Dried leguminous vegetables   42 HS1001 Wheat and meslin",
"v": 64.0
},
{
"hs": "HS2005",
"t": "Other vegetables not frozen   41 HS1507 Soya-bean oil and its fractions",
"v": 59.0
},
{
"hs": "HS7502",
"t": "Unwrought nickel   514 HS2710 Petroleum oils, other than crude",
"v": 602.0
},
{
"hs": "HS2614",
"t": "Titanium ores and concentrates   139 HS6006 Other knitted or crocheted fabrics",
"v": 120.0
},
{
"hs": "HS8105",
"t": "Products of cobalt metallurgy   110 HS3004 Medicaments in measured doses",
"v": 109.0
},
{
"hs": "HS6203",
"t": "Men's or boys' suits   110 HS2503 Sulphur of all kinds",
"v": 83.0
},
{
"hs": "HS0306",
"t": "Crustaceans whether in shell or not   94 HS2523 Portland cement, aluminous cement",
"v": 80.0
}
]
},
"Malawi": {
"aus": 800.0,
"bip": 12512.0,
"bipJahr": 2022,
"ein": 1520.0,
"name": "Malawi",
"pAus": [
{
"l": "European Union",
"p": 25.1
},
{
"l": "India",
"p": 7.6
},
{
"l": "Tanzania",
"p": 7.0
},
{
"l": "South Africa",
"p": 6.6
},
{
"l": "United Arab Emirates",
"p": 4.6
}
],
"pEin": [
{
"l": "China",
"p": 18.2
},
{
"l": "South Africa",
"p": 17.8
},
{
"l": "United Arab Emirates",
"p": 9.3
},
{
"l": "India",
"p": 7.3
},
{
"l": "European Union",
"p": 7.1
}
],
"pJahr": 2021,
"restAus": 49.1,
"restEin": 40.3,
"seite": 224,
"wAus": {
"agrar": 92.3,
"energie": 0.8,
"industrie": 6.9,
"sonst": 0.0
},
"wEin": {
"agrar": 18.6,
"energie": 8.4,
"industrie": 72.6,
"sonst": 0.4
},
"wJahr": 2021,
"waren": [
{
"hs": "HS2401",
"t": "Unmanufactured tobacco   447 HS1001 Wheat and meslin",
"v": 54.0
},
{
"hs": "HS1201",
"t": "Soya beans, whether or not broken   108 HS2401 Unmanufactured tobacco",
"v": 46.0
},
{
"hs": "HS1701",
"t": "Cane or beet sugar   74 HS1511 Palm oil and its fractions",
"v": 45.0
},
{
"hs": "HS0902",
"t": "Tea   72 HS2106 Other food preparations",
"v": 19.0
},
{
"hs": "HS0713",
"t": "Dried leguminous vegetables   63 HS3823 Industrial monocarboxylic acids",
"v": 15.0
},
{
"hs": "HS8409",
"t": "Parts suitable for 8407 or 8408   11 HS2710 Petroleum oils, other than crude",
"v": 241.0
},
{
"hs": "HS4411",
"t": "Fibreboard of ligneous materials   7 HS4907 Other documents of title",
"v": 226.0
},
{
"hs": "HS6305",
"t": "Sacks and bags   5 HS3105 Mineral or chemical fertilisers",
"v": 163.0
},
{
"hs": "HS4001",
"t": "Natural rubber, balata   4 HS3002 Human and animal blood",
"v": 139.0
},
{
"hs": "HS7112",
"t": "Waste and scrap of precious metal   4 HS3102 Nitrogenous fertilisers",
"v": 110.0
}
]
},
"Malaysia": {
"aus": 352475.0,
"bip": 407923.0,
"bipJahr": 2022,
"ein": 294317.0,
"name": "Malaysia",
"pAus": [
{
"l": "China",
"p": 15.5
},
{
"l": "Singapore",
"p": 14.0
},
{
"l": "United States of America",
"p": 11.5
},
{
"l": "European Union",
"p": 8.4
},
{
"l": "Hong Kong",
"p": 6.2
}
],
"pEin": [
{
"l": "China",
"p": 23.2
},
{
"l": "Singapore",
"p": 9.5
},
{
"l": "European Union",
"p": 7.8
},
{
"l": "Taiwan",
"p": 7.6
},
{
"l": "United States of America",
"p": 7.6
}
],
"pJahr": 2021,
"restAus": 44.5,
"restEin": 44.3,
"seite": 226,
"wAus": {
"agrar": 12.2,
"energie": 17.2,
"industrie": 70.3,
"sonst": 0.3
},
"wEin": {
"agrar": 11.4,
"energie": 18.7,
"industrie": 67.6,
"sonst": 2.3
},
"wJahr": 2021,
"waren": [
{
"hs": "HS1511",
"t": "Palm oil and its fractions  14 209 HS1801 Cocoa beans, whole or broken",
"v": 1209.0
},
{
"hs": "HS3823",
"t": "Industrial monocarboxylic acids  3 221 HS1511 Palm oil and its fractions",
"v": 1149.0
},
{
"hs": "HS1516",
"t": "Animal or vegetable fats and oils  2 265 HS1005 Maize (corn)",
"v": 1124.0
},
{
"hs": "HS1513",
"t": "Coconut (copra), or palm kernel oil  1 411 HS2106 Other food preparations",
"v": 1069.0
},
{
"hs": "HS2106",
"t": "Other food preparations   819 HS1701 Cane or beet sugar",
"v": 934.0
},
{
"hs": "HS8542",
"t": "Electronic integrated circuits  59 749 HS8542 Electronic integrated circuits",
"v": 42861.0
},
{
"hs": "HS2710",
"t": "Petroleum oils, other than crude  20 795 HS2710 Petroleum oils, other than crude",
"v": 20033.0
},
{
"hs": "HS4015",
"t": "Apparel and clothing accessories  13 248 HS7108 Gold",
"v": 4210.0
},
{
"hs": "HS2711",
"t": "Petroleum gases  9 941 HS8541 Diodes, transistors devices",
"v": 4180.0
},
{
"hs": "HS8541",
"t": "Diodes, transistors devices  8 235 HS2701 Coal; briquettes, ovoids",
"v": 4020.0
}
]
},
"Maldives": {
"aus": 400.0,
"bip": 6207.0,
"bipJahr": 2022,
"ein": 3516.0,
"name": "Maldives",
"pAus": [
{
"l": "Thailand",
"p": 46.4
},
{
"l": "European Union",
"p": 21.6
},
{
"l": "United Kingdom",
"p": 6.8
},
{
"l": "India",
"p": 3.9
},
{
"l": "Japan",
"p": 3.6
}
],
"pEin": [
{
"l": "Oman",
"p": 13.1
},
{
"l": "United Arab Emirates",
"p": 13.0
},
{
"l": "China",
"p": 12.6
},
{
"l": "India",
"p": 12.4
},
{
"l": "Singapore",
"p": 10.2
}
],
"pJahr": 2021,
"restAus": 17.7,
"restEin": 38.8,
"seite": 228,
"wAus": {
"agrar": 50.6,
"energie": 2.2,
"industrie": 0.2,
"sonst": 47.0
},
"wEin": {
"agrar": 24.1,
"energie": 20.7,
"industrie": 55.2,
"sonst": 0.0
},
"wJahr": 2021,
"waren": [
{
"hs": "HS2309",
"t": "Preparations of a kind used in animal feeding 0.2 HS0402 Milk and cream, concentrated",
"v": 29.0
},
{
"hs": "HS0510",
"t": "Ambergris, castoreum, civet, musk 0.02 HS0207 Meat and edible offal of poultry",
"v": 27.0
},
{
"hs": "HS0802",
"t": "Other nuts, fresh or dried 0.02 HS2202 Waters containing added sugar",
"v": 23.0
},
{
"hs": "HS2005",
"t": "Other vegetables not frozen 0.003 HS1905 Bread, pastry,  other bakers' wares",
"v": 21.0
},
{
"hs": "HS2008",
"t": "Plants' parts otherwise preserved 0.001 HS1006 Rice",
"v": 21.0
},
{
"hs": "HS0303",
"t": "Fish, frozen, excluding fish fillet   79 HS2710 Petroleum oils, other than crude",
"v": 441.0
},
{
"hs": "HS1604",
"t": "Prepared or preserved fish   32 HS8525 Radio-telephony transmission tools",
"v": 71.0
},
{
"hs": "HS0304",
"t": "Fish fillets and other fish meat   18 HS3004 Medicaments in measured doses",
"v": 40.0
},
{
"hs": "HS0302",
"t": "Fish, fresh, chilled   7 HS8803 Parts of goods 8801, 8802",
"v": 36.0
},
{
"hs": "HS7204",
"t": "Ferrous waste and scrap   5 HS8544 Insulated electric conductors",
"v": 34.0
}
]
},
"Mali": {
"aus": 5069.0,
"bip": 19048.0,
"bipJahr": 2022,
"ein": 6185.0,
"name": "Mali",
"pAus": [
{
"l": "South Africa",
"p": 36.5
},
{
"l": "Switzerland",
"p": 35.6
},
{
"l": "Bangladesh",
"p": 7.1
},
{
"l": "Côte d'Ivoire",
"p": 4.2
},
{
"l": "Burkina Faso",
"p": 2.8
}
],
"pEin": [
{
"l": "Senegal",
"p": 22.5
},
{
"l": "European Union",
"p": 19.0
},
{
"l": "China",
"p": 15.8
},
{
"l": "Côte d'Ivoire",
"p": 10.6
},
{
"l": "India",
"p": 3.1
}
],
"pJahr": 2019,
"restAus": 13.8,
"restEin": 29.0,
"seite": 230,
"wAus": {
"agrar": 11.8,
"energie": 3.3,
"industrie": 1.5,
"sonst": 83.4
},
"wEin": {
"agrar": 19.4,
"energie": 19.0,
"industrie": 59.7,
"sonst": 1.9
},
"wJahr": 2021,
"waren": [
{
"hs": "HS5203",
"t": "Cotton, carded or combed   422 HS1001 Wheat and meslin",
"v": 97.0
},
{
"hs": "HS0102",
"t": "Live bovine animals   150 HS1701 Cane or beet sugar",
"v": 89.0
},
{
"hs": "HS0104",
"t": "Live sheep and goats   59 HS1006 Rice",
"v": 64.0
},
{
"hs": "HS1207",
"t": "Other oil seeds, oleaginous fruits   37 HS2402 Cigars, cheroots, cigarillos",
"v": 61.0
},
{
"hs": "HS0804",
"t": "Dates, figs, pineapples, avocados   11 HS0902 Tea",
"v": 38.0
},
{
"hs": "HS7108",
"t": "Gold  2 657 HS2710 Petroleum oils, other than crude",
"v": 1361.0
},
{
"hs": "HS3105",
"t": "Mineral or chemical fertilisers   44 HS2523 Portland cement, aluminous cement",
"v": 201.0
},
{
"hs": "HS2710",
"t": "Petroleum oils, other than crude   27 HS3004 Medicaments in measured doses",
"v": 193.0
},
{
"hs": "HS8704",
"t": "Motor vehicles for goods transport   9 HS3102 Nitrogenous fertilisers",
"v": 94.0
},
{
"hs": "HS8429",
"t": "Self-propelled bulldozers   9 HS8703 Motor cars for transport of persons",
"v": 93.0
}
]
},
"Malta": {
"aus": 3253.0,
"bip": 17779.0,
"bipJahr": 2022,
"ein": 8519.0,
"name": "Malta",
"pAus": [
{
"l": "European Union",
"p": 43.2
},
{
"l": "Japan",
"p": 7.7
},
{
"l": "Singapore",
"p": 5.3
},
{
"l": "United Kingdom",
"p": 5.3
},
{
"l": "Hong Kong",
"p": 5.2
}
],
"pEin": [
{
"l": "European Union",
"p": 58.4
},
{
"l": "Canada",
"p": 9.4
},
{
"l": "China",
"p": 4.5
},
{
"l": "United Kingdom",
"p": 4.1
},
{
"l": "Cayman Is.",
"p": 2.6
}
],
"pJahr": 2022,
"restAus": 33.4,
"restEin": 21.0,
"seite": 232,
"wAus": {
"agrar": 10.5,
"energie": 10.6,
"industrie": 78.8,
"sonst": 0.1
},
"wEin": {
"agrar": 12.1,
"energie": 16.9,
"industrie": 70.9,
"sonst": 0.0
},
"wJahr": 2021,
"waren": [
{
"hs": "HS2106",
"t": "Other food preparations   66 HS1905 Bread, pastry,  other bakers' wares",
"v": 53.0
},
{
"hs": "HS1901",
"t": "Malt extract   25 HS0406 Cheese and curd",
"v": 46.0
},
{
"hs": "HS2102",
"t": "Yeasts (active or inactive)   8 HS2309 Preparations of a kind used in animal feeding",
"v": 38.0
},
{
"hs": "HS2103",
"t": "Sauces and preparations therefor   6 HS1602 Other prepared or preserved meat",
"v": 36.0
},
{
"hs": "HS2202",
"t": "Waters containing added sugar   5 HS2106 Other food preparations",
"v": 30.0
},
{
"hs": "HS8542",
"t": "Electronic integrated circuits   809 HS8802 Other aircraft",
"v": 1315.0
},
{
"hs": "HS3004",
"t": "Medicaments in measured doses   374 HS2710 Petroleum oils, other than crude",
"v": 1216.0
},
{
"hs": "HS4907",
"t": "Other documents of title   263 HS8542 Electronic integrated circuits",
"v": 553.0
},
{
"hs": "HS0304",
"t": "Fish fillets and other fish meat   211 HS8903 Vessels for pleasure or sports",
"v": 550.0
},
{
"hs": "HS2710",
"t": "Petroleum oils, other than crude   159 HS3004 Medicaments in measured doses",
"v": 329.0
}
]
},
"Mauritania": {
"aus": 3204.0,
"bip": 10321.0,
"bipJahr": 2022,
"ein": 4618.0,
"name": "Mauritania",
"pAus": [
{
"l": "China",
"p": 41.5
},
{
"l": "European Union",
"p": 27.1
},
{
"l": "Canada",
"p": 9.9
},
{
"l": "Japan",
"p": 6.9
},
{
"l": "Australia",
"p": 3.7
}
],
"pEin": [
{
"l": "European Union",
"p": 39.1
},
{
"l": "United Arab Emirates",
"p": 14.0
},
{
"l": "China",
"p": 5.8
},
{
"l": "Turkey",
"p": 5.6
},
{
"l": "Morocco",
"p": 5.3
}
],
"pJahr": 2021,
"restAus": 10.9,
"restEin": 30.2,
"seite": 234,
"wAus": {
"agrar": 19.5,
"energie": 47.6,
"industrie": 0.6,
"sonst": 32.2
},
"wEin": {
"agrar": 27.6,
"energie": 28.9,
"industrie": 43.5,
"sonst": 0.0
},
"wJahr": 2021,
"waren": [
{
"hs": "HS2309",
"t": "Preparations of a kind used in animal feeding 0.5 HS1001 Wheat and meslin",
"v": 220.0
},
{
"hs": "HS0807",
"t": "Melons and papaws, fresh 0.2 HS1701 Cane or beet sugar",
"v": 166.0
},
{
"hs": "HS2302",
"t": "Bran, sharps and other residues 0.2 HS1507 Soya-bean oil and its fractions",
"v": 144.0
},
{
"hs": "HS1301",
"t": "Lac; natural gums, resins 0.2 HS0402 Milk and cream, concentrated",
"v": 56.0
},
{
"hs": "HS0810",
"t": "Other fruit, fresh 0.2 HS1511 Palm oil and its fractions",
"v": 41.0
},
{
"hs": "HS2601",
"t": "Iron ores and concentrates  1 789 HS2710 Petroleum oils, other than crude",
"v": 964.0
},
{
"hs": "HS7108",
"t": "Gold   324 HS3003 Medicaments not in measured doses",
"v": 157.0
},
{
"hs": "HS1605",
"t": "Crustaceans, molluscs   310 HS7108 Gold",
"v": 139.0
},
{
"hs": "HS0303",
"t": "Fish, frozen, excluding fish fillet   279 HS8703 Motor cars for transport of persons",
"v": 136.0
},
{
"hs": "HS2603",
"t": "Copper ores and concentrates   258 HS8431 Parts for machinery of 8425 to 8430",
"v": 129.0
}
]
},
"Mauritius": {
"aus": 2388.0,
"bip": 12772.0,
"bipJahr": 2022,
"ein": 6609.0,
"name": "Mauritius",
"pAus": [
{
"l": "European Union",
"p": 34.4
},
{
"l": "South Africa",
"p": 13.4
},
{
"l": "Madagascar",
"p": 9.0
},
{
"l": "United Kingdom",
"p": 8.6
},
{
"l": "United States of America",
"p": 8.0
}
],
"pEin": [
{
"l": "European Union",
"p": 17.1
},
{
"l": "China",
"p": 16.1
},
{
"l": "India",
"p": 9.8
},
{
"l": "South Africa",
"p": 9.1
},
{
"l": "United Arab Emirates",
"p": 9.0
}
],
"pJahr": 2022,
"restAus": 26.6,
"restEin": 39.0,
"seite": 236,
"wAus": {
"agrar": 31.0,
"energie": 2.7,
"industrie": 51.3,
"sonst": 15.0
},
"wEin": {
"agrar": 23.4,
"energie": 18.6,
"industrie": 57.6,
"sonst": 0.4
},
"wJahr": 2021,
"waren": [
{
"hs": "HS1701",
"t": "Cane or beet sugar   197 HS0402 Milk and cream, concentrated",
"v": 77.0
},
{
"hs": "HS0106",
"t": "Other live animals   49 HS2402 Cigars, cheroots, cigarillos",
"v": 71.0
},
{
"hs": "HS2309",
"t": "Preparations of a kind used in animal feeding   21 HS5201 Cotton, not carded or combed",
"v": 69.0
},
{
"hs": "HS2207",
"t": "Alcohol of 80% or more volume   13 HS1701 Cane or beet sugar",
"v": 62.0
},
{
"hs": "HS0905",
"t": "Vanilla   13 HS1006 Rice",
"v": 62.0
},
{
"hs": "HS1604",
"t": "Prepared or preserved fish   256 HS2710 Petroleum oils, other than crude",
"v": 1261.0
},
{
"hs": "HS6203",
"t": "Men's or boys' suits   116 HS8703 Motor cars for transport of persons",
"v": 265.0
},
{
"hs": "HS7102",
"t": "Diamonds, whether or not worked   96 HS0303 Fish, frozen, excluding fish fillet",
"v": 208.0
},
{
"hs": "HS6109",
"t": "T-shirts, singlets and other vests   85 HS2701 Coal; briquettes, ovoids",
"v": 171.0
},
{
"hs": "HS0303",
"t": "Fish, frozen, excluding fish fillet   60 HS3004 Medicaments in measured doses",
"v": 156.0
}
]
},
"Mexico": {
"aus": 578193.0,
"bip": 1414101.0,
"bipJahr": 2022,
"ein": 626324.0,
"name": "Mexico",
"pAus": [
{
"l": "United States of America",
"p": 78.3
},
{
"l": "European Union",
"p": 3.1
},
{
"l": "Canada",
"p": 2.7
},
{
"l": "China",
"p": 1.9
},
{
"l": "Taiwan",
"p": 1.3
}
],
"pEin": [
{
"l": "United States of America",
"p": 43.9
},
{
"l": "China",
"p": 19.6
},
{
"l": "European Union",
"p": 9.6
},
{
"l": "South Korea",
"p": 3.7
},
{
"l": "Japan",
"p": 3.0
}
],
"pJahr": 2022,
"restAus": 12.9,
"restEin": 20.1,
"seite": 238,
"wAus": {
"agrar": 9.4,
"energie": 8.0,
"industrie": 76.5,
"sonst": 6.0
},
"wEin": {
"agrar": 7.6,
"energie": 11.1,
"industrie": 74.0,
"sonst": 7.3
},
"wJahr": 2021,
"waren": [
{
"hs": "HS2203",
"t": "Beer made from malt  5 486 HS1005 Maize (corn)",
"v": 5437.0
},
{
"hs": "HS0804",
"t": "Dates, figs, pineapples, avocados  4 296 HS0203 Swine meat, fresh, chilled, frozen",
"v": 2626.0
},
{
"hs": "HS2208",
"t": "Alcohol of less than 80% volume  4 225 HS1201 Soya beans, whether or not broken",
"v": 2613.0
},
{
"hs": "HS0709",
"t": "Other vegetables, fresh or chilled  2 817 HS0207 Meat and edible offal of poultry",
"v": 1717.0
},
{
"hs": "HS0702",
"t": "Tomatoes, fresh or chilled  2 673 HS1001 Wheat and meslin",
"v": 1548.0
},
{
"hs": "HS8703",
"t": "Motor cars for transport of persons  46 924 HS2710 Petroleum oils, other than crude",
"v": 41770.0
},
{
"hs": "HS8471",
"t": "Automatic data-processing machines  43 774 HS8708 Parts for motor vehicles 8701-8075",
"v": 29472.0
},
{
"hs": "HS8708",
"t": "Parts for motor vehicles 8701-8075  37 931 HS8542 Electronic integrated circuits",
"v": 26420.0
},
{
"hs": "HS8704",
"t": "Motor vehicles for goods transport  32 814 HS2711 Petroleum gases",
"v": 17335.0
},
{
"hs": "HS2709",
"t": "Petroleum oils, crude  31 780 HS8473 Parts and accessories for 8469-8472",
"v": 14083.0
}
]
},
"Micronesia": {
"aus": 69.0,
"bip": 423.0,
"bipJahr": 2022,
"ein": 221.0,
"name": "Micronesia, Federated States of",
"pAus": [
{
"l": "Guam",
"p": 11.8
},
{
"l": "N. Mariana Is.",
"p": 4.8
},
{
"l": "United States of America",
"p": 2.7
},
{
"l": "Marshall Is.",
"p": 0.9
}
],
"pEin": [
{
"l": "United States of America",
"p": 37.0
},
{
"l": "Guam",
"p": 22.1
},
{
"l": "Japan",
"p": 6.7
},
{
"l": "Australia",
"p": 6.4
},
{
"l": "Singapore",
"p": 4.8
}
],
"pJahr": 2009,
"restAus": 79.8,
"restEin": 23.1,
"seite": 240,
"wAus": {
"agrar": 79.2,
"energie": 0.0,
"industrie": 0.4,
"sonst": 20.3
},
"wEin": {
"agrar": 29.0,
"energie": 31.5,
"industrie": 36.1,
"sonst": 3.5
},
"wJahr": 2013,
"waren": [
{
"hs": "HS0802",
"t": "Other nuts, fresh or dried   3 HS1006 Rice",
"v": 9.0
},
{
"hs": "HS1212",
"t": "Locust beans, seaweeds and algae 0.5 HS0207 Meat and edible offal of poultry",
"v": 6.0
},
{
"hs": "HS2106",
"t": "Other food preparations 0.4 HS1602 Other prepared or preserved meat",
"v": 3.0
},
{
"hs": "HS0604",
"t": "Foliage, branches, other parts 0.1 HS1902 Pasta",
"v": 2.0
},
{
"hs": "HS1203",
"t": "Copra 0.04 HS1905 Bread, pastry,  other bakers' wares",
"v": 2.0
},
{
"hs": "HS0303",
"t": "Fish, frozen, excluding fish fillet   23 HS2710 Petroleum oils, other than crude",
"v": 55.0
},
{
"hs": "HS0307",
"t": "Molluscs whether in shell or not 0.2 HS8703 Motor cars for transport of persons",
"v": 6.0
},
{
"hs": "HS0301",
"t": "Live fish 0.1 HS8501 Electric motors and generators",
"v": 3.0
},
{
"hs": "HS4421",
"t": "Other articles of wood 0.1 HS1604 Prepared or preserved fish",
"v": 3.0
},
{
"hs": "HS8311",
"t": "Wire, rods, tubes, plates 0.04 HS8504 Electrical transformers",
"v": 2.0
}
]
},
"Moldova": {
"aus": 4335.0,
"bip": 14410.0,
"bipJahr": 2022,
"ein": 9219.0,
"name": "Moldova, Republic of",
"pAus": [
{
"l": "European Union",
"p": 58.6
},
{
"l": "Ukraine",
"p": 16.6
},
{
"l": "Turkey",
"p": 7.0
},
{
"l": "Russia",
"p": 4.4
},
{
"l": "Belarus",
"p": 1.9
}
],
"pEin": [
{
"l": "European Union",
"p": 47.3
},
{
"l": "Russia",
"p": 12.4
},
{
"l": "China",
"p": 10.3
},
{
"l": "Ukraine",
"p": 9.3
},
{
"l": "Turkey",
"p": 7.2
}
],
"pJahr": 2022,
"restAus": 11.5,
"restEin": 13.5,
"seite": 242,
"wAus": {
"agrar": 44.9,
"energie": 3.6,
"industrie": 51.5,
"sonst": 0.0
},
"wEin": {
"agrar": 15.1,
"energie": 14.6,
"industrie": 68.6,
"sonst": 1.7
},
"wJahr": 2021,
"waren": [
{
"hs": "HS1512",
"t": "Sunflower-seed,or cotton oil   368 HS1206 Sunflower seeds",
"v": 103.0
},
{
"hs": "HS1005",
"t": "Maize (corn)   340 HS2106 Other food preparations",
"v": 51.0
},
{
"hs": "HS1206",
"t": "Sunflower seeds   336 HS1512 Sunflower-seed,or cotton oil",
"v": 50.0
},
{
"hs": "HS2204",
"t": "Wine of fresh grapes   127 HS1005 Maize (corn)",
"v": 45.0
},
{
"hs": "HS0808",
"t": "Apples, pears and quinces, fresh   91 HS1905 Bread, pastry,  other bakers' wares",
"v": 42.0
},
{
"hs": "HS2710",
"t": "Petroleum oils, other than crude   559 HS2710 Petroleum oils, other than crude",
"v": 1501.0
},
{
"hs": "HS8544",
"t": "Insulated electric conductors   476 HS2711 Petroleum gases",
"v": 850.0
},
{
"hs": "HS9401",
"t": "Seats and parts thereof   109 HS8703 Motor cars for transport of persons",
"v": 333.0
},
{
"hs": "HS7010",
"t": "Carboys, bottles, flasks, jars   86 HS3004 Medicaments in measured doses",
"v": 241.0
},
{
"hs": "HS8703",
"t": "Motor cars for transport of persons   72 HS8544 Insulated electric conductors",
"v": 212.0
}
]
},
"Mongolia": {
"aus": 12540.0,
"bip": 16833.0,
"bipJahr": 2022,
"ein": 8704.0,
"name": "Mongolia",
"pAus": [
{
"l": "China",
"p": 82.6
},
{
"l": "Switzerland",
"p": 9.4
},
{
"l": "Singapore",
"p": 2.7
},
{
"l": "South Korea",
"p": 2.4
},
{
"l": "Russia",
"p": 1.2
}
],
"pEin": [
{
"l": "China",
"p": 36.4
},
{
"l": "Russia",
"p": 28.6
},
{
"l": "European Union",
"p": 10.3
},
{
"l": "Japan",
"p": 6.6
},
{
"l": "South Korea",
"p": 4.5
}
],
"pJahr": 2021,
"restAus": 1.6,
"restEin": 13.7,
"seite": 244,
"wAus": {
"agrar": 5.4,
"energie": 82.4,
"industrie": 1.2,
"sonst": 10.9
},
"wEin": {
"agrar": 14.4,
"energie": 19.7,
"industrie": 65.7,
"sonst": 0.1
},
"wJahr": 2021,
"waren": [
{
"hs": "HS5102",
"t": "Fine or coarse animal hair   276 HS2106 Other food preparations",
"v": 96.0
},
{
"hs": "HS0802",
"t": "Other nuts, fresh or dried   85 HS1806 Chocolate and other cocoa food",
"v": 67.0
},
{
"hs": "HS1602",
"t": "Other prepared or preserved meat   38 HS1001 Wheat and meslin",
"v": 61.0
},
{
"hs": "HS0504",
"t": "Animals' guts, bladders, stomachs   15 HS2402 Cigars, cheroots, cigarillos",
"v": 61.0
},
{
"hs": "HS0205",
"t": "Meat of horses, asses, mules   14 HS1905 Bread, pastry,  other bakers' wares",
"v": 52.0
},
{
"hs": "HS2603",
"t": "Copper ores and concentrates  2 900 HS2710 Petroleum oils, other than crude",
"v": 1132.0
},
{
"hs": "HS2701",
"t": "Coal; briquettes, ovoids  2 759 HS8704 Motor vehicles for goods transport",
"v": 385.0
},
{
"hs": "HS7108",
"t": "Gold  1 005 HS8703 Motor cars for transport of persons",
"v": 385.0
},
{
"hs": "HS2601",
"t": "Iron ores and concentrates   952 HS8716 Trailers and semi-trailers",
"v": 200.0
},
{
"hs": "HS2709",
"t": "Petroleum oils, crude   273 HS7214 Other iron bar not further worked",
"v": 164.0
}
]
},
"Montenegro": {
"aus": 742.0,
"bip": 6104.0,
"bipJahr": 2022,
"ein": 3704.0,
"name": "Montenegro",
"pAus": [
{
"l": "European Union",
"p": 30.3
},
{
"l": "Serbia",
"p": 21.3
},
{
"l": "Switzerland",
"p": 15.4
},
{
"l": "Bosnia and Herz.",
"p": 12.9
},
{
"l": "Hong Kong",
"p": 3.0
}
],
"pEin": [
{
"l": "European Union",
"p": 44.3
},
{
"l": "Serbia",
"p": 17.4
},
{
"l": "China",
"p": 9.3
},
{
"l": "Bosnia and Herz.",
"p": 5.1
},
{
"l": "Turkey",
"p": 4.8
}
],
"pJahr": 2022,
"restAus": 17.0,
"restEin": 19.1,
"seite": 246,
"wAus": {
"agrar": 22.0,
"energie": 51.2,
"industrie": 26.2,
"sonst": 0.5
},
"wEin": {
"agrar": 24.2,
"energie": 13.7,
"industrie": 61.3,
"sonst": 0.7
},
"wJahr": 2021,
"waren": [
{
"hs": "HS0210",
"t": "Meat and edible meat offal, salted   18 HS0203 Swine meat, fresh, chilled, frozen",
"v": 63.0
},
{
"hs": "HS2204",
"t": "Wine of fresh grapes   13 HS1905 Bread, pastry,  other bakers' wares",
"v": 44.0
},
{
"hs": "HS1601",
"t": "Sausages and similar products   4 HS2106 Other food preparations",
"v": 42.0
},
{
"hs": "HS2203",
"t": "Beer made from malt   4 HS2202 Waters containing added sugar",
"v": 42.0
},
{
"hs": "HS0712",
"t": "Dried vegetables, whole, cut   3 HS0102 Live bovine animals",
"v": 39.0
},
{
"hs": "HS7601",
"t": "Unwrought aluminium   180 HS2710 Petroleum oils, other than crude",
"v": 404.0
},
{
"hs": "HS2716",
"t": "Electrical energy   179 HS2716 Electrical energy",
"v": 220.0
},
{
"hs": "HS3004",
"t": "Medicaments in measured doses   35 HS8703 Motor cars for transport of persons",
"v": 146.0
},
{
"hs": "HS2710",
"t": "Petroleum oils, other than crude   29 HS7601 Unwrought aluminium",
"v": 120.0
},
{
"hs": "HS4407",
"t": "Wood sawn or chipped lengthwise   29 HS3004 Medicaments in measured doses",
"v": 114.0
}
]
},
"Montserrat": {
"aus": 7.0,
"ein": 39.0,
"name": "Montserrat",
"pAus": [
{
"l": "European Union",
"p": 28.5
},
{
"l": "Antigua and Barb.",
"p": 25.3
},
{
"l": "United States of America",
"p": 8.8
},
{
"l": "British Virgin Is.",
"p": 6.6
},
{
"l": "Haiti",
"p": 4.4
}
],
"pEin": [
{
"l": "United States of America",
"p": 67.0
},
{
"l": "United Kingdom",
"p": 7.4
},
{
"l": "Trinidad and Tobago",
"p": 4.7
},
{
"l": "European Union",
"p": 3.7
},
{
"l": "Saint Lucia",
"p": 3.4
}
],
"pJahr": 2020,
"restAus": 26.2,
"restEin": 13.8,
"seite": 248,
"wAus": {
"agrar": 1.5,
"energie": 89.2,
"industrie": 8.9,
"sonst": 0.4
},
"wEin": {
"agrar": 24.0,
"energie": 17.3,
"industrie": 58.5,
"sonst": 0.1
},
"wJahr": 2021,
"waren": [
{
"hs": "HS2505",
"t": "Natural sands of all kinds   5 HS2710 Petroleum oils, other than crude",
"v": 8.0
},
{
"hs": "HS2517",
"t": "Pebbles, gravel 1.0 HS2711 Petroleum gases",
"v": 1.0
},
{
"hs": "HS9015",
"t": "Geophysical instruments, appliances 0.1 HS8474 Machinery for sorting, screening",
"v": 1.0
}
]
},
"Morocco": {
"aus": 41481.0,
"bip": 138052.0,
"bipJahr": 2022,
"ein": 71807.0,
"name": "Morocco",
"pAus": [
{
"l": "European Union",
"p": 56.9
},
{
"l": "India",
"p": 6.4
},
{
"l": "Brazil",
"p": 4.0
},
{
"l": "United Kingdom",
"p": 3.8
},
{
"l": "United States of America",
"p": 3.4
}
],
"pEin": [
{
"l": "European Union",
"p": 45.4
},
{
"l": "China",
"p": 10.0
},
{
"l": "United States of America",
"p": 7.4
},
{
"l": "Saudi Arabia",
"p": 6.5
},
{
"l": "Turkey",
"p": 5.2
}
],
"pJahr": 2022,
"restAus": 25.6,
"restEin": 25.5,
"seite": 250,
"wAus": {
"agrar": 20.7,
"energie": 6.6,
"industrie": 72.6,
"sonst": 0.1
},
"wEin": {
"agrar": 14.5,
"energie": 19.2,
"industrie": 66.2,
"sonst": 0.1
},
"wJahr": 2021,
"waren": [
{
"hs": "HS0702",
"t": "Tomatoes, fresh or chilled  1 025 HS1001 Wheat and meslin",
"v": 2549.0
},
{
"hs": "HS0810",
"t": "Other fruit, fresh   696 HS1507 Soya-bean oil and its fractions",
"v": 799.0
},
{
"hs": "HS0805",
"t": "Citrus fruit, fresh or dried   543 HS1701 Cane or beet sugar",
"v": 780.0
},
{
"hs": "HS1701",
"t": "Cane or beet sugar   432 HS1005 Maize (corn)",
"v": 762.0
},
{
"hs": "HS0709",
"t": "Other vegetables, fresh or chilled   270 HS2304 Solid residues from soya-bean oil",
"v": 340.0
},
{
"hs": "HS3105",
"t": "Mineral or chemical fertilisers  6 848 HS2710 Petroleum oils, other than crude",
"v": 9530.0
},
{
"hs": "HS8703",
"t": "Motor cars for transport of persons  5 229 HS2711 Petroleum gases",
"v": 2589.0
},
{
"hs": "HS8544",
"t": "Insulated electric conductors  3 841 HS8703 Motor cars for transport of persons",
"v": 2110.0
},
{
"hs": "HS2809",
"t": "Diphosphorus pentaoxide  2 247 HS2814 Ammonia",
"v": 2106.0
},
{
"hs": "HS6204",
"t": "Women's or girls' suits  1 367 HS2701 Coal; briquettes, ovoids",
"v": 2080.0
}
]
},
"Mozambique": {
"aus": 8281.0,
"bip": 17940.0,
"bipJahr": 2022,
"ein": 14665.0,
"name": "Mozambique",
"pAus": [
{
"l": "India",
"p": 21.1
},
{
"l": "European Union",
"p": 14.1
},
{
"l": "South Africa",
"p": 13.6
},
{
"l": "United Kingdom",
"p": 11.9
},
{
"l": "South Korea",
"p": 6.1
}
],
"pEin": [
{
"l": "South Korea",
"p": 32.0
},
{
"l": "South Africa",
"p": 15.6
},
{
"l": "United Arab Emirates",
"p": 10.0
},
{
"l": "China",
"p": 7.2
},
{
"l": "European Union",
"p": 5.8
}
],
"pJahr": 2022,
"restAus": 33.2,
"restEin": 29.4,
"seite": 252,
"wAus": {
"agrar": 15.2,
"energie": 69.2,
"industrie": 7.1,
"sonst": 8.5
},
"wEin": {
"agrar": 22.1,
"energie": 18.1,
"industrie": 59.7,
"sonst": 0.1
},
"wJahr": 2021,
"waren": [
{
"hs": "HS0713",
"t": "Dried leguminous vegetables   224 HS1006 Rice",
"v": 317.0
},
{
"hs": "HS2401",
"t": "Unmanufactured tobacco   151 HS1511 Palm oil and its fractions",
"v": 273.0
},
{
"hs": "HS1207",
"t": "Other oil seeds, oleaginous fruits   98 HS1001 Wheat and meslin",
"v": 266.0
},
{
"hs": "HS0801",
"t": "Coconuts, Brazil nuts, cashew nuts   77 HS1507 Soya-bean oil and its fractions",
"v": 74.0
},
{
"hs": "HS1701",
"t": "Cane or beet sugar   57 HS0207 Meat and edible offal of poultry",
"v": 42.0
},
{
"hs": "HS2701",
"t": "Coal; briquettes, ovoids  2 005 HS8905 Vessels not mainly for navigability",
"v": 4668.0
},
{
"hs": "HS7601",
"t": "Unwrought aluminium  1 637 HS2710 Petroleum oils, other than crude",
"v": 2272.0
},
{
"hs": "HS2704",
"t": "Coke and semi-coke of coal   847 HS2826 Fluorides; fluorosilicates",
"v": 513.0
},
{
"hs": "HS2716",
"t": "Electrical energy   571 HS8704 Motor vehicles for goods transport",
"v": 241.0
},
{
"hs": "HS2711",
"t": "Petroleum gases   569 HS2716 Electrical energy",
"v": 224.0
}
]
},
"Myanmar": {
"aus": 17085.0,
"bip": 56757.0,
"bipJahr": 2022,
"ein": 17403.0,
"name": "Myanmar",
"pAus": [
{
"l": "Thailand",
"p": 22.5
},
{
"l": "China",
"p": 21.6
},
{
"l": "European Union",
"p": 21.6
},
{
"l": "Japan",
"p": 7.1
},
{
"l": "India",
"p": 5.3
}
],
"pEin": [
{
"l": "China",
"p": 32.1
},
{
"l": "Singapore",
"p": 24.8
},
{
"l": "Thailand",
"p": 12.4
},
{
"l": "Malaysia",
"p": 6.6
},
{
"l": "Indonesia",
"p": 6.0
}
],
"pJahr": 2022,
"restAus": 22.0,
"restEin": 18.2,
"seite": 254,
"wAus": {
"agrar": 35.9,
"energie": 24.3,
"industrie": 39.8,
"sonst": 0.0
},
"wEin": {
"agrar": 18.1,
"energie": 21.4,
"industrie": 60.5,
"sonst": 0.0
},
"wJahr": 2021,
"waren": [
{
"hs": "HS0713",
"t": "Dried leguminous vegetables  1 463 HS1511 Palm oil and its fractions",
"v": 683.0
},
{
"hs": "HS1006",
"t": "Rice   787 HS2106 Other food preparations",
"v": 323.0
},
{
"hs": "HS1005",
"t": "Maize (corn)   658 HS2304 Solid residues from soya-bean oil",
"v": 199.0
},
{
"hs": "HS1207",
"t": "Other oil seeds, oleaginous fruits   156 HS1001 Wheat and meslin",
"v": 102.0
},
{
"hs": "HS0802",
"t": "Other nuts, fresh or dried   112 HS1901 Malt extract",
"v": 101.0
},
{
"hs": "HS2711",
"t": "Petroleum gases  3 932 HS2710 Petroleum oils, other than crude",
"v": 5023.0
},
{
"hs": "HS6203",
"t": "Men's or boys' suits   679 HS5514 Woven fabrics, less 85%, big",
"v": 519.0
},
{
"hs": "HS6202",
"t": "Women's or girls' overcoats   677 HS5407 Woven fabrics of synthetic filament",
"v": 472.0
},
{
"hs": "HS6204",
"t": "Women's or girls' suits   667 HS8905 Vessels not mainly for navigability",
"v": 456.0
},
{
"hs": "HS6110",
"t": "Jerseys, pullovers, cardigans   613 HS3105 Mineral or chemical fertilisers",
"v": 441.0
}
]
},
"Namibia": {
"aus": 6339.0,
"bip": 12345.0,
"bipJahr": 2022,
"ein": 7905.0,
"name": "Namibia",
"pAus": [
{
"l": "European Union",
"p": 20.3
},
{
"l": "South Africa",
"p": 16.3
},
{
"l": "Botswana",
"p": 16.1
},
{
"l": "China",
"p": 11.5
},
{
"l": "Zambia",
"p": 7.2
}
],
"pEin": [
{
"l": "South Africa",
"p": 38.9
},
{
"l": "European Union",
"p": 13.6
},
{
"l": "China",
"p": 7.6
},
{
"l": "India",
"p": 4.7
},
{
"l": "United Arab Emirates",
"p": 3.8
}
],
"pJahr": 2022,
"restAus": 28.6,
"restEin": 31.4,
"seite": 256,
"wAus": {
"agrar": 18.4,
"energie": 45.6,
"industrie": 22.0,
"sonst": 14.0
},
"wEin": {
"agrar": 11.5,
"energie": 37.4,
"industrie": 42.4,
"sonst": 8.8
},
"wJahr": 2021,
"waren": [
{
"hs": "HS2203",
"t": "Beer made from malt   86 HS1701 Cane or beet sugar",
"v": 89.0
},
{
"hs": "HS0806",
"t": "Grapes, fresh or dried   77 HS0207 Meat and edible offal of poultry",
"v": 61.0
},
{
"hs": "HS0102",
"t": "Live bovine animals   69 HS1001 Wheat and meslin",
"v": 57.0
},
{
"hs": "HS0207",
"t": "Meat and edible offal of poultry   55 HS2204 Wine of fresh grapes",
"v": 53.0
},
{
"hs": "HS0104",
"t": "Live sheep and goats   39 HS2309 Preparations of a kind used in animal feeding",
"v": 52.0
},
{
"hs": "HS7102",
"t": "Diamonds, whether or not worked  1 720 HS2710 Petroleum oils, other than crude",
"v": 1370.0
},
{
"hs": "HS2612",
"t": "Uranium, thorium ores, concentrates   814 HS2603 Copper ores and concentrates",
"v": 357.0
},
{
"hs": "HS7108",
"t": "Gold   439 HS7102 Diamonds, whether or not worked",
"v": 264.0
},
{
"hs": "HS2710",
"t": "Petroleum oils, other than crude   402 HS8704 Motor vehicles for goods transport",
"v": 245.0
},
{
"hs": "HS0304",
"t": "Fish fillets and other fish meat   334 HS2616 Precious metal ores and concentrate",
"v": 176.0
}
]
},
"Nepal": {
"aus": 1296.0,
"bip": 40149.0,
"bipJahr": 2022,
"ein": 13735.0,
"name": "Nepal",
"pAus": [
{
"l": "India",
"p": 80.1
},
{
"l": "United States of America",
"p": 8.0
},
{
"l": "European Union",
"p": 4.6
},
{
"l": "United Kingdom",
"p": 1.4
},
{
"l": "Turkey",
"p": 1.3
}
],
"pEin": [
{
"l": "India",
"p": 60.5
},
{
"l": "China",
"p": 15.1
},
{
"l": "Argentina",
"p": 2.9
},
{
"l": "United Arab Emirates",
"p": 2.6
},
{
"l": "Indonesia",
"p": 2.3
}
],
"pJahr": 2021,
"restAus": 4.7,
"restEin": 16.6,
"seite": 258,
"wAus": {
"agrar": 67.3,
"energie": 1.0,
"industrie": 30.6,
"sonst": 1.1
},
"wEin": {
"agrar": 22.0,
"energie": 18.5,
"industrie": 56.8,
"sonst": 2.6
},
"wJahr": 2021,
"waren": [
{
"hs": "HS1507",
"t": "Soya-bean oil and its fractions   597 HS1507 Soya-bean oil and its fractions",
"v": 609.0
},
{
"hs": "HS1511",
"t": "Palm oil and its fractions   258 HS1006 Rice",
"v": 452.0
},
{
"hs": "HS0908",
"t": "Nutmeg, mace and cardamoms   47 HS1511 Palm oil and its fractions",
"v": 287.0
},
{
"hs": "HS2009",
"t": "Fruit juices and vegetable juices   43 HS0713 Dried leguminous vegetables",
"v": 195.0
},
{
"hs": "HS1512",
"t": "Sunflower-seed,or cotton oil   36 HS1512 Sunflower-seed,or cotton oil",
"v": 181.0
},
{
"hs": "HS5509",
"t": "Yarn of synthetic staple fibres   74 HS2710 Petroleum oils, other than crude",
"v": 1583.0
},
{
"hs": "HS5701",
"t": "Textile floor covering, knotted   68 HS7207 Iron's semi-finished products",
"v": 599.0
},
{
"hs": "HS5310",
"t": "Woven fabrics of jute   48 HS8525 Radio-telephony transmission tools",
"v": 433.0
},
{
"hs": "HS5602",
"t": "Felt   37 HS2711 Petroleum gases",
"v": 425.0
},
{
"hs": "HS5407",
"t": "Woven fabrics of synthetic filament   28 HS7108 Gold",
"v": 325.0
}
]
},
"Netherlands": {
"aus": 966708.0,
"bip": 993681.0,
"bipJahr": 2022,
"ein": 898310.0,
"name": "Netherlands",
"pAus": [
{
"l": "European Union",
"p": 66.0
},
{
"l": "United Kingdom",
"p": 6.0
},
{
"l": "United States of America",
"p": 4.7
},
{
"l": "China",
"p": 2.0
},
{
"l": "Taiwan",
"p": 1.5
}
],
"pEin": [
{
"l": "European Union",
"p": 44.8
},
{
"l": "China",
"p": 9.5
},
{
"l": "United States of America",
"p": 8.5
},
{
"l": "United Kingdom",
"p": 6.2
},
{
"l": "Norway",
"p": 3.8
}
],
"pJahr": 2022,
"restAus": 19.7,
"restEin": 27.3,
"seite": 260,
"wAus": {
"agrar": 15.4,
"energie": 16.1,
"industrie": 68.3,
"sonst": 0.3
},
"wEin": {
"agrar": 12.0,
"energie": 19.4,
"industrie": 68.4,
"sonst": 0.1
},
"wJahr": 2021,
"waren": [
{
"hs": "HS0406",
"t": "Cheese and curd  5 420 HS1518 Animal or vegetable fats and oils",
"v": 2811.0
},
{
"hs": "HS0602",
"t": "Other live plants  5 324 HS2207 Alcohol of 80% or more volume",
"v": 2179.0
},
{
"hs": "HS0603",
"t": "Cut flowers and flower buds  4 758 HS1511 Palm oil and its fractions",
"v": 2132.0
},
{
"hs": "HS2309",
"t": "Preparations of a kind used in animal feeding  4 703 HS2106 Other food preparations",
"v": 2088.0
},
{
"hs": "HS2106",
"t": "Other food preparations  3 984 HS0201 Bovine meat, fresh, chilled",
"v": 1944.0
},
{
"hs": "HS2710",
"t": "Petroleum oils, other than crude  81 623 HS2709 Petroleum oils, crude",
"v": 58666.0
},
{
"hs": "HS8479",
"t": "Machines with individual functions  23 672 HS2710 Petroleum oils, other than crude",
"v": 39834.0
},
{
"hs": "HS8525",
"t": "Radio-telephony transmission tools  21 352 HS2711 Petroleum gases",
"v": 28035.0
},
{
"hs": "HS8471",
"t": "Automatic data-processing machines  19 008 HS8525 Radio-telephony transmission tools",
"v": 24963.0
},
{
"hs": "HS3004",
"t": "Medicaments in measured doses  15 635 HS8471 Automatic data-processing machines",
"v": 23282.0
}
]
},
"New Zealand": {
"aus": 45102.0,
"bip": 241938.0,
"bipJahr": 2022,
"ein": 54219.0,
"name": "New Zealand",
"pAus": [
{
"l": "China",
"p": 28.0
},
{
"l": "Australia",
"p": 12.1
},
{
"l": "United States of America",
"p": 10.8
},
{
"l": "Japan",
"p": 5.8
},
{
"l": "European Union",
"p": 5.6
}
],
"pEin": [
{
"l": "China",
"p": 23.1
},
{
"l": "European Union",
"p": 14.2
},
{
"l": "Australia",
"p": 11.1
},
{
"l": "United States of America",
"p": 8.9
},
{
"l": "South Korea",
"p": 6.4
}
],
"pJahr": 2022,
"restAus": 37.7,
"restEin": 36.3,
"seite": 262,
"wAus": {
"agrar": 75.2,
"energie": 4.3,
"industrie": 18.3,
"sonst": 2.2
},
"wEin": {
"agrar": 12.3,
"energie": 10.0,
"industrie": 76.0,
"sonst": 1.7
},
"wJahr": 2021,
"waren": [
{
"hs": "HS0402",
"t": "Milk and cream, concentrated  6 826 HS2306 Solid residues from other oil",
"v": 523.0
},
{
"hs": "HS0405",
"t": "Butter and other fats and oils  2 813 HS2106 Other food preparations",
"v": 451.0
},
{
"hs": "HS0204",
"t": "Meat of sheep or goats, fresh  2 753 HS2309 Preparations of a kind used in animal feeding",
"v": 347.0
},
{
"hs": "HS0202",
"t": "Meat of bovine animals, frozen  2 688 HS1001 Wheat and meslin",
"v": 246.0
},
{
"hs": "HS0810",
"t": "Other fruit, fresh  1 709 HS1905 Bread, pastry,  other bakers' wares",
"v": 221.0
},
{
"hs": "HS4403",
"t": "Wood in the rough  2 251 HS2710 Petroleum oils, other than crude",
"v": 5493.0
},
{
"hs": "HS7601",
"t": "Unwrought aluminium   852 HS8703 Motor cars for transport of persons",
"v": 4279.0
},
{
"hs": "HS4407",
"t": "Wood sawn or chipped lengthwise   622 HS8525 Radio-telephony transmission tools",
"v": 1424.0
},
{
"hs": "HS2709",
"t": "Petroleum oils, crude   577 HS8704 Motor vehicles for goods transport",
"v": 1382.0
},
{
"hs": "HS9019",
"t": "Mechano-therapy appliances   432 HS8471 Automatic data-processing machines",
"v": 1233.0
}
]
},
"Nicaragua": {
"aus": 7360.0,
"bip": 15770.0,
"bipJahr": 2022,
"ein": 11247.0,
"name": "Nicaragua",
"pAus": [
{
"l": "United States of America",
"p": 52.3
},
{
"l": "Mexico",
"p": 12.9
},
{
"l": "Honduras",
"p": 7.3
},
{
"l": "European Union",
"p": 6.0
},
{
"l": "El Salvador",
"p": 5.9
}
],
"pEin": [
{
"l": "United States of America",
"p": 26.9
},
{
"l": "China",
"p": 12.3
},
{
"l": "Honduras",
"p": 9.1
},
{
"l": "Mexico",
"p": 8.9
},
{
"l": "Guatemala",
"p": 7.4
}
],
"pJahr": 2022,
"restAus": 15.6,
"restEin": 35.3,
"seite": 264,
"wAus": {
"agrar": 46.5,
"energie": 1.7,
"industrie": 38.4,
"sonst": 13.4
},
"wEin": {
"agrar": 15.5,
"energie": 18.4,
"industrie": 66.0,
"sonst": 0.0
},
"wJahr": 2021,
"waren": [
{
"hs": "HS0901",
"t": "Coffee   716 HS1005 Maize (corn)",
"v": 189.0
},
{
"hs": "HS2402",
"t": "Cigars, cheroots, cigarillos   405 HS2106 Other food preparations",
"v": 109.0
},
{
"hs": "HS0201",
"t": "Bovine meat, fresh, chilled   363 HS2401 Unmanufactured tobacco",
"v": 106.0
},
{
"hs": "HS0202",
"t": "Meat of bovine animals, frozen   318 HS2309 Preparations of a kind used in animal feeding",
"v": 105.0
},
{
"hs": "HS0406",
"t": "Cheese and curd   178 HS1905 Bread, pastry,  other bakers' wares",
"v": 92.0
},
{
"hs": "HS6109",
"t": "T-shirts, singlets and other vests   953 HS2710 Petroleum oils, other than crude",
"v": 1060.0
},
{
"hs": "HS7108",
"t": "Gold   927 HS2709 Petroleum oils, crude",
"v": 645.0
},
{
"hs": "HS8544",
"t": "Insulated electric conductors   711 HS6109 T-shirts, singlets and other vests",
"v": 569.0
},
{
"hs": "HS6110",
"t": "Jerseys, pullovers, cardigans   251 HS6006 Other knitted or crocheted fabrics",
"v": 475.0
},
{
"hs": "HS0306",
"t": "Crustaceans whether in shell or not   213 HS3004 Medicaments in measured doses",
"v": 430.0
}
]
},
"Niger": {
"aus": 1256.0,
"bip": 15222.0,
"bipJahr": 2022,
"ein": 3802.0,
"name": "Niger",
"pAus": [
{
"l": "European Union",
"p": 34.3
},
{
"l": "Mali",
"p": 18.7
},
{
"l": "Nigeria",
"p": 16.0
},
{
"l": "United Arab Emirates",
"p": 8.9
},
{
"l": "South Africa",
"p": 7.0
}
],
"pEin": [
{
"l": "European Union",
"p": 30.0
},
{
"l": "China",
"p": 23.9
},
{
"l": "India",
"p": 10.3
},
{
"l": "Nigeria",
"p": 7.7
},
{
"l": "Thailand",
"p": 3.7
}
],
"pJahr": 2022,
"restAus": 15.0,
"restEin": 24.4,
"seite": 266,
"wAus": {
"agrar": 10.2,
"energie": 39.7,
"industrie": 11.1,
"sonst": 39.0
},
"wEin": {
"agrar": 33.4,
"energie": 8.6,
"industrie": 57.3,
"sonst": 0.7
},
"wJahr": 2021,
"waren": [
{
"hs": "HS0703",
"t": "Onions, shallots, garlic, leeks   13 HS1006 Rice",
"v": 546.0
},
{
"hs": "HS1511",
"t": "Palm oil and its fractions   10 HS1511 Palm oil and its fractions",
"v": 71.0
},
{
"hs": "HS1212",
"t": "Locust beans, seaweeds and algae   5 HS2402 Cigars, cheroots, cigarillos",
"v": 60.0
},
{
"hs": "HS0102",
"t": "Live bovine animals   5 HS1901 Malt extract",
"v": 41.0
},
{
"hs": "HS1902",
"t": "Pasta   3 HS1701 Cane or beet sugar",
"v": 35.0
},
{
"hs": "HS2612",
"t": "Uranium, thorium ores, concentrates   135 HS9305 Parts and accessories of 9301-9304",
"v": 340.0
},
{
"hs": "HS2710",
"t": "Petroleum oils, other than crude   122 HS8803 Parts of goods 8801, 8802",
"v": 241.0
},
{
"hs": "HS7108",
"t": "Gold   71 HS8802 Other aircraft",
"v": 140.0
},
{
"hs": "HS8429",
"t": "Self-propelled bulldozers   6 HS7305 Other tubes and pipes",
"v": 128.0
},
{
"hs": "HS8704",
"t": "Motor vehicles for goods transport   4 HS2710 Petroleum oils, other than crude",
"v": 85.0
}
]
},
"Nigeria": {
"aus": 63075.0,
"bip": 477376.0,
"bipJahr": 2022,
"ein": 60351.0,
"name": "Nigeria",
"pAus": [
{
"l": "European Union",
"p": 36.3
},
{
"l": "India",
"p": 16.4
},
{
"l": "Canada",
"p": 4.5
},
{
"l": "United States of America",
"p": 4.2
},
{
"l": "Indonesia",
"p": 3.9
}
],
"pEin": [
{
"l": "European Union",
"p": 30.3
},
{
"l": "China",
"p": 24.7
},
{
"l": "India",
"p": 8.8
},
{
"l": "United States of America",
"p": 6.1
},
{
"l": "Russia",
"p": 4.0
}
],
"pJahr": 2021,
"restAus": 34.7,
"restEin": 26.0,
"seite": 268,
"wAus": {
"agrar": 14.9,
"energie": 32.2,
"industrie": 52.7,
"sonst": 0.2
},
"wEin": {
"agrar": 3.6,
"energie": 90.6,
"industrie": 6.4,
"sonst": 0.0
},
"wJahr": 2021,
"waren": [
{
"hs": "HS1801",
"t": "Cocoa beans, whole or broken   560 HS1001 Wheat and meslin",
"v": 2723.0
},
{
"hs": "HS1207",
"t": "Other oil seeds, oleaginous fruits   302 HS1701 Cane or beet sugar",
"v": 895.0
},
{
"hs": "HS0801",
"t": "Coconuts, Brazil nuts, cashew nuts   256 HS0402 Milk and cream, concentrated",
"v": 459.0
},
{
"hs": "HS2402",
"t": "Cigars, cheroots, cigarillos   111 HS1511 Palm oil and its fractions",
"v": 442.0
},
{
"hs": "HS2304",
"t": "Solid residues from soya-bean oil   68 HS1901 Malt extract",
"v": 336.0
},
{
"hs": "HS2709",
"t": "Petroleum oils, crude  35 998 HS2710 Petroleum oils, other than crude",
"v": 15731.0
},
{
"hs": "HS2711",
"t": "Petroleum gases  5 829 HS8703 Motor cars for transport of persons",
"v": 1742.0
},
{
"hs": "HS8905",
"t": "Vessels not mainly for navigability  1 233 HS3004 Medicaments in measured doses",
"v": 1107.0
},
{
"hs": "HS3102",
"t": "Nitrogenous fertilisers   942 HS8517 Line telephony electrical apparatus",
"v": 753.0
},
{
"hs": "HS2716",
"t": "Electrical energy   218 HS0303 Fish, frozen, excluding fish fillet",
"v": 704.0
}
]
},
"Norway": {
"aus": 249805.0,
"bip": 579267.0,
"bipJahr": 2022,
"ein": 105545.0,
"name": "Norway",
"pAus": [
{
"l": "European Union",
"p": 68.3
},
{
"l": "United Kingdom",
"p": 21.4
},
{
"l": "China",
"p": 2.0
},
{
"l": "United States of America",
"p": 1.9
},
{
"l": "Nigeria",
"p": 0.6
}
],
"pEin": [
{
"l": "European Union",
"p": 55.6
},
{
"l": "China",
"p": 12.3
},
{
"l": "United States of America",
"p": 6.3
},
{
"l": "United Kingdom",
"p": 4.3
},
{
"l": "Canada",
"p": 3.0
}
],
"pJahr": 2022,
"restAus": 5.8,
"restEin": 18.6,
"seite": 272,
"wAus": {
"agrar": 10.0,
"energie": 73.4,
"industrie": 14.0,
"sonst": 2.5
},
"wEin": {
"agrar": 11.9,
"energie": 12.0,
"industrie": 76.1,
"sonst": 0.0
},
"wJahr": 2021,
"waren": [
{
"hs": "HS2309",
"t": "Preparations of a kind used in animal feeding   329 HS2309 Preparations of a kind used in animal feeding",
"v": 1092.0
},
{
"hs": "HS2106",
"t": "Other food preparations   242 HS1514 Rape, colza or mustard oil",
"v": 750.0
},
{
"hs": "HS2304",
"t": "Solid residues from soya-bean oil   97 HS2204 Wine of fresh grapes",
"v": 507.0
},
{
"hs": "HS1507",
"t": "Soya-bean oil and its fractions   93 HS1905 Bread, pastry,  other bakers' wares",
"v": 446.0
},
{
"hs": "HS1905",
"t": "Bread, pastry,  other bakers' wares   67 HS1109 Wheat gluten, whether or not dried",
"v": 380.0
},
{
"hs": "HS2711",
"t": "Petroleum gases  145 864 HS8703 Motor cars for transport of persons",
"v": 8709.0
},
{
"hs": "HS2709",
"t": "Petroleum oils, crude  58 262 HS2710 Petroleum oils, other than crude",
"v": 7074.0
},
{
"hs": "HS0302",
"t": "Fish, fresh, chilled  8 915 HS7501 Nickel mattes, nickel oxide sinters",
"v": 3181.0
},
{
"hs": "HS2710",
"t": "Petroleum oils, other than crude  7 484 HS8471 Automatic data-processing machines",
"v": 2363.0
},
{
"hs": "HS7601",
"t": "Unwrought aluminium  5 054 HS2716 Electrical energy",
"v": 2302.0
}
]
},
"Oman": {
"aus": 66456.0,
"bip": 114667.0,
"bipJahr": 2022,
"ein": 38704.0,
"name": "Oman",
"pAus": [
{
"l": "United Arab Emirates",
"p": 8.6
},
{
"l": "Saudi Arabia",
"p": 3.9
},
{
"l": "United States of America",
"p": 3.8
},
{
"l": "India",
"p": 3.0
},
{
"l": "China",
"p": 2.3
}
],
"pEin": [
{
"l": "United Arab Emirates",
"p": 35.6
},
{
"l": "European Union",
"p": 7.5
},
{
"l": "China",
"p": 7.0
},
{
"l": "India",
"p": 6.6
},
{
"l": "Qatar",
"p": 6.4
}
],
"pJahr": 2021,
"restAus": 78.4,
"restEin": 37.0,
"seite": 274,
"wAus": {
"agrar": 5.2,
"energie": 66.2,
"industrie": 28.5,
"sonst": 0.2
},
"wEin": {
"agrar": 17.1,
"energie": 21.9,
"industrie": 58.7,
"sonst": 2.3
},
"wJahr": 2021,
"waren": [
{
"hs": "HS0402",
"t": "Milk and cream, concentrated   268 HS1001 Wheat and meslin",
"v": 458.0
},
{
"hs": "HS2402",
"t": "Cigars, cheroots, cigarillos   242 HS0402 Milk and cream, concentrated",
"v": 410.0
},
{
"hs": "HS1905",
"t": "Bread, pastry,  other bakers' wares   140 HS0104 Live sheep and goats",
"v": 278.0
},
{
"hs": "HS0104",
"t": "Live sheep and goats   136 HS2402 Cigars, cheroots, cigarillos",
"v": 226.0
},
{
"hs": "HS1511",
"t": "Palm oil and its fractions   106 HS1511 Palm oil and its fractions",
"v": 207.0
},
{
"hs": "HS2709",
"t": "Petroleum oils, crude  18 686 HS2710 Petroleum oils, other than crude",
"v": 3370.0
},
{
"hs": "HS2711",
"t": "Petroleum gases  4 403 HS2601 Iron ores and concentrates",
"v": 1876.0
},
{
"hs": "HS2710",
"t": "Petroleum oils, other than crude  3 865 HS8703 Motor cars for transport of persons",
"v": 1730.0
},
{
"hs": "HS3102",
"t": "Nitrogenous fertilisers  1 498 HS8525 Radio-telephony transmission tools",
"v": 723.0
},
{
"hs": "HS8703",
"t": "Motor cars for transport of persons   955 HS7108 Gold",
"v": 600.0
}
]
},
"Pakistan": {
"aus": 30936.0,
"bip": 376493.0,
"bipJahr": 2022,
"ein": 71072.0,
"name": "Pakistan",
"pAus": [
{
"l": "European Union",
"p": 26.4
},
{
"l": "United States of America",
"p": 21.1
},
{
"l": "China",
"p": 10.5
},
{
"l": "United Kingdom",
"p": 7.3
},
{
"l": "United Arab Emirates",
"p": 4.1
}
],
"pEin": [
{
"l": "China",
"p": 28.3
},
{
"l": "United Arab Emirates",
"p": 10.1
},
{
"l": "European Union",
"p": 6.7
},
{
"l": "Indonesia",
"p": 5.8
},
{
"l": "United States of America",
"p": 5.3
}
],
"pJahr": 2021,
"restAus": 30.6,
"restEin": 43.9,
"seite": 276,
"wAus": {
"agrar": 19.3,
"energie": 5.3,
"industrie": 75.3,
"sonst": 0.0
},
"wEin": {
"agrar": 18.1,
"energie": 31.0,
"industrie": 50.9,
"sonst": 0.0
},
"wJahr": 2021,
"waren": [
{
"hs": "HS1006",
"t": "Rice  2 153 HS1511 Palm oil and its fractions",
"v": 3409.0
},
{
"hs": "HS2207",
"t": "Alcohol of 80% or more volume   400 HS5201 Cotton, not carded or combed",
"v": 1767.0
},
{
"hs": "HS0201",
"t": "Bovine meat, fresh, chilled   270 HS1201 Soya beans, whether or not broken",
"v": 1368.0
},
{
"hs": "HS1207",
"t": "Other oil seeds, oleaginous fruits   219 HS1001 Wheat and meslin",
"v": 813.0
},
{
"hs": "HS0804",
"t": "Dates, figs, pineapples, avocados   217 HS0713 Dried leguminous vegetables",
"v": 758.0
},
{
"hs": "HS6302",
"t": "Bed, table, toilet, kitchen linen  4 265 HS2710 Petroleum oils, other than crude",
"v": 8000.0
},
{
"hs": "HS6203",
"t": "Men's or boys' suits  2 746 HS2711 Petroleum gases",
"v": 4566.0
},
{
"hs": "HS5205",
"t": "Cotton yarn, 85% or more of cotton  1 157 HS2709 Petroleum oils, crude",
"v": 4204.0
},
{
"hs": "HS5209",
"t": "Woven fabrics, 85% cotton big   871 HS3002 Human and animal blood",
"v": 3251.0
},
{
"hs": "HS6103",
"t": "Men's or boys' suits, ensembles   835 HS8525 Radio-telephony transmission tools",
"v": 2560.0
}
]
},
"Palau": {
"aus": 3.0,
"bip": 225.0,
"bipJahr": 2022,
"ein": 210.0,
"name": "Palau",
"pAus": [
{
"l": "Japan",
"p": 77.2
},
{
"l": "Panama",
"p": 4.7
},
{
"l": "Micronesia",
"p": 3.3
},
{
"l": "United States of America",
"p": 2.6
},
{
"l": "Taiwan",
"p": 1.9
}
],
"pEin": [
{
"l": "United States of America",
"p": 34.8
},
{
"l": "Singapore",
"p": 17.0
},
{
"l": "South Korea",
"p": 10.3
},
{
"l": "Japan",
"p": 10.1
},
{
"l": "China",
"p": 5.7
}
],
"pJahr": 2018,
"restAus": 10.2,
"restEin": 22.2,
"seite": 278,
"wAus": {
"agrar": 80.7,
"energie": 2.7,
"industrie": 16.3,
"sonst": 0.2
},
"wEin": {
"agrar": 14.2,
"energie": 19.7,
"industrie": 66.0,
"sonst": 0.1
},
"wJahr": 2021,
"waren": [
{
"hs": "HS2009",
"t": "Fruit juices and vegetable juices 0.03 HS2203 Beer made from malt",
"v": 3.0
},
{
"hs": "HS1905",
"t": "Bread, pastry,  other bakers' wares 0.02 HS2202 Waters containing added sugar",
"v": 3.0
},
{
"hs": "HS1513",
"t": "Coconut (copra), or palm kernel oil 0.001 HS0202 Meat of bovine animals, frozen",
"v": 2.0
},
{
"hs": "HS0508",
"t": "Coral and similar materials 0.000 HS1006 Rice",
"v": 2.0
},
{
"hs": "HS1905",
"t": "Bread, pastry,  other bakers' wares",
"v": 2.0
},
{
"hs": "HS0302",
"t": "Fish, fresh, chilled   7 HS2710 Petroleum oils, other than crude",
"v": 36.0
},
{
"hs": "HS8802",
"t": "Other aircraft 0.4 HS8703 Motor cars for transport of persons",
"v": 5.0
},
{
"hs": "HS8429",
"t": "Self-propelled bulldozers 0.2 HS4407 Wood sawn or chipped lengthwise",
"v": 2.0
},
{
"hs": "HS0301",
"t": "Live fish 0.1 HS3004 Medicaments in measured doses",
"v": 2.0
},
{
"hs": "HS7204",
"t": "Ferrous waste and scrap 0.1 HS9403 Other furniture and parts thereof",
"v": 1.0
}
]
},
"Panama": {
"aus": 15278.0,
"bip": 71966.0,
"bipJahr": 2022,
"ein": 29249.0,
"name": "Panama",
"pAus": [
{
"l": "China",
"p": 32.7
},
{
"l": "European Union",
"p": 19.1
},
{
"l": "Japan",
"p": 15.0
},
{
"l": "South Korea",
"p": 7.4
},
{
"l": "India",
"p": 6.5
}
],
"pEin": [
{
"l": "United States of America",
"p": 24.2
},
{
"l": "China",
"p": 10.8
},
{
"l": "European Union",
"p": 7.9
},
{
"l": "Mexico",
"p": 4.3
},
{
"l": "Costa Rica",
"p": 3.3
}
],
"pJahr": 2022,
"restAus": 19.3,
"restEin": 49.5,
"seite": 280,
"wAus": {
"agrar": 6.8,
"energie": 5.1,
"industrie": 79.8,
"sonst": 8.3
},
"wEin": {
"agrar": 10.9,
"energie": 7.3,
"industrie": 68.4,
"sonst": 13.4
},
"wJahr": 2021,
"waren": [
{
"hs": "HS0803",
"t": "Bananas, including plantains   128 HS1005 Maize (corn)",
"v": 202.0
},
{
"hs": "HS1511",
"t": "Palm oil and its fractions   50 HS2106 Other food preparations",
"v": 170.0
},
{
"hs": "HS0901",
"t": "Coffee   26 HS2309 Preparations of a kind used in animal feeding",
"v": 162.0
},
{
"hs": "HS2208",
"t": "Alcohol of less than 80% volume   26 HS2304 Solid residues from soya-bean oil",
"v": 114.0
},
{
"hs": "HS0202",
"t": "Meat of bovine animals, frozen   25 HS1905 Bread, pastry,  other bakers' wares",
"v": 104.0
},
{
"hs": "HS2603",
"t": "Copper ores and concentrates  2 797 HS2710 Petroleum oils, other than crude",
"v": 3169.0
},
{
"hs": "HS0306",
"t": "Crustaceans whether in shell or not   69 HS8703 Motor cars for transport of persons",
"v": 752.0
},
{
"hs": "HS7204",
"t": "Ferrous waste and scrap   50 HS3004 Medicaments in measured doses",
"v": 633.0
},
{
"hs": "HS3004",
"t": "Medicaments in measured doses   46 HS2711 Petroleum gases",
"v": 279.0
},
{
"hs": "HS4403",
"t": "Wood in the rough   46 HS8471 Automatic data-processing machines",
"v": 190.0
}
]
},
"Papua New Guinea": {
"aus": 14519.0,
"bip": 31819.0,
"bipJahr": 2022,
"ein": 3581.0,
"name": "Papua New Guinea",
"pAus": [
{
"l": "Australia",
"p": 35.9
},
{
"l": "European Union",
"p": 16.9
},
{
"l": "Japan",
"p": 11.7
},
{
"l": "China",
"p": 6.7
},
{
"l": "Singapore",
"p": 5.6
}
],
"pEin": [
{
"l": "Australia",
"p": 34.4
},
{
"l": "Singapore",
"p": 14.3
},
{
"l": "European Union",
"p": 7.3
},
{
"l": "China",
"p": 6.9
},
{
"l": "Japan",
"p": 6.4
}
],
"pJahr": 2012,
"restAus": 23.2,
"restEin": 30.8,
"seite": 282,
"wAus": {
"agrar": 23.8,
"energie": 41.0,
"industrie": 6.2,
"sonst": 28.9
},
"wEin": {
"agrar": 11.4,
"energie": 17.8,
"industrie": 69.4,
"sonst": 1.4
},
"wJahr": 2012,
"waren": [
{
"hs": "HS1511",
"t": "Palm oil and its fractions   507 HS1006 Rice",
"v": 218.0
},
{
"hs": "HS0901",
"t": "Coffee   254 HS0204 Meat of sheep or goats, fresh",
"v": 69.0
},
{
"hs": "HS1801",
"t": "Cocoa beans, whole or broken   84 HS1001 Wheat and meslin",
"v": 49.0
},
{
"hs": "HS1513",
"t": "Coconut (copra), or palm kernel oil   81 HS2106 Other food preparations",
"v": 40.0
},
{
"hs": "HS1203",
"t": "Copra   15 HS2202 Waters containing added sugar",
"v": 35.0
},
{
"hs": "HS7111",
"t": "Base metals clad with platinum  1 493 HS2709 Petroleum oils, crude",
"v": 846.0
},
{
"hs": "HS2603",
"t": "Copper ores and concentrates   406 HS2710 Petroleum oils, other than crude",
"v": 561.0
},
{
"hs": "HS2616",
"t": "Precious metal ores and concentrate   321 HS8704 Motor vehicles for goods transport",
"v": 289.0
},
{
"hs": "HS4403",
"t": "Wood in the rough   241 HS8431 Parts for machinery of 8425 to 8430",
"v": 240.0
},
{
"hs": "HS2921",
"t": "Amine-function compounds   176 HS8414 Air or vacuum pumps",
"v": 219.0
}
]
},
"Paraguay": {
"aus": 9957.0,
"bip": 41284.0,
"bipJahr": 2022,
"ein": 15853.0,
"name": "Paraguay",
"pAus": [
{
"l": "Brazil",
"p": 36.9
},
{
"l": "Argentina",
"p": 19.2
},
{
"l": "Chile",
"p": 11.6
},
{
"l": "European Union",
"p": 4.4
},
{
"l": "Russia",
"p": 3.6
}
],
"pEin": [
{
"l": "China",
"p": 29.6
},
{
"l": "Brazil",
"p": 23.2
},
{
"l": "United States of America",
"p": 9.6
},
{
"l": "Argentina",
"p": 7.9
},
{
"l": "European Union",
"p": 7.3
}
],
"pJahr": 2022,
"restAus": 24.3,
"restEin": 22.4,
"seite": 284,
"wAus": {
"agrar": 70.4,
"energie": 16.4,
"industrie": 13.2,
"sonst": 0.0
},
"wEin": {
"agrar": 8.4,
"energie": 14.7,
"industrie": 76.9,
"sonst": 0.1
},
"wJahr": 2021,
"waren": [
{
"hs": "HS1201",
"t": "Soya beans, whether or not broken  1 227 HS2203 Beer made from malt",
"v": 148.0
},
{
"hs": "HS1005",
"t": "Maize (corn)  1 089 HS1005 Maize (corn)",
"v": 94.0
},
{
"hs": "HS0201",
"t": "Bovine meat, fresh, chilled   883 HS2106 Other food preparations",
"v": 85.0
},
{
"hs": "HS0202",
"t": "Meat of bovine animals, frozen   850 HS2309 Preparations of a kind used in animal feeding",
"v": 78.0
},
{
"hs": "HS2304",
"t": "Solid residues from soya-bean oil   586 HS1905 Bread, pastry,  other bakers' wares",
"v": 72.0
},
{
"hs": "HS2716",
"t": "Electrical energy  1 662 HS2710 Petroleum oils, other than crude",
"v": 2418.0
},
{
"hs": "HS8544",
"t": "Insulated electric conductors   277 HS8525 Radio-telephony transmission tools",
"v": 1223.0
},
{
"hs": "HS3808",
"t": "Insecticides, rodenticides   132 HS8703 Motor cars for transport of persons",
"v": 570.0
},
{
"hs": "HS4104",
"t": "Tanned/crust bovine hides, skins   65 HS3808 Insecticides, rodenticides",
"v": 481.0
},
{
"hs": "HS3004",
"t": "Medicaments in measured doses   62 HS8471 Automatic data-processing machines",
"v": 441.0
}
]
},
"Peru": {
"aus": 61309.0,
"bip": 242396.0,
"bipJahr": 2022,
"ein": 60958.0,
"name": "Peru",
"pAus": [
{
"l": "China",
"p": 32.0
},
{
"l": "United States of America",
"p": 12.8
},
{
"l": "European Union",
"p": 11.9
},
{
"l": "South Korea",
"p": 5.0
},
{
"l": "Japan",
"p": 4.9
}
],
"pEin": [
{
"l": "China",
"p": 28.6
},
{
"l": "United States of America",
"p": 18.7
},
{
"l": "European Union",
"p": 9.1
},
{
"l": "Brazil",
"p": 6.7
},
{
"l": "Argentina",
"p": 4.5
}
],
"pJahr": 2021,
"restAus": 33.4,
"restEin": 32.4,
"seite": 286,
"wAus": {
"agrar": 21.4,
"energie": 51.9,
"industrie": 8.4,
"sonst": 18.3
},
"wEin": {
"agrar": 13.8,
"energie": 14.2,
"industrie": 72.0,
"sonst": 0.0
},
"wJahr": 2021,
"waren": [
{
"hs": "HS0804",
"t": "Dates, figs, pineapples, avocados  1 377 HS1005 Maize (corn)",
"v": 1105.0
},
{
"hs": "HS0810",
"t": "Other fruit, fresh  1 286 HS1507 Soya-bean oil and its fractions",
"v": 729.0
},
{
"hs": "HS0806",
"t": "Grapes, fresh or dried  1 197 HS2304 Solid residues from soya-bean oil",
"v": 693.0
},
{
"hs": "HS0901",
"t": "Coffee   759 HS1001 Wheat and meslin",
"v": 617.0
},
{
"hs": "HS0709",
"t": "Other vegetables, fresh or chilled   406 HS2106 Other food preparations",
"v": 314.0
},
{
"hs": "HS2603",
"t": "Copper ores and concentrates  15 230 HS2710 Petroleum oils, other than crude",
"v": 4162.0
},
{
"hs": "HS7108",
"t": "Gold  7 719 HS8525 Radio-telephony transmission tools",
"v": 1826.0
},
{
"hs": "HS7403",
"t": "Refined copper and copper alloys  2 292 HS2709 Petroleum oils, crude",
"v": 1819.0
},
{
"hs": "HS2710",
"t": "Petroleum oils, other than crude  1 869 HS8471 Automatic data-processing machines",
"v": 1496.0
},
{
"hs": "HS2601",
"t": "Iron ores and concentrates  1 774 HS8703 Motor cars for transport of persons",
"v": 1449.0
}
]
},
"Philippines": {
"aus": 78930.0,
"bip": 404261.0,
"bipJahr": 2022,
"ein": 145867.0,
"name": "Philippines",
"pAus": [
{
"l": "United States of America",
"p": 15.8
},
{
"l": "Japan",
"p": 14.1
},
{
"l": "China",
"p": 13.9
},
{
"l": "Hong Kong",
"p": 13.3
},
{
"l": "European Union",
"p": 11.0
}
],
"pEin": [
{
"l": "China",
"p": 20.4
},
{
"l": "Indonesia",
"p": 9.6
},
{
"l": "Japan",
"p": 9.0
},
{
"l": "South Korea",
"p": 8.7
},
{
"l": "United States of America",
"p": 6.6
}
],
"pJahr": 2022,
"restAus": 31.9,
"restEin": 45.7,
"seite": 288,
"wAus": {
"agrar": 10.2,
"energie": 8.7,
"industrie": 79.6,
"sonst": 1.5
},
"wEin": {
"agrar": 14.0,
"energie": 14.7,
"industrie": 71.0,
"sonst": 0.3
},
"wJahr": 2021,
"waren": [
{
"hs": "HS1513",
"t": "Coconut (copra), or palm kernel oil  2 124 HS1001 Wheat and meslin",
"v": 2584.0
},
{
"hs": "HS0803",
"t": "Bananas, including plantains  1 098 HS2304 Solid residues from soya-bean oil",
"v": 1918.0
},
{
"hs": "HS2008",
"t": "Plants' parts otherwise preserved   444 HS1511 Palm oil and its fractions",
"v": 1324.0
},
{
"hs": "HS0804",
"t": "Dates, figs, pineapples, avocados   379 HS1006 Rice",
"v": 1273.0
},
{
"hs": "HS0801",
"t": "Coconuts, Brazil nuts, cashew nuts   372 HS2106 Other food preparations",
"v": 1047.0
},
{
"hs": "HS8542",
"t": "Electronic integrated circuits  28 948 HS8542 Electronic integrated circuits",
"v": 17303.0
},
{
"hs": "HS8471",
"t": "Automatic data-processing machines  4 425 HS2710 Petroleum oils, other than crude",
"v": 14399.0
},
{
"hs": "HS8544",
"t": "Insulated electric conductors  2 776 HS2701 Coal; briquettes, ovoids",
"v": 6042.0
},
{
"hs": "HS7403",
"t": "Refined copper and copper alloys  1 925 HS2709 Petroleum oils, crude",
"v": 3782.0
},
{
"hs": "HS8504",
"t": "Electrical transformers  1 814 HS8703 Motor cars for transport of persons",
"v": 3573.0
}
]
},
"Poland": {
"aus": 360542.0,
"bip": 688301.0,
"bipJahr": 2022,
"ein": 381187.0,
"name": "Poland",
"pAus": [
{
"l": "European Union",
"p": 75.7
},
{
"l": "United Kingdom",
"p": 4.8
},
{
"l": "United States of America",
"p": 2.9
},
{
"l": "Ukraine",
"p": 2.8
},
{
"l": "Russia",
"p": 1.4
}
],
"pEin": [
{
"l": "European Union",
"p": 51.7
},
{
"l": "China",
"p": 13.1
},
{
"l": "Russia",
"p": 4.6
},
{
"l": "United States of America",
"p": 4.4
},
{
"l": "South Korea",
"p": 2.5
}
],
"pJahr": 2022,
"restAus": 12.3,
"restEin": 23.7,
"seite": 290,
"wAus": {
"agrar": 13.9,
"energie": 5.9,
"industrie": 80.1,
"sonst": 0.1
},
"wEin": {
"agrar": 9.6,
"energie": 10.1,
"industrie": 77.9,
"sonst": 2.4
},
"wJahr": 2021,
"waren": [
{
"hs": "HS0207",
"t": "Meat and edible offal of poultry  4 511 HS0203 Swine meat, fresh, chilled, frozen",
"v": 1677.0
},
{
"hs": "HS2402",
"t": "Cigars, cheroots, cigarillos  3 734 HS2309 Preparations of a kind used in animal feeding",
"v": 1607.0
},
{
"hs": "HS1905",
"t": "Bread, pastry,  other bakers' wares  2 662 HS2304 Solid residues from soya-bean oil",
"v": 1505.0
},
{
"hs": "HS1806",
"t": "Chocolate and other cocoa food  2 357 HS1806 Chocolate and other cocoa food",
"v": 1072.0
},
{
"hs": "HS2309",
"t": "Preparations of a kind used in animal feeding  2 038 HS0901 Coffee",
"v": 966.0
},
{
"hs": "HS8708",
"t": "Parts for motor vehicles 8701-8075  15 089 HS2709 Petroleum oils, crude",
"v": 16647.0
},
{
"hs": "HS8507",
"t": "Electric accumulators  9 545 HS8703 Motor cars for transport of persons",
"v": 11483.0
},
{
"hs": "HS8471",
"t": "Automatic data-processing machines  9 205 HS2710 Petroleum oils, other than crude",
"v": 9029.0
},
{
"hs": "HS8528",
"t": "Reception apparatus for television  6 180 HS8708 Parts for motor vehicles 8701-8075",
"v": 8986.0
},
{
"hs": "HS9403",
"t": "Other furniture and parts thereof  5 843 HS8471 Automatic data-processing machines",
"v": 6763.0
}
]
},
"Portugal": {
"aus": 82273.0,
"bip": 252381.0,
"bipJahr": 2022,
"ein": 114848.0,
"name": "Portugal",
"pAus": [
{
"l": "European Union",
"p": 69.5
},
{
"l": "United States of America",
"p": 6.5
},
{
"l": "United Kingdom",
"p": 4.9
},
{
"l": "Angola",
"p": 1.8
},
{
"l": "Brazil",
"p": 1.2
}
],
"pEin": [
{
"l": "European Union",
"p": 69.5
},
{
"l": "China",
"p": 5.1
},
{
"l": "Brazil",
"p": 4.2
},
{
"l": "United States of America",
"p": 3.2
},
{
"l": "Nigeria",
"p": 1.8
}
],
"pJahr": 2022,
"restAus": 16.1,
"restEin": 16.3,
"seite": 292,
"wAus": {
"agrar": 15.3,
"energie": 8.8,
"industrie": 75.7,
"sonst": 0.2
},
"wEin": {
"agrar": 16.0,
"energie": 14.4,
"industrie": 69.6,
"sonst": 0.0
},
"wJahr": 2021,
"waren": [
{
"hs": "HS2204",
"t": "Wine of fresh grapes   988 HS1005 Maize (corn)",
"v": 758.0
},
{
"hs": "HS1509",
"t": "Olive oil and its fractions   980 HS0201 Bovine meat, fresh, chilled",
"v": 669.0
},
{
"hs": "HS2402",
"t": "Cigars, cheroots, cigarillos   751 HS1201 Soya beans, whether or not broken",
"v": 633.0
},
{
"hs": "HS2002",
"t": "Tomatoes prepared or preserved   347 HS1905 Bread, pastry,  other bakers' wares",
"v": 541.0
},
{
"hs": "HS1905",
"t": "Bread, pastry,  other bakers' wares   330 HS1001 Wheat and meslin",
"v": 444.0
},
{
"hs": "HS2710",
"t": "Petroleum oils, other than crude  5 671 HS2709 Petroleum oils, crude",
"v": 7755.0
},
{
"hs": "HS8703",
"t": "Motor cars for transport of persons  4 231 HS2711 Petroleum gases",
"v": 5091.0
},
{
"hs": "HS8708",
"t": "Parts for motor vehicles 8701-8075  3 249 HS8703 Motor cars for transport of persons",
"v": 4918.0
},
{
"hs": "HS4802",
"t": "Uncoated paper and paperboard  1 830 HS2710 Petroleum oils, other than crude",
"v": 3849.0
},
{
"hs": "HS6403",
"t": "Footwear, uppers of leather  1 818 HS8708 Parts for motor vehicles 8701-8075",
"v": 3490.0
}
]
},
"Qatar": {
"aus": 130964.0,
"bip": 225477.0,
"bipJahr": 2022,
"ein": 33479.0,
"name": "Qatar",
"pAus": [
{
"l": "European Union",
"p": 16.2
},
{
"l": "China",
"p": 15.9
},
{
"l": "India",
"p": 11.6
},
{
"l": "South Korea",
"p": 10.9
},
{
"l": "Japan",
"p": 9.6
}
],
"pEin": [
{
"l": "European Union",
"p": 22.0
},
{
"l": "China",
"p": 16.2
},
{
"l": "United States of America",
"p": 14.6
},
{
"l": "India",
"p": 6.2
},
{
"l": "Turkey",
"p": 4.3
}
],
"pJahr": 2022,
"restAus": 35.9,
"restEin": 36.5,
"seite": 294,
"wAus": {
"agrar": 0.1,
"energie": 87.2,
"industrie": 9.8,
"sonst": 2.9
},
"wEin": {
"agrar": 11.3,
"energie": 6.5,
"industrie": 75.8,
"sonst": 6.4
},
"wJahr": 2021,
"waren": [
{
"hs": "HS0106",
"t": "Other live animals   24 HS0207 Meat and edible offal of poultry",
"v": 312.0
},
{
"hs": "HS1518",
"t": "Animal or vegetable fats and oils   12 HS0204 Meat of sheep or goats, fresh",
"v": 170.0
},
{
"hs": "HS0101",
"t": "Live horses, asses, mules, hinnies   4 HS1905 Bread, pastry,  other bakers' wares",
"v": 147.0
},
{
"hs": "HS0202",
"t": "Meat of bovine animals, frozen   3 HS1006 Rice",
"v": 144.0
},
{
"hs": "HS0405",
"t": "Butter and other fats and oils   3 HS0104 Live sheep and goats",
"v": 144.0
},
{
"hs": "HS2711",
"t": "Petroleum gases  85 403 HS8411 Turbo-jets, turbo-propellers and ot",
"v": 1968.0
},
{
"hs": "HS2709",
"t": "Petroleum oils, crude  18 728 HS8703 Motor cars for transport of persons",
"v": 1338.0
},
{
"hs": "HS2710",
"t": "Petroleum oils, other than crude  10 189 HS7113 Articles and parts of jewellery",
"v": 745.0
},
{
"hs": "HS3102",
"t": "Nitrogenous fertilisers  3 577 HS8471 Automatic data-processing machines",
"v": 725.0
},
{
"hs": "HS3901",
"t": "Polymers of ethylene, primary forms  2 841 HS3004 Medicaments in measured doses",
"v": 630.0
}
]
},
"Romania": {
"aus": 96707.0,
"bip": 301845.0,
"bipJahr": 2022,
"ein": 132491.0,
"name": "Romania",
"pAus": [
{
"l": "European Union",
"p": 71.9
},
{
"l": "Turkey",
"p": 3.1
},
{
"l": "United Kingdom",
"p": 2.9
},
{
"l": "United States of America",
"p": 2.5
},
{
"l": "Moldova",
"p": 2.5
}
],
"pEin": [
{
"l": "European Union",
"p": 71.1
},
{
"l": "Turkey",
"p": 5.6
},
{
"l": "China",
"p": 5.1
},
{
"l": "Russia",
"p": 4.3
},
{
"l": "Ukraine",
"p": 1.7
}
],
"pJahr": 2022,
"restAus": 17.2,
"restEin": 12.1,
"seite": 296,
"wAus": {
"agrar": 14.2,
"energie": 6.4,
"industrie": 79.0,
"sonst": 0.3
},
"wEin": {
"agrar": 11.4,
"energie": 10.5,
"industrie": 77.5,
"sonst": 0.6
},
"wJahr": 2021,
"waren": [
{
"hs": "HS1001",
"t": "Wheat and meslin  2 099 HS0203 Swine meat, fresh, chilled, frozen",
"v": 870.0
},
{
"hs": "HS1005",
"t": "Maize (corn)  1 995 HS1905 Bread, pastry,  other bakers' wares",
"v": 590.0
},
{
"hs": "HS1206",
"t": "Sunflower seeds  1 166 HS1206 Sunflower seeds",
"v": 538.0
},
{
"hs": "HS2403",
"t": "Other manufactured tobacco   884 HS1005 Maize (corn)",
"v": 527.0
},
{
"hs": "HS1205",
"t": "Rape or colza seeds   735 HS2106 Other food preparations",
"v": 519.0
},
{
"hs": "HS8708",
"t": "Parts for motor vehicles 8701-8075  6 714 HS2709 Petroleum oils, crude",
"v": 5903.0
},
{
"hs": "HS8703",
"t": "Motor cars for transport of persons  6 165 HS8708 Parts for motor vehicles 8701-8075",
"v": 4697.0
},
{
"hs": "HS8544",
"t": "Insulated electric conductors  4 167 HS2711 Petroleum gases",
"v": 3642.0
},
{
"hs": "HS2710",
"t": "Petroleum oils, other than crude  3 661 HS3004 Medicaments in measured doses",
"v": 3607.0
},
{
"hs": "HS8537",
"t": "Boards, panels, consoles, desks  3 198 HS8703 Motor cars for transport of persons",
"v": 3449.0
}
]
},
"Russia": {
"aus": 588328.0,
"bip": 2215294.0,
"bipJahr": 2022,
"ein": 280353.0,
"name": "Russian Federation",
"pAus": [
{
"l": "European Union",
"p": 38.2
},
{
"l": "China",
"p": 14.0
},
{
"l": "Turkey",
"p": 5.4
},
{
"l": "Belarus",
"p": 4.7
},
{
"l": "United Kingdom",
"p": 4.5
}
],
"pEin": [
{
"l": "European Union",
"p": 32.0
},
{
"l": "China",
"p": 24.8
},
{
"l": "United States of America",
"p": 5.9
},
{
"l": "Belarus",
"p": 5.3
},
{
"l": "South Korea",
"p": 4.4
}
],
"pJahr": 2021,
"restAus": 33.3,
"restEin": 27.6,
"seite": 298,
"wAus": {
"agrar": 8.9,
"energie": 50.4,
"industrie": 22.1,
"sonst": 18.7
},
"wEin": {
"agrar": 11.4,
"energie": 3.6,
"industrie": 77.0,
"sonst": 8.0
},
"wJahr": 2021,
"waren": [
{
"hs": "HS1001",
"t": "Wheat and meslin  7 302 HS0406 Cheese and curd",
"v": 1301.0
},
{
"hs": "HS1512",
"t": "Sunflower-seed,or cotton oil  3 105 HS1511 Palm oil and its fractions",
"v": 1272.0
},
{
"hs": "HS1514",
"t": "Rape, colza or mustard oil   987 HS0805 Citrus fruit, fresh or dried",
"v": 1268.0
},
{
"hs": "HS1003",
"t": "Barley   967 HS1201 Soya beans, whether or not broken",
"v": 1261.0
},
{
"hs": "HS1806",
"t": "Chocolate and other cocoa food   864 HS2204 Wine of fresh grapes",
"v": 1251.0
},
{
"hs": "HS2709",
"t": "Petroleum oils, crude  110 968 HS8525 Radio-telephony transmission tools",
"v": 11265.0
},
{
"hs": "HS2710",
"t": "Petroleum oils, other than crude  69 966 HS8708 Parts for motor vehicles 8701-8075",
"v": 10671.0
},
{
"hs": "HS2701",
"t": "Coal; briquettes, ovoids  17 584 HS3004 Medicaments in measured doses",
"v": 9362.0
},
{
"hs": "HS7108",
"t": "Gold  17 363 HS8471 Automatic data-processing machines",
"v": 8667.0
},
{
"hs": "HS7207",
"t": "Iron's semi-finished products  9 176 HS8703 Motor cars for transport of persons",
"v": 7999.0
}
]
},
"Rwanda": {
"aus": 2111.0,
"bip": 12703.0,
"bipJahr": 2022,
"ein": 3569.0,
"name": "Rwanda",
"pAus": [
{
"l": "Dem. Rep. Congo",
"p": 38.0
},
{
"l": "United Arab Emirates",
"p": 29.2
},
{
"l": "China",
"p": 4.8
},
{
"l": "European Union",
"p": 4.1
},
{
"l": "India",
"p": 3.5
}
],
"pEin": [
{
"l": "China",
"p": 21.0
},
{
"l": "Tanzania",
"p": 11.1
},
{
"l": "Kenya",
"p": 9.3
},
{
"l": "India",
"p": 9.3
},
{
"l": "European Union",
"p": 8.9
}
],
"pJahr": 2022,
"restAus": 20.3,
"restEin": 40.4,
"seite": 300,
"wAus": {
"agrar": 40.6,
"energie": 17.8,
"industrie": 20.0,
"sonst": 21.6
},
"wEin": {
"agrar": 26.7,
"energie": 16.0,
"industrie": 57.2,
"sonst": 0.0
},
"wJahr": 2021,
"waren": [
{
"hs": "HS0902",
"t": "Tea   101 HS1511 Palm oil and its fractions",
"v": 175.0
},
{
"hs": "HS0901",
"t": "Coffee   96 HS1701 Cane or beet sugar",
"v": 174.0
},
{
"hs": "HS1006",
"t": "Rice   63 HS1006 Rice",
"v": 144.0
},
{
"hs": "HS1511",
"t": "Palm oil and its fractions   58 HS1001 Wheat and meslin",
"v": 79.0
},
{
"hs": "HS1901",
"t": "Malt extract   52 HS1107 Malt, whether or not roasted",
"v": 65.0
},
{
"hs": "HS7108",
"t": "Gold   556 HS2710 Petroleum oils, other than crude",
"v": 719.0
},
{
"hs": "HS2710",
"t": "Petroleum oils, other than crude   198 HS7108 Gold",
"v": 510.0
},
{
"hs": "HS2617",
"t": "Other ores and concentrates   68 HS3105 Mineral or chemical fertilisers",
"v": 89.0
},
{
"hs": "HS2609",
"t": "Tin ores and concentrates   65 HS3004 Medicaments in measured doses",
"v": 82.0
},
{
"hs": "HS2615",
"t": "Niobium, tantalum, vanadium or zirc   64 HS7210 Flat-rolled products of iron +600",
"v": 79.0
}
]
},
"S. Sudan": {
"aus": 873.0,
"bip": 7871.0,
"bipJahr": 2022,
"ein": 1255.0,
"name": "South Sudan",
"seite": 334,
"waren": []
},
"Saint Lucia": {
"aus": 79.0,
"bip": 2084.0,
"bipJahr": 2022,
"ein": 834.0,
"name": "Saint Lucia",
"pAus": [
{
"l": "United States of America",
"p": 28.0
},
{
"l": "Trinidad and Tobago",
"p": 12.0
},
{
"l": "United Kingdom",
"p": 9.0
},
{
"l": "Barbados",
"p": 8.3
},
{
"l": "Dominica",
"p": 7.3
}
],
"pEin": [
{
"l": "United States of America",
"p": 39.8
},
{
"l": "Trinidad and Tobago",
"p": 14.1
},
{
"l": "European Union",
"p": 7.4
},
{
"l": "United Kingdom",
"p": 6.4
},
{
"l": "China",
"p": 6.0
}
],
"pJahr": 2020,
"restAus": 35.4,
"restEin": 26.4,
"seite": 304,
"wAus": {
"agrar": 50.9,
"energie": 25.5,
"industrie": 23.5,
"sonst": 0.0
},
"wEin": {
"agrar": 30.8,
"energie": 15.2,
"industrie": 53.7,
"sonst": 0.2
},
"wJahr": 2021,
"waren": [
{
"hs": "HS2203",
"t": "Beer made from malt   10 HS0207 Meat and edible offal of poultry",
"v": 14.0
},
{
"hs": "HS0803",
"t": "Bananas, including plantains   5 HS1101 Wheat or meslin flour",
"v": 9.0
},
{
"hs": "HS2208",
"t": "Alcohol of less than 80% volume   3 HS1905 Bread, pastry,  other bakers' wares",
"v": 7.0
},
{
"hs": "HS1212",
"t": "Locust beans, seaweeds and algae   2 HS0402 Milk and cream, concentrated",
"v": 6.0
},
{
"hs": "HS2309",
"t": "Preparations of a kind used in animal feeding   2 HS2309 Preparations of a kind used in animal feeding",
"v": 6.0
},
{
"hs": "HS7113",
"t": "Articles and parts of jewellery   4 HS2710 Petroleum oils, other than crude",
"v": 53.0
},
{
"hs": "HS4819",
"t": "Cartons, boxes, cases, bags   3 HS8703 Motor cars for transport of persons",
"v": 16.0
},
{
"hs": "HS2517",
"t": "Pebbles, gravel   3 HS8471 Automatic data-processing machines",
"v": 10.0
},
{
"hs": "HS3210",
"t": "Other paints and varnishes   3 HS2523 Portland cement, aluminous cement",
"v": 9.0
},
{
"hs": "HS2710",
"t": "Petroleum oils, other than crude   2 HS8704 Motor vehicles for goods transport",
"v": 8.0
}
]
},
"Samoa": {
"aus": 42.0,
"bip": 832.0,
"bipJahr": 2022,
"ein": 440.0,
"name": "Samoa",
"pAus": [
{
"l": "New Zealand",
"p": 23.3
},
{
"l": "American Samoa",
"p": 21.1
},
{
"l": "United States of America",
"p": 18.6
},
{
"l": "Australia",
"p": 8.6
},
{
"l": "Tokelau",
"p": 7.5
}
],
"pEin": [
{
"l": "New Zealand",
"p": 23.2
},
{
"l": "Singapore",
"p": 16.0
},
{
"l": "China",
"p": 13.5
},
{
"l": "Australia",
"p": 11.0
},
{
"l": "United States of America",
"p": 10.0
}
],
"pJahr": 2021,
"restAus": 21.0,
"restEin": 26.3,
"seite": 308,
"wAus": {
"agrar": 70.4,
"energie": 12.2,
"industrie": 17.3,
"sonst": 0.0
},
"wEin": {
"agrar": 34.2,
"energie": 16.5,
"industrie": 49.3,
"sonst": 0.0
},
"wJahr": 2021,
"waren": [
{
"hs": "HS1513",
"t": "Coconut (copra), or palm kernel oil   4 HS0207 Meat and edible offal of poultry",
"v": 22.0
},
{
"hs": "HS0714",
"t": "Manioc, arrowroot, salep   3 HS1905 Bread, pastry,  other bakers' wares",
"v": 7.0
},
{
"hs": "HS2203",
"t": "Beer made from malt   2 HS1701 Cane or beet sugar",
"v": 6.0
},
{
"hs": "HS2402",
"t": "Cigars, cheroots, cigarillos   1 HS0401 Milk and cream, not concentrated",
"v": 6.0
},
{
"hs": "HS2009",
"t": "Fruit juices and vegetable juices   1 HS1101 Wheat or meslin flour",
"v": 5.0
},
{
"hs": "HS0303",
"t": "Fish, frozen, excluding fish fillet   5 HS2710 Petroleum oils, other than crude",
"v": 55.0
},
{
"hs": "HS2710",
"t": "Petroleum oils, other than crude   3 HS8704 Motor vehicles for goods transport",
"v": 10.0
},
{
"hs": "HS8536",
"t": "Electrical circuits protector   2 HS4407 Wood sawn or chipped lengthwise",
"v": 9.0
},
{
"hs": "HS8538",
"t": "Parts for 8535-8537 0.8 HS8703 Motor cars for transport of persons",
"v": 9.0
},
{
"hs": "HS7204",
"t": "Ferrous waste and scrap 0.3 HS2523 Portland cement, aluminous cement",
"v": 7.0
}
]
},
"Saudi Arabia": {
"aus": 411184.0,
"bip": 1108149.0,
"bipJahr": 2022,
"ein": 189877.0,
"name": "Saudi Arabia, Kingdom of",
"pAus": [
{
"l": "United Arab Emirates",
"p": 5.1
},
{
"l": "European Union",
"p": 4.9
},
{
"l": "China",
"p": 3.8
},
{
"l": "India",
"p": 3.2
},
{
"l": "Egypt",
"p": 2.7
}
],
"pEin": [
{
"l": "European Union",
"p": 20.9
},
{
"l": "China",
"p": 19.8
},
{
"l": "United States of America",
"p": 10.6
},
{
"l": "United Arab Emirates",
"p": 8.2
},
{
"l": "India",
"p": 5.3
}
],
"pJahr": 2021,
"restAus": 80.2,
"restEin": 35.2,
"seite": 312,
"wAus": {
"agrar": 1.8,
"energie": 74.7,
"industrie": 23.0,
"sonst": 0.6
},
"wEin": {
"agrar": 15.8,
"energie": 7.7,
"industrie": 68.7,
"sonst": 7.8
},
"wJahr": 2021,
"waren": [
{
"hs": "HS1905",
"t": "Bread, pastry,  other bakers' wares   383 HS1003 Barley",
"v": 1458.0
},
{
"hs": "HS0804",
"t": "Dates, figs, pineapples, avocados   331 HS0207 Meat and edible offal of poultry",
"v": 1187.0
},
{
"hs": "HS0406",
"t": "Cheese and curd   313 HS1006 Rice",
"v": 1095.0
},
{
"hs": "HS2009",
"t": "Fruit juices and vegetable juices   288 HS1005 Maize (corn)",
"v": 909.0
},
{
"hs": "HS1701",
"t": "Cane or beet sugar   271 HS2106 Other food preparations",
"v": 894.0
},
{
"hs": "HS2709",
"t": "Petroleum oils, crude  150 844 HS8703 Motor cars for transport of persons",
"v": 11899.0
},
{
"hs": "HS2710",
"t": "Petroleum oils, other than crude  52 250 HS2710 Petroleum oils, other than crude",
"v": 6996.0
},
{
"hs": "HS3901",
"t": "Polymers of ethylene, primary forms  11 719 HS8525 Radio-telephony transmission tools",
"v": 6938.0
},
{
"hs": "HS2711",
"t": "Petroleum gases  8 152 HS3004 Medicaments in measured doses",
"v": 4157.0
},
{
"hs": "HS3902",
"t": "Polymers of propylene  7 294 HS7108 Gold",
"v": 3684.0
}
]
},
"Senegal": {
"aus": 5413.0,
"bip": 27462.0,
"bipJahr": 2022,
"ein": 10802.0,
"name": "Senegal",
"pAus": [
{
"l": "Mali",
"p": 20.2
},
{
"l": "Switzerland",
"p": 14.4
},
{
"l": "European Union",
"p": 11.3
},
{
"l": "India",
"p": 9.8
},
{
"l": "China",
"p": 6.6
}
],
"pEin": [
{
"l": "European Union",
"p": 34.1
},
{
"l": "China",
"p": 9.7
},
{
"l": "India",
"p": 7.1
},
{
"l": "Russia",
"p": 5.7
},
{
"l": "Nigeria",
"p": 5.3
}
],
"pJahr": 2021,
"restAus": 37.7,
"restEin": 38.1,
"seite": 314,
"wAus": {
"agrar": 31.6,
"energie": 22.8,
"industrie": 26.9,
"sonst": 18.7
},
"wEin": {
"agrar": 22.8,
"energie": 27.4,
"industrie": 49.2,
"sonst": 0.7
},
"wJahr": 2021,
"waren": [
{
"hs": "HS1202",
"t": "Ground-nuts, not cooked   279 HS1006 Rice",
"v": 473.0
},
{
"hs": "HS2104",
"t": "Soups and broths   152 HS1001 Wheat and meslin",
"v": 269.0
},
{
"hs": "HS0801",
"t": "Coconuts, Brazil nuts, cashew nuts   93 HS1901 Malt extract",
"v": 207.0
},
{
"hs": "HS2402",
"t": "Cigars, cheroots, cigarillos   55 HS1511 Palm oil and its fractions",
"v": 134.0
},
{
"hs": "HS1006",
"t": "Rice   43 HS1005 Maize (corn)",
"v": 124.0
},
{
"hs": "HS7108",
"t": "Gold   973 HS2710 Petroleum oils, other than crude",
"v": 1650.0
},
{
"hs": "HS2710",
"t": "Petroleum oils, other than crude   773 HS2709 Petroleum oils, crude",
"v": 513.0
},
{
"hs": "HS2809",
"t": "Diphosphorus pentaoxide   479 HS3004 Medicaments in measured doses",
"v": 308.0
},
{
"hs": "HS0303",
"t": "Fish, frozen, excluding fish fillet   299 HS8703 Motor cars for transport of persons",
"v": 204.0
},
{
"hs": "HS2614",
"t": "Titanium ores and concentrates   158 HS8525 Radio-telephony transmission tools",
"v": 160.0
}
]
},
"Serbia": {
"aus": 29058.0,
"bip": 70909.0,
"bipJahr": 2022,
"ein": 41148.0,
"name": "Serbia",
"pAus": [
{
"l": "European Union",
"p": 64.1
},
{
"l": "Bosnia and Herz.",
"p": 7.5
},
{
"l": "Russia",
"p": 4.1
},
{
"l": "Montenegro",
"p": 4.0
},
{
"l": "China",
"p": 4.0
}
],
"pEin": [
{
"l": "European Union",
"p": 54.9
},
{
"l": "China",
"p": 12.1
},
{
"l": "Russia",
"p": 7.5
},
{
"l": "Turkey",
"p": 5.2
},
{
"l": "Bosnia and Herz.",
"p": 3.1
}
],
"pJahr": 2022,
"restAus": 16.3,
"restEin": 17.2,
"seite": 316,
"wAus": {
"agrar": 20.3,
"energie": 11.6,
"industrie": 66.5,
"sonst": 1.6
},
"wEin": {
"agrar": 9.5,
"energie": 14.5,
"industrie": 64.6,
"sonst": 11.5
},
"wJahr": 2021,
"waren": [
{
"hs": "HS0811",
"t": "Fruit and nuts, uncooked or cooked   615 HS2106 Other food preparations",
"v": 159.0
},
{
"hs": "HS1005",
"t": "Maize (corn)   432 HS1905 Bread, pastry,  other bakers' wares",
"v": 128.0
},
{
"hs": "HS1001",
"t": "Wheat and meslin   260 HS2403 Other manufactured tobacco",
"v": 124.0
},
{
"hs": "HS2202",
"t": "Waters containing added sugar   255 HS1806 Chocolate and other cocoa food",
"v": 124.0
},
{
"hs": "HS2309",
"t": "Preparations of a kind used in animal feeding   253 HS0901 Coffee",
"v": 120.0
},
{
"hs": "HS8544",
"t": "Insulated electric conductors  1 880 HS2709 Petroleum oils, crude",
"v": 2280.0
},
{
"hs": "HS2603",
"t": "Copper ores and concentrates  1 768 HS2711 Petroleum gases",
"v": 1824.0
},
{
"hs": "HS4011",
"t": "New pneumatic tyres, of rubber   910 HS2716 Electrical energy",
"v": 1673.0
},
{
"hs": "HS2716",
"t": "Electrical energy   891 HS3004 Medicaments in measured doses",
"v": 1282.0
},
{
"hs": "HS8501",
"t": "Electric motors and generators   766 HS2710 Petroleum oils, other than crude",
"v": 797.0
}
]
},
"Seychelles": {
"aus": 537.0,
"bip": 1926.0,
"bipJahr": 2022,
"ein": 1364.0,
"name": "Seychelles",
"pAus": [
{
"l": "Gibraltar",
"p": 33.0
},
{
"l": "European Union",
"p": 16.4
},
{
"l": "Cayman Is.",
"p": 15.4
},
{
"l": "Bermuda",
"p": 12.0
},
{
"l": "Belize",
"p": 9.1
}
],
"pEin": [
{
"l": "European Union",
"p": 48.0
},
{
"l": "South Africa",
"p": 18.7
},
{
"l": "United Arab Emirates",
"p": 15.8
},
{
"l": "China",
"p": 2.6
},
{
"l": "India",
"p": 2.5
}
],
"pJahr": 2021,
"restAus": 14.1,
"restEin": 12.4,
"seite": 318,
"wAus": {
"agrar": 87.2,
"energie": 2.7,
"industrie": 9.8,
"sonst": 0.3
},
"wEin": {
"agrar": 27.8,
"energie": 4.3,
"industrie": 66.1,
"sonst": 1.7
},
"wJahr": 2021,
"waren": [
{
"hs": "HS0511",
"t": "Other animal products   4 HS2306 Solid residues from other oil",
"v": 92.0
},
{
"hs": "HS0106",
"t": "Other live animals   1 HS1512 Sunflower-seed,or cotton oil",
"v": 9.0
},
{
"hs": "HS2402",
"t": "Cigars, cheroots, cigarillos 0.9 HS0402 Milk and cream, concentrated",
"v": 6.0
},
{
"hs": "HS2208",
"t": "Alcohol of less than 80% volume 0.9 HS0207 Meat and edible offal of poultry",
"v": 6.0
},
{
"hs": "HS0802",
"t": "Other nuts, fresh or dried 0.5 HS1509 Olive oil and its fractions",
"v": 6.0
},
{
"hs": "HS8903",
"t": "Vessels for pleasure or sports  1 412 HS8903 Vessels for pleasure or sports",
"v": 586.0
},
{
"hs": "HS1604",
"t": "Prepared or preserved fish   271 HS2710 Petroleum oils, other than crude",
"v": 190.0
},
{
"hs": "HS2710",
"t": "Petroleum oils, other than crude   108 HS8708 Parts for motor vehicles 8701-8075",
"v": 149.0
},
{
"hs": "HS0303",
"t": "Fish, frozen, excluding fish fillet   99 HS0303 Fish, frozen, excluding fish fillet",
"v": 123.0
},
{
"hs": "HS1605",
"t": "Crustaceans, molluscs   5 HS7210 Flat-rolled products of iron +600",
"v": 43.0
}
]
},
"Sierra Leone": {
"aus": 1124.0,
"bip": 3939.0,
"bipJahr": 2022,
"ein": 1966.0,
"name": "Sierra Leone",
"pAus": [
{
"l": "European Union",
"p": 29.0
},
{
"l": "China",
"p": 18.3
},
{
"l": "South Korea",
"p": 14.0
},
{
"l": "Somalia",
"p": 10.8
},
{
"l": "Ghana",
"p": 8.0
}
],
"pEin": [
{
"l": "China",
"p": 20.1
},
{
"l": "European Union",
"p": 18.5
},
{
"l": "United Arab Emirates",
"p": 8.4
},
{
"l": "India",
"p": 7.2
},
{
"l": "United States of America",
"p": 5.4
}
],
"pJahr": 2018,
"restAus": 20.0,
"restEin": 40.4,
"seite": 320,
"wAus": {
"agrar": 28.9,
"energie": 59.2,
"industrie": 11.6,
"sonst": 0.2
},
"wEin": {
"agrar": 26.4,
"energie": 6.9,
"industrie": 65.1,
"sonst": 1.7
},
"wJahr": 2021,
"waren": [
{
"hs": "HS1801",
"t": "Cocoa beans, whole or broken   21 HS1006 Rice",
"v": 153.0
},
{
"hs": "HS1511",
"t": "Palm oil and its fractions   9 HS1101 Wheat or meslin flour",
"v": 21.0
},
{
"hs": "HS2005",
"t": "Other vegetables not frozen   5 HS1701 Cane or beet sugar",
"v": 14.0
},
{
"hs": "HS1207",
"t": "Other oil seeds, oleaginous fruits   4 HS2103 Sauces and preparations therefor",
"v": 13.0
},
{
"hs": "HS1802",
"t": "Cocoa shells, husks, other waste   2 HS0207 Meat and edible offal of poultry",
"v": 13.0
},
{
"hs": "HS0307",
"t": "Molluscs whether in shell or not   27 HS8703 Motor cars for transport of persons",
"v": 45.0
},
{
"hs": "HS4407",
"t": "Wood sawn or chipped lengthwise   19 HS2523 Portland cement, aluminous cement",
"v": 41.0
},
{
"hs": "HS8704",
"t": "Motor vehicles for goods transport   18 HS7308 Structures of iron and steel",
"v": 26.0
},
{
"hs": "HS0303",
"t": "Fish, frozen, excluding fish fillet   14 HS3004 Medicaments in measured doses",
"v": 21.0
},
{
"hs": "HS2620",
"t": "Ash and residues   14 HS8429 Self-propelled bulldozers",
"v": 21.0
}
]
},
"Singapore": {
"aus": 515802.0,
"bip": 466789.0,
"bipJahr": 2022,
"ein": 475578.0,
"name": "Singapore",
"pAus": [
{
"l": "China",
"p": 12.4
},
{
"l": "Hong Kong",
"p": 11.2
},
{
"l": "Malaysia",
"p": 10.0
},
{
"l": "United States of America",
"p": 8.8
},
{
"l": "European Union",
"p": 7.7
}
],
"pEin": [
{
"l": "China",
"p": 13.2
},
{
"l": "Malaysia",
"p": 12.5
},
{
"l": "Taiwan",
"p": 12.1
},
{
"l": "United States of America",
"p": 10.8
},
{
"l": "European Union",
"p": 9.0
}
],
"pJahr": 2022,
"restAus": 49.8,
"restEin": 42.3,
"seite": 322,
"wAus": {
"agrar": 3.5,
"energie": 11.2,
"industrie": 76.5,
"sonst": 8.7
},
"wEin": {
"agrar": 4.2,
"energie": 19.9,
"industrie": 71.3,
"sonst": 4.7
},
"wJahr": 2021,
"waren": [
{
"hs": "HS2106",
"t": "Other food preparations  6 859 HS2208 Alcohol of less than 80% volume",
"v": 1915.0
},
{
"hs": "HS2208",
"t": "Alcohol of less than 80% volume  2 001 HS1518 Animal or vegetable fats and oils",
"v": 1378.0
},
{
"hs": "HS1901",
"t": "Malt extract   910 HS2204 Wine of fresh grapes",
"v": 851.0
},
{
"hs": "HS2204",
"t": "Wine of fresh grapes   573 HS2106 Other food preparations",
"v": 798.0
},
{
"hs": "HS1806",
"t": "Chocolate and other cocoa food   560 HS1502 Fats of bovine animals, sheep or goat",
"v": 754.0
},
{
"hs": "HS8542",
"t": "Electronic integrated circuits  122 090 HS8542 Electronic integrated circuits",
"v": 108066.0
},
{
"hs": "HS2710",
"t": "Petroleum oils, other than crude  63 470 HS2710 Petroleum oils, other than crude",
"v": 62489.0
},
{
"hs": "HS8479",
"t": "Machines with individual functions  25 170 HS2709 Petroleum oils, crude",
"v": 34015.0
},
{
"hs": "HS7108",
"t": "Gold  15 524 HS8411 Turbo-jets, turbo-propellers and ot",
"v": 17739.0
},
{
"hs": "HS8411",
"t": "Turbo-jets, turbo-propellers and ot  15 294 HS7108 Gold",
"v": 17719.0
}
]
},
"Sint Maarten": {
"aus": 208.0,
"ein": 1083.0,
"name": "Sint Maarten",
"seite": 324,
"waren": []
},
"Slovakia": {
"aus": 107771.0,
"bip": 113529.0,
"bipJahr": 2022,
"ein": 112471.0,
"name": "Slovak Republic",
"pAus": [
{
"l": "European Union",
"p": 79.9
},
{
"l": "United Kingdom",
"p": 3.9
},
{
"l": "United States of America",
"p": 3.4
},
{
"l": "China",
"p": 2.5
},
{
"l": "Ukraine",
"p": 1.4
}
],
"pEin": [
{
"l": "European Union",
"p": 50.9
},
{
"l": "China",
"p": 7.5
},
{
"l": "Russia",
"p": 7.5
},
{
"l": "South Korea",
"p": 5.7
},
{
"l": "Vietnam",
"p": 3.9
}
],
"pJahr": 2022,
"restAus": 8.9,
"restEin": 24.5,
"seite": 326,
"wAus": {
"agrar": 5.0,
"energie": 5.6,
"industrie": 89.3,
"sonst": 0.0
},
"wEin": {
"agrar": 7.3,
"energie": 10.8,
"industrie": 81.9,
"sonst": 0.0
},
"wJahr": 2021,
"waren": [
{
"hs": "HS1001",
"t": "Wheat and meslin   406 HS0406 Cheese and curd",
"v": 512.0
},
{
"hs": "HS1005",
"t": "Maize (corn)   363 HS0203 Swine meat, fresh, chilled, frozen",
"v": 395.0
},
{
"hs": "HS1806",
"t": "Chocolate and other cocoa food   314 HS2106 Other food preparations",
"v": 359.0
},
{
"hs": "HS2106",
"t": "Other food preparations   283 HS1905 Bread, pastry,  other bakers' wares",
"v": 357.0
},
{
"hs": "HS1205",
"t": "Rape or colza seeds   220 HS1806 Chocolate and other cocoa food",
"v": 344.0
},
{
"hs": "HS8703",
"t": "Motor cars for transport of persons  26 340 HS8708 Parts for motor vehicles 8701-8075",
"v": 12614.0
},
{
"hs": "HS8708",
"t": "Parts for motor vehicles 8701-8075  5 434 HS2711 Petroleum gases",
"v": 6504.0
},
{
"hs": "HS8528",
"t": "Reception apparatus for television  4 353 HS8525 Radio-telephony transmission tools",
"v": 6135.0
},
{
"hs": "HS8525",
"t": "Radio-telephony transmission tools  3 649 HS2716 Electrical energy",
"v": 3419.0
},
{
"hs": "HS2710",
"t": "Petroleum oils, other than crude  2 693 HS8703 Motor cars for transport of persons",
"v": 2951.0
}
]
},
"Slovenia": {
"aus": 69701.0,
"bip": 62167.0,
"bipJahr": 2022,
"ein": 69738.0,
"name": "Slovenia",
"pAus": [
{
"l": "European Union",
"p": 61.0
},
{
"l": "Switzerland",
"p": 21.0
},
{
"l": "Serbia",
"p": 2.8
},
{
"l": "Russia",
"p": 2.2
},
{
"l": "Bosnia and Herz.",
"p": 1.9
}
],
"pEin": [
{
"l": "European Union",
"p": 50.7
},
{
"l": "Switzerland",
"p": 15.3
},
{
"l": "China",
"p": 11.9
},
{
"l": "Russia",
"p": 2.4
},
{
"l": "Saudi Arabia",
"p": 2.1
}
],
"pJahr": 2022,
"restAus": 11.2,
"restEin": 17.5,
"seite": 328,
"wAus": {
"agrar": 7.2,
"energie": 9.0,
"industrie": 83.7,
"sonst": 0.0
},
"wEin": {
"agrar": 8.6,
"energie": 13.0,
"industrie": 78.1,
"sonst": 0.3
},
"wJahr": 2021,
"waren": [
{
"hs": "HS2106",
"t": "Other food preparations   235 HS2106 Other food preparations",
"v": 190.0
},
{
"hs": "HS0401",
"t": "Milk and cream, not concentrated   167 HS1905 Bread, pastry,  other bakers' wares",
"v": 155.0
},
{
"hs": "HS1602",
"t": "Other prepared or preserved meat   94 HS0406 Cheese and curd",
"v": 146.0
},
{
"hs": "HS2105",
"t": "Ice cream and other edible ice   93 HS1806 Chocolate and other cocoa food",
"v": 139.0
},
{
"hs": "HS0102",
"t": "Live bovine animals   92 HS2304 Solid residues from soya-bean oil",
"v": 121.0
},
{
"hs": "HS3004",
"t": "Medicaments in measured doses  13 857 HS3004 Medicaments in measured doses",
"v": 7792.0
},
{
"hs": "HS2710",
"t": "Petroleum oils, other than crude  2 631 HS2710 Petroleum oils, other than crude",
"v": 4934.0
},
{
"hs": "HS8703",
"t": "Motor cars for transport of persons  2 512 HS2933 Heterocyclic compounds nitrogen",
"v": 4750.0
},
{
"hs": "HS2716",
"t": "Electrical energy  1 627 HS8703 Motor cars for transport of persons",
"v": 2108.0
},
{
"hs": "HS3002",
"t": "Human and animal blood  1 315 HS2716 Electrical energy",
"v": 2059.0
}
]
},
"Solomon Is.": {
"aus": 335.0,
"bip": 1596.0,
"bipJahr": 2022,
"ein": 648.0,
"name": "Solomon Islands",
"pAus": [
{
"l": "China",
"p": 66.8
},
{
"l": "European Union",
"p": 9.5
},
{
"l": "India",
"p": 5.1
},
{
"l": "Switzerland",
"p": 2.4
},
{
"l": "Thailand",
"p": 2.1
}
],
"pEin": [
{
"l": "Australia",
"p": 18.2
},
{
"l": "Singapore",
"p": 16.3
},
{
"l": "China",
"p": 14.9
},
{
"l": "Malaysia",
"p": 12.9
},
{
"l": "Taiwan",
"p": 7.2
}
],
"pJahr": 2018,
"restAus": 14.0,
"restEin": 30.5,
"seite": 330,
"wAus": {
"agrar": 94.4,
"energie": 0.3,
"industrie": 2.6,
"sonst": 2.6
},
"wEin": {
"agrar": 19.2,
"energie": 20.3,
"industrie": 57.7,
"sonst": 2.8
},
"wJahr": 2021,
"waren": [
{
"hs": "HS1511",
"t": "Palm oil and its fractions   23 HS1006 Rice",
"v": 42.0
},
{
"hs": "HS1513",
"t": "Coconut (copra), or palm kernel oil   10 HS0207 Meat and edible offal of poultry",
"v": 13.0
},
{
"hs": "HS1801",
"t": "Cocoa beans, whole or broken   9 HS1905 Bread, pastry,  other bakers' wares",
"v": 7.0
},
{
"hs": "HS1203",
"t": "Copra   7 HS1902 Pasta",
"v": 7.0
},
{
"hs": "HS2309",
"t": "Preparations of a kind used in animal feeding   2 HS1701 Cane or beet sugar",
"v": 6.0
},
{
"hs": "HS4403",
"t": "Wood in the rough   407 HS2710 Petroleum oils, other than crude",
"v": 94.0
},
{
"hs": "HS1604",
"t": "Prepared or preserved fish   41 HS8902 Vessels to process fishery products",
"v": 37.0
},
{
"hs": "HS2606",
"t": "Aluminium ores and concentrates   21 HS8429 Self-propelled bulldozers",
"v": 33.0
},
{
"hs": "HS0303",
"t": "Fish, frozen, excluding fish fillet   13 HS8703 Motor cars for transport of persons",
"v": 16.0
},
{
"hs": "HS0305",
"t": "Fish, dried, salted or in brine   9 HS8704 Motor vehicles for goods transport",
"v": 12.0
}
]
},
"South Africa": {
"aus": 122901.0,
"bip": 405705.0,
"bipJahr": 2022,
"ein": 136208.0,
"name": "South Africa",
"pAus": [
{
"l": "European Union",
"p": 21.0
},
{
"l": "China",
"p": 9.6
},
{
"l": "United States of America",
"p": 8.8
},
{
"l": "Japan",
"p": 7.0
},
{
"l": "United Kingdom",
"p": 5.2
}
],
"pEin": [
{
"l": "European Union",
"p": 21.8
},
{
"l": "China",
"p": 20.1
},
{
"l": "India",
"p": 7.4
},
{
"l": "United States of America",
"p": 7.3
},
{
"l": "Saudi Arabia",
"p": 4.0
}
],
"pJahr": 2022,
"restAus": 48.4,
"restEin": 39.3,
"seite": 332,
"wAus": {
"agrar": 11.5,
"energie": 45.6,
"industrie": 35.7,
"sonst": 7.1
},
"wEin": {
"agrar": 8.2,
"energie": 19.5,
"industrie": 63.7,
"sonst": 8.6
},
"wJahr": 2021,
"waren": [
{
"hs": "HS0805",
"t": "Citrus fruit, fresh or dried  1 721 HS1511 Palm oil and its fractions",
"v": 657.0
},
{
"hs": "HS1005",
"t": "Maize (corn)  1 214 HS1001 Wheat and meslin",
"v": 632.0
},
{
"hs": "HS0806",
"t": "Grapes, fresh or dried   872 HS1006 Rice",
"v": 478.0
},
{
"hs": "HS0808",
"t": "Apples, pears and quinces, fresh   717 HS2208 Alcohol of less than 80% volume",
"v": 357.0
},
{
"hs": "HS2204",
"t": "Wine of fresh grapes   695 HS1512 Sunflower-seed,or cotton oil",
"v": 279.0
},
{
"hs": "HS7110",
"t": "Platinum  16 690 HS2710 Petroleum oils, other than crude",
"v": 18730.0
},
{
"hs": "HS2701",
"t": "Coal; briquettes, ovoids  13 383 HS8703 Motor cars for transport of persons",
"v": 4500.0
},
{
"hs": "HS2601",
"t": "Iron ores and concentrates  6 500 HS2709 Petroleum oils, crude",
"v": 4398.0
},
{
"hs": "HS8703",
"t": "Motor cars for transport of persons  5 765 HS8525 Radio-telephony transmission tools",
"v": 3409.0
},
{
"hs": "HS7108",
"t": "Gold  5 265 HS8471 Automatic data-processing machines",
"v": 2342.0
}
]
},
"South Korea": {
"aus": 683585.0,
"bip": 1665246.0,
"bipJahr": 2022,
"ein": 731370.0,
"name": "Korea, Republic of",
"pAus": [
{
"l": "China",
"p": 22.8
},
{
"l": "United States of America",
"p": 16.1
},
{
"l": "European Union",
"p": 10.0
},
{
"l": "Vietnam",
"p": 8.9
},
{
"l": "Japan",
"p": 4.5
}
],
"pEin": [
{
"l": "China",
"p": 21.1
},
{
"l": "United States of America",
"p": 11.2
},
{
"l": "European Union",
"p": 9.3
},
{
"l": "Japan",
"p": 7.5
},
{
"l": "Australia",
"p": 6.1
}
],
"pJahr": 2022,
"restAus": 37.7,
"restEin": 44.7,
"seite": 196,
"wAus": {
"agrar": 2.5,
"energie": 9.4,
"industrie": 87.9,
"sonst": 0.3
},
"wEin": {
"agrar": 7.3,
"energie": 30.9,
"industrie": 61.3,
"sonst": 0.5
},
"wJahr": 2021,
"waren": [
{
"hs": "HS1902",
"t": "Pasta   978 HS1005 Maize (corn)",
"v": 4274.0
},
{
"hs": "HS2106",
"t": "Other food preparations   744 HS0202 Meat of bovine animals, frozen",
"v": 2866.0
},
{
"hs": "HS2402",
"t": "Cigars, cheroots, cigarillos   631 HS2106 Other food preparations",
"v": 2353.0
},
{
"hs": "HS2202",
"t": "Waters containing added sugar   630 HS0203 Swine meat, fresh, chilled, frozen",
"v": 2034.0
},
{
"hs": "HS2008",
"t": "Plants' parts otherwise preserved   568 HS1001 Wheat and meslin",
"v": 1787.0
},
{
"hs": "HS8542",
"t": "Electronic integrated circuits  112 952 HS2709 Petroleum oils, crude",
"v": 105964.0
},
{
"hs": "HS2710",
"t": "Petroleum oils, other than crude  61 560 HS8542 Electronic integrated circuits",
"v": 62561.0
},
{
"hs": "HS8703",
"t": "Motor cars for transport of persons  51 680 HS2711 Petroleum gases",
"v": 56749.0
},
{
"hs": "HS8525",
"t": "Radio-telephony transmission tools  27 671 HS2701 Coal; briquettes, ovoids",
"v": 28154.0
},
{
"hs": "HS8708",
"t": "Parts for motor vehicles 8701-8075  19 922 HS2710 Petroleum oils, other than crude",
"v": 26325.0
}
]
},
"Spain": {
"aus": 418364.0,
"bip": 1400520.0,
"bipJahr": 2022,
"ein": 493354.0,
"name": "Spain",
"pAus": [
{
"l": "European Union",
"p": 59.3
},
{
"l": "United Kingdom",
"p": 5.2
},
{
"l": "United States of America",
"p": 4.7
},
{
"l": "Morocco",
"p": 2.9
},
{
"l": "China",
"p": 2.0
}
],
"pEin": [
{
"l": "European Union",
"p": 42.2
},
{
"l": "China",
"p": 10.5
},
{
"l": "United States of America",
"p": 7.1
},
{
"l": "United Kingdom",
"p": 2.4
},
{
"l": "Turkey",
"p": 2.1
}
],
"pJahr": 2022,
"restAus": 26.0,
"restEin": 35.8,
"seite": 336,
"wAus": {
"agrar": 19.4,
"energie": 10.5,
"industrie": 67.3,
"sonst": 2.8
},
"wEin": {
"agrar": 12.8,
"energie": 17.3,
"industrie": 68.3,
"sonst": 1.6
},
"wJahr": 2021,
"waren": [
{
"hs": "HS0203",
"t": "Swine meat, fresh, chilled, frozen  5 923 HS1005 Maize (corn)",
"v": 3676.0
},
{
"hs": "HS1509",
"t": "Olive oil and its fractions  4 236 HS1201 Soya beans, whether or not broken",
"v": 2058.0
},
{
"hs": "HS0805",
"t": "Citrus fruit, fresh or dried  3 686 HS1001 Wheat and meslin",
"v": 1831.0
},
{
"hs": "HS2204",
"t": "Wine of fresh grapes  3 180 HS0406 Cheese and curd",
"v": 1721.0
},
{
"hs": "HS0709",
"t": "Other vegetables, fresh or chilled  2 662 HS2304 Solid residues from soya-bean oil",
"v": 1514.0
},
{
"hs": "HS8703",
"t": "Motor cars for transport of persons  32 901 HS2709 Petroleum oils, crude",
"v": 47749.0
},
{
"hs": "HS2710",
"t": "Petroleum oils, other than crude  23 944 HS2711 Petroleum gases",
"v": 27576.0
},
{
"hs": "HS3002",
"t": "Human and animal blood  15 654 HS8703 Motor cars for transport of persons",
"v": 17406.0
},
{
"hs": "HS3004",
"t": "Medicaments in measured doses  10 919 HS8708 Parts for motor vehicles 8701-8075",
"v": 16073.0
},
{
"hs": "HS8708",
"t": "Parts for motor vehicles 8701-8075  10 185 HS3004 Medicaments in measured doses",
"v": 13688.0
}
]
},
"Sri Lanka": {
"aus": 13107.0,
"bip": 75296.0,
"bipJahr": 2022,
"ein": 18291.0,
"name": "Sri Lanka",
"pAus": [
{
"l": "United States of America",
"p": 25.5
},
{
"l": "European Union",
"p": 23.6
},
{
"l": "United Kingdom",
"p": 7.4
},
{
"l": "India",
"p": 6.7
},
{
"l": "United Arab Emirates",
"p": 2.8
}
],
"pEin": [
{
"l": "India",
"p": 26.4
},
{
"l": "China",
"p": 20.0
},
{
"l": "European Union",
"p": 7.5
},
{
"l": "United Arab Emirates",
"p": 5.5
},
{
"l": "Malaysia",
"p": 5.2
}
],
"pJahr": 2022,
"restAus": 33.9,
"restEin": 35.5,
"seite": 338,
"wAus": {
"agrar": 28.2,
"energie": 2.6,
"industrie": 68.2,
"sonst": 1.1
},
"wEin": {
"agrar": 15.3,
"energie": 17.2,
"industrie": 65.0,
"sonst": 2.4
},
"wJahr": 2021,
"waren": [
{
"hs": "HS0902",
"t": "Tea  1 306 HS1006 Rice",
"v": 283.0
},
{
"hs": "HS0906",
"t": "Cinnamon and cinnamon-tree flowers   232 HS1701 Cane or beet sugar",
"v": 252.0
},
{
"hs": "HS2008",
"t": "Plants' parts otherwise preserved   200 HS1001 Wheat and meslin",
"v": 232.0
},
{
"hs": "HS2309",
"t": "Preparations of a kind used in animal feeding   120 HS0402 Milk and cream, concentrated",
"v": 206.0
},
{
"hs": "HS0801",
"t": "Coconuts, Brazil nuts, cashew nuts   114 HS0713 Dried leguminous vegetables",
"v": 170.0
},
{
"hs": "HS6108",
"t": "Women's or girls' slips, petticoats   707 HS2710 Petroleum oils, other than crude",
"v": 2991.0
},
{
"hs": "HS6212",
"t": "Brassières, girdles, corsets   655 HS6006 Other knitted or crocheted fabrics",
"v": 581.0
},
{
"hs": "HS6109",
"t": "T-shirts, singlets and other vests   649 HS6004 Knitted fabrics over 30",
"v": 422.0
},
{
"hs": "HS6204",
"t": "Women's or girls' suits   534 HS2709 Petroleum oils, crude",
"v": 389.0
},
{
"hs": "HS6104",
"t": "Women's or girls' suits, ensembles   503 HS3004 Medicaments in measured doses",
"v": 363.0
}
]
},
"St. Kitts and Nevis": {
"aus": 29.0,
"bip": 973.0,
"bipJahr": 2022,
"ein": 326.0,
"name": "Saint Kitts and Nevis",
"pAus": [
{
"l": "United States of America",
"p": 68.7
},
{
"l": "Saint Lucia",
"p": 6.8
},
{
"l": "Trinidad and Tobago",
"p": 6.5
},
{
"l": "Antigua and Barb.",
"p": 2.8
},
{
"l": "Dominica",
"p": 2.1
}
],
"pEin": [
{
"l": "United States of America",
"p": 67.0
},
{
"l": "Trinidad and Tobago",
"p": 4.4
},
{
"l": "European Union",
"p": 3.5
},
{
"l": "Canada",
"p": 2.7
},
{
"l": "Japan",
"p": 2.7
}
],
"pJahr": 2017,
"restAus": 13.1,
"restEin": 19.7,
"seite": 302,
"wAus": {
"agrar": 31.2,
"energie": 0.8,
"industrie": 66.8,
"sonst": 1.2
},
"wEin": {
"agrar": 31.0,
"energie": 2.5,
"industrie": 58.8,
"sonst": 7.8
},
"wJahr": 2021,
"waren": [
{
"hs": "HS2203",
"t": "Beer made from malt   1 HS0207 Meat and edible offal of poultry",
"v": 6.0
},
{
"hs": "HS2009",
"t": "Fruit juices and vegetable juices 0.7 HS2106 Other food preparations",
"v": 5.0
},
{
"hs": "HS2208",
"t": "Alcohol of less than 80% volume 0.6 HS2202 Waters containing added sugar",
"v": 5.0
},
{
"hs": "HS2202",
"t": "Waters containing added sugar 0.3 HS2309 Preparations of a kind used in animal feeding",
"v": 3.0
},
{
"hs": "HS2402",
"t": "Cigars, cheroots, cigarillos 0.2 HS0406 Cheese and curd",
"v": 3.0
},
{
"hs": "HS8536",
"t": "Electrical circuits protector   8 HS8703 Motor cars for transport of persons",
"v": 15.0
},
{
"hs": "HS8525",
"t": "Radio-telephony transmission tools   6 HS7113 Articles and parts of jewellery",
"v": 10.0
},
{
"hs": "HS4907",
"t": "Other documents of title   4 HS9403 Other furniture and parts thereof",
"v": 9.0
},
{
"hs": "HS8529",
"t": "Parts for 8525-8528   3 HS2523 Portland cement, aluminous cement",
"v": 4.0
},
{
"hs": "HS7113",
"t": "Articles and parts of jewellery   2 HS7117 Imitation jewellery",
"v": 4.0
}
]
},
"St. Vin. and Gren.": {
"aus": 46.0,
"bip": 947.0,
"bipJahr": 2022,
"ein": 438.0,
"name": "Saint Vincent and the Grenadines",
"pAus": [
{
"l": "Barbados",
"p": 16.5
},
{
"l": "Saint Lucia",
"p": 16.3
},
{
"l": "United States of America",
"p": 14.6
},
{
"l": "Dominica",
"p": 10.4
},
{
"l": "Antigua and Barb.",
"p": 9.9
}
],
"pEin": [
{
"l": "United States of America",
"p": 46.8
},
{
"l": "Trinidad and Tobago",
"p": 9.4
},
{
"l": "European Union",
"p": 9.2
},
{
"l": "China",
"p": 6.6
},
{
"l": "United Kingdom",
"p": 6.5
}
],
"pJahr": 2021,
"restAus": 32.3,
"restEin": 21.6,
"seite": 306,
"wAus": {
"agrar": 74.0,
"energie": 0.3,
"industrie": 25.4,
"sonst": 0.2
},
"wEin": {
"agrar": 30.1,
"energie": 12.9,
"industrie": 56.9,
"sonst": 0.0
},
"wJahr": 2021,
"waren": [
{
"hs": "HS1101",
"t": "Wheat or meslin flour   9 HS0207 Meat and edible offal of poultry",
"v": 13.0
},
{
"hs": "HS2309",
"t": "Preparations of a kind used in animal feeding   5 HS2106 Other food preparations",
"v": 11.0
},
{
"hs": "HS0714",
"t": "Manioc, arrowroot, salep   2 HS1001 Wheat and meslin",
"v": 9.0
},
{
"hs": "HS2203",
"t": "Beer made from malt   1 HS2202 Waters containing added sugar",
"v": 4.0
},
{
"hs": "HS2202",
"t": "Waters containing added sugar 0.8 HS1905 Bread, pastry,  other bakers' wares",
"v": 4.0
},
{
"hs": "HS0306",
"t": "Crustaceans whether in shell or not   3 HS2710 Petroleum oils, other than crude",
"v": 41.0
},
{
"hs": "HS7610",
"t": "Aluminium structures   2 HS8703 Motor cars for transport of persons",
"v": 7.0
},
{
"hs": "HS0302",
"t": "Fish, fresh, chilled   1 HS3004 Medicaments in measured doses",
"v": 6.0
},
{
"hs": "HS7210",
"t": "Flat-rolled products of iron +600   1 HS2523 Portland cement, aluminous cement",
"v": 6.0
},
{
"hs": "HS4819",
"t": "Cartons, boxes, cases, bags 0.7 HS8471 Automatic data-processing machines",
"v": 5.0
}
]
},
"Sudan": {
"aus": 4357.0,
"bip": 49423.0,
"bipJahr": 2022,
"ein": 11095.0,
"name": "Sudan",
"pAus": [
{
"l": "United Arab Emirates",
"p": 27.5
},
{
"l": "China",
"p": 20.3
},
{
"l": "Saudi Arabia",
"p": 16.3
},
{
"l": "Egypt",
"p": 16.0
},
{
"l": "India",
"p": 2.7
}
],
"pEin": [
{
"l": "China",
"p": 17.4
},
{
"l": "Russia",
"p": 15.1
},
{
"l": "Saudi Arabia",
"p": 10.2
},
{
"l": "India",
"p": 8.3
},
{
"l": "European Union",
"p": 8.1
}
],
"pJahr": 2018,
"restAus": 17.2,
"restEin": 40.8,
"seite": 340,
"wAus": {
"agrar": 48.8,
"energie": 5.7,
"industrie": 8.9,
"sonst": 36.6
},
"wEin": {
"agrar": 44.5,
"energie": 8.5,
"industrie": 34.4,
"sonst": 12.6
},
"wJahr": 2021,
"waren": [
{
"hs": "HS1207",
"t": "Other oil seeds, oleaginous fruits   681 HS1001 Wheat and meslin",
"v": 1692.0
},
{
"hs": "HS0104",
"t": "Live sheep and goats   483 HS1701 Cane or beet sugar",
"v": 623.0
},
{
"hs": "HS0106",
"t": "Other live animals   217 HS0713 Dried leguminous vegetables",
"v": 119.0
},
{
"hs": "HS5201",
"t": "Cotton, not carded or combed   156 HS0402 Milk and cream, concentrated",
"v": 72.0
},
{
"hs": "HS1301",
"t": "Lac; natural gums, resins   115 HS0901 Coffee",
"v": 63.0
},
{
"hs": "HS7108",
"t": "Gold   911 HS2710 Petroleum oils, other than crude",
"v": 1204.0
},
{
"hs": "HS2709",
"t": "Petroleum oils, crude   430 HS8703 Motor cars for transport of persons",
"v": 341.0
},
{
"hs": "HS2710",
"t": "Petroleum oils, other than crude   78 HS8704 Motor vehicles for goods transport",
"v": 319.0
},
{
"hs": "HS8606",
"t": "Railway/tramway goods vans   34 HS8701 Tractors other than 8709",
"v": 241.0
},
{
"hs": "HS8703",
"t": "Motor cars for transport of persons   13 HS3003 Medicaments not in measured doses",
"v": 180.0
}
]
},
"Suriname": {
"aus": 2579.0,
"bip": 3521.0,
"bipJahr": 2022,
"ein": 1803.0,
"name": "Suriname",
"pAus": [
{
"l": "Switzerland",
"p": 44.6
},
{
"l": "United Arab Emirates",
"p": 23.2
},
{
"l": "European Union",
"p": 7.8
},
{
"l": "Trinidad and Tobago",
"p": 4.9
},
{
"l": "Guyana",
"p": 4.4
}
],
"pEin": [
{
"l": "United States of America",
"p": 24.4
},
{
"l": "European Union",
"p": 20.6
},
{
"l": "Trinidad and Tobago",
"p": 13.9
},
{
"l": "China",
"p": 9.6
},
{
"l": "Antigua and Barb.",
"p": 3.4
}
],
"pJahr": 2022,
"restAus": 15.1,
"restEin": 28.2,
"seite": 342,
"wAus": {
"agrar": 14.9,
"energie": 6.0,
"industrie": 7.8,
"sonst": 71.3
},
"wEin": {
"agrar": 16.2,
"energie": 10.5,
"industrie": 73.0,
"sonst": 0.4
},
"wJahr": 2021,
"waren": [
{
"hs": "HS2402",
"t": "Cigars, cheroots, cigarillos   39 HS2202 Waters containing added sugar",
"v": 35.0
},
{
"hs": "HS1006",
"t": "Rice   25 HS0207 Meat and edible offal of poultry",
"v": 18.0
},
{
"hs": "HS2208",
"t": "Alcohol of less than 80% volume   19 HS1701 Cane or beet sugar",
"v": 16.0
},
{
"hs": "HS1517",
"t": "Margarine; edible mixtures oil   3 HS1512 Sunflower-seed,or cotton oil",
"v": 11.0
},
{
"hs": "HS2203",
"t": "Beer made from malt   3 HS1507 Soya-bean oil and its fractions",
"v": 10.0
},
{
"hs": "HS7108",
"t": "Gold  1 879 HS8431 Parts for machinery of 8425 to 8430",
"v": 144.0
},
{
"hs": "HS2710",
"t": "Petroleum oils, other than crude   196 HS2710 Petroleum oils, other than crude",
"v": 138.0
},
{
"hs": "HS8431",
"t": "Parts for machinery of 8425 to 8430   119 HS8704 Motor vehicles for goods transport",
"v": 47.0
},
{
"hs": "HS4403",
"t": "Wood in the rough   77 HS8703 Motor cars for transport of persons",
"v": 41.0
},
{
"hs": "HS8609",
"t": "Containers designed for transport   14 HS8429 Self-propelled bulldozers",
"v": 37.0
}
]
},
"Sweden": {
"aus": 197841.0,
"bip": 585939.0,
"bipJahr": 2022,
"ein": 202162.0,
"name": "Sweden",
"pAus": [
{
"l": "European Union",
"p": 52.8
},
{
"l": "Norway",
"p": 10.7
},
{
"l": "United States of America",
"p": 8.9
},
{
"l": "United Kingdom",
"p": 5.4
},
{
"l": "China",
"p": 3.5
}
],
"pEin": [
{
"l": "European Union",
"p": 63.0
},
{
"l": "Norway",
"p": 11.7
},
{
"l": "China",
"p": 7.0
},
{
"l": "United Kingdom",
"p": 3.7
},
{
"l": "United States of America",
"p": 3.6
}
],
"pJahr": 2022,
"restAus": 18.6,
"restEin": 11.0,
"seite": 344,
"wAus": {
"agrar": 11.2,
"energie": 13.4,
"industrie": 74.1,
"sonst": 1.3
},
"wEin": {
"agrar": 11.3,
"energie": 13.1,
"industrie": 73.4,
"sonst": 2.2
},
"wJahr": 2021,
"waren": [
{
"hs": "HS2106",
"t": "Other food preparations   788 HS2204 Wine of fresh grapes",
"v": 819.0
},
{
"hs": "HS1905",
"t": "Bread, pastry,  other bakers' wares   596 HS0406 Cheese and curd",
"v": 802.0
},
{
"hs": "HS2208",
"t": "Alcohol of less than 80% volume   505 HS0901 Coffee",
"v": 662.0
},
{
"hs": "HS1806",
"t": "Chocolate and other cocoa food   466 HS2106 Other food preparations",
"v": 566.0
},
{
"hs": "HS1517",
"t": "Margarine; edible mixtures oil   397 HS1905 Bread, pastry,  other bakers' wares",
"v": 512.0
},
{
"hs": "HS2710",
"t": "Petroleum oils, other than crude  12 945 HS2709 Petroleum oils, crude",
"v": 14884.0
},
{
"hs": "HS8703",
"t": "Motor cars for transport of persons  12 036 HS8703 Motor cars for transport of persons",
"v": 9735.0
},
{
"hs": "HS3004",
"t": "Medicaments in measured doses  7 766 HS2710 Petroleum oils, other than crude",
"v": 9058.0
},
{
"hs": "HS3002",
"t": "Human and animal blood  5 054 HS8525 Radio-telephony transmission tools",
"v": 6960.0
},
{
"hs": "HS8525",
"t": "Radio-telephony transmission tools  5 002 HS8708 Parts for motor vehicles 8701-8075",
"v": 5780.0
}
]
},
"Switzerland": {
"aus": 401731.0,
"bip": 807234.0,
"bipJahr": 2022,
"ein": 356473.0,
"name": "Switzerland",
"pAus": [
{
"l": "European Union",
"p": 40.9
},
{
"l": "United States of America",
"p": 16.3
},
{
"l": "China",
"p": 11.0
},
{
"l": "India",
"p": 3.7
},
{
"l": "United Kingdom",
"p": 3.3
}
],
"pEin": [
{
"l": "European Union",
"p": 50.0
},
{
"l": "United States of America",
"p": 11.0
},
{
"l": "China",
"p": 6.1
},
{
"l": "United Arab Emirates",
"p": 2.6
},
{
"l": "United Kingdom",
"p": 2.3
}
],
"pJahr": 2022,
"restAus": 24.8,
"restEin": 28.0,
"seite": 346,
"wAus": {
"agrar": 3.0,
"energie": 3.2,
"industrie": 70.4,
"sonst": 23.4
},
"wEin": {
"agrar": 5.0,
"energie": 6.0,
"industrie": 59.5,
"sonst": 29.5
},
"wJahr": 2021,
"waren": [
{
"hs": "HS0901",
"t": "Coffee  3 417 HS2204 Wine of fresh grapes",
"v": 1355.0
},
{
"hs": "HS2202",
"t": "Waters containing added sugar  1 822 HS0901 Coffee",
"v": 1302.0
},
{
"hs": "HS1806",
"t": "Chocolate and other cocoa food   881 HS2106 Other food preparations",
"v": 619.0
},
{
"hs": "HS0406",
"t": "Cheese and curd   739 HS1905 Bread, pastry,  other bakers' wares",
"v": 607.0
},
{
"hs": "HS2106",
"t": "Other food preparations   685 HS0406 Cheese and curd",
"v": 526.0
},
{
"hs": "HS7108",
"t": "Gold  100 228 HS7108 Gold",
"v": 98952.0
},
{
"hs": "HS3002",
"t": "Human and animal blood  50 061 HS3004 Medicaments in measured doses",
"v": 31722.0
},
{
"hs": "HS3004",
"t": "Medicaments in measured doses  46 447 HS3002 Human and animal blood",
"v": 16212.0
},
{
"hs": "HS2933",
"t": "Heterocyclic compounds nitrogen  17 537 HS8703 Motor cars for transport of persons",
"v": 11092.0
},
{
"hs": "HS9102",
"t": "Other wristwatches  15 844 HS7113 Articles and parts of jewellery",
"v": 8961.0
}
]
},
"Syria": {
"aus": 4514.0,
"bip": 60043.0,
"bipJahr": 2010,
"ein": 5846.0,
"name": "Syrian Arab Republic",
"pAus": [
{
"l": "European Union",
"p": 39.4
},
{
"l": "Iraq",
"p": 20.2
},
{
"l": "Turkey",
"p": 5.5
},
{
"l": "Saudi Arabia",
"p": 4.8
},
{
"l": "Lebanon",
"p": 3.8
}
],
"pEin": [
{
"l": "European Union",
"p": 24.5
},
{
"l": "Turkey",
"p": 9.5
},
{
"l": "China",
"p": 8.8
},
{
"l": "Ukraine",
"p": 6.5
},
{
"l": "Russia",
"p": 6.3
}
],
"pJahr": 2010,
"restAus": 26.2,
"restEin": 44.4,
"seite": 348,
"wAus": {
"agrar": 73.6,
"energie": 11.2,
"industrie": 15.0,
"sonst": 0.2
},
"wEin": {
"agrar": 41.7,
"energie": 6.0,
"industrie": 48.7,
"sonst": 3.7
},
"wJahr": 2021,
"waren": [
{
"hs": "HS0104",
"t": "Live sheep and goats   216 HS1701 Cane or beet sugar",
"v": 741.0
},
{
"hs": "HS0702",
"t": "Tomatoes, fresh or chilled   180 HS1005 Maize (corn)",
"v": 421.0
},
{
"hs": "HS1701",
"t": "Cane or beet sugar   133 HS2402 Cigars, cheroots, cigarillos",
"v": 305.0
},
{
"hs": "HS0407",
"t": "Birds' eggs, in shell   132 HS1006 Rice",
"v": 288.0
},
{
"hs": "HS0805",
"t": "Citrus fruit, fresh or dried   127 HS1001 Wheat and meslin",
"v": 243.0
},
{
"hs": "HS2709",
"t": "Petroleum oils, crude  4 326 HS2710 Petroleum oils, other than crude",
"v": 3003.0
},
{
"hs": "HS2710",
"t": "Petroleum oils, other than crude  1 161 HS8703 Motor cars for transport of persons",
"v": 718.0
},
{
"hs": "HS3402",
"t": "Organic surface-active agents   328 HS7207 Iron's semi-finished products",
"v": 552.0
},
{
"hs": "HS2510",
"t": "Natural calcium phosphates   202 HS3901 Polymers of ethylene, primary forms",
"v": 354.0
},
{
"hs": "HS5205",
"t": "Cotton yarn, 85% or more of cotton   191 HS2711 Petroleum gases",
"v": 340.0
}
]
},
"São Tomé and Principe": {
"aus": 22.0,
"bip": 552.0,
"bipJahr": 2022,
"ein": 196.0,
"name": "Sao Tomé and Principe",
"pAus": [
{
"l": "European Union",
"p": 69.7
},
{
"l": "Cameroon",
"p": 3.5
},
{
"l": "Angola",
"p": 3.1
},
{
"l": "United States of America",
"p": 0.6
},
{
"l": "Switzerland",
"p": 0.3
}
],
"pEin": [
{
"l": "European Union",
"p": 51.0
},
{
"l": "Angola",
"p": 16.0
},
{
"l": "Togo",
"p": 15.4
},
{
"l": "China",
"p": 4.3
},
{
"l": "Turkey",
"p": 2.6
}
],
"pJahr": 2022,
"restAus": 22.7,
"restEin": 10.7,
"seite": 310,
"wAus": {
"agrar": 87.5,
"energie": 0.1,
"industrie": 4.6,
"sonst": 7.8
},
"wEin": {
"agrar": 36.5,
"energie": 20.5,
"industrie": 43.1,
"sonst": 0.0
},
"wJahr": 2021,
"waren": [
{
"hs": "HS1511",
"t": "Palm oil and its fractions   8 HS1006 Rice",
"v": 7.0
},
{
"hs": "HS1801",
"t": "Cocoa beans, whole or broken   8 HS1101 Wheat or meslin flour",
"v": 5.0
},
{
"hs": "HS1513",
"t": "Coconut (copra), or palm kernel oil 0.3 HS2204 Wine of fresh grapes",
"v": 5.0
},
{
"hs": "HS1806",
"t": "Chocolate and other cocoa food 0.1 HS2309 Preparations of a kind used in animal feeding",
"v": 3.0
},
{
"hs": "HS0904",
"t": "Pepper of the genus Piper 0.1 HS1507 Soya-bean oil and its fractions",
"v": 3.0
},
{
"hs": "HS2710",
"t": "Petroleum oils, other than crude   5 HS2710 Petroleum oils, other than crude",
"v": 56.0
},
{
"hs": "HS8711",
"t": "Motor-cycles 0.1 HS8502 Electric generating sets",
"v": 7.0
},
{
"hs": "HS7204",
"t": "Ferrous waste and scrap 0.04 HS8703 Motor cars for transport of persons",
"v": 5.0
},
{
"hs": "HS8206",
"t": "8202-8205, in sets for retail sale 0.04 HS2523 Portland cement, aluminous cement",
"v": 5.0
},
{
"hs": "HS8429",
"t": "Self-propelled bulldozers 0.04 HS8503 Parts suitable for 8501/8502",
"v": 4.0
}
]
},
"Taiwan": {
"aus": 477778.0,
"bip": 761691.0,
"bipJahr": 2022,
"ein": 435835.0,
"name": "Chinese Taipei",
"pAus": [
{
"l": "China",
"p": 28.2
},
{
"l": "United States of America",
"p": 14.7
},
{
"l": "Hong Kong",
"p": 14.1
},
{
"l": "European Union",
"p": 7.1
},
{
"l": "Japan",
"p": 6.5
}
],
"pEin": [
{
"l": "China",
"p": 21.6
},
{
"l": "Japan",
"p": 14.7
},
{
"l": "United States of America",
"p": 10.4
},
{
"l": "European Union",
"p": 9.7
},
{
"l": "South Korea",
"p": 8.0
}
],
"pJahr": 2021,
"restAus": 29.3,
"restEin": 35.6,
"seite": 350,
"wAus": {
"agrar": 1.9,
"energie": 4.7,
"industrie": 92.7,
"sonst": 0.7
},
"wEin": {
"agrar": 4.8,
"energie": 18.9,
"industrie": 74.8,
"sonst": 1.6
},
"wJahr": 2021,
"waren": [
{
"hs": "HS2106",
"t": "Other food preparations   841 HS1201 Soya beans, whether or not broken",
"v": 1497.0
},
{
"hs": "HS2208",
"t": "Alcohol of less than 80% volume   312 HS1005 Maize (corn)",
"v": 1325.0
},
{
"hs": "HS1905",
"t": "Bread, pastry,  other bakers' wares   223 HS2106 Other food preparations",
"v": 814.0
},
{
"hs": "HS2202",
"t": "Waters containing added sugar   218 HS2208 Alcohol of less than 80% volume",
"v": 741.0
},
{
"hs": "HS0505",
"t": "Skins and other parts of birds   205 HS0202 Meat of bovine animals, frozen",
"v": 635.0
},
{
"hs": "HS8542",
"t": "Electronic integrated circuits  156 007 HS8542 Electronic integrated circuits",
"v": 81664.0
},
{
"hs": "HS8473",
"t": "Parts and accessories for 8469-8472  17 667 HS2709 Petroleum oils, crude",
"v": 19893.0
},
{
"hs": "HS8471",
"t": "Automatic data-processing machines  12 543 HS9010 Photographic laboratories apparatus",
"v": 17129.0
},
{
"hs": "HS8523",
"t": "Prepared unrecorded media  10 592 HS2711 Petroleum gases",
"v": 11408.0
},
{
"hs": "HS2710",
"t": "Petroleum oils, other than crude  9 710 HS8479 Machines with individual functions",
"v": 9941.0
}
]
},
"Tajikistan": {
"aus": 2142.0,
"bip": 10467.0,
"bipJahr": 2022,
"ein": 5167.0,
"name": "Tajikistan",
"pAus": [
{
"l": "Kazakhstan",
"p": 24.4
},
{
"l": "Switzerland",
"p": 24.0
},
{
"l": "Turkey",
"p": 15.7
},
{
"l": "Uzbekistan",
"p": 8.6
},
{
"l": "European Union",
"p": 7.9
}
],
"pEin": [
{
"l": "Russia",
"p": 30.4
},
{
"l": "Kazakhstan",
"p": 19.4
},
{
"l": "China",
"p": 16.1
},
{
"l": "Uzbekistan",
"p": 7.7
},
{
"l": "European Union",
"p": 7.5
}
],
"pJahr": 2021,
"restAus": 19.4,
"restEin": 18.9,
"seite": 352,
"wAus": {
"agrar": 11.7,
"energie": 32.2,
"industrie": 8.4,
"sonst": 47.6
},
"wEin": {
"agrar": 25.4,
"energie": 19.5,
"industrie": 53.3,
"sonst": 1.8
},
"wJahr": 2021,
"waren": [
{
"hs": "HS5201",
"t": "Cotton, not carded or combed   203 HS1001 Wheat and meslin",
"v": 266.0
},
{
"hs": "HS0813",
"t": "Other fruit, dried   16 HS1701 Cane or beet sugar",
"v": 86.0
},
{
"hs": "HS0806",
"t": "Grapes, fresh or dried   10 HS1512 Sunflower-seed,or cotton oil",
"v": 82.0
},
{
"hs": "HS0703",
"t": "Onions, shallots, garlic, leeks   5 HS1517 Margarine; edible mixtures oil",
"v": 36.0
},
{
"hs": "HS2202",
"t": "Waters containing added sugar   3 HS2309 Preparations of a kind used in animal feeding",
"v": 36.0
},
{
"hs": "HS7108",
"t": "Gold   351 HS2710 Petroleum oils, other than crude",
"v": 418.0
},
{
"hs": "HS2608",
"t": "Zinc ores and concentrates   141 HS2711 Petroleum gases",
"v": 250.0
},
{
"hs": "HS2607",
"t": "Lead ores and concentrates   136 HS8703 Motor cars for transport of persons",
"v": 147.0
},
{
"hs": "HS7601",
"t": "Unwrought aluminium   135 HS7214 Other iron bar not further worked",
"v": 129.0
},
{
"hs": "HS2716",
"t": "Electrical energy   95 HS8504 Electrical transformers",
"v": 85.0
}
]
},
"Tanzania": {
"aus": 6825.0,
"bip": 77063.0,
"bipJahr": 2022,
"ein": 14219.0,
"name": "Tanzania",
"pAus": [
{
"l": "India",
"p": 17.3
},
{
"l": "South Africa",
"p": 13.6
},
{
"l": "United Arab Emirates",
"p": 11.2
},
{
"l": "European Union",
"p": 8.5
},
{
"l": "Kenya",
"p": 5.6
}
],
"pEin": [
{
"l": "China",
"p": 25.2
},
{
"l": "United Arab Emirates",
"p": 15.9
},
{
"l": "India",
"p": 12.5
},
{
"l": "European Union",
"p": 9.6
},
{
"l": "Saudi Arabia",
"p": 3.9
}
],
"pJahr": 2022,
"restAus": 43.9,
"restEin": 32.9,
"seite": 354,
"wAus": {
"agrar": 34.3,
"energie": 4.9,
"industrie": 14.9,
"sonst": 45.9
},
"wEin": {
"agrar": 10.8,
"energie": 24.0,
"industrie": 65.2,
"sonst": 0.0
},
"wJahr": 2021,
"waren": [
{
"hs": "HS0801",
"t": "Coconuts, Brazil nuts, cashew nuts   235 HS1001 Wheat and meslin",
"v": 333.0
},
{
"hs": "HS0713",
"t": "Dried leguminous vegetables   184 HS1701 Cane or beet sugar",
"v": 179.0
},
{
"hs": "HS1006",
"t": "Rice   184 HS1511 Palm oil and its fractions",
"v": 139.0
},
{
"hs": "HS0901",
"t": "Coffee   183 HS1002 Rye",
"v": 64.0
},
{
"hs": "HS2401",
"t": "Unmanufactured tobacco   179 HS1107 Malt, whether or not roasted",
"v": 34.0
},
{
"hs": "HS7108",
"t": "Gold  2 835 HS2710 Petroleum oils, other than crude",
"v": 3650.0
},
{
"hs": "HS2603",
"t": "Copper ores and concentrates   194 HS8701 Tractors other than 8709",
"v": 392.0
},
{
"hs": "HS2701",
"t": "Coal; briquettes, ovoids   160 HS3004 Medicaments in measured doses",
"v": 365.0
},
{
"hs": "HS0304",
"t": "Fish fillets and other fish meat   79 HS3002 Human and animal blood",
"v": 362.0
},
{
"hs": "HS7112",
"t": "Waste and scrap of precious metal   78 HS7208 Hot-rolled products of iron +600",
"v": 335.0
}
]
},
"Thailand": {
"aus": 287068.0,
"bip": 536160.0,
"bipJahr": 2022,
"ein": 303191.0,
"name": "Thailand",
"pAus": [
{
"l": "United States of America",
"p": 15.5
},
{
"l": "China",
"p": 13.7
},
{
"l": "Japan",
"p": 9.2
},
{
"l": "European Union",
"p": 8.0
},
{
"l": "Vietnam",
"p": 4.6
}
],
"pEin": [
{
"l": "China",
"p": 24.8
},
{
"l": "Japan",
"p": 13.3
},
{
"l": "European Union",
"p": 6.8
},
{
"l": "United States of America",
"p": 5.4
},
{
"l": "Malaysia",
"p": 4.5
}
],
"pJahr": 2021,
"restAus": 49.0,
"restEin": 45.3,
"seite": 356,
"wAus": {
"agrar": 17.4,
"energie": 6.1,
"industrie": 73.1,
"sonst": 3.4
},
"wEin": {
"agrar": 8.4,
"energie": 20.6,
"industrie": 68.3,
"sonst": 2.7
},
"wJahr": 2021,
"waren": [
{
"hs": "HS0810",
"t": "Other fruit, fresh  4 246 HS1201 Soya beans, whether or not broken",
"v": 2267.0
},
{
"hs": "HS1006",
"t": "Rice  3 342 HS2304 Solid residues from soya-bean oil",
"v": 1364.0
},
{
"hs": "HS1602",
"t": "Other prepared or preserved meat  2 485 HS2106 Other food preparations",
"v": 880.0
},
{
"hs": "HS2309",
"t": "Preparations of a kind used in animal feeding  2 409 HS1001 Wheat and meslin",
"v": 798.0
},
{
"hs": "HS1108",
"t": "Starches; inulin  1 649 HS2309 Preparations of a kind used in animal feeding",
"v": 534.0
},
{
"hs": "HS8471",
"t": "Automatic data-processing machines  16 704 HS2709 Petroleum oils, crude",
"v": 25421.0
},
{
"hs": "HS8703",
"t": "Motor cars for transport of persons  10 616 HS8542 Electronic integrated circuits",
"v": 15126.0
},
{
"hs": "HS8708",
"t": "Parts for motor vehicles 8701-8075  8 644 HS7108 Gold",
"v": 8341.0
},
{
"hs": "HS8542",
"t": "Electronic integrated circuits  8 379 HS8525 Radio-telephony transmission tools",
"v": 7125.0
},
{
"hs": "HS8704",
"t": "Motor vehicles for goods transport  8 048 HS8708 Parts for motor vehicles 8701-8075",
"v": 6571.0
}
]
},
"Timor-Leste": {
"aus": 473.0,
"bip": 3659.0,
"bipJahr": 2022,
"ein": 934.0,
"name": "Timor-Leste",
"pAus": [
{
"l": "Indonesia",
"p": 25.4
},
{
"l": "United States of America",
"p": 22.3
},
{
"l": "European Union",
"p": 19.7
},
{
"l": "China",
"p": 8.5
},
{
"l": "Australia",
"p": 5.9
}
],
"pEin": [
{
"l": "Indonesia",
"p": 31.9
},
{
"l": "China",
"p": 15.1
},
{
"l": "Singapore",
"p": 13.1
},
{
"l": "Hong Kong",
"p": 10.1
},
{
"l": "Vietnam",
"p": 6.6
}
],
"pJahr": 2017,
"restAus": 18.2,
"restEin": 23.2,
"seite": 358,
"wAus": {
"agrar": 3.4,
"energie": 91.9,
"industrie": 1.3,
"sonst": 3.4
},
"wEin": {
"agrar": 26.6,
"energie": 34.5,
"industrie": 37.6,
"sonst": 1.3
},
"wJahr": 2021,
"waren": [
{
"hs": "HS0901",
"t": "Coffee   14 HS1006 Rice",
"v": 33.0
},
{
"hs": "HS1302",
"t": "Vegetable saps and extracts 0.9 HS0207 Meat and edible offal of poultry",
"v": 20.0
},
{
"hs": "HS1212",
"t": "Locust beans, seaweeds and algae 0.5 HS2203 Beer made from malt",
"v": 15.0
},
{
"hs": "HS0907",
"t": "Cloves 0.1 HS2402 Cigars, cheroots, cigarillos",
"v": 14.0
},
{
"hs": "HS1210",
"t": "Hop cones, fresh or dried 0.1 HS2202 Waters containing added sugar",
"v": 11.0
},
{
"hs": "HS6309",
"t": "Worn clothing and worn articles   5 HS2710 Petroleum oils, other than crude",
"v": 113.0
},
{
"hs": "HS0302",
"t": "Fish, fresh, chilled 0.5 HS8703 Motor cars for transport of persons",
"v": 26.0
},
{
"hs": "HS2710",
"t": "Petroleum oils, other than crude 0.5 HS2523 Portland cement, aluminous cement",
"v": 25.0
},
{
"hs": "HS9605",
"t": "Travel sets for personal toilet 0.4 HS8704 Motor vehicles for goods transport",
"v": 18.0
},
{
"hs": "HS0303",
"t": "Fish, frozen, excluding fish fillet 0.3 HS8711 Motor-cycles",
"v": 15.0
}
]
},
"Togo": {
"aus": 1443.0,
"bip": 8173.0,
"bipJahr": 2022,
"ein": 2666.0,
"name": "Togo",
"pAus": [
{
"l": "India",
"p": 17.0
},
{
"l": "European Union",
"p": 13.7
},
{
"l": "Burkina Faso",
"p": 12.4
},
{
"l": "Benin",
"p": 9.4
},
{
"l": "Côte d'Ivoire",
"p": 8.4
}
],
"pEin": [
{
"l": "European Union",
"p": 25.9
},
{
"l": "China",
"p": 19.8
},
{
"l": "India",
"p": 6.1
},
{
"l": "Nigeria",
"p": 4.4
},
{
"l": "Ghana",
"p": 4.1
}
],
"pJahr": 2022,
"restAus": 39.1,
"restEin": 39.7,
"seite": 360,
"wAus": {
"agrar": 24.3,
"energie": 15.6,
"industrie": 40.0,
"sonst": 20.0
},
"wEin": {
"agrar": 17.6,
"energie": 21.5,
"industrie": 60.9,
"sonst": 0.0
},
"wJahr": 2021,
"waren": [
{
"hs": "HS1201",
"t": "Soya beans, whether or not broken   76 HS1511 Palm oil and its fractions",
"v": 60.0
},
{
"hs": "HS1511",
"t": "Palm oil and its fractions   50 HS1006 Rice",
"v": 55.0
},
{
"hs": "HS5201",
"t": "Cotton, not carded or combed   45 HS1701 Cane or beet sugar",
"v": 44.0
},
{
"hs": "HS0402",
"t": "Milk and cream, concentrated   30 HS1001 Wheat and meslin",
"v": 25.0
},
{
"hs": "HS2204",
"t": "Wine of fresh grapes   23 HS0402 Milk and cream, concentrated",
"v": 24.0
},
{
"hs": "HS2510",
"t": "Natural calcium phosphates   300 HS2710 Petroleum oils, other than crude",
"v": 149.0
},
{
"hs": "HS3923",
"t": "Conveyance of goods' articles   103 HS3901 Polymers of ethylene, primary forms",
"v": 109.0
},
{
"hs": "HS2710",
"t": "Petroleum oils, other than crude   94 HS3004 Medicaments in measured doses",
"v": 103.0
},
{
"hs": "HS3304",
"t": "Preparations care of the skin   76 HS8703 Motor cars for transport of persons",
"v": 96.0
},
{
"hs": "HS2523",
"t": "Portland cement, aluminous cement   61 HS8711 Motor-cycles",
"v": 82.0
}
]
},
"Tonga": {
"aus": 14.0,
"bip": 498.0,
"bipJahr": 2022,
"ein": 245.0,
"name": "Tonga",
"pAus": [
{
"l": "New Zealand",
"p": 23.2
},
{
"l": "Hong Kong",
"p": 17.7
},
{
"l": "United States of America",
"p": 13.1
},
{
"l": "Japan",
"p": 10.9
},
{
"l": "Australia",
"p": 8.8
}
],
"pEin": [
{
"l": "New Zealand",
"p": 28.6
},
{
"l": "Singapore",
"p": 21.1
},
{
"l": "United States of America",
"p": 10.9
},
{
"l": "Japan",
"p": 8.0
},
{
"l": "Fiji",
"p": 7.8
}
],
"pJahr": 2014,
"restAus": 26.3,
"restEin": 23.6,
"seite": 362,
"wAus": {
"agrar": 68.1,
"energie": 18.9,
"industrie": 8.6,
"sonst": 4.4
},
"wEin": {
"agrar": 32.9,
"energie": 15.0,
"industrie": 49.6,
"sonst": 2.4
},
"wJahr": 2021,
"waren": [
{
"hs": "HS0714",
"t": "Manioc, arrowroot, salep   3 HS0207 Meat and edible offal of poultry",
"v": 12.0
},
{
"hs": "HS1212",
"t": "Locust beans, seaweeds and algae   1 HS1602 Other prepared or preserved meat",
"v": 4.0
},
{
"hs": "HS0709",
"t": "Other vegetables, fresh or chilled   1 HS1101 Wheat or meslin flour",
"v": 3.0
},
{
"hs": "HS0801",
"t": "Coconuts, Brazil nuts, cashew nuts 0.7 HS0202 Meat of bovine animals, frozen",
"v": 3.0
},
{
"hs": "HS1211",
"t": "Plants and parts of plants 0.6 HS0204 Meat of sheep or goats, fresh",
"v": 3.0
},
{
"hs": "HS0307",
"t": "Molluscs whether in shell or not   3 HS2710 Petroleum oils, other than crude",
"v": 44.0
},
{
"hs": "HS0302",
"t": "Fish, fresh, chilled   3 HS8541 Diodes, transistors devices",
"v": 11.0
},
{
"hs": "HS2710",
"t": "Petroleum oils, other than crude   3 HS8703 Motor cars for transport of persons",
"v": 6.0
},
{
"hs": "HS4601",
"t": "Similar products of plaiting materials 0.4 HS8517 Line telephony electrical apparatus",
"v": 4.0
},
{
"hs": "HS3208",
"t": "Paints and varnishes, non-aqueous 0.3 HS4407 Wood sawn or chipped lengthwise",
"v": 3.0
}
]
},
"Trinidad and Tobago": {
"aus": 13286.0,
"bip": 27883.0,
"bipJahr": 2022,
"ein": 6232.0,
"name": "Trinidad and Tobago",
"pAus": [
{
"l": "United States of America",
"p": 41.6
},
{
"l": "European Union",
"p": 14.3
},
{
"l": "Guyana",
"p": 6.7
},
{
"l": "Mexico",
"p": 4.3
},
{
"l": "Colombia",
"p": 3.4
}
],
"pEin": [
{
"l": "United States of America",
"p": 34.6
},
{
"l": "European Union",
"p": 10.6
},
{
"l": "China",
"p": 10.5
},
{
"l": "Mexico",
"p": 7.0
},
{
"l": "Brazil",
"p": 5.6
}
],
"pJahr": 2021,
"restAus": 29.7,
"restEin": 31.6,
"seite": 364,
"wAus": {
"agrar": 5.0,
"energie": 28.1,
"industrie": 66.3,
"sonst": 0.6
},
"wEin": {
"agrar": 18.3,
"energie": 11.0,
"industrie": 70.4,
"sonst": 0.2
},
"wJahr": 2021,
"waren": [
{
"hs": "HS2202",
"t": "Waters containing added sugar   83 HS2106 Other food preparations",
"v": 69.0
},
{
"hs": "HS2103",
"t": "Sauces and preparations therefor   59 HS2309 Preparations of a kind used in animal feeding",
"v": 47.0
},
{
"hs": "HS1904",
"t": "Prepared foods from cereals   55 HS0406 Cheese and curd",
"v": 47.0
},
{
"hs": "HS1905",
"t": "Bread, pastry,  other bakers' wares   38 HS1001 Wheat and meslin",
"v": 46.0
},
{
"hs": "HS2402",
"t": "Cigars, cheroots, cigarillos   33 HS0402 Milk and cream, concentrated",
"v": 42.0
},
{
"hs": "HS2814",
"t": "Ammonia  1 688 HS2601 Iron ores and concentrates",
"v": 535.0
},
{
"hs": "HS2905",
"t": "Acyclic alcohols, their derivatives  1 531 HS7308 Structures of iron and steel",
"v": 332.0
},
{
"hs": "HS2709",
"t": "Petroleum oils, crude  1 182 HS8901 Vessels for transport",
"v": 190.0
},
{
"hs": "HS7203",
"t": "Ferrous products   795 HS8431 Parts for machinery of 8425 to 8430",
"v": 174.0
},
{
"hs": "HS3102",
"t": "Nitrogenous fertilisers   748 HS8703 Motor cars for transport of persons",
"v": 143.0
}
]
},
"Tunisia": {
"aus": 18561.0,
"bip": 46601.0,
"bipJahr": 2022,
"ein": 26656.0,
"name": "Tunisia",
"pAus": [
{
"l": "European Union",
"p": 70.3
},
{
"l": "Libya",
"p": 3.9
},
{
"l": "United States of America",
"p": 2.3
},
{
"l": "United Kingdom",
"p": 1.6
},
{
"l": "Turkey",
"p": 1.6
}
],
"pEin": [
{
"l": "European Union",
"p": 47.8
},
{
"l": "China",
"p": 10.4
},
{
"l": "Turkey",
"p": 5.4
},
{
"l": "Algeria",
"p": 3.5
},
{
"l": "Azerbaijan",
"p": 3.0
}
],
"pJahr": 2021,
"restAus": 20.3,
"restEin": 29.9,
"seite": 366,
"wAus": {
"agrar": 11.2,
"energie": 8.6,
"industrie": 80.2,
"sonst": 0.0
},
"wEin": {
"agrar": 13.6,
"energie": 18.5,
"industrie": 67.8,
"sonst": 0.1
},
"wJahr": 2021,
"waren": [
{
"hs": "HS1509",
"t": "Olive oil and its fractions   600 HS1001 Wheat and meslin",
"v": 645.0
},
{
"hs": "HS0804",
"t": "Dates, figs, pineapples, avocados   257 HS1201 Soya beans, whether or not broken",
"v": 306.0
},
{
"hs": "HS0702",
"t": "Tomatoes, fresh or chilled   52 HS1005 Maize (corn)",
"v": 288.0
},
{
"hs": "HS1902",
"t": "Pasta   51 HS1003 Barley",
"v": 287.0
},
{
"hs": "HS1517",
"t": "Margarine; edible mixtures oil   45 HS2402 Cigars, cheroots, cigarillos",
"v": 109.0
},
{
"hs": "HS8544",
"t": "Insulated electric conductors  2 228 HS2710 Petroleum oils, other than crude",
"v": 1387.0
},
{
"hs": "HS2709",
"t": "Petroleum oils, crude   766 HS2711 Petroleum gases",
"v": 843.0
},
{
"hs": "HS6211",
"t": "Track suits, ski suits and swimwear   596 HS8703 Motor cars for transport of persons",
"v": 776.0
},
{
"hs": "HS6203",
"t": "Men's or boys' suits   491 HS2709 Petroleum oils, crude",
"v": 684.0
},
{
"hs": "HS8536",
"t": "Electrical circuits protector   435 HS8536 Electrical circuits protector",
"v": 559.0
}
]
},
"Turkey": {
"aus": 254192.0,
"bip": 905527.0,
"bipJahr": 2022,
"ein": 363711.0,
"name": "Türkiye",
"pAus": [
{
"l": "European Union",
"p": 41.4
},
{
"l": "United States of America",
"p": 6.6
},
{
"l": "Iraq",
"p": 5.4
},
{
"l": "United Kingdom",
"p": 5.1
},
{
"l": "Russia",
"p": 3.7
}
],
"pEin": [
{
"l": "European Union",
"p": 25.7
},
{
"l": "Russia",
"p": 16.2
},
{
"l": "China",
"p": 11.4
},
{
"l": "Switzerland",
"p": 4.2
},
{
"l": "United States of America",
"p": 4.2
}
],
"pJahr": 2022,
"restAus": 37.8,
"restEin": 38.4,
"seite": 368,
"wAus": {
"agrar": 11.5,
"energie": 8.6,
"industrie": 76.8,
"sonst": 3.0
},
"wEin": {
"agrar": 9.0,
"energie": 28.9,
"industrie": 59.9,
"sonst": 2.2
},
"wJahr": 2021,
"waren": [
{
"hs": "HS1512",
"t": "Sunflower-seed,or cotton oil  1 899 HS1001 Wheat and meslin",
"v": 3356.0
},
{
"hs": "HS0802",
"t": "Other nuts, fresh or dried  1 535 HS5201 Cotton, not carded or combed",
"v": 3207.0
},
{
"hs": "HS1101",
"t": "Wheat or meslin flour  1 498 HS1512 Sunflower-seed,or cotton oil",
"v": 2205.0
},
{
"hs": "HS1905",
"t": "Bread, pastry,  other bakers' wares  1 399 HS1201 Soya beans, whether or not broken",
"v": 2050.0
},
{
"hs": "HS0207",
"t": "Meat and edible offal of poultry  1 089 HS1511 Palm oil and its fractions",
"v": 1206.0
},
{
"hs": "HS2710",
"t": "Petroleum oils, other than crude  13 089 HS7108 Gold",
"v": 20440.0
},
{
"hs": "HS8703",
"t": "Motor cars for transport of persons  9 351 HS2710 Petroleum oils, other than crude",
"v": 18666.0
},
{
"hs": "HS7113",
"t": "Articles and parts of jewellery  8 170 HS7204 Ferrous waste and scrap",
"v": 9719.0
},
{
"hs": "HS8708",
"t": "Parts for motor vehicles 8701-8075  6 542 HS2701 Coal; briquettes, ovoids",
"v": 8169.0
},
{
"hs": "HS8704",
"t": "Motor vehicles for goods transport  5 544 HS8703 Motor cars for transport of persons",
"v": 7980.0
}
]
},
"Turkmenistan": {
"aus": 13226.0,
"bip": 78003.0,
"bipJahr": 2022,
"ein": 3250.0,
"name": "Turkmenistan",
"pAus": [
{
"l": "Russia",
"p": 41.1
},
{
"l": "European Union",
"p": 19.3
},
{
"l": "Iran",
"p": 9.7
},
{
"l": "Turkey",
"p": 7.4
},
{
"l": "Ukraine",
"p": 6.6
}
],
"pEin": [
{
"l": "Russia",
"p": 14.3
},
{
"l": "Turkey",
"p": 14.2
},
{
"l": "European Union",
"p": 13.3
},
{
"l": "Ukraine",
"p": 12.0
},
{
"l": "United Arab Emirates",
"p": 8.2
}
],
"pJahr": 2000,
"restAus": 15.9,
"restEin": 38.0,
"seite": 370,
"waren": []
},
"Tuvalu": {
"aus": 0.0,
"bip": 60.0,
"bipJahr": 2022,
"ein": 34.0,
"name": "Tuvalu",
"pAus": [
{
"l": "Fiji",
"p": 77.8
},
{
"l": "New Zealand",
"p": 17.8
},
{
"l": "Indonesia",
"p": 2.4
},
{
"l": "Australia",
"p": 2.0
}
],
"pEin": [
{
"l": "Fiji",
"p": 23.9
},
{
"l": "Australia",
"p": 18.2
},
{
"l": "New Zealand",
"p": 17.3
},
{
"l": "Japan",
"p": 16.3
},
{
"l": "Taiwan",
"p": 10.6
}
],
"pJahr": 2021,
"restAus": 0.0,
"restEin": 13.7,
"seite": 372,
"wAus": {
"agrar": 22.6,
"energie": 19.5,
"industrie": 15.5,
"sonst": 42.3
},
"wJahr": 2013,
"waren": []
},
"Uganda": {
"aus": 3973.0,
"bip": 48841.0,
"bipJahr": 2022,
"ein": 9366.0,
"name": "Uganda",
"pAus": [
{
"l": "United Arab Emirates",
"p": 44.5
},
{
"l": "European Union",
"p": 11.8
},
{
"l": "Kenya",
"p": 11.2
},
{
"l": "S. Sudan",
"p": 8.6
},
{
"l": "Dem. Rep. Congo",
"p": 6.4
}
],
"pEin": [
{
"l": "China",
"p": 16.4
},
{
"l": "India",
"p": 11.6
},
{
"l": "Kenya",
"p": 9.4
},
{
"l": "Tanzania",
"p": 9.0
},
{
"l": "European Union",
"p": 8.6
}
],
"pJahr": 2020,
"restAus": 17.5,
"restEin": 45.0,
"seite": 374,
"wAus": {
"agrar": 49.1,
"energie": 3.0,
"industrie": 14.3,
"sonst": 33.6
},
"wEin": {
"agrar": 13.3,
"energie": 13.9,
"industrie": 61.5,
"sonst": 11.3
},
"wJahr": 2021,
"waren": [
{
"hs": "HS0901",
"t": "Coffee   516 HS1511 Palm oil and its fractions",
"v": 272.0
},
{
"hs": "HS1801",
"t": "Cocoa beans, whole or broken   99 HS1001 Wheat and meslin",
"v": 152.0
},
{
"hs": "HS0902",
"t": "Tea   79 HS1006 Rice",
"v": 106.0
},
{
"hs": "HS1701",
"t": "Cane or beet sugar   72 HS1701 Cane or beet sugar",
"v": 68.0
},
{
"hs": "HS1005",
"t": "Maize (corn)   66 HS2309 Preparations of a kind used in animal feeding",
"v": 52.0
},
{
"hs": "HS7108",
"t": "Gold  1 818 HS7108 Gold",
"v": 1842.0
},
{
"hs": "HS2710",
"t": "Petroleum oils, other than crude   77 HS2710 Petroleum oils, other than crude",
"v": 933.0
},
{
"hs": "HS0304",
"t": "Fish fillets and other fish meat   74 HS3004 Medicaments in measured doses",
"v": 295.0
},
{
"hs": "HS2523",
"t": "Portland cement, aluminous cement   69 HS8703 Motor cars for transport of persons",
"v": 179.0
},
{
"hs": "HS0305",
"t": "Fish, dried, salted or in brine   48 HS8704 Motor vehicles for goods transport",
"v": 140.0
}
]
},
"Ukraine": {
"aus": 44376.0,
"bip": 151502.0,
"bipJahr": 2022,
"ein": 55237.0,
"name": "Ukraine",
"pAus": [
{
"l": "European Union",
"p": 63.1
},
{
"l": "Turkey",
"p": 6.6
},
{
"l": "China",
"p": 5.6
},
{
"l": "Moldova",
"p": 2.1
},
{
"l": "United States of America",
"p": 2.0
}
],
"pEin": [
{
"l": "European Union",
"p": 48.9
},
{
"l": "China",
"p": 15.7
},
{
"l": "Turkey",
"p": 6.1
},
{
"l": "United States of America",
"p": 3.9
},
{
"l": "India",
"p": 3.0
}
],
"pJahr": 2022,
"restAus": 20.6,
"restEin": 22.4,
"seite": 376,
"wAus": {
"agrar": 40.5,
"energie": 14.0,
"industrie": 41.8,
"sonst": 3.7
},
"wEin": {
"agrar": 11.2,
"energie": 19.1,
"industrie": 65.6,
"sonst": 4.1
},
"wJahr": 2021,
"waren": [
{
"hs": "HS1005",
"t": "Maize (corn)  5 992 HS2309 Preparations of a kind used in animal feeding",
"v": 345.0
},
{
"hs": "HS1512",
"t": "Sunflower-seed,or cotton oil  5 493 HS0805 Citrus fruit, fresh or dried",
"v": 242.0
},
{
"hs": "HS1001",
"t": "Wheat and meslin  2 678 HS1206 Sunflower seeds",
"v": 212.0
},
{
"hs": "HS1205",
"t": "Rape or colza seeds  1 551 HS2106 Other food preparations",
"v": 204.0
},
{
"hs": "HS1206",
"t": "Sunflower seeds  1 263 HS0901 Coffee",
"v": 199.0
},
{
"hs": "HS2601",
"t": "Iron ores and concentrates  2 914 HS2710 Petroleum oils, other than crude",
"v": 8661.0
},
{
"hs": "HS8544",
"t": "Insulated electric conductors  1 328 HS8703 Motor cars for transport of persons",
"v": 2948.0
},
{
"hs": "HS7207",
"t": "Iron's semi-finished products  1 191 HS2711 Petroleum gases",
"v": 2112.0
},
{
"hs": "HS7208",
"t": "Hot-rolled products of iron +600  1 009 HS3004 Medicaments in measured doses",
"v": 1551.0
},
{
"hs": "HS7201",
"t": "Pig iron and spiegeleisen in pigs   639 HS2701 Coal; briquettes, ovoids",
"v": 1177.0
}
]
},
"United Arab Emirates": {
"aus": 532797.0,
"bip": 507535.0,
"bipJahr": 2022,
"ein": 420510.0,
"name": "United Arab Emirates",
"pAus": [
{
"l": "Saudi Arabia",
"p": 6.2
},
{
"l": "India",
"p": 5.6
},
{
"l": "Iraq",
"p": 3.4
},
{
"l": "European Union",
"p": 3.2
},
{
"l": "Hong Kong",
"p": 2.5
}
],
"pEin": [
{
"l": "China",
"p": 14.9
},
{
"l": "European Union",
"p": 10.8
},
{
"l": "India",
"p": 6.0
},
{
"l": "United States of America",
"p": 4.9
},
{
"l": "Japan",
"p": 3.1
}
],
"pJahr": 2021,
"restAus": 79.0,
"restEin": 60.3,
"seite": 378,
"wAus": {
"agrar": 3.7,
"energie": 54.8,
"industrie": 33.5,
"sonst": 8.0
},
"wEin": {
"agrar": 5.8,
"energie": 13.1,
"industrie": 51.9,
"sonst": 29.2
},
"wJahr": 2021,
"waren": [
{
"hs": "HS2402",
"t": "Cigars, cheroots, cigarillos  4 424 HS0402 Milk and cream, concentrated",
"v": 881.0
},
{
"hs": "HS0402",
"t": "Milk and cream, concentrated   747 HS0207 Meat and edible offal of poultry",
"v": 844.0
},
{
"hs": "HS1701",
"t": "Cane or beet sugar   703 HS1205 Rape or colza seeds",
"v": 712.0
},
{
"hs": "HS0802",
"t": "Other nuts, fresh or dried   486 HS2106 Other food preparations",
"v": 640.0
},
{
"hs": "HS1514",
"t": "Rape, colza or mustard oil   480 HS1701 Cane or beet sugar",
"v": 635.0
},
{
"hs": "HS2709",
"t": "Petroleum oils, crude  99 039 HS7108 Gold",
"v": 48182.0
},
{
"hs": "HS2710",
"t": "Petroleum oils, other than crude  88 833 HS2710 Petroleum oils, other than crude",
"v": 33297.0
},
{
"hs": "HS7108",
"t": "Gold  33 787 HS8525 Radio-telephony transmission tools",
"v": 27682.0
},
{
"hs": "HS2711",
"t": "Petroleum gases  29 158 HS7102 Diamonds, whether or not worked",
"v": 14714.0
},
{
"hs": "HS8525",
"t": "Radio-telephony transmission tools  24 392 HS8703 Motor cars for transport of persons",
"v": 12690.0
}
]
},
"United Kingdom": {
"aus": 530222.0,
"bip": 3070600.0,
"bipJahr": 2022,
"ein": 823936.0,
"name": "United Kingdom",
"pAus": [
{
"l": "European Union",
"p": 43.3
},
{
"l": "United States of America",
"p": 12.1
},
{
"l": "China",
"p": 6.7
},
{
"l": "Switzerland",
"p": 6.6
},
{
"l": "Hong Kong",
"p": 4.4
}
],
"pEin": [
{
"l": "European Union",
"p": 37.4
},
{
"l": "China",
"p": 13.4
},
{
"l": "United States of America",
"p": 11.9
},
{
"l": "Norway",
"p": 6.5
},
{
"l": "Canada",
"p": 2.1
}
],
"pJahr": 2022,
"restAus": 26.9,
"restEin": 28.6,
"seite": 380,
"wAus": {
"agrar": 6.7,
"energie": 14.7,
"industrie": 63.8,
"sonst": 14.8
},
"wEin": {
"agrar": 10.7,
"energie": 15.0,
"industrie": 63.7,
"sonst": 10.5
},
"wJahr": 2021,
"waren": [
{
"hs": "HS2208",
"t": "Alcohol of less than 80% volume  9 328 HS2204 Wine of fresh grapes",
"v": 5029.0
},
{
"hs": "HS2106",
"t": "Other food preparations  1 659 HS1905 Bread, pastry,  other bakers' wares",
"v": 3623.0
},
{
"hs": "HS1905",
"t": "Bread, pastry,  other bakers' wares  1 223 HS1602 Other prepared or preserved meat",
"v": 2953.0
},
{
"hs": "HS2309",
"t": "Preparations of a kind used in animal feeding  1 184 HS1806 Chocolate and other cocoa food",
"v": 2655.0
},
{
"hs": "HS1806",
"t": "Chocolate and other cocoa food  1 010 HS0406 Cheese and curd",
"v": 2228.0
},
{
"hs": "HS7108",
"t": "Gold  72 701 HS2711 Petroleum gases",
"v": 59700.0
},
{
"hs": "HS8703",
"t": "Motor cars for transport of persons  29 380 HS8703 Motor cars for transport of persons",
"v": 44232.0
},
{
"hs": "HS8411",
"t": "Turbo-jets, turbo-propellers and ot  28 682 HS7108 Gold",
"v": 41834.0
},
{
"hs": "HS2709",
"t": "Petroleum oils, crude  25 105 HS2709 Petroleum oils, crude",
"v": 39459.0
},
{
"hs": "HS3004",
"t": "Medicaments in measured doses  20 782 HS2710 Petroleum oils, other than crude",
"v": 29833.0
}
]
},
"United States of America": {
"aus": 2064278.0,
"bip": 25464475.0,
"bipJahr": 2022,
"ein": 3375819.0,
"name": "United States of America",
"pAus": [
{
"l": "Canada",
"p": 17.2
},
{
"l": "European Union",
"p": 17.0
},
{
"l": "Mexico",
"p": 15.7
},
{
"l": "China",
"p": 7.5
},
{
"l": "Japan",
"p": 3.9
}
],
"pEin": [
{
"l": "China",
"p": 17.1
},
{
"l": "European Union",
"p": 16.9
},
{
"l": "Mexico",
"p": 13.6
},
{
"l": "Canada",
"p": 13.2
},
{
"l": "Japan",
"p": 4.6
}
],
"pJahr": 2022,
"restAus": 38.7,
"restEin": 34.6,
"seite": 382,
"wAus": {
"agrar": 11.5,
"energie": 17.4,
"industrie": 61.5,
"sonst": 9.6
},
"wEin": {
"agrar": 7.8,
"energie": 10.5,
"industrie": 76.9,
"sonst": 4.9
},
"wJahr": 2021,
"waren": [
{
"hs": "HS1201",
"t": "Soya beans, whether or not broken  34 490 HS2208 Alcohol of less than 80% volume",
"v": 12879.0
},
{
"hs": "HS1005",
"t": "Maize (corn)  19 032 HS1905 Bread, pastry,  other bakers' wares",
"v": 9832.0
},
{
"hs": "HS5201",
"t": "Cotton, not carded or combed  9 040 HS0901 Coffee",
"v": 9786.0
},
{
"hs": "HS1001",
"t": "Wheat and meslin  8 523 HS2106 Other food preparations",
"v": 8596.0
},
{
"hs": "HS0802",
"t": "Other nuts, fresh or dried  8 115 HS2204 Wine of fresh grapes",
"v": 7685.0
},
{
"hs": "HS2710",
"t": "Petroleum oils, other than crude  135 405 HS2709 Petroleum oils, crude",
"v": 204716.0
},
{
"hs": "HS2709",
"t": "Petroleum oils, crude  117 034 HS8703 Motor cars for transport of persons",
"v": 168337.0
},
{
"hs": "HS2711",
"t": "Petroleum gases  96 273 HS8471 Automatic data-processing machines",
"v": 138667.0
},
{
"hs": "HS8703",
"t": "Motor cars for transport of persons  57 851 HS8525 Radio-telephony transmission tools",
"v": 134586.0
},
{
"hs": "HS8542",
"t": "Electronic integrated circuits  52 068 HS3004 Medicaments in measured doses",
"v": 92375.0
}
]
},
"Uruguay": {
"aus": 11185.0,
"bip": 71887.0,
"bipJahr": 2022,
"ein": 12973.0,
"name": "Uruguay",
"pAus": [
{
"l": "China",
"p": 21.5
},
{
"l": "Brazil",
"p": 15.0
},
{
"l": "Argentina",
"p": 8.1
},
{
"l": "European Union",
"p": 7.9
},
{
"l": "United States of America",
"p": 6.2
}
],
"pEin": [
{
"l": "Brazil",
"p": 19.9
},
{
"l": "China",
"p": 18.1
},
{
"l": "United States of America",
"p": 15.8
},
{
"l": "Argentina",
"p": 11.5
},
{
"l": "European Union",
"p": 11.4
}
],
"pJahr": 2022,
"restAus": 41.4,
"restEin": 23.3,
"seite": 384,
"wAus": {
"agrar": 77.6,
"energie": 6.0,
"industrie": 16.1,
"sonst": 0.3
},
"wEin": {
"agrar": 15.2,
"energie": 15.5,
"industrie": 69.2,
"sonst": 0.0
},
"wJahr": 2021,
"waren": [
{
"hs": "HS0202",
"t": "Meat of bovine animals, frozen  2 122 HS0201 Bovine meat, fresh, chilled",
"v": 146.0
},
{
"hs": "HS1201",
"t": "Soya beans, whether or not broken  1 923 HS0203 Swine meat, fresh, chilled, frozen",
"v": 104.0
},
{
"hs": "HS0402",
"t": "Milk and cream, concentrated   621 HS1104 Cereal grains otherwise worked",
"v": 94.0
},
{
"hs": "HS1006",
"t": "Rice   498 HS2309 Preparations of a kind used in animal feeding",
"v": 77.0
},
{
"hs": "HS0201",
"t": "Bovine meat, fresh, chilled   431 HS1005 Maize (corn)",
"v": 69.0
},
{
"hs": "HS4403",
"t": "Wood in the rough   674 HS2709 Petroleum oils, crude",
"v": 1657.0
},
{
"hs": "HS8704",
"t": "Motor vehicles for goods transport   310 HS8703 Motor cars for transport of persons",
"v": 477.0
},
{
"hs": "HS3923",
"t": "Conveyance of goods' articles   187 HS2710 Petroleum oils, other than crude",
"v": 354.0
},
{
"hs": "HS4407",
"t": "Wood sawn or chipped lengthwise   183 HS8525 Radio-telephony transmission tools",
"v": 353.0
},
{
"hs": "HS2716",
"t": "Electrical energy   163 HS3102 Nitrogenous fertilisers",
"v": 341.0
}
]
},
"Uzbekistan": {
"aus": 15287.0,
"bip": 80418.0,
"bipJahr": 2022,
"ein": 28264.0,
"name": "Uzbekistan",
"pAus": [
{
"l": "Russia",
"p": 17.0
},
{
"l": "China",
"p": 11.5
},
{
"l": "Turkey",
"p": 9.5
},
{
"l": "Kazakhstan",
"p": 8.2
},
{
"l": "Kyrgyzstan",
"p": 6.1
}
],
"pEin": [
{
"l": "China",
"p": 22.4
},
{
"l": "Russia",
"p": 21.4
},
{
"l": "European Union",
"p": 12.3
},
{
"l": "Kazakhstan",
"p": 11.4
},
{
"l": "South Korea",
"p": 7.7
}
],
"pJahr": 2022,
"restAus": 47.7,
"restEin": 24.8,
"seite": 386,
"wAus": {
"agrar": 12.8,
"energie": 20.1,
"industrie": 35.5,
"sonst": 31.6
},
"wEin": {
"agrar": 15.1,
"energie": 10.3,
"industrie": 74.6,
"sonst": 0.0
},
"wJahr": 2021,
"waren": [
{
"hs": "HS0806",
"t": "Grapes, fresh or dried   280 HS1001 Wheat and meslin",
"v": 781.0
},
{
"hs": "HS1101",
"t": "Wheat or meslin flour   269 HS1701 Cane or beet sugar",
"v": 521.0
},
{
"hs": "HS0713",
"t": "Dried leguminous vegetables   231 HS1517 Margarine; edible mixtures oil",
"v": 244.0
},
{
"hs": "HS0809",
"t": "Apricots, cherries, peaches   132 HS1512 Sunflower-seed,or cotton oil",
"v": 241.0
},
{
"hs": "HS0810",
"t": "Other fruit, fresh   72 HS0201 Bovine meat, fresh, chilled",
"v": 166.0
},
{
"hs": "HS7108",
"t": "Gold  4 110 HS3004 Medicaments in measured doses",
"v": 1317.0
},
{
"hs": "HS5205",
"t": "Cotton yarn, 85% or more of cotton  1 391 HS8708 Parts for motor vehicles 8701-8075",
"v": 1224.0
},
{
"hs": "HS2711",
"t": "Petroleum gases   925 HS2710 Petroleum oils, other than crude",
"v": 840.0
},
{
"hs": "HS7403",
"t": "Refined copper and copper alloys   582 HS8703 Motor cars for transport of persons",
"v": 779.0
},
{
"hs": "HS7408",
"t": "Copper wire   300 HS7208 Hot-rolled products of iron +600",
"v": 651.0
}
]
},
"Vanuatu": {
"aus": 61.0,
"bip": 1001.0,
"bipJahr": 2022,
"ein": 484.0,
"name": "Vanuatu",
"pAus": [
{
"l": "Malaysia",
"p": 20.4
},
{
"l": "Philippines",
"p": 18.0
},
{
"l": "New Zealand",
"p": 11.4
},
{
"l": "Australia",
"p": 11.3
},
{
"l": "Fiji",
"p": 8.1
}
],
"pEin": [
{
"l": "Australia",
"p": 29.7
},
{
"l": "Singapore",
"p": 18.2
},
{
"l": "New Zealand",
"p": 12.7
},
{
"l": "Fiji",
"p": 8.0
},
{
"l": "China",
"p": 6.9
}
],
"pJahr": 2011,
"restAus": 30.7,
"restEin": 24.5,
"seite": 388,
"wAus": {
"agrar": 83.2,
"energie": 1.5,
"industrie": 7.8,
"sonst": 7.5
},
"wEin": {
"agrar": 24.2,
"energie": 17.3,
"industrie": 48.2,
"sonst": 10.3
},
"wJahr": 2011,
"waren": [
{
"hs": "HS1513",
"t": "Coconut (copra), or palm kernel oil   17 HS1006 Rice",
"v": 11.0
},
{
"hs": "HS1203",
"t": "Copra   11 HS1905 Bread, pastry,  other bakers' wares",
"v": 5.0
},
{
"hs": "HS1212",
"t": "Locust beans, seaweeds and algae   7 HS0207 Meat and edible offal of poultry",
"v": 5.0
},
{
"hs": "HS0202",
"t": "Meat of bovine animals, frozen   5 HS1101 Wheat or meslin flour",
"v": 4.0
},
{
"hs": "HS1801",
"t": "Cocoa beans, whole or broken   3 HS2402 Cigars, cheroots, cigarillos",
"v": 3.0
},
{
"hs": "HS3205",
"t": "Colour lakes   3 HS2710 Petroleum oils, other than crude",
"v": 48.0
},
{
"hs": "HS0302",
"t": "Fish, fresh, chilled   2 HS3004 Medicaments in measured doses",
"v": 16.0
},
{
"hs": "HS0301",
"t": "Live fish   2 HS8703 Motor cars for transport of persons",
"v": 7.0
},
{
"hs": "HS0303",
"t": "Fish, frozen, excluding fish fillet   2 HS2523 Portland cement, aluminous cement",
"v": 4.0
},
{
"hs": "HS7204",
"t": "Ferrous waste and scrap 0.9 HS1604 Prepared or preserved fish",
"v": 4.0
}
]
},
"Venezuela": {
"aus": 4750.0,
"bip": 93111.0,
"bipJahr": 2022,
"ein": 10100.0,
"name": "Venezuela, Bolivarian Republic of",
"pAus": [
{
"l": "United States of America",
"p": 0.6
},
{
"l": "European Union",
"p": 0.5
},
{
"l": "China",
"p": 0.3
},
{
"l": "Colombia",
"p": 0.3
},
{
"l": "Brazil",
"p": 0.2
}
],
"pEin": [
{
"l": "United States of America",
"p": 23.3
},
{
"l": "China",
"p": 17.0
},
{
"l": "European Union",
"p": 12.9
},
{
"l": "Brazil",
"p": 10.0
},
{
"l": "Colombia",
"p": 5.0
}
],
"pJahr": 2013,
"restAus": 98.1,
"restEin": 31.8,
"seite": 390,
"wAus": {
"agrar": 1.2,
"energie": 75.2,
"industrie": 16.0,
"sonst": 7.6
},
"wEin": {
"agrar": 34.7,
"energie": 4.6,
"industrie": 59.2,
"sonst": 1.6
},
"wJahr": 2021,
"waren": [
{
"hs": "HS4101",
"t": "Raw hides and skins of bovine   13 HS0202 Meat of bovine animals, frozen",
"v": 865.0
},
{
"hs": "HS2203",
"t": "Beer made from malt   6 HS1005 Maize (corn)",
"v": 792.0
},
{
"hs": "HS1801",
"t": "Cocoa beans, whole or broken   5 HS2304 Solid residues from soya-bean oil",
"v": 747.0
},
{
"hs": "HS2208",
"t": "Alcohol of less than 80% volume   5 HS0402 Milk and cream, concentrated",
"v": 729.0
},
{
"hs": "HS1515",
"t": "Other fixed vegetable fats and oils   5 HS0102 Live bovine animals",
"v": 634.0
},
{
"hs": "HS2709",
"t": "Petroleum oils, crude  74 851 HS3004 Medicaments in measured doses",
"v": 2566.0
},
{
"hs": "HS2710",
"t": "Petroleum oils, other than crude  11 010 HS7304 Tubes, pipes, of iron or steel",
"v": 919.0
},
{
"hs": "HS2905",
"t": "Acyclic alcohols, their derivatives   597 HS7308 Structures of iron and steel",
"v": 757.0
},
{
"hs": "HS2601",
"t": "Iron ores and concentrates   262 HS8525 Radio-telephony transmission tools",
"v": 724.0
},
{
"hs": "HS7203",
"t": "Ferrous products   205 HS8413 Pumps for liquids, liquid elevators",
"v": 655.0
}
]
},
"Vietnam": {
"aus": 371288.0,
"bip": 406452.0,
"bipJahr": 2022,
"ein": 359148.0,
"name": "Viet Nam",
"pAus": [
{
"l": "United States of America",
"p": 28.7
},
{
"l": "China",
"p": 16.7
},
{
"l": "European Union",
"p": 11.9
},
{
"l": "South Korea",
"p": 6.5
},
{
"l": "Japan",
"p": 6.0
}
],
"pEin": [
{
"l": "China",
"p": 33.2
},
{
"l": "South Korea",
"p": 17.0
},
{
"l": "Japan",
"p": 6.8
},
{
"l": "Taiwan",
"p": 6.3
},
{
"l": "European Union",
"p": 5.1
}
],
"pJahr": 2021,
"restAus": 30.2,
"restEin": 31.6,
"seite": 392,
"wAus": {
"agrar": 10.1,
"energie": 2.2,
"industrie": 87.7,
"sonst": 0.0
},
"wEin": {
"agrar": 9.2,
"energie": 9.3,
"industrie": 76.5,
"sonst": 5.0
},
"wJahr": 2021,
"waren": [
{
"hs": "HS0801",
"t": "Coconuts, Brazil nuts, cashew nuts  3 245 HS0801 Coconuts, Brazil nuts, cashew nuts",
"v": 3770.0
},
{
"hs": "HS1006",
"t": "Rice  3 006 HS5201 Cotton, not carded or combed",
"v": 2970.0
},
{
"hs": "HS0901",
"t": "Coffee  2 156 HS1005 Maize (corn)",
"v": 2853.0
},
{
"hs": "HS0810",
"t": "Other fruit, fresh  1 396 HS2304 Solid residues from soya-bean oil",
"v": 2525.0
},
{
"hs": "HS1108",
"t": "Starches; inulin   948 HS1001 Wheat and meslin",
"v": 1387.0
},
{
"hs": "HS8525",
"t": "Radio-telephony transmission tools  51 707 HS8542 Electronic integrated circuits",
"v": 47994.0
},
{
"hs": "HS8517",
"t": "Line telephony electrical apparatus  25 208 HS8517 Line telephony electrical apparatus",
"v": 20716.0
},
{
"hs": "HS8542",
"t": "Electronic integrated circuits  14 514 HS8529 Parts for 8525-8528",
"v": 6990.0
},
{
"hs": "HS8471",
"t": "Automatic data-processing machines  9 249 HS8534 Printed circuits",
"v": 5448.0
},
{
"hs": "HS6404",
"t": "Footwear, uppers textile material  9 114 HS2709 Petroleum oils, crude",
"v": 5032.0
}
]
},
"Yemen": {
"aus": 903.0,
"bip": 20645.0,
"bipJahr": 2022,
"ein": 5312.0,
"name": "Yemen",
"pAus": [
{
"l": "Egypt",
"p": 49.6
},
{
"l": "Turkey",
"p": 28.0
},
{
"l": "Oman",
"p": 10.5
},
{
"l": "Sudan",
"p": 9.3
},
{
"l": "Eritrea",
"p": 0.9
}
],
"pEin": [
{
"l": "United Arab Emirates",
"p": 24.0
},
{
"l": "China",
"p": 10.4
},
{
"l": "Saudi Arabia",
"p": 6.5
},
{
"l": "Oman",
"p": 5.5
},
{
"l": "Turkey",
"p": 5.4
}
],
"pJahr": 2019,
"restAus": 1.6,
"restEin": 48.2,
"seite": 394,
"wAus": {
"agrar": 5.3,
"energie": 94.5,
"industrie": 0.1,
"sonst": 0.1
},
"wEin": {
"agrar": 38.7,
"energie": 13.1,
"industrie": 29.7,
"sonst": 18.4
},
"wJahr": 2021,
"waren": [
{
"hs": "HS1101",
"t": "Wheat or meslin flour   15 HS1001 Wheat and meslin",
"v": 547.0
},
{
"hs": "HS1103",
"t": "Cereal groats, meal and pellets   8 HS1701 Cane or beet sugar",
"v": 238.0
},
{
"hs": "HS2303",
"t": "Residues of starch manufacture 0.3 HS1005 Maize (corn)",
"v": 164.0
},
{
"hs": "HS2306",
"t": "Solid residues from other oil 0.1 HS1006 Rice",
"v": 141.0
},
{
"hs": "HS1511",
"t": "Palm oil and its fractions 0.1 HS1101 Wheat or meslin flour",
"v": 127.0
},
{
"hs": "HS6117",
"t": "Other made-up clothing accessories 0.1 HS2710 Petroleum oils, other than crude",
"v": 1334.0
},
{
"hs": "HS4411",
"t": "Fibreboard of ligneous materials 0.1 HS7213 Bars and rods, hot-rolled",
"v": 104.0
},
{
"hs": "HS4412",
"t": "Plywood, veneered panels 0.1 HS8703 Motor cars for transport of persons",
"v": 94.0
},
{
"hs": "HS4413",
"t": "Densified wood, in blocks 0.03 HS3004 Medicaments in measured doses",
"v": 93.0
},
{
"hs": "HS4410",
"t": "Particle board and similar board 0.02 HS8541 Diodes, transistors devices",
"v": 70.0
}
]
},
"Zambia": {
"aus": 11651.0,
"bip": 28500.0,
"bipJahr": 2022,
"ein": 9047.0,
"name": "Zambia",
"pAus": [
{
"l": "Switzerland",
"p": 42.1
},
{
"l": "China",
"p": 18.9
},
{
"l": "Singapore",
"p": 13.5
},
{
"l": "Dem. Rep. Congo",
"p": 9.7
},
{
"l": "European Union",
"p": 3.4
}
],
"pEin": [
{
"l": "South Africa",
"p": 31.3
},
{
"l": "China",
"p": 12.6
},
{
"l": "European Union",
"p": 7.7
},
{
"l": "India",
"p": 6.3
},
{
"l": "United Arab Emirates",
"p": 5.7
}
],
"pJahr": 2021,
"restAus": 12.3,
"restEin": 36.4,
"seite": 396,
"wAus": {
"agrar": 8.4,
"energie": 80.1,
"industrie": 10.8,
"sonst": 0.7
},
"wEin": {
"agrar": 9.8,
"energie": 15.9,
"industrie": 74.1,
"sonst": 0.3
},
"wJahr": 2021,
"waren": [
{
"hs": "HS2202",
"t": "Waters containing added sugar   118 HS1511 Palm oil and its fractions",
"v": 94.0
},
{
"hs": "HS2401",
"t": "Unmanufactured tobacco   112 HS1507 Soya-bean oil and its fractions",
"v": 36.0
},
{
"hs": "HS2304",
"t": "Solid residues from soya-bean oil   82 HS2203 Beer made from malt",
"v": 34.0
},
{
"hs": "HS1701",
"t": "Cane or beet sugar   73 HS1001 Wheat and meslin",
"v": 29.0
},
{
"hs": "HS1905",
"t": "Bread, pastry,  other bakers' wares   52 HS0207 Meat and edible offal of poultry",
"v": 22.0
},
{
"hs": "HS7402",
"t": "Unrefined copper  5 609 HS2710 Petroleum oils, other than crude",
"v": 538.0
},
{
"hs": "HS7403",
"t": "Refined copper and copper alloys  1 967 HS3102 Nitrogenous fertilisers",
"v": 253.0
},
{
"hs": "HS7202",
"t": "Ferro-alloys   152 HS3004 Medicaments in measured doses",
"v": 216.0
},
{
"hs": "HS2716",
"t": "Electrical energy   131 HS2603 Copper ores and concentrates",
"v": 196.0
},
{
"hs": "HS2523",
"t": "Portland cement, aluminous cement   127 HS8704 Motor vehicles for goods transport",
"v": 192.0
}
]
},
"Zimbabwe": {
"aus": 6586.0,
"bip": 33020.0,
"bipJahr": 2022,
"ein": 8628.0,
"name": "Zimbabwe",
"pAus": [
{
"l": "South Africa",
"p": 41.8
},
{
"l": "United Arab Emirates",
"p": 32.3
},
{
"l": "China",
"p": 8.9
},
{
"l": "European Union",
"p": 6.0
},
{
"l": "Mozambique",
"p": 2.9
}
],
"pEin": [
{
"l": "South Africa",
"p": 40.5
},
{
"l": "China",
"p": 13.9
},
{
"l": "Singapore",
"p": 13.6
},
{
"l": "Mozambique",
"p": 3.8
},
{
"l": "Mauritius",
"p": 3.7
}
],
"pJahr": 2022,
"restAus": 8.1,
"restEin": 24.6,
"seite": 398,
"wAus": {
"agrar": 18.1,
"energie": 47.5,
"industrie": 7.7,
"sonst": 26.7
},
"wEin": {
"agrar": 15.3,
"energie": 20.9,
"industrie": 63.8,
"sonst": 0.0
},
"wJahr": 2021,
"waren": [
{
"hs": "HS2401",
"t": "Unmanufactured tobacco   926 HS1507 Soya-bean oil and its fractions",
"v": 290.0
},
{
"hs": "HS5201",
"t": "Cotton, not carded or combed   41 HS1006 Rice",
"v": 155.0
},
{
"hs": "HS2403",
"t": "Other manufactured tobacco   39 HS1001 Wheat and meslin",
"v": 101.0
},
{
"hs": "HS2402",
"t": "Cigars, cheroots, cigarillos   32 HS2304 Solid residues from soya-bean oil",
"v": 51.0
},
{
"hs": "HS1701",
"t": "Cane or beet sugar   26 HS1511 Palm oil and its fractions",
"v": 51.0
},
{
"hs": "HS7108",
"t": "Gold  1 992 HS2710 Petroleum oils, other than crude",
"v": 1335.0
},
{
"hs": "HS2604",
"t": "Nickel ores and concentrates  1 102 HS8704 Motor vehicles for goods transport",
"v": 254.0
},
{
"hs": "HS7501",
"t": "Nickel mattes, nickel oxide sinters  1 025 HS3102 Nitrogenous fertilisers",
"v": 238.0
},
{
"hs": "HS7202",
"t": "Ferro-alloys   364 HS2716 Electrical energy",
"v": 204.0
},
{
"hs": "HS7110",
"t": "Platinum   182 HS8474 Machinery for sorting, screening",
"v": 165.0
}
]
},
"eSwatini": {
"aus": 2034.0,
"bip": 4462.0,
"bipJahr": 2022,
"ein": 1969.0,
"name": "Eswatini",
"pAus": [
{
"l": "South Africa",
"p": 67.9
},
{
"l": "Kenya",
"p": 5.6
},
{
"l": "Nigeria",
"p": 3.9
},
{
"l": "Mozambique",
"p": 3.4
},
{
"l": "European Union",
"p": 3.2
}
],
"pEin": [
{
"l": "South Africa",
"p": 72.4
},
{
"l": "China",
"p": 9.7
},
{
"l": "European Union",
"p": 3.9
},
{
"l": "India",
"p": 2.7
},
{
"l": "Mozambique",
"p": 1.6
}
],
"pJahr": 2021,
"restAus": 16.0,
"restEin": 9.7,
"seite": 124,
"wAus": {
"agrar": 36.1,
"energie": 1.4,
"industrie": 62.4,
"sonst": 0.1
},
"wEin": {
"agrar": 22.4,
"energie": 19.5,
"industrie": 58.1,
"sonst": 0.1
},
"wJahr": 2021,
"waren": [
{
"hs": "HS1701",
"t": "Cane or beet sugar   403 HS1005 Maize (corn)",
"v": 41.0
},
{
"hs": "HS1702",
"t": "Other sugars   33 HS1006 Rice",
"v": 24.0
},
{
"hs": "HS1704",
"t": "Sugar confectionery   33 HS1001 Wheat and meslin",
"v": 19.0
},
{
"hs": "HS2207",
"t": "Alcohol of 80% or more volume   30 HS2202 Waters containing added sugar",
"v": 17.0
},
{
"hs": "HS1902",
"t": "Pasta   26 HS1904 Prepared foods from cereals",
"v": 15.0
},
{
"hs": "HS3302",
"t": "Odoriferous substances and mixture   619 HS2710 Petroleum oils, other than crude",
"v": 184.0
},
{
"hs": "HS3824",
"t": "Prepared binders for foundry moulds   267 HS2716 Electrical energy",
"v": 155.0
},
{
"hs": "HS4407",
"t": "Wood sawn or chipped lengthwise   87 HS9018 Instruments for medical sciences",
"v": 57.0
},
{
"hs": "HS6203",
"t": "Men's or boys' suits   68 HS3004 Medicaments in measured doses",
"v": 48.0
},
{
"hs": "HS6204",
"t": "Women's or girls' suits   60 HS5210 Woven less than 85% cotton small",
"v": 46.0
}
]
}
};
