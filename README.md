# rivettrail.de

Statische Website von RivetTrail, Deutsch (`/`) und Englisch (`/en/`). Kein Framework, kein Build-Schritt beim Deployen.

## Ordner

| Pfad | Inhalt |
|---|---|
| `site/` | Die fertige Website. **Nur dieser Ordner wird ausgeliefert.** |
| `site/_headers` | Sicherheits-Header für Cloudflare Pages (CSP, HSTS, X-Frame-Options …) |
| `site/downloads/` | Onepager als PDF (Deutsch und Englisch) |
| `tools/generator/` | Erzeugt die HTML-Seiten, `_headers`, `sitemap.xml` und `robots.txt` in `site/` |
| `tools/onepager/` | Erzeugt die beiden Onepager-PDFs in `site/downloads/` |
| `docs/` | Ursprünglicher Auftrag für die Website |

## Deployen auf Cloudflare Pages

Projekt mit diesem Git-Repository verbinden und einstellen:

| Feld | Wert |
|---|---|
| Framework preset | None |
| Build command | leer lassen |
| Build output directory | `site` |
| Root directory | leer lassen |

Cloudflare liefert die Seiten ohne `.html` aus (`/impressum`, `/en/legal-notice`) und leitet `…/x.html` auf `…/x` um. Unbekannte Adressen bekommen die passende 404-Seite (`/404.html`, unter `/en/` die englische).

## Änderungen machen

Texte und Aufbau stehen in `tools/generator/` (`*.body.html` für Deutsch, `en/*.body.html` für Englisch, gemeinsamer Kopf und Fuß in `build.py`). Gestaltung in `site/css/style.css`, Verhalten in `site/js/main.js`.

```bash
python3 tools/generator/build.py          # Seiten neu erzeugen
python3 tools/generator/serve.py 8080     # lokal testen wie auf Cloudflare: http://127.0.0.1:8080/
```

Onepager neu erzeugen (benötigt Node.js und `playwright-core`):

```bash
cd tools/onepager
npm i playwright-core
CHROME_PATH="/Pfad/zu/Chrome" node build.js
```

Wenn sich die Größe eines PDFs ändert, die KB-Angabe am Download-Link in `tools/generator/index.body.html` bzw. `en/index.body.html` anpassen und `build.py` erneut ausführen.

Wird das kleine Inline-Skript im `<head>` geändert, berechnet `build.py` den CSP-Hash in `_headers` automatisch neu.

## Vor dem Livegang

- Impressum und Datenschutz: allgemeine Vorlagen, Angaben in [eckigen Klammern] ausfüllen (Vor- und Nachname, Anschrift, Telefon); nach Firmengründung Firma, Rechtsform, Vertretung, Registereintrag und ggf. USt-IdNr. ergänzen und rechtlich prüfen lassen. Dateien: `tools/generator/impressum.body.html`, `datenschutz.body.html`, `en/legal-notice.body.html`, `en/privacy.body.html`.
