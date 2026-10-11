// RivetTrail Onepager (DE + EN), Gestaltung nach Nutzerentwurf (Kopfband, Beispielkasten, Zahlenband, Schritte, Pilot-Kasten).
// Aufruf: CHROME_PATH=<Chrome> node build.js [outDir]   (benötigt: playwright-core, z. B. über NODE_PATH)
// Standard-Ausgabe: ../../site/downloads/RivetTrail_Onepager.pdf und RivetTrail_Onepager_EN.pdf
const fs = require('fs');
const os = require('os');
const path = require('path');
const { chromium } = require('playwright-core');

const FONTS = path.join(__dirname, 'fonts');
const OUT = process.argv[2] || path.join(__dirname, '../../site/downloads');
const CHROME = process.env.CHROME_PATH;
if (!CHROME) { console.error('Bitte CHROME_PATH setzen (Pfad zu Chrome/Chromium).'); process.exit(1); }
const NB = ' ';

// Icons: einfache Linien-SVGs (24er Raster)
const svg = (d, cls = 'ic') => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${d}</svg>`;
const I = {
  clock: svg('<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>'),
  shield: svg('<path d="M12 3.2 19 6v5.4c0 4.3-2.9 7.9-7 9.4-4.1-1.5-7-5.1-7-9.4V6Z"/><path d="m8.8 12 2.2 2.2 4.2-4.4"/>'),
  book: svg('<rect x="6" y="3.5" width="12" height="17" rx="1.6"/><path d="M9 7.5h6"/>'),
  copy: svg('<rect x="8.5" y="8.5" width="11" height="11" rx="1.8"/><path d="M15.5 8.5V6.3c0-1-.8-1.8-1.8-1.8H6.3c-1 0-1.8.8-1.8 1.8v7.4c0 1 .8 1.8 1.8 1.8h2.2"/>'),
  flag: svg('<path d="M6.5 21V4h10l-2.4 4 2.4 4h-10"/>'),
  history: svg('<path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3L4.5 9"/><path d="M4.5 4.5V9H9"/><path d="M12 8v4l2.8 1.8"/>'),
  doc: svg('<path d="M7 3.5h6.5L18 8v11.5a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-15a1 1 0 0 1 1-1Z"/><path d="M13.5 3.5V8H18"/>', 'ic-s'),
  alert: svg('<circle cx="12" cy="12" r="8.5"/><path d="M12 7.8v5"/><path d="M12 16.2v.1"/>', 'ic-s'),
  image: svg('<rect x="4" y="4" width="16" height="16" rx="2"/><circle cx="9.5" cy="9.5" r="1.6"/><path d="m20 15-4.5-4.5L6 20"/>', 'ic-img'),
  warn: svg('<path d="M12 4 21 19.5H3Z"/><path d="M12 10v4.2"/><path d="M12 16.8v.1"/>', 'ic-warn'),
  check: svg('<path d="m5 12.5 4.2 4.2L19 7"/>', 'ic-check'),
  arrow: svg('<path d="M5 12h13"/><path d="m13 6.5 5.5 5.5-5.5 5.5"/>', 'ic-arrow'),
};

function html(t) {
  const ff = (fam, file, w) => `@font-face{font-family:"${fam}";src:url("file://${FONTS}/${file}") format("woff2");font-weight:${w};font-style:normal;font-display:block;}`;
  const logo = `<span class="logo"><span class="logo-sq" aria-hidden="true">R</span><span class="logo-word">RivetTrail</span></span>`;
  const chip = (txt, cls = '') => `<span class="chip ${cls}">${cls === 'chip-warn' ? I.alert : I.doc}${txt}</span>`;
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
  --ink: #16191D;      /* Überschriften */
  --text: #3F4652;     /* Fließtext, 9,4:1 */
  --gray: #5A616B;     /* Nebentext, 6,3:1 */
  --line: #E1E5EB;
  --band: #F5F7FA;     /* Kopfband */
  --accent: #0058CC;   /* 6,4:1 auf Weiß */
  --chip: #EAF1FD;     /* Quellen-Chip, Akzent darauf 5,6:1 */
  --dark: #1A1F27;     /* Zahlenband, Kastenkopf */
  --num: #A9C6FA;      /* Zahlen auf Dunkel, 9,6:1 */
  --orange: #8A4B08;   /* nur Datenqualität, 6,1:1 auf Orange-Fläche */
  --orange-bg: #FDF4E7;
  --orange-line: #F2D7B3;
  --sans: "IBM Plex Sans", Arial, sans-serif; --mono: "IBM Plex Mono", Menlo, monospace;
}
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body { background: #fff; }
body { font-family: var(--sans); color: var(--ink); -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.page { position: relative; width: 210mm; height: 297mm; overflow: hidden; break-after: page; }
.page:last-child { break-after: auto; }
.wrap { padding: 0 56px; }
strong { font-weight: 600; color: var(--ink); }
.mono { font-family: var(--mono); }
.ic { width: 17px; height: 17px; flex: none; fill: none; stroke: var(--accent); stroke-width: 1.9; stroke-linecap: round; stroke-linejoin: round; }
.ic-s { width: 12px; height: 12px; flex: none; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }

/* Kopfband */
.band { background: var(--band); border-bottom: 1px solid var(--line); padding: 36px 56px 0; height: var(--band-h); }
.top { display: flex; justify-content: space-between; align-items: center; height: 26px; }
.logo { display: flex; align-items: center; gap: 10px; }
.logo-sq { width: 26px; height: 26px; border-radius: 5.5px; background: var(--ink); color: #fff; font: 700 13px/26px var(--sans); text-align: center; }
.logo-word { font: 700 17px/1 var(--sans); color: var(--ink); letter-spacing: -0.005em; }
.top-note { font: 400 12.5px/1 var(--sans); color: var(--gray); }
.eyebrow { margin-top: var(--eyebrow-mt); font: 600 11px/1.2 var(--sans); letter-spacing: 0.12em; text-transform: uppercase; color: var(--accent); }
h1 { margin-top: 15px; font: 700 40px/44px var(--sans); letter-spacing: -0.02em; color: var(--ink); }
h1 .accent, .accent { color: var(--accent); }
.lead { margin-top: var(--lead-mt, 14px); max-width: 560px; font: 400 15px/24px var(--sans); color: var(--text); }

/* Vorderseite */
h2 { font: 600 19px/26px var(--sans); color: var(--ink); letter-spacing: -0.005em; }
.cmp { margin-top: 32px; }
.cmp-grid { display: grid; grid-template-columns: 234px 1fr; column-gap: 30px; margin-top: 13px; align-items: start; }
.qcol-head { font: 600 10.5px/1.2 var(--sans); letter-spacing: 0.1em; text-transform: uppercase; color: var(--gray); padding: 18px 0 9px; border-bottom: 1px solid var(--line); }
.q { border-bottom: 1px solid var(--line); padding: 13px 0 0; }
.q h3 { font: 600 14.5px/20px var(--sans); color: var(--ink); }
.q p { font: 400 13px/18px var(--sans); color: var(--gray); margin-top: 3px; }
.ex { border: 1px solid var(--line); border-radius: 9px; overflow: hidden; }
.ex-head { background: var(--dark); color: #fff; display: flex; align-items: center; gap: 8px; padding: 0 14px; height: 37px; }
.ex-head .logo-sq { width: 17px; height: 17px; border-radius: 3.5px; background: #fff; color: var(--dark); font: 700 9.5px/17px var(--sans); }
.ex-head b { font: 600 13px/1 var(--sans); }
.ex-head .id { font: 500 13px/1 var(--mono); color: var(--num); }
.ex-head .tag { margin-left: auto; font: 400 11px/1 var(--sans); color: #B6BCC6; }
.ex-sec { padding: 12px 14px 13px; border-top: 1px solid var(--line); }
.ex-sec:first-of-type { border-top: 0; }
.lbl { font: 600 10px/1.2 var(--sans); letter-spacing: 0.1em; text-transform: uppercase; color: var(--gray); }
.val { margin-top: 7px; font: 600 13.5px/18px var(--sans); color: var(--ink); }
.val .date { margin-right: 10px; }
.val .mono { font-weight: 500; }
.val .date { font: 400 13px/18px var(--mono); color: var(--text); letter-spacing: 0.02em; }
.val .sub { font-weight: 400; color: var(--text); }
.chips { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 7px; }
.chip { display: inline-flex; align-items: center; gap: 5px; font: 400 11px/1 var(--sans); color: var(--accent); background: var(--chip); border-radius: 3px; padding: 4px 6px; }
.chip-warn { color: var(--orange); background: var(--orange-bg); }
.chip-plain { color: var(--gray); background: none; padding: 4px 0 4px 2px; }
.person { margin-top: 8px; display: flex; align-items: center; gap: 8px; font: 400 13.5px/1 var(--sans); color: var(--text); }
.person b { font-weight: 600; color: var(--ink); }
.av { width: 22px; height: 22px; border-radius: 50%; background: var(--chip); color: var(--accent); font: 600 8.5px/22px var(--sans); text-align: center; letter-spacing: 0.02em; flex: none; }
.av-g { background: #E8EBEF; color: var(--text); }
.links { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
.link { font: 400 11.5px/1 var(--sans); color: var(--text); border: 1px solid #D5DAE1; border-radius: 3px; padding: 5px 6px; }
.link .mono { color: var(--ink); }
.ben { display: grid; grid-template-columns: repeat(3, 1fr); column-gap: 28px; margin-top: 30px; }
.ben h3, .qs h3 { display: flex; align-items: center; gap: 8px; font: 600 14.5px/20px var(--sans); color: var(--ink); }
.ben p, .qs p { font: 400 13px/20px var(--sans); color: var(--text); margin-top: 5px; }
.stats { position: absolute; left: 56px; right: 56px; top: var(--stats-top); height: 101px; background: var(--dark); border-radius: 9px; display: grid; grid-template-columns: var(--stat-cols, 1fr 1px 1fr); align-items: center; padding: 0 28px; column-gap: 26px; }
.stats .sep { height: 54px; background: #3A414D; }
.stat { display: flex; align-items: center; gap: 14px; }
.stat .num { font: 700 var(--num-size, 37px)/1 var(--sans); color: var(--num); letter-spacing: -0.02em; white-space: nowrap; }
.stat p { font: 400 13px/19.5px var(--sans); color: #E6E9EE; }
sup { font-size: 0.68em; line-height: 0; vertical-align: 0.45em; }
.foot { position: absolute; left: 56px; right: 56px; top: var(--foot-top); display: flex; justify-content: space-between; align-items: center; gap: 16px; font: 400 11px/15px var(--sans); color: var(--gray); }
.foot .next { display: inline-flex; align-items: center; gap: 6px; font-weight: 600; color: var(--accent); white-space: nowrap; }
.ic-arrow { width: 13px; height: 13px; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }

/* Rückseite */
.steps { list-style: none; margin-top: 40px; position: relative; }
.steps::before { content: ""; position: absolute; left: 14px; top: 20px; bottom: 60px; width: 2px; background: #D3E0F6; }
.step { position: relative; display: grid; grid-template-columns: 28px 1fr 260px; column-gap: 24px; }
.step .n { position: relative; z-index: 1; width: 28px; height: 28px; border-radius: 50%; background: var(--accent); color: #fff; font: 600 11px/28px var(--mono); text-align: center; box-shadow: 0 0 0 3px #fff; }
.step h3 { font: 600 16px/22px var(--sans); color: var(--ink); padding-top: 2px; }
.step .desc { font: 400 13px/20px var(--sans); color: var(--text); margin-top: 6px; }
.card { border: 1px solid var(--line); border-radius: 7px; padding: 10px 13px; background: #fff; align-self: start; }
.card-file { display: flex; align-items: center; gap: 12px; }
.ic-img { width: 30px; height: 30px; padding: 7px; border-radius: 5px; background: #F1F3F6; fill: none; stroke: var(--text); stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; flex: none; }
.card .f { font: 400 12.5px/17px var(--mono); color: var(--ink); }
.card .s { font: 400 11px/16px var(--sans); color: var(--gray); }
.card .serial { font: 500 14px/20px var(--mono); color: var(--ink); margin-top: 5px; }
.card-warn { background: var(--orange-bg); border-color: var(--orange-line); display: flex; gap: 10px; }
.ic-warn { width: 17px; height: 17px; flex: none; fill: none; stroke: var(--orange); stroke-width: 1.9; stroke-linecap: round; stroke-linejoin: round; margin-top: 1px; }
.card-warn .w { font: 600 12.5px/17px var(--sans); color: var(--orange); }
.card-warn .s { color: #6B4A20; font-size: 11.5px; }
.card-appr { display: flex; align-items: center; gap: 12px; }
.avs { display: flex; flex: none; }
.avs .av { box-shadow: 0 0 0 2px #fff; width: 26px; height: 26px; line-height: 26px; font-size: 9px; letter-spacing: 0; }
.avs .av + .av { margin-left: -4px; }
.card-appr .s { font-size: 11.5px; color: var(--text); }
.card-appr .ok { display: flex; align-items: center; gap: 5px; font: 600 12px/17px var(--sans); color: var(--ink); }
.ic-check { width: 12px; height: 12px; fill: none; stroke: var(--accent); stroke-width: 2.4; stroke-linecap: round; stroke-linejoin: round; }
.qs { margin-top: var(--qs-mt); }
.qs-grid { display: grid; grid-template-columns: repeat(3, 1fr); column-gap: 28px; margin-top: 14px; padding-top: 20px; border-top: 1px solid var(--line); }
.pilot { position: absolute; left: 56px; right: 56px; top: var(--pilot-top); background: var(--accent); color: #fff; border-radius: 9px; padding: 28px 32px 30px; display: grid; grid-template-columns: 1fr auto; column-gap: 32px; align-items: center; }
.pilot h2 { font: 700 22px/28px var(--sans); color: #fff; letter-spacing: -0.01em; max-width: 340px; }
.pilot p { font: 400 12.5px/20px var(--sans); color: #fff; margin-top: 10px; max-width: 360px; }
.pilot .ct { text-align: center; }
.pilot .ct .lbl { color: #E3EBFA; font-size: 11px; font-weight: 700; }
.pilot .btn { display: inline-block; margin-top: 10px; background: #fff; color: var(--accent); border-radius: 5px; padding: 11px 16px; font: 500 14px/1 var(--mono); text-decoration: none; }
</style>
</head>
<body>

<section class="page p1" style="--band-h:335px;--eyebrow-mt:41px;--stats-top:941px;--foot-top:1074px;${t.numSize ? `--num-size:${t.numSize};--stat-cols:${t.statCols};` : ''}">
  <div class="band">
    <header class="top">${logo}<span class="top-note">rivettrail.de</span></header>
    <p class="eyebrow">${t.eyebrow}</p>
    <h1>${t.h1a}<br><span class="accent">${t.h1b}</span></h1>
    <p class="lead">${t.lead}</p>
  </div>

  <div class="wrap">
    <div class="cmp">
      <h2>${t.cmpH}</h2>
      <div class="cmp-grid">
        <div class="qcol">
          <p class="qcol-head">${t.qHead}</p>
          ${t.rows.map(r => `<div class="q" style="height:${r[2]}px"><h3>${r[0]}</h3><p>${r[1]}</p></div>`).join('\n          ')}
        </div>
        <div class="ex">
          <div class="ex-head"><span class="logo-sq" aria-hidden="true">R</span><b>${t.exKb}</b><span class="id">CNC-003</span><span class="tag">${t.exTag}</span></div>
          <div class="ex-sec"><p class="lbl">${t.ex.parts}</p><p class="val">${t.ex.part}</p><div class="chips">${chip(t.ex.partSrc)}${chip(t.ex.partWarn, 'chip-warn')}</div></div>
          <div class="ex-sec"><p class="lbl">${t.ex.hist}</p><p class="val"><span class="date">${t.ex.date}</span>${t.ex.change}</p><div class="chips">${chip(t.ex.histSrc)}<span class="chip chip-plain">${t.ex.approved}</span></div></div>
          <div class="ex-sec"><p class="lbl">${t.ex.contact}</p><p class="person"><span class="av">AW</span><span><b>A. Weber</b> · ${t.ex.role}</span></p></div>
          <div class="ex-sec"><p class="lbl">${t.ex.linked}</p><div class="links">${t.ex.links.map(l => `<span class="link">${l}</span>`).join('')}</div></div>
        </div>
      </div>
    </div>

    <div class="ben">
      ${t.ben.map((b, i) => `<div><h3>${[I.clock, I.shield, I.book][i]}${b[0]}</h3><p>${b[1]}</p></div>`).join('\n      ')}
    </div>
  </div>

  <div class="stats">
    <div class="stat"><span class="num">${t.stats[0][0]}</span><p>${t.stats[0][1]}</p></div>
    <span class="sep"></span>
    <div class="stat"><span class="num">${t.stats[1][0]}</span><p>${t.stats[1][1]}</p></div>
  </div>
  <footer class="foot"><span>${t.footnotes}</span><span class="next">${t.overleaf}${I.arrow}</span></footer>
</section>

<section class="page p2" style="--band-h:336px;--eyebrow-mt:51px;--lead-mt:20px;--qs-mt:17px;--pilot-top:919px;">
  <div class="band">
    <header class="top">${logo}<span class="top-note">rivettrail.de</span></header>
    <p class="eyebrow">${t.p2eyebrow}</p>
    <h1>${t.p2h1a}<br>${t.p2h1b}</h1>
    <p class="lead">${t.p2lead}</p>
  </div>

  <div class="wrap">
    <ol class="steps">
      ${t.steps.map((s, i) => `<li class="step" style="height:${t.stepHs[i]}px"><span class="n">0${i + 1}</span><div><h3>${s[0]}</h3><p class="desc">${s[1]}</p></div>${s[2]}</li>`).join('\n      ')}
    </ol>

    <div class="qs">
      <h2>${t.qsH}</h2>
      <div class="qs-grid">
        ${t.qs.map((q, i) => `<div><h3>${[I.copy, I.flag, I.history][i]}${q[0]}</h3><p>${q[1]}</p></div>`).join('\n        ')}
      </div>
    </div>
  </div>

  <div class="pilot">
    <div><h2>${t.pilotH}</h2><p>${t.pilotP}</p></div>
    <div class="ct"><p class="lbl">${t.seeking}</p><a class="btn" href="mailto:kontakt@rivettrail.de">kontakt@rivettrail.de</a></div>
  </div>
</section>

</body>
</html>`;
}

const cards = (t) => [
  `<div class="card card-file">${I.image}<div><p class="f">${t.file1}</p><p class="s">${t.example}</p></div></div>`,
  `<div class="card"><p class="lbl">${t.serialLbl}</p><p class="serial">DEMO-1850-0317</p><div class="chips"><span class="chip">${I.doc}${t.serialSrc}</span></div></div>`,
  `<div class="card card-warn">${I.warn}<div><p class="w">${t.warn1}</p><p class="s">${t.warn2}</p></div></div>`,
  `<div class="card card-appr"><span class="avs"><span class="av av-g">AW</span><span class="av">TB</span></span><div><p class="s">${t.appr1}</p><p class="ok">${I.check}${t.appr2}</p></div></div>`,
];

const DE = {
  lang: 'de', file: 'RivetTrail_Onepager', title: 'RivetTrail Onepager',
  desc: 'RivetTrail: alles über Ihre Maschinen. Verknüpft und sofort da.',
  eyebrow: 'Wissensbasis für Ihren Maschinenpark',
  h1a: 'Alles über Ihre Maschinen.', h1b: 'Verknüpft und sofort da.',
  lead: 'RivetTrail führt zusammen, was in ERP, MES, Instandhaltung, Excel-Listen und Handbüchern steckt. <strong>Eine verknüpfte Wissensbasis für alle Anlagen, für jeden Hersteller. Jede Angabe mit Quelle.</strong>',
  cmpH: 'Die Maschine steht. Wo kommen die Antworten her?',
  qHead: 'Frage · Heute',
  rows: [
    ['Welches Teil ist verbaut?', 'ERP, Netzlaufwerk, Servicebericht', 90],
    ['Was wurde zuletzt geändert?', 'Schichtbuch, E-Mails, nachfragen', 90],
    ['Wer kennt sich aus?', 'Rundruf', 71],
    ['Was hängt dran?', 'Weiß der Meister', 93],
  ],
  exKb: 'Wissensbasis ·', exTag: 'Beispielansicht · Demo-Daten',
  ex: {
    parts: 'Verbaute Teile', part: 'Spindel <span class="mono">HSK-A63</span>',
    partSrc: 'Servicebericht, S. 2', partWarn: 'Abweichung zu ERP markiert',
    hist: 'Historie', date: '12.09.2026', change: 'Steuerung geändert',
    histSrc: 'Beleg: Änderungshistorie', approved: 'A. Weber, freigegeben von T. Berger',
    contact: 'Ansprechpartner', role: 'zuständig',
    linked: 'Verknüpfte Anlagen',
    links: ['nachgelagert <span class="mono">CNC-004</span>', 'Ausweichanlage <span class="mono">CNC-007</span>', 'Versorgung Druckluft'],
  },
  ben: [
    ['Kürzere Stillstände', 'Die Fehlersuche beginnt sofort, nicht mit der Suche nach Unterlagen.'],
    ['Verlässliche Daten', 'Dubletten und Widersprüche werden erkannt, bevor sie Schaden anrichten.'],
    ['Wissen bleibt', 'Was Kollegen im Kopf haben, steht in der Wissensbasis. Auch nach dem Ruhestand.'],
  ],
  stats: [
    [`67${NB}%`, 'der Industriebetriebe haben monatlich ungeplante Stillstände.<sup>1</sup>'],
    [`13,4${NB}Mio.`, 'Erwerbspersonen erreichen bis 2039 das Rentenalter.<sup>2</sup>'],
  ],
  footnotes: `<sup>1</sup>${NB}ABB, „Value of Reliability“, Sapio Research, 07/2023 · <sup>2</sup>${NB}Destatis, 08/2025`,
  overleaf: 'So funktioniert es: Rückseite',
  p2eyebrow: 'So funktioniert es',
  p2h1a: 'Neue Anlage?', p2h1b: 'Dokumente rein, prüfen, <span class="accent">fertig.</span>',
  p2lead: '<strong>Niemand tippt Seriennummern ab.</strong> Und doppelte oder widersprüchliche Angaben fallen auf, bevor sie in der Wissensbasis landen.',
  stepHs: [81, 116, 96, 90],
  file1: 'Typenschild_CNC.jpg', example: 'Beispiel', serialLbl: 'Seriennummer', serialSrc: 'aus Typenschild, Zeile 3',
  warn1: 'Diese Maschine gibt es schon.', warn2: 'Dokumente bei CNC-003 ergänzen.',
  appr1: 'Antrag A. Weber', appr2: 'freigegeben von T. Berger',
  stepsTxt: [
    ['Dokumente hochladen', 'Foto vom Typenschild, Protokolle, Listen.'],
    ['Angaben werden erkannt', 'Hersteller, Typ, Seriennummer, Steuerung. Jede Angabe mit Fundstelle.'],
    ['Automatisch geprüft', 'Gibt es die Anlage schon? Passen die Angaben zur Wissensbasis?'],
    ['Freigeben', 'Auf Wunsch prüft eine zweite Person. Erst dann ist die Anlage in der Wissensbasis.'],
  ],
  qsH: 'Qualitätssicherung, die mitläuft',
  qs: [
    ['Keine Dubletten', 'Gibt es die Anlage schon, wird es gemeldet.'],
    ['Keine stillen Fehler', 'Widersprüche werden markiert, nicht überschrieben.'],
    ['Alles nachvollziehbar', 'Jede Angabe mit Quelle, jede Änderung mit Person und Datum.'],
  ],
  pilotH: 'Start mit Ihren 10 kritischsten Maschinen.',
  pilotP: 'Aus den Dateien, die Sie schon haben. Ohne IT-Projekt, ohne Systemzugriff.',
  seeking: 'Wir suchen Pilotbetriebe',
};

const EN = {
  lang: 'en-GB', file: 'RivetTrail_Onepager_EN', title: 'RivetTrail one-pager',
  desc: 'RivetTrail: your machine knowledge. Connected and on hand.',
  eyebrow: 'Knowledge base for your machines',
  h1a: 'Your machine knowledge.', h1b: 'Connected and on hand.',
  lead: 'RivetTrail brings together what sits in ERP, MES, maintenance, Excel lists and manuals. <strong>One linked knowledge base for all machines, for every manufacturer. Every entry with its source.</strong>',
  cmpH: 'The machine is down. Where do the answers come from?',
  qHead: 'Question · Today',
  rows: [
    ['Which part is installed?', 'ERP, network drive, service report', 90],
    ['What was changed last?', 'Shift log, emails, asking around', 90],
    ['Who knows this machine?', 'Ringing round', 71],
    ['What depends on it?', 'The foreman knows', 93],
  ],
  exKb: 'Knowledge base ·', exTag: 'Example view · demo data',
  ex: {
    parts: 'Installed parts', part: 'Spindle <span class="mono">HSK-A63</span>',
    partSrc: 'Service report, p. 2', partWarn: 'Discrepancy with ERP flagged',
    hist: 'History', date: '12 Sep 2026', change: 'Control system changed',
    histSrc: 'Record: Change history', approved: 'A. Weber, approved by T. Berger',
    contact: 'Contact', role: 'responsible',
    linked: 'Linked machines',
    links: ['downstream <span class="mono">CNC-004</span>', 'backup machine <span class="mono">CNC-007</span>', 'compressed air supply'],
  },
  ben: [
    ['Shorter downtime', 'Troubleshooting starts straight away, not with a hunt for documents.'],
    ['Reliable data', 'Duplicates and conflicts are caught before they cause damage.'],
    ['Knowledge stays', 'What colleagues carry in their heads is in the knowledge base. Even after they retire.'],
  ],
  numSize: '29px', statCols: '0.86fr 1px 1.14fr',
  stats: [
    ['67%', 'of industrial companies have unplanned downtime every month.<sup>1</sup>'],
    [`13.4${NB}million`, 'people in Germany’s workforce will reach retirement age by 2039.<sup>2</sup>'],
  ],
  footnotes: `<sup>1</sup>${NB}ABB, “Value of Reliability”, Sapio Research, 07/2023 · <sup>2</sup>${NB}Destatis, 08/2025`,
  overleaf: 'How it works: overleaf',
  p2eyebrow: 'How it works',
  p2h1a: 'New machine?', p2h1b: 'Documents in, checked, <span class="accent">done.</span>',
  p2lead: '<strong>Nobody has to key in serial numbers by hand.</strong> And duplicate or conflicting entries are caught before they reach the knowledge base.',
  stepHs: [81, 116, 96, 90],
  file1: 'Nameplate_CNC.jpg', example: 'Example', serialLbl: 'Serial number', serialSrc: 'from nameplate, line 3',
  warn1: 'This machine already exists.', warn2: 'Add documents to CNC-003.',
  appr1: 'Requested by A. Weber', appr2: 'approved by T. Berger',
  stepsTxt: [
    ['Upload documents', 'Nameplate photo, reports, lists.'],
    ['Details are recognised', 'Manufacturer, type, serial number, control system. Every entry with its source.'],
    ['Checked automatically', 'Does the machine already exist? Do the details match the knowledge base?'],
    ['Approve', 'Optionally, a second person signs off. Only then is the machine in the knowledge base.'],
  ],
  qsH: 'Quality assurance built in',
  qs: [
    ['No duplicates', 'If the machine already exists, you are told.'],
    ['No silent errors', 'Conflicts are flagged, not overwritten.'],
    ['Fully traceable', 'Every entry with its source, every change with person and date.'],
  ],
  pilotH: 'Start with your 10 most critical machines.',
  pilotP: 'Built from the files you already have. No IT project, no system access.',
  seeking: 'We are looking for pilot sites',
};

for (const t of [DE, EN]) {
  const c = cards(t);
  t.steps = t.stepsTxt.map((s, i) => [s[0], s[1], c[i]]);
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'rt-onepager-'));
  const b = await chromium.launch({ executablePath: CHROME });
  const page = await b.newPage();
  for (const t of [DE, EN]) {
    const htmlPath = path.join(tmp, `${t.file}.html`);
    fs.writeFileSync(htmlPath, html(t));
    if (process.env.KEEP_HTML) fs.copyFileSync(htmlPath, path.join(process.env.KEEP_HTML, `${t.file}.html`));
    await page.goto('file://' + htmlPath);
    await page.evaluate(() => document.fonts.ready);
    await page.emulateMedia({ media: 'print' });
    const info = await page.evaluate(() => {
      const out = [];
      document.querySelectorAll('.page').forEach((p, i) => {
        const pr = p.getBoundingClientRect();
        const abs = p.querySelector('.stats, .pilot').getBoundingClientRect();
        const flow = p.querySelector('.wrap').getBoundingClientRect();
        out.push(`p${i + 1}: Fluss endet ${(flow.bottom - pr.top).toFixed(0)}, Block ab ${(abs.top - pr.top).toFixed(0)} bis ${(abs.bottom - pr.top).toFixed(0)}`);
        p.querySelectorAll('*').forEach(e => { if (e.scrollWidth > e.clientWidth + 1 && getComputedStyle(e).overflow === 'hidden' && e !== p) out.push('  Überlauf: ' + e.className); });
      });
      return out;
    });
    console.log(t.file, info.join(' | '));
    await page.pdf({ path: path.join(OUT, `${t.file}.pdf`), format: 'A4', printBackground: true, preferCSSPageSize: true, tagged: true });
  }
  await b.close();
  fs.rmSync(tmp, { recursive: true, force: true });
})();
