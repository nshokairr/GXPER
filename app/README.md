# GXPER App — Motion & Prototype Handoff

Every transition, animation and movement in the GXPER mobile app prototype, with
the exact timings, curves and code — plus the clickable prototype itself and the
tools used to build it from Figma.

The app uses **the same motion language as the GXPER website** (see
[`../motion/`](../motion/)): the same two signature curves, the same brand
gradient wipe, the same "rise and fade in" reveals, the same button shine,
ripple, toast and confetti. If you know the website motion, you already know
this one.

> **Source of truth**
> - Layout, type, colour, spacing → **Figma** (`Scooring App (Copy)` file, page `design`)
> - Motion (timing, curves, choreography) → **this folder**
> - Live reference → `prototype/index.html` (or the shared prototype link)

---

## Contents

1. [Quick start](#1-quick-start)
2. [What is in this folder](#2-what-is-in-this-folder)
3. [The motion language in one page](#3-the-motion-language-in-one-page)
4. [Motion tokens (every number)](#4-motion-tokens-every-number)
5. [Animation catalogue (every movement, with IDs)](#5-animation-catalogue)
6. [How a transition is chosen](#6-how-a-transition-is-chosen)
7. [Millisecond timelines](#7-millisecond-timelines)
8. [Using the motion package (API)](#8-using-the-motion-package-api)
9. [Porting to the real app (iOS, Android, Flutter, React Native)](#9-porting-to-the-real-app)
10. [How the prototype works](#10-how-the-prototype-works)
11. [Rebuilding the prototype from Figma](#11-rebuilding-the-prototype-from-figma)
12. [Accessibility & performance](#12-accessibility--performance)
13. [Known limitations](#13-known-limitations)
14. [Screen index (all 114 screens)](#14-screen-index)

---

## 1. Quick start

**Just look at it**

Open `prototype/index.html` in Chrome, Safari or Edge (double-click works; a
local server is better for fonts: `cd app/prototype && python3 -m http.server`).

| Do this | To see |
|---|---|
| Tap anything inside the phone | The real flow, with every animation |
| Tap an empty spot | All tappable areas flash yellow (I9) |
| Left panel → pick any screen | Jump straight there (gradient wipe, T5) |
| Phone width (≤ 900px) → tap the black pill at the top | The same flow menu as a bottom drawer |
| `Esc` / `←` / `Backspace` | Back |
| `H` | Keep tap areas highlighted |
| `R` | Restart from the splash |
| `index.html#1:79288` | Deep-link to a screen by its Figma node ID |

**See each animation on its own**

```bash
cd app/motion
npm install
npm run build        # builds dist/ (plain + minified)
npm run demo         # → http://localhost:5174/demo/
```
The demo uses simple stand-in screens (no Figma images) and a button for every
catalogue ID, so a developer can watch one animation at a time.

---

## 2. What is in this folder

```
app/
├── README.md                     ← you are here (everything is documented here)
│
├── motion/                       ← THE EXTRACTED ANIMATION CODE (reusable, framework-agnostic)
│   ├── package.json              build + demo scripts (esbuild only, no runtime dependencies)
│   ├── src/
│   │   ├── tokens/
│   │   │   ├── app-motion-tokens.css   every duration, curve, distance, threshold (CSS vars, --gxa-*)
│   │   │   └── app-motion-tokens.js    the same values for JavaScript
│   │   ├── styles/
│   │   │   ├── gxper-app-motion.css    entry file — imports everything in order
│   │   │   ├── keyframes.css           every @keyframes (gxa-*)
│   │   │   ├── reduced-motion.css      accessibility override (loads last)
│   │   │   └── components/
│   │   │       ├── transitions.css     T  screen layers, gradient wipe, scroll progress line
│   │   │       ├── reveal.css          E  rise/fade/mask entrance
│   │   │       ├── press.css           I1–I5  squeeze, spring, sheen, loading bar, ripple
│   │   │       ├── feedback.css        I6–I11 field focus, tick, pulse, flash, toast
│   │   │       ├── overlays.css        S  sheets, popups, shade
│   │   │       └── signature.css       U  splash, glows, Ken Burns, sweep, spin-in, ping
│   │   └── js/
│   │       ├── index.js                entry — every function exported
│   │       ├── core/env.js             reduced motion, animate(), wait(), helpers
│   │       └── modules/
│   │           ├── transitions.js      T1–T8 + chooseTransition() (the decision table)
│   │           ├── reveal.js           E1–E4
│   │           ├── press.js            I1–I5
│   │           ├── feedback.js         I6–I11
│   │           ├── overlays.js         S1–S6
│   │           ├── gestures.js         T6 swipe, mouse drag-scroll, E5 progress line
│   │           └── signature.js        U7 sparks, U9 confetti, U4 auto-advance, U11 rings
│   ├── dist/                     built files: gxper-app-motion(.min).js / .css  (global: window.GXAppMotion)
│   └── demo/                     index.html + demo.js + demo.css — every animation, isolated
│
├── prototype/                    ← THE CLICKABLE PROTOTYPE (open index.html)
│   ├── index.html                single file: page + styles + screen data + script
│   ├── screens/                  114 screen images (.webp) captured from Figma
│   └── assets/                   GXPER logo (panel) + black V mark (wipe)
│
├── source/                       ← the prototype's own source, un-bundled
│   ├── template.html             page shell (panel, phone, drawer)
│   ├── app.css                   all prototype styles + keyframes
│   ├── app.js                    all prototype behaviour (navigation, motion, gestures)
│   └── screens.json              per-screen data: size, fixed bars, reveal bands, hotspots
│
└── tools/                        ← how the prototype was produced
    ├── figma-data/data1.json, data2.json   frame sizes, fixed layers and every prototype link, read from Figma
    ├── slice_screens.py          captures → screens/*.webp + reveal bands + hotspots → screens.json
    ├── assemble.py               source/* → prototype/index.html
    └── smoke-test.js             Playwright walk-through that screenshots key moments
```

**Two versions of the same code — which one do I use?**

| You are… | Use |
|---|---|
| A developer building the real app (web view, PWA, or as a spec for native) | `motion/` — clean modules with `data-gxa-*` hooks and `gxa-*` classes, documented API, tokens |
| Reviewing / changing the prototype itself | `source/` → `tools/assemble.py` → `prototype/` |

Every value in `motion/` is identical to `source/`. The prototype source is
written around screen *images*; the `motion/` package is the same motion
rewritten for real UI elements.

---

## 3. The motion language in one page

Think of the app like a deck of cards on a table:

- **Going deeper** (open a tournament, a profile, a setting) = a new card slides
  in from the right on top of the old one. The old card slides a little left
  and gets darker, like it's going into shadow. **Back** does exactly the reverse.
- **Switching tabs** (Home / Tournaments / Leaderboard / Profile / More) = cards
  side by side, not on top of each other — so no slide, just a quick cross-fade.
- **Switching a tab inside a page** (Details / Bracket / Matches / Sponsors) =
  only the content below the tabs changes. The header and tab row never move.
- **Changing world** (logged out ↔ logged in, account deleted, jumping anywhere
  from the menu) = the brand gradient sweeps across the screen with the GXPER
  mark — exactly the website's page wipe.
- **Every screen arrives in layers**: its blocks rise 26px and fade in one after
  another from top to bottom (55ms apart), like the website's scroll reveal.
- **Every tap answers**: the button squeezes, a lime ring ripples out from your
  finger, wide buttons get a sheen, main buttons show a loading bar.
- **Sheets come from the bottom, popups from the middle**, over a dark blurred
  backdrop. Sheets can be dragged down to close.
- **Big moments get a signature effect**: logo pop + glow on the splash,
  confetti on "Thank you", a spinning badge on "Account deleted", a breathing
  yellow glow and sparks on the alert screens.

### The curves

| Name | Value | Feels like | Used for |
|---|---|---|---|
| **out** (signature) | `cubic-bezier(.22, 1, .36, 1)` | Fast start, long soft landing | Anything that enters or moves: slides, reveals, sheets, wipe, sheen, loading bar |
| **spring** | `cubic-bezier(.34, 1.56, .64, 1)` | Overshoots ~6%, settles | Feedback: button release, popup, toast, tick, sheet snap-back, logo pop |
| **in** (strong) | `cubic-bezier(.5, 0, .75, 0)` | Slow start, accelerates away | Only things leaving: sheet dismiss, sheet-screen close |
| ease-out / ease-in | CSS keywords | — | Short fades (tab switch, segment fade-out, popup close) |
| ease-in-out | CSS keyword | Never starts or stops | Ambient loops (glows breathing, logo glow) |

### Rules

1. **One transition at a time.** While a screen transition runs, taps are
   ignored (`lock`). No queueing, no half-finished screens.
2. **Ripple first, then move.** Every tap waits **120ms** before navigating so
   the ripple is visible; a primary CTA waits **900ms** (loading bar).
3. **Overlays close before navigating** (fast close, 200ms).
4. **Nothing on the first screen flashes**: reveals hide elements only for the
   instant before they animate, and never under *Reduce motion*.
5. **Leaving is faster than arriving** (sheet in 560ms / out 320ms; pop 520ms vs push 560ms).

---

## 4. Motion tokens (every number)

Source: `motion/src/tokens/app-motion-tokens.css` (CSS `--gxa-*`) and
`app-motion-tokens.js` (JS). Prototype equivalents are in `source/app.js` / `app.css`.

### Screen transitions (T)

| Token | Value | Meaning |
|---|---|---|
| `--gxa-dur-push` / `TRANSITION.pushMs` | 560ms | T1 slide-in |
| `--gxa-dur-pop` / `popMs` | 520ms | T2 slide-out (back) |
| `--gxa-parallax-under` / `parallaxUnder` | −28% | Screen underneath moves 28% of its width |
| `--gxa-dim-under` / `dimUnder` | 0.4 | …and goes to `brightness(.4)` |
| `edgeShadow` | `-24px 0 50px rgba(0,0,0,.55)` | Shadow on the moving screen's left edge |
| `--gxa-dur-tab-out` / `tabOutMs` | 220ms | T3 old tab fades, shrinks to `scale(.985)` |
| `--gxa-dur-tab-in` / `tabInMs` | 300ms | T3 new tab fades in |
| `--gxa-delay-tab-in` / `tabInDelayMs` | 80ms | …starting this late |
| `--gxa-dur-segment-out` / `segmentOutMs` | 140ms | T4 content below the tabs fades out |
| `--gxa-dur-wipe` / `wipeMs` | 900ms | T5 total |
| `--gxa-wipe-swap` / `wipeSwapAtMs` | 430ms | T5 moment the screen is swapped |
| `--gxa-dur-sheet-screen-in` | 560ms | T7 sheet rises |
| `--gxa-dur-sheet-screen-fade` | 280ms | T7 whole screen fades in |
| `--gxa-dur-sheet-screen-out` | 340ms | T8 sheet drops (curve **in**) |
| `--gxa-dur-sheet-screen-unfade` | 180ms | T8 then the screen fades away |
| `sheetOvershootPx` | 20px | T7/T8 sheet travel = screen height − sheet top + 20 |

### Entrance (E)

| Token | Value | Meaning |
|---|---|---|
| `--gxa-reveal-opacity` | 750ms | Fade |
| `--gxa-reveal-move` | 850ms | Rise |
| `--gxa-reveal-mask` | 950ms | Mask wipe (big blocks) |
| `--gxa-reveal-rise` | 26px | Normal travel |
| `--gxa-reveal-rise-soft` | 12px | Travel while the screen is also sliding (push, swipe) |
| `--gxa-reveal-rise-big` | 18px | Travel for blocks taller than 260px |
| `REVEAL.bigBlockPx` | 260px | Height above which a block uses the mask wipe |
| `--gxa-reveal-stagger` | 55ms | Delay step between blocks |
| `--gxa-reveal-stagger-cap` | 600ms | No block waits longer than first delay + 600ms |
| `REVEAL.firstDelay` | load 150 · push 160 · swipe 120 · tab 120 · wipe 200 · segment 0 (ms) | When the first block starts, per transition |
| `REVEAL.softResetMs` | 1600ms | Soft flag removed after this |
| `REVEAL.rootMargin` | `0px 0px -6% 0px` | Below-the-fold blocks reveal 6% before fully in view |

### Interaction feedback (I)

| Token | Value | Meaning |
|---|---|---|
| `--gxa-dur-ripple` | 750ms | Ring grows to `scale(6)` and fades (`ease-out`) |
| `--gxa-dur-press` / `--gxa-press-scale` | 140ms / 0.955 | Squeeze on finger down |
| `--gxa-dur-release` | 500ms (spring) | Back to 100% on finger up |
| `--gxa-dur-shine` | 700ms | Sheen, `translateX(-120% → 120%)` |
| `FEEDBACK.shineMinWidth / shineMaxHeight` | 150px / 56px | Which buttons get the sheen automatically |
| `--gxa-dur-loadbar` | 900ms | CTA bar fills 0 → 84% width |
| `--gxa-nav-delay` | 120ms | Wait after a tap before acting |
| `--gxa-dur-focus` | 400ms | Field ring settles from `scale(1.03)` |
| `--gxa-dur-caret` | 1s, `steps(1)` | Caret blink |
| `--gxa-dur-tick-pop` | 450ms (spring) | Checkbox pops from `scale(0)` |
| `--gxa-dur-tick-draw` / delay | 400ms / 120ms | Check mark draws (`stroke-dashoffset 24 → 0`) |
| `--gxa-dur-pulse` | 700ms | Ring to `scale(1.06)` and fades |
| `--gxa-dur-flash` | 900ms | Tap areas flash: solid for 55% of the time, then fade |
| `--gxa-dur-toast` / `--gxa-toast-hold` | 500ms (spring) / 2000ms | Toast up, held 2s |

### Sheets & popups (S)

| Token | Value | Meaning |
|---|---|---|
| `--gxa-dur-shade-in` | 320ms | Backdrop `rgba(5,4,4,.62)` + 2px blur fades in |
| `--gxa-dur-sheet-in` | 560ms | Sheet `translateY(100% → 0)`, curve **out** |
| `--gxa-dur-sheet-out` | 320ms | Sheet down, curve **in** (same for popup close) |
| `--gxa-dur-sheet-out-fast` | 200ms | When closing because the user navigated |
| `--gxa-dismiss-distance` | 70px | Drag further than this to close |
| `--gxa-dur-snap-back` | 450ms (spring) | Released before 70px |
| `--gxa-dur-modal-in` | 620ms (spring) | Popup from `translateY(26px) scale(.9)`, opacity 0 |
| `--gxa-modal-to-y / -to-scale` | 20px / .94 | Popup close target (`ease-in`) |

### Signature moments (U)

| Token | Value | Meaning |
|---|---|---|
| `--gxa-dur-logo-pop` | 1s (spring) | Logo from `scale(.72)`, blur 6px, opacity 0 |
| `--gxa-loop-logo-glow` | 3s loop, starts at 1.1s | Magenta + yellow drop-shadow glow |
| `--gxa-dur-loader` | 2.5s, starts 0.3s | Splash bar fills (`scaleX 0 → 1`, curve out) |
| `--gxa-splash-hold` | 2900ms | Splash → Welcome (wipe) |
| `--gxa-loop-corner` | 5s | Corner glows breathe (second one offset −2s) |
| `--gxa-dur-kenburns` | 2.8s | Hero settles from `scale(1.07)`, origin 50% 60% |
| `--gxa-loop-sweep` | 6s, starts 1s | Diagonal yellow light, `background-position 120% → -60%` over 60% of the loop |
| `--gxa-loop-breathe` | 4.5s | Top glow `scale(1 → 1.08)`, opacity `1 → .6` |
| `--gxa-confetti-delay` / `--gxa-dur-confetti` | 700ms / 2.3s | Confetti on "Thank you" |
| `--gxa-dur-spin-in` | 1s | Badge from `rotate(-120deg) scale(.6)`, opacity 0 |
| `--gxa-loop-ping` | 2.6s; ring 1 at 1s, ring 2 at 2.3s | Rings `scale(1 → 2.1)`, opacity `.8 → 0` |
| `SIGNATURE.sparksCount` | 34 | Sparks per screen |
| `SIGNATURE.confettiCount` | 110 | Confetti pieces |

### Gestures

| Token | Value | Meaning |
|---|---|---|
| `--gxa-swipe-lock` | 8px | Horizontal movement needed before the card follows (and more X than Y) |
| `--gxa-swipe-follow` | 0.35 | Card moves 35% of the finger distance |
| `--gxa-swipe-commit` | 50px | Release past this → switch game |
| `--gxa-dragscroll-threshold` | 5px | Mouse drag becomes a scroll and cancels the click |

### Brand values used by motion

| Token | Value |
|---|---|
| `--gxa-yellow` | `#fff400` (ripple, focus, tick, pulse, flash, toast) |
| `--gxa-magenta` | `#eb008b` |
| `--gxa-cyan` | `#69d2ff` |
| `--gxa-ink` | `#0f0d0c` (loading bar, toast text) |
| `--gxa-surface` | `#141110` (screen background) |
| `--gxa-gradient` | `linear-gradient(90deg, #ff0ce1 0%, #ff945d 25%, #ffee06 45%, #d0e950 60%, #8ddac0 80%, #69d2ff 100%)` (wipe, progress line, loader) |
| Screen | 393 × 852 (Figma frame size) |

---

## 5. Animation catalogue

Every movement in the app. Quote the **ID** in tickets ("T4 feels slow").
*Prototype* = where it lives in `source/`. *Package* = where it lives in `motion/`.

### T · Screen transitions

| ID | What you see | When | Exact motion | Prototype | Package |
|---|---|---|---|---|---|
| **T1** | **Push.** New screen slides in from the right with a shadow on its left edge; the old screen slides 28% left and darkens | Tapping into something deeper (card → details, Join → form, row → profile, menu row → page) | New: `translateX(100% → 0)`. Old: `translateX(0 → -28%)` + `brightness(1 → .4)`. Both 560ms **out**. New screen's blocks reveal (E3, soft, first at 160ms) | `app.js show()` kind `push` | `transitions.js push()` |
| **T2** | **Back.** Exact reverse: the current screen slides off to the right, the previous one comes back from the left and brightens | Back arrow, Cancel, `Esc`, or tapping a link to a screen already in your history | Old: `translateX(0 → 100%)`. New: `translateX(-28% → 0)` + `brightness(.4 → 1)`. 520ms **out**. No reveal (the screen was already seen) | `show()` kind `pop` | `pop()` |
| **T3** | **Tab bar switch.** Quick cross-fade, no slide | Tapping an item in the bottom tab bar (Home, Tournaments, Leaderboard, Profile, More; referee: Home, More) | Old: `opacity 1 → 0` + `scale(1 → .985)`, 220ms ease-out. New: `opacity 0 → 1`, 300ms ease-out, 80ms delay. New screen reveals (E1, first at 120ms). **History is cleared** (tabs are roots) | `show()` kind `tab`; detection `isTabTap()` | `tabSwitch()` |
| **T4** | **In-page segment.** Header, cover and tab row stay perfectly still; only the content below the tabs fades out and the new content rises in | Details / Bracket / Matches / Sponsors / Standings / Leaderboard tabs inside a tournament; game filter chips; options chosen inside a sheet that swap the page's variant (e.g. sport filter) | Blocks below the tapped tab: `opacity 1 → 0`, 140ms ease-in. New screen placed at the **same scroll position**, blocks below the tab reveal (E1, no initial delay). Back history unchanged | `show()` kind `seg`; detection `isSeg()` | `segmentSwap()` |
| **T5** | **Gradient wipe** (website G6). Brand gradient grows across from the left, the black GXPER V-mark appears in the middle, the screen is swapped underneath, the gradient leaves to the right | Logged-out ↔ logged-in (splash, welcome, sign up, login, referee login ↔ app); after "Account deleted"; splash auto-advance; jumping to any screen from the flows menu; Restart | Bar `scaleX 0 → 1` (origin left) by 45%, hold to 55%, `scaleX 1 → 0` (origin right) by 100%; 900ms **out**. Mark `opacity 0 → .9`, `scale(.6 → 1)` at 35–60%. Swap at 430ms. New screen reveals (E1, first at 200ms). History cleared | `show()` kind `wipe`; `.wipe` in `app.css` | `gradientWipe()`; `.gxa-wipe` |
| **T6** | **Swipe to switch game** on a profile card (FC26 ↔ Tekken ↔ Rocket League). While dragging, the page follows your finger at 35%; release far enough and the next game's profile slides in | Horizontal drag on the profile card (the Figma "On drag" interactions) | Follow: `translateX(dx × .35)`. Release > 50px: left → T1 motion, right → T2 motion (with soft reveal). Release < 50px: spring back 450ms | `vp pointerdown` drag block; `show()` kinds `swipeL`/`swipeR` | `initSwipe()` + `swipe()` |
| **T7** | **Sheet screen in.** A whole screen designed as "dimmed page + confirm sheet" (Delete account → "Are you sure?"): the dimmed page fades in while the sheet rises from below the edge | Navigating to `2027:12575` | Screen `opacity 0 → 1` 280ms ease-out. Sheet parts (everything from y=600 down + fixed bottom bar) `translateY(272px → 0)` 560ms **out** | `show()` kind `sheetin`, `SHEET_FROM` | `sheetScreenIn()` |
| **T8** | **Sheet screen out.** The sheet drops away, then the dimmed layer fades, revealing the page underneath | Back / "Keep my account" on that screen | Sheet `translateY(0 → 272px)` 340ms **in**; then screen `opacity 1 → 0` 180ms | `show()` kind `sheetout` | `sheetScreenOut()` |
| **T9** | **First load.** No transition; the starting screen's blocks reveal | Opening the prototype (or a deep link) | E1 with first delay 150ms | `show()` kind `none` | — |

### E · Entrance / reveal

| ID | What you see | When | Exact motion | Prototype | Package |
|---|---|---|---|---|---|
| **E1** | Blocks (header, chips, cards, rows, buttons) rise and fade in one after another, top to bottom | Every time a screen arrives (except T2 back) | Each block: `opacity 0 → 1` 750ms + `translateY(26px → 0)` 850ms, both **out**. Delay = first delay + index × 55ms (cap +600ms) | `reveal()`; `.bd.c.pre` | `revealScreen()`; `[data-gxa-reveal].is-pre` |
| **E2** | Big blocks (taller than 260px: hero images, tall cards, profile card) are uncovered from the bottom edge upward instead of fading | Same | `clip-path: inset(0 0 100% 0) → inset(0)` 950ms + `translateY(18px → 0)` 850ms, opacity stays 1 | `.bd.c.big.pre` | `.is-big.is-pre` |
| **E3** | Softer version while the screen is also sliding in, so the two motions don't fight | T1 push, T6 swipe | Travel 12px instead of 26px; reverts to normal after 1.6s | `.bd.c.soft.pre` | `.is-soft` |
| **E4** | Content further down a long screen reveals as you scroll to it | Scrolling | Same as E1 with 0 delay; triggers 6% before fully in view; once only | `reveal()` IntersectionObserver | `revealScreen()` |
| **E5** | **Scroll progress line**: 2px brand-gradient line under the fixed header grows with scroll (website G4) | Screens taller than ~872px; appears after 4px of scroll | `transform: scaleX(scroll/max)` per scroll event, opacity fade 300ms | `.prog`; `buildScreen()` | `initScrollProgress()`; `.gxa-progress` |

### I · Interaction feedback

| ID | What you see | When | Exact motion | Prototype | Package |
|---|---|---|---|---|---|
| **I1** | **Ripple**: a lime ring grows from the exact touch point and fades | Every tap on a tappable area | 20px ring, 2px `#fff400` border, `scale(1 → 6)` + `opacity → 0`, 750ms ease-out; then 120ms later the action happens | `ripple()`; `.rip` | `ripple()`; `.gxa-ripple` |
| **I2** | **Press**: the button squeezes slightly | Finger/mouse down on a button | `scale(1 → .955)` 140ms **out**. (Prototype: a copy of the button area is lifted above the screen image and squeezed; real UI just scales the button) | `lift()`; `.lift.down` | `[data-gxa-press].is-down` |
| **I3** | **Release**: springs back with a tiny overshoot | Finger/mouse up | `scale(.955 → 1)` 500ms **spring** | `.lift.up` | `[data-gxa-press]` transition |
| **I4** | **Sheen**: a white light sweeps across (website G1) | Tap on a wide button (≥150px wide and ≤56px tall), every CTA | Diagonal gradient `translateX(-120% → 120%)`, 700ms **out**, `mix-blend-mode: overlay` | `.lift.shn .shine` | `shine()`; `.gxa-shine` |
| **I5** | **CTA loading**: the button stays pressed and a thin dark bar fills under the label, then the next screen comes in | Primary full-width buttons near the bottom (Next, Login, Join, Submit, Delete my account…) | Press held + sheen + bar `width 0 → 84%` (3px, `#0f0d0c`, from 8% left, 6px from bottom) 900ms **out**; taps locked; then navigate | click handler `cta`; `.lift .load` | `runCta()`; `.gxa-loadbar` |
| **I6** | **Field focus**: lime border, soft glow, blinking caret | Tapping a text field | Ring from `scale(1.03)`, opacity 0, 400ms **out**; `box-shadow: 0 0 0 3px rgba(255,244,0,.14), 0 0 18px rgba(255,244,0,.18)`; caret 1.5×18px blinks `steps(1)` 1s. Only one field focused at a time | `component()`; `.focus` | `focusField()`; `.gxa-field.is-focused` |
| **I7** | **Checkbox**: the box pops in and the check mark draws itself; tap again to clear | Tapping a 20–26px checkbox (terms, delete-account confirm) | Box `scale(0 → 1)` 450ms **spring**; check stroke `dashoffset 24 → 0` 400ms **out** after 120ms | `component()`; `.tick` | `toggleTick()`; `.gxa-tick` |
| **I8** | **Pulse**: a lime ring flashes around a chip, toggle, dropdown or accordion row | Tapping a control Figma swaps to another state (filters, dropdowns, FAQ rows, rank card) | Inset 1.5px ring, `scale(1 → 1.06)` + `opacity → 0`, 700ms ease-out | `component()`; `.pulse` | `pulse()`; `.gxa-pulse` |
| **I9** | **Show tap areas**: every tappable area on the screen flashes yellow | Tapping empty space; Back with no history; `H` key keeps them on | Solid `rgba(255,244,0,.18)` + 1.5px ring for 55% of 900ms, then fades out | `flash()`; `.flash .hs` | `flashTargets()`; `[data-gxa-target]` |
| **I10** | **Mouse drag-scroll**: click-and-drag scrolls the screen like a Figma prototype (desktop review only) | Mouse drag > 5px | Scroll follows the mouse 1:1 (corrected for phone scale); the click after a drag is cancelled | `dragScroll()` | `initDragScroll()` |
| **I11** | **Toast**: yellow pill springs up from the bottom, disappears after 2s (website G9) | Share popup: Snapchat / WhatsApp / Save PDF | `translate(-50%, 30px) → (-50%, 0)` 500ms **spring** + opacity 300ms; hold 2000ms | `say()`; `.toast` | `toast()`; `.gxa-toast` |

### S · Sheets & popups

| ID | What you see | When | Exact motion | Prototype | Package |
|---|---|---|---|---|---|
| **S1** | **Bottom sheet opens**: slides up from the bottom edge over a darkened page | Country / nationality / city / sport pickers, language, "Join" filter sheets (Figma "Open overlay" bottom sheets) | `translateY(100% → 0)` 560ms **out**, drop shadow `0 -10px 40px rgba(0,0,0,.6)` | `openOverlay()` | `openSheet()` |
| **S2** | **Sheet closes**: accelerates down and away | Tap the backdrop, Back, a "close" option, or navigate | `translateY(current → 100%)` 320ms **in** (200ms if navigating) | `closeOverlay()` | `close()` |
| **S3** | **Drag to dismiss**: grab the top 30px and pull down; it follows your finger 1:1. Past 70px it closes; otherwise it springs back | Drag on the sheet's top edge | Follow `translateY(dy)`; > 70px → S2; else `translateY(dy → 0)` 450ms **spring** | `sheetDrag()` | `openSheet()` (built in) |
| **S4** | **Popup opens**: pops up from slightly below and smaller, with a little overshoot | Share profile (6 popups, one per game/profile) | `opacity 0 → 1`, `translateY(26px) scale(.9) → none`, 620ms **spring** | `openOverlay()` (modal) | `openModal()` |
| **S5** | **Popup closes**: drops 20px, shrinks, fades | Cancel, a share option, tap backdrop | `opacity 1 → 0`, `translateY(20px) scale(.94)`, 320ms ease-in | `closeOverlay()` | `close()` |
| **S6** | **Backdrop**: page behind darkens and blurs slightly | With S1/S4 | `rgba(5,4,4,.62)` + `backdrop-filter: blur(2px)`, opacity 320ms ease-out in, 320/200ms out | `.ov .shade` | `.gxa-shade` |

### U · Signature moments (one per special screen)

| ID | What you see | Screen | Exact motion | Prototype | Package |
|---|---|---|---|---|---|
| **U1** | **Logo pop + glow**: the GXPER logo pops in from small and blurry, then glows magenta/yellow, slowly, forever | Splash `2010:11553` | `scale(.72)`, blur 6px, opacity 0 → normal, 1s **spring**; then drop-shadow glow loop 3s ease-in-out from 1.1s | `FX` `merge` + `.glow` | `.gxa-logo-pop` |
| **U2** | **Loading bar fills** with the brand gradient | Splash | Track `#2b2826`, 132×4px; gradient `scaleX(0 → 1)` 2.5s **out**, starts 0.3s | `FX.loader`; `.loader` | `.gxa-loader` |
| **U3** | **Corner glows breathe**: cyan top-right, magenta bottom-left | Splash | 260px blurred circles, `scale(1 ↔ 1.08)`, opacity `1 ↔ .6`, 5s loop, second offset −2s, `mix-blend-mode: screen` | `FX.corners`; `.corner` | `.gxa-corner-glow` |
| **U4** | **Auto-advance**: splash moves on by itself | Splash → Welcome | After 2900ms, T5 wipe (cancelled if you leave first or a sheet is open) | `FX.auto` | `autoAdvance()` |
| **U5** | **Ken Burns**: hero image settles from slightly zoomed in | Welcome `2010:11567`, Welcome · Trophy `2013:11594` | `scale(1.07 → 1)` 2.8s **out**, origin 50% 60% | `FX.first: 'kb'` | `.gxa-kenburns` |
| **U6** | **Light sweep**: a soft diagonal yellow light glides across the hero, every 6s | Welcome screens (hero area) | `background-position 120% → -60%` over the first 60% of a 6s loop, starts at 1s | `FX.sweep`; `.sweep` | `.gxa-sweep` |
| **U7** | **Sparks**: tiny dots drift upward, sway and twinkle (website H7) | Splash (whole screen), Welcome (hero), Thank you + all 8 alerts (top 460–470px, yellow-only palette) | 34 dots, radius 0.4–1.9px, rise 0.12–0.47px/frame, sway `sin(t/1600)×.25`, twinkle `.55 + .45·sin(t/700)`; wrap to the bottom | `sparks()` | `sparks()` |
| **U8** | **Top glow breathes**: a yellow light from the top edge slowly swells and softens | Thank you `1:107042` + 8 system alerts (no internet, timeout, 500, 404, unavailable, session expired, update, blocked — the last with a weaker glow) | 300px radial glow, `scale(1 ↔ 1.08)`, opacity `1 ↔ .6`, 4.5s loop; hero illustration also pops in (U1 pop without glow) | `FX.glow`; `.glowtop` | `.gxa-glow-top`, `.gxa-hero-pop` |
| **U9** | **Confetti burst** (website V-series) | Thank you (registration received) | 0.7s after arriving: 110 pieces from (196, 300) in magenta/yellow/cyan/white, random direction 3–11px/frame with −4 upward kick, gravity +0.22/frame, drag ×0.985, spin; fade over 2.2s, removed at 2.3s | `burst()` | `confetti()` |
| **U10** | **Badge spin-in**: the success check badge spins in from −120° | Account deleted `2027:13561` | `rotate(-120deg) scale(.6)`, opacity 0 → normal, 1s **out**, rotating around the badge centre (196.5, 355) | `FX.spin`; `.spin` | `.gxa-spin-in` |
| **U11** | **Radar rings**: two rings (orange, then cyan) pulse out from the badge, forever | Account deleted | 96px rings, `scale(1 → 2.1)`, opacity `.8 → 0`, 2.6s loop; first at 1s, second at 2.3s | `FX.ping`; `.ping` | `.gxa-ping`, `pingRings()` |
| **U12** | **Account deleted → start**: leaving the goodbye screen always uses the wipe and clears history | Account deleted → Welcome | T5 | `nav()` rule | `chooseTransition()` `fromIsGoodbye` |

### D · Prototype shell (review tool only — not part of the app)

| ID | What you see | Exact motion | Prototype |
|---|---|---|---|
| D1 | Phone rises in on load | `translateY(40px)` + opacity, 1.1s **out** | `.phone` `phoneIn` |
| D2 | Panel title lines rise from a mask; second line in the brand gradient | `translateY(105% → 0)` 1s **out**, +120ms | `.ttl` `lineUp` |
| D3 | Panel fades up | 22px, 0.9s **out** | `.panel` `fadeUp` |
| D4 | "Now showing" screen name rolls up out and the new one in; gradient bar shows how far through the flow you are | 450ms **out** rolls, 200ms swap; bar 500ms | `panelSync()` |
| D5 | Flow list opens like an accordion; rows nudge right on hover | List fades up 450ms; rows `translateX(4px)` 300ms | `.fl` |
| D6 | Dynamic-island dot blinks; island widens on hover | Blink 2.4s; width 122 → 136px 450ms **spring** | `.island` |
| D7 | Phone-width flows drawer slides up from the bottom | `translateY(100% → 0)` 500ms **out**, shade 350ms | `.drawer` |
| D8 | Phone scales to fit any window (never larger than 100%) | `scale(min((w−76)/393, (h−76)/852, 1))`; full-bleed at ≤ 520px | `fit()` |

---

## 6. How a transition is chosen

The prototype never asks Figma which animation to use (Figma mostly says
"instant" or "smart animate"). It decides from **where you are, where you're
going and what you tapped**. First matching rule wins:

| # | Rule | Transition | Back history |
|---|---|---|---|
| 0 | Forced: flows-menu jump, Restart, splash auto-advance → **T5**; profile swipe → **T6** | as forced | cleared for T5 |
| 1 | Crossing between logged-out screens (splash, welcome ×2, sign up 1/3, login, forgot 1/2/3/9, referee login ×2) and the app — or leaving "Account deleted" | **T5** wipe | cleared |
| 2 | Destination is a sheet screen ("Are you sure?" `2027:12575`) | **T7** | pushed |
| 3 | Tap was on a bottom tab item (≈59×52 box in the last 92px of the screen) | **T3** tab fade | cleared |
| 4 | Tap was small (≤ 130×40) **and** both screens are variants of the same page (same name before " - ", same section) — e.g. `Tournament details - open - Details` → `… - open - Matches` | **T4** segment (from below the tapped tab; from below the fixed header if the tab is in it) | unchanged |
| 5 | Choice made inside a sheet that switches the page to a variant of itself (sport filter → `Tournaments - TEKKEN 8`) | **T4** from the top | unchanged |
| 6 | Destination is already in the back history | **T2** pop (history trimmed to it) | trimmed |
| 7 | Anything else | **T1** push | pushed |

Back (`B` action, `Esc`, ←): closes an open sheet/popup first; otherwise pops
history with **T2** (or **T8** from a sheet screen). With empty history it
flashes the tap areas (I9) instead.

Figma actions map like this:

| Figma action | Prototype |
|---|---|
| Navigate to | rule table above |
| Back | T2 / T8 |
| Open overlay (bottom sheet, share popup) | S1 / S4 |
| Close overlay | S2 / S5 |
| Change to (component variant) | Feedback only: I6 field, I7 checkbox, I8 pulse (see [limitations](#13-known-limitations)) |
| On drag | T6 |
| After delay (home banner, encouragement card) | not played |

---

## 7. Millisecond timelines

**Tap on a card → details (T1)**
```
0      finger down        button area squeezes to 95.5% (140ms)
~100   finger up          springs back (500ms spring)
~100   click              lime ripple at finger (750ms)
220    +120ms             push starts: new screen x 100%→0, old x 0→−28% + dim (560ms)
380    +160ms             first block of the new screen starts rising (12px, soft)
435…   +55ms each         next blocks (cap: first + 600ms)
780                       slide done; taps unlocked
~1230                     last visible block settled
```

**Primary CTA, e.g. Login → Home (I5 + T5)**
```
0      tap                squeeze, ripple, sheen sweeps (700ms)
0–900                     dark bar fills to 84% under the label; taps locked
900                       wipe starts: gradient grows from left
1215                      V-mark starts fading in (35%)
1305                      gradient fully covers the screen (45%)
1330   +430               screen swapped underneath
1395                      gradient starts leaving to the right (55%)
1440                      V-mark fully gone (60%)
1530   +200               new screen's first block starts rising
1800                      wipe done
```

**Open a picker (S1) and drag it closed (S3 → S2)**
```
0      tap field          ripple; 120ms later…
120                       backdrop fades in (320ms), sheet slides up (560ms out)
680                       sheet settled
…      drag top edge      sheet follows the finger 1:1
       release > 70px     backdrop fades, sheet accelerates down (320ms in)
       release < 70px     sheet springs back (450ms spring)
```

**Splash (U1–U4)**
```
0      logo pops in (1s spring) · corner glows breathe (5s loop) · sparks drift
300    loading bar starts filling (2.5s)
1100   logo glow loop starts (3s)
2900   wipe to Welcome (T5, 900ms) → Welcome hero Ken Burns (2.8s) + sweep from 1s
```

**Join → Thank you (U7–U9)**
```
0      Submit tapped → CTA loading (900ms)
900    push to "Thank you" (560ms); top glow breathing, yellow sparks, hero pops
1600   confetti burst (110 pieces, 2.3s)
```

**Delete account (T7 → I5 → T5 → U10/U11)**
```
Confirm password → "Delete my account" (CTA 900ms)
→ T7: page fades in 280ms while the sheet rises 560ms
→ "Yes, delete" (CTA 900ms) → push to "Account deleted"
   badge spins in (1s), orange ring at 1s, cyan ring at 2.3s, repeating every 2.6s
→ "Back to start" → T5 wipe to Welcome, history cleared
```

---

## 8. Using the motion package (API)

Load it as ES modules (`import * as GXA from 'app/motion/src/js/index.js'`) or
the built bundle (`<script src="dist/gxper-app-motion.js">` → `window.GXAppMotion`),
plus the CSS (`src/styles/gxper-app-motion.css` or `dist/gxper-app-motion.css`).
Nothing runs on import.

**Markup contract**

```html
<div class="gxa-viewport" id="vp">                      <!-- 393×852, holds screens -->
  <section class="gxa-screen">
    <div class="gxa-scroller">
      <div data-gxa-reveal>…header…</div>                  <!-- E1: animates on arrival -->
      <button data-gxa-press>Card</button>                  <!-- I1–I3 -->
      <button data-gxa-press="wide">See all</button>        <!-- + I4 sheen -->
      <button data-gxa-press="cta">Join</button>            <!-- + I5 with runCta() -->
      <label class="gxa-field">…</label>                    <!-- I6 -->
    </div>
    <nav class="gxa-fixed-bottom">…tabs…</nav>
  </section>
  <div class="gxa-wipe"></div>                              <!-- T5; set --gxa-wipe-mark: url(gxper-v-black.svg) -->
  <div class="gxa-toast" role="status"></div>               <!-- I11 -->
</div>
```

**Functions**

| Function | Does | Returns |
|---|---|---|
| `push(viewport, next, current)` | T1 | Promise (resolves when done; `current` removed) |
| `pop(viewport, previous, current)` | T2 | Promise |
| `tabSwitch(viewport, next, current)` | T3 | Promise |
| `segmentSwap(viewport, next, current, {fromY, blocksOf, scrollerOf, revealFn})` | T4 | Promise |
| `gradientWipe(wipeEl, swapFn)` | T5 — calls `swapFn` at 430ms | Promise (900ms) |
| `swipe(viewport, next, current, 'left' \| 'right')` | T6 | Promise |
| `sheetScreenIn(viewport, next, sheetParts[], {travel})` | T7 | Promise |
| `sheetScreenOut(viewport, previous, current, sheetParts[], {travel})` | T8 | Promise |
| `chooseTransition(ctx)` | §6 decision table → `'push' \| 'pop' \| 'tab' \| 'segment' \| 'wipe' \| 'sheetin' \| forced` | string |
| `revealScreen(screen, {scroller, from, delay, soft})` | E1–E4 | `{destroy}` |
| `revealDelayFor(kind)` | First reveal delay (s) for a transition kind | number |
| `initPress(viewport, {scale})` | I1–I4 for every `[data-gxa-press]` | `{destroy}` |
| `ripple(host, x, y)` / `shine(button)` | I1 / I4 on demand | — |
| `runCta(button)` | I5 (900ms) | Promise |
| `afterTap()` | The standard 120ms wait | Promise |
| `focusField(field)` | I6 | — |
| `toggleTick(box)` | I7 (uses `aria-checked`) | new state |
| `pulse(host, {left, top, width, height})` | I8 | — |
| `flashTargets(viewport)` | I9 for every `[data-gxa-target]` | — |
| `toast(toastEl, message)` | I11 | — |
| `openSheet(viewport, sheetEl, {scale, onClose})` | S1 + S3 + S6 | Promise → `{close(fast?)}` |
| `openModal(viewport, cardEl, {onClose})` | S4 + S6 | Promise → `{close(fast?)}` |
| `initSwipe(el, {onLeft, onRight, onTap, follow, scale})` | T6 gesture | `{destroy}` |
| `initDragScroll(scroller, {scale})` | I10 | `{destroy}` |
| `initScrollProgress(scroller, barEl)` | E5 | `{destroy}` |
| `sparks(host, {top, height, width, alert, count})` | U7 | `{destroy}` |
| `confetti(viewport, {x, y})` | U9 | — |
| `autoAdvance(fn, ms = 2900)` | U4 | `{destroy}` |
| `pingRings(host, cx, cy, size = 96)` | U11 | — |
| `prefersReducedMotion()` | Live OS setting | boolean |
| `tokens` | Every value from §4 | object |

`demo/demo.js` is a complete ~150-line navigator built only from this API — the
best example of how the pieces fit together.

**React / Vue / Svelte**: call the functions from effects (`useEffect`,
`onMounted`), pass the DOM nodes, and call `destroy()` on unmount. For
navigation, render the next screen off-screen into the viewport, then await
the transition and remove the old one (this is exactly what `push()` does).

---

## 9. Porting to the real app

The values in §4 are platform-neutral. Curves as control points:
**out** `(0.22, 1, 0.36, 1)` · **spring** `(0.34, 1.56, 0.64, 1)` · **in** `(0.5, 0, 0.75, 0)`.

| | Curve **out** | Push (T1) | Sheet (S1) |
|---|---|---|---|
| **SwiftUI** | `.timingCurve(0.22, 1, 0.36, 1, duration: 0.56)` | `NavigationStack` default is close; for exact match use a custom `.transition(.asymmetric(insertion: .move(edge: .trailing), removal: .offset(x: -0.28 * width).combined(with: .opacity(0.4))))` with the curve above | `.sheet` + `.presentationDetents`; set the curve with `.animation(.timingCurve(0.22,1,0.36,1,duration:0.56))` |
| **UIKit** | `UICubicTimingParameters(controlPoint1: CGPoint(x:0.22,y:1), controlPoint2: CGPoint(x:0.36,y:1))` | Custom `UIViewControllerAnimatedTransitioning`, 0.56s; from view `transform = .init(translationX: -0.28*w, y: 0)`, `alpha` overlay 0.6 black | `UISheetPresentationController` |
| **Jetpack Compose** | `CubicBezierEasing(0.22f, 1f, 0.36f, 1f)` | `slideInHorizontally(tween(560, easing = Out)) { it }` with `slideOutHorizontally(tween(560, easing = Out)) { -(it * 0.28f).toInt() }` | `ModalBottomSheet`, `tween(560, easing = Out)` |
| **Flutter** | `Cubic(0.22, 1, 0.36, 1)` | `PageRouteBuilder(transitionDuration: 560ms)` with `SlideTransition` (1,0)→0 and secondary −0.28 | `showModalBottomSheet` with `AnimationController(duration: 560ms)` + `CurvedAnimation(curve: Cubic(...))` |
| **React Native (Reanimated)** | `Easing.bezier(0.22, 1, 0.36, 1)` | React Navigation `cardStyleInterpolator` with `transitionSpec: {open: {animation: 'timing', config: {duration: 560, easing}}}` | `@gorhom/bottom-sheet` `animationConfigs={useBottomSheetTimingConfigs({duration: 560, easing})}` |

**Spring** `(0.34, 1.56, 0.64, 1)` is a *cubic-bezier with overshoot*, not a
physics spring. Use it as a timing curve where the platform allows y > 1
(SwiftUI `timingCurve`, Compose `CubicBezierEasing`, Flutter `Cubic`,
Reanimated `Easing.bezier`). If a physics spring is required, use
damping ≈ 0.7, response ≈ 0.45s (iOS) / `dampingRatio = 0.7f, stiffness = 380f` (Compose) — visually close.

**Wipe (T5)** on native: a full-screen view with the gradient,
`scaleX` 0→1 anchored left (0–405ms), swap the root at 430ms, `scaleX` 1→0
anchored right (495–900ms), all on curve **out**; the V-mark fades 0→0.9 and
scales 0.6→1 between 315–540ms.

**Reveal (E1)** on native: when a screen appears, animate each section's
`opacity 0→1` (750ms) and `translationY 26→0` (850ms), curve **out**, delay
`firstDelay + i×55ms` (cap +600ms). Lists: animate only the rows on screen;
rows scrolled to later appear without delay.

**Ripple (I1)**: platform ripples are fine, tinted `#fff400`; or a 20px ring
scaling ×6 over 750ms.

**Haptics** (not in the prototype, recommended for native): light impact on
I2 press, success notification on U9 confetti and U10 badge.

---

## 10. How the prototype works

**Screens are images, sliced into bands.** Each Figma frame was captured as
one PNG (1×–2× depending on height, see §11). `slice_screens.py` scans each
image row by row: rows where every pixel is nearly the same colour (spread
≤ 10) are *gaps*; everything else is *content*. Gaps under 8px between two
content runs are merged. Each content run becomes a **band** — a `div`
showing just that slice of the image (`background-position: 0 -y`). Bands are
what rise and fade in (E1); bands taller than 260px use the mask (E2).
1,723 bands in total, 846 of them content.

**Fixed bars stay fixed.** Figma "fixed when scrolling" layers (status bar,
app bar, bottom tab bar, bottom CTA bars) are read from the frame and drawn
as separate strips above the scrolling body (`fxt` / `fxb`), so they never
scroll or animate with the content.

**Tap targets come from Figma.** Every Figma prototype interaction (931 in
the file) was read with its node's bounding box relative to its frame:
438 Navigate, 45 Back, 30 Open overlay, 33 Close overlay, 165 Change to.
Each becomes an invisible `<button class="hs">` at that exact position,
labelled for screen readers ("Go to Home", "Back", "Open Sports Bottom Sheet").
Duplicates (a "Change to" on the same box as a Navigate) are dropped; "After
delay" triggers are skipped.

**Pressing the image.** Because a button is part of the picture, I2/I3/I4
work by copying that rectangle of the image into a "lift" layer above the
screen, filling behind it with the band's background colour, and scaling
the copy.

**Overlays.** Frames used as overlays (bottom sheets, share popups — 22 in
total) are saved as transparent WebP and shown in an overlay layer:
full-width ones as sheets (S1), narrower ones (366px) as centred popups (S4).

**Navigation state.** `cur` (current screen), `stack` (back history),
`ov` (open overlay) and `lock` (a transition is running). See `nav()`,
`back()`, `show()` in `source/app.js`.

**Scaling.** The phone is always laid out at 393×852 and scaled with
`transform: scale(K)`; every pointer position is divided by `K`.

**Preloading.** When a screen opens, every screen it can navigate to is
preloaded, so the next slide never shows a half-loaded image.

**Deep links.** `#<figma node id>` opens that screen (`#1:79288` = Home);
changing the hash while open jumps there with the wipe.

### Per-screen data (`source/screens.json`)

```jsonc
"1:79288": {
  "n": "Home",            // Figma frame name
  "s": "tournaments",     // section (menu grouping)
  "w": 393, "h": 1534,    // frame size (h > 852 → scrolls)
  "top": 50, "bot": 80,   // fixed strip heights (status/app bar, tab bar)
  "bg": "#151211",        // background behind the image
  "ov": "",               // "" screen · "sheet" · "modal"
  "b": [[60, 96, "#141110", 1], …],   // bands: [y0, y1, fill colour, isContent]
  "hs": [[90, 1454, 59, 52, "N1:84164", "b"], …]
        // hotspots: [x, y, w, h, action, layer(t|m|b), "drag"?]
        // action: N<id> navigate · O<id> open overlay · B back · X close · C<id> change-to
}
```

### Per-screen effects (`FX` in `source/app.js`)

```js
'2010:11553': {merge: [357, 495, 'glow'], loader: [131, 734, 132, 4], corners: true, sparks: [0, 852], auto: ['2010:11567', 2900]},
'2010:11567': {first: 'kb', sweep: [0, 402], sparks: [0, 402]},
'2013:11594': {first: 'kb', sweep: [0, 515], sparks: [0, 515]},
'2027:13561': {spin: [196.5, 355], ping: [196.5, 355, 96]},
'1:107042':   {glow: 1, sparks: [0, 460], confetti: 700},
'246:12395' … '249:14338': {glow: 1, sparks: [0, 470]}   // 8 alerts; 249:14338 adds red: 1 (softer glow)
```
`merge` joins the logo's bands into one so it pops as a single piece;
`first` adds a class to the first content band; `spin` rotates the band that
contains that point around it.

---

## 11. Rebuilding the prototype from Figma

You only need this if screens change in Figma.

1. **Read structure + links** (Figma plugin API / MCP `use_figma`, page `design`):
   for every `FRAME` ≥ 300px wide in each section, export
   `[id, name, height, fixedChildren [[y,h]…], childTops […], hotspots […]]`
   where a hotspot is `[x, y, w, h, action, trigger?]` relative to the frame
   (`absoluteBoundingBox` minus the frame's). That is what
   `tools/figma-data/data1.json` (onboarding, sign up, tournaments) and
   `data2.json` (profile, settings, delete, referee, alerts — this one also
   stores width) contain.
2. **Capture each frame** as PNG into `tools/captures/<id-with-dash>.png`
   (e.g. `1-79288.png`). Highest scale whose PNG stays under ~680 KB:
   2× for most screens; 1×–1.8× for very tall ones (Home 1×, sponsors 1.4–1.6×).
   Overlays at 2×.
3. `python3 tools/slice_screens.py` → `prototype/screens/*.webp` + `source/screens.json`
   (needs `pip install pillow numpy`).
4. If a screen has a new special effect, add it to `FX` in `source/app.js`;
   if it is a logged-out screen, add it to `AUTH`; if it's a sheet-style
   screen, add it to `SHEET_FROM` with the y where the sheet starts.
5. `python3 tools/assemble.py` → `prototype/index.html`.
6. Check it: `cd prototype && python3 -m http.server 8765`, then
   `node ../tools/smoke-test.js` (needs `npm i playwright`) and look at `qa-shots/`.

Sections and their first screen (menu order) are defined in `SECTIONS` in
`source/app.js`.

---

## 12. Accessibility & performance

- **Reduce motion** (OS setting) is respected everywhere: CSS durations
  collapse to ~0 (`reduced-motion.css`), reveals don't hide anything, the
  wipe, sparks and confetti are skipped, the CTA loading hold is skipped, all
  JS waits become 0ms. Every state change still happens.
- Every tap target is a real `<button>` with an `aria-label`; the checkbox
  uses `role="checkbox"` + `aria-checked`; the toast is `role="status"`;
  the "now showing" panel is `aria-live="polite"`; keyboard: `Esc`, `←`,
  `Backspace`, `H`, `R`; focus rings are lime (`:focus-visible`).
- Only `transform`, `opacity`, `filter` and `clip-path` are animated (GPU
  friendly). Screens are `contain: strict`; `will-change: transform` only on
  screen layers.
- One `requestAnimationFrame` loop per sparks canvas; it stops by itself
  when the screen is removed. Confetti removes its canvas at 2.3s.
- Canvases are capped at 2× device pixel ratio.
- Screens are WebP (5.8 MB for all 114); only the next possible screens are preloaded.

---

## 13. Known limitations

- **Screens are pictures.** Text isn't selectable and the layout doesn't
  adapt; this is a motion/flow prototype, not the app UI.
- **"Change to" variants aren't swapped.** 165 Figma interactions switch a
  component to another state (selected chip, open dropdown, accordion,
  password visibility, banner auto-carousel). The prototype gives feedback
  (I6 focus, I7 tick, I8 pulse) but the picture stays the same. In the
  real app these are normal state changes; animate them with the **out**
  curve at 300–450ms (colour/border) like the website hovers.
- **"After delay" interactions** (home banner carousel, encouragement card)
  are not played.
- **Sheet/popup content** doesn't scroll (the Figma frames are shown whole).
- Fonts load from Google Fonts (League Gothic, Poppins) for the panel only;
  the screens are images and don't depend on them.

---

## 14. Screen index

All 114 frames, grouped as in the flows menu. *Taps* = number of tap targets.
Overlays (sheets, popups) open on top of screens and aren't listed in the menu.

#### Onboarding (3)

| Figma node | Screen | Size | Type | Fixed top / bottom | Taps | Special motion |
|---|---|---|---|---|---|---|
| `2010:11553` | Splash | 393×852  | Screen | – / – | 0 | U1 logo pop + glow, U2 loader, U3 corner glows, U7 sparks, U4 auto-advance 2.9s |
| `2010:11567` | Welcome (before sign up) | 393×852  | Screen | – / – | 2 | U5 Ken Burns hero, U6 sweep, U7 sparks |
| `2013:11594` | Welcome · Trophy | 393×852  | Screen | – / – | 2 | U5 Ken Burns hero, U6 sweep, U7 sparks |

#### Sign up & login (11)

| Figma node | Screen | Size | Type | Fixed top / bottom | Taps | Special motion |
|---|---|---|---|---|---|---|
| `101:13712` | Sports Bottom Sheet | 393×182  | Bottom sheet | – / – | 1 |  |
| `101:13987` | Sports Bottom Sheet | 393×182  | Bottom sheet | – / – | 1 |  |
| `119:6346` | Sports Bottom Sheet | 393×536  | Bottom sheet | – / – | 0 |  |
| `119:6400` | Sports Bottom Sheet | 393×558  | Bottom sheet | – / – | 0 |  |
| `73:5869` | Sign up 1 | 393×963 scrolls | Screen | 108 / 144 | 9 |  |
| `73:50013` | login-forgot 9 | 393×869  | Screen | 108 / 144 | 3 |  |
| `73:8711` | login-forgot 2 | 393×869  | Screen | 108 / 144 | 3 |  |
| `73:11539` | login-forgot 1 | 393×869  | Screen | 108 / 144 | 3 |  |
| `73:13409` | Sign up 3 | 393×869  | Screen | 108 / 90 | 6 |  |
| `73:14354` | login-forgot 3 | 393×869  | Screen | 108 / 90 | 6 |  |
| `73:19958` | Login | 393×869  | Screen | 108 / 144 | 6 |  |

#### Tournaments (34)

| Figma node | Screen | Size | Type | Fixed top / bottom | Taps | Special motion |
|---|---|---|---|---|---|---|
| `1:79288` | Home | 393×1534 scrolls | Screen | 50 / 80 | 13 |  |
| `1:81734` | Featured Tournaments | 393×1202 scrolls | Screen | 50 / 80 | 10 |  |
| `1:82949` | Tekken’s Tournaments | 393×1202 scrolls | Screen | 50 / 80 | 10 |  |
| `1:84164` | Tournaments - All | 393×1605 scrolls | Screen | 50 / 80 | 17 |  |
| `1:85518` | Tournaments - TEKKEN 8 | 393×1605 scrolls | Screen | 50 / 80 | 17 |  |
| `1:86872` | Tournaments - FC 2026 | 393×1605 scrolls | Screen | 50 / 80 | 17 |  |
| `1:88226` | Tournaments - ROCKET LEAGUE | 393×1605 scrolls | Screen | 50 / 80 | 17 |  |
| `1:89580` | Tournament details - open - Details | 393×1286 scrolls | Screen | 50 / 80 | 10 |  |
| `1:90593` | Tournament details - active - bracket1 | 393×1286 scrolls | Screen | 50 / 80 | 9 |  |
| `1:91606` | Tournament details - upcoming - details | 393×1286 scrolls | Screen | 50 / 80 | 10 |  |
| `1:92623` | Tournament details - ended - details | 393×1252 scrolls | Screen | 50 / 80 | 10 |  |
| `1:93640` | Tournament details - open - Leaderboard | 393×1310 scrolls | Screen | 50 / 80 | 15 |  |
| `1:94579` | Tournament details - active - matches | 393×1154 scrolls | Screen | 50 / 80 | 8 |  |
| `1:95637` | Tournament details - active - bracket2 | 393×1246 scrolls | Screen | 50 / 80 | 14 |  |
| `1:96572` | Tournament details - open - matches | 393×852  | Screen | – / – | 9 |  |
| `1:97520` | Tournament details - open - Sponsors | 393×1836 scrolls | Screen | 50 / 80 | 12 |  |
| `1:98473` | Tournament details - active - sponsors | 393×1836 scrolls | Screen | 50 / 80 | 11 |  |
| `1:99426` | Tournament details - active - sponsors | 393×1836 scrolls | Screen | 50 / 80 | 12 |  |
| `1:100383` | Tournament details - active - sponsors | 393×1789 scrolls | Screen | 50 / 80 | 12 |  |
| `1:106079` | Join tournament 1 | 393×869  | Screen | 108 / 90 | 6 |  |
| `1:107042` | Join tournament 2 | 393×852  | Screen | – / – | 1 | U8 glow, U7 yellow sparks, U9 confetti at 0.7s |
| `1:112242` | Sports Bottom Sheet | 393×334  | Bottom sheet | – / – | 8 |  |
| `1:114383` | Tournament details - open - matches | 393×852  | Screen | – / – | 9 |  |
| `1:115331` | Tournament details - upcoming - standings | 393×931 scrolls | Screen | 50 / 80 | 9 |  |
| `1:116412` | Tournament details - ended - matches | 393×1154 scrolls | Screen | 50 / 80 | 9 |  |
| `1:117470` | Tournament details - ended - standings | 393×1173 scrolls | Screen | 50 / 80 | 12 |  |
| `1:130107` | Sports Bottom Sheet | 393×250  | Bottom sheet | – / – | 4 |  |
| `1:130372` | Sports Bottom Sheet | 393×250  | Bottom sheet | – / – | 4 |  |
| `1:130637` | Sports Bottom Sheet | 393×250  | Bottom sheet | – / – | 4 |  |
| `1:130902` | Sports Bottom Sheet | 393×250  | Bottom sheet | – / – | 4 |  |
| `1:131167` | Sports Bottom Sheet | 393×626  | Bottom sheet | – / – | 1 |  |
| `1:131221` | Sports Bottom Sheet | 393×626  | Bottom sheet | – / – | 1 |  |
| `2030:11764` | Tournament details - upcoming - bracket | 393×1261 scrolls | Screen | 50 / 81 | 9 |  |
| `2030:12845` | Tournament details - ended - bracket | 393×1197 scrolls | Screen | 50 / 81 | 9 |  |

#### Leaderboard & profile (21)

| Figma node | Screen | Size | Type | Fixed top / bottom | Taps | Special motion |
|---|---|---|---|---|---|---|
| `1:101340` | leaderboard-fc | 393×990 scrolls | Screen | 173 / 80 | 17 |  |
| `1:102584` | leaderboard-tekken | 393×990 scrolls | Screen | 173 / 80 | 17 |  |
| `1:103828` | leaderboard-rocket | 393×990 scrolls | Screen | 173 / 80 | 17 |  |
| `1:107968` | profile-tournament-fc | 393×1108 scrolls | Screen | 120 / 80 | 7 |  |
| `1:109118` | profile-tournament-tekken | 393×1108 scrolls | Screen | 120 / 80 | 7 |  |
| `1:110268` | profile-tournament-rocket | 393×1108 scrolls | Screen | 120 / 80 | 7 |  |
| `1:112764` | fc share popup | 366×650  | Popup | – / – | 4 |  |
| `1:112916` | fc share popup | 366×650  | Popup | – / – | 4 |  |
| `1:113068` | fc share popup | 366×650  | Popup | – / – | 4 |  |
| `1:113220` | fc share popup | 366×650  | Popup | – / – | 4 |  |
| `1:113372` | fc share popup | 366×650  | Popup | – / – | 4 |  |
| `1:113524` | fc share popup | 366×650  | Popup | – / – | 4 |  |
| `1:119926` | profile-profile-fc | 393×1325 scrolls | Screen | 108 / 80 | 9 |  |
| `1:121104` | profile-profile-tekken | 393×1325 scrolls | Screen | 108 / 80 | 9 |  |
| `1:122282` | profile-profile-rocket | 393×1325 scrolls | Screen | 108 / 80 | 9 |  |
| `1:123460` | Another Player Profile - fc | 393×1419 scrolls | Screen | 102 / 22 | 6 |  |
| `1:124633` | Another Player Profile - tekken | 393×1419 scrolls | Screen | 167 / 22 | 6 |  |
| `1:125806` | Another Player Profile - rocket league | 393×1419 scrolls | Screen | 167 / 22 | 6 |  |
| `1:127545` | Sports Bottom Sheet | 393×184  | Bottom sheet | – / – | 3 |  |
| `1:128565` | Sports Bottom Sheet | 393×184  | Bottom sheet | – / – | 3 |  |
| `1:129585` | Sports Bottom Sheet | 393×184  | Bottom sheet | – / – | 3 |  |

#### More & settings (16)

| Figma node | Screen | Size | Type | Fixed top / bottom | Taps | Special motion |
|---|---|---|---|---|---|---|
| `73:6824` | Sign up 4 | 393×852  | Screen | – / – | 9 |  |
| `73:9653` | login-forgot 4 | 393×869  | Screen | 108 / 144 | 2 |  |
| `73:10597` | login-forgot 8 | 393×869  | Screen | 108 / 144 | 2 |  |
| `73:12474` | login-forgot 5 | 393×869  | Screen | 108 / 90 | 2 |  |
| `73:15293` | login-forgot 6 | 393×869  | Screen | 108 / 90 | 6 |  |
| `73:16230` | login-forgot 7 | 393×869  | Screen | 108 / 144 | 9 |  |
| `73:17172` | About us | 393×869  | Screen | 108 / 22 | 1 |  |
| `73:18095` | T&C | 393×869  | Screen | 108 / 22 | 4 |  |
| `101:14031` | FAQ | 393×869  | Screen | 108 / 22 | 4 |  |
| `73:19030` | Privacy and policy | 393×869  | Screen | 108 / 22 | 1 |  |
| `73:21265` | more | 393×852  | Screen | – / – | 13 |  |
| `101:12569` | more | 393×852  | Screen | – / – | 7 |  |
| `73:22272` | more | 393×852  | Screen | – / – | 1 |  |
| `73:23235` | language bottom sheet | 393×184  | Bottom sheet | – / – | 0 |  |
| `73:23246` | Tournaments - All | 393×1605 scrolls | Screen | 50 / 22 | 11 |  |
| `120:11313` | Sports Bottom Sheet | 393×150  | Bottom sheet | – / – | 0 |  |

#### Delete account (5)

| Figma node | Screen | Size | Type | Fixed top / bottom | Taps | Special motion |
|---|---|---|---|---|---|---|
| `2026:11582` | delete account - 1 warning | 393×869  | Screen | 108 / 144 | 5 |  |
| `2027:11595` | delete account - 2 confirm password | 393×869  | Screen | 108 / 144 | 7 |  |
| `2027:12575` | delete account - 3 are you sure | 393×869  | Screen | 108 / 144 | 2 | T7 sheet screen (sheet from y=600) |
| `2027:13561` | delete account - 4 account deleted | 393×869  | Screen | 108 / 90 | 2 | U10 badge spin-in, U11 ping rings |
| `2023:37254` | more | 393×852  | Screen | – / – | 7 |  |

#### Referee (16)

| Figma node | Screen | Size | Type | Fixed top / bottom | Taps | Special motion |
|---|---|---|---|---|---|---|
| `123:15523` | Tournament details - active - bracket1 | 393×1286 scrolls | Screen | 50 / 22 | 4 |  |
| `128:13929` | Tournament details - active - bracket1 | 393×1286 scrolls | Screen | 50 / 35 | 4 |  |
| `123:16536` | Tournament details - active - matches | 393×1014 scrolls | Screen | 50 / 21 | 6 |  |
| `171:21660` | Tournament details - active - matches | 393×1014 scrolls | Screen | 50 / 21 | 4 |  |
| `126:10095` | Tournament details - active - matches | 393×852  | Screen | – / – | 6 |  |
| `123:17594` | Tournament details - active - bracket2 | 393×1246 scrolls | Screen | 50 / 22 | 10 |  |
| `128:16915` | Tournament details - active - bracket2 | 393×1246 scrolls | Screen | 50 / 35 | 9 |  |
| `123:19001` | more | 393×900 scrolls | Screen | 50 / 80 | 8 |  |
| `122:11603` | Tournaments - TODAY | 393×1605 scrolls | Screen | – / 80 | 7 |  |
| `128:12687` | Tournaments - TODAY | 393×1605 scrolls | Screen | – / 22 | 5 |  |
| `123:13039` | Tournaments - uPCOMING | 393×1605 scrolls | Screen | – / 80 | 8 |  |
| `123:21661` | Login | 393×869  | Screen | 108 / 90 | 6 |  |
| `128:11728` | Login | 393×869  | Screen | 108 / 90 | 2 |  |
| `127:11556` | Notifications | 393×852  | Screen | – / – | 1 |  |
| `163:21276` | Tournament details - active - sponsors | 393×1836 scrolls | Screen | 50 / 22 | 7 |  |
| `225:11651` | Tournament details - active - sponsors | 393×1836 scrolls | Screen | 50 / 22 | 7 |  |

#### System alerts (8)

| Figma node | Screen | Size | Type | Fixed top / bottom | Taps | Special motion |
|---|---|---|---|---|---|---|
| `246:12395` | Join tournament 4 | 393×852  | Screen | – / – | 0 | U8 glow, U7 yellow sparks |
| `246:13333` | Join tournament 5 | 393×852  | Screen | – / – | 1 | U8 glow, U7 yellow sparks |
| `246:14271` | Join tournament 6 | 393×852  | Screen | – / – | 1 | U8 glow, U7 yellow sparks |
| `246:15209` | Join tournament 7 | 393×852  | Screen | – / – | 1 | U8 glow, U7 yellow sparks |
| `248:11521` | Join tournament 8 | 393×852  | Screen | – / – | 1 | U8 glow, U7 yellow sparks |
| `248:12459` | Join tournament 9 | 393×852  | Screen | – / – | 1 | U8 glow, U7 yellow sparks |
| `248:13397` | Join tournament 10 | 393×852  | Screen | – / – | 1 | U8 glow, U7 yellow sparks |
| `249:14338` | Join tournament 11 | 393×852  | Screen | – / – | 1 | U8 glow, U7 yellow sparks (muted glow) |

---

*Built with the GXPER website motion system as the reference
([`../motion/`](../motion/)). Questions about a specific movement: quote its ID
from §5.*
