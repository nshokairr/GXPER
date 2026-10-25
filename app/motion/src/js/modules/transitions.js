/**
 * T1–T8 · Screen transitions
 *
 * Every function takes real DOM screens (position:absolute; inset:0 inside
 * a .gxa-viewport), animates them, and resolves when motion is done.
 * The caller decides WHICH transition to use — see chooseTransition() for
 * the exact rules the prototype uses.
 *
 *   await push(viewport, nextScreen, currentScreen);   // T1 go deeper
 *   await pop(viewport, prevScreen, currentScreen);    // T2 back
 *   await tabSwitch(viewport, nextScreen, currentScreen);          // T3
 *   await segmentSwap(viewport, nextScreen, currentScreen, {fromY}); // T4
 *   await gradientWipe(wipeEl, () => swapScreens());   // T5
 *   await swipe(viewport, nextScreen, currentScreen, 'left');      // T6
 *   await sheetScreenIn(viewport, nextScreen, sheetParts, {travel}); // T7
 *   await sheetScreenOut(viewport, prevScreen, currentScreen, sheetParts, {travel}); // T8
 */
import { TRANSITION, EASE } from '../../tokens/app-motion-tokens.js';
import { animate, wait, restartClass, prefersReducedMotion, clearAnimations } from '../core/env.js';

const under = (pct) => `translateX(${pct * 100}%)`;

/** T1 · Push — new screen slides in from the right edge over the old one;
 *  the old one drifts 28% left and dims to 40%. 560ms ease-out. */
export async function push(viewport, incoming, outgoing) {
  viewport.appendChild(incoming);
  incoming.classList.add('is-edge');
  await Promise.all([
    animate(incoming, [{ transform: 'translateX(100%)' }, { transform: 'none' }], { duration: TRANSITION.pushMs, easing: EASE.out }),
    outgoing && animate(outgoing, [
      { transform: 'none', filter: 'brightness(1)' },
      { transform: under(TRANSITION.parallaxUnder), filter: `brightness(${TRANSITION.dimUnder})` },
    ], { duration: TRANSITION.pushMs, easing: EASE.out }),
  ]);
  incoming.classList.remove('is-edge');
  finish(incoming, outgoing);
}

/** T2 · Pop (back) — exact reverse: current screen slides off to the right,
 *  previous screen comes back from 28% left and un-dims. 520ms ease-out. */
export async function pop(viewport, incoming, outgoing) {
  viewport.insertBefore(incoming, outgoing);
  outgoing.classList.add('is-edge');
  await Promise.all([
    animate(incoming, [
      { transform: under(TRANSITION.parallaxUnder), filter: `brightness(${TRANSITION.dimUnder})` },
      { transform: 'none', filter: 'brightness(1)' },
    ], { duration: TRANSITION.popMs, easing: EASE.out }),
    animate(outgoing, [{ transform: 'none' }, { transform: 'translateX(100%)' }], { duration: TRANSITION.popMs, easing: EASE.out }),
  ]);
  finish(incoming, outgoing);
}

/** T3 · Tab bar switch — no slide (tabs are siblings, not deeper).
 *  Old: fade + shrink to 98.5% in 220ms. New: fade in 300ms, 80ms later. */
export async function tabSwitch(viewport, incoming, outgoing) {
  viewport.appendChild(incoming);
  await Promise.all([
    outgoing && animate(outgoing, [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: `scale(${TRANSITION.tabOutScale})` }], { duration: TRANSITION.tabOutMs, easing: 'ease-out' }),
    animate(incoming, [{ opacity: 0 }, { opacity: 1 }], { duration: TRANSITION.tabInMs, delay: TRANSITION.tabInDelayMs, easing: 'ease-out' }),
  ]);
  finish(incoming, outgoing);
}

/** T4 · In-screen segment (Details / Bracket / Matches / Sponsors …).
 *  Everything ABOVE the tapped tab row stays perfectly still. Blocks below
 *  `fromY` fade out in 140ms, the new screen is placed at the same scroll
 *  position, and its blocks below `fromY` reveal (E1, no initial delay).
 *  `blocksOf(screen)` must return the screen's [data-gxa-reveal] blocks with
 *  their top offset in data-y. */
export async function segmentSwap(viewport, incoming, outgoing, { fromY = 0, blocksOf, scrollerOf, revealFn } = {}) {
  const below = (s) => (blocksOf ? blocksOf(s) : []).filter((b) => +b.dataset.y >= fromY);
  await Promise.all(below(outgoing).map((b) => animate(b, [{ opacity: 1 }, { opacity: 0 }], { duration: TRANSITION.segmentOutMs, easing: 'ease-in' })));
  const keep = scrollerOf ? scrollerOf(outgoing).scrollTop : 0;
  viewport.appendChild(incoming);
  if (scrollerOf) scrollerOf(incoming).scrollTop = keep;
  if (revealFn) revealFn(incoming, { from: fromY, delay: 0 });
  finish(incoming, outgoing);
}

/** T5 · Gradient wipe (same as website G6). Used when moving between the
 *  logged-out world (splash, welcome, sign-up, login) and the app, after
 *  "Account deleted", and when jumping anywhere from the flows menu.
 *  Bar covers the screen by 45% (≈405ms); `swap()` runs at 430ms while it
 *  is fully covered; bar leaves right; total 900ms. */
export async function gradientWipe(wipeEl, swap) {
  if (!prefersReducedMotion()) restartClass(wipeEl, 'is-running');
  await wait(TRANSITION.wipeSwapAtMs);
  await swap();
  await wait(TRANSITION.wipeMs - TRANSITION.wipeSwapAtMs);
}

/** T6 · Swipe between sibling cards (profile game switch). Same motion as
 *  push (swiped left) or pop (swiped right). */
export function swipe(viewport, incoming, outgoing, direction) {
  return direction === 'left' ? push(viewport, incoming, outgoing) : pop(viewport, incoming, outgoing);
}

/** T7 · A screen whose bottom part is a sheet ("Are you sure?").
 *  The whole screen fades in over 280ms (its top half is a dimmed copy of
 *  the previous screen) while the sheet parts rise from below the edge.
 *  `travel` = screen height − sheet top + 20px. 560ms ease-out. */
export async function sheetScreenIn(viewport, incoming, sheetParts, { travel }) {
  viewport.appendChild(incoming);
  await Promise.all([
    animate(incoming, [{ opacity: 0 }, { opacity: 1 }], { duration: TRANSITION.sheetScreenFadeMs, easing: 'ease-out' }),
    ...sheetParts.map((p) => animate(p, [{ transform: `translateY(${travel}px)` }, { transform: 'none' }], { duration: TRANSITION.sheetScreenInMs, easing: EASE.out })),
  ]);
  finish(incoming);
}

/** T8 · Close that sheet screen: sheet accelerates down (340ms ease-in),
 *  then the dimmed screen fades away (180ms) revealing the one underneath. */
export async function sheetScreenOut(viewport, incoming, outgoing, sheetParts, { travel }) {
  viewport.insertBefore(incoming, outgoing);
  await Promise.all(sheetParts.map((p) => animate(p, [{ transform: 'none' }, { transform: `translateY(${travel}px)` }], { duration: TRANSITION.sheetScreenOutMs, easing: EASE.in })));
  await animate(outgoing, [{ opacity: 1 }, { opacity: 0 }], { duration: TRANSITION.sheetScreenUnfadeMs });
  finish(incoming, outgoing);
}

function finish(incoming, outgoing) {
  if (outgoing && outgoing.isConnected) outgoing.remove();
  clearAnimations(incoming);
}

/**
 * The exact decision table the prototype uses to pick a transition.
 * First matching rule wins.
 *
 *   ctx = {
 *     fromAuth, toAuth,     // is the screen part of the logged-out world?
 *     fromIsGoodbye,        // leaving "Account deleted"
 *     toIsSheetScreen,      // destination is a sheet-style screen (T7)
 *     tappedTabBar,         // tap landed on a bottom tab item
 *     tappedSegment,        // small tab (≤130×40) and both screens are
 *                           //   variants of the same page
 *     fromOverlaySameFamily,// chose an option in a sheet that swaps the page variant
 *     inBackStack,          // destination is already in the back history
 *     forced,               // 'wipe' | 'swipeL' | 'swipeR' (menu jump, auto-advance, swipe)
 *   }
 */
export function chooseTransition(ctx) {
  if (ctx.forced) return ctx.forced;
  if (ctx.fromAuth !== ctx.toAuth || ctx.fromIsGoodbye) return 'wipe';   // T5, history cleared
  if (ctx.toIsSheetScreen) return 'sheetin';                              // T7
  if (ctx.tappedTabBar) return 'tab';                                     // T3, history cleared
  if (ctx.tappedSegment) return 'segment';                                // T4
  if (ctx.fromOverlaySameFamily) return 'segment';                        // T4 (from top)
  if (ctx.inBackStack) return 'pop';                                      // T2
  return 'push';                                                          // T1
}
