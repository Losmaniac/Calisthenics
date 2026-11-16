// App state: one object, kept in localStorage, with dirty flags for cloud sync.
import { SEED } from './data/tracks.js';
import { freshTracks } from './engine/progress.js';

const KEY = 'chalk.v1';

export function defaults() {
  return {
    v: 1, u: 0, setup: false,
    profile: {
      name: 'Jay', lang: 'en', level: 'intermediate', days: 3, minutes: 30,
      weekdays: [1, 3, 5], time: '18:00',
      eq: { bar: true, dip: true, pb: true, roller: true, band: true, weight: true, wall: true, box: true, towel: true, pole: false },
      focus: ['mu', 'hs', 'fl', 'planche'],
      sound: true, loud: false, awake: true,
    },
    tracks: freshTracks(SEED.intermediate),
    sessions: [], body: [], lessons: {}, pr: {}, baseline: null,
    game: { xp: 0, badges: {}, best: 0 },
    active: null, summary: null,
    sync: { dirty: { main: false, sessions: {} }, pulled: 0, last: 0 },
  };
}

function merge(saved) {
  const d = defaults();
  if (!saved || typeof saved !== 'object') return d;
  return {
    ...d, ...saved,
    profile: { ...d.profile, ...saved.profile, eq: { ...d.profile.eq, ...saved.profile?.eq } },
    tracks: { ...d.tracks, ...saved.tracks },
    game: { ...d.game, ...saved.game },
    sync: { ...d.sync, ...saved.sync, dirty: { ...d.sync.dirty, ...saved.sync?.dirty } },
  };
}

function read() {
  try { return JSON.parse(localStorage.getItem(KEY)); } catch { return null; }
}

export const S = merge(read());

const subs = new Set();
export const subscribe = fn => subs.add(fn);
const notify = () => subs.forEach(f => f());

let timer;
export function flush() {
  clearTimeout(timer);
  try { localStorage.setItem(KEY, JSON.stringify(S)); } catch { /* storage full or blocked: keep running in memory */ }
}
export const persist = () => { clearTimeout(timer); timer = setTimeout(flush, 120); };

// Change the state. `local` changes (player position, sync bookkeeping) are not sent to the cloud.
export function commit(fn, { quiet = false, local = false } = {}) {
  fn?.(S);
  if (!local) { S.u = Date.now(); S.sync.dirty.main = true; }
  persist();
  if (!quiet) notify();
}
export const touchSession = s => { s.u = Date.now(); S.sync.dirty.sessions[s.id] = true; };

export function replaceAll(data) {
  for (const k of Object.keys(S)) delete S[k];
  Object.assign(S, merge(data));
  flush(); notify();
}
export function exportData() {
  const { active, summary, sync, ...rest } = S;
  return JSON.stringify({ app: 'chalk', exported: new Date().toISOString(), ...rest }, null, 1);
}

export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
export const levels = () => Object.fromEntries(Object.entries(S.tracks).map(([k, v]) => [k, v.level]));
export const liveSessions = () => S.sessions.filter(s => !s.deleted);
export const fullCount = () => S.sessions.filter(s => s.counted && !s.deleted).length;
