// Skills: the progression ladders, the exercise library and the exercise screen.
import { S, commit } from '../store.js';
import { acts, views, toast, rerender } from './nav.js';
import { t, L, nm, tri, dateShort } from '../i18n.js';
import { EX, LIST, CATS, missingEq } from '../data/exercises.js';
import { TRACK, TRACKS, GROUPS } from '../data/tracks.js';
import { FIGS } from '../data/figures.js';
import { esc, exFig, exName, thumb, target, val, trackOf, eqName, backBtn, howTo, ICON } from './common.js';

const seg = on => `<nav class="seg"><a href="#skills"${on === 'ladders' ? ' class="on"' : ''}>${t('k.ladders')}</a><a href="#skills/library"${on === 'library' ? ' class="on"' : ''}>${t('k.library')}</a></nav>`;

function rungBar(tr) {
  const lv = S.tracks[tr.id]?.level ?? 0;
  return `<div class="rbar">${tr.steps.map((_, i) => `<i class="${i < lv ? 'on' : i === lv ? 'cur' : ''}"></i>`).join('')}</div>`;
}

function ladders() {
  const focus = S.profile.focus;
  return GROUPS.map(g => {
    let list = TRACKS.filter(tr => tr.group === g[0]);
    if (g[0] === 'skill') list = [...list].sort((a, b) => (focus.indexOf(a.id) + 1 || 99) - (focus.indexOf(b.id) + 1 || 99));
    const rows = list.map(tr => {
      const lv = S.tracks[tr.id]?.level ?? 0, ex = tr.steps[lv];
      return `<a class="row" href="#ladder/${tr.id}">${thumb(ex)}<div class="main">
        <b>${esc(nm(tr))}${focus.includes(tr.id) ? `<span class="tag">${t('k.focus')}</span>` : ''}</b>
        <span>${esc(exName(ex))}, ${t('k.rung', lv + 1, tr.steps.length)}</span>${rungBar(tr)}</div></a>`;
    }).join('');
    return `<h2 class="sec">${tri(g)}</h2><div class="list">${rows}</div>`;
  }).join('');
}

// ---------- library
let q = '', cat = '';
function libList() {
  const words = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const hits = LIST.filter(e => (!cat || e.cat === cat) && words.every(w => (L(e).n + ' ' + e.en.n).toLowerCase().includes(w)));
  if (!hits.length) return `<p class="muted" style="margin-top:16px">${t('k.none')}</p>`;
  return `<div class="list">${hits.map(e => `<a class="row" href="#ex/${e.id}">${thumb(e.id)}<div class="main"><b>${esc(L(e).n)}</b>
    <span>${tri(CATS.find(c => c[0] === e.cat))}</span></div><span class="side">${ICON.chevron}</span></a>`).join('')}</div>`;
}
function library() {
  return `<input type="search" class="search" placeholder="${t('k.search')}" value="${esc(q)}" data-input="lib-q" aria-label="${t('k.search')}">
    <div class="chips"><button class="chip${!cat ? ' on' : ''}" data-act="lib-cat" data-arg="">${t('k.all')}</button>${CATS.map(c =>
      `<button class="chip${cat === c[0] ? ' on' : ''}" data-act="lib-cat" data-arg="${c[0]}">${tri(c)}</button>`).join('')}</div>
    <p class="muted small">${t('k.count', LIST.length)}</p>
    <div id="lib-list">${libList()}</div>`;
}
acts['lib-q'] = v => { q = v; const el = document.getElementById('lib-list'); if (el) el.innerHTML = libList(); };
acts['lib-cat'] = c => { cat = c; rerender(); };

views.skills = {
  tab: 'skills',
  render(arg) {
    const lib = arg === 'library';
    return `<h1 class="title">${t('tab.skills')}</h1>${seg(lib ? 'library' : 'ladders')}${lib ? library() : ladders()}`;
  },
};

// ---------- one ladder
views.ladder = {
  tab: 'skills',
  render(id) {
    const tr = TRACK[id];
    if (!tr) return '';
    const lv = S.tracks[id]?.level ?? 0;
    const rows = tr.steps.map((ex, i) => {
      const miss = missingEq(EX[ex], S.profile.eq);
      const state = i < lv ? ' done' : i === lv ? ' cur' : '';
      const note = i === lv ? `<span><b>${t('k.here')}</b></span>` : '';
      const subst = miss.length ? `<span>${t('k.needs', miss.map(eqName).join(', '))}</span>` : '';
      return `<a class="row rung${state}" href="#ex/${ex}">${thumb(ex)}<div class="main"><b>${esc(exName(ex))}</b><span>${target(EX[ex])}</span>${note}${subst}</div></a>`;
    }).reverse().join('');
    return `${backBtn('skills')}<h1 class="title">${esc(nm(tr))}</h1>
      <p class="sub">${t('k.rung', lv + 1, tr.steps.length)}</p>
      <div class="ladder">${rows}</div>`;
  },
};

// ---------- one exercise
views.ex = {
  tab: 'skills',
  render(id) {
    const e = EX[id];
    if (!e) return '';
    const x = L(e), tr = trackOf(id);
    const pr = S.pr[id];
    const needs = e.eq.length ? e.eq.map(r => (Array.isArray(r) ? r.map(eqName).join(' / ') : eqName(r))).join(', ') : t('x.nothing');
    let ladder = '';
    if (tr) {
      const i = tr.steps.indexOf(id), lv = S.tracks[tr.id]?.level ?? 0;
      const prev = tr.steps[i - 1], next = tr.steps[i + 1];
      ladder = `<h2 class="sec">${t('x.ladder', esc(nm(tr)))}</h2>
        <p class="muted">${t('k.rung', i + 1, tr.steps.length)}${i === lv ? `, ${t('k.here').toLowerCase()}` : ''}</p>
        <div class="nav2">${prev ? `<a href="#ex/${prev}"><span>${t('x.easier')}</span><b>${esc(exName(prev))}</b></a>` : '<span></span>'}${next ? `<a href="#ex/${next}"><span>${t('x.harder')}</span><b>${esc(exName(next))}</b></a>` : '<span></span>'}</div>
        ${i !== lv ? `<div class="btns"><button class="btn block" data-act="set-rung" data-arg="${id}">${t('k.setHere')}</button></div><p class="muted small" style="margin-top:8px">${t('k.setHereD')}</p>` : ''}`;
    }
    const video = 'https://www.youtube.com/results?search_query=' + encodeURIComponent(e.en.n + ' calisthenics');
    return `${backBtn('skills')}
      ${exFig(id, { live: true, cls: 'ex-fig' })}
      ${FIGS[e.fig].view === 'top' ? `<p class="caption">${t('x.top')}</p>` : ''}
      <h1 class="title">${esc(x.n)}</h1>
      <p>${esc(x.s)}</p>
      <dl class="facts">
        <dt>${t('x.target')}</dt><dd>${target(e)}</dd>
        <dt>${t('x.equipment')}</dt><dd>${esc(needs)}</dd>
        ${pr ? `<dt>${t('x.record')}</dt><dd>${val(pr.v, e.kind)}, ${dateShort(pr.d)}</dd>` : ''}
      </dl>
      ${howTo(id)}
      <p style="margin-top:18px"><a class="btn small" href="${video}" target="_blank" rel="noopener">${t('x.video')}</a></p>
      ${ladder || `<p class="muted small" style="margin-top:24px">${t('x.variation')}</p>`}`;
  },
};

acts['set-rung'] = id => {
  const tr = trackOf(id);
  commit(s => Object.assign(s.tracks[tr.id], { level: tr.steps.indexOf(id), hits: 0, misses: 0 }));
  toast(t('k.setDone', exName(id)));
};
