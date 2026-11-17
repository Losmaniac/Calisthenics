// Interface text in English and Czech, plus number and date formatting.
import { S } from './store.js';

export const lang = () => (S.profile.lang === 'cs' ? 'cs' : 'en');
const ix = () => (lang() === 'cs' ? 1 : 0);

// key: [English, Czech]
const STR = {
  'tab.today': ['Today', 'Dnes'], 'tab.skills': ['Skills', 'Prvky'], 'tab.learn': ['Learn', 'Učení'],
  'tab.progress': ['Progress', 'Pokrok'], 'tab.me': ['Setup', 'Nastavení'],
  back: ['Back', 'Zpět'], save: ['Save', 'Uložit'], cancel: ['Cancel', 'Zrušit'], close: ['Close', 'Zavřít'],
  done: ['Done', 'Hotovo'], yes: ['Yes', 'Ano'], eachSide: ['each side', 'na každou stranu'],
  days: ['Su Mo Tu We Th Fr Sa', 'Ne Po Út St Čt Pá So'],

  'block.warmup': ['Warm-up', 'Rozcvičení'], 'block.skill': ['Skill', 'Prvek'], 'block.strength': ['Strength', 'Síla'],
  'block.finisher': ['Finisher', 'Závěr'], 'block.cooldown': ['Cool-down', 'Zklidnění'], 'block.test': ['Test', 'Test'],
  'block.routine': ['Routine', 'Sestava'],

  'today.about': ['Session {0}, about {1} min', 'Trénink {0}, asi {1} min'],
  'today.start': ['Start session', 'Začít trénink'], 'today.continue': ['Continue session', 'Pokračovat v tréninku'],
  'today.discard': ['Discard it', 'Zahodit'], 'today.discardQ': ['Discard the session in progress?', 'Zahodit rozdělaný trénink?'],
  'today.week': ['This week', 'Tento týden'], 'today.weekCount': ['{0} of {1} sessions', '{0} z {1} tréninků'],
  'today.inside': ['In this session', 'V tomto tréninku'], 'today.recovery': ['For a rest day', 'Na den volna'],
  'today.doneToday': ['Trained today. Rest well.', 'Dnes odtrénováno. Dobře si odpočiň.'],
  'today.next': ['Next session', 'Příští trénink'],
  'today.baseline.t': ['Find your starting point', 'Najdi svůj výchozí bod'],
  'today.baseline.d': ['A 10-minute test places you on the ladders. Until then the app works from your own estimate.', 'Desetiminutový test tě zařadí na žebříky. Do té doby aplikace vychází z tvého odhadu.'],
  'today.baseline.go': ['Take the test', 'Udělat test'],
  'today.lesson': ['New lesson', 'Nová lekce'],
  'today.progress': ['In progress: step {0} of {1}', 'Rozděláno: krok {0} z {1}'],

  'p.getReady': ['Get ready', 'Připrav se'], 'p.rest': ['Rest', 'Pauza'], 'p.go': ['Go', 'Jedeš'],
  'p.nextUp': ['Next', 'Následuje'], 'p.setOf': ['Set {0} of {1}', 'Série {0} z {1}'],
  'p.roundOf': ['Round {0} of {1}', 'Kolo {0} z {1}'],
  'p.reps': ['{0} to {1} reps', '{0} až {1} opakování'], 'p.hold': ['Hold for {0} to {1} s', 'Výdrž {0} až {1} s'],
  'p.maxReps': ['As many clean reps as you can', 'Co nejvíc čistých opakování'],
  'p.maxHold': ['Hold as long as you can', 'Vydrž co nejdéle'],
  'p.setDone': ['Set done', 'Série hotová'], 'p.startHold': ['Start the hold', 'Spustit výdrž'], 'p.stop': ['Stop', 'Stop'],
  'p.otherSide': ['Now the other side', 'Teď druhá strana'], 'p.switch': ['Switch sides', 'Vyměň stranu'],
  'p.howMany': ['How many reps?', 'Kolik opakování?'], 'p.howLong': ['How many seconds?', 'Kolik vteřin?'],
  'p.perSide': ['Enter the number for one side.', 'Zadej počet na jednu stranu.'],
  'p.skip': ['Skip', 'Přeskočit'], 'p.skipRest': ['Skip rest', 'Přeskočit pauzu'], 'p.plus': ['+15 s', '+15 s'],
  'p.pause': ['Pause', 'Pozastavit'], 'p.resume': ['Resume', 'Pokračovat'],
  'p.end': ['End session', 'Ukončit trénink'], 'p.endQ': ['End the session now?', 'Ukončit trénink teď?'],
  'p.endD': ['Everything you have logged so far is saved.', 'Vše, co jsi zatím zapsal, se uloží.'],
  'p.keep': ['Keep going', 'Pokračovat dál'], 'p.list': ['List', 'Seznam'], 'p.guided': ['Guided', 'Průvodce'],
  'p.byHand': ['Enter the time by hand', 'Zadat čas ručně'], 'p.continue': ['Continue', 'Pokračovat'],
  'p.away': ['You were away. Ready to go on?', 'Byl jsi pryč. Jedeme dál?'],
  'p.last': ['Best so far: {0}', 'Zatím nejlépe: {0}'], 'p.held': ['Target reached', 'Cíl splněn'],
  'p.firstSide': ['First side: {0} s', 'První strana: {0} s'],

  's.title': ['Session done', 'Trénink hotový'], 's.partial': ['Session ended early', 'Trénink ukončen dřív'],
  's.test': ['Test done', 'Test hotový'], 's.routine': ['Routine done', 'Sestava hotová'],
  's.time': ['{0} min on the clock', '{0} min na hodinách'],
  's.records': ['New records', 'Nové rekordy'], 's.was': ['was {0}', 'dříve {0}'],
  's.moves': ['Ready for the next rung?', 'Připravený na další příčku?'],
  's.upD': ['You reached the top of the range in every set, two sessions in a row.', 'Ve všech sériích jsi dosáhl horní hranice rozsahu, dva tréninky po sobě.'],
  's.upYes': ['Move up', 'Postoupit'], 's.upNo': ['Not yet', 'Ještě ne'],
  's.downD': ['This one has stayed below the range twice. An easier rung will build it faster.', 'Tenhle cvik zůstal dvakrát pod rozsahem. Snazší příčka ho vybuduje rychleji.'],
  's.downYes': ['Step back', 'O krok zpět'], 's.downNo': ['Stay here', 'Zůstat'],
  's.moved': ['Now training: {0}', 'Teď trénuješ: {0}'], 's.stay': ['Staying on {0}', 'Zůstáváš u: {0}'],
  's.badges': ['New badges', 'Nové odznaky'], 's.finish': ['Finish', 'Dokončit'],
  's.placed': ['Your starting rungs', 'Tvoje výchozí příčky'],
  's.lesson': ['A new lesson is waiting', 'Čeká na tebe nová lekce'], 's.read': ['Read it', 'Přečíst'],
  's.weekGoal': ['Weekly goal reached', 'Týdenní cíl splněn'], 's.level': ['Level {0}', 'Úroveň {0}'],

  'k.ladders': ['Ladders', 'Žebříky'], 'k.library': ['Library', 'Knihovna'],
  'k.rung': ['Rung {0} of {1}', 'Příčka {0} z {1}'], 'k.here': ['You are here', 'Tady jsi'],
  'k.focus': ['Focus', 'Hlavní'], 'k.needs': ['Needs {0}', 'Potřebuje: {0}'],
  'k.search': ['Search exercises', 'Hledat cvik'], 'k.all': ['All', 'Vše'], 'k.none': ['No exercise matches.', 'Žádný cvik neodpovídá.'],
  'k.setHere': ['Make this my rung', 'Nastavit jako moji příčku'],
  'k.setHereD': ['Use this when the app has placed you too low or too high.', 'Použij, když tě aplikace zařadila moc nízko nebo moc vysoko.'],
  'k.setDone': ['Your rung on this ladder is now {0}.', 'Tvoje příčka na tomto žebříku je teď {0}.'],
  'k.count': ['{0} exercises', '{0} cviků'],
  'x.how': ['How to do it', 'Jak na to'], 'x.cues': ['Keep in mind', 'Mysli na'], 'x.errors': ['Common mistakes', 'Časté chyby'],
  'x.target': ['Target', 'Cíl'], 'x.record': ['Your record', 'Tvůj rekord'], 'x.video': ['Find a video on YouTube', 'Najít video na YouTube'],
  'x.top': ['Seen from above', 'Pohled shora'], 'x.ladder': ['{0} ladder', 'Žebřík {0}'],
  'x.easier': ['Easier', 'Lehčí'], 'x.harder': ['Harder', 'Těžší'], 'x.variation': ['Variation, not on a ladder', 'Varianta mimo žebříky'],
  'x.equipment': ['You need', 'Potřebuješ'], 'x.nothing': ['No equipment', 'Bez vybavení'],
  'x.side': ['per side', 'na stranu'],

  'l.sub': ['Short lessons that unlock as you train.', 'Krátké lekce, které se odemykají s tréninkem.'],
  'l.quiz': ['Quick check', 'Rychlá kontrola'], 'l.right': ['Right.', 'Správně.'], 'l.wrong': ['Not quite.', 'Ne tak docela.'],
  'l.next': ['Next lesson', 'Další lekce'], 'l.new': ['New', 'Nová'],

  'g.xpTo': ['{0} XP to level {1}', '{0} XP do úrovně {1}'], 'g.best': ['Best run: {0}', 'Nejdelší série: {0}'],
  'g.totals': ['Since you started', 'Od začátku'], 'g.sessions': ['sessions', 'tréninků'],
  'g.hours': ['hours trained', 'hodin tréninku'], 'g.pull': ['pulling reps', 'opakování tahů'],
  'g.push': ['pushing reps', 'opakování tlaků'], 'g.hold': ['minutes held', 'minut ve výdrži'],
  'g.perWeek': ['Sessions per week', 'Tréninky za týden'], 'g.goal': ['goal {0}', 'cíl {0}'],
  'g.records': ['Records', 'Rekordy'], 'g.noRecords': ['Your best sets will show up here.', 'Tady se objeví tvoje nejlepší série.'],
  'g.body': ['Body', 'Tělo'], 'g.addBody': ['Add a measurement', 'Přidat měření'],
  'g.noBody': ['Log your weight now and then to see the trend.', 'Občas si zapiš váhu a uvidíš trend.'],
  'b.weight': ['Weight (kg)', 'Váha (kg)'], 'b.waist': ['Waist (cm)', 'Pas (cm)'], 'b.chest': ['Chest (cm)', 'Hrudník (cm)'],
  'b.arm': ['Arm (cm)', 'Paže (cm)'], 'b.thigh': ['Thigh (cm)', 'Stehno (cm)'],
  'g.badges': ['Badges', 'Odznaky'], 'g.badgeCount': ['{0} of {1}', '{0} z {1}'], 'g.earned': ['Earned {0}', 'Získáno {0}'],
  'g.history': ['History', 'Historie'], 'g.allSessions': ['All sessions', 'Všechny tréninky'],
  'g.noHistory': ['No sessions yet. The first one is waiting on the Today tab.', 'Zatím žádný trénink. První čeká na kartě Dnes.'],
  'g.delete': ['Delete this session', 'Smazat tento trénink'], 'g.deleteQ': ['Delete this session for good?', 'Smazat tento trénink natrvalo?'],
  'g.deleteBody': ['Delete', 'Smazat'], 'g.early': ['ended early', 'ukončen dřív'],

  'm.name': ['Name', 'Jméno'], 'm.lang': ['Language', 'Jazyk'],
  'm.training': ['Training', 'Trénink'], 'm.days': ['Sessions per week', 'Tréninků týdně'], 'm.minutes': ['Session length', 'Délka tréninku'],
  'm.level': ['Level', 'Úroveň'], 'lvl.beginner': ['Beginner', 'Začátečník'], 'lvl.intermediate': ['Intermediate', 'Středně pokročilý'], 'lvl.advanced': ['Advanced', 'Pokročilý'],
  'm.focus': ['Focus skills', 'Hlavní prvky'], 'm.focusD': ['These take turns in the skill block. Tap in the order you care about them.', 'Tyto prvky se střídají v bloku nácviku. Klepni v pořadí, na kterém ti záleží.'],
  'm.eq': ['Equipment', 'Vybavení'], 'm.eqD': ['The plan only uses what you have.', 'Plán používá jen to, co máš.'],
  'm.remind': ['Reminders', 'Připomínky'], 'm.remindD': ['Pick your training days and add them to your calendar as a repeating event.', 'Vyber tréninkové dny a přidej je do kalendáře jako opakovanou událost.'],
  'm.time': ['Time', 'Čas'], 'm.cal': ['Add to calendar', 'Přidat do kalendáře'], 'm.calTitle': ['Chalk training', 'Trénink Chalk'],
  'm.sounds': ['Sound and screen', 'Zvuk a displej'], 'm.sound': ['Timer sounds', 'Zvuky časovače'],
  'm.loud': ['Play in silent mode too', 'Hrát i v tichém režimu'], 'm.loudD': ['This may pause music from other apps.', 'Může to pozastavit hudbu z jiných aplikací.'],
  'm.awake': ['Keep the screen on during a session', 'Při tréninku nechat rozsvícený displej'],
  'm.sync': ['Cloud sync', 'Synchronizace'],
  'm.syncOff': ['Cloud sync is not connected yet. Your data lives on this device, so export a backup now and then.', 'Synchronizace ještě není připojená. Data jsou v tomto zařízení, takže si občas exportuj zálohu.'],
  'm.email': ['E-mail', 'E-mail'], 'm.password': ['Password', 'Heslo'], 'm.signIn': ['Sign in', 'Přihlásit se'],
  'm.signUp': ['Create an account', 'Vytvořit účet'], 'm.signOut': ['Sign out', 'Odhlásit se'], 'm.syncNow': ['Sync now', 'Synchronizovat'],
  'm.signedIn': ['Signed in as {0}', 'Přihlášen jako {0}'], 'm.synced': ['Last synced {0}', 'Naposledy synchronizováno {0}'],
  'm.never': ['never', 'nikdy'], 'm.syncing': ['Syncing…', 'Synchronizuji…'],
  'm.errAuth': ['Sign-in failed. Check the e-mail and password.', 'Přihlášení se nezdařilo. Zkontroluj e-mail a heslo.'],
  'm.errWeak': ['Use a password with at least 6 characters.', 'Použij heslo s aspoň 6 znaky.'],
  'm.errUsed': ['This e-mail already has an account. Sign in instead.', 'Tento e-mail už účet má. Přihlas se.'],
  'm.errNet': ['No connection. Your data is safe on this device and will sync later.', 'Bez připojení. Data jsou v zařízení v bezpečí a synchronizují se později.'],
  'm.errSync': ['Sync failed: {0}', 'Synchronizace selhala: {0}'], 'm.syncOk': ['Synced', 'Synchronizováno'],
  'm.data': ['Your data', 'Tvoje data'], 'm.export': ['Export a backup', 'Exportovat zálohu'], 'm.import': ['Import a backup', 'Importovat zálohu'],
  'm.importQ': ['Replace everything on this device with the backup?', 'Nahradit vše v tomto zařízení zálohou?'],
  'm.importBad': ['That file is not a Chalk backup.', 'Tento soubor není záloha aplikace Chalk.'], 'm.imported': ['Backup restored', 'Záloha obnovena'],
  'm.replace': ['Replace', 'Nahradit'],
  'm.test': ['Take the baseline test', 'Udělat vstupní test'], 'm.retest': ['Repeat the baseline test', 'Zopakovat vstupní test'],
  'm.reset': ['Reset the app', 'Resetovat aplikaci'],
  'm.resetQ': ['Delete all sessions, records and settings on this device?', 'Smazat všechny tréninky, rekordy a nastavení v tomto zařízení?'],
  'm.resetYes': ['Delete everything', 'Smazat vše'], 'm.about': ['Chalk {0}', 'Chalk {0}'],
  'm.update': ['A new version is ready', 'Nová verze je připravená'], 'm.reload': ['Reload', 'Načíst znovu'],

  'o.tag': ['Your calisthenics coach', 'Tvůj kouč kalisteniky'],
  'o.setup': ['Your setup', 'Tvoje nastavení'],
  'o.check': ['These settings are filled in for you. Change whatever does not fit.', 'Nastavení je předvyplněné. Uprav, co nesedí.'],
  'o.test': ['Take the 10-minute test', 'Udělat desetiminutový test'], 'o.skip': ['Skip the test and start', 'Přeskočit test a začít'],
  'o.testD': ['A few all-out sets show the app where you really stand.', 'Pár sérií naplno ukáže aplikaci, jak na tom opravdu jsi.'],

  'p.uReps': ['reps', 'opakování'], 'p.uSecs': ['seconds', 'sekund'], 'p.finish': ['Finish session', 'Dokončit trénink'],
  'h.session': ['Session {0}', 'Trénink {0}'], 'h.baseline': ['Baseline test', 'Vstupní test'],
  'm.cfg': ['Firebase config', 'Konfigurace Firebase'],
  'm.cfgD': ['Create a free Firebase project with e-mail sign-in and Firestore turned on, then paste its web app config here.', 'Vytvoř si bezplatný projekt Firebase se zapnutým přihlášením e-mailem a databází Firestore a vlož sem konfiguraci webové aplikace.'],
  'm.google': ['Continue with Google', 'Pokračovat přes Google'],
  'm.orEmail': ['Or use e-mail and password:', 'Nebo e-mail a heslo:'],
  'm.client': ['Google web client ID', 'Google web client ID'],
  'm.clientBad': ['That is not a Google client ID. It ends with apps.googleusercontent.com.', 'Tohle není Google client ID. Končí na apps.googleusercontent.com.'],
  'm.errGoogle': ['Google sign-in did not finish. Try again.', 'Přihlášení přes Google se nedokončilo. Zkus to znovu.'],
  'm.connect': ['Connect', 'Připojit'], 'm.forget': ['Remove the Firebase config', 'Odebrat konfiguraci Firebase'],
  'm.cfgBad': ['That is not a Firebase web config. It needs apiKey and projectId.', 'Tohle není konfigurace Firebase. Musí obsahovat apiKey a projectId.'],
  'm.errOp': ['E-mail sign-in is turned off in your Firebase project. Turn it on under Authentication.', 'Přihlášení e-mailem je ve tvém projektu Firebase vypnuté. Zapni ho v sekci Authentication.'],
  'r.minutes': ['{0} min', '{0} min'], saved: ['Saved', 'Uloženo'],
};

// Plurals: English [one, many], Czech [one, few, many]
const PLURAL = {
  weeks: [['{0} week in a row', '{0} weeks in a row'], ['{0} týden v řadě', '{0} týdny v řadě', '{0} týdnů v řadě']],
  wk: [['{0} week', '{0} weeks'], ['{0} týden', '{0} týdny', '{0} týdnů']],
  unlock: [['Unlocks after {0} session', 'Unlocks after {0} sessions'], ['Odemkne se po {0} tréninku', 'Odemkne se po {0} trénincích', 'Odemkne se po {0} trénincích']],
  sets: [['{0} set', '{0} sets'], ['{0} série', '{0} série', '{0} sérií']],
  repsN: [['{0} rep', '{0} reps'], ['{0} opakování', '{0} opakování', '{0} opakování']],
};

export function t(key, ...args) {
  const row = STR[key];
  if (!row) return key;
  let s = row[ix()];
  args.forEach((v, i) => { s = s.replaceAll(`{${i}}`, v); });
  return s;
}
export function tp(key, n) {
  const forms = PLURAL[key][ix()];
  const f = lang() === 'cs' ? (n === 1 ? forms[0] : n >= 2 && n <= 4 ? forms[1] : forms[2]) : (n === 1 ? forms[0] : forms[1]);
  return f.replaceAll('{0}', num(n));
}
export const has = key => key in STR;
export const keysOf = () => Object.keys(STR);

export const L = o => o[lang()];                        // exercise or lesson text block
export const nm = o => (lang() === 'cs' ? o.cs : o.en); // { en, cs } names
export const tri = a => a[lang() === 'cs' ? 2 : 1];     // [id, en, cs] rows

// Numbers: thin space between thousands, comma as the decimal mark.
export function num(n, digits = 0) {
  const [i, d] = Number(n).toFixed(digits).split('.');
  return i.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + (d ? ',' + d : '');
}
const locale = () => (lang() === 'cs' ? 'cs-CZ' : 'en-GB');
export const dateLong = d => new Intl.DateTimeFormat(locale(), { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date(d));
export const dateShort = d => new Intl.DateTimeFormat(locale(), { day: 'numeric', month: 'short' }).format(new Date(d));
export const dateTime = d => new Intl.DateTimeFormat(locale(), { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(d));
export const clock = secs => { const s = Math.max(0, Math.ceil(secs)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };
export const dayNames = () => t('days').split(' ');
