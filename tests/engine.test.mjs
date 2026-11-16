import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildSession, buildBaseline, buildRoutine, SHAPES, stepOf, exOf } from '../js/engine/plan.js';
import { evaluate, applyMove, records, seedLevels, freshTracks, totals } from '../js/engine/progress.js';
import { levelOf, xpAt, streak, sessionXp, weekKey, BADGES, derive, award } from '../js/engine/game.js';
import { TRACK, TRACKS, SEED } from '../js/data/tracks.js';
import { EX, hasEq } from '../js/data/exercises.js';

const jay = { minutes: 30, days: 3, focus: ['mu', 'hs', 'fl', 'planche'], eq: { bar: 1, dip: 1, pb: 1, roller: 1, band: 1, weight: 1, wall: 1, box: 1, towel: 1 } };
const lv = SEED.intermediate;

test('sessions land close to the chosen length and respect equipment', () => {
  for (const minutes of [20, 30, 45, 60]) for (let n = 0; n < 12; n++) {
    const s = buildSession({ ...jay, minutes }, lv, n);
    const min = s.secs / 60;
    assert.ok(Math.abs(min - minutes) <= minutes * 0.12, `${minutes} min session ${n} planned ${min.toFixed(1)}`);
    assert.deepEqual(s.blocks.map(b => b.type), ['warmup', 'skill', 'strength', 'finisher', 'cooldown']);
    for (const st of s.steps) if (st.ex) assert.ok(hasEq(EX[st.ex], jay.eq), st.ex);
    assert.equal(s.blocks.at(-1).to, s.steps.length);
  }
});

test('focus skills rotate and every ladder gets trained over a few sessions', () => {
  const skills = [], seen = new Set();
  for (let n = 0; n < 12; n++) { const s = buildSession(jay, lv, n); skills.push(s.skills[0]); s.steps.forEach(x => x.track && seen.add(x.track)); }
  assert.deepEqual(skills.slice(0, 4), ['mu', 'hs', 'fl', 'planche']);
  for (const t of ['pull', 'dip', 'push', 'hspu', 'legs', 'hams', 'core', 'line', 'dragon']) assert.ok(seen.has(t), t + ' never trained');
  const one = buildSession(jay, lv, 0);
  const tracks = one.steps.filter(x => x.track).map(x => x.track);
  assert.equal(new Set(tracks).size, 5, 'a 30-minute session trains one skill and four strength ladders');
});

test('bare-floor profile still gets a full session', () => {
  const s = buildSession({ ...jay, eq: {}, focus: ['mu'] }, SEED.beginner, 0);
  assert.ok(s.steps.filter(x => x.k === 'set').length >= 10);
  assert.ok(s.steps.every(x => !x.ex || EX[x.ex].eq.length === 0));
});

test('equipment gaps fall back to the nearest rung', () => {
  assert.equal(TRACK.push.steps[stepOf(TRACK.push, 3, {})], 'pushup-close');
  assert.equal(exOf('flag', {}, {}), null);
  assert.equal(exOf('pull', { pull: 3 }, { dip: 1 }), 'row');
});

const play = (s, f) => { s.log = s.steps.map(st => st.k === 'set' ? f(st) : st.k === 'rest' ? null : st.secs); return s; };

test('two clean sessions suggest a level-up, which only applies on confirm', () => {
  const tracks = freshTracks(lv);
  let moves = evaluate(play(buildSession(jay, lv, 1), st => st.hi), tracks, jay.eq);
  assert.equal(moves.length, 0);
  const again = buildSession(jay, lv, 1);
  moves = evaluate(play(again, st => st.hi), tracks, jay.eq);
  assert.ok(moves.length >= 4 && moves.every(m => m.dir === 1));
  const m = moves.find(x => x.track === 'pull');
  assert.equal(tracks.pull.level, 3);
  applyMove(tracks, m, false);
  assert.equal(tracks.pull.level, 3);
  applyMove(tracks, m, true);
  assert.equal(TRACK.pull.steps[tracks.pull.level], 'pullup-close');
  assert.equal(tracks.pull.ups, 1);
});

test('two struggling sessions suggest a step back; mixed results suggest nothing', () => {
  const tracks = freshTracks(lv);
  evaluate(play(buildSession(jay, lv, 1), st => st.lo - 1), tracks, jay.eq);
  const moves = evaluate(play(buildSession(jay, lv, 1), st => st.lo - 1), tracks, jay.eq);
  assert.ok(moves.some(m => m.track === 'pull' && m.dir === -1 && m.to === 2));
  const t2 = freshTracks(lv);
  evaluate(play(buildSession(jay, lv, 0), st => st.lo), t2, jay.eq);
  assert.equal(evaluate(play(buildSession(jay, lv, 0), st => st.lo), t2, jay.eq).length, 0);
});

test('records: first log is a start, a better set is a record', () => {
  const pr = {};
  assert.equal(records(play(buildSession(jay, lv, 0), st => st.lo), pr, 'd1').length, 0);
  const b = records(play(buildSession(jay, lv, 0), st => st.lo + 2), pr, 'd2');
  assert.ok(b.length >= 4 && b.every(x => x.v === x.was + 2));
});

test('baseline test seeds the ladders', () => {
  const b = buildBaseline(jay);
  assert.deepEqual(b.steps.filter(s => s.max).map(s => s.test), ['pushups', 'pullups', 'dips', 'hs', 'lsit']);
  const L = seedLevels('intermediate', { pushups: 32, pullups: 9, dips: 6, hs: 0, lsit: 12 });
  assert.equal(TRACK.push.steps[L.push], 'pushup-deep');
  assert.equal(TRACK.pull.steps[L.pull], 'pullup');
  assert.equal(TRACK.dip.steps[L.dip], 'dip');
  assert.equal(TRACK.hs.steps[L.hs], 'wall-walk');
  assert.equal(TRACK.lsit.steps[L.lsit], 'hl-angled');
  assert.equal(TRACK.fl.steps[L.fl], 'fl-tuck');
  assert.equal(seedLevels('beginner', { pullups: 0 }).pull, 0);
});

test('routines run without missing gear', () => {
  for (const id of ['mobility', 'roll', 'stretch']) assert.ok(buildRoutine(id, jay).steps.length >= 6);
  assert.equal(buildRoutine('roll', { ...jay, eq: {} }).steps.length, 0);
});

test('levels and xp', () => {
  assert.equal(levelOf(0).level, 1); assert.equal(levelOf(299).level, 1); assert.equal(levelOf(300).level, 2);
  assert.equal(levelOf(xpAt(10)).level, 10); assert.equal(levelOf(xpAt(10) - 1).level, 9);
  const s = play(buildSession(jay, lv, 0), st => st.hi); s.finished = true;
  const xp = sessionXp(s, 1);
  assert.ok(xp > 250 && xp < 400, 'a full session is worth about 300 xp, got ' + xp);
});

test('weekly streak counts complete weeks and tolerates the open one', () => {
  const day = (y, m, d) => new Date(y, m - 1, d, 18).toISOString();
  const mk = dates => dates.map(d => ({ date: d, counted: true }));
  const now = new Date(2026, 10, 18); // Wednesday 18 Nov 2026
  assert.equal(weekKey(now), '2026-11-16');
  const two = mk([day(2026, 11, 2), day(2026, 11, 4), day(2026, 11, 6), day(2026, 11, 9), day(2026, 11, 11), day(2026, 11, 13), day(2026, 11, 16)]);
  assert.equal(streak(two, 3, now), 2);
  assert.equal(streak([...two, ...mk([day(2026, 11, 17), day(2026, 11, 18)])], 3, now), 3);
  assert.equal(streak(mk([day(2026, 11, 2), day(2026, 11, 4), day(2026, 11, 6)]), 3, now), 0);
});

test('badges', () => {
  const state = { profile: jay, tracks: freshTracks(lv), sessions: [], body: [], lessons: {}, game: { xp: 0, badges: {} }, baseline: null };
  assert.equal(award(state, derive(state, 16), 'd').length, 1, 'the intermediate seed already holds the pull-up badge');
  const s = play(buildSession(jay, lv, 0), st => st.hi); s.counted = true; s.date = new Date().toISOString();
  state.sessions.push(s);
  assert.deepEqual(award(state, derive(state, 16), 'd').map(b => b.id), ['first']);
  assert.equal(award(state, derive(state, 16), 'd').length, 0);
  assert.equal(new Set(BADGES.map(b => b.id)).size, BADGES.length);
  assert.ok(totals(state.sessions).sets >= 15);
});
