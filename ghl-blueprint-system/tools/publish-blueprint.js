#!/usr/bin/env node
// Renders a blueprint markdown file into a standalone, theme-aware HTML page.
// Usage: node tools/publish-blueprint.js <input.md> <output.html> ["Page Title"]
const fs = require('fs');

const [, , inPath, outPath, titleArg] = process.argv;
if (!inPath || !outPath) {
  console.error('usage: node publish-blueprint.js <input.md> <output.html> ["Title"]');
  process.exit(1);
}

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function inline(s) {
  let out = esc(s);
  out = out.replace(/`([^`]+)`/g, (_, c) => '<code>' + c + '</code>');
  out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  out = out.replace(/(^|[^*])\*([^*]+)\*/g, '$1<em>$2</em>');
  return out;
}

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const src = fs.readFileSync(inPath, 'utf8').split(/\r?\n/);
const html = [];
const toc = [];
let docTitle = titleArg || '';
let i = 0;

function isTableRow(l) { return /^\|/.test(l.trim()); }
function cells(l) {
  return l.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim());
}

while (i < src.length) {
  const line = src[i];
  const t = line.trim();

  if (!t) { i++; continue; }

  if (/^---+$/.test(t)) { html.push('<hr />'); i++; continue; }

  if (/^# /.test(t)) {
    const text = t.slice(2);
    if (!docTitle) docTitle = text;
    html.push('<header class="doc-head"><h1>' + inline(text) + '</h1></header>');
    i++;
    continue;
  }

  if (/^## /.test(t)) {
    const text = t.slice(3);
    const id = slug(text);
    const m = text.match(/^(\d+)\.\s+(.*)$/);
    toc.push({ id, num: m ? m[1] : '', label: m ? m[2] : text });
    html.push(
      '<section id="' + id + '"><h2>' +
      (m ? '<span class="num">' + m[1] + '</span>' + inline(m[2]) : inline(text)) +
      '</h2>'
    );
    i++;
    continue;
  }

  if (/^### /.test(t)) { html.push('<h3>' + inline(t.slice(4)) + '</h3>'); i++; continue; }

  if (isTableRow(t)) {
    const head = cells(t);
    let j = i + 1;
    const rows = [];
    if (j < src.length && /^\|[\s:|-]+\|?$/.test(src[j].trim())) {
      j++;
      while (j < src.length && isTableRow(src[j])) { rows.push(cells(src[j])); j++; }
      html.push('<div class="scroll"><table><thead><tr>' +
        head.map((c) => '<th>' + inline(c) + '</th>').join('') +
        '</tr></thead><tbody>' +
        rows.map((r) => '<tr>' + r.map((c) => '<td>' + inline(c) + '</td>').join('') + '</tr>').join('') +
        '</tbody></table></div>');
      i = j;
      continue;
    }
  }

  if (/^- \[ \]/.test(t)) {
    const items = [];
    while (i < src.length && /^- \[ \]/.test(src[i].trim())) {
      items.push('<li>' + inline(src[i].trim().slice(6).trim()) + '</li>');
      i++;
    }
    html.push('<ul class="checks">' + items.join('') + '</ul>');
    continue;
  }

  if (/^\d+\.\s/.test(t)) {
    const items = [];
    while (i < src.length && (/^\d+\.\s/.test(src[i].trim()) || /^\s{2,}\S/.test(src[i]))) {
      if (/^\d+\.\s/.test(src[i].trim())) items.push(inline(src[i].trim().replace(/^\d+\.\s/, '')));
      else items[items.length - 1] += ' ' + inline(src[i].trim());
      i++;
    }
    html.push('<ol>' + items.map((x) => '<li>' + x + '</li>').join('') + '</ol>');
    continue;
  }

  if (/^- /.test(t)) {
    const items = [];
    while (i < src.length && (/^- /.test(src[i].trim()) || /^\s{2,}\S/.test(src[i]))) {
      if (/^- /.test(src[i].trim())) items.push(inline(src[i].trim().slice(2)));
      else items[items.length - 1] += ' ' + inline(src[i].trim());
      i++;
    }
    html.push('<ul>' + items.map((x) => '<li>' + x + '</li>').join('') + '</ul>');
    continue;
  }

  // paragraph: join soft-wrapped lines
  const blockStart = (l) => {
    const s = l.trim();
    return !s || /^#{1,6}\s/.test(s) || /^-{3,}$/.test(s) || /^- /.test(s) ||
           /^\d+\.\s/.test(s) || isTableRow(s);
  };
  const para = [];
  while (i < src.length && (para.length === 0 || !blockStart(src[i])) && src[i].trim()) {
    para.push(src[i].trim());
    i++;
  }
  if (para.length === 0) { i++; continue; }
  const text = para.join(' ');
  const cls = /^\*[^*].*\*$/.test(text) ? ' class="lede"' : '';
  html.push('<p' + cls + '>' + inline(text) + '</p>');
}

// close sections
let body = html.join('\n');
const OPEN = '<section id=';
const CLOSE = '</section>\n';
body = body.split(OPEN).join(CLOSE + OPEN);
body = body.replace(CLOSE + OPEN, OPEN);
body += '\n</section>';

const nav = toc.map((s) =>
  '<a href="#' + s.id + '"><span class="tnum">' + (s.num || '&bull;') + '</span>' + esc(s.label) + '</a>'
).join('\n');

const css = `
:root{
  --bg:#EEF1F5; --surface:#FFFFFF; --ink:#0F1A24; --muted:#556A7E;
  --accent:#17457E; --accent-soft:#E2EAF4; --flag:#9C3F26; --rule:#D2DAE4; --shadow:0 1px 2px rgba(15,26,36,.06);
}
@media (prefers-color-scheme: dark){
  :root:not([data-theme="light"]){
    --bg:#0A121A; --surface:#111C27; --ink:#E3EBF3; --muted:#8FA3B6;
    --accent:#7FB2E8; --accent-soft:#14283C; --flag:#DE8C6C; --rule:#22323F; --shadow:none;
  }
}
:root[data-theme="dark"]{
  --bg:#0A121A; --surface:#111C27; --ink:#E3EBF3; --muted:#8FA3B6;
  --accent:#7FB2E8; --accent-soft:#14283C; --flag:#DE8C6C; --rule:#22323F; --shadow:none;
}
*{box-sizing:border-box}
body{
  margin:0; background:var(--bg); color:var(--ink);
  font-family:"Source Serif 4",Georgia,serif; font-size:17px; line-height:1.62;
  -webkit-font-smoothing:antialiased;
}
.wrap{display:grid; grid-template-columns:1fr; gap:0; max-width:1180px; margin:0 auto; padding:0 20px 80px}
@media (min-width:1040px){ .wrap{grid-template-columns:230px minmax(0,1fr); gap:56px; padding:0 32px 96px} }
nav.toc{display:none}
@media (min-width:1040px){
  nav.toc{
    display:block; position:sticky; top:0; align-self:start; max-height:100vh; overflow:auto;
    padding:40px 0; border-right:1px solid var(--rule);
  }
}
nav.toc .cap{font-family:"IBM Plex Mono",ui-monospace,monospace; font-size:10.5px; letter-spacing:.14em;
  text-transform:uppercase; color:var(--muted); margin-bottom:14px}
nav.toc a{display:flex; gap:10px; padding:5px 0; font-family:"Archivo",system-ui,sans-serif; font-size:13.5px;
  line-height:1.35; color:var(--muted); text-decoration:none}
nav.toc a:hover,nav.toc a:focus-visible{color:var(--accent)}
.tnum{font-family:"IBM Plex Mono",ui-monospace,monospace; font-size:11px; color:var(--accent); min-width:16px; padding-top:2px}
main{min-width:0; padding-top:40px}
.doc-head{border-bottom:2px solid var(--ink); padding-bottom:22px; margin-bottom:8px}
.doc-head h1{font-family:"Archivo",system-ui,sans-serif; font-weight:700; font-size:clamp(28px,4.4vw,42px);
  line-height:1.08; letter-spacing:-.022em; margin:0; text-wrap:balance}
.lede{color:var(--muted); font-style:italic; font-size:15px; margin:14px 0 0}
hr{display:none}
section{padding-top:44px}
h2{font-family:"Archivo",system-ui,sans-serif; font-weight:650; font-size:24px; letter-spacing:-.015em;
  line-height:1.2; margin:0 0 18px; padding-bottom:10px; border-bottom:1px solid var(--rule); text-wrap:balance;
  display:flex; align-items:baseline; gap:14px}
h2 .num{font-family:"IBM Plex Mono",ui-monospace,monospace; font-size:12px; color:var(--accent);
  border:1px solid var(--rule); border-radius:2px; padding:2px 6px; flex:none}
h3{font-family:"Archivo",system-ui,sans-serif; font-weight:600; font-size:16.5px; letter-spacing:-.005em;
  margin:32px 0 10px; color:var(--ink)}
p{margin:0 0 14px; max-width:70ch}
strong{font-weight:600}
a{color:var(--accent); text-underline-offset:2px}
code{font-family:"IBM Plex Mono",ui-monospace,monospace; font-size:.84em; background:var(--accent-soft);
  color:var(--ink); padding:1px 5px; border-radius:3px; word-break:break-word}
ul,ol{margin:0 0 16px; padding-left:22px; max-width:70ch}
li{margin-bottom:7px}
ul.checks{list-style:none; padding-left:0; max-width:78ch}
ul.checks li{display:flex; gap:11px; padding:9px 0; border-bottom:1px solid var(--rule); margin:0; font-size:15.5px}
ul.checks li::before{content:""; flex:none; width:13px; height:13px; margin-top:6px;
  border:1.5px solid var(--accent); border-radius:2px}
.scroll{overflow-x:auto; margin:0 0 20px; border:1px solid var(--rule); border-radius:3px; background:var(--surface); box-shadow:var(--shadow)}
table{border-collapse:collapse; width:100%; font-family:"Archivo",system-ui,sans-serif; font-size:13.5px; line-height:1.45}
th{text-align:left; font-weight:650; font-size:10.5px; letter-spacing:.1em; text-transform:uppercase;
  color:var(--muted); padding:11px 14px; border-bottom:1px solid var(--rule); white-space:nowrap}
td{padding:11px 14px; border-bottom:1px solid var(--rule); vertical-align:top; font-variant-numeric:tabular-nums}
tr:last-child td{border-bottom:none}
td code{font-size:11.5px; background:none; padding:0; color:var(--accent)}
th:first-child,td:first-child{padding-left:18px}
footer{margin-top:56px; padding-top:18px; border-top:1px solid var(--rule); color:var(--muted);
  font-family:"IBM Plex Mono",ui-monospace,monospace; font-size:11px; letter-spacing:.05em}
:focus-visible{outline:2px solid var(--accent); outline-offset:2px}
`;

const page = [
  '<title>' + esc(titleArg || docTitle) + '</title>',
  '<meta name="viewport" content="width=device-width, initial-scale=1" />',
  '<link rel="preconnect" href="https://fonts.googleapis.com" />',
  '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />',
  '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wght@500;600;700&family=IBM+Plex+Mono:wght@400;500&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;1,8..60,400&display=swap" />',
  '<style>' + css + '</style>',
  '<div class="wrap">',
  '<nav class="toc"><div class="cap">Contents</div>' + nav + '</nav>',
  '<main>',
  body,
  '<footer>Draft blueprint &mdash; review before build. Generated from ' + esc(inPath.split(/[\/]/).pop()) + '</footer>',
  '</main></div>'
].join('\n');

fs.writeFileSync(outPath, page, 'utf8');
console.log('wrote ' + outPath + ' (' + page.length + ' bytes, ' + toc.length + ' sections)');
