// Cloud sync with Firebase (e-mail sign-in + Firestore), using their REST APIs directly.
// Data: users/{uid} holds settings and progress; users/{uid}/sessions/{id} holds one session each.
// Each document carries `u`, the time of its last change; the newer copy wins.
import { S, commit } from './store.js';

const KEY = 'chalk.auth';
let A = (() => { try { return JSON.parse(localStorage.getItem(KEY)) ?? {}; } catch { return {}; } })();
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(A)); } catch { /* ignore */ } };

export const status = { busy: false, error: null };
const subs = new Set();
export const onStatus = fn => subs.add(fn);
const emit = () => subs.forEach(f => f());

export const config = () => A.cfg ?? null;
export const account = () => (A.uid ? A.email : null);

// Accepts the snippet Firebase shows for a web app (or plain JSON) and keeps apiKey and projectId.
export function parseConfig(text) {
  const grab = k => (String(text).match(new RegExp(`["']?${k}["']?\\s*:\\s*["']([^"']+)["']`)) ?? [])[1];
  const apiKey = grab('apiKey'), projectId = grab('projectId');
  return apiKey && projectId ? { apiKey, projectId } : null;
}
export function setConfig(cfg) { A = cfg ? { cfg } : {}; save(); emit(); }

class SyncError extends Error { constructor(msg, code) { super(msg); this.code = code; } }

async function post(url, body, form) {
  let res;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': form ? 'application/x-www-form-urlencoded' : 'application/json' },
      body: form ? new URLSearchParams(body) : JSON.stringify(body),
    });
  } catch { throw new SyncError('NETWORK', 0); }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new SyncError(data.error?.message ?? String(res.status), res.status);
  return data;
}

// Returns null when it worked, otherwise an error code: NETWORK, EMAIL_EXISTS, WEAK_PASSWORD, or a sign-in failure.
export async function signIn(email, password, create) {
  const ep = create ? 'signUp' : 'signInWithPassword';
  try {
    const d = await post(`https://identitytoolkit.googleapis.com/v1/accounts:${ep}?key=${A.cfg.apiKey}`, { email, password, returnSecureToken: true });
    A = { cfg: A.cfg, email: d.email, uid: d.localId, id: d.idToken, refresh: d.refreshToken, exp: Date.now() + Number(d.expiresIn) * 1000 };
    save();
    // A first sync for this account sends everything on this device.
    S.sync.pulled = 0;
    S.sync.first = true; // the account's copy wins over this device's settings on the first sync
    for (const s of S.sessions) S.sync.dirty.sessions[s.id] = true;
    emit();
    await syncNow();
    return null;
  } catch (e) {
    return String(e.message).split(' ')[0];
  }
}
export function signOut() { A = { cfg: A.cfg }; save(); emit(); }

async function token() {
  if (Date.now() < A.exp - 60000) return A.id;
  const d = await post(`https://securetoken.googleapis.com/v1/token?key=${A.cfg.apiKey}`, { grant_type: 'refresh_token', refresh_token: A.refresh }, true);
  Object.assign(A, { id: d.id_token, refresh: d.refresh_token, exp: Date.now() + Number(d.expires_in) * 1000 });
  save();
  return A.id;
}

async function fs(path, opts = {}) {
  const url = `https://firestore.googleapis.com/v1/projects/${A.cfg.projectId}/databases/(default)/documents/users/${A.uid}${path}`;
  let res;
  try {
    res = await fetch(url, { ...opts, headers: { Authorization: 'Bearer ' + (await token()), 'Content-Type': 'application/json' } });
  } catch (e) { throw e instanceof SyncError ? e : new SyncError('NETWORK', 0); }
  if (res.status === 404 && !opts.method) return null;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new SyncError(data.error?.message ?? String(res.status), res.status);
  return data;
}
const enc = (data, u) => JSON.stringify({ fields: { json: { stringValue: JSON.stringify(data) }, u: { integerValue: String(u) } } });
const dec = doc => ({ data: JSON.parse(doc.fields.json.stringValue), u: Number(doc.fields.u.integerValue) });

const MAIN = ['setup', 'profile', 'tracks', 'body', 'lessons', 'pr', 'baseline', 'game'];
const DAY = 86400000;

let running = null;
export function syncNow() {
  if (!A.uid || !navigator.onLine) return Promise.resolve(false);
  return (running ??= run().finally(() => { running = null; }));
}

async function run() {
  status.busy = true; status.error = null; emit();
  let changed = false;
  try {
    // 1. settings and progress
    const doc = await fs('');
    const fresh = S.sync.first || (!S.sessions.length && !S.baseline);
    if (doc) {
      const r = dec(doc);
      if (r.u > S.u || fresh) {
        for (const k of MAIN) if (k in r.data) S[k] = r.data[k];
        S.u = r.u; S.sync.dirty.main = false; changed = true;
      }
    } else S.sync.dirty.main = true;
    // 2. sessions changed since the last pull (with a day of overlap against clock differences)
    const since = Math.max(0, (S.sync.pulled || 0) - DAY);
    const rows = await fs(':runQuery', {
      method: 'POST',
      body: JSON.stringify({ structuredQuery: { from: [{ collectionId: 'sessions' }], where: { fieldFilter: { field: { fieldPath: 'u' }, op: 'GREATER_THAN', value: { integerValue: String(since) } } } } }),
    });
    let top = S.sync.pulled || 0;
    for (const row of rows ?? []) {
      if (!row.document) continue;
      const r = dec(row.document);
      top = Math.max(top, r.u);
      const k = S.sessions.findIndex(s => s.id === r.data.id);
      if (k < 0) { S.sessions.push(r.data); changed = true; }
      else if (r.u > (S.sessions[k].u ?? 0)) { S.sessions[k] = r.data; delete S.sync.dirty.sessions[r.data.id]; changed = true; }
    }
    S.sync.pulled = top;
    if (changed) S.sessions.sort((a, b) => a.date.localeCompare(b.date));
    // 3. local changes
    const D = S.sync.dirty;
    if (D.main) {
      const u = S.u;
      await fs('', { method: 'PATCH', body: enc(Object.fromEntries(MAIN.map(k => [k, S[k]])), u) });
      if (S.u === u) D.main = false;
    }
    for (const id of Object.keys(D.sessions)) {
      const s = S.sessions.find(x => x.id === id);
      if (!s) { delete D.sessions[id]; continue; }
      const u = s.u ?? Date.now();
      await fs('/sessions/' + id, { method: 'PATCH', body: enc(s, u) });
      if (s.u === u) delete D.sessions[id];
    }
    S.sync.last = Date.now();
    S.sync.first = false;
    return true;
  } catch (e) {
    status.error = e.code === 0 ? 'NETWORK' : e.message;
    return false;
  } finally {
    status.busy = false;
    commit(null, { local: true, quiet: !changed });
    emit();
  }
}

// Sync shortly after local changes, when the connection returns and when the app comes back.
let timer = 0;
export function scheduleSync(delay = 4000) {
  const D = S.sync.dirty;
  if (!A.uid || (!D.main && !Object.keys(D.sessions).length)) return;
  clearTimeout(timer);
  timer = setTimeout(syncNow, delay);
}
addEventListener('online', () => syncNow());
document.addEventListener('visibilitychange', () => { if (!document.hidden) syncNow(); });
