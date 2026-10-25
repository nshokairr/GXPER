/**
 * E1–E4 · Screen entrance
 *
 * Every time a screen arrives, its blocks ([data-gxa-reveal]) rise and fade
 * in one after another, top to bottom — the website's scroll reveal, run
 * on screen entry instead of on scroll.
 *
 *   revealScreen(screen, { scroller, delay: 0.16, soft: true });
 *
 * Rules
 *   • Only blocks at or below `from` (px from the screen top) animate. Used
 *     by segment swaps so the header + tabs stay still.
 *   • Blocks visible in the first 852px get delay + i × 55ms, capped at
 *     delay + 600ms. Below-the-fold blocks reveal when scrolled to (6% early)
 *     with no delay, once.
 *   • Blocks taller than 260px wipe up from their bottom edge (E2).
 *   • soft:true uses 12px travel instead of 26px (E3) — for use while the
 *     screen is also sliding in, so the two motions don't fight. The soft
 *     flag is removed after 1.6s.
 *   • Reduced motion: nothing is hidden.
 *
 * Block position comes from data-y (px) if present, else offsetTop.
 */
import { REVEAL, SCREEN } from '../../tokens/app-motion-tokens.js';
import { prefersReducedMotion, $$ } from '../core/env.js';

export function revealScreen(screen, { scroller, from = 0, delay = 0, soft = false } = {}) {
  if (prefersReducedMotion()) return { destroy() {} };
  const sc = scroller || screen.querySelector('.gxa-scroller') || screen;
  const top = sc.scrollTop, bottom = top + SCREEN.height;
  const blocks = $$('[data-gxa-reveal]', screen);
  const y = (b) => (b.dataset.y !== undefined ? +b.dataset.y : b.offsetTop);
  const below = [];
  let i = 0;

  for (const b of blocks) {
    if (y(b) < from) continue;
    if (b.offsetHeight > REVEAL.bigBlockPx) b.classList.add('is-big');
    b.classList.add('is-pre');
    if (soft) b.classList.add('is-soft');
    if (y(b) < bottom) {
      const d = Math.min(delay * 1000 + i * REVEAL.staggerMs, delay * 1000 + REVEAL.staggerCapMs);
      b.style.setProperty('--gxa-delay', `${(d / 1000).toFixed(3)}s`);
      i++;
    } else below.push(b);
  }

  void screen.offsetWidth; // commit the hidden state before releasing it
  requestAnimationFrame(() => blocks.forEach((b) => { if (y(b) >= from && y(b) < bottom) b.classList.remove('is-pre'); }));

  let io = null;
  if (below.length) {
    io = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.style.setProperty('--gxa-delay', '0s');
      e.target.classList.remove('is-pre');
      io.unobserve(e.target);
    }), { root: sc, rootMargin: REVEAL.rootMargin });
    below.forEach((b) => io.observe(b));
  }
  const t = setTimeout(() => blocks.forEach((b) => b.classList.remove('is-soft')), REVEAL.softResetMs);

  return { destroy() { io && io.disconnect(); clearTimeout(t); } };
}

/** First delay (seconds) the prototype uses for each transition type. */
export const revealDelayFor = (kind) => (REVEAL.firstDelay[kind] ?? 0) / 1000;
