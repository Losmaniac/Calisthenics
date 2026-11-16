// Figure definitions: keyframes for each movement (pose format: see js/figure.js).
// Side view unless a pose says view: 'front'. Floor is at y = 180.
const R = Math.PI / 180;
const at = (p, a, len) => [p[0] + Math.sin(a * R) * len, p[1] - Math.cos(a * R) * len];
// straight body resting on its feet: `ankle` point, `a` = direction from hip to neck
const line = (ankle, a, x = {}) => ({ hip: at(ankle, a, 58), torso: a, legs: [a + 180, a + 180], ...x });

const BAR = [100, 26];
const hang = (x = {}) => ({ hip: [100, 112], hands: BAR, toes: 'point', ...x });
const top = (x = {}) => ({ hip: [84, 82], torso: 5, hands: BAR, legs: [176, 184], toes: 'point', ...x });
const up = (x = {}) => line([40, 172], 69, { hands: [133, 180], head: 75, ...x });
const down = (x = {}) => line([40, 172], 86, { hands: [133, 180], head: 80, ...x });
const stand = (x = {}) => ({ hip: [100, 122], arms: [178, 176], feet: [100, 180], ...x });
const crouch = (x = {}) => ({ hip: [78, 156], torso: 60, feet: [72, 180], hands: [118, 180], ...x });
const quad = (x = {}) => ({ hip: [78, 147], torso: 75, legs: [180, 268], hands: [119, 180], ...x });
const DIPS = [['rail', 70, 130, 118]];
const dipTop = (x = {}) => ({ hip: [100, 116], torso: 2, hands: [100, 118], legs: [183, 215], ...x });
const PB = [['rail', 82, 120, 164]];
const hs = (x = {}) => ({ hip: [100, 94], torso: 180, hands: [100, 180], legs: [0, 0], toes: 'point', ...x });
const FL = [['bar', 70, 40]];
const fl = (x = {}) => ({ hip: [112, 84], torso: 270, hands: [70, 40], legs: [90, 90], toes: 'point', ...x });
const BL = [['bar', 130, 40]];
const bl = (x = {}) => ({ hip: [88, 84], torso: 90, hands: [130, 40], legs: [270, 270], toes: 'point', ...x });
const pl = (x = {}) => ({ hip: [70, 138], torso: 90, head: 80, hands: [100, 180], legs: [270, 270], toes: 'point', ...x });
const supine = (x = {}) => ({ hip: [112, 174], torso: 272, head: 270, feet: [150, 180], arms: [95, 95], ...x });
const POLE = [['pole', 30]];
const flag = (x = {}) => ({ view: 'front', hip: [112, 122.5], torso: 270, handR: [30, 95], handL: [30, 150], legR: [90, 90], legL: [90, 90], toes: 'point', ...x });
const DF = [['bar', 48, 166]];
const dfUp = (x = {}) => ({ hip: [84, 130], torso: 185, head: 270, hands: [50, 166], legs: [0, 0], toes: 'point', ...x });
const dfLow = (x = {}) => ({ hip: [119.5, 157.6], torso: 250, head: 270, hands: [50, 166], legs: [70, 70], toes: 'point', ...x });
const MU = [['bar', 100, 82]];
const kneel = (x = {}) => ({ hip: [70, 147], legs: [180, 270], arms: [150, 60], ...x });
const NORDIC = [['bar', 44, 166]];

export const FIGS = {
  // ---------- mobility
  scapPushup: { frames: [line([40, 172], 67, { hands: [133, 180], sx: 4, head: 80 }), line([40, 172], 71, { hands: [133, 180], sx: -3, head: 74 })] },
  scapDip: { props: DIPS, frames: [dipTop({ hip: [100, 121], sy: 5, torso: 0 }), dipTop({ hip: [100, 113], sy: -3, torso: 0 })] },
  scapPull: { props: [['bar', ...BAR]], frames: [hang({ hip: [100, 116], sy: 4 }), hang({ hip: [100, 109], sy: -3 })] },
  scapPull1: { props: [['bar', ...BAR]], frames: [hang({ hip: [100, 116], sy: 4, hands: null, handR: BAR, armL: [186, 182] }), hang({ hip: [100, 109], sy: -3, hands: null, handR: BAR, armL: [186, 182] })] },
  rollUpper: { props: [['roller', 70, 172]], frames: [
    { hip: [112, 166], torso: 280, head: 285, feet: [150, 180], arms: [320, 200] },
    { hip: [124, 168], torso: 284, head: 290, feet: [150, 180], arms: [320, 200] }] },
  rollLat: { props: [['roller', 78, 173]], frames: [
    { hip: [118, 170], torso: 277, arms: [275, 275], legs: [95, 95] },
    { hip: [126, 170], torso: 277, arms: [275, 275], legs: [95, 95] }] },
  crossBody: { frames: [{ view: 'front', hip: [100, 122], armR: [275, 280], armL: [120, 340], legs: [176, 180] }] },
  chestOpen: { frames: [stand({ arms: [196, 198] }), stand({ arms: [228, 236], torso: 4, head: -4 })] },
  dislocates: { key: 1, frames: [stand({ arms: [150, 150] }), stand({ arms: [0, 0] }), stand({ arms: [-150, -150] })] },
  sideLean: { frames: [
    { view: 'front', hip: [100, 122], armR: [170, 178], armL: [190, 182], legs: [174, 178] },
    { view: 'front', hip: [100, 122], torso: 22, armR: [168, 170], armL: [34, 48], legs: [174, 178] }] },
  rollIT: { props: [['roller', 80, 174]], frames: [
    { hip: [95, 164], torso: 72, arms: [180, 90], legL: [262, 262], footR: [112, 180] },
    { hip: [103, 164], torso: 72, arms: [180, 90], legL: [262, 262], footR: [120, 180] }] },
  rollThigh: { props: [['roller', 72, 174]], frames: [
    { hip: [92, 160], torso: 78, arms: [180, 90], legL: [258, 258], legR: [240, 275] },
    { hip: [100, 160], torso: 78, arms: [180, 90], legL: [258, 258], legR: [240, 275] }] },
  rollGlute: { props: [['roller', 100, 171]], frames: [
    { hip: [100, 160], torso: 305, head: 330, hands: [58, 180], footL: [140, 180], legR: [60, 150] },
    { hip: [106, 160], torso: 305, head: 330, hands: [64, 180], footL: [140, 180], legR: [60, 150] }] },
  rollover: { frames: [
    { hip: [88, 132], torso: 197, head: 270, arms: [95, 95], legs: [285, 285], toes: 'point' },
    { hip: [110, 172], torso: 50, head: 60, arms: [80, 95], legs: [88, 88], toes: 'point' }] },
  kneeCircle: { frames: [
    { hip: [88, 140], torso: 45, feet: [100, 180], hands: [113, 154] },
    { hip: [84, 138], torso: 45, feet: [100, 180], hands: [109, 152] }] },
  climber: { hold: 120, move: 380, frames: [up({ legR: [110, 235] }), up({ legL: [110, 235] })] },
  frogHop: { frames: [
    { hip: [80, 160], torso: 62, feet: [88, 180], hands: [128, 180] },
    { hip: [110, 140], torso: 68, arms: [140, 128], legs: [235, 235] }] },
  lungeStretch: { frames: [
    { hip: [100, 150], arms: [200, 150], footR: [130, 180], legL: [215, 265] },
    { hip: [107, 153], arms: [200, 150], footR: [130, 180], legL: [222, 266] }] },
  deepSquat: { frames: [{ hip: [86, 160], torso: 20, feet: [100, 180], hands: [112, 150] }] },

  // ---------- stretches
  seatedShoulder: { frames: [
    { hip: [110, 172], torso: 322, head: 340, hands: [66, 180], feet: [150, 180] },
    { hip: [118, 172], torso: 314, head: 335, hands: [66, 180], feet: [156, 180] }] },
  latBow: { props: [['rail', 140, 170, 118]], frames: [{ hip: [70, 125], torso: 85, head: 105, hands: [154, 118], feet: [78, 180] }] },
  chestWall: { props: [['wall', 74]], frames: [stand({ hip: [120, 122], feet: [120, 180], armR: [268, 268], torso: 3 })] },
  wristFwd: { frames: [quad(), quad({ hip: [84, 147], legs: [168, 268] })] },
  wristBack: { frames: [quad(), quad({ hip: [69, 149], torso: 78, legs: [162, 268] })] },
  cobra: { frames: [{ hip: [90, 174], torso: 40, head: 30, hands: [122, 180], legs: [268, 268], toes: 'point' }] },
  cat: { frames: [quad({ head: 55 }), quad({ head: 140, sx: 4, hip: [78, 145] })] },
  quadStand: { frames: [{ hip: [100, 122], footL: [100, 180], legR: [190, 350], handR: [90, 122], armL: [120, 110] }] },
  pikeFold: { frames: [{ hip: [80, 172], torso: 60, head: 75, hands: [136, 166], legs: [90, 90], toes: 0 }] },
  straddleSit: { frames: [{ view: 'front', hip: [100, 165], legs: [96, 96], arms: [168, 172], toes: 'point' }] },
  butterfly: { frames: [{ view: 'front', hip: [100, 160], legs: [110, 265], arms: [175, 185], toes: 'point' }] },
  fig4: { frames: [{ hip: [110, 174], torso: 272, head: 270, arms: [70, 60], legL: [20, 110], legR: [45, 330] }] },
  calfWall: { props: [['wall', 152]], frames: [{ hip: [100, 128], torso: 15, hands: [150, 92], footR: [82, 180], footL: [118, 180] }] },

  // ---------- push-ups
  pushup: { frames: [up(), down()] },
  pushupDeep: { props: [['rail', 110, 146, 166]], frames: [line([40, 172], 60, { hands: [127, 166], head: 70 }), line([40, 172], 87.7, { hands: [127, 166], head: 80 })] },
  pushupArcher: { floor: false, view: 'top', frames: [
    { view: 'front', hip: [100, 124], hands: [146, 84], as: 0.76, legs: [174, 180], toes: 'point' },
    { view: 'front', hip: [111, 124], cx: 100, hands: [146, 84], legs: [174, 180], toes: 'point' }] },
  pushupWall: { props: [['wall', 30]], frames: [
    line([36, 140], 87.7, { hands: [134, 180], head: 80, toes: 235 }),
    line([36, 140], 105, { hands: [134, 180], head: 80, toes: 235 })] },
  pushupPseudo: { frames: [line([40, 172], 74.5, { hands: [112, 180], head: 78 }), line([40, 172], 86, { hands: [112, 180], head: 80 })] },
  pushupLalanne: { frames: [line([36, 172], 88, { hands: [176, 180], head: 86 }), line([36, 172], 84, { hands: [176, 180], head: 80 })] },
  pushup1: { frames: [up({ hands: null, handR: [133, 180], armL: [250, 300] }), down({ hands: null, handR: [133, 180], armL: [250, 300] })] },
  pushup1leg: { frames: [
    up({ hands: null, handR: [133, 180], armL: [250, 300], legL: [264, 264] }),
    down({ hands: null, handR: [133, 180], armL: [250, 300], legL: [281, 281] })] },
  pushupSuperman: { loop: 'cycle', frames: [up(), down(), { hip: [98, 146], torso: 86, head: 80, arms: [86, 88], legs: [266, 268], toes: 'point' }] },
  pushupSpider: { frames: [up(), down({ legR: [118, 250] })] },
  pushupClap: { loop: 'cycle', frames: [up(), down(), line([40, 172], 64, { hands: [128, 152], head: 72 })] },
  pushupBackClap: { loop: 'cycle', frames: [up(), down(), line([40, 172], 61, { arms: [250, 292], head: 70 })] },

  // ---------- pull-ups
  row: { props: [['bar', 66, 112]], frames: [
    line([160, 176], 282, { hands: [66, 112], face: 1, toes: 20 }),
    line([160, 176], 296, { hands: [66, 112], face: 1, toes: 20, bendA: -1 })] },
  pullup: { props: [['bar', ...BAR]], frames: [hang(), top()] },
  pullupNeg: { key: 0, props: [['bar', ...BAR]], move: 2600, hold: 500, loop: 'cycle', frames: [top(), hang()] },
  pullupHold: { props: [['bar', ...BAR]], frames: [top()] },
  pullupWide: { props: [['hbar', 44, 156, 26]], frames: [
    { view: 'front', hip: [100, 106], hands: [136, 26], legs: [178, 180], toes: 'point' },
    { view: 'front', hip: [100, 80], hands: [136, 26], legs: [178, 180], toes: 'point' }] },
  pullupBehind: { props: [['bar', ...BAR]], frames: [hang(), { hip: [110, 84], torso: -3, head: 15, hands: BAR, bendA: -1, legs: [184, 178], toes: 'point' }] },
  pullupInline: { props: [['hbar', 44, 156, 26]], frames: [
    hang({ hands: null, handR: [108, 26], handL: [92, 26] }),
    { hip: [100, 82], hands: null, handR: [108, 26], handL: [92, 26], bendAL: -1, head: 10, legs: [180, 180], toes: 'point' }] },
  pullupRock: { loop: 'cycle', key: 1, props: [['hbar', 44, 156, 26]], frames: [
    { view: 'front', hip: [100, 106], hands: [136, 26], legs: [178, 180], toes: 'point' },
    { view: 'front', hip: [118, 82], cx: 100, hands: [136, 26], legs: [178, 180], toes: 'point' },
    { view: 'front', hip: [100, 106], hands: [136, 26], legs: [178, 180], toes: 'point' },
    { view: 'front', hip: [82, 82], cx: 100, hands: [136, 26], legs: [178, 180], toes: 'point' }] },
  pullupL: { props: [['bar', ...BAR]], frames: [hang({ legs: [90, 90] }), top({ legs: [90, 90] })] },
  pullupTowel: { props: [['bar', 100, 12], ['band', 100, 12, 100, 36]], frames: [
    { hip: [100, 118], hands: [100, 32], legs: [178, 190], toes: 'point' },
    { hip: [86, 92], torso: 5, hands: [100, 32], legs: [176, 190], toes: 'point' }] },
  pullupClap: { loop: 'cycle', key: 2, props: [['bar', ...BAR]], frames: [hang(), top(), { hip: [84, 78], torso: 5, hands: [97, 10], legs: [176, 184], toes: 'point' }, top()] },
  pullupTypewriter: { props: [['hbar', 44, 156, 26]], frames: [
    { view: 'front', hip: [118, 82], cx: 100, hands: [136, 26], legs: [178, 180], toes: 'point' },
    { view: 'front', hip: [82, 82], cx: 100, hands: [136, 26], legs: [178, 180], toes: 'point' }] },
  pullupWeighted: { props: [['bar', ...BAR], ['plate', 'hip', 0, 12]], frames: [hang(), top()] },
  pullupHigh: { props: [['bar', ...BAR]], frames: [hang(), { hip: [76, 64], torso: 18, head: 10, hands: BAR, legs: [170, 190], toes: 'point' }] },
  oap: { props: [['bar', ...BAR]], frames: [hang({ hands: null, handR: BAR, armL: [186, 182] }), top({ hands: null, handR: BAR, armL: [190, 150] })] },
  oapNeg: { key: 0, props: [['bar', ...BAR]], move: 2600, hold: 500, loop: 'cycle', frames: [top({ hands: null, handR: BAR, armL: [190, 150] }), hang({ hands: null, handR: BAR, armL: [186, 182] })] },
  oapHold: { props: [['bar', ...BAR]], frames: [top({ hands: null, handR: BAR, armL: [190, 150] })] },
  oapTowel: { props: [['bar', ...BAR], ['band', 100, 26, 100, 58]], frames: [
    hang({ hands: null, handR: BAR, handL: [100, 68] }),
    top({ hands: null, handR: BAR, handL: [98, 56] })] },

  // ---------- dips
  dipBox: { props: [['box', 68, 150, 38, 31]], frames: [
    { hip: [112, 148], torso: -8, hands: [104, 150], feet: [160, 180] },
    { hip: [114, 170], torso: -5, hands: [104, 150], feet: [160, 180] }] },
  dip: { props: DIPS, frames: [dipTop(), { hip: [92, 140], torso: 15, hands: [100, 118], legs: [185, 250] }] },
  dipBar: { props: [['bar', 100, 104]], frames: [
    { hip: [92, 101.6], torso: 8, hands: [100, 104], legs: [165, 170], toes: 'point' },
    { hip: [73, 120.4], torso: 30, hands: [100, 104], legs: [140, 150], toes: 'point' }] },

  // ---------- muscle-ups
  falseHang: { props: [['bar', ...BAR]], frames: [hang({ hip: [100, 109], sy: -3 })] },
  muTransition: { zoom: 0.78, floor: false, props: MU, frames: [
    { hip: [74, 116], torso: 22, hands: [100, 82], legs: [170, 190], toes: 'point' },
    { hip: [73, 98.4], torso: 30, hands: [100, 82], legs: [140, 150], toes: 'point' }] },
  muscleup: { zoom: 0.78, floor: false, loop: 'cycle', key: 3, hold: 200, props: MU, frames: [
    { hip: [100, 168], hands: [100, 82], legs: [182, 200], toes: 'point' },
    { hip: [74, 116], torso: 22, hands: [100, 82], legs: [170, 190], toes: 'point' },
    { hip: [73, 98.4], torso: 30, hands: [100, 82], legs: [140, 150], toes: 'point' },
    { hip: [92, 79.6], torso: 8, hands: [100, 82], legs: [165, 170], toes: 'point' },
    { hip: [73, 98.4], torso: 30, hands: [100, 82], legs: [140, 150], toes: 'point' }] },

  // ---------- handstands
  wallWalk: { props: [['wall', 33]], frames: [
    line([40, 172], 69, { hands: [131, 180], head: 75 }),
    { hip: [57, 107], torso: 135, hands: [95, 180], feet: [39, 62], bendL: 1 },
    { hip: [52, 94], torso: 180, hands: [50, 180], legs: [-4, -4] }] },
  hsKick: { props: [['wall', 146]], frames: [
    { hip: [90, 124], torso: 110, hands: [128, 180], footR: [84, 180], legL: [290, 290], toes: 'point' },
    hs({ hip: [130, 94], hands: [128, 180], legs: [8, 8] })] },
  hsWall: { props: [['wall', 114]], frames: [hs({ legs: [8, 8] }), hs()] },
  hsBail: { frames: [hs({ hip: [130, 94], hands: [128, 180] }), { hip: [90, 124], torso: 110, hands: [128, 180], footR: [84, 180], legL: [290, 290], toes: 'point' }] },
  handstand: { frames: [hs()] },
  hsPbars: { props: PB, frames: [hs({ hip: [100, 78], hands: [100, 164] })] },
  pikePushup: { frames: [
    { hip: [72, 122], torso: 115, head: 125, hands: [118, 180], feet: [46, 174] },
    { hip: [80, 130], torso: 132, head: 140, hands: [118, 180], feet: [46, 174] }] },
  hspuWall: { props: [['wall', 114]], frames: [hs({ legs: [8, 8] }), hs({ hip: [100, 116], legs: [6, 6] })] },
  hspu: { frames: [hs(), hs({ hip: [100, 116] })] },
  hspuPbarWall: { props: [...PB, ['wall', 114]], frames: [hs({ hip: [100, 78], hands: [100, 164], legs: [8, 8] }), hs({ hip: [100, 114], hands: [100, 164], legs: [6, 6] })] },
  hspuPbar: { props: PB, frames: [hs({ hip: [100, 78], hands: [100, 164] }), hs({ hip: [100, 114], hands: [100, 164] })] },
  pushup90: { frames: [hs(), { hip: [70, 158], torso: 90, head: 80, hands: [100, 180], legs: [-90, -90], toes: 'point' }] },

  // ---------- planche
  plancheLean: { frames: [line([40, 172], 73, { hands: [112, 180], head: 78 })] },
  frogStand: { frames: [{ hip: [82.5, 135.6], torso: 110, head: 80, hands: [110, 180], legs: [139, 250] }] },
  plancheTuck: { frames: [pl({ legs: [130, 250] })] },
  plancheAdvTuck: { frames: [pl({ legs: [180, 270] })] },
  plancheOneLeg: { frames: [pl({ legL: [130, 250] })] },
  plancheStraddle: { frames: [pl({ legR: [262, 262], legL: [279, 279] })] },
  planche: { frames: [pl()] },
  planchePushup: { frames: [pl(), pl({ hip: [70, 160] })] },

  // ---------- front lever
  flInverted: { props: [['bar', 100, 80]], frames: [{ hip: [100, 82], torso: 180, hands: [100, 80], legs: [0, 0], toes: 'point' }] },
  flTuck: { props: FL, frames: [fl({ legs: [330, 120] })] },
  flAdvTuck: { props: FL, frames: [fl({ legs: [0, 90] })] },
  flOneLeg: { props: FL, frames: [fl({ legL: [330, 120] })] },
  flStraddle: { props: FL, frames: [fl({ legR: [82, 82], legL: [99, 99] })] },
  frontlever: { props: FL, frames: [fl()] },
  flPullup: { props: FL, frames: [fl(), fl({ hip: [112, 62] })] },

  // ---------- back lever
  germanHang: { props: [['bar', 100, 36]], frames: [
    { hip: [102, 38], torso: 183, hands: [100, 36], legs: [230, 330] },
    { hip: [89, 110], torso: 40, head: 60, hands: [100, 36], legs: [185, 185], toes: 'point' }] },
  blTuck: { props: BL, frames: [bl({ legs: [120, 250] })] },
  blAdvTuck: { props: BL, frames: [bl({ legs: [180, 270] })] },
  blOneLeg: { props: BL, frames: [bl({ legL: [120, 250] })] },
  blStraddle: { props: BL, frames: [bl({ legR: [262, 262], legL: [279, 279] })] },
  backlever: { props: BL, frames: [bl()] },

  // ---------- half lever (L-sit)
  lsitTuck: { props: DIPS, frames: [dipTop({ torso: 0, legs: [60, 165] })] },
  lsitLow: { props: DIPS, frames: [dipTop({ torso: 0, legs: [130, 130], toes: 'point' })] },
  lsit: { props: DIPS, frames: [dipTop({ torso: 0, legs: [90, 90], toes: 'point' })] },
  lsitFloor: { frames: [{ hip: [100, 173], sy: -4, hands: [100, 180], legs: [90, 90], toes: 'point' }] },
  lsitExt: { props: DIPS, frames: [dipTop({ torso: 0, legs: [60, 165] }), dipTop({ torso: 0, legs: [90, 90] })] },
  lsitBike: { props: DIPS, hold: 150, frames: [dipTop({ torso: 0, legR: [90, 90], legL: [60, 165] }), dipTop({ torso: 0, legR: [60, 165], legL: [90, 90] })] },
  lsitSwim: { props: DIPS, hold: 60, move: 350, frames: [dipTop({ torso: 0, legR: [82, 82], legL: [98, 98], toes: 'point' }), dipTop({ torso: 0, legR: [98, 98], legL: [82, 82], toes: 'point' })] },

  // ---------- human flag
  flagVertical: { props: POLE, frames: [flag({ hip: [54, 88], torso: 180, legR: [0, 0], legL: [0, 0] })] },
  flagTuck: { props: POLE, frames: [flag({ legR: [215, 100], legL: [200, 95] })] },
  flagStraddle: { props: POLE, frames: [flag({ legR: [62, 62], legL: [118, 118] })] },
  flag: { props: POLE, frames: [flag()] },

  // ---------- floor core
  plank: { frames: [line([40, 172], 82, { arms: [180, 90] })] },
  sidePlank: { frames: [line([150, 174], 279.2, { armL: [180, 90], armR: [0, 0], head: 279 })] },
  crunch: { frames: [supine({ arms: [330, 200] }), supine({ torso: 290, head: 300, arms: [345, 215] })] },
  dish: { frames: [{ hip: [100, 174], torso: 285, head: 290, arms: [292, 292], legs: [78, 78], toes: 'point' }] },
  vup: { frames: [
    { hip: [100, 174], torso: 272, head: 272, arms: [272, 272], legs: [92, 92], toes: 'point' },
    { hip: [100, 174], torso: 315, head: 320, arms: [40, 40], legs: [45, 45], toes: 'point' }] },
  situp: { frames: [supine({ arms: [330, 200] }), supine({ torso: 340, head: 345, arms: [20, 250] })] },
  legRaiseLying: { frames: [
    { hip: [100, 174], torso: 272, head: 270, arms: [95, 95], legs: [0, 0], toes: 'point' },
    { hip: [100, 174], torso: 272, head: 270, arms: [95, 95], legs: [84, 84], toes: 'point' }] },
  plankExt: { frames: [line([28, 172], 84, { hands: [166, 180], head: 86 })] },
  arch: { frames: [{ hip: [100, 174], torso: 75, head: 62, arms: [70, 70], legs: [281, 281], toes: 'point' }] },
  rearSupport: { frames: [line([40, 176], 69, { face: -1, hands: [126, 180], head: 60 })] },
  candlestick: { props: DF, frames: [dfUp()] },
  dfTuck: { props: DF, frames: [dfUp({ legs: [150, 20] }), dfLow({ legs: [340, 100] })] },
  dfOneLeg: { props: DF, frames: [dfUp({ legL: [150, 20] }), dfLow({ legL: [340, 100] })] },
  dfNeg: { props: DF, move: 2600, hold: 500, loop: 'cycle', frames: [dfUp(), dfLow()] },
  dragonFlag: { props: DF, frames: [dfLow(), dfUp()] },
  dfSwim: { props: DF, hold: 60, move: 350, frames: [dfLow({ legR: [62, 62], legL: [78, 78] }), dfLow({ legR: [78, 78], legL: [62, 62] })] },

  // ---------- hanging core
  hangKnee: { props: [['bar', ...BAR]], frames: [hang(), hang({ legs: [75, 185] })] },
  hangLeg: { props: [['bar', ...BAR]], frames: [hang(), hang({ legs: [78, 78] })] },
  wipers: { props: [['hbar', 44, 156, 26]], frames: [
    { view: 'front', hip: [100, 108], hands: [124, 26], legR: [42, 42], legL: [42, 42], toes: 'point' },
    { view: 'front', hip: [100, 108], hands: [124, 26], legR: [-42, -42], legL: [-42, -42], toes: 'point' }] },

  // ---------- legs
  squat: { frames: [stand(), { hip: [84, 154], torso: 24, arms: [80, 78], feet: [100, 180] }] },
  lunge: { frames: [stand(), { hip: [100, 148], arms: [178, 176], footR: [128, 180], footL: [58, 176] }] },
  gluteBridge: { frames: [supine(), supine({ hip: [106, 150], torso: 238.4 })] },
  calfRaise: { frames: [stand({ toes: 90 }), stand({ hip: [100, 116], feet: [100, 174], toes: 150 })] },
  pistolAssist: { props: [['pole', 142]], frames: [
    { hip: [100, 122], footR: [100, 180], legL: [150, 165], hands: [139, 100] },
    { hip: [82, 158], torso: 28, footR: [100, 180], legL: [88, 90], hands: [139, 112] }] },
  pistolBox: { props: [['box', 54, 150, 38, 31]], frames: [
    { hip: [100, 122], footR: [100, 180], legL: [150, 165], arms: [150, 140] },
    { hip: [80, 146], torso: 15, footR: [100, 180], legL: [100, 120], arms: [80, 80] }] },
  pistol: { frames: [
    { hip: [100, 122], footR: [100, 180], legL: [150, 165], arms: [150, 140] },
    { hip: [82, 158], torso: 28, footR: [100, 180], legL: [88, 90], arms: [80, 80] }] },
  pistolWeighted: { props: [['plate', 'haR', 0, 0]], frames: [
    { hip: [100, 122], footR: [100, 180], legL: [150, 165], arms: [120, 30] },
    { hip: [82, 158], torso: 28, footR: [100, 180], legL: [88, 90], arms: [100, 40] }] },
  nordicPiked: { props: NORDIC, frames: [kneel(), kneel({ hip: [84.5, 150.9], torso: 80, head: 70, legs: [210, 270], arms: [150, 100] })] },
  nordicNeg: { props: NORDIC, move: 2600, hold: 500, loop: 'cycle', frames: [kneel(), kneel({ hip: [98.6, 171], torso: 80, head: 70, legs: [260, 270], arms: null, hands: [150, 180] })] },
  nordicAssist: { props: NORDIC, frames: [kneel(), kneel({ hip: [98.6, 171], torso: 80, head: 70, legs: [260, 270], arms: null, hands: [150, 180] })] },
  nordic: { props: NORDIC, frames: [kneel(), kneel({ hip: [95.1, 161.5], torso: 60, head: 55, legs: [240, 270], arms: [150, 60] })] },

  // ---------- conditioning
  starJump: { hold: 120, move: 420, frames: [
    { view: 'front', hip: [100, 122], arms: [172, 176], legs: [178, 180] },
    { view: 'front', hip: [100, 114], arms: [42, 40], legs: [152, 152] }] },
  jumpSquat: { hold: 150, move: 480, frames: [
    { hip: [84, 154], torso: 24, arms: [205, 195], feet: [100, 180] },
    { hip: [100, 102], arms: [5, 0], legs: [180, 180], toes: 'point' }] },
  jumpLunge: { hold: 150, move: 420, frames: [
    { hip: [100, 148], arms: [178, 176], footR: [128, 180], footL: [58, 176] },
    { hip: [100, 126], arms: [178, 176], legR: [172, 186], legL: [190, 200] },
    { hip: [100, 148], arms: [178, 176], footL: [128, 180], footR: [58, 176] }] },
  squatThrust: { hold: 150, move: 480, frames: [stand(), crouch(), up()] },
  burpee: { loop: 'cycle', hold: 120, move: 450, frames: [
    stand(), crouch(), up(), down(), up(), crouch(),
    { hip: [100, 104], arms: [5, 0], legs: [180, 180], toes: 'point' }] },
  sprint: { hold: 60, move: 300, frames: [
    { hip: [100, 120], torso: 12, legR: [95, 185], legL: [200, 232], armR: [225, 150], armL: [130, 40] },
    { hip: [100, 120], torso: 12, legL: [95, 185], legR: [200, 232], armL: [225, 150], armR: [130, 40] }] },
  bearCrawl: { hold: 100, move: 450, frames: [
    { hip: [72, 144], torso: 80, head: 70, handR: [124, 180], handL: [108, 180], footR: [56, 178], footL: [72, 178] },
    { hip: [78, 144], torso: 80, head: 70, handR: [114, 180], handL: [130, 180], footR: [78, 178], footL: [62, 178] }] },
};

// Hanging from a high bar: no floor line, or the figure looks like it is standing.
for (const f of Object.values(FIGS)) {
  if (f.floor === undefined && (f.props ?? []).some(([t, , b, c]) => (t === 'bar' && b < 100) || (t === 'hbar' && c < 100))) f.floor = false;
}
