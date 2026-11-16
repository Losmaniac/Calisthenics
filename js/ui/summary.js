// Ends a session (records, level-up suggestions, XP, badges) and shows the result.
import { S, commit, fullCount, liveSessions, touchSession } from '../store.js';
import { acts, views, go } from './nav.js';
import { t, num, dateLong, nm } from '../i18n.js';
import { EX } from '../data/exercises.js';
import { TRACK } from '../data/tracks.js';
import { LESSONS } from '../data/lessons.js';
import { ROUTINES } from '../data/routines.js';
import { evaluate, applyMove, records, seedLevels } from '../engine/progress.js';
import { sessionXp, XP, BADGES, derive, award, thisWeek, levelOf } from '../engine/game.js';
import { esc, exFig, exName, thumb, val, levelInfo, fig } from './common.js';

const PLAYER_KEYS = ['mode', 'phase', 'i', 'side', 'first', 'paused', 'beeped', 't0', 'endsAt', 'total'];

export function finishSession(early) {
  const a = S.active;
  if (!a) return;
  commit(st => {
    const now = new Date();
    const s = Object.fromEntries(Object.entries(a).filter(([k]) => !PLAYER_KEYS.includes(k)));
    s.ended = now.toISOString();
    s.dur = Math.round((now - new Date(s.date)) / 1000);
    s.finished = !early;
    const sets = s.steps.filter(x => x.k === 'set').length;
    const logged = s.steps.filter((x, i) => x.k === 'set' && s.log[i] != null).length;
    s.counted = s.type === 'session' && logged > 0 && (s.finished || logged >= sets / 2);

    const weekBefore = thisWeek(liveSessions());
    const xpBefore = st.game.xp;
    const moves = s.type === 'session' ? evaluate(s, st.tracks, st.profile.eq) : [];
    const broken = s.type === 'routine' ? [] : records(s, st.pr, s.ended);
    let xp = sessionXp(s, broken.length);

    let placed = null;
    if (s.type === 'baseline' && logged) {
      const res = {};
      s.steps.forEach((x, i) => { if (x.test && s.log[i] != null) res[x.test] = s.log[i]; });
      const L = seedLevels(st.profile.level, res);
      for (const [id, lv] of Object.entries(L)) if (st.tracks[id]) Object.assign(st.tracks[id], { level: lv, hits: 0, misses: 0 });
      st.baseline = { d: s.ended, res };
      placed = ['push', 'pull', 'dip', 'hs', 'lsit', 'fl'];
    }

    st.sessions.push(s);
    touchSession(s);
    let week = false;
    if (s.counted && weekBefore < st.profile.days && thisWeek(liveSessions()) >= st.profile.days) { week = true; xp += XP.week; }
    s.xp = xp;
    st.game.xp += xp;
    const badges = award(st, derive(st, LESSONS.length), s.ended).map(b => b.id);
    const lesson = s.counted ? LESSONS.find(l => l.at === fullCount() && !st.lessons[l.id])?.id ?? null : null;
    st.summary = { id: s.id, xp, xpBefore, moves: moves.map(m => ({ ...m, done: null })), broken, badges, week, placed, lesson };
    st.active = null;
  }, { quiet: true });
  go('summary', null, { replace: true });
}

// ---------- view
let counted = null; // the summary whose XP count-up already played

function moveCard(m, k) {
  const tr = TRACK[m.track];
  const from = tr.steps[m.from], to = tr.steps[m.to];
  if (m.done != null) {
    const msg = m.done ? t('s.moved', exName(to)) : t('s.stay', exName(from));
    return `<div class="move"><h3>${esc(nm(tr))}</h3><p class="resolved">${esc(msg)}</p></div>`;
  }
  const up = m.dir > 0;
  return `<div class="move">
    <h3>${esc(nm(tr))}</h3>
    <p class="muted small">${up ? t('s.upD') : t('s.downD')}</p>
    <div class="move-figs">
      <div class="from">${exFig(from)}<span>${esc(exName(from))}</span></div>
      <div>${exFig(to, { live: true })}<span><b>${esc(exName(to))}</b></span></div>
    </div>
    <div class="btns two">
      <button class="btn" data-act="mv" data-arg="${k}:0">${up ? t('s.upNo') : t('s.downNo')}</button>
      <button class="btn primary" data-act="mv" data-arg="${k}:1">${up ? t('s.upYes') : t('s.downYes')}</button>
    </div></div>`;
}

views.summary = {
  render() {
    const sm = S.summary;
    const s = sm && S.sessions.find(x => x.id === sm.id);
    if (!s) return '';
    const title = s.type === 'baseline' ? t('s.test') : s.type === 'routine' ? t('s.routine') : s.finished ? t('s.title') : t('s.partial');
    const lvBefore = levelOf(sm.xpBefore).level, li = levelInfo(S.game.xp);
    const recs = sm.broken.length ? `<h2 class="sec">${t('s.records')}</h2><div class="list">${sm.broken.map(r =>
      `<div class="row"><div class="main"><b>${esc(exName(r.ex))}</b><span>${t('s.was', val(r.was, r.kind))}</span></div><span class="tag gold">${val(r.v, r.kind)}</span></div>`).join('')}</div>` : '';
    const moves = sm.moves.length ? `<h2 class="sec">${t('s.moves')}</h2>${sm.moves.map(moveCard).join('')}` : '';
    const placed = sm.placed ? `<h2 class="sec">${t('s.placed')}</h2><div class="list">${sm.placed.map(id => {
      const tr = TRACK[id], ex = tr.steps[S.tracks[id].level];
      return `<a class="row" href="#ladder/${id}">${thumb(ex)}<div class="main"><b>${esc(exName(ex))}</b><span>${esc(nm(tr))}</span></div></a>`;
    }).join('')}</div>` : '';
    const badges = sm.badges.length ? `<h2 class="sec">${t('s.badges')}</h2><div class="badges">${sm.badges.map(id => {
      const b = BADGES.find(x => x.id === id), txt = S.profile.lang === 'cs' ? b.cs : b.en;
      return `<div class="badge on"><div class="bd">${b.fig ? fig(b.fig, { ghost: false, fit: -90 }) : esc(b.num)}</div><span>${esc(txt[0])}</span></div>`;
    }).join('')}</div>` : '';
    const lesson = sm.lesson ? `<div class="card"><h2 class="sec">${t('s.lesson')}</h2><p>${esc((S.profile.lang === 'cs' ? LESSONS.find(l => l.id === sm.lesson).cs : LESSONS.find(l => l.id === sm.lesson).en).t)}</p>
      <a class="btn small" href="#lesson/${sm.lesson}">${t('s.read')}</a></div>` : '';
    const routineName = s.type === 'routine' ? nm(ROUTINES.find(r => r.id === s.routine)) : '';
    return `<div class="sum">
      <p class="date">${dateLong(s.date)}${routineName ? ', ' + esc(routineName) : ''}</p>
      <h1 class="title">${title}</h1>
      <p class="sub">${t('s.time', num(Math.max(1, Math.round(s.dur / 60))))}</p>
      <div class="xp-line"><b id="xp-count">+${num(sm.xp)}</b><span>XP</span></div>
      <div class="xpbar"><i style="width:${li.pct}%"></i></div>
      ${li.level > lvBefore ? `<p class="lvl-up"><span class="disc">${li.level}</span>${t('s.level', li.level)}, ${esc(nm2(li.title))}</p>` : ''}
      ${sm.week ? `<p style="margin-top:14px"><span class="goal-met">${t('s.weekGoal')}</span></p>` : ''}
      ${moves}${placed}${recs}${badges}${lesson}
      <div class="btns"><button class="btn primary big block" data-act="summary-done">${t('s.finish')}</button></div>
    </div>`;
  },
  after() {
    const sm = S.summary;
    if (!sm || counted === sm.id || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    counted = sm.id;
    const el = document.getElementById('xp-count'), t0 = performance.now(), dur = 900;
    const step = now => {
      const k = Math.min(1, (now - t0) / dur), e = 1 - (1 - k) ** 3;
      if (el.isConnected) el.textContent = '+' + num(Math.round(sm.xp * e));
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  },
};
const nm2 = title => (S.profile.lang === 'cs' ? title[2] : title[1]);

acts.mv = arg => {
  const [k, yes] = arg.split(':').map(Number);
  commit(st => {
    const m = st.summary.moves[k];
    if (!m || m.done != null) return;
    applyMove(st.tracks, m, !!yes);
    m.done = !!yes;
    if (yes && m.dir > 0) {
      st.game.xp += XP.levelUp; st.summary.xp += XP.levelUp;
      const s = st.sessions.find(x => x.id === st.summary.id);
      if (s) { s.xp = (s.xp ?? 0) + XP.levelUp; touchSession(s); }
      for (const b of award(st, derive(st, LESSONS.length), new Date().toISOString())) st.summary.badges.push(b.id);
    }
  });
};
acts['summary-done'] = () => { commit(st => { st.summary = null; }); go('today', null, { replace: true }); };

