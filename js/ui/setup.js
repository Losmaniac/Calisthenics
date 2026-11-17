// Setup (settings, reminders, sync, backups) and the first-run welcome screen.
import { S, commit, flush, defaults, replaceAll, exportData, fullCount } from '../store.js';
import { acts, views, go, sheet, toast, rerender } from './nav.js';
import { t, tri, nm, dayNames, dateTime, lang } from '../i18n.js';
import { EQUIPMENT } from '../data/exercises.js';
import { TRACKS, SEED } from '../data/tracks.js';
import { freshTracks } from '../engine/progress.js';
import { config, account, parseConfig, setConfig, setClientId, signIn, signOut, syncNow, status, onStatus, googleStart } from '../sync.js';
import { esc, fig } from './common.js';
import { start } from './player.js';
import * as sound from '../sound.js';
import { VERSION } from '../version.js';

const chip = (on, act, arg, label, extra = '') => `<button class="chip${on ? ' on' : ''}" data-act="${act}" data-arg="${arg}" aria-pressed="${on}">${extra}${label}</button>`;

const langSection = () => `<div class="field"><span>${t('m.lang')}</span><div class="chips">
  ${chip(lang() === 'en', 'set-lang', 'en', 'English')}${chip(lang() === 'cs', 'set-lang', 'cs', 'Čeština')}</div></div>`;

const levelSection = () => `<div class="field"><span>${t('m.level')}</span><div class="chips">${['beginner', 'intermediate', 'advanced']
  .map(l => chip(S.profile.level === l, 'set-level', l, t('lvl.' + l))).join('')}</div></div>`;

const trainingSection = () => `<div class="field"><span>${t('m.days')}</span><div class="chips">${[2, 3, 4, 5, 6]
    .map(n => chip(S.profile.days === n, 'set-days', n, String(n))).join('')}</div></div>
  <div class="field"><span>${t('m.minutes')}</span><div class="chips">${[20, 30, 45, 60]
    .map(n => chip(S.profile.minutes === n, 'set-min', n, t('r.minutes', n))).join('')}</div></div>`;

const focusSection = () => `<h2 class="sec">${t('m.focus')}</h2><p class="muted small">${t('m.focusD')}</p><div class="chips">${TRACKS.filter(tr => tr.skill).map(tr => {
  const k = S.profile.focus.indexOf(tr.id);
  return chip(k >= 0, 'set-focus', tr.id, esc(nm(tr)), k >= 0 ? `<span class="ord">${k + 1}</span>` : '');
}).join('')}</div>`;

const eqSection = () => `<h2 class="sec">${t('m.eq')}</h2><p class="muted small">${t('m.eqD')}</p><div class="chips">${EQUIPMENT
  .map(e => chip(!!S.profile.eq[e[0]], 'set-eq', e[0], tri(e))).join('')}</div>`;

function remindSection() {
  const names = dayNames();
  return `<h2 class="sec">${t('m.remind')}</h2><p class="muted small">${t('m.remindD')}</p>
    <div class="chips">${[1, 2, 3, 4, 5, 6, 0].map(d => chip(S.profile.weekdays.includes(d), 'set-wd', d, names[d])).join('')}</div>
    <label class="field"><span>${t('m.time')}</span><input type="time" value="${esc(S.profile.time)}" data-on="set-time"></label>
    <button class="btn block" data-act="ics"${S.profile.weekdays.length ? '' : ' disabled'}>${t('m.cal')}</button>`;
}

const toggle = (name, label, note = '') => `<label class="tg"><span>${label}${note ? `<small>${note}</small>` : ''}</span>
  <input type="checkbox" name="${name}" data-on="set-flag"${S.profile[name] ? ' checked' : ''}></label>`;

function syncLine() {
  if (status.busy) return t('m.syncing');
  if (status.error) return status.error === 'NETWORK' ? t('m.errNet') : t('m.errSync', status.error);
  return t('m.synced', S.sync.last ? dateTime(S.sync.last) : t('m.never'));
}
onStatus(() => { const el = document.getElementById('sync-status'); if (el) el.textContent = syncLine(); });

function syncSection() {
  const who = account();
  let body;
  if (!config()) {
    body = `<p class="muted small">${t('m.cfgD')}</p>
      <label class="field"><span>${t('m.cfg')}</span><textarea id="cfg" spellcheck="false" autocapitalize="off" placeholder="apiKey: &quot;…&quot;, projectId: &quot;…&quot;"></textarea></label>
      <button class="btn block" data-act="cfg-save">${t('m.connect')}</button>`;
  } else if (!who) {
    const g = config().clientId
      ? `<button class="btn primary big block" data-act="google">${t('m.google')}</button><p class="muted small" style="margin-top:14px">${t('m.orEmail')}</p>`
      : `<label class="field"><span>${t('m.client')}</span><input type="text" id="cid" autocapitalize="off" spellcheck="false" placeholder="…apps.googleusercontent.com"></label>
        <button class="btn block" data-act="cid-save">${t('m.connect')}</button><p class="muted small" style="margin-top:14px">${t('m.orEmail')}</p>`;
    body = `${g}<label class="field"><span>${t('m.email')}</span><input type="email" id="em" autocomplete="username" inputmode="email" autocapitalize="off"></label>
      <label class="field"><span>${t('m.password')}</span><input type="password" id="pw" autocomplete="current-password"></label>
      <div class="btns two"><button class="btn" data-act="auth" data-arg="up">${t('m.signUp')}</button><button class="btn primary" data-act="auth" data-arg="in">${t('m.signIn')}</button></div>
`;
  } else {
    body = `<p>${t('m.signedIn', esc(who))}</p><p class="status" id="sync-status">${syncLine()}</p>
      <div class="btns two"><button class="btn" data-act="sign-out">${t('m.signOut')}</button><button class="btn primary" data-act="sync-now">${t('m.syncNow')}</button></div>`;
  }
  return `<h2 class="sec">${t('m.sync')}</h2>${body}`;
}

views.me = {
  tab: 'me',
  render() {
    return `<h1 class="title">${t('tab.me')}</h1>
      ${langSection()}
      <h2 class="sec">${t('m.training')}</h2>${trainingSection()}
      ${focusSection()}${eqSection()}${remindSection()}
      <h2 class="sec">${t('m.sounds')}</h2>
      <div class="list">${toggle('sound', t('m.sound'))}${toggle('loud', t('m.loud'), t('m.loudD'))}${toggle('awake', t('m.awake'))}</div>
      ${syncSection()}
      <h2 class="sec">${t('m.data')}</h2>
      ${config() ? '' : `<p class="muted small">${t('m.syncOff')}</p>`}
      <div class="btns">
        <button class="btn block" data-act="export">${t('m.export')}</button>
        <label class="btn block file-btn">${t('m.import')}<input type="file" accept="application/json,.json" data-on="import"></label>
        <button class="btn block" data-act="retest">${S.baseline ? t('m.retest') : t('m.test')}</button>
        <button class="btn warn block" data-act="reset">${t('m.reset')}</button>
      </div>
      <p class="muted small" style="margin-top:24px">${t('m.about', VERSION)}</p>`;
  },
};

views.welcome = {
  render() {
    return `<div class="welcome">
      ${fig('muscleup', { live: true, cls: 'welcome-fig' })}
      <h1 class="wordmark">Chalk</h1>
      <p class="lead">${t('o.tag')}</p>
      <h2 class="sec">${t('o.setup')}</h2>
      <p class="muted">${t('o.check')}</p>
      ${langSection()}${levelSection()}${trainingSection()}${focusSection()}${eqSection()}
      <h2 class="sec">${t('today.baseline.t')}</h2>
      <p>${t('o.testD')}</p>
      <div class="btns"><button class="btn primary big block" data-act="welcome-test">${t('o.test')}</button>
        <button class="btn block" data-act="welcome-go">${t('o.skip')}</button></div>
    </div>`;
  },
};

// ---------- settings actions
const setP = fn => commit(s => fn(s.profile));
acts['set-lang'] = l => setP(p => { p.lang = l; });
acts['set-level'] = l => commit(s => {
  s.profile.level = l;
  if (!s.baseline && !fullCount()) s.tracks = freshTracks(SEED[l]);
});
acts['set-days'] = n => setP(p => { p.days = Number(n); });
acts['set-min'] = n => setP(p => { p.minutes = Number(n); });
acts['set-focus'] = id => setP(p => {
  const k = p.focus.indexOf(id);
  if (k < 0) p.focus.push(id);
  else if (p.focus.length > 1) p.focus.splice(k, 1);
});
acts['set-eq'] = k => setP(p => { p.eq[k] = !p.eq[k]; });
acts['set-wd'] = d => setP(p => {
  d = Number(d);
  p.weekdays = p.weekdays.includes(d) ? p.weekdays.filter(x => x !== d) : [...p.weekdays, d];
});
acts['set-time'] = v => { if (v) commit(s => { s.profile.time = v; }, { quiet: true }); };
acts['set-flag'] = (v, el) => {
  commit(s => { s.profile[el.name] = el.checked; }, { quiet: true });
  if (el.name === 'loud' || el.name === 'sound') sound.unlock();
};

acts['welcome-test'] = () => { commit(s => { s.setup = true; }, { quiet: true }); start('baseline'); };
acts['welcome-go'] = () => { commit(s => { s.setup = true; }, { quiet: true }); go('today', null, { replace: true }); };

// ---------- calendar reminder (.ics with a weekly repeat)
function ics() {
  const p = S.profile, BY = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
  const [hh, mm] = p.time.split(':').map(Number);
  const d = new Date(); d.setHours(hh, mm, 0, 0);
  for (let k = 0; k < 8 && (!p.weekdays.includes(d.getDay()) || d < new Date()); k++) d.setDate(d.getDate() + 1);
  const pad = n => String(n).padStart(2, '0');
  const local = x => `${x.getFullYear()}${pad(x.getMonth() + 1)}${pad(x.getDate())}T${pad(x.getHours())}${pad(x.getMinutes())}00`;
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '');
  const days = [1, 2, 3, 4, 5, 6, 0].filter(x => p.weekdays.includes(x)).map(x => BY[x]).join(',');
  return ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Chalk//Training//EN', 'CALSCALE:GREGORIAN', 'BEGIN:VEVENT',
    `UID:chalk-${Date.now()}@chalk`, `DTSTAMP:${stamp}`, `DTSTART:${local(d)}`, `DURATION:PT${p.minutes}M`,
    `RRULE:FREQ=WEEKLY;BYDAY=${days}`, `SUMMARY:${t('m.calTitle')}`, `URL:${location.href.split('#')[0]}`,
    'BEGIN:VALARM', 'ACTION:DISPLAY', `DESCRIPTION:${t('m.calTitle')}`, 'TRIGGER:-PT15M', 'END:VALARM',
    'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
}

async function download(name, text, type, share = false) {
  const file = new File([text], name, { type });
  if (share && navigator.canShare?.({ files: [file] })) {
    try { await navigator.share({ files: [file] }); return; } catch (e) { if (e.name === 'AbortError') return; }
  }
  const url = URL.createObjectURL(file);
  const a = Object.assign(document.createElement('a'), { href: url, download: name });
  document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}
acts.ics = () => download('chalk-training.ics', ics(), 'text/calendar;charset=utf-8');
acts.export = () => download(`chalk-backup-${new Date().toISOString().slice(0, 10)}.json`, exportData(), 'application/json', true);

let incoming = null;
acts.import = (v, el) => {
  const f = el.files?.[0];
  el.value = '';
  if (!f) return;
  f.text().then(txt => {
    let data = null;
    try { data = JSON.parse(txt); } catch { /* not JSON */ }
    if (!data || data.app !== 'chalk' || !data.profile || !data.tracks) { toast(t('m.importBad')); return; }
    incoming = data;
    sheet(`<h3>${t('m.importQ')}</h3><div class="btns"><button class="btn warn block" data-act="import-yes">${t('m.replace')}</button>
      <button class="btn block" data-act="sheet-close">${t('cancel')}</button></div>`);
  });
};
acts['import-yes'] = () => {
  sheet('');
  const { app, exported, ...rest } = incoming;
  replaceAll({ ...rest, setup: true, u: Date.now() });
  S.sync.dirty.main = true;
  for (const s of S.sessions) S.sync.dirty.sessions[s.id] = true;
  flush();
  toast(t('m.imported'));
  go('today', null, { replace: true });
};

acts.retest = () => acts.start('baseline');
acts.reset = () => sheet(`<h3>${t('m.resetQ')}</h3><div class="btns"><button class="btn warn block" data-act="reset-yes">${t('m.resetYes')}</button>
  <button class="btn block" data-act="sheet-close">${t('cancel')}</button></div>`);
acts['reset-yes'] = () => { sheet(''); signOut(); replaceAll(defaults()); go('welcome', null, { replace: true }); };

// ---------- sync actions
acts['cfg-save'] = () => {
  const cfg = parseConfig(document.getElementById('cfg')?.value ?? '');
  if (!cfg) { toast(t('m.cfgBad')); return; }
  setConfig(cfg); rerender();
};
acts['cfg-forget'] = () => { setConfig(null); rerender(); };
acts['cid-save'] = () => { if (setClientId(document.getElementById('cid')?.value ?? '')) rerender(); else toast(t('m.clientBad')); };
acts.google = () => googleStart();
acts['sign-out'] = () => { signOut(); rerender(); };
acts['sync-now'] = () => syncNow().then(ok => toast(ok ? t('m.syncOk') : syncLine()));
acts.auth = async mode => {
  const em = document.getElementById('em')?.value.trim(), pw = document.getElementById('pw')?.value;
  if (!em || !pw) return;
  document.querySelectorAll('[data-act="auth"]').forEach(b => { b.disabled = true; });
  const err = await signIn(em, pw, mode === 'up');
  if (err) {
    toast(err === 'NETWORK' ? t('m.errNet') : err === 'EMAIL_EXISTS' ? t('m.errUsed') : err === 'WEAK_PASSWORD' ? t('m.errWeak')
      : err === 'OPERATION_NOT_ALLOWED' ? t('m.errOp') : t('m.errAuth'));
  }
  rerender();
};
