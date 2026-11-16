// The exercise library: merges the chapter files and fills in defaults.
import mobility from './ex-mobility.js';
import push from './ex-push.js';
import pull from './ex-pull.js';
import skills from './ex-skills.js';
import coreLegs from './ex-core-legs.js';

const DEFAULTS = {
  mob: { kind: 'time', t: [1, 40, 40] },
  stretch: { kind: 'time', t: [1, 40, 40] },
  cond: { kind: 'time', t: [1, 30, 30] },
};

export const LIST = [...mobility, ...push, ...pull, ...skills, ...coreLegs]
  .map(e => ({ eq: [], ...DEFAULTS[e.cat], ...e }));
export const EX = Object.fromEntries(LIST.map(e => [e.id, e]));

// Library order and names of the categories.
export const CATS = [
  ['push', 'Push-ups', 'Kliky'], ['dip', 'Dips', 'Dipy'], ['pull', 'Pull-ups', 'Shyby'],
  ['mu', 'Muscle-ups', 'Muscle-upy'], ['hs', 'Handstands', 'Stojky'], ['planche', 'Planche', 'Planche'],
  ['fl', 'Front lever', 'Přední váha'], ['bl', 'Back lever', 'Zadní váha'], ['lsit', 'Half lever', 'Přednos'],
  ['flag', 'Human flag', 'Lidská vlajka'], ['core', 'Core', 'Střed těla'], ['legs', 'Legs', 'Nohy'],
  ['cond', 'Conditioning', 'Kondice'], ['mob', 'Mobility', 'Mobilita'], ['stretch', 'Stretching', 'Protahování'],
];

// Equipment the app knows about. `home` items are assumed to be around in any household.
export const EQUIPMENT = [
  ['bar', 'Pull-up bar', 'Hrazda'], ['dip', 'Dip bars', 'Bradla'], ['pb', 'Parallettes', 'Stálky'],
  ['roller', 'Foam roller', 'Pěnový válec'], ['band', 'Resistance band', 'Odporová guma'],
  ['weight', 'Weights', 'Závaží'], ['pole', 'Vertical pole', 'Svislá tyč'],
  ['wall', 'Free wall', 'Volná zeď'], ['box', 'Box or bench', 'Bedna nebo lavice'], ['towel', 'Towel', 'Ručník'],
];

// Does the owned equipment (a map of key -> true) cover what an exercise needs?
// A requirement may be a key or a list of alternatives.
export const hasEq = (ex, owned) => ex.eq.every(r => Array.isArray(r) ? r.some(k => owned[k]) : owned[r]);
export const missingEq = (ex, owned) => ex.eq.filter(r => Array.isArray(r) ? !r.some(k => owned[k]) : !owned[r]).map(r => Array.isArray(r) ? r[0] : r);
