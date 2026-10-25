/**
 * G6  Page transition ("gradient wipe") + G11 anchor scrolling
 *
 * Router-agnostic. Works with Next.js, Nuxt, React Router, Astro, plain
 * multi-page sites… You call it, it covers the screen, calls your swap
 * function at the right moment, then uncovers.
 *
 * Markup (once, at the end of <body>):
 *   <div class="gx-wipe" data-gx-wipe aria-hidden="true">
 *     <img class="gx-wipe__logo" src="/brand/gxper-v-black.svg" alt="">
 *   </div>
 *
 * Usage
 *   import { pageTransition, scrollToSection } from './page-transition.js';
 *   await pageTransition(() => router.push('/contact'));      // SPA
 *   scrollToSection('request');                               // same page
 *
 * Timing (PAGE_TRANSITION tokens)
 *   0ms     wipe starts
 *   430ms   swap() is called — the screen is fully covered
 *           window scrolls to top instantly (hidden behind the wipe)
 *   900ms   wipe finished, promise resolves
 *
 * Rules
 *   • Only for moves to ANOTHER page. Links to a section of the same page
 *     use scrollToSection() (smooth scroll, offset by the sticky header).
 *   • Reduced motion: no wipe; swap() runs immediately.
 *   • After swap(), restart the inner-page hero entrance by calling
 *     replayEntrance(newPageRoot) — or simply let the new page mount.
 */
import { PAGE_TRANSITION } from '../../tokens/motion-tokens.js';
import { prefersReducedMotion, headerHeight, $, $$, restartClass } from '../core/env.js';
import { holdHeader } from './header.js';

let running = false;

export function pageTransition(swap) {
  const wipe = $('[data-gx-wipe]');
  if (!wipe || prefersReducedMotion()) { swap?.(); scrollTo(0, 0); return Promise.resolve(); }
  if (running) return Promise.resolve();
  running = true;
  restartClass(wipe, 'is-running');
  return new Promise((resolve) => {
    setTimeout(async () => {
      await swap?.();
      const html = document.documentElement;
      const prev = html.style.scrollBehavior;
      html.style.scrollBehavior = 'auto';
      scrollTo(0, 0);
      html.style.scrollBehavior = prev;
    }, PAGE_TRANSITION.swapAtMs);
    setTimeout(() => { running = false; wipe.classList.remove('is-running'); resolve(); }, PAGE_TRANSITION.totalMs);
  });
}

/** Smooth-scroll to an element id, leaving room for the sticky header (which stays visible on the way). */
export function scrollToSection(id) {
  const behavior = prefersReducedMotion() ? 'auto' : 'smooth';
  if (!id) { scrollTo({ top: 0, behavior }); return; }
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + scrollY - headerHeight();
  holdHeader();   // keep the header visible while the page glides there (G3b)
  scrollTo({ top: Math.max(0, top), behavior });
}

/** Re-run CSS entrance animations inside a freshly shown page. */
export function replayEntrance(root) {
  $$('.gx-page-hero__eyebrow, .gx-page-hero__line > span, .gx-page-hero__intro', root).forEach((el) => {
    el.style.animation = 'none';
    void el.offsetWidth;
    el.style.animation = '';
  });
}
