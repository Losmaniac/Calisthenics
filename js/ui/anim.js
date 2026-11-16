// Plays the moving figures ([data-anim]) of the current screen.
import { FIGS } from '../data/figures.js';
import { figureAt } from '../figure.js';

const still = matchMedia('(prefers-reduced-motion: reduce)');
let raf = 0, last = 0;

export function animate() {
  cancelAnimationFrame(raf);
  if (still.matches) return;
  const els = [...document.querySelectorAll('[data-anim]')];
  if (!els.length) return;
  const t0 = performance.now();
  const tick = now => {
    if (now - last > 33) {
      last = now;
      for (const el of els) if (el.isConnected) el.innerHTML = figureAt(FIGS[el.dataset.fig], now - t0 + (+el.dataset.offset || 0), '', +el.dataset.fit || 0);
    }
    if (els.some(el => el.isConnected)) raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
}
