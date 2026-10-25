/**
 * GXPER App — Motion tokens (JavaScript mirror of app-motion-tokens.css)
 * Use these for Web Animations API calls, timers and thresholds.
 * Native ports: see "Porting to iOS / Android / Flutter / React Native" in app/README.md.
 * Keep in sync with app-motion-tokens.css.
 */

export const EASE = {
  out: 'cubic-bezier(.22, 1, .36, 1)',
  spring: 'cubic-bezier(.34, 1.56, .64, 1)',
  in: 'cubic-bezier(.5, 0, .75, 0)',
  inOut: 'ease-in-out',
  linear: 'linear',
  // control points, for libraries / native SDKs
  outPoints: [0.22, 1, 0.36, 1],
  springPoints: [0.34, 1.56, 0.64, 1],
  inPoints: [0.5, 0, 0.75, 0],
};

/** T · Screen transitions */
export const TRANSITION = {
  pushMs: 560,
  popMs: 520,
  parallaxUnder: -0.28,     // screen underneath moves 28% of its width
  dimUnder: 0.4,            // and dims to brightness(.4)
  edgeShadow: '-24px 0 50px rgba(0,0,0,.55)',
  tabOutMs: 220,
  tabOutScale: 0.985,
  tabInMs: 300,
  tabInDelayMs: 80,
  segmentOutMs: 140,
  wipeMs: 900,
  wipeSwapAtMs: 430,        // swap the screen while the gradient covers it
  sheetScreenInMs: 560,
  sheetScreenFadeMs: 280,
  sheetScreenOutMs: 340,
  sheetScreenUnfadeMs: 180,
  sheetOvershootPx: 20,     // sheet starts/ends 20px below the screen edge
};

/** E · Entrance / reveal */
export const REVEAL = {
  opacityMs: 750,
  moveMs: 850,
  maskMs: 950,
  risePx: 26,
  riseSoftPx: 12,
  riseBigPx: 18,
  bigBlockPx: 260,          // blocks taller than this use the mask wipe (E2)
  staggerMs: 55,
  staggerCapMs: 600,
  firstDelay: { load: 150, push: 160, swipe: 120, tab: 120, wipe: 200, segment: 0 },
  softResetMs: 1600,        // soft rise flag removed after this
  rootMargin: '0px 0px -6% 0px',
};

/** I · Interaction feedback */
export const FEEDBACK = {
  rippleMs: 750,
  rippleScale: 6,
  pressMs: 140,
  pressScale: 0.955,
  releaseMs: 500,
  shineMs: 700,
  shineMinWidth: 150,       // only buttons ≥150px wide and ≤56px tall get the sheen
  shineMaxHeight: 56,
  loadbarMs: 900,           // CTA holds this long before navigating
  navDelayMs: 120,          // every other tap waits this long so the ripple reads
  focusMs: 400,
  tickPopMs: 450,
  tickDrawMs: 400,
  tickDrawDelayMs: 120,
  pulseMs: 700,
  flashMs: 900,
  toastMs: 500,
  toastHoldMs: 2000,
};

/** S · Sheets & popups */
export const OVERLAY = {
  shadeInMs: 320,
  sheetInMs: 560,
  sheetOutMs: 320,
  sheetOutFastMs: 200,
  snapBackMs: 450,
  dismissPx: 70,
  modalInMs: 620,
  modalFrom: { y: 26, scale: 0.9 },
  modalTo: { y: 20, scale: 0.94 },
};

/** U · Signature moments */
export const SIGNATURE = {
  splashHoldMs: 2900,
  loaderMs: 2500,
  loaderDelayMs: 300,
  logoPopMs: 1000,
  logoGlowLoopMs: 3000,
  logoGlowDelayMs: 1100,
  kenBurnsMs: 2800,
  kenBurnsFrom: 1.07,
  sweepLoopMs: 6000,
  sweepDelayMs: 1000,
  breatheLoopMs: 4500,
  cornerLoopMs: 5000,
  confettiDelayMs: 700,
  confettiMs: 2300,
  confettiCount: 110,
  sparksCount: 34,
  spinInMs: 1000,
  pingLoopMs: 2600,
  pingSecondDelayMs: 1300,
};

/** Swipe & scroll */
export const GESTURE = {
  swipeLockPx: 8,
  swipeFollow: 0.35,
  swipeCommitPx: 50,
  dragScrollPx: 5,
};

export const PALETTE = {
  sparks: ['255,12,225', '255,238,6', '105,210,255', '255,238,6'],
  sparksAlert: ['255,244,0', '208,233,80', '255,238,6'],
  confetti: ['#eb008b', '#fff400', '#69d2ff', '#f7f6f5'],
};

export const SCREEN = { width: 393, height: 852 };
