// Progress: level and XP, weekly streak, totals, records, body measurements, badges and history.
import { S, commit, uid, liveSessions, touchSession } from '../store.js';
import { acts, views, sheet, toast, back } from './nav.js';
import { t, tp, num, nm, dateShort, dateLong, dateTime, lang } from '../i18n.js';
import { EX } from '../data/exercises.js';
import { ROUTINES } from '../data/routines.js';
import { totals } from '../engine/progress.js';
import { BADGES, perWeek, streak, weekStart, dayKey, XP } from '../engine/game.js';
import { esc, fig, exName, val, levelInfo, backBtn } from './common.js';

const BODY = ['weight', 'waist', 'chest', 'arm', 'thigh'];

function weekChart(sessions, goal) {
  const m = perWeek(sessions), weeks = [];
  const w = weekStart(new Date());
  for (let k = 11; k >= 0; k--) { const d = new Date(w); d.setDate(d.getDate() - 7 * k); weeks.push([d, m[dayKey(d)] ?? 0]); }
  const max = Math.max(goal + 1, ...weeks.map(x => x[1])), W = 340, H = 120, bw = W / 12;
  const y = v => H - (v / max) * H;
  const bars = weeks.map(([d, n], i) => `<rect class="bar${n >= goal ? ' hit' : ''}" x="${i * bw + 4}" y="${y(n)}" width="${bw - 8}" height="${H - y(n)}" rx="3"/>`).join('');
  const labels = [weeks[0], weeks[6], weeks[11]].map(([d], i) => `<text x="${[0, 6, 11][i] * bw + bw / 2}" y="${H + 16}" text-anchor="middle">${dateShort(d)}</text>`).join('');
  return `<svg class="chart" viewBox="0 -4 ${W} ${H + 22}" role="img" aria-label="${t('g.perWeek')}">${bars}
    <line class="goal" x1="0" x2="${W}" y1="${y(goal)}" y2="${y(goal)}"/>${labels}</svg>`;
}

function bodyChart(entries) {
  const pts = entries.filter(b => b.weight).map(b => [new Date(b.d).getTime(), b.weight]);
  if (pts.length < 2) return '';
  const W = 340, H = 110, x0 = pts[0][0], x1 = pts.at(-1)[0];
  const lo = Math.min(...pts.map(p => p[1])) - 0.5, hi = Math.max(...pts.map(p => p[1])) + 0.5;
  const X = x => ((x - x0) / Math.max(1, x1 - x0)) * W, Y = v => H - ((v - lo) / (hi - lo)) * H;
  const line = pts.map(p => `${X(p[0]).toFixed(1)},${Y(p[1]).toFixed(1)}`).join(' ');
  return `<svg class="chart" viewBox="-6 -10 ${W + 12} ${H + 30}" role="img" aria-label="${t('b.weight')}">
    <polyline class="ln" points="${line}"/>${pts.map(p => `<circle class="pt" cx="${X(p[0]).toFixed(1)}" cy="${Y(p[1]).toFixed(1)}" r="3.5"/>`).join('')}
    <text x="0" y="${H + 18}">${dateShort(x0)}</text><text x="${W}" y="${H + 18}" text-anchor="end">${dateShort(x1)}</text>
    <text x="${W}" y="${Y(pts.at(-1)[1]) - 10}" text-anchor="end">${num(pts.at(-1)[1], 1)} kg</text></svg>`;
}

const sessionTitle = s => s.type === 'baseline' ? t('h.baseline') : s.type === 'routine' ? nm(ROUTINES.find(r => r.id === s.routine) ?? { en: '', cs: '' }) : t('h.session', num((s.n ?? 0) + 1));
const historyRow = s => `<a class="row" href="#session/${s.id}"><div class="main"><b>${esc(sessionTitle(s))}</b>
  <span>${dateTime(s.date)}, ${num(Math.max(1, Math.round((s.dur ?? 0) / 60)))} min${s.finished ? '' : ', ' + t('g.early')}</span></div>
  <span class="side">+${num(s.xp ?? 0)} XP</span></a>`;

views.progress = {
  tab: 'progress',
  render() {
    const live = liveSessions(), li = levelInfo(S.game.xp), goal = S.profile.days;
    const run = streak(live, goal), tot = totals(live);
    const title = lang() === 'cs' ? li.title[2] : li.title[1];
    const body = S.body.filter(b => !b.deleted).sort((a, b) => a.d.localeCompare(b.d));
    const latest = {};
    for (const b of body) for (const k of BODY) if (b[k]) latest[k] = b[k];
    const prs = Object.entries(S.pr).filter(([id]) => EX[id]).sort((a, b) => b[1].d.localeCompare(a[1].d));
    const earned = BADGES.filter(b => S.game.badges[b.id]).length;

    return `<h1 class="title">${t('tab.progress')}</h1>
      <div class="lvl-big"><span class="disc">${li.level}</span><div style="flex:1"><b>${esc(title)}</b>
        <div class="xpbar"><i style="width:${li.pct}%"></i></div><span class="muted small">${t('g.xpTo', num(li.left), li.level + 1)}</span></div></div>

      <h2 class="sec">${run ? tp('weeks', run) : t('g.perWeek')}</h2>
      ${weekChart(live, goal)}
      <p class="muted small">${t('g.goal', goal)}${S.game.best ? ', ' + t('g.best', tp('wk', S.game.best)) : ''}</p>

      <h2 class="sec">${t('g.totals')}</h2>
      <div class="stats">
        <div><b>${num(tot.sessions)}</b><span>${t('g.sessions')}</span></div>
        <div><b>${num(tot.secs / 3600, tot.secs < 36000 ? 1 : 0)}</b><span>${t('g.hours')}</span></div>
        <div><b>${num((tot.reps.pull ?? 0) + (tot.reps.mu ?? 0))}</b><span>${t('g.pull')}</span></div>
        <div><b>${num((tot.reps.push ?? 0) + (tot.reps.dip ?? 0))}</b><span>${t('g.push')}</span></div>
        <div><b>${num(tot.hold / 60)}</b><span>${t('g.hold')}</span></div>
      </div>

      <h2 class="sec">${t('g.records')}</h2>
      ${prs.length ? `<div class="list">${prs.slice(0, 12).map(([id, r]) => `<a class="row" href="#ex/${id}"><div class="main"><b>${esc(exName(id))}</b><span>${dateShort(r.d)}</span></div>
        <span class="tag gold">${val(r.v, EX[id].kind)}</span></a>`).join('')}</div>` : `<p class="muted">${t('g.noRecords')}</p>`}

      <h2 class="sec">${t('g.body')}</h2>
      ${body.length ? `<div class="kv">${BODY.filter(k => latest[k]).map(k => `<div><b>${num(latest[k], latest[k] % 1 ? 1 : 0)}</b><span>${t('b.' + k)}</span></div>`).join('')}</div>${bodyChart(body)}` : `<p class="muted">${t('g.noBody')}</p>`}
      <div class="btns"><button class="btn block" data-act="body-add">${t('g.addBody')}</button></div>
      ${body.length ? `<div class="list" style="margin-top:14px">${body.slice(-5).reverse().map(b => `<div class="row"><div class="main"><b>${dateShort(b.d)}</b>
        <span>${BODY.filter(k => b[k]).map(k => `${t('b.' + k).replace(/ \(.*\)/, '')} ${num(b[k], b[k] % 1 ? 1 : 0)}`).join(', ')}</span></div>
        <button class="btn quiet small" data-act="body-del" data-arg="${b.id}">${t('g.deleteBody')}</button></div>`).join('')}</div>` : ''}

      <h2 class="sec">${t('g.badges')} <span class="muted" style="font-size:20px">${t('g.badgeCount', earned, BADGES.length)}</span></h2>
      <div class="badges">${BADGES.map(b => {
        const on = !!S.game.badges[b.id], txt = lang() === 'cs' ? b.cs : b.en;
        return `<button class="badge${on ? ' on' : ''}" data-act="badge" data-arg="${b.id}"><span class="bd">${b.fig ? fig(b.fig, { ghost: false, fit: -90 }) : esc(b.num)}</span><span>${esc(txt[0])}</span></button>`;
      }).join('')}</div>

      <h2 class="sec">${t('g.history')}</h2>
      ${live.length ? `<div class="list">${live.slice(-5).reverse().map(historyRow).join('')}</div>
        ${live.length > 5 ? `<div class="btns"><a class="btn block" href="#history">${t('g.allSessions')}</a></div>` : ''}` : `<p class="muted">${t('g.noHistory')}</p>`}`;
  },
};

views.history = {
  tab: 'progress',
  render() {
    const live = liveSessions();
    return `${backBtn('progress')}<h1 class="title">${t('g.history')}</h1><div class="list">${live.slice().reverse().map(historyRow).join('')}</div>`;
  },
};

views.session = {
  tab: 'progress',
  render(id) {
    const s = S.sessions.find(x => x.id === id && !x.deleted);
    if (!s) return backBtn('progress');
    const blocks = s.blocks.map(b => {
      const groups = new Map();
      for (let i = b.from; i < b.to; i++) {
        const st = s.steps[i];
        if (st.k === 'rest') continue;
        if (!groups.has(st.ex)) groups.set(st.ex, []);
        groups.get(st.ex).push(i);
      }
      const rows = [...groups].map(([ex, idx]) => {
        const st = s.steps[idx[0]];
        const vals = idx.map(i => s.log[i] == null ? '–' : st.k === 'set' ? val(s.log[i], st.kind) : '✓').join('  ');
        return `<a class="exline" href="#ex/${ex}"><span>${esc(exName(ex))}</span><span>${vals}</span></a>`;
      }).join('');
      return `<div class="blk"><div class="blk-h"><i class="sw b-${b.type}"></i><b>${t('block.' + b.type)}</b></div>${rows}</div>`;
    }).join('');
    return `${backBtn('progress')}<p class="date">${dateLong(s.date)}</p><h1 class="title">${esc(sessionTitle(s))}</h1>
      <p class="sub">${t('s.time', num(Math.max(1, Math.round((s.dur ?? 0) / 60))))}, +${num(s.xp ?? 0)} XP${s.finished ? '' : ', ' + t('g.early')}</p>
      <div style="margin-top:18px">${blocks}</div>
      <div class="btns"><button class="btn warn block" data-act="session-del" data-arg="${s.id}">${t('g.delete')}</button></div>`;
  },
};

// ---------- actions
acts.badge = id => {
  const b = BADGES.find(x => x.id === id), txt = lang() === 'cs' ? b.cs : b.en, when = S.game.badges[id];
  sheet(`<div class="badges" style="grid-template-columns:1fr"><div class="badge${when ? ' on' : ''}"><span class="bd">${b.fig ? fig(b.fig, { ghost: false, fit: -90 }) : esc(b.num)}</span></div></div>
    <h3 style="text-align:center">${esc(txt[0])}</h3><p style="text-align:center;margin:0 auto 6px">${esc(txt[1])}</p>
    ${when ? `<p class="muted" style="text-align:center;margin:0 auto">${t('g.earned', dateShort(when))}</p>` : ''}
    <div class="btns"><button class="btn block" data-act="sheet-close">${t('close')}</button></div>`);
};

acts['body-add'] = () => {
  const last = S.body.filter(b => !b.deleted).at(-1) ?? {};
  sheet(`<h3>${t('g.addBody')}</h3>${BODY.map(k => `<label class="field"><span>${t('b.' + k)}</span>
    <input type="number" inputmode="decimal" step="0.1" min="0" id="body-${k}" placeholder="${last[k] ? num(last[k], last[k] % 1 ? 1 : 0) : ''}"></label>`).join('')}
    <div class="btns two"><button class="btn" data-act="sheet-close">${t('cancel')}</button><button class="btn primary" data-act="body-save">${t('save')}</button></div>`);
};
acts['body-save'] = () => {
  const e = { id: uid(), d: new Date().toISOString() };
  for (const k of BODY) {
    const v = parseFloat(String(document.getElementById('body-' + k)?.value ?? '').replace(',', '.'));
    if (v > 0) e[k] = Math.round(v * 10) / 10;
  }
  if (Object.keys(e).length === 2) { sheet(''); return; }
  sheet('');
  commit(s => {
    const today = dayKey(new Date());
    if (!s.body.some(b => !b.deleted && dayKey(new Date(b.d)) === today)) s.game.xp += XP.body;
    s.body.push(e);
  });
  toast(t('saved'));
};
acts['body-del'] = id => commit(s => { const b = s.body.find(x => x.id === id); if (b) b.deleted = true; });

acts['session-del'] = id => sheet(`<h3>${t('g.deleteQ')}</h3>
  <div class="btns"><button class="btn warn block" data-act="session-del-yes" data-arg="${id}">${t('g.deleteBody')}</button><button class="btn block" data-act="sheet-close">${t('cancel')}</button></div>`);
acts['session-del-yes'] = id => {
  sheet('');
  commit(s => {
    const x = s.sessions.find(y => y.id === id);
    if (!x) return;
    s.game.xp = Math.max(0, s.game.xp - (x.xp ?? 0));
    x.deleted = true; x.counted = false; x.steps = []; x.log = []; x.blocks = [];
    touchSession(x);
  });
  back('progress');
};

