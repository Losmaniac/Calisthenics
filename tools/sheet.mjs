// Renders every figure keyframe into contact-sheet PNGs for visual checking.
// usage: node tools/sheet.mjs [filter] ; output in /tmp/sheets
import { FIGS } from '../js/data/figures.js';
import { figureFrame, frameCount, reachProblems } from '../js/figure.js';
import { writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { execSync } from 'node:child_process';

const filter = process.argv[2];
const keys = Object.keys(FIGS).filter(k => !filter || new RegExp(filter).test(k));
const cells = [];
for (const k of keys) for (let i = 0; i < frameCount(FIGS[k]); i++) cells.push([k, i]);
const COLS = 6, ROWS = 4, S = 200, PAD = 22;
rmSync('/tmp/sheets', { recursive: true, force: true });
mkdirSync('/tmp/sheets', { recursive: true });
for (let page = 0; page * COLS * ROWS < cells.length; page++) {
  const chunk = cells.slice(page * COLS * ROWS, (page + 1) * COLS * ROWS);
  let body = '';
  chunk.forEach(([k, i], n) => {
    const x = (n % COLS) * S, y = Math.floor(n / COLS) * (S + PAD);
    const inner = figureFrame(FIGS[k], i).replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
    body += `<g transform="translate(${x} ${y})"><rect width="${S}" height="${S + PAD}" fill="#fff" stroke="#ccc"/>` +
      `<g color="#16202a" style="--prop:#8a96a3">${inner}</g>` +
      `<text x="6" y="${S + 15}" font-family="DejaVu Sans" font-size="12" fill="#b00">${k} #${i}</text></g>`;
  });
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${COLS * S}" height="${ROWS * (S + PAD)}">${body}</svg>`;
  const f = `/tmp/sheets/p${String(page).padStart(2, '0')}`;
  writeFileSync(f + '.svg', svg.replaceAll('var(--prop, #8a96a3)', '#8a96a3').replaceAll('var(--fig-bg, #fff)', '#fff'));
  execSync(`rsvg-convert ${f}.svg -o ${f}.png`);
}
for (const k of keys) { const r = reachProblems(FIGS[k]); if (r.length) console.log('REACH', k, r.join('; ')); }
console.log(cells.length, 'frames,', Math.ceil(cells.length / (COLS * ROWS)), 'pages');
