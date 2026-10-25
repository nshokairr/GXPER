/**
 * G3b  Header hides on scroll down, comes back on scroll up
 *
 * Like a car window blind: pull the page down (read more) and the top bar
 * rolls up out of the way; nudge the page back up and it rolls straight
 * back down so the menu is always one small gesture away.
 *
 * Markup: nothing extra. The class is set on <html>:
 *   html.is-header-hidden .gx-header   → slides up out of view   (interactions.css)
 *   html.is-header-hidden .gx-progress → follows it to the top    (interactions.css)
 *
 * Rules (HEADER_AUTOHIDE tokens)
 *   - Always visible in the first 120px of the page.
 *   - Needs 6px of movement in one direction before it reacts (no flicker).
 *   - Always visible while the mobile menu is open.
 *   - Stays visible while the page glides to a section after a nav click
 *     (scrollToSection() calls holdHeader()), and when a header link gets
 *     keyboard focus.
 *   - Same on every screen size. With Reduce Motion it still hides, but
 *     instantly (reduced-motion.css removes the slide).
 */
import { HEADER_AUTOHIDE } from '../../tokens/motion-tokens.js';
import { $ } from '../core/env.js';
import { rafThrottle } from '../core/frame-loop.js';

const html = document.documentElement;
let holdUntil = 0;

/** Force the header visible for `ms` milliseconds (e.g. during an anchor scroll). */
export function holdHeader(ms = HEADER_AUTOHIDE.holdAfterJumpMs) {
  holdUntil = performance.now() + ms;
  html.classList.remove('is-header-hidden');
}

export function initHeaderAutoHide(root = document) {
  const header = $('.gx-header', root);
  if (!header) return null;
  const { minScroll, threshold } = HEADER_AUTOHIDE;
  let lastY = scrollY;

  const update = rafThrottle(() => {
    const y = Math.max(0, scrollY);
    const dy = y - lastY;
    const menuOpen = html.classList.contains('is-menu-open') || document.body.classList.contains('is-menu-open');
    if (y < minScroll || menuOpen || performance.now() < holdUntil) html.classList.remove('is-header-hidden');
    else if (dy > threshold) html.classList.add('is-header-hidden');      // scrolling down
    else if (dy < -threshold) html.classList.remove('is-header-hidden');  // scrolling up
    if (Math.abs(dy) > threshold || y < minScroll) lastY = y;
  });
  const onFocus = (e) => { if (header.contains(e.target)) holdHeader(400); };

  addEventListener('scroll', update, { passive: true });
  document.addEventListener('focusin', onFocus);
  update();

  return {
    destroy() {
      removeEventListener('scroll', update);
      document.removeEventListener('focusin', onFocus);
      html.classList.remove('is-header-hidden');
    },
  };
}
