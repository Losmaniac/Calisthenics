// Stick-figure engine: a 2D articulated figure drawn as SVG.
// Angles are in degrees, clockwise, 0 = up, 90 = right, 180 = down, 270 = left.
// A pose gives the hip position, the torso direction and, per limb, either
// forward angles ([upper, lower]) or a target point the hand/foot must reach.
// Planted hands and feet stay planted while the body moves between keyframes.

export const DIM = { torso: 44, sh: 42, neck: 4, head: 9.5, upper: 22, fore: 22, thigh: 29, shin: 29, foot: 9 };

const R = Math.PI / 180;
const dir = a => [Math.sin(a * R), -Math.cos(a * R)];
const ang = (dx, dy) => Math.atan2(dx, -dy) / R;
const add = (p, a, len) => { const d = dir(a); return [p[0] + d[0] * len, p[1] + d[1] * len]; };
const mix = (a, b, k) => a + (b - a) * k;
const mixP = (a, b, k) => [mix(a[0], b[0], k), mix(a[1], b[1], k)];
const f1 = n => Math.round(n * 10) / 10;

// Two-bone reach: returns [joint, end]. `bend` picks the side the joint folds to.
function reach(from, to, l1, l2, bend) {
  const dx = to[0] - from[0], dy = to[1] - from[1];
  const d = Math.hypot(dx, dy);
  const dd = Math.min(Math.max(d, 0.5), l1 + l2 - 0.01);
  const a = Math.acos(Math.min(1, Math.max(-1, (l1 * l1 + dd * dd - l2 * l2) / (2 * l1 * dd)))) / R;
  const mid = add(from, ang(dx, dy) + bend * a, l1);
  const end = d > l1 + l2 ? add(mid, ang(to[0] - mid[0], to[1] - mid[1]), l2) : to;
  return [mid, end];
}

// Turn an authored pose into a canonical one.
function norm(p) {
  const front = p.view === 'front';
  const face = p.face ?? 1;
  const cx = p.cx ?? p.hip[0];
  const mx = pt => [2 * cx - pt[0], pt[1]];
  const pick = (fkS, toS, fkG, toG, mirror) =>
    toS ? { ik: toS } : fkS ? { fk: fkS } :
    toG ? { ik: mirror ? mx(toG) : toG } :
    fkG ? { fk: mirror ? [-fkG[0], -fkG[1]] : fkG } : null;
  const aR = pick(p.armR, p.handR, p.arms, p.hands, false) ?? { fk: [180, 180] };
  const aL = pick(p.armL, p.handL, p.arms, p.hands, front) ?? { fk: front ? [-180, -180] : [180, 180] };
  const lR = pick(p.legR, p.footR, p.legs, p.feet, false) ?? { fk: [180, 180] };
  const lL = pick(p.legL, p.footL, p.legs, p.feet, front) ?? { fk: front ? [-180, -180] : [180, 180] };
  const bA = p.bendA ?? face, bL = p.bendL ?? -face;
  aR.bend = p.bendAR ?? bA; aL.bend = p.bendAL ?? (front ? -bA : bA);
  lR.bend = p.bendLR ?? bL; lL.bend = p.bendLL ?? (front ? -bL : bL);
  return {
    view: front ? 'front' : 'side', face, hip: p.hip, torso: p.torso ?? 0, head: p.head ?? p.torso ?? 0,
    aR, aL, lR, lL, toes: p.toes ?? 'flat', sw: p.sw ?? (front ? 13 : 0), hw: p.hw ?? (front ? 7 : 0),
    sx: p.sx ?? 0, sy: p.sy ?? 0, as: p.as ?? 1,
  };
}

// Work out every joint position of a canonical pose.
function solve(n) {
  const neck = add(n.hip, n.torso, DIM.torso);
  const sh = add(add(n.hip, n.torso, DIM.sh + n.sy), n.torso + 90 * n.face, n.sx);
  const J = { hip: n.hip, neck, head: add(neck, n.head, DIM.neck + DIM.head) };
  const side = n.torso + 90;
  J.shR = add(sh, side, n.sw); J.shL = add(sh, side, -n.sw);
  J.hpR = add(n.hip, side, n.hw); J.hpL = add(n.hip, side, -n.hw);
  const limb = (from, l, a, b) => {
    if (l.ik) return reach(from, l.ik, a, b, l.bend);
    const mid = add(from, l.fk[0], a);
    return [mid, add(mid, l.fk[1], b)];
  };
  [J.elR, J.haR] = limb(J.shR, n.aR, DIM.upper * n.as, DIM.fore * n.as);
  [J.elL, J.haL] = limb(J.shL, n.aL, DIM.upper * n.as, DIM.fore * n.as);
  [J.knR, J.anR] = limb(J.hpR, n.lR, DIM.thigh, DIM.shin);
  [J.knL, J.anL] = limb(J.hpL, n.lL, DIM.thigh, DIM.shin);
  const toe = (kn, an, sign) => {
    const shin = ang(an[0] - kn[0], an[1] - kn[1]);
    const a = typeof n.toes === 'number' ? n.toes
      : n.toes === 'point' ? shin
      : n.view === 'front' ? shin - 70 * sign
      : shin - 90 * n.face;
    return add(an, a, DIM.foot);
  };
  J.toR = toe(J.knR, J.anR, 1); J.toL = toe(J.knL, J.anL, -1);
  return J;
}

function prep(p) {
  const n = norm(p);
  n.J = solve(n);
  return n;
}

function tween(A, B, k) {
  const o = {
    view: A.view, face: k < 0.5 ? A.face : B.face, toes: k < 0.5 ? A.toes : B.toes,
    hip: mixP(A.hip, B.hip, k), torso: mix(A.torso, B.torso, k), head: mix(A.head, B.head, k),
    sw: mix(A.sw, B.sw, k), hw: mix(A.hw, B.hw, k), sx: mix(A.sx, B.sx, k), sy: mix(A.sy, B.sy, k), as: mix(A.as, B.as, k),
  };
  if (typeof A.toes === 'number' && typeof B.toes === 'number') o.toes = mix(A.toes, B.toes, k);
  for (const [key, end] of [['aR', 'haR'], ['aL', 'haL'], ['lR', 'anR'], ['lL', 'anL']]) {
    const a = A[key], b = B[key];
    o[key] = a.fk && b.fk
      ? { fk: [mix(a.fk[0], b.fk[0], k), mix(a.fk[1], b.fk[1], k)], bend: a.bend }
      : { ik: mixP(A.J[end], B.J[end], k), bend: a.ik ? a.bend : b.bend };
  }
  o.J = solve(o);
  return o;
}

const pts = (...p) => p.map(q => f1(q[0]) + ',' + f1(q[1])).join(' ');

function drawBody(n, cls = '') {
  const J = n.J, front = n.view === 'front';
  const far = front ? '' : ' opacity=".4"';
  const pl = (p, w, extra = '') => `<polyline points="${p}" stroke-width="${w}"${extra}/>`;
  let s = `<g class="fig-body ${cls}" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">`;
  s += pl(pts(J.shL, J.elL, J.haL), 6, far);
  s += pl(pts(J.hpL, J.knL, J.anL, J.toL), 6.5, far);
  if (front) s += pl(pts(J.shL, J.shR), 7) + pl(pts(J.hpL, J.hpR), 7);
  s += pl(pts(J.hip, J.neck), 7.5);
  s += pl(pts(J.hpR, J.knR, J.anR, J.toR), 6.5);
  s += pl(pts(J.shR, J.elR, J.haR), 6);
  s += `<circle cx="${f1(J.head[0])}" cy="${f1(J.head[1])}" r="${DIM.head}" fill="currentColor" stroke="none"/>`;
  if (!front) { // a small nose shows which way the figure faces
    const a = n.head + 90 * n.face;
    s += pl(pts(add(J.head, a, DIM.head - 1), add(J.head, a, DIM.head + 2.5)), 3.5);
  }
  return s + '</g>';
}

const FLOOR = 180;
const OVER = new Set(['bar', 'plate']);
function drawProps(props = [], floor = true, over = false, J = null) {
  let s = '<g class="fig-prop" fill="none" stroke="var(--prop, #8a96a3)" stroke-linecap="round" stroke-width="4">';
  if (floor && !over) s += `<line x1="8" y1="${FLOOR + 3.5}" x2="192" y2="${FLOOR + 3.5}" stroke-width="2.5" opacity=".7"/>`;
  for (const [t, a, b, c, d] of props) {
    if (OVER.has(t) !== over) continue;
    if (t === 'bar') s += `<circle cx="${a}" cy="${b}" r="5.4" fill="var(--prop, #8a96a3)" stroke="var(--fig-bg, #fff)" stroke-width="1.6"/>`;
    else if (t === 'plate') { const q = J[a]; s += `<rect x="${f1(q[0] + (b ?? 0) - 7)}" y="${f1(q[1] + (c ?? 0) - 7)}" width="14" height="14" rx="3" fill="var(--prop, #8a96a3)" stroke="var(--fig-bg, #fff)" stroke-width="1.6"/>`; }
    else if (t === 'hbar') s += `<path d="M${a} ${c}H${b}M${a + 4} ${c}V${FLOOR + 2}M${b - 4} ${c}V${FLOOR + 2}"/>`;
    else if (t === 'rail') s += `<path d="M${a} ${c}H${b}M${a + 5} ${c}V${FLOOR + 2}M${b - 5} ${c}V${FLOOR + 2}"/>`;
    else if (t === 'wall') s += `<line x1="${a}" y1="14" x2="${a}" y2="${FLOOR + 2}" stroke-width="5"/>`;
    else if (t === 'pole') s += `<line x1="${a}" y1="10" x2="${a}" y2="${FLOOR + 2}" stroke-width="6"/>`;
    else if (t === 'box') s += `<rect x="${a}" y="${b}" width="${c}" height="${d}" rx="2"/>`;
    else if (t === 'roller') s += `<circle cx="${a}" cy="${b}" r="7.5"/>`;
    else if (t === 'band') s += `<path d="M${a} ${b}L${c} ${d}" stroke-width="2.5" stroke-dasharray="1 5"/>`;
  }
  return s + '</g>';
}

const cache = new WeakMap();
const frames = fig => {
  if (!cache.has(fig)) cache.set(fig, fig.frames.map(prep));
  return cache.get(fig);
};
const ease = k => k * k * (3 - 2 * k);

// The pose of a figure at time `ms` (keyframes play forward, then back).
function poseAt(fig, ms) {
  const F = frames(fig);
  if (F.length === 1) return F[0];
  const move = fig.move ?? 850, hold = fig.hold ?? 380;
  const order = fig.loop === 'cycle' ? [...F.keys(), 0] : [...F.keys(), ...[...F.keys()].reverse().slice(1)];
  const steps = order.length - 1, per = move + hold;
  const t = Math.max(0, ms) % (steps * per), i = Math.floor(t / per), into = t - i * per;
  return into < hold ? F[order[i]] : tween(F[order[i]], F[order[i + 1]], ease((into - hold) / move));
}

// The area a figure uses over all its keyframes, props included (cached).
const boxes = new WeakMap();
function bounds(fig) {
  if (boxes.has(fig)) return boxes.get(fig);
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  const add = (x, y, r = 0) => { x0 = Math.min(x0, x - r); y0 = Math.min(y0, y - r); x1 = Math.max(x1, x + r); y1 = Math.max(y1, y + r); };
  for (const n of frames(fig)) for (const [k, p] of Object.entries(n.J)) add(p[0], p[1], k === 'head' ? DIM.head + 1 : 4);
  for (const [t, a, b, c, d] of fig.props ?? []) {
    if (t === 'bar') add(a, b, 7);
    else if (t === 'hbar' || t === 'rail') { add(a, c, 3); add(b, c, 3); }
    else if (t === 'box') { add(a, b); add(a + c, b + d); }
    else if (t === 'roller') add(a, b, 9);
    else if (t === 'band') { add(a, b); add(c, d); }
  }
  for (const [t, a] of fig.props ?? []) if (t === 'wall' || t === 'pole') { x0 = Math.min(x0, a - 5); x1 = Math.max(x1, a + 5); }
  if (fig.floor !== false && y1 > 160) y1 = Math.max(y1, FLOOR + 8);
  const r = [x0, y0, x1, y1];
  boxes.set(fig, r);
  return r;
}
// A view box around the figure. fit > 0: shaped like the figure, at least `fit` units wide;
// fit < 0: square, at least -fit units. The full scene is 200 units.
function fitBox(fig, fit) {
  const [x0, y0, x1, y1] = bounds(fig);
  const w = x1 - x0 + 14, h = y1 - y0 + 14;
  let W, H;
  if (fit < 0) W = H = Math.min(200, Math.max(-fit, w, h));
  else {
    W = Math.max(fit, w); H = Math.max(h, W * 0.5);
    if (H > W * 1.3) W = H / 1.3;
    W = Math.min(W, 200); H = Math.min(H, 200);
  }
  const cx = (x0 + x1) / 2;
  const cy = y1 >= FLOOR ? y1 + 6 - H / 2 : (y0 + y1) / 2; // figures on the floor keep it near the bottom edge
  return `${f1(cx - W / 2)} ${f1(cy - H / 2)} ${f1(W)} ${f1(H)}`;
}

const wrap = (inner, fig, attrs = '', fit = 0) => {
  const z = !fit && fig.zoom ? `translate(100 100) scale(${fig.zoom}) translate(-100 -100)` : '';
  const t = (fig.flip ? 'translate(200 0) scale(-1 1) ' : '') + z;
  const vb = fit ? fitBox(fig, fit) : '0 0 200 200';
  return `<svg class="fig" viewBox="${vb}" ${attrs} aria-hidden="true">` + (t ? `<g transform="${t}">${inner}</g>` : inner) + '</svg>';
};
const scene = (fig, n, ghost = '') =>
  drawProps(fig.props, fig.floor !== false) + ghost + drawBody(n) + drawProps(fig.props, false, true, n.J);

// Moving figure at a point in time.
export function figureAt(fig, ms, attrs, fit = 0) {
  return wrap(scene(fig, poseAt(fig, ms)), fig, attrs, fit);
}

// Still picture: the start position as a ghost, the end position solid.
export function figureStill(fig, { ghost = true, frame, fit = 0 } = {}) {
  const F = frames(fig);
  const end = F[frame ?? fig.key ?? F.length - 1];
  const g = ghost && F.length > 1 ? `<g opacity=".28">${drawBody(F[0])}</g>` : '';
  return wrap(scene(fig, end, g), fig, '', fit);
}

export function frameCount(fig) { return fig.frames.length; }
export function figureFrame(fig, i) {
  return wrap(scene(fig, frames(fig)[i]), fig);
}

// Authoring check: planted hands/feet that the limb cannot reach, per keyframe.
export function reachProblems(fig) {
  const out = [];
  frames(fig).forEach((n, i) => {
    for (const [key, from, end, len] of [['aR', 'shR', 'haR', (DIM.upper + DIM.fore) * n.as], ['aL', 'shL', 'haL', (DIM.upper + DIM.fore) * n.as], ['lR', 'hpR', 'anR', DIM.thigh + DIM.shin], ['lL', 'hpL', 'anL', DIM.thigh + DIM.shin]]) {
      if (!n[key].ik) continue;
      const gap = Math.hypot(n[key].ik[0] - n.J[from][0], n[key].ik[1] - n.J[from][1]) - len;
      if (gap > 1.5) out.push(`#${i} ${key} short by ${gap.toFixed(1)}`);
    }
  });
  return out;
}
