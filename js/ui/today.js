// Today: the next session, the current week, and short routines for rest days.
import { S, commit, levels, fullCount, liveSessions } from '../store.js';
import { acts, views, go, sheet } from './nav.js';
import { t, tp, num, dateLong, dayNames, nm, L } from '../i18n.js';
import { TRACK } from '../data/tracks.js';
import { ROUTINES } from '../data/routines.js';
import { LESSONS } from '../data/lessons.js';
import { buildSession, buildRoutine } from '../engine/plan.js';
import { streak, thisWeek, dayKey, weekStart } from '../engine/game.js';
import { esc, fig, exFig, exName, thumb, stepTarget, levelInfo, ICON } from './common.js';
import { start } from './player.js';

const ROUTINE_FIG = { mobility: 'sideLean', roll: 'rollUpper', stretch: 'pikeFold' };

export function levelChip() {
  const li = levelInfo(S.game.xp);
  return `<a class="lvl" href="#progress" aria-label="${t('s.level', li.level)}"><span class="disc">${li.level}</span>
    <span class="xp"><span class="xpbar"><i style="width:${li.pct}%"></i></span><small>${num(S.game.xp)} XP</small></span></a>`;
}

function weekStrip() {
  const live = liveSessions(), goal = S.profile.days;
  const mon = weekStart(new Date()), names = dayNames(), today = dayKey(new Date());
  const trained = new Set(live.filter(s => s.counted).map(s => dayKey(new Date(s.date))));
  const days = Array.from({ length: 7 }, (_, k) => { const d = new Date(mon); d.setDate(d.getDate() + k); return d; });
  const n = thisWeek(live), run = streak(live, goal);
  const count = t('today.weekCount', num(n), num(goal));
  return `<h2 class="sec">${t('today.week')}</h2>
    <div class="week">${days.map(d => {
      const k = dayKey(d);
      return `<div class="d${trained.has(k) ? ' on' : ''}${k === today ? ' now' : ''}"><i></i>${names[d.getDay()]}</div>`;
    }).join('')}</div>
    <p>${n >= goal ? `<span class="goal-met">${count}</span>` : count}${run ? `<span class="muted">, ${tp('weeks', run)}</span>` : ''}</p>`;
}

function blocks(s) {
  return s.blocks.map(b => {
    const steps = s.steps.slice(b.from, b.to).filter(x => x.ex);
    const mins = Math.max(1, Math.round(b.secs / 60));
    let body;
    if (b.type === 'skill' || b.type === 'strength' || b.type === 'test') {
      const seen = new Set();
      body = steps.filter(x => x.k === 'set' && !seen.has(x.ex) && seen.add(x.ex))
        .map(x => `<a class="exline" href="#ex/${x.ex}"><span>${esc(exName(x.ex))}</span><span>${x.max ? 'max' : stepTarget(x)}</span></a>`).join('');
    } else {
      const ids = [...new Set(steps.map(x => x.ex))];
      body = `<div class="blk-x">${ids.map(id => `<a href="#ex/${id}">${esc(exName(id))}</a>`).join(', ')}</div>`;
    }
    return `<div class="blk"><div class="blk-h"><i class="sw b-${b.type}"></i><b>${t('block.' + b.type)}</b><span>${t('r.minutes', mins)}</span></div>${body}</div>`;
  }).join('');
}

views.today = {
  tab: 'today',
  render() {
    const live = liveSessions();
    const s = buildSession(S.profile, levels(), fullCount());
    const skill = s.skills[0];
    const heroEx = s.steps.find(x => x.track === skill)?.ex ?? s.steps.find(x => x.k === 'set')?.ex;
    const trainedToday = live.some(s2 => s2.counted && dayKey(new Date(s2.date)) === dayKey(new Date()));

    const a = S.active;
    const active = a ? (() => {
      const open = a.steps.filter(x => x.k !== 'rest').length;
      const done = a.steps.filter((x, i) => x.k !== 'rest' && a.log[i] != null).length;
      return `<div class="card"><h2 class="sec">${t('today.continue')}</h2><p class="muted">${t('today.progress', num(done), num(open))}</p>
        <div class="btns two"><button class="btn" data-act="discard">${t('today.discard')}</button><button class="btn primary" data-act="resume">${t('p.continue')}</button></div></div>`;
    })() : '';

    const baseline = !S.baseline && !fullCount() && !a ? `<div class="card"><h2 class="sec">${t('today.baseline.t')}</h2><p>${t('today.baseline.d')}</p>
      <button class="btn small" data-act="start" data-arg="baseline">${t('today.baseline.go')}</button></div>` : '';

    const lesson = LESSONS.find(l => l.at <= fullCount() && !S.lessons[l.id]);
    const lessonRow = lesson ? `<a class="row" href="#lesson/${lesson.id}">${thumb(null, lesson.fig)}
      <div class="main"><span>${t('today.lesson')}</span><b>${esc(L(lesson).t)}</b></div><span class="side">${ICON.chevron}</span></a>` : '';

    const routines = ROUTINES.filter(r => buildRoutine(r.id, S.profile).steps.length).map(r =>
      `<button class="row" data-act="start" data-arg="routine:${r.id}">${thumb(null, ROUTINE_FIG[r.id])}
        <div class="main"><b>${esc(nm(r))}</b><span>${t('r.minutes', r.minutes)}</span></div><span class="side">${ICON.chevron}</span></button>`).join('');

    return `<div class="top"><p class="date">${dateLong(new Date())}</p>${levelChip()}</div>
      ${active}${baseline}
      <section class="hero">
        ${trainedToday ? `<p class="muted">${t('today.doneToday')}</p>` : ''}
        <h1 class="title">${esc(skill ? nm(TRACK[skill]) : exName(heroEx))}</h1>
        <p class="sub">${t('today.about', num(fullCount() + 1), num(Math.round(s.secs / 60)))}</p>
        ${exFig(heroEx, { live: true, cls: 'hero-fig' })}
        <div class="tbar">${s.blocks.map(b => `<i class="b-${b.type}" style="flex:${Math.round(b.secs)}"></i>`).join('')}</div>
        <button class="btn primary big block" data-act="start">${t('today.start')}</button>
      </section>
      <h2 class="sec">${t('today.inside')}</h2>${blocks(s)}
      ${weekStrip()}
      ${lessonRow ? `<div class="list">${lessonRow}</div>` : ''}
      ${routines ? `<h2 class="sec">${t('today.recovery')}</h2><div class="list">${routines}</div>` : ''}`;
  },
};

// arg: "session" (default), "baseline" or "routine:<id>"
acts.start = (arg = '') => {
  const [type, id] = (arg || 'session').split(':');
  if (!S.active) { start(type, id); return; }
  sheet(`<h3>${t('today.discardQ')}</h3>
    <div class="btns"><button class="btn primary block" data-act="start-new" data-arg="${arg}">${t('today.discard')}</button>
    <button class="btn block" data-act="resume">${t('p.continue')}</button></div>`);
};
acts['start-new'] = arg => {
  sheet('');
  commit(s => { s.active = null; }, { local: true, quiet: true });
  acts.start(arg);
};
acts.resume = () => { sheet(''); go('play'); };
acts.discard = () => sheet(`<h3>${t('today.discardQ')}</h3>
  <div class="btns"><button class="btn primary block" data-act="discard-yes">${t('today.discard')}</button><button class="btn block" data-act="sheet-close">${t('cancel')}</button></div>`);
acts['discard-yes'] = () => { sheet(''); commit(s => { s.active = null; }, { local: true }); };
