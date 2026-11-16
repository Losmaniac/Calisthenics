// Turns logged sessions into level-up suggestions, personal records and totals.
import { EX, hasEq } from '../data/exercises.js';
import { TRACK, TRACKS, SEED } from '../data/tracks.js';

const NEED = 2; // sessions in a row before the app suggests a move

// The logged values of every exercise in a session: { exId: { track, lo, hi, vals: [] } }
export function results(session) {
  const out = {};
  session.steps.forEach((s, i) => {
    const v = session.log?.[i];
    if (s.k !== 'set' || v == null) return;
    (out[s.ex] ??= { track: s.track, lo: s.lo, hi: s.hi, kind: s.kind, vals: [] }).vals.push(v);
  });
  return out;
}

// Updates the hit/miss counters of each trained ladder and returns the moves worth suggesting.
export function evaluate(session, tracks, owned) {
  const moves = [];
  for (const [ex, r] of Object.entries(results(session))) {
    if (!r.track || r.vals.length < 2) continue;
    const st = tracks[r.track], track = TRACK[r.track];
    const at = track.steps.indexOf(ex);
    const hit = r.vals.every(v => v >= r.hi), miss = r.vals.some(v => v < r.lo);
    st.hits = hit ? (st.hits ?? 0) + 1 : 0;
    st.misses = miss ? (st.misses ?? 0) + 1 : 0;
    if (st.hits >= NEED) {
      const to = track.steps.findIndex((id, i) => i > at && hasEq(EX[id], owned));
      if (to > 0) moves.push({ track: r.track, dir: 1, from: at, to });
    } else if (st.misses >= NEED && at > 0) {
      let to = at - 1;
      while (to > 0 && !hasEq(EX[track.steps[to]], owned)) to--;
      moves.push({ track: r.track, dir: -1, from: at, to });
    }
  }
  return moves;
}

export function applyMove(tracks, move, accept) {
  const st = tracks[move.track];
  if (accept) { st.level = move.to; st.hits = 0; st.misses = 0; if (move.dir > 0) st.ups = (st.ups ?? 0) + 1; }
  else if (move.dir > 0) st.hits = NEED - 1; // ask again after the next clean session
  else st.misses = 0;
}

// Best single set per exercise. Returns the records broken in this session.
export function records(session, pr, date) {
  const broken = [];
  for (const [ex, r] of Object.entries(results(session))) {
    const best = Math.max(...r.vals);
    if (best <= 0) continue;
    const old = pr[ex];
    if (!old) pr[ex] = { v: best, d: date };
    else if (best > old.v) { broken.push({ ex, v: best, was: old.v, kind: r.kind }); pr[ex] = { v: best, d: date }; }
  }
  return broken;
}

// Where the baseline test puts you on each ladder.
export function seedLevels(level, res = {}) {
  const L = { ...SEED[level] ?? SEED.intermediate };
  const band = (v, cuts) => cuts.filter(c => v >= c).length;
  if (res.pullups != null) { L.pull = [0, 1, 2, 3, 5, 6][band(res.pullups, [1, 3, 5, 12, 15])]; L.fl = res.pullups >= 8 ? 1 : 0; }
  if (res.pushups != null) L.push = [0, 2, 3, 4][band(res.pushups, [20, 30, 40])];
  if (res.dips != null) L.dip = [0, 1, 2][band(res.dips, [1, 12])];
  if (res.hs != null) { L.hs = [0, 1, 2][band(res.hs, [1, 20])]; L.hspu = res.hs >= 30 && (res.pushups ?? 0) >= 30 ? 1 : 0; }
  if (res.lsit != null) L.lsit = [0, 1, 2][band(res.lsit, [10, 25])];
  return L;
}
export const freshTracks = levels => Object.fromEntries(TRACKS.map(t => [t.id, { level: levels[t.id] ?? 0, hits: 0, misses: 0, ups: 0 }]));

// Lifetime totals, derived from the session history.
export function totals(sessions) {
  const t = { sessions: 0, sets: 0, hold: 0, secs: 0, reps: {} };
  for (const s of sessions) {
    if (s.deleted) continue;
    if (s.counted) t.sessions++;
    t.secs += s.dur ?? 0;
    s.steps.forEach((st, i) => {
      const v = s.log?.[i];
      if (st.k !== 'set' || v == null) return;
      t.sets++;
      const mult = st.side ? 2 : 1;
      if (st.kind === 'hold') t.hold += v * mult;
      else { const cat = EX[st.ex]?.cat ?? 'x'; t.reps[cat] = (t.reps[cat] ?? 0) + v * mult; }
    });
  }
  return t;
}
