// The game layer: experience points, levels, weekly streaks and badges.
import { TRACK } from '../data/tracks.js';
import { totals } from './progress.js';

export const XP = { set: 10, timed: 3, finish: 80, record: 25, levelUp: 150, lesson: 25, body: 10, baseline: 200, week: 100, routine: 40 };

export function sessionXp(session, recordCount = 0) {
  let xp = 0;
  session.steps.forEach((s, i) => {
    if (session.log?.[i] == null) return;
    xp += s.k === 'set' ? XP.set : s.k === 'rest' ? 0 : XP.timed;
  });
  if (session.type === 'baseline') return session.finished ? XP.baseline : xp;
  if (session.type === 'routine') return session.finished ? XP.routine : Math.min(xp, XP.routine);
  return xp + (session.finished ? XP.finish : 0) + recordCount * XP.record;
}

// Level L starts at 100 * (L^2 - 1) points.
export const xpAt = level => 100 * (level * level - 1);
export function levelOf(xp) {
  const level = Math.max(1, Math.floor(Math.sqrt(xp / 100 + 1)));
  return { level, from: xpAt(level), to: xpAt(level + 1), title: TITLES.filter(t => t[0] <= level).pop() };
}
export const TITLES = [
  [1, 'Fresh chalk', 'Čerstvá křída'], [3, 'Bar regular', 'Štamgast hrazdy'], [5, 'Grip apprentice', 'Učeň úchopu'],
  [8, 'Rep collector', 'Sběratel opakování'], [12, 'Lever hunter', 'Lovec vah'], [16, 'Gravity negotiator', 'Vyjednavač s gravitací'],
  [20, 'Park legend', 'Legenda hřiště'], [25, 'Iron scapula', 'Železná lopatka'], [30, 'Master of the bar', 'Mistr hrazdy'],
];

// ---- weeks (Monday to Sunday, local time)
export const dayKey = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
export function weekStart(d = new Date()) {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  x.setDate(x.getDate() - ((x.getDay() + 6) % 7));
  return x;
}
export const weekKey = d => dayKey(weekStart(d));
const shiftWeek = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + 7 * n); return x; };

// Full sessions per week: { '2026-11-16': 2, ... } keyed by the Monday.
export function perWeek(sessions) {
  const m = {};
  for (const s of sessions) if (s.counted && !s.deleted) { const k = weekKey(new Date(s.date)); m[k] = (m[k] ?? 0) + 1; }
  return m;
}
// Consecutive weeks that reached the target. The running week counts once it is complete,
// and never breaks the streak while it is still open.
export function streak(sessions, target, now = new Date()) {
  const m = perWeek(sessions);
  let w = weekStart(now), n = 0;
  if ((m[dayKey(w)] ?? 0) >= target) n++;
  for (w = shiftWeek(w, -1); (m[dayKey(w)] ?? 0) >= target; w = shiftWeek(w, -1)) n++;
  return n;
}
export const thisWeek = (sessions, now = new Date()) => perWeek(sessions)[weekKey(now)] ?? 0;

// ---- badges. `fig` shows a stick figure, `num` a number.
const reach = (track, ex) => s => (s.tracks[track]?.level ?? 0) >= TRACK[track].steps.indexOf(ex);
export const BADGES = [
  { id: 'first', num: '1', en: ['First chalk', 'Finish your first session'], cs: ['První křída', 'Dokonči první trénink'], ok: (s, d) => d.t.sessions >= 1 },
  { id: 's10', num: '10', en: ['Ten down', 'Finish 10 sessions'], cs: ['Deset za sebou', 'Dokonči 10 tréninků'], ok: (s, d) => d.t.sessions >= 10 },
  { id: 's25', num: '25', en: ['Quarter century', 'Finish 25 sessions'], cs: ['Čtvrt stovky', 'Dokonči 25 tréninků'], ok: (s, d) => d.t.sessions >= 25 },
  { id: 's50', num: '50', en: ['Half a hundred', 'Finish 50 sessions'], cs: ['Půl stovky', 'Dokonči 50 tréninků'], ok: (s, d) => d.t.sessions >= 50 },
  { id: 's100', num: '100', en: ['Centurion', 'Finish 100 sessions'], cs: ['Centurion', 'Dokonči 100 tréninků'], ok: (s, d) => d.t.sessions >= 100 },
  { id: 'w2', num: '2w', en: ['Back again', 'Hit your weekly goal 2 weeks in a row'], cs: ['Zase tady', 'Splň týdenní cíl 2 týdny po sobě'], ok: (s, d) => d.best >= 2 },
  { id: 'w4', num: '4w', en: ['A solid month', 'Hit your weekly goal 4 weeks in a row'], cs: ['Poctivý měsíc', 'Splň týdenní cíl 4 týdny po sobě'], ok: (s, d) => d.best >= 4 },
  { id: 'w12', num: '12w', en: ['A full season', 'Hit your weekly goal 12 weeks in a row'], cs: ['Celá sezóna', 'Splň týdenní cíl 12 týdnů po sobě'], ok: (s, d) => d.best >= 12 },
  { id: 'w26', num: '26w', en: ['Half a year strong', 'Hit your weekly goal 26 weeks in a row'], cs: ['Půl roku v kuse', 'Splň týdenní cíl 26 týdnů po sobě'], ok: (s, d) => d.best >= 26 },
  { id: 'up1', num: '+1', en: ['Next rung', 'Confirm your first level-up'], cs: ['Další příčka', 'Potvrď svůj první postup'], ok: (s, d) => d.ups >= 1 },
  { id: 'up10', num: '+10', en: ['Climber', 'Confirm 10 level-ups'], cs: ['Lezec', 'Potvrď 10 postupů'], ok: (s, d) => d.ups >= 10 },
  { id: 'up25', num: '+25', en: ['Ladder runner', 'Confirm 25 level-ups'], cs: ['Běžec po žebříku', 'Potvrď 25 postupů'], ok: (s, d) => d.ups >= 25 },
  { id: 'test', fig: 'pushup', en: ['Measured up', 'Complete the baseline test'], cs: ['Změřeno', 'Dokonči vstupní test'], ok: s => !!s.baseline },
  { id: 'pullup', fig: 'pullup', en: ['On the bar', 'Reach the pull-up'], cs: ['Na hrazdě', 'Dostaň se ke shybu nadhmatem'], ok: reach('pull', 'pullup') },
  { id: 'lpull', fig: 'pullupL', en: ['Pull with style', 'Reach the L pull-up'], cs: ['Shyb se stylem', 'Dostaň se ke shybu v přednosu'], ok: reach('pull', 'pullup-L') },
  { id: 'muscleup', fig: 'muscleup', en: ['Over the bar', 'Reach the muscle-up'], cs: ['Přes hrazdu', 'Dostaň se k muscle-upu'], ok: reach('mu', 'muscleup') },
  { id: 'handstand', fig: 'handstand', en: ['Upside down', 'Reach the floor handstand'], cs: ['Hlavou dolů', 'Dostaň se k volné stojce'], ok: reach('hs', 'hs-floor') },
  { id: 'hspu', fig: 'hspuWall', en: ['Heavy head', 'Reach the wall handstand push-up'], cs: ['Těžká hlava', 'Dostaň se ke kliku ve stojce u zdi'], ok: reach('hspu', 'hspu-wall') },
  { id: 'tuckplanche', fig: 'plancheTuck', en: ['Feet off the floor', 'Reach the tuck planche'], cs: ['Nohy ze země', 'Dostaň se k planche ve skrčce'], ok: reach('planche', 'planche-tuck') },
  { id: 'planche', fig: 'planche', en: ['Hovering', 'Reach the full planche'], cs: ['Vznášení', 'Dostaň se k plné planche'], ok: reach('planche', 'planche-full') },
  { id: 'tuckfl', fig: 'flTuck', en: ['Level back', 'Reach the tuck front lever'], cs: ['Záda vodorovně', 'Dostaň se k přední váze ve skrčce'], ok: reach('fl', 'fl-tuck') },
  { id: 'frontlever', fig: 'frontlever', en: ['Horizontal', 'Reach the full front lever'], cs: ['Vodorovně', 'Dostaň se k přední váze'], ok: reach('fl', 'fl-full') },
  { id: 'backlever', fig: 'backlever', en: ['Face down', 'Reach the full back lever'], cs: ['Obličejem dolů', 'Dostaň se k zadní váze'], ok: reach('bl', 'bl-full') },
  { id: 'lsit', fig: 'lsit', en: ['Letter L', 'Reach the half lever'], cs: ['Písmeno L', 'Dostaň se k přednosu'], ok: reach('lsit', 'hl') },
  { id: 'pistol', fig: 'pistol', en: ['One leg is enough', 'Reach the single-leg squat'], cs: ['Jedna noha stačí', 'Dostaň se ke dřepu na jedné noze'], ok: reach('legs', 'pistol') },
  { id: 'dragon', fig: 'dragonFlag', en: ['Dragon', 'Reach the dragon flag'], cs: ['Drak', 'Dostaň se k dračí vlajce'], ok: reach('dragon', 'dragon-flag') },
  { id: 'onearm', fig: 'pushup1', en: ['Half the hands', 'Reach the one-arm push-up'], cs: ['Poloviční počet rukou', 'Dostaň se ke kliku na jedné ruce'], ok: reach('push', 'pushup-onearm') },
  { id: 'pull500', num: '500', en: ['Half a thousand pulls', 'Log 500 pulling reps'], cs: ['Pět set tahů', 'Zapiš 500 opakování tahů'], ok: (s, d) => (d.t.reps.pull ?? 0) + (d.t.reps.mu ?? 0) >= 500 },
  { id: 'push1000', num: '1k', en: ['A thousand pushes', 'Log 1 000 pushing reps'], cs: ['Tisíc tlaků', 'Zapiš 1 000 opakování tlaků'], ok: (s, d) => (d.t.reps.push ?? 0) + (d.t.reps.dip ?? 0) >= 1000 },
  { id: 'hold30', num: '30′', en: ['Half an hour of holds', 'Hold static positions for 30 minutes in total'], cs: ['Půlhodina výdrží', 'Vydrž ve statických polohách celkem 30 minut'], ok: (s, d) => d.t.hold >= 1800 },
  { id: 'scholar', num: 'A+', en: ['Scholar', 'Answer every lesson quiz'], cs: ['Premiant', 'Zodpověz kvíz u každé lekce'], ok: (s, d) => d.lessons > 0 && Object.keys(s.lessons).length >= d.lessons },
  { id: 'body8', num: 'kg', en: ['Keeping track', 'Log your body data 8 times'], cs: ['Mám přehled', 'Zapiš tělesné míry osmkrát'], ok: s => s.body.filter(b => !b.deleted).length >= 8 },
];

// Everything the badge rules need, computed once.
export function derive(state, lessonCount = 0, now = new Date()) {
  const live = state.sessions.filter(s => !s.deleted);
  const now_ = streak(live, state.profile.days, now);
  return { t: totals(live), streak: now_, best: Math.max(state.game.best ?? 0, now_), ups: Object.values(state.tracks).reduce((a, t) => a + (t.ups ?? 0), 0), lessons: lessonCount };
}
// Awards any newly earned badges and returns them.
export function award(state, d, date) {
  const got = [];
  for (const b of BADGES) if (!state.game.badges[b.id] && b.ok(state, d)) { state.game.badges[b.id] = date; got.push(b); }
  state.game.best = d.best;
  return got;
}
