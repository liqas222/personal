# Server-Umgebung — geteilter Droplet (WICHTIG, zuerst lesen)

Das alte Projekt ist gelöscht, diese Regeln bleiben: der Droplet
`ubuntu-s-1vcpu-1gb-fra1` (Frankfurt) hostet **mehrere Projekte**. Beim
Deployen/Betrieb niemals die Nachbarn stören:

- **NIEMALS `tailscale serve` ausführen.** Das setzt die Tailscale-Freigabe auf
  „tailnet only" zurück und nimmt das Nachbarprojekt **SwissIntel** (öffentlich
  per Tailscale **Funnel** unter `…tailde01ee.ts.net/intel/`, App auf
  `127.0.0.1:8081`) vom Netz → Ausfall. Ist genau einmal so passiert.
  Falls an Tailscale etwas geändert werden muss, ausschliesslich Funnel und
  ausschliesslich **additiv** auf einem eigenen Port. Danach muss
  `tailscale funnel status` für SwissIntel weiter „Funnel on" auf 443 zeigen,
  **nicht** „(tailnet only)".
- **Nicht anfassen:** Port 80 (anderer Krypto-Bot), Port 8081 und Funnel-Port
  443 (SwissIntel), alles zu `dolflights.ch`, `/root/swissintel`, die Dienste
  `swissintel-bot` / `swissintel-dash`.
- Infrastruktur-Befehle (Tailscale, fremde systemd-Dienste, Firewall) auf
  diesem geteilten Server **immer erst mit dem Besitzer abklären** — nie einfach
  ausführen, auch nicht „mal eben testweise".

## Altlast aus dem gelöschten Projekt

Auf dem Server liegen ggf. noch `/opt/supergehirn` und der systemd-Dienst
`supergehirn`. Beides ist **nicht** aufgeräumt worden — das entscheidet der
Besitzer selbst, wenn klar ist, was das neue Projekt braucht.

## Konventionen

- Secrets nur in gitignorierten Dateien — niemals im Code oder Repo.
