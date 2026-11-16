// Timer sounds made with Web Audio, plus vibration where the device supports it.
import { S } from './store.js';

let ctx = null;

// Must run inside a tap at least once (browser rule for audio).
export function unlock() {
  try {
    if ('audioSession' in navigator) navigator.audioSession.type = S.profile.loud ? 'playback' : 'ambient';
    ctx ??= new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state !== 'running') ctx.resume();
    const o = ctx.createOscillator(), g = ctx.createGain();
    g.gain.value = 0; o.connect(g).connect(ctx.destination); o.start(); o.stop(ctx.currentTime + 0.02);
  } catch { /* no audio on this device */ }
}

function tone(freq, dur, at = 0, vol = 0.28) {
  if (!S.profile.sound || !ctx) return;
  if (ctx.state !== 'running') ctx.resume();
  const t0 = ctx.currentTime + at;
  const o = ctx.createOscillator(), g = ctx.createGain();
  o.type = 'sine'; o.frequency.value = freq;
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(vol, t0 + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  o.connect(g).connect(ctx.destination);
  o.start(t0); o.stop(t0 + dur + 0.03);
}
const buzz = p => { if (S.profile.sound) navigator.vibrate?.(p); };

export const tick = () => tone(880, 0.12, 0, 0.22);
export const go = () => { tone(1320, 0.38); buzz(180); };
export const done = () => { tone(988, 0.16); tone(1319, 0.34, 0.17); buzz([90, 60, 90]); };
export const sides = () => { tone(740, 0.12); tone(740, 0.12, 0.2); buzz([60, 80, 60]); };
export const mark = () => tone(1175, 0.22, 0, 0.24);
