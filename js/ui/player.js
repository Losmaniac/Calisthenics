// The session player: guided mode (one step at a time, with timers) and list mode (the whole session as a logbook).
import { S, commit, uid, levels, fullCount } from '../store.js';
import { acts, views, route, go, sheet } from './nav.js';
import { t, num, clock } from '../i18n.js';
import { buildSession, buildBaseline, buildRoutine } from '../engine/plan.js';
import { esc, exFig, exName, thumb, range, val, stepTarget, howTo, ICON } from './common.js';
import { animate } from './anim.js';
import * as sound from '../sound.js';
import { finishSession } from './summary.js';

const READY = 5, READY_HOLD = 3;
const LOCAL = { local: true };
const A = () => S.active;
let pv = 0; // value being entered in a stepper

export function start(type, arg) {
  sound.unlock();
  const p = S.profile;
  const built = type === 'baseline' ? buildBaseline(p) : type === 'routine' ? buildRoutine(arg, p) : buildSession(p, levels(), fullCount());
  if (!built.steps.length) return;
  commit(s => {
    s.active = { ...built, id: uid(), date: new Date().toISOString(), log: built.steps.map(() => null), mode: 'guided' };
    enter(s.active, 0);
  }, { local: true, quiet: true });
  go('play');
}

// ---------- step machine
function timer(a, secs) { a.endsAt = Date.now() + secs * 1000; a.total = secs; a.beeped = null; }

function enter(a, i) {
  Object.assign(a, { i, side: 0, first: null, paused: null, beeped: null, t0: null, endsAt: null, total: 0 });
  const st = a.steps[i], prev = a.steps[i - 1];
  if (st.k === 'rest') { a.phase = 'run'; timer(a, st.secs); return; }
  if (st.k === 'timed' || st.k === 'work') {
    if (prev && (prev.k === 'rest' || prev.k === 'work')) { a.phase = 'run'; timer(a, st.secs); }
    else { a.phase = 'ready'; timer(a, READY); }
    return;
  }
  a.phase = 'idle';
}

function advance(a) {
  if (a.i + 1 >= a.steps.length) { finishSession(false); return; }
  commit(() => enter(a, a.i + 1), LOCAL);
}

function expire(a, st) {
  if (a.phase === 'ready') {
    sound.go();
    if (st.k === 'set') { a.phase = 'run'; a.t0 = Date.now(); a.beeped = null; }
    else { a.phase = 'run'; timer(a, st.secs); }
    commit(null, LOCAL);
    return;
  }
  if (st.k === 'rest') sound.go();
  else { a.log[a.i] = st.secs; sound.done(); }
  advance(a);
}

// Default for the number entry: earlier set today, else the last session with this exercise.
function guess(a, i) {
  const st = a.steps[i];
  for (let j = i - 1; j >= 0; j--) if (a.steps[j].k === 'set' && a.steps[j].ex === st.ex && a.log[j] != null) return a.log[j];
  for (let k = S.sessions.length - 1; k >= 0; k--) {
    const s = S.sessions[k];
    if (s.deleted) continue;
    const j = s.steps.findIndex((x, n) => x.k === 'set' && x.ex === st.ex && s.log?.[n] != null);
    if (j >= 0) return s.log[j];
  }
  return st.max ? 0 : st.lo;
}

// ---------- ticking: updates the numbers in place, re-renders only on phase changes
let iv = 0;
const paint = (id, text) => { const el = document.getElementById(id); if (el && el.textContent !== text) el.textContent = text; };
function loop() { clearInterval(iv); iv = setInterval(tick, 200); tick(); }

function tick() {
  const a = A();
  if (!a || route.name !== 'play' || a.mode !== 'guided') { clearInterval(iv); return; }
  paint('elapsed', clock((Date.now() - new Date(a.date)) / 1000));
  const st = a.steps[a.i];
  if (!st || a.paused) return;
  const now = Date.now();
  if (st.k === 'set' && a.phase === 'run') {
    const sec = Math.floor((now - a.t0) / 1000);
    paint('clock', num(sec));
    if (!st.max && a.beeped == null && sec >= st.lo) {
      a.beeped = 'lo'; sound.mark();
      const r = document.getElementById('reached'); if (r) r.hidden = false;
    }
    if (!st.max && a.beeped === 'lo' && sec >= st.hi) { a.beeped = 'hi'; sound.done(); }
    return;
  }
  if (a.phase !== 'ready' && a.phase !== 'run') return;
  const left = (a.endsAt - now) / 1000;
  if (left <= 0) { expire(a, st); return; }
  const whole = Math.ceil(left);
  if (whole <= 3 && a.beeped !== whole && !document.hidden) { a.beeped = whole; sound.tick(); }
  if (a.phase === 'run' && st.k === 'timed' && st.side && a.side === 0 && left <= st.secs / 2) {
    a.side = 1; sound.sides(); commit(null, LOCAL); return;
  }
  paint('clock', a.phase === 'ready' ? String(whole) : clock(left));
  const bar = document.getElementById('bar');
  if (bar) bar.style.width = Math.min(100, (1 - left / a.total) * 100) + '%';
}

// ---------- wake lock
let lock = null;
async function wake(on) {
  try {
    if (on && S.profile.awake && 'wakeLock' in navigator && !lock) {
      lock = await navigator.wakeLock.request('screen');
      lock.addEventListener('release', () => { lock = null; });
    } else if (!on && lock) { const l = lock; lock = null; await l.release(); }
  } catch { lock = null; }
}
document.addEventListener('visibilitychange', () => {
  if (document.hidden || route.name !== 'play') return;
  wake(true); tick();
});
document.addEventListener('pointerdown', () => { if (route.name === 'play') sound.unlock(); }, { passive: true });

// ---------- rendering
function progress(a) {
  return `<div class="p-prog">${a.blocks.map(b => {
    const done = a.i >= b.to ? 1 : a.i < b.from ? 0 : (a.i - b.from) / (b.to - b.from);
    return `<i style="flex:${b.secs}"><b style="width:${done * 100}%"></b></i>`;
  }).join('')}</div>`;
}

function header(a, label) {
  return `<header class="p-top">
    <button class="btn" data-act="p-end">${t('p.end')}</button>
    <div class="p-where"><b>${label}</b><span id="elapsed">${clock((Date.now() - new Date(a.date)) / 1000)}</span></div>
    <button class="btn" data-act="p-mode">${a.mode === 'guided' ? t('p.list') : t('p.guided')}</button>
  </header>`;
}

export const stepper = kind => `<div class="stepper">
    <button data-act="pv" data-arg="-1" aria-label="-1">−</button><span class="v" id="pv">${num(pv)}</span><button data-act="pv" data-arg="1" aria-label="+1">+</button>
  </div>${kind === 'reps' ? '' : `<div class="nudges"><button data-act="pv" data-arg="-5">−5</button><button data-act="pv" data-arg="5">+5</button></div>`}`;

const nameBtn = id => `<h1 class="p-name"><button data-act="p-info" data-arg="${id}">${esc(exName(id))}</button></h1>`;

function setMeta(st) {
  const base = st.max ? t('block.test') : t('p.setOf', st.set, st.of);
  return base + (st.side ? ', ' + t('eachSide') : '');
}

function nextCard(a) {
  const j = a.steps.findIndex((x, k) => k > a.i && x.k !== 'rest');
  if (j < 0) return '';
  const n = a.steps[j];
  const meta = n.k === 'set' ? `${setMeta(n)}: ${n.max ? 'max' : range(n.lo, n.hi) + (n.kind === 'hold' ? ' s' : '')}` : `${num(n.secs)} s`;
  return `<button class="p-next" data-act="p-info" data-arg="${n.ex}">${thumb(n.ex)}<span class="main"><span>${t('p.nextUp')}</span><b>${esc(exName(n.ex))}</b><span>${meta}</span></span></button>`;
}

function stage(a) {
  const st = a.steps[a.i];
  const left = a.paused ? a.paused.left / 1000 : Math.max(0, ((a.endsAt ?? 0) - Date.now()) / 1000);
  const pauseBtn = a.paused ? `<button class="btn" data-act="p-resume">${t('p.resume')}</button>` : `<button class="btn" data-act="p-pause">${t('p.pause')}</button>`;
  const barPct = a.total ? Math.min(100, (1 - left / a.total) * 100) : 0;
  const barHtml = `<div class="p-bar"><i id="bar" style="width:${barPct}%"></i></div>`;

  if (st.k === 'rest') {
    return `<div class="p-stage is-rest">
        <p class="p-label">${t('p.rest')}</p>
        <p class="p-big" id="clock">${clock(left)}</p>${barHtml}${nextCard(a)}
      </div>
      <div class="p-ctrl"><div class="two"><button class="btn" data-act="p-more">${t('p.plus')}</button><button class="btn primary" data-act="p-skip">${t('p.skipRest')}</button></div></div>`;
  }

  if (st.k === 'timed' || st.k === 'work') {
    let meta = '';
    if (a.phase === 'ready') meta = t('p.getReady');
    else if (a.side) meta = t('p.switch');
    else if (st.k === 'work') {
      const blk = a.blocks.find(b => a.i >= b.from && a.i < b.to);
      const works = a.steps.slice(blk.from, blk.to).filter(x => x.k === 'work').length;
      const nth = a.steps.slice(blk.from, a.i + 1).filter(x => x.k === 'work').length;
      meta = t('p.roundOf', nth, works);
    } else if (st.side) meta = t('eachSide');
    return `<div class="p-stage">
        ${exFig(st.ex, { live: a.phase === 'run' && !a.paused, cls: 'p-fig', ghost: false })}
        ${nameBtn(st.ex)}
        <p class="p-meta${a.side || a.phase === 'ready' ? ' alert' : ''}">${meta}</p>
        <p class="p-big" id="clock">${a.phase === 'ready' ? Math.ceil(left) : clock(left)}</p>${barHtml}
      </div>
      <div class="p-ctrl"><div class="two">${pauseBtn}<button class="btn" data-act="p-skip">${t('p.skip')}</button></div></div>`;
  }

  // a set
  const hold = st.kind === 'hold';
  if (a.phase === 'log') {
    return `<div class="p-stage">
        ${nameBtn(st.ex)}
        <p class="p-meta">${hold ? t('p.howLong') : t('p.howMany')}</p>
        ${stepper(st.kind)}
        ${st.side ? `<p class="p-meta">${t('p.perSide')}</p>` : ''}
      </div>
      <div class="p-ctrl"><button class="btn primary big" data-act="p-save">${t('save')}</button><button class="btn quiet" data-act="p-skip">${t('p.skip')}</button></div>`;
  }
  if (a.phase === 'ready') {
    return `<div class="p-stage">
        ${exFig(st.ex, { cls: 'p-fig', ghost: false })}
        ${nameBtn(st.ex)}
        <p class="p-meta alert">${a.side ? t('p.otherSide') : t('p.getReady')}</p>
        ${a.first != null ? `<p class="p-meta">${t('p.firstSide', num(a.first))}</p>` : ''}
        <p class="p-big" id="clock">${Math.ceil(left)}</p>
      </div>
      <div class="p-ctrl"><button class="btn quiet" data-act="p-skip">${t('p.skip')}</button></div>`;
  }
  if (a.phase === 'run') {
    const sec = Math.floor((Date.now() - a.t0) / 1000);
    return `<div class="p-stage">
        ${exFig(st.ex, { live: true, cls: 'p-fig' })}
        ${nameBtn(st.ex)}
        <p class="p-meta">${st.max ? t('p.maxHold') : `${range(st.lo, st.hi)} s`}</p>
        <p class="p-big" id="clock">${num(sec)}</p>
        <p class="p-unit">${t('p.uSecs')}</p>
        <div style="text-align:center"><span class="reached" id="reached"${!st.max && sec >= st.lo ? '' : ' hidden'}>${t('p.held')}</span></div>
      </div>
      <div class="p-ctrl"><button class="btn primary big" data-act="p-stop">${t('p.stop')}</button></div>`;
  }
  const best = S.pr[st.ex]?.v;
  return `<div class="p-stage">
      ${exFig(st.ex, { live: true, cls: 'p-fig' })}
      ${nameBtn(st.ex)}
      <p class="p-meta">${setMeta(st)}</p>
      <p class="p-big">${st.max ? 'max' : range(st.lo, st.hi)}</p>
      <p class="p-unit">${st.max ? (hold ? t('p.maxHold') : t('p.maxReps')) : hold ? t('p.uSecs') : t('p.uReps')}</p>
      ${best ? `<p class="p-meta">${t('p.last', val(best, st.kind))}</p>` : ''}
    </div>
    <div class="p-ctrl">
      <button class="btn primary big" data-act="${hold ? 'p-hold' : 'p-done'}">${hold ? t('p.startHold') : t('p.setDone')}</button>
      <div class="two"><button class="btn quiet" data-act="p-skip">${t('p.skip')}</button>${hold
        ? `<button class="btn quiet" data-act="p-byhand">${t('p.byHand')}</button>`
        : `<button class="btn quiet" data-act="p-info" data-arg="${st.ex}">${t('x.how')}</button>`}</div>
    </div>`;
}

function guided(a) {
  const blk = a.blocks.find(b => a.i >= b.from && a.i < b.to) ?? a.blocks.at(-1);
  return `<div class="player">${header(a, t('block.' + blk.type))}${progress(a)}${stage(a)}</div>`;
}

function list(a) {
  const blocks = a.blocks.map(b => {
    const groups = new Map();
    for (let i = b.from; i < b.to; i++) {
      const st = a.steps[i];
      if (st.k === 'rest') continue;
      if (!groups.has(st.ex)) groups.set(st.ex, []);
      groups.get(st.ex).push(i);
    }
    const firstOpen = a.steps.findIndex((x, i) => x.k !== 'rest' && a.log[i] == null);
    const rows = [...groups].map(([ex, idx]) => {
      const st = a.steps[idx[0]];
      const tgt = st.k === 'set' ? stepTarget(st) : idx.length > 1 ? `${idx.length} × ${num(st.secs)} s` : `${num(st.secs)} s`;
      const cells = idx.map((i, n) => {
        const v = a.log[i], cls = v != null ? ' on' : i === firstOpen ? ' cur' : '';
        const label = st.k === 'set' ? (v != null ? num(v) : n + 1) : v != null ? ICON.check : '';
        return `<button class="cell${cls}" data-act="cell" data-arg="${i}" aria-label="${n + 1}">${label}</button>`;
      }).join('');
      return `<div class="lrow"><a class="main" href="#ex/${ex}"><b>${esc(exName(ex))}</b><span>${tgt}</span></a><div class="cells">${cells}</div></div>`;
    }).join('');
    return `<h2 class="sec">${t('block.' + b.type)}</h2>${rows}`;
  }).join('');
  return `<div class="player p-list">${header(a, t('p.list'))}${blocks}
    <div class="btns"><button class="btn primary big block" data-act="p-finish">${t('p.finish')}</button></div></div>`;
}

views.play = {
  render() { const a = A(); return a ? (a.mode === 'list' ? list(a) : guided(a)) : ''; },
  after() { if (A()?.mode === 'guided') loop(); wake(true); },
  leave() { clearInterval(iv); wake(false); },
};

// ---------- actions
const cur = () => { const a = A(); return [a, a?.steps[a.i]]; };
const redraw = () => commit(null, LOCAL);

acts['p-skip'] = () => { const [a] = cur(); if (a) advance(a); };
acts['p-pause'] = () => { const [a] = cur(); if (!a?.endsAt) return; a.paused = { left: a.endsAt - Date.now() }; redraw(); };
acts['p-resume'] = () => { const [a] = cur(); if (!a?.paused) return; a.endsAt = Date.now() + a.paused.left; a.paused = null; redraw(); };
acts['p-more'] = () => { const [a] = cur(); if (!a?.endsAt) return; a.endsAt += 15000; a.total += 15; commit(null, { local: true, quiet: true }); tick(); };
acts['p-done'] = () => { const [a] = cur(); pv = guess(a, a.i); a.phase = 'log'; redraw(); };
acts['p-byhand'] = acts['p-done'];
acts['p-hold'] = () => { const [a] = cur(); sound.unlock(); a.phase = 'ready'; timer(a, READY_HOLD); redraw(); };
acts['p-stop'] = () => {
  const [a, st] = cur();
  const sec = Math.floor((Date.now() - a.t0) / 1000);
  if (st.side && a.side === 0) { a.first = sec; a.side = 1; a.phase = 'ready'; timer(a, READY_HOLD); sound.sides(); redraw(); return; }
  pv = st.side ? Math.min(a.first, sec) : sec;
  a.phase = 'log'; redraw();
};
acts['p-save'] = () => { const [a] = cur(); a.log[a.i] = pv; advance(a); };
acts.pv = d => { pv = Math.max(0, pv + Number(d)); paint('pv', num(pv)); };

acts['p-info'] = id => {
  sheet(`<h3>${esc(exName(id))}</h3>${exFig(id, { live: true, cls: 'ex-fig' })}${howTo(id)}
    <div class="btns"><button class="btn block" data-act="sheet-close">${t('close')}</button></div>`);
  animate();
};

acts['p-end'] = () => sheet(`<h3>${t('p.endQ')}</h3><p>${t('p.endD')}</p>
  <div class="btns"><button class="btn primary block" data-act="p-end-yes">${t('p.end')}</button><button class="btn block" data-act="sheet-close">${t('p.keep')}</button></div>`);
acts['p-end-yes'] = () => { sheet(''); finishSession(true); };
acts['p-finish'] = () => finishSession(false);

acts['p-mode'] = () => {
  const [a] = cur();
  if (a.mode === 'guided') { a.mode = 'list'; clearInterval(iv); redraw(); return; }
  const open = (from = 0) => a.steps.findIndex((x, k) => k >= from && x.k !== 'rest' && a.log[k] == null);
  let j = open(a.i);
  if (j < 0) j = open(0);
  if (j < 0) { finishSession(false); return; }
  a.mode = 'guided';
  commit(() => enter(a, j), LOCAL);
};

acts.cell = arg => {
  const [a] = cur(), i = Number(arg), st = a.steps[i];
  if (st.k !== 'set') { a.log[i] = a.log[i] == null ? st.secs : null; redraw(); return; }
  pv = a.log[i] ?? guess(a, i);
  sheet(`<h3>${esc(exName(st.ex))}</h3><p class="muted">${setMeta(st)}, ${stepTarget(st)}</p>${stepper(st.kind)}
    <div class="btns two"><button class="btn" data-act="cell-clear" data-arg="${i}">${t('p.skip')}</button><button class="btn primary" data-act="cell-save" data-arg="${i}">${t('save')}</button></div>`);
};
acts['cell-save'] = i => { A().log[i] = pv; sheet(''); redraw(); };
acts['cell-clear'] = i => { A().log[i] = null; sheet(''); redraw(); };
