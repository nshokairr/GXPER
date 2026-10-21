/**
 * V9  Success confetti burst
 *
 * Markup: <canvas class="gx-confetti" data-gx-confetti hidden></canvas>
 * Usage:  confetti();   // after the success overlay opens
 *
 * Spec
 *   pieces     120 (80 on screens ≤ 760px)
 *   origin     centre of the screen, 120px above middle (behind the badge)
 *   launch     random direction, speed 4–13px/frame, extra 4px upward kick
 *   physics    gravity +0.22px/frame², air drag ×0.985, spin ±0.2 rad/frame
 *   shape      rectangles 3–9px wide, half as tall
 *   colours    magenta #eb008b, yellow #fff400, cyan #69d2ff, white #f7f6f5
 *   life       fades linearly to 0 over 2.2s, canvas hides at 2.3s
 *   disabled   with reduced motion
 */
import { prefersReducedMotion, $ } from '../core/env.js';

const COLOURS = ['#eb008b', '#fff400', '#69d2ff', '#f7f6f5'];

export function confetti() {
  const cv = $('[data-gx-confetti]');
  if (!cv || prefersReducedMotion()) return;
  cv.hidden = false;
  const ctx = cv.getContext('2d');
  const dpr = Math.min(2, devicePixelRatio || 1);
  const W = innerWidth, H = innerHeight;
  cv.width = W * dpr; cv.height = H * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const cx = W / 2, cy = H / 2 - 120;
  const n = W <= 760 ? 80 : 120;
  const parts = Array.from({ length: n }, () => {
    const a = Math.random() * Math.PI * 2, v = Math.random() * 9 + 4;
    return { x: cx, y: cy, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 4, s: Math.random() * 6 + 3, r: Math.random() * 6.28, vr: (Math.random() - 0.5) * 0.4, c: COLOURS[(Math.random() * 4) | 0] };
  });
  const t0 = performance.now();
  (function frame(t) {
    const age = (t - t0) / 1000;
    ctx.clearRect(0, 0, W, H);
    const life = Math.max(0, 1 - age / 2.2);
    for (const p of parts) {
      p.vy += 0.22; p.vx *= 0.985; p.x += p.vx; p.y += p.vy; p.r += p.vr;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.globalAlpha = life; ctx.fillStyle = p.c;
      ctx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); ctx.restore();
    }
    if (age < 2.3) requestAnimationFrame(frame); else { ctx.clearRect(0, 0, W, H); cv.hidden = true; }
  })(t0);
}
