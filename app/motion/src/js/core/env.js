/**
 * Shared helpers for every app motion module.
 */
const rmQuery = typeof matchMedia === 'function' ? matchMedia('(prefers-reduced-motion: reduce)') : null;

/** Live check of the OS "Reduce motion" setting. */
export const prefersReducedMotion = () => !!(rmQuery && rmQuery.matches);

export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

/** Promise-based timeout that collapses to 0ms under reduced motion. */
export const wait = (ms) => new Promise((r) => setTimeout(r, prefersReducedMotion() ? 0 : ms));

/** Create an element with classes and inline styles in one line. */
export function el(tag, cls, css) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (css) Object.assign(e.style, css);
  return e;
}

/**
 * Run a Web Animation and resolve when it ends (or is cancelled).
 * Duration collapses to 1ms under reduced motion so callers never wait.
 */
export function animate(node, keyframes, options) {
  const o = Object.assign({ fill: 'both' }, options);
  if (prefersReducedMotion()) { o.duration = 1; o.delay = 0; }
  return node.animate(keyframes, o).finished.catch(() => {});
}

/** Restart a CSS animation (remove → reflow → add). */
export function restartClass(node, cls) {
  node.classList.remove(cls);
  void node.offsetWidth;
  node.classList.add(cls);
}

/** Drop every finished WAAPI animation so inline styles are clean again. */
export function clearAnimations(node) {
  node.getAnimations({ subtree: true }).forEach((a) => { if (a.constructor === Animation) a.cancel(); });
  node.style.transform = '';
  node.style.opacity = '';
  node.style.filter = '';
}
