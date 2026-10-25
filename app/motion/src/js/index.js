/**
 * GXPER App Motion — entry point
 *
 *   import * as GXA from './js/index.js';
 *   // or, with the built bundle: <script src="dist/gxper-app-motion.js"></script> → window.GXAppMotion
 *
 * Nothing runs on import. Call what you need.
 */
export { push, pop, tabSwitch, segmentSwap, gradientWipe, swipe, sheetScreenIn, sheetScreenOut, chooseTransition } from './modules/transitions.js';
export { revealScreen, revealDelayFor } from './modules/reveal.js';
export { initPress, ripple, shine, runCta, afterTap } from './modules/press.js';
export { focusField, toggleTick, pulse, flashTargets, toast } from './modules/feedback.js';
export { openSheet, openModal } from './modules/overlays.js';
export { initSwipe, initDragScroll, initScrollProgress } from './modules/gestures.js';
export { sparks, confetti, autoAdvance, pingRings } from './modules/signature.js';
export { prefersReducedMotion } from './core/env.js';
export * as tokens from '../tokens/app-motion-tokens.js';
