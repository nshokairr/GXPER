/**
 * GXPER Motion — entry point
 *
 *   import { initMotion } from './js/index.js';
 *   const motion = initMotion();         // whole document
 *   // SPA page change:
 *   motion.destroy(); motion = initMotion(newPageRoot);
 *
 * Every module is also exported on its own so a framework component can
 * use only what it needs (e.g. initJourney inside a React useEffect).
 */
import { initReveal } from './modules/reveal.js';
import { initScrollEffects } from './modules/scroll-effects.js';
import { initSparks } from './modules/sparks.js';
import { initJourney } from './modules/journey.js';
import { initOrbit } from './modules/orbit.js';
import { initSpotlights } from './modules/pointer-spotlight.js';
import { initMenu } from './modules/ui.js';
import { $ } from './core/env.js';

export { initReveal, initScrollEffects, initSparks, initJourney, initOrbit, initSpotlights, initMenu };
export { pageTransition, scrollToSection, replayEntrance } from './modules/page-transition.js';
export { toast, openOverlay, closeOverlay, flagFieldError } from './modules/ui.js';
export { initMapPin } from './modules/map-pin.js';
export { confetti } from './modules/confetti.js';
export * as tokens from '../tokens/motion-tokens.js';

export function initMotion(root = document) {
  const parts = [
    initReveal(root),
    initScrollEffects(root),
    initSparks($('[data-gx-sparks]', root)),
    initJourney($('[data-gx-journey]', root)),
    initOrbit($('[data-gx-orbit-box]', root)),
    initSpotlights(root),
    initMenu(root),
  ].filter(Boolean);
  return { destroy: () => parts.forEach((p) => p.destroy?.()) };
}
