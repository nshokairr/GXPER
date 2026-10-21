/**
 * H7  Hero sparks — small glowing particles drifting upward
 *
 * Markup:  <canvas class="gx-hero__sparks" data-gx-sparks></canvas>
 *
 * Spec
 *   count      1 particle per 22px of width, max 70 (≈ 17 on a phone)
 *   size       radius 0.4–2px
 *   speed      rises 0.12–0.47px per frame, sways sideways ±0.25px
 *   twinkle    opacity pulses between 55% and 100% of its base (0.12–0.62)
 *   colours    brand magenta, yellow (×2 weight), cyan
 *   pixel ratio capped at 2 for performance
 *   paused     when the canvas is off-screen or the tab is hidden
 *   disabled   with reduced motion
 */
import { prefersReducedMotion } from '../core/env.js';
import { subscribe } from '../core/frame-loop.js';

const COLOURS = ['255,12,225', '255,238,6', '105,210,255', '255,238,6'];

export function initSparks(canvas) {
  if (!canvas || prefersReducedMotion()) return { destroy() {} };
  const ctx = canvas.getContext('2d');
  const dpr = Math.min(2, devicePixelRatio || 1);
  let w = 0, h = 0, pts = [], visible = true;

  const size = () => {
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  const seed = () => {
    pts = Array.from({ length: Math.round(Math.min(70, w / 22)) }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.6 + 0.4,
      s: Math.random() * 0.35 + 0.12,
      a: Math.random() * 0.5 + 0.12,
      p: Math.random() * Math.PI * 2,
      c: COLOURS[(Math.random() * COLOURS.length) | 0],
    }));
  };
  const onResize = () => { size(); seed(); };
  size(); seed();
  addEventListener('resize', onResize);

  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
  io.observe(canvas);

  const off = subscribe((t) => {
    if (!visible || document.hidden) return;
    ctx.clearRect(0, 0, w, h);
    for (const p of pts) {
      p.y -= p.s;
      p.x += Math.sin(t / 1600 + p.p) * 0.25;
      if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
      const twinkle = 0.55 + 0.45 * Math.sin(t / 700 + p.p * 3);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.c},${(p.a * twinkle).toFixed(3)})`;
      ctx.fill();
    }
  });

  return { destroy() { off(); io.disconnect(); removeEventListener('resize', onResize); } };
}
