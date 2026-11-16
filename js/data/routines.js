// Building blocks for warm-ups, cool-downs, finishers and the stand-alone recovery routines.

// Warm-up drills in priority order, by the kind of skill trained that day.
export const WARMUP = {
  press: ['star-jumps', 'st-wrist-1', 'scap-pushup', 'shoulder-dislocates', 'deep-squat-hold', 'side-leans', 'chest-opener'],
  hang: ['star-jumps', 'scap-pullup', 'shoulder-dislocates', 'scap-pushup', 'deep-squat-hold', 'side-leans', 'chest-opener'],
  support: ['star-jumps', 'scap-dip', 'scap-pushup', 'st-wrist-1', 'deep-squat-hold', 'rollover-straddle', 'side-leans'],
};
// The hip drill rotates from session to session.
export const HIP_DRILLS = ['deep-squat-hold', 'lunge-rock', 'knee-circles', 'frog-hops', 'rollover-straddle'];
// Which warm-up family each skill track belongs to.
export const WARMUP_OF = { hs: 'press', planche: 'press', mu: 'hang', fl: 'hang', bl: 'hang', oap: 'hang', flag: 'hang', lsit: 'support' };

// Cool-down stretches: upper body by the day's emphasis, lower body rotating.
export const COOL_UPPER = {
  press: ['st-wrist-1', 'st-shoulder-ext', 'st-chest', 'st-cobra'],
  hang: ['st-lats', 'st-side', 'st-wrist-2', 'st-cat'],
  support: ['st-shoulder-ext', 'st-wrist-1', 'st-cat', 'st-side'],
};
export const COOL_LOWER = ['st-hipflexor', 'st-hamstring', 'st-quad', 'st-glute', 'st-calf', 'st-straddle', 'st-groin'];

// Finisher pairs for the interval block.
export const FINISHERS = [
  ['burpee', 'mountain-climbers'], ['jump-squat', 'bear-crawl'], ['squat-thrust', 'star-jumps'],
  ['jump-lunge', 'mountain-climbers'], ['bastards', 'star-jumps'], ['sprints', 'bear-crawl'],
];

// Stand-alone routines for rest days: [exercise, seconds].
export const ROUTINES = [
  { id: 'mobility', en: 'Mobility flow', cs: 'Mobilita', minutes: 8,
    steps: [['side-leans', 40], ['chest-opener', 40], ['shoulder-dislocates', 45], ['scap-pushup', 40], ['scap-pullup', 40], ['st-cat', 40], ['rollover-straddle', 45], ['lunge-rock', 60], ['knee-circles', 30], ['deep-squat-hold', 60]] },
  { id: 'roll', en: 'Foam rolling', cs: 'Rolování', minutes: 8,
    steps: [['roll-upper-back', 60], ['roll-spine', 45], ['roll-lats', 60], ['roll-glutes', 60], ['roll-itband', 60], ['roll-adductors', 60]] },
  { id: 'stretch', en: 'Full stretch', cs: 'Protažení celého těla', minutes: 10,
    steps: [['st-wrist-1', 40], ['st-wrist-2', 40], ['st-shoulder-ext', 45], ['st-chest', 60], ['st-lats', 45], ['st-side', 60], ['st-cobra', 40], ['st-hipflexor', 60], ['st-quad', 60], ['st-hamstring', 45], ['st-straddle', 45], ['st-groin', 40], ['st-glute', 60], ['st-calf', 60]] },
];
