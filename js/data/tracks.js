// Progression ladders. Each track is an ordered list of exercises, easiest first.
// `skill` tracks can take the skill slot at the start of a session.
export const TRACKS = [
  { id: 'push', group: 'push', en: 'Push-up', cs: 'Kliky', steps: ['pushup', 'pushup-wide', 'pushup-close', 'pushup-deep', 'pushup-wall', 'pushup-archer', 'pushup-pseudo', 'pushup-onearm', 'pushup-onearm-oneleg'] },
  { id: 'power', group: 'push', en: 'Explosive push-up', cs: 'Výbušné kliky', steps: ['pushup-clap', 'pushup-backclap', 'pushup-doubleclap', 'pushup-tripleclap', 'pushup-superman'] },
  { id: 'dip', group: 'push', en: 'Dip', cs: 'Dipy', steps: ['dip-box', 'dip', 'dip-bar'] },
  { id: 'hspu', group: 'push', en: 'Handstand push-up', cs: 'Klik ve stojce', steps: ['pike-pushup', 'hspu-wall', 'hspu-free', 'hspu-pbar-wall', 'hspu-pbar-free', 'pushup-90'] },
  { id: 'pull', group: 'pull', en: 'Pull-up', cs: 'Shyby', steps: ['row', 'chinup-negative', 'chinup', 'pullup', 'pullup-close', 'pullup-wide', 'pullup-L', 'pullup-rock', 'pullup-typewriter', 'pullup-weighted'] },
  { id: 'oap', group: 'pull', skill: 1, en: 'One-arm pull-up', cs: 'Shyb na jedné ruce', steps: ['oap-finger', 'oap-towel', 'oap-negative', 'oap-hold', 'oap'] },
  { id: 'mu', group: 'skill', skill: 1, en: 'Muscle-up', cs: 'Muscle-up', steps: ['pullup-high', 'false-grip-hang', 'mu-transition', 'muscleup', 'muscleup-strict'] },
  { id: 'hs', group: 'skill', skill: 1, en: 'Handstand', cs: 'Stojka', steps: ['wall-walk', 'hs-kick', 'hs-wall', 'hs-bail', 'hs-floor', 'hs-pbar'] },
  { id: 'planche', group: 'skill', skill: 1, en: 'Planche', cs: 'Planche', steps: ['planche-lean', 'frog-stand', 'planche-tuck', 'planche-advtuck', 'planche-oneleg', 'planche-straddle', 'planche-full', 'planche-pushup'] },
  { id: 'fl', group: 'skill', skill: 1, en: 'Front lever', cs: 'Přední váha', steps: ['fl-inverted', 'fl-tuck', 'fl-advtuck', 'fl-oneleg', 'fl-straddle', 'fl-full', 'fl-pullup'] },
  { id: 'bl', group: 'skill', skill: 1, en: 'Back lever', cs: 'Zadní váha', steps: ['german-hang', 'bl-tuck', 'bl-advtuck', 'bl-oneleg', 'bl-straddle', 'bl-full'] },
  { id: 'lsit', group: 'skill', skill: 1, en: 'Half lever', cs: 'Přednos', steps: ['hl-tuck', 'hl-angled', 'hl', 'hl-floor'] },
  { id: 'flag', group: 'skill', skill: 1, en: 'Human flag', cs: 'Lidská vlajka', steps: ['flag-vertical', 'flag-tuck', 'flag-straddle', 'flag-full'] },
  { id: 'core', group: 'core', en: 'Core strength', cs: 'Síla středu těla', steps: ['crunch', 'situp', 'lying-leg-raise', 'v-up', 'hang-knee-raise', 'hang-leg-raise', 'window-wipers'] },
  { id: 'line', group: 'core', en: 'Body line', cs: 'Zpevnění těla', steps: ['plank', 'side-plank', 'dish', 'arch', 'rear-support', 'plank-ext'] },
  { id: 'dragon', group: 'core', en: 'Dragon flag', cs: 'Dračí vlajka', steps: ['candlestick', 'df-tuck', 'df-oneleg', 'df-negative', 'dragon-flag', 'df-swimmers'] },
  { id: 'legs', group: 'legs', en: 'Single-leg squat', cs: 'Dřep na jedné noze', steps: ['squat', 'lunge', 'pistol-assisted', 'pistol-box', 'pistol', 'pistol-weighted'] },
  { id: 'hams', group: 'legs', en: 'Hamstring curl', cs: 'Zakopávání', steps: ['bridge', 'ham-piked', 'ham-assisted', 'ham-negative', 'ham-curl'] },
];
export const TRACK = Object.fromEntries(TRACKS.map(t => [t.id, t]));

export const GROUPS = [
  ['skill', 'Skills', 'Prvky'], ['push', 'Push', 'Tlaky'], ['pull', 'Pull', 'Tahy'],
  ['core', 'Core', 'Střed těla'], ['legs', 'Legs', 'Nohy'],
];

// Starting rung on each ladder by self-rated level (0 = first exercise).
const zero = Object.fromEntries(TRACKS.map(t => [t.id, 0]));
export const SEED = {
  beginner: { ...zero },
  intermediate: { ...zero, push: 2, dip: 1, pull: 3, hs: 1, core: 2, line: 2, legs: 2, hams: 1 },
  advanced: { ...zero, push: 4, power: 1, dip: 2, hspu: 1, pull: 6, mu: 1, hs: 2, planche: 2, fl: 2, bl: 1, lsit: 2, core: 4, line: 4, dragon: 1, legs: 4, hams: 2 },
};
