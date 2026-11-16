// Learn: short lessons that unlock with training, each with one quiz question.
import { S, commit, fullCount } from '../store.js';
import { acts, views } from './nav.js';
import { t, tp, L } from '../i18n.js';
import { LESSONS } from '../data/lessons.js';
import { XP, derive, award } from '../engine/game.js';
import { esc, fig, thumb, backBtn, ICON } from './common.js';

const open = l => l.at <= fullCount();

views.learn = {
  tab: 'learn',
  render() {
    const rows = LESSONS.map(l => {
      const x = L(l), done = S.lessons[l.id];
      if (!open(l)) {
        return `<div class="row" aria-disabled="true"><div class="thumb" style="opacity:.4">${fig(l.fig, { fit: -70 })}</div>
          <div class="main"><b class="muted">${esc(x.t)}</b><span>${tp('unlock', l.at)}</span></div><span class="side">${ICON.lock}</span></div>`;
      }
      return `<a class="row" href="#lesson/${l.id}">${thumb(null, l.fig)}
        <div class="main"><b>${esc(x.t)}${done ? '' : `<span class="tag">${t('l.new')}</span>`}</b></div>
        <span class="side">${done ? ICON.check : ICON.chevron}</span></a>`;
    }).join('');
    return `<h1 class="title">${t('tab.learn')}</h1><p class="sub">${t('l.sub')}</p><div class="list" style="margin-top:18px">${rows}</div>`;
  },
};

views.lesson = {
  tab: 'learn',
  render(id) {
    const l = LESSONS.find(x => x.id === id);
    if (!l || !open(l)) return `${backBtn('learn')}`;
    const x = L(l), ans = S.lessons[id];
    const opts = x.a.map((a, i) => {
      let cls = '';
      if (ans) cls = i === x.ok ? ' right' : i === ans.pick ? ' wrong' : '';
      return `<button class="opt${cls}" data-act="quiz" data-arg="${id}:${i}"${ans ? ' disabled' : ''}>${esc(a)}</button>`;
    }).join('');
    const next = LESSONS.find(n => LESSONS.indexOf(n) > LESSONS.indexOf(l) && open(n));
    return `${backBtn('learn')}<article class="lesson">
      ${fig(l.fig, { live: true })}
      <h1 class="title">${esc(x.t)}</h1>
      ${x.p.map(p => `<p>${esc(p)}</p>`).join('')}
      <h2 class="sec">${t('l.quiz')}</h2>
      <p><b>${esc(x.q)}</b></p>
      <div class="quiz">${opts}</div>
      ${ans ? `<p class="verdict">${ans.pick === x.ok ? t('l.right') : t('l.wrong')}</p><p>${esc(x.w)}</p>` : ''}
      ${ans && next ? `<div class="btns"><a class="btn block" href="#lesson/${next.id}">${t('l.next')}</a></div>` : ''}
    </article>`;
  },
};

acts.quiz = arg => {
  const [id, pick] = arg.split(':');
  const l = LESSONS.find(x => x.id === id);
  if (!l || S.lessons[id]) return;
  const ok = Number(pick) === l.en.ok;
  commit(s => {
    s.lessons[id] = { pick: Number(pick), ok, d: new Date().toISOString() };
    s.game.xp += ok ? XP.lesson : 10;
    award(s, derive(s, LESSONS.length), new Date().toISOString());
  });
};
