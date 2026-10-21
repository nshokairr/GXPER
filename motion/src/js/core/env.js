/**
 * Environment helpers shared by every motion module.
 * - prefersReducedMotion(): live check of the OS "reduce motion" setting
 * - onReducedMotionChange(): react if the visitor toggles it while browsing
 * - isDesktopPointer(): true for mouse/trackpad (hover-capable) devices
 * - matchesBreakpoint(): read the shared breakpoints
 */
import { BREAKPOINTS } from '../../tokens/motion-tokens.js';

const rmQuery = typeof matchMedia === 'function' ? matchMedia('(prefers-reduced-motion: reduce)') : null;
const hoverQuery = typeof matchMedia === 'function' ? matchMedia('(hover: hover) and (pointer: fine)') : null;

export const prefersReducedMotion = () => !!(rmQuery && rmQuery.matches);

export function onReducedMotionChange(cb) {
  if (!rmQuery) return () => {};
  const fn = () => cb(rmQuery.matches);
  rmQuery.addEventListener('change', fn);
  return () => rmQuery.removeEventListener('change', fn);
}

export const isDesktopPointer = () => !!(hoverQuery && hoverQuery.matches);

/** matchesBreakpoint('mobile') -> true when viewport ≤ 760px */
export const matchesBreakpoint = (name) => innerWidth <= BREAKPOINTS[name];

export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

/** Restart a CSS animation on an element (remove → reflow → add). */
export function restartClass(el, cls) {
  el.classList.remove(cls);
  void el.offsetWidth; // force reflow so the browser sees a fresh start
  el.classList.add(cls);
}

/** Header height used for anchor offsets — reads the CSS token. */
export const headerHeight = () =>
  parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--gx-header-h')) || 82;
