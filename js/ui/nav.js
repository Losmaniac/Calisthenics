// Hash router, action registry and the small overlays (sheet, toast). No screen imports here.
export const acts = {};
export const views = {};
export const route = { name: 'today', arg: null };

let renderFn = () => {};
export const onRender = fn => { renderFn = fn; };
export const rerender = () => renderFn();

export function parse() {
  const [name, ...rest] = location.hash.slice(1).split('/');
  route.name = views[name] ? name : 'today';
  route.arg = rest.length ? decodeURIComponent(rest.join('/')) : null;
}

// Scroll positions are remembered per screen, so going back lands where you were.
const scrolls = {};
let lastY = 0, current = location.hash, moved = false;
addEventListener('scroll', () => { lastY = scrollY; }, { passive: true });
addEventListener('hashchange', () => {
  scrolls[current] = lastY; current = location.hash; moved = true;
  parse(); rerender();
  scrollTo(0, scrolls[current] ?? 0);
});
document.addEventListener('click', e => {
  const a = e.target.closest('a[href^="#"]');
  if (a) delete scrolls[a.getAttribute('href')];
}, true);

export function go(name, arg = null, { replace = false } = {}) {
  const hash = '#' + name + (arg != null ? '/' + encodeURIComponent(arg) : '');
  delete scrolls[hash];
  if (hash === location.hash) { parse(); rerender(); return; }
  if (replace) location.replace(hash); else location.hash = hash;
}
export const back = fallback => (moved && history.length > 1 ? history.back() : go(fallback ?? 'today', null, { replace: true }));

// Bottom sheet
export function sheet(html) {
  const el = document.getElementById('sheet');
  el.innerHTML = html ? `<div class="sheet-back" data-act="sheet-close"></div><div class="sheet-body" role="dialog" aria-modal="true">${html}</div>` : '';
  el.classList.toggle('open', !!html);
}
acts['sheet-close'] = () => sheet('');

let toastTimer;
export function toast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg; el.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('show'), 2600);
}
