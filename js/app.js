// Boot: routing, rendering, event delegation, offline support and sync.
import { S, subscribe, flush } from './store.js';
import { acts, views, route, parse, go, back, onRender, sheet } from './ui/nav.js';
import { t, lang } from './i18n.js';
import { animate } from './ui/anim.js';
import { ICON } from './ui/common.js';
import './ui/today.js';
import './ui/player.js';
import './ui/summary.js';
import './ui/skills.js';
import './ui/learn.js';
import './ui/progress.js';
import './ui/setup.js';
import { syncNow, scheduleSync } from './sync.js';

const TABS = ['today', 'skills', 'learn', 'progress', 'me'];
let shown = null;

function render() {
  if (!S.setup && route.name !== 'welcome' && route.name !== 'play' && route.name !== 'summary') { go('welcome', null, { replace: true }); return; }
  if (S.setup && route.name === 'welcome') { go('today', null, { replace: true }); return; }
  if (route.name === 'play' && !S.active) { go(S.summary ? 'summary' : 'today', null, { replace: true }); return; }
  if (route.name === 'summary' && !S.summary) { go('today', null, { replace: true }); return; }

  if (shown !== route.name) { views[shown]?.leave?.(); shown = route.name; }
  const v = views[route.name];
  document.documentElement.lang = lang();
  const view = document.getElementById('view');
  view.className = 'view v-' + route.name;
  view.innerHTML = v.render(route.arg);
  const tabs = document.getElementById('tabs');
  tabs.hidden = !v.tab;
  if (v.tab) tabs.innerHTML = TABS.map(k => `<a class="tab${v.tab === k ? ' on' : ''}" href="#${k}"${v.tab === k ? ' aria-current="page"' : ''}>${ICON[k]}<span>${t('tab.' + k)}</span></a>`).join('');
  v.after?.(view, route.arg);
  animate();
}
onRender(render);
subscribe(() => { render(); scheduleSync(); });

// Event delegation: data-act on click, data-on on change, data-input on typing.
document.addEventListener('click', e => {
  const el = e.target.closest('[data-act]');
  if (!el || el.disabled) return;
  const fn = acts[el.dataset.act];
  if (fn) { e.preventDefault(); fn(el.dataset.arg, el, e); }
});
document.addEventListener('change', e => { const el = e.target.closest('[data-on]'); if (el) acts[el.dataset.on]?.(el.value, el, e); });
document.addEventListener('input', e => { const el = e.target.closest('[data-input]'); if (el) acts[el.dataset.input]?.(el.value, el, e); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') sheet(''); });
acts.back = fallback => back(fallback || 'today');

addEventListener('pagehide', flush);
document.addEventListener('visibilitychange', () => { if (document.hidden) flush(); });

// Start
parse();
if (S.summary) go('summary', null, { replace: true });
else if (S.active) go('play', null, { replace: true });
render();
setTimeout(syncNow, 800);

// Offline support. When a new version takes over, offer a reload unless a session is running.
if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  const hadController = !!navigator.serviceWorker.controller;
  navigator.serviceWorker.register('./sw.js').then(reg => {
    document.addEventListener('visibilitychange', () => { if (!document.hidden) reg.update().catch(() => {}); });
  }).catch(() => {});
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!hadController || S.active) return;
    sheet(`<h3>${t('m.update')}</h3><div class="btns"><button class="btn primary block" data-act="reload">${t('m.reload')}</button>
      <button class="btn block" data-act="sheet-close">${t('close')}</button></div>`);
  });
}
acts.reload = () => location.reload();
