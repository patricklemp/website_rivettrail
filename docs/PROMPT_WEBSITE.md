# Auftrag: Website für rivettrail.de

Baue die erste Website für **RivetTrail**. Sie soll die Idee in wenigen Sekunden verständlich machen, Vertrauen schaffen und zu genau einer Handlung führen: Kontakt aufnehmen für ein Pilotgespräch. Zusätzlich kann man den Onepager als PDF herunterladen.

Leitsatz für alle Entscheidungen: **Weniger ist mehr.** Lieber ein Abschnitt weniger als ein Abschnitt, der nur Platz füllt.

Arbeite in drei Schritten:
1. Lies diesen Prompt komplett und die Dateien unter „Vorhandenes Material“. Zeig mir dann kurz deinen Plan (Dateistruktur, Abschnitte, offene Fragen), bevor du baust.
2. Baue die Seite.
3. Prüfe das Ergebnis gegen die Abnahme-Checkliste am Ende und berichte, was erfüllt ist und was nicht.

---

## 1. Worum es geht

RivetTrail führt zusammen, was ein Industriebetrieb über seine Maschinen weiß: Daten aus ERP, MES, Instandhaltung, Excel-Listen, Handbüchern und Serviceberichten. Daraus entsteht eine Akte pro Anlage, für jeden Hersteller. Jede Angabe hat eine Quelle (Dokument, Seite, Zeile). Doppelte Anlagen und widersprüchliche Angaben werden erkannt und von Menschen entschieden, nicht still überschrieben.

**Zielgruppe:** Leitung Instandhaltung, Werksleitung und Technik in Fertigungsbetrieben mit 100 bis 2.000 Mitarbeitern im deutschsprachigen Raum. Pragmatische Leute, wenig Zeit, skeptisch gegenüber Marketing-Sprache.

**Stand:** Frühphase. Es gibt einen Prototyp, aber noch keine Kunden. Gesucht werden Pilotbetriebe. Die Website darf nichts behaupten, was es noch nicht gibt.

---

## 2. Was gute Websites gemeinsam haben (gilt hier als Regel)

1. **In fünf Sekunden klar:** Wer seid ihr, was macht ihr, für wen. Die Überschrift nennt das Ergebnis für den Kunden, nicht die Technik. (Nielsen Norman Group: „Communicate who you are and what you do“, „Keep homepages simple“.)
2. **Ein Ziel, eine Haupt-Handlung:** Ein primärer Button, der oben, in der Mitte und am Ende gleich lautet. Keine konkurrierenden Aufrufe.
3. **Zeigen statt behaupten:** Konkrete Beispiele aus der Arbeit der Zielgruppe statt Schlagworten.
4. **Klare Wörter:** Navigation und Buttons sagen genau, was passiert („Onepager herunterladen“, nicht „Mehr erfahren“).
5. **Mobil zuerst:** Die Seite wird für 375 px Breite gedacht und skaliert nach oben.
6. **Schnell:** Core Web Vitals im grünen Bereich (LCP ≤ 2,5 s, INP ≤ 200 ms, CLS ≤ 0,1, gemessen am 75. Perzentil, laut web.dev).
7. **Barrierearm:** Mindestens WCAG 2.2 AA als Qualitätsziel (Kontrast, Tastatur, Fokus, Beschriftungen).
8. **Vertrauen durch Ehrlichkeit:** Zahlen nur mit Quelle, keine erfundenen Kundenlogos, Zitate oder Statistiken. Impressum und Datenschutz leicht erreichbar.
9. **Ruhe:** Viel Weißraum, wenige Elemente, keine Effekte um der Effekte willen.

---

## 3. Seitenstruktur

Eine einzige Seite (`index.html`) plus `impressum.html` und `datenschutz.html`. Keine weiteren Unterseiten.

**Kopfzeile (klebend, schlank):** Logo links. Rechts maximal drei Anker-Links: „So funktioniert es“, „Pilot“, „Kontakt“ und der primäre Button „Pilotgespräch anfragen“. Auf dem Handy: Logo und Button sichtbar, die Links in einem Menü mit dem sichtbaren Wort „Menü“ (nicht nur ☰). Aktiver Abschnitt wird in der Navigation markiert (Farbe und Schriftschnitt, nicht nur Farbe).

### Abschnitt 1: Hero
- Überschrift (H1): **„Alles über Ihre Maschinen. An einem Ort.“** Der zweite Satz in Akzentblau.
- Unterzeile: „RivetTrail führt zusammen, was in ERP, MES, Instandhaltung, Excel-Listen und Handbüchern steckt. **Eine Akte pro Anlage, für jeden Hersteller. Jede Angabe mit Quelle.**“
- Primärer Button: „Pilotgespräch anfragen“ (führt zu Abschnitt Kontakt).
- Sekundärer Link: „Onepager herunterladen (PDF, 2 Seiten)“.

### Abschnitt 2: Die Maschine steht. Wo kommen die Antworten her?
Vergleich als echte, zugängliche Tabelle (`<table>` mit `<th scope>`), auf dem Handy als gestapelte Karten.

| Frage | Heute | Mit RivetTrail |
|---|---|---|
| Welches Teil ist verbaut? | ERP, Netzlaufwerk, Servicebericht | In der Akte, mit Fundstelle. Abweichungen sind markiert. |
| Was wurde zuletzt geändert? | Schichtbuch, E-Mails, nachfragen | Historie mit Datum und Beleg. |
| Wer kennt sich aus? | Rundruf | Ansprechpartner je Anlage. |
| Was hängt dran? | Weiß der Meister | Vor- und nachgelagerte Anlagen, Ausweichanlage, Versorgung. |

Die Spalte „Mit RivetTrail“ ist visuell die stärkere (dunklere Schrift, Schnitt 500), „Heute“ ist grau.

### Abschnitt 3: So funktioniert es
Überschrift: „Neue Anlage? Dokumente rein, prüfen, fertig.“
Vier nummerierte Schritte (echte Reihenfolge, deshalb `<ol>`), jeweils Titel, ein Satz und ein Beispiel in Monospace:
1. **Dokumente hochladen**: Foto vom Typenschild, Protokolle, Listen. Beispiel: `Typenschild_CNC.jpg`
2. **Angaben werden erkannt**: Hersteller, Typ, Seriennummer, Steuerung. Jede Angabe mit Fundstelle. Beispiel: `DEMO-1850-0317`, aus Typenschild, Zeile 3
3. **Automatisch geprüft**: Gibt es die Anlage schon? Passen die Angaben zum Bestand? Beispiel (orange): „Diese Maschine gibt es schon. Dokumente bei CNC-003 ergänzen.“
4. **Freigeben**: Auf Wunsch prüft eine zweite Person. Erst dann ist die Anlage im Bestand.

Darunter drei kurze Punkte „Qualitätssicherung, die mitläuft“: **Keine Dubletten** (Gibt es die Anlage schon, wird es gemeldet.) · **Keine stillen Fehler** (Widersprüche werden markiert, nicht überschrieben.) · **Alles nachvollziehbar** (Jede Angabe mit Quelle, jede Änderung mit Person und Datum.)

### Abschnitt 4: Warum es sich lohnt
Drei Nutzen nebeneinander (Handy: untereinander):
- **Kürzere Stillstände**: Die Fehlersuche beginnt sofort, nicht mit der Suche nach Unterlagen.
- **Verlässliche Daten**: Dubletten und Widersprüche werden erkannt, bevor sie Schaden anrichten.
- **Wissen bleibt**: Was Kollegen im Kopf haben, steht in der Akte. Auch nach dem Ruhestand.

Darunter zwei Zahlen, jeweils mit sichtbarer Quelle direkt an der Zahl (verlinkt):
- **67 %** der Industriebetriebe in Deutschland stehen mindestens einmal im Monat ungeplant still. Quelle: ABB „Value of Reliability“, Sapio Research, Juli 2023 (https://new.abb.com/news/de/detail/116577/ungeplante-stillstande-kosten-deutsche-unternehmen-147000-eur-pro-stunde)
- **13,4 Mio.** Erwerbspersonen erreichen in den nächsten 15 Jahren das Rentenalter. Quelle: Statistisches Bundesamt, August 2025 (https://www.destatis.de/DE/Presse/Pressemitteilungen/2025/08/PD25_N048_13.html)

### Abschnitt 5: Pilot und Kontakt (id="kontakt")
- Überschrift: „Start mit Ihren zehn kritischsten Maschinen.“
- Text: „Aus den Dateien, die Sie schon haben. Ohne IT-Projekt, ohne Systemzugriff. Wir suchen Pilotbetriebe.“
- Was im Pilot passiert, als kurze Liste mit drei Punkten: „Sie schicken Exporte und Dokumente zu zehn Maschinen.“ · „Wir bauen daraus die Akten und zeigen Dubletten und Widersprüche.“ · „Gemeinsam entscheiden Sie, ob es Ihnen hilft.“
- Kontakt, so einfach wie möglich:
  - Primärer Button „Pilotgespräch anfragen“ als `mailto:kontakt@rivettrail.de` mit vorausgefülltem Betreff „Pilotgespräch RivetTrail“ und einem kurzen Text-Gerüst im Mail-Body (Firma, Anzahl Anlagen, eingesetztes ERP).
  - Die E-Mail-Adresse zusätzlich als sichtbarer, markierbarer Text mit „Kopieren“-Button.
  - Platzhalter für Name, Rolle und Telefon des Ansprechpartners: `[NAME]`, `[ROLLE]`, `[TELEFON]`. Nichts erfinden.
  - Erwartung setzen: „Wir antworten innerhalb von zwei Werktagen.“ (als Platzhalter markieren, ich bestätige das.)
  - **Kein Kontaktformular in Version 1.** Die Seite läuft auf einfachem Webspace ohne Backend. Falls du ein Formular für sinnvoll hältst, schlage es vor, baue es aber nicht ungefragt. Wenn später eins kommt: höchstens vier Felder (Name, geschäftliche E-Mail, Firma, Nachricht), Spam-Schutz per Honeypot, kein reCAPTCHA.
- Zweiter Button: „Onepager herunterladen (PDF, 2 Seiten)“.

### Fußzeile
Logo, eine Zeile „Ergänzt ERP, MES und Instandhaltungssoftware. Ersetzt keines davon.“, Links „Impressum“, „Datenschutz“, „Onepager (PDF)“, E-Mail-Adresse. © 2026 RivetTrail.

---

## 4. Design

Die Website übernimmt die Gestaltung des Onepagers. Öffne `assets/RivetTrail_Onepager.pdf` und orientiere dich an Ruhe, Typografie und Farbeinsatz.

**Farben (als CSS-Variablen):**
- Text `#16191D`, Text gedämpft `#3C424A`, Grau `#5A616B`, Linien `#E3E6EA`, Hintergrund `#FFFFFF`
- Akzent Blau `#0058CC` (Text, Buttons), helles Blau für Flächen `#EAF2FE`, Logo-Punkt `#3D8BFF`
- Datenqualität Orange `#8A4B08` (nur für Beispiele wie „Diese Maschine gibt es schon“)
- Farbe hat immer genau eine Bedeutung. Keine dekorativen Farbverläufe.

**Dunkelmodus:** Unterstützen über `prefers-color-scheme`, mit eigenen, sorgfältig gewählten Werten (nicht einfach invertieren). Kontraste in beiden Modi prüfen.

**Schrift:** IBM Plex Sans (400, 500, 600, 700) und IBM Plex Mono (400, 500) für Beispielwerte. **Selbst gehostet** aus `rivettrail.de/fonts/` (WOFF2), mit `font-display: swap` und `preload` für die zwei wichtigsten Schnitte. Keine Einbindung über Google-Server (Datenschutz, siehe unten).

**Layout:** Maximal 1120 px Inhaltsbreite, Fließtext maximal etwa 65 Zeichen pro Zeile. Großzügiger Weißraum zwischen Abschnitten. Struktur durch feine Linien und Abstände, nicht durch Kästen und Schatten. Höchstens ein farbig hinterlegter Block (der Pilot-Abschnitt in hellem Blau).

**„Modern, aber neu“:** Ein einziges Element, das man nicht von jeder Website kennt und das direkt aus dem Produkt kommt: **Die Website hält sich an ihr eigenes Versprechen „Jede Angabe mit Quelle“.** Jede Zahl und jedes Beispiel hat eine kleine, dezente Quellenmarke. Beim Darüberfahren oder Antippen erscheint die Fundstelle (bei den Statistiken die echte Quelle, bei den Demo-Beispielen „Beispiel aus der Demo“). Das ist das Markenzeichen der Seite. Setze es zurückhaltend um und funktionsfähig per Tastatur.

**Bewegung:** Höchstens ein sanftes Einblenden beim ersten Laden des Heros. Alles muss ohne Animation vollständig lesbar sein, `prefers-reduced-motion` wird respektiert. Keine Scroll-Effekte, kein Parallax, keine Karussells.

**Bilder:** Keine Stockfotos, keine Illustrationen von Robotern oder Zahnrädern, keine Screenshots der Anwendung. Die Seite lebt von Typografie und den konkreten Beispielen.

**Texte:** Deutsch, Sie-Form, kurze Sätze, keine Anglizismen wo es ein gutes deutsches Wort gibt. Keine langen Gedankenstriche (—) im Text. Keine Floskeln wie „innovativ“, „revolutionär“, „KI-gestützt“, „nahtlos“.

---

## 5. Technik

- **Statisch, ohne Framework und ohne Build-Schritt:** HTML, eine CSS-Datei, minimal JavaScript (nur für Menü auf dem Handy, Kopieren-Button, aktiven Navigationspunkt und Quellenmarken). Die Seite muss auch ohne JavaScript vollständig nutzbar sein.
- Keine externen Anfragen: keine CDNs, keine externen Schriften, kein Tracking, keine eingebetteten Dienste. Dadurch werden keine Cookies gesetzt.
- Semantisches HTML: `header`, `nav`, `main`, `section` mit Überschriften in richtiger Reihenfolge, `footer`. `lang="de"`.
- Meta-Angaben: Title, Description, Open-Graph-Tags (inklusive eines schlichten OG-Bilds 1200×630 als PNG im Stil des Onepagers), `theme-color`, Canonical-URL `https://rivettrail.de/`.
- Favicon: `assets/favicon.svg`, zusätzlich ein 180×180-PNG als Apple-Touch-Icon (aus dem SVG erzeugen).
- `robots.txt` und `sitemap.xml` (nur die drei Seiten).
- Download: `downloads/RivetTrail_Onepager.pdf`, verlinkt mit `download`-Attribut und Hinweis auf Format und Größe.
- Eine einfache `404.html` im gleichen Stil.
- Ordnerstruktur zum Hochladen auf normalen Webspace, zum Beispiel:
  ```
  website/site/
    index.html, impressum.html, datenschutz.html, 404.html
    robots.txt, sitemap.xml
    css/style.css
    js/main.js
    fonts/…
    assets/logo.svg, favicon.svg, …
    downloads/RivetTrail_Onepager.pdf
  ```

---

## 6. Rechtliches (Deutschland)

Ich bin für die Inhalte verantwortlich und lasse sie prüfen. Du baust die Seiten mit klar markierten Platzhaltern und erfindest keine Rechtstexte.

- **Impressum** nach § 5 DDG: Name bzw. Firma, ladungsfähige Anschrift, E-Mail, Telefon, gegebenenfalls Handelsregister und USt-IdNr. Alles als `[PLATZHALTER]`. Erreichbar aus jeder Seite über die Fußzeile mit der Beschriftung „Impressum“.
- **Datenschutzerklärung**: Gerüst mit Platzhaltern für Verantwortlichen, Hosting-Anbieter und Server-Logfiles, Kontakt per E-Mail. Hinweis im Text, dass keine Cookies, kein Tracking und keine externen Dienste verwendet werden. Ich ersetze den Text durch eine geprüfte Fassung.
- **Schriften lokal:** Das LG München hat 2022 (Az. 3 O 17493/20) die dynamische Einbindung von Google Fonts ohne Einwilligung als Datenschutzverstoß gewertet. Deshalb nur selbst gehostete Schriften.
- **Cookie-Banner:** Nicht einbauen, solange die Seite keine Cookies setzt und nichts nachlädt. Falls du doch etwas einbaust, das Cookies oder externe Anfragen erzeugt, sag es mir ausdrücklich.
- **Barrierefreiheit:** Reine B2B-Angebote fallen nicht unter das Barrierefreiheitsstärkungsgesetz. Wir halten trotzdem WCAG 2.2 AA als Qualitätsziel ein.

---

## 7. Vorhandenes Material

Alles liegt im Ordner `website/` dieses Projekts:
- `website/assets/RivetTrail_Onepager.pdf`: der aktuelle Onepager (2 Seiten A4). In `downloads/` übernehmen.
- `website/assets/logo.svg` (Logo mit Schriftzug, für helle Flächen), `logo-inverted.svg` (für dunkle Flächen), `logo-mark.svg` und `logo-mark-inverted.svg` (nur das Zeichen), `favicon.svg`. Die Schrift im Logo ist bereits in Pfade umgewandelt.
- `website/rivettrail.de/fonts/`: IBM Plex Sans und Mono als WOFF2.
- `website/rivettrail.de/`: **alte Version, inhaltlich überholt** (andere Positionierung, altes Logo). Nur die Schriften daraus übernehmen, alles andere ignorieren.

---

## 8. Was du nicht tun sollst

- Keine erfundenen Kundenlogos, Referenzen, Testimonials, Preise, Kennzahlen oder Funktionen.
- Keine Zahlen ohne Quelle.
- Keine Stockfotos, keine generischen Icons-Reihen, keine Kästen mit Schatten für jeden Abschnitt.
- Keine Labels wie „Mehr erfahren“, „Jetzt starten“, „Hier klicken“.
- Kein Chat-Widget, kein Newsletter-Popup, kein Cookie-Banner, kein Tracking.
- Keine Funktionen versprechen, die der Prototyp nicht hat (zum Beispiel Live-Anbindung an ERP oder MES, Zustandsüberwachung, KI-Prognosen).

---

## 9. Abnahme-Checkliste

Prüfe am Ende jeden Punkt und berichte das Ergebnis:

- [ ] Ein Fremder versteht in fünf Sekunden, was RivetTrail ist und für wen.
- [ ] Genau ein primärer Aufruf („Pilotgespräch anfragen“), an allen Stellen gleich formuliert.
- [ ] Onepager-Download funktioniert und ist im Hero, im Kontaktabschnitt und in der Fußzeile erreichbar.
- [ ] E-Mail-Adresse sichtbar, markierbar und kopierbar, `mailto` mit Betreff und Text-Gerüst.
- [ ] Bei 375 px Breite: nichts abgeschnitten, kein seitliches Scrollen, Tippflächen mindestens 44×44 px.
- [ ] Menü auf dem Handy mit dem Wort „Menü“, bedienbar per Tastatur, aktiver Abschnitt markiert.
- [ ] Kontrast mindestens 4,5:1 für Text in hellem und dunklem Modus; sichtbarer Fokus überall.
- [ ] Tabelle ist eine echte Tabelle mit Spaltenköpfen; Schritte sind eine geordnete Liste.
- [ ] Seite vollständig lesbar ohne JavaScript und mit `prefers-reduced-motion`.
- [ ] Keine einzige externe Anfrage (im Netzwerk-Tab prüfen), keine Cookies.
- [ ] Lighthouse (mobil): Performance, Barrierefreiheit, Best Practices und SEO jeweils mindestens 95. LCP ≤ 2,5 s, CLS ≤ 0,1.
- [ ] Impressum und Datenschutz von jeder Seite mit einem Klick erreichbar; alle Platzhalter als `[PLATZHALTER]` erkennbar.
- [ ] Title, Description, Open-Graph-Bild, Favicon, `robots.txt`, `sitemap.xml`, `404.html` vorhanden.
- [ ] Jede Statistik mit verlinkter Quelle; alle Demo-Werte als Beispiele gekennzeichnet.
- [ ] Liste aller Platzhalter, die ich noch ausfüllen muss, am Ende deines Berichts.
