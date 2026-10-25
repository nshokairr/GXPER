/**
 * GXPER — Motion tokens (JavaScript mirror of motion-tokens.css)
 * Use these whenever a duration or curve is needed in JS (timers, Web
 * Animations API, GSAP/Framer Motion if the team adopts one later).
 * Keep in sync with src/tokens/motion-tokens.css.
 */

export const EASE = {
  out: 'cubic-bezier(.22, 1, .36, 1)',
  spring: 'cubic-bezier(.34, 1.56, .64, 1)',
  inOut: 'ease-in-out',
  linear: 'linear',
  // Same curves as arrays, for libraries that take control points
  outPoints: [0.22, 1, 0.36, 1],
  springPoints: [0.34, 1.56, 0.64, 1],
};

export const DURATION = {
  instant: 200,
  fast: 300,
  quick: 350,
  base: 450,
  medium: 550,
  slow: 700,
  slower: 900,
  hero: 1000,
};

export const JOURNEY = {
  stepMs: 5200,        // each step stays on screen this long
  swapMs: 380,         // new title/description written at this moment
  descLagMs: 120,      // description returns this long after the title
  startProgress: 0.62, // first step starts 62% "filled" so the first change comes sooner
};

export const PAGE_TRANSITION = {
  totalMs: 900,        // full wipe in + out
  swapAtMs: 430,       // page content is swapped while the screen is covered
  anchorDelayMs: 60,   // after swapping, wait before scrolling to a section
};

export const REVEAL = {
  rootMargin: '0px 0px -6% 0px', // trigger slightly before the element is fully in view
  preHideBelow: 0.92,            // only hide elements that start below 92% of the viewport
};

export const PARALLAX = {
  heroContent: 0.22,   // hero text moves at 22% of scroll speed
  heroFadeEnd: 760,    // hero text fully faded after 760px of scroll
  heroBackground: 0.12,
  heroLimit: 1000,     // stop calculating after 1000px of scroll
  phoneSpeeds: [-0.06, 0.04, -0.03], // app phones, all screen sizes
};

export const BREAKPOINTS = {
  tablet: 1100,  // phones row becomes a swipe row, 2-column grids stack
  nav: 900,      // desktop nav hides, hamburger menu appears
  mobile: 760,   // mobile layouts for journey, capabilities, app showcase, footer
  small: 640,    // header CTA hidden, logo 26px
};

export const HEADER_HEIGHT = { desktop: 82, mobile: 72 };

export const HEADER_AUTOHIDE = {
  minScroll: 120,        // always visible in the first 120px of the page
  threshold: 6,          // px of movement in one direction before it reacts
  holdAfterJumpMs: 1400, // stays visible while the page glides to a section
  // slide: 450ms ease-out (--gx-dur-base / --gx-ease-out), see interactions.css
};

/** Read a CSS token at runtime, e.g. cssToken('--gx-dur-slow') -> "700ms" */
export const cssToken = (name, el = document.documentElement) =>
  getComputedStyle(el).getPropertyValue(name).trim();
