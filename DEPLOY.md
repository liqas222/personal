# Deployen — Copy & Paste

Der Atlas ersetzt das Vorgängerprojekt **hinter Port 80**. Die öffentliche
Adresse bleibt dadurch unverändert:

```
https://ubuntu-s-1vcpu-1gb-fra1.tailde01ee.ts.net:8443/
```

> ⚠️ **Kein einziger Tailscale-Befehl in dieser Anleitung.** Der Funnel auf
> 8443 zeigt schon auf `127.0.0.1:80` — es wird nur ausgetauscht, was dort
> antwortet. `tailscale serve` oder `tailscale funnel` würde die Freigabe von
> **SwissIntel** zerstören. Finger weg.

## 1. Alte Daten sichern (zuerst!)

Im Vorgängerprojekt steckt deine Trading-Datenbank. Sie liegt nur auf dem
Server, das Repo ist bereits geleert:

```bash
sudo cp /opt/supergehirn/data/brain.db ~/brain-backup-$(date +%F).db && ls -lh ~/brain-backup-*.db
```

## 2. Atlas installieren

```bash
sudo git clone -b claude/private-daily-tracker-lewtsg https://github.com/liqas222/personal.git /opt/atlas
cd /opt/atlas
sudo cp config.example.json config.json
sudo nano config.json          # "auth_token" auf dein Passwort setzen, Port 80 lassen
```

`config.json` ist striktes JSON: jeder Wert in `"`, kein Komma nach dem letzten
Eintrag. Vor dem Start prüfen:

```bash
python3 -c "import json;json.load(open('/opt/atlas/config.json'));print('JSON ok')"
```

## 3. Umschalten

Der alte Dienst muss Port 80 freigeben, bevor der neue ihn belegen kann:

```bash
sudo systemctl disable --now supergehirn
sudo cp /opt/atlas/deploy/atlas.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now atlas
sudo systemctl status atlas --no-pager | head -6
```

## 4. Prüfen

```bash
curl -s -o /dev/null -w "ohne Passwort: %{http_code} (401 erwartet)\n" http://127.0.0.1/
curl -s -o /dev/null -w "mit Passwort:  %{http_code} (200 erwartet)\n" -u x:DEIN_PASSWORT http://127.0.0.1/
tailscale funnel status          # nur lesen: SwissIntel muss weiter "Funnel on" auf 443 zeigen
```

Dann die URL im Browser öffnen. Benutzername ist egal, Passwort ist der
`auth_token`. Falls noch die alte Seite erscheint: Strg+Shift+R.

## Konkurs Deal Radar

Läuft im selben Dienst mit, unter `/radar/`. Kein zweiter Port, kein
zweiter Dienst, kein Eingriff in Tailscale. Nach dem Update ist er da.

### Live-Abruf: erst prüfen, dann einschalten

Der Radar kann die Meldungen selbst holen — aus dem **Amtsblattportal**
(SHAB plus Kantonsblätter, offene Schnittstelle, kein Schlüssel). Der
Adapter läuft gegen den echten Dienst — geprüft auf diesem Server, nicht
in der Entwicklungsumgebung, wo `amtsblattportal.ch` gesperrt ist.
Deshalb nach jedem Update nachsehen, was wirklich zurückkommt:

```bash
cd /opt/atlas && python3 -m radar.pruefen
```

Das ändert nichts, es liest nur. Vier Schritte: Rubrikliste, Trefferliste,
Detail-XML mit Feldnamen, voller Adapterlauf. Weichen Rubrikcodes oder
Feldnamen ab, steht es dort und lässt sich in `radar/config.json` bzw. in
`radar/quellen/amtsblatt.py` nachziehen.

Erst wenn Schritt 4 „die Schnittstelle funktioniert" meldet, einschalten:

```bash
cd /opt/atlas && python3 -m radar.einrichten --an --kantone deutsch && sudo systemctl restart atlas
```

Das ist ein Befehl, kein Textbaustein — bestehende Einträge in
`radar/config.json` (Port, `auth_token`, eigene Adressen) bleiben
erhalten, es wird nur ergänzt.

`--kantone deutsch` nimmt die 19 deutschsprachigen Kantone. Das hat einen
technischen Grund: die Klassierung sucht deutsche Wörter („Garage",
„Transport") — bei einer französischen Meldung greift keines, der Fall
bekäme Score 0 und fiele still durch. `--kantone alle` geht trotzdem,
dann sortiert dein Auge statt des Radars. `--kantone ZH,SG` nimmt genau
diese.

Der erste Abruf holt **30 Tage**, jeder weitere ab dem letzten Lauf mit
Daten minus drei Tagen Überlappung. Vergangenes nachholen:

```bash
cd /opt/atlas && python3 -m radar.lauf --abrufen --tage 90
```

Ohne Angabe läuft der Abruf alle 12 Stunden von selbst. Wer lieber nur auf
Knopfdruck abruft, nimmt `--kein-auto`. Abschalten: `--aus`. Ohne jede
Option zeigt der Befehl nur den Stand an. Die Löschfrist für unbearbeitete
Fälle setzt `--loeschfrist 730` (0 = nie).

Der alte SHAB-Adapter bleibt abgeschaltet und unverifiziert; er wird nicht
gebraucht. Für den PDF-Import:

```bash
sudo pip3 install pypdf     # optional, nur für PDF
```

Die Datenbank liegt unter `/opt/atlas/radar/daten/radar.db` und ist von git
ausgenommen. Sichern, wenn Fälle bearbeitet wurden:

```bash
cp /opt/atlas/radar/daten/radar.db ~/radar-backup-$(date +%F).db
```

## Der Server ruft nichts mehr ab

Seit dem Umbau zum Quiz liefert `serve.py` für den **Atlas** nur noch
Dateien aus: kein Telegram, keine Feeds, keine Hintergrundschleifen. Die
einzige Ausnahme ist der Amtsblatt-Abruf des Radars, und der ist
ausgeschaltet, bis er in `radar/config.json` eingeschaltet wird. In
`config.json` zählt nur noch `host`, `port` und `auth_token`. Alte Einträge
wie `tg_token` oder `web_quellen` schaden nicht, werden aber ignoriert.

## Update (nach jedem Push)

```bash
cd /opt/atlas && sudo git pull && sudo systemctl restart atlas && sudo systemctl status atlas --no-pager | head -4
```

## Zurück zum alten Projekt

Nichts wurde gelöscht, `/opt/supergehirn` liegt unverändert da:

```bash
sudo systemctl disable --now atlas && sudo systemctl enable --now supergehirn
```

## Logs

```bash
sudo journalctl -u atlas -f
```
