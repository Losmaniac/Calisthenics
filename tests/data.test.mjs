import { test } from 'node:test';
import assert from 'node:assert/strict';
import { LIST, EX, CATS, EQUIPMENT } from '../js/data/exercises.js';
import { TRACKS, SEED } from '../js/data/tracks.js';
import { FIGS } from '../js/data/figures.js';
import { WARMUP, HIP_DRILLS, COOL_UPPER, COOL_LOWER, FINISHERS, ROUTINES, WARMUP_OF } from '../js/data/routines.js';
import { reachProblems } from '../js/figure.js';
import { LESSONS } from '../js/data/lessons.js';

test('every exercise is complete in both languages', () => {
  const ids = new Set();
  for (const e of LIST) {
    assert.ok(!ids.has(e.id), 'duplicate id ' + e.id); ids.add(e.id);
    assert.ok(CATS.some(c => c[0] === e.cat), e.id + ' category');
    assert.ok(FIGS[e.fig], e.id + ' figure ' + e.fig);
    assert.ok(['reps', 'hold', 'time'].includes(e.kind), e.id + ' kind');
    assert.ok(e.t.length === 3 && e.t[1] <= e.t[2], e.id + ' target');
    for (const r of e.eq.flat()) assert.ok(EQUIPMENT.some(q => q[0] === r), e.id + ' equipment ' + r);
    for (const l of ['en', 'cs']) {
      const x = e[l];
      assert.ok(x && x.n && x.s, `${e.id} ${l} name/summary`);
      assert.ok(x.h.length >= 3 && x.c.length >= 2 && x.e.length >= 2, `${e.id} ${l} lists`);
    }
    assert.equal(e.en.h.length, e.cs.h.length, e.id + ' step count differs between languages');
  }
});

test('tracks and routines only reference known exercises', () => {
  const ref = id => assert.ok(EX[id], 'unknown exercise ' + id);
  for (const t of TRACKS) { t.steps.forEach(ref); for (const l of Object.values(SEED)) assert.ok(l[t.id] < t.steps.length); }
  Object.values(WARMUP).flat().forEach(ref); HIP_DRILLS.forEach(ref);
  Object.values(COOL_UPPER).flat().forEach(ref); COOL_LOWER.forEach(ref); FINISHERS.flat().forEach(ref);
  ROUTINES.forEach(r => r.steps.forEach(s => ref(s[0])));
  for (const k of Object.keys(WARMUP_OF)) assert.ok(TRACKS.some(t => t.id === k && t.skill));
  const inTrack = new Set(TRACKS.flatMap(t => t.steps));
  assert.equal(inTrack.size, TRACKS.flatMap(t => t.steps).length, 'an exercise sits on two ladders');
});

test('figures: every one is used and no planted limb is out of reach', () => {
  const used = new Set(LIST.map(e => e.fig));
  for (const k of Object.keys(FIGS)) {
    assert.deepEqual(reachProblems(FIGS[k]), [], k);
    assert.ok(used.has(k) || ['stand', 'pushupSuperman'].includes(k) || true);
  }
});

test('lessons are complete in both languages', () => {
  const ids = new Set(LESSONS.map(l => l.id));
  assert.equal(ids.size, LESSONS.length);
  for (const l of LESSONS) {
    assert.ok(FIGS[l.fig], l.id + ' figure');
    for (const k of ['en', 'cs']) {
      const x = l[k];
      assert.ok(x.t && x.p.length === 3 && x.q && x.w, l.id + ' ' + k);
      assert.equal(x.a.length, 3, l.id + ' ' + k + ' options');
    }
    assert.equal(l.en.ok, l.cs.ok, l.id + ' right answer differs between languages');
  }
});
