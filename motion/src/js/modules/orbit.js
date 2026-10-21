/**
 * O1–O8  Player identity orbit
 *
 * Markup
 *   <div class="gx-orbit-box" data-gx-orbit-box>
 *     <div class="gx-orbit" data-gx-orbit> … layers … </div>
 *   </div>
 *
 * • Scales the fixed 670×650 drawing to the container width (never above 1).
 * • Labels slide in when 30% of the orbit is visible (once).
 * • Pauses all loops while off-screen (saves battery on phones).
 */
import { prefersReducedMotion, $ } from '../core/env.js';

export function initOrbit(box) {
  if (!box) return null;
  const orbit = $('[data-gx-orbit]', box);
  const BASE_W = 670;

  const scale = () => orbit.style.setProperty('--gx-orbit-scale', Math.min(1, box.clientWidth / BASE_W).toFixed(4));
  const ro = new ResizeObserver(scale);
  ro.observe(box);
  scale();

  let revealIo = null;
  if (!prefersReducedMotion() && box.getBoundingClientRect().top > innerHeight * 0.8) {
    orbit.classList.add('is-pending');
    revealIo = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      orbit.classList.remove('is-pending');
      revealIo.disconnect();
    }, { threshold: 0.3 });
    revealIo.observe(box);
  }

  const visIo = new IntersectionObserver(([e]) => orbit.classList.toggle('is-offscreen', !e.isIntersecting));
  visIo.observe(box);

  return { destroy() { ro.disconnect(); visIo.disconnect(); revealIo?.disconnect(); } };
}
