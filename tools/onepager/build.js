// RivetTrail Onepager v4: Gestaltung exakt wie das Original (assets/RivetTrail_Onepager.pdf),
// Texte aktualisiert (Wissensbasis). Maße aus dem Original vermessen (pt * 4/3 = CSS-px).
// Aufruf: CHROME_PATH=<Chrome> node build.js [outDir]   (benötigt: npm i playwright-core)
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright-core');

const FONTS = path.join(__dirname, 'fonts');
const OUT = process.argv[2] || path.join(__dirname, '../../site/downloads');
const CHROME = process.env.CHROME_PATH; // Pfad zu Chrome/Chromium, z. B. aus ~/Library/Caches/ms-playwright
if (!CHROME) { console.error('Bitte CHROME_PATH setzen (Pfad zu Chrome/Chromium).'); process.exit(1); }
const NB = ' ';

function html(t) {
  const ff = (fam, file, w) => `@font-face{font-family:"${fam}";src:url("file://${FONTS}/${file}") format("woff2");font-weight:${w};font-style:normal;font-display:block;}`;
  const logo = `<span class="logo"><span class="logo-sq" aria-hidden="true"><span class="r">R</span><span class="d"></span></span><span class="logo-word">RivetTrail</span></span>`;
  return `<!doctype html>
<html lang="${t.lang}">
<head>
<meta charset="utf-8">
<title>${t.title}</title>
<meta name="description" content="${t.desc}">
<meta name="author" content="RivetTrail">
<style>
${ff('IBM Plex Sans', 'ibm-plex-sans-latin-400-normal.woff2', 400)}
${ff('IBM Plex Sans', 'ibm-plex-sans-latin-500-normal.woff2', 500)}
${ff('IBM Plex Sans', 'ibm-plex-sans-latin-600-normal.woff2', 600)}
${ff('IBM Plex Sans', 'ibm-plex-sans-latin-700-normal.woff2', 700)}
${ff('IBM Plex Mono', 'ibm-plex-mono-latin-400-normal.woff2', 400)}
${ff('IBM Plex Mono', 'ibm-plex-mono-latin-500-normal.woff2', 500)}
@page { size: A4; margin: 0; }
:root {
  --text: #16191D; --muted: #3C424A; --gray: #5A616B; --foot: #767C85;
  --line: #E3E6EA; --accent: #0058CC; --surface: #EAF2FE; --orange: #8A4B08;
  --sans: "IBM Plex Sans", Arial, sans-serif; --mono: "IBM Plex Mono", Menlo, monospace;
}
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body { background: #fff; }
body { font-family: var(--sans); color: var(--text); -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.page { position: relative; width: 210mm; height: 297mm; padding: 0 56px; overflow: hidden; break-after: page; }
.page:last-child { break-after: auto; }
b, strong { font-weight: 600; color: var(--text); }

/* Kopf */
.top { position: absolute; left: 56px; right: 56px; top: 45px; height: 24px; display: flex; justify-content: space-between; align-items: center; }
.logo { display: flex; align-items: center; gap: 9px; }
.logo-sq { position: relative; display: block; width: 24px; height: 24px; border-radius: 5px; background: #16191D; }
.logo-sq .r { position: absolute; left: 6px; top: 4.2px; color: #fff; font: 700 15px/15px var(--sans); }
.logo-sq .d { position: absolute; left: 15.4px; top: 14px; width: 3.8px; height: 3.8px; border-radius: 50%; background: #3D8BFF; }
.logo-word { font: 700 16px/1 var(--sans); color: var(--text); letter-spacing: -0.005em; }
.top-note { font: 400 13px/1 var(--sans); color: var(--gray); }

/* Seite 1 */
.h1 { font: 700 50px/51px var(--sans); letter-spacing: -0.022em; color: var(--text); }
.h1 .accent, .accent { color: var(--accent); }
.p1 .h1 { padding-top: var(--h1top); }
.lead { font: 400 18px/27.5px var(--sans); color: var(--muted); }
.p1 .lead { margin-top: 21px; max-width: 610px; }
.h2 { font: 600 20px/26px var(--sans); color: var(--text); letter-spacing: -0.005em; }
.cmp { margin-top: 45px; }
table { width: 100%; border-collapse: collapse; margin-top: 14px; }
th { font: 400 13px/18px var(--sans); color: var(--gray); text-align: left; padding: 0 24px 7px 0; border-bottom: 1px solid var(--line); }
th.rt { color: var(--accent); font-weight: 600; }
td { font: 400 15px/22px var(--sans); padding: 14px 24px 14.5px 0; border-bottom: 1px solid var(--line); vertical-align: top; }
td.q { width: 220px; font-weight: 600; color: var(--text); }
td.today { width: 200.8px; color: var(--gray); }
td.rt { font-weight: 500; color: var(--text); padding-right: 0; }
.ben { display: grid; grid-template-columns: repeat(3, 1fr); column-gap: 28px; margin-top: 63px; }
.ben h3 { font: 600 18px/24px var(--sans); color: var(--text); letter-spacing: -0.003em; }
.ben p { font: 400 15px/22.5px var(--sans); color: var(--muted); margin-top: 5px; }
.stats { position: absolute; left: 56px; right: 56px; top: 951px; border-top: 1px solid var(--line); padding-top: 27px; display: grid; grid-template-columns: var(--statcols, 1fr 1fr); column-gap: 28px; }
.stat { display: flex; align-items: baseline; gap: 14px; }
.stat .num { font: 700 34px/1 var(--sans); color: var(--accent); letter-spacing: -0.02em; white-space: nowrap; }
.stat p { font: 400 14px/21px var(--sans); color: var(--muted); }
.foot { position: absolute; left: 56px; right: 56px; top: 1073px; display: flex; justify-content: space-between; font: 400 12px/16px var(--sans); color: var(--foot); }

/* Seite 2 */
.p2 .h1 { font-size: 42px; line-height: 44px; letter-spacing: -0.02em; padding-top: var(--h1top2); }
.p2 .lead { margin-top: 16px; line-height: 28px; max-width: 620px; }
.steps { list-style: none; margin-top: 58px; border-top: 1px solid var(--line); }
.step { display: grid; grid-template-columns: 52px 324px 1fr; border-bottom: 1px solid var(--line); padding: 10.5px 0 11.5px; }
.step .n { font: 500 16px/23px var(--mono); color: var(--accent); }
.step h3 { font: 600 17px/23px var(--sans); color: var(--text); }
.step p { font: 400 14.5px/22px var(--sans); color: var(--muted); margin-top: 2px; padding-right: 24px; }
.ex { font: 400 13.5px/20px var(--sans); color: var(--gray); padding-top: 2px; }
.ex .m { font-family: var(--mono); }
.ex .id { font: 400 13.5px/20px var(--mono); color: var(--text); }
.ex .warn { font-weight: 600; color: var(--orange); }
.qs { margin-top: 57.5px; }
.qs-grid { display: grid; grid-template-columns: repeat(3, 1fr); column-gap: 32px; margin-top: 16px; }
.qs-grid h3 { font: 600 17px/23px var(--sans); color: var(--text); }
.qs-grid p { font: 400 14.5px/22px var(--sans); color: var(--muted); margin-top: 3.5px; }
.box { position: absolute; left: 56px; right: 56px; top: 941px; background: var(--surface); border-radius: 12px; padding: 20px 26px 20px; display: flex; justify-content: space-between; align-items: flex-end; gap: 24px; }
.box h2 { font: 600 22px/28px var(--sans); color: var(--text); max-width: 340px; letter-spacing: -0.005em; }
.box p { font: 400 14.5px/22px var(--sans); color: var(--muted); margin-top: 7px; max-width: 420px; }
.box .ct { text-align: right; font: 600 14px/21px var(--sans); color: var(--text); white-space: nowrap; padding-bottom: 2px; }
.box .ct a { display: block; font: 400 14px/21px var(--mono); color: var(--accent); text-decoration: none; }
</style>
</head>
<body>

<section class="page p1" style="--h1top:${t.h1top}px${t.statcols ? `;--statcols:${t.statcols}` : ''}">
  <header class="top">${logo}<span class="top-note">rivettrail.de</span></header>
  <div style="height:69px"></div>
  <h1 class="h1">${t.h1a}<br><span class="accent">${t.h1b}</span></h1>
  <p class="lead">${t.lead}</p>

  <div class="cmp">
    <h2 class="h2">${t.cmpH}</h2>
    <table>
      <thead><tr><th></th><th>${t.th[0]}</th><th class="rt">${t.th[1]}</th></tr></thead>
      <tbody>
        ${t.rows.map(r => `<tr><td class="q">${r[0]}</td><td class="today">${r[1]}</td><td class="rt">${r[2]}</td></tr>`).join('\n        ')}
      </tbody>
    </table>
  </div>

  <div class="ben">
    ${t.ben.map(b => `<div><h3>${b[0]}</h3><p>${b[1]}</p></div>`).join('\n    ')}
  </div>

  <div class="stats">
    ${t.stats.map(s => `<div class="stat"><span class="num">${s[0]}</span><p>${s[1]}</p></div>`).join('\n    ')}
  </div>
  <footer class="foot"><span>${t.footnotes}</span><span>${t.overleaf}</span></footer>
</section>

<section class="page p2" style="--h1top2:${t.h1top2}px">
  <header class="top">${logo}<span class="top-note">${t.p2note}</span></header>
  <div style="height:69px"></div>
  <h1 class="h1">${t.p2h1a}<br>${t.p2h1b}</h1>
  <p class="lead">${t.p2lead}</p>

  <ol class="steps">
    ${t.steps.map((s, i) => `<li class="step"><span class="n">0${i + 1}</span><div><h3>${s[0]}</h3><p>${s[1]}</p></div><div class="ex">${s[2]}</div></li>`).join('\n    ')}
  </ol>

  <div class="qs">
    <h2 class="h2">${t.qsH}</h2>
    <div class="qs-grid">
      ${t.qs.map(q => `<div><h3>${q[0]}</h3><p>${q[1]}</p></div>`).join('\n      ')}
    </div>
  </div>

  <div class="box">
    <div><h2>${t.boxH}</h2><p>${t.boxP}</p></div>
    <div class="ct">${t.seeking}<a href="mailto:kontakt@rivettrail.de">kontakt@rivettrail.de</a></div>
  </div>
</section>

</body>
</html>`;
}

const DE = {
  lang: 'de', file: 'RivetTrail_Onepager', title: 'RivetTrail Onepager',
  desc: 'RivetTrail: alles über Ihre Maschinen. Verknüpft und sofort da.',
  h1top: 67, h1top2: 58,
  h1a: 'Alles über Ihre Maschinen.', h1b: 'Verknüpft und sofort da.',
  lead: 'RivetTrail führt zusammen, was in ERP, MES, Instandhaltung, Excel-Listen und Handbüchern steckt. <strong>Eine verknüpfte Wissensbasis für alle Anlagen, für jeden Hersteller. Jede Angabe mit Quelle.</strong>',
  cmpH: 'Die Maschine steht. Wo kommen die Antworten her?',
  th: ['Heute', 'Mit RivetTrail'],
  rows: [
    ['Welches Teil ist verbaut?', 'ERP, Netzlaufwerk, Servicebericht', 'In der Wissensbasis, mit Fundstelle. Abweichungen sind markiert.'],
    ['Was wurde zuletzt geändert?', 'Schichtbuch, E-Mails, nachfragen', 'Historie mit Datum und Beleg.'],
    ['Wer kennt sich aus?', 'Rundruf', 'Ansprechpartner je Anlage.'],
    ['Was hängt dran?', 'Weiß der Meister', 'Vor- und nachgelagerte Anlagen, Ausweichanlage, Versorgung.'],
  ],
  ben: [
    ['Kürzere Stillstände', 'Die Fehlersuche beginnt sofort, nicht mit der Suche nach Unterlagen.'],
    ['Verlässliche Daten', 'Dubletten und Widersprüche werden erkannt, bevor sie Schaden anrichten.'],
    ['Wissen bleibt', 'Was Kollegen im Kopf haben, steht in der Wissensbasis. Auch nach dem Ruhestand.'],
  ],
  stats: [
    [`67${NB}%`, 'der Industriebetriebe haben monatlich ungeplante Stillstände.¹'],
    [`13,4${NB}Mio.`, 'Erwerbspersonen erreichen bis 2039 das Rentenalter.²'],
  ],
  footnotes: '¹ ABB / Sapio Research, 07/2023 · ² Destatis, 08/2025',
  overleaf: 'So funktioniert es: Rückseite',
  p2note: 'So funktioniert es',
  p2h1a: 'Neue Anlage?', p2h1b: 'Dokumente rein, prüfen, <span class="accent">fertig.</span>',
  p2lead: '<strong>Niemand tippt Seriennummern ab.</strong> Und doppelte oder widersprüchliche Angaben fallen auf, bevor sie in der Wissensbasis landen.',
  steps: [
    ['Dokumente hochladen', 'Foto vom Typenschild, Protokolle, Listen.', 'z. B. <span class="m">Typenschild_CNC.jpg</span>'],
    ['Angaben werden erkannt', 'Hersteller, Typ, Seriennummer, Steuerung. Jede Angabe mit Fundstelle.', '<span class="id">DEMO-1850-0317</span><br>aus Typenschild, Zeile 3'],
    ['Automatisch geprüft', 'Gibt es die Anlage schon? Passen die Angaben zur Wissensbasis?', '<span class="warn">Diese Maschine gibt es schon.</span><br>Dokumente bei CNC-003 ergänzen.'],
    ['Freigeben', 'Auf Wunsch prüft eine zweite Person. Erst dann ist die Anlage in der Wissensbasis.', 'Antrag A. Weber, freigegeben von T. Berger'],
  ],
  qsH: 'Qualitätssicherung, die mitläuft',
  qs: [
    ['Keine Dubletten', 'Gibt es die Anlage schon, wird es gemeldet.'],
    ['Keine stillen Fehler', 'Widersprüche werden markiert, nicht überschrieben.'],
    ['Alles nachvollziehbar', 'Jede Angabe mit Quelle, jede Änderung mit Person und Datum.'],
  ],
  boxH: 'Start mit Ihren 10 kritischsten Maschinen.',
  boxP: 'Aus den Dateien, die Sie schon haben. Ohne IT-Projekt, ohne Systemzugriff.',
  seeking: 'Wir suchen Pilotbetriebe.',
};

const EN = {
  lang: 'en-GB', file: 'RivetTrail_Onepager_EN', title: 'RivetTrail one-pager', statcols: '0.82fr 1.18fr',
  desc: 'RivetTrail: your machine knowledge. Connected and on hand.',
  h1top: 67, h1top2: 58,
  h1a: 'Your machine knowledge.', h1b: 'Connected and on hand.',
  lead: 'RivetTrail brings together what sits in ERP, MES, maintenance, Excel lists and manuals. <strong>One linked knowledge base for all machines, for every manufacturer. Every entry with its source.</strong>',
  cmpH: 'The machine is down. Where do the answers come from?',
  th: ['Today', 'With RivetTrail'],
  rows: [
    ['Which part is installed?', 'ERP, network drive, service report', 'In the knowledge base, with its source. Discrepancies are flagged.'],
    ['What was changed last?', 'Shift log, emails, asking around', 'History with date and supporting record.'],
    ['Who knows this machine?', 'Ringing round', 'A named contact for every machine.'],
    ['What depends on it?', 'The foreman knows', 'Upstream and downstream machines, backup machine, utilities.'],
  ],
  ben: [
    ['Shorter downtime', 'Troubleshooting starts straight away, not with a hunt for documents.'],
    ['Reliable data', 'Duplicates and conflicts are caught before they cause damage.'],
    ['Knowledge stays', 'What colleagues carry in their heads is in the knowledge base. Even after they retire.'],
  ],
  stats: [
    ['67%', 'of industrial companies have unplanned downtime every month.¹'],
    [`13.4${NB}million`, 'people in Germany’s workforce will reach retirement age by 2039.²'],
  ],
  footnotes: '¹ ABB / Sapio Research, 07/2023 · ² Destatis, 08/2025',
  overleaf: 'How it works: overleaf',
  p2note: 'How it works',
  p2h1a: 'New machine?', p2h1b: 'Documents in, checked, <span class="accent">done.</span>',
  p2lead: '<strong>Nobody has to key in serial numbers by hand.</strong> And duplicate or conflicting entries are caught before they reach the knowledge base.',
  steps: [
    ['Upload documents', 'Nameplate photo, reports, lists.', 'e.g. <span class="m">Nameplate_CNC.jpg</span>'],
    ['Details are recognised', 'Manufacturer, type, serial number, control system. Every entry with its source.', '<span class="id">DEMO-1850-0317</span><br>from nameplate, line 3'],
    ['Checked automatically', 'Does the machine already exist? Do the details match the knowledge base?', '<span class="warn">This machine already exists.</span><br>Add documents to CNC-003.'],
    ['Approve', 'Optionally, a second person signs off. Only then is the machine in the knowledge base.', 'Requested by A. Weber, approved by T. Berger'],
  ],
  qsH: 'Quality assurance built in',
  qs: [
    ['No duplicates', 'If the machine already exists, you are told.'],
    ['No silent errors', 'Conflicts are flagged, not overwritten.'],
    ['Fully traceable', 'Every entry with its source, every change with person and date.'],
  ],
  boxH: 'Start with your 10 most critical machines.',
  boxP: 'Built from the files you already have. No IT project, no system access.',
  seeking: 'We are looking for pilot sites.',
};

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const b = await chromium.launch({ executablePath: CHROME });
  const page = await b.newPage();
  for (const t of [DE, EN]) {
    const htmlPath = path.join(__dirname, `${t.file}.html`);
    fs.writeFileSync(htmlPath, html(t));
    await page.goto('file://' + htmlPath);
    await page.evaluate(() => document.fonts.ready);
    await page.emulateMedia({ media: 'print' });
    const info = await page.evaluate(() => {
      const out = [];
      document.querySelectorAll('.page').forEach((p, i) => {
        const pr = p.getBoundingClientRect();
        let maxB = 0; p.querySelectorAll('*').forEach(e => { const r = e.getBoundingClientRect(); if (r.height) maxB = Math.max(maxB, r.bottom - pr.top); });
        out.push(`p${i + 1} content bottom ${maxB.toFixed(1)} / ${pr.height.toFixed(1)}`);
        // Kollision Fluss-Inhalt mit absolut positionierten Blöcken
        const abs = p.querySelector('.stats, .box').getBoundingClientRect().top - pr.top;
        const flow = [...p.children].filter(c => getComputedStyle(c).position !== 'absolute');
        const fb = Math.max(...flow.map(c => c.getBoundingClientRect().bottom - pr.top));
        out.push(`p${i + 1} flow bottom ${fb.toFixed(1)} vs abs top ${abs.toFixed(1)}`);
      });
      return out;
    });
    console.log(t.file, info.join(' | '));
    await page.pdf({ path: path.join(OUT, `${t.file}.pdf`), format: 'A4', printBackground: true, preferCSSPageSize: true, tagged: true });
  }
  await b.close();
})();
