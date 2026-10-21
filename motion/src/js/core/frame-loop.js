/**
 * One shared requestAnimationFrame loop for all continuous animations
 * (journey progress, sparks). Modules subscribe; the loop only runs while
 * at least one subscriber exists and the tab is visible.
 *
 *   const off = subscribe((now, dt) => { ... });  // dt is capped at 64ms
 *   off();                                        // unsubscribe
 */
const subs = new Set();
let rafId = 0;
let last = 0;

function tick(now) {
  const dt = Math.min(64, now - (last || now));
  last = now;
  subs.forEach((fn) => fn(now, dt));
  rafId = subs.size ? requestAnimationFrame(tick) : 0;
}

export function subscribe(fn) {
  subs.add(fn);
  if (!rafId) { last = 0; rafId = requestAnimationFrame(tick); }
  return () => {
    subs.delete(fn);
    if (!subs.size && rafId) { cancelAnimationFrame(rafId); rafId = 0; }
  };
}

/** Throttle scroll/resize work to one call per frame. */
export function rafThrottle(fn) {
  let queued = false;
  return (...args) => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { queued = false; fn(...args); });
  };
}
