// Renders the app icons from the figure engine (needs rsvg-convert).
import { FIGS } from '../js/data/figures.js';
import { figureFrame } from '../js/figure.js';
import { writeFileSync, mkdirSync } from 'node:fs';
import { execSync } from 'node:child_process';

const root = new URL('..', import.meta.url).pathname;
mkdirSync(root + 'icons', { recursive: true });
const SLATE = '#182025', CHALK = '#EDF0EB', GOLD = '#FFC83A';
const fig = { ...FIGS.pullupWide, floor: false, props: [['hbar', 34, 166, 26]] };
const inner = figureFrame(fig, 1).replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '')
  .replaceAll('var(--prop, #8a96a3)', GOLD).replaceAll('var(--fig-bg, #fff)', SLATE)
  .replace('stroke-linecap="round" stroke-width="4"', 'stroke-linecap="round" stroke-width="7"');

function icon(file, size, scale, round) {
  const k = scale, off = (200 - 200 * k) / 2;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 200 200">
    <rect width="200" height="200" ${round ? 'rx="44"' : ''} fill="${SLATE}"/>
    <g transform="translate(${off} ${off + 6 * k}) scale(${k})" color="${CHALK}">${inner}</g></svg>`;
  writeFileSync('/tmp/icon.svg', svg);
  execSync(`rsvg-convert -w ${size} -h ${size} /tmp/icon.svg -o ${root}icons/${file}`);
}
icon('icon-192.png', 192, 0.9, false);
icon('icon-512.png', 512, 0.9, false);
icon('apple-touch-icon.png', 180, 0.9, false);
icon('icon-maskable-512.png', 512, 0.7, false);
console.log('icons written');
