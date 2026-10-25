/**
 * U · Signature moments (JS parts). The CSS-only ones (logo pop, loader,
 * corner glows, Ken Burns, sweep, glow, spin-in, ping) are classes in
 * styles/components/signature.css.
 *
 *   const s = sparks(hostEl, { height: 402 });              U7 drifting sparks
 *   const s = sparks(hostEl, { height: 470, alert: true }); U7 yellow-only (alert screens)
 *   confetti(viewport);                                     U9 one burst
 *   autoAdvance(() => goTo('welcome'));                     U4 splash → welcome
 */
import { SIGNATURE, PALETTE, SCREEN } from '../../tokens/app-motion-tokens.js';
import { el, prefersReducedMotion } from '../core/env.js';

/** U7 · 34 tiny dots drift upward, sway sideways and twinkle. They wrap to
 *  the bottom when they leave the top. Stops automatically when the canvas
 *  is removed from the page. */
export function sparks(host, { top = 0, height = SCREEN.height, width = SCREEN.width, alert = false, count = SIGNATURE.sparksCount } = {}) {
  if (prefersReducedMotion()) return { destroy() {} };
  const cv = el('canvas', 'gxa-canvas', { top: `${top}px`, height: `${height}px` });
  host.appendChild(cv);
  const ctx = cv.getContext('2d'), dpr = Math.min(2, devicePixelRatio || 1);
  cv.width = width * dpr; cv.height = height * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const cols = alert ? PALETTE.sparksAlert : PALETTE.sparks;
  const pts = Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    r: Math.random() * 1.5 + 0.4,        // radius 0.4–1.9px
    s: Math.random() * 0.35 + 0.12,      // rise 0.12–0.47px per frame
    a: Math.random() * 0.5 + 0.15,       // max opacity 0.15–0.65
    p: Math.random() * 6.28,             // phase
    c: cols[Math.floor(Math.random() * cols.length)],
  }));
  let raf;
  (function loop(t) {
    if (!cv.isConnected) return;
    raf = requestAnimationFrame(loop);
    ctx.clearRect(0, 0, width, height);
    for (const p of pts) {
      p.y -= p.s;
      p.x += Math.sin(t / 1600 + p.p) * 0.25;           // sway, 1.6s period-ish
      if (p.y < -6) { p.y = height + 6; p.x = Math.random() * width; }
      const tw = 0.55 + 0.45 * Math.sin(t / 700 + p.p * 3); // twinkle
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283);
      ctx.fillStyle = `rgba(${p.c},${(p.a * tw).toFixed(3)})`; ctx.fill();
    }
  })(0);
  return { destroy() { cancelAnimationFrame(raf); cv.remove(); } };
}

/** U9 · Confetti: 110 rectangles burst from (196, 300), fall with gravity,
 *  spin and fade out over 2.2s; canvas removed at 2.3s. */
export function confetti(viewport, { x = 196, y = 300, width = SCREEN.width, height = SCREEN.height } = {}) {
  if (prefersReducedMotion()) return;
  const cv = el('canvas', '', { position: 'absolute', inset: '0', zIndex: 70, pointerEvents: 'none' });
  viewport.appendChild(cv);
  const dpr = Math.min(2, devicePixelRatio || 1);
  cv.width = width * dpr; cv.height = height * dpr;
  const ctx = cv.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const cols = PALETTE.confetti;
  const ps = Array.from({ length: SIGNATURE.confettiCount }, () => {
    const a = Math.random() * 6.283, v = Math.random() * 8 + 3;
    return { x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 4, s: Math.random() * 6 + 3, r: Math.random() * 6.28, vr: (Math.random() - 0.5) * 0.4, c: cols[Math.floor(Math.random() * cols.length)] };
  });
  const t0 = performance.now();
  (function frame(t) {
    ctx.clearRect(0, 0, width, height);
    const age = (t - t0) / 1000;
    for (const p of ps) {
      p.vy += 0.22;          // gravity
      p.vx *= 0.985;         // air drag
      p.x += p.vx; p.y += p.vy; p.r += p.vr;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r);
      ctx.globalAlpha = Math.max(0, 1 - age / 2.2);
      ctx.fillStyle = p.c; ctx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2);
      ctx.restore();
    }
    if (age < SIGNATURE.confettiMs / 1000) requestAnimationFrame(frame); else cv.remove();
  })(t0);
}

/** U4 · Splash holds 2.9s, then goes to Welcome with the gradient wipe. */
export function autoAdvance(go, ms = SIGNATURE.splashHoldMs) {
  const t = setTimeout(go, ms);
  return { destroy() { clearTimeout(t); } };
}

/** U11 helper: place the two radar rings centred on (cx, cy). */
export function pingRings(host, cx, cy, size = 96) {
  const css = { left: `${cx - size / 2}px`, top: `${cy - size / 2}px`, width: `${size}px`, height: `${size}px` };
  host.append(el('i', 'gxa-ping', css), el('i', 'gxa-ping is-second', css));
}
