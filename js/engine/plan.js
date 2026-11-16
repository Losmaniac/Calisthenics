// Builds training sessions from the ladders. Pure functions: same input, same session.
import { EX, hasEq } from '../data/exercises.js';
import { TRACK } from '../data/tracks.js';
import { WARMUP, HIP_DRILLS, WARMUP_OF, COOL_UPPER, COOL_LOWER, FINISHERS, ROUTINES } from '../data/routines.js';

// How a session of a given length is put together.
export const SHAPES = {
  20: { warm: 4, skills: 1, skillSets: 4, pairs: 2, rounds: 2, fin: 4, cool: 2, rest: 45 },
  30: { warm: 5, skills: 1, skillSets: 5, pairs: 2, rounds: 3, fin: 6, cool: 4, rest: 50 },
  45: { warm: 6, skills: 2, skillSets: 5, pairs: 3, rounds: 3, fin: 8, cool: 5, rest: 50 },
  60: { warm: 6, skills: 2, skillSets: 6, pairs: 3, rounds: 4, fin: 10, cool: 8, rest: 60 },
};
const WORK = 25, BREATH = 15, SWITCH = 20, DRILL = 40;

// The rung actually trained on a ladder: the current level, or the nearest one the equipment allows.
export function stepOf(track, level, owned) {
  const s = track.steps;
  for (let i = Math.min(level, s.length - 1); i >= 0; i--) if (hasEq(EX[s[i]], owned)) return i;
  for (let i = level + 1; i < s.length; i++) if (hasEq(EX[s[i]], owned)) return i;
  return -1;
}
export const exOf = (trackId, levels, owned) => {
  const i = stepOf(TRACK[trackId], levels[trackId] ?? 0, owned);
  return i < 0 ? null : TRACK[trackId].steps[i];
};

// Rough duration of one step in seconds, used for the time bar and for tests.
export function est(s) {
  if (s.k === 'rest' || s.k === 'work') return s.secs;
  if (s.k === 'timed') return s.secs + 5;
  const sides = s.side ? 2 : 1;
  if (s.max) return s.kind === 'hold' ? 45 : 40;
  return s.kind === 'hold' ? s.hi * sides + 5 : Math.min(45, Math.max(12, s.hi * 2.6)) * sides;
}
export const estimate = steps => steps.reduce((a, s) => a + est(s), 0);

const rotate = (list, n) => list.map((_, i) => list[(i + n) % list.length]);

function assemble(make) {
  const steps = [], blocks = [];
  const api = {
    block(type, fn, extra = {}) { const from = steps.length; fn(); if (steps.length > from) blocks.push({ type, from, to: steps.length, ...extra }); },
    timed(ex, secs = DRILL) { steps.push({ k: 'timed', ex, secs: EX[ex].side ? secs + 10 : secs, side: EX[ex].side ? 1 : 0 }); },
    set(ex, set, of, track, extra = {}) { const e = EX[ex]; steps.push({ k: 'set', ex, track, set, of, kind: e.kind, lo: e.t[1], hi: e.t[2], side: e.side ? 1 : 0, ...extra }); },
    rest(secs) { steps.push({ k: 'rest', secs }); },
    work(ex, secs) { steps.push({ k: 'work', ex, secs }); },
  };
  make(api);
  blocks.forEach(b => { b.secs = estimate(steps.slice(b.from, b.to)); });
  return { steps, blocks, secs: estimate(steps) };
}

// A regular session. `n` is the number of full sessions already done; it drives every rotation.
export function buildSession(profile, levels, n) {
  const shape = SHAPES[profile.minutes] ?? SHAPES[30];
  const owned = profile.eq;
  const ok = id => exOf(id, levels, owned) !== null;
  const pool = profile.focus.filter(ok).length ? profile.focus.filter(ok) : ['lsit', 'hs', 'planche'].filter(ok);
  const skills = [];
  for (let k = 0; k < shape.skills && k < pool.length; k++) skills.push(pool[(n + k) % pool.length]);
  const used = new Set(skills);
  const take = (list, shift = 0) => {
    for (let k = 0; k < list.length; k++) {
      const id = list[(n + shift + k) % list.length];
      if (ok(id) && !used.has(id)) { used.add(id); return id; }
    }
    return null;
  };
  // On days whose skill is already heavy pulling, the pull-up ladder rests.
  const pullDay = ['mu', 'oap'].includes(skills[0]);
  const pairs = [
    [take(['dip', 'push', 'hspu']), (pullDay ? null : take(['pull'])) ?? take(['line', 'core'])],
    [take(['legs', 'hams']), take(['core', 'line', 'dragon', 'lsit'])],
  ];
  if (shape.pairs > 2) pairs.push([take(['push', 'hspu', 'dip', 'power'], 1), take(['line', 'core', 'dragon', 'lsit'], 1)]);
  const family = WARMUP_OF[skills[0]] ?? 'support';
  const hip = HIP_DRILLS[n % HIP_DRILLS.length];

  const built = assemble(a => {
    a.block('warmup', () => {
      const list = [...new Set(WARMUP[family].map(id => id === 'deep-squat-hold' ? hip : id))].filter(id => hasEq(EX[id], owned));
      list.slice(0, shape.warm).forEach(id => a.timed(id));
    });
    a.block('skill', () => {
      for (const t of skills) {
        const ex = exOf(t, levels, owned);
        for (let s = 1; s <= shape.skillSets; s++) { a.set(ex, s, shape.skillSets, t); a.rest(shape.rest); }
      }
    });
    a.block('strength', () => {
      for (const pair of pairs) {
        const [x, y] = pair.filter(Boolean).map(t => [t, exOf(t, levels, owned)]);
        if (!x) continue;
        for (let r = 1; r <= shape.rounds; r++) {
          a.set(x[1], r, shape.rounds, x[0]);
          if (y) { a.rest(SWITCH); a.set(y[1], r, shape.rounds, y[0]); }
          a.rest(shape.rest);
        }
      }
    });
    a.block('finisher', () => {
      const duo = FINISHERS[n % FINISHERS.length];
      for (let r = 0; r < shape.fin; r++) { a.work(duo[r % 2], WORK); a.rest(BREATH); }
    });
    a.block('cooldown', () => {
      const up = rotate(COOL_UPPER[family], n), low = rotate(COOL_LOWER, n);
      const list = [];
      for (let i = 0; list.length < shape.cool; i++) list.push(i % 2 ? low[(i - 1) / 2] : up[(i / 2) % up.length]);
      list.filter(id => hasEq(EX[id], owned)).forEach(id => a.timed(id));
    });
  });
  return { type: 'session', n, minutes: profile.minutes, skills, ...built };
}

// The baseline test: a few all-out sets that place you on the ladders.
export function buildBaseline(profile) {
  const owned = profile.eq;
  const built = assemble(a => {
    a.block('warmup', () => ['star-jumps', 'scap-pushup', 'scap-pullup', 'deep-squat-hold'].filter(id => hasEq(EX[id], owned)).forEach(id => a.timed(id, 30)));
    a.block('test', () => {
      const tests = [['pushup', 'pushups', 120], ['pullup', 'pullups', 120], ['dip', 'dips', 120], ['hs-wall', 'hs', 90], ['hl-tuck', 'lsit', 0]];
      for (const [ex, test, restAfter] of tests) {
        if (!hasEq(EX[ex], owned)) continue;
        a.set(ex, 1, 1, null, { max: 1, test });
        if (restAfter) a.rest(restAfter);
      }
    });
  });
  return { type: 'baseline', minutes: 10, skills: [], ...built };
}

// A stand-alone recovery routine (mobility, rolling, stretching).
export function buildRoutine(id, profile) {
  const r = ROUTINES.find(x => x.id === id);
  const built = assemble(a => a.block('routine', () => r.steps.filter(s => hasEq(EX[s[0]], profile.eq)).forEach(s => a.timed(s[0], s[1] - (EX[s[0]].side ? 10 : 0)))));
  return { type: 'routine', routine: id, minutes: r.minutes, skills: [], ...built };
}
