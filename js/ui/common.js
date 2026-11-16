// Small helpers shared by the screens.
import { FIGS } from '../data/figures.js';
import { figureStill } from '../figure.js';
import { EX, EQUIPMENT } from '../data/exercises.js';
import { TRACKS } from '../data/tracks.js';
import { levelOf } from '../engine/game.js';
import { t, L, num, tri } from '../i18n.js';

export const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

// A figure. `live` plays the movement; otherwise the start position shows as a ghost behind the end position.
export function fig(figId, { live = false, cls = '', ghost = true, offset = 0, fit = 120 } = {}) {
  const f = FIGS[figId];
  const anim = live && f.frames.length > 1;
  const svg = figureStill(f, anim ? { ghost: false, frame: 0, fit } : { ghost, fit });
  return `<div class="figbox ${cls}"${anim ? ` data-anim data-fig="${figId}" data-fit="${fit}" data-offset="${offset}"` : ''}>${svg}</div>`;
}
export const exFig = (exId, opts) => fig(EX[exId].fig, opts);
export const thumb = (exId, figId) => `<div class="thumb">${fig(figId ?? EX[exId].fig, { fit: -70 })}</div>`;

export const exName = id => L(EX[id]).n;
export const trackOf = id => TRACKS.find(tr => tr.steps.includes(id));
export const eqName = k => tri(EQUIPMENT.find(e => e[0] === k));

export const range = (lo, hi) => (lo === hi ? num(lo) : `${num(lo)}–${num(hi)}`);
export const val = (v, kind) => (kind === 'reps' ? num(v) : num(v) + ' s');

// "3 × 6–12", "3 × 10–25 s", "40 s"
export function target(e) {
  const [sets, lo, hi] = e.t;
  if (e.kind === 'time') return `${num(lo)} s`;
  return `${sets} × ${range(lo, hi)}${e.kind === 'hold' ? ' s' : ''}${e.side ? ' ' + t('x.side') : ''}`;
}
export function stepTarget(st) {
  if (st.k === 'timed' || st.k === 'work') return `${num(st.secs)} s`;
  return `${st.of} × ${range(st.lo, st.hi)}${st.kind === 'hold' ? ' s' : ''}${st.side ? ' ' + t('x.side') : ''}`;
}

const svg = (d, extra = '') =>
  `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"${extra}>${d}</svg>`;
export const ICON = {
  today: svg('<rect x="4" y="5" width="16" height="15" rx="2.5"/><path d="M4 10h16M9 3v4M15 3v4"/>'),
  skills: svg('<path d="M7 3v18M17 3v18M7 7.5h10M7 12h10M7 16.5h10"/>'),
  learn: svg('<path d="M3.5 5.5c3-1.2 5.8-1 8.5.9 2.7-1.9 5.5-2.1 8.5-.9v13c-3-1.2-5.8-1-8.5.9-2.7-1.9-5.5-2.1-8.5-.9z"/><path d="M12 6.4v13"/>'),
  progress: svg('<path d="M5 20v-7M12 20V5M19 20v-10"/>'),
  me: svg('<path d="M4 7h9M17 7h3M4 17h3M11 17h9"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="17" r="2"/>'),
  back: svg('<path d="M14.5 5l-7 7 7 7"/>'),
  chevron: svg('<path d="M9.5 5.5L16 12l-6.5 6.5"/>', ' width="18" height="18"'),
  check: svg('<path d="M5 12.5l4.5 4.5L19 7.5"/>', ' stroke-width="2.6"'),
  close: svg('<path d="M6 6l12 12M18 6L6 18"/>'),
  lock: svg('<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>', ' width="18" height="18"'),
};

export const backBtn = fallback => `<button class="back" data-act="back" data-arg="${fallback ?? ''}">${ICON.back}<span>${t('back')}</span></button>`;

// Level disc with the progress toward the next level.
export function levelInfo(xp) {
  const l = levelOf(xp);
  return { ...l, pct: Math.min(100, ((xp - l.from) / (l.to - l.from)) * 100), left: l.to - xp };
}

// The how-to part of an exercise, used on the exercise screen and in the player.
export function howTo(id) {
  const x = L(EX[id]);
  const li = a => a.map(s => `<li>${esc(s)}</li>`).join('');
  return `<h2 class="sec">${t('x.how')}</h2><ol class="steps">${li(x.h)}</ol>
    <h2 class="sec">${t('x.cues')}</h2><ul class="points">${li(x.c)}</ul>
    <h2 class="sec">${t('x.errors')}</h2><ul class="points">${li(x.e)}</ul>`;
}
