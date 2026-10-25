# GXPER — Motion handoff

Every animation, transition, hover, timing and easing from the GXPER website
prototype, packaged as a clean, framework-agnostic motion system for
**desktop web and mobile web**.

> **Source of truth**
> - Layout, type, colour, spacing → **Figma** (GXPER Website file)
> - Motion (timing, curves, choreography, responsive behaviour) → **this package**
> - Live reference → the web prototype link shared by the designer

---

## Quick start (2 minutes)

```bash
npm install
npm run build        # builds dist/ (plain + minified)
npm run demo         # serves the folder → open http://localhost:5173/demo/
```

You can also just double-click `demo/index.html`. It uses the built `dist/` file, so it works without a server.
Every section in the demo has a yellow tag with its **catalogue IDs**
(e.g. `J1–J8`). Look the ID up in `docs/03-animation-catalogue.md` to find the
exact spec and the file it lives in. Resize the browser to 390px wide (or use
device mode) to see the mobile-web behaviour.

---

## Folder structure

```
gxper-motion-handoff/
├── README.md                  ← you are here
├── package.json               ← build + demo scripts (esbuild only, no runtime deps)
├── src/
│   ├── tokens/
│   │   ├── motion-tokens.css  ← ALL durations, curves, distances, staggers (CSS vars)
│   │   └── motion-tokens.js   ← same values for JS (journey timing, parallax, breakpoints)
│   ├── styles/
│   │   ├── gxper-motion.css   ← entry file: imports everything in the right order
│   │   ├── keyframes.css      ← every @keyframes, named gx-*
│   │   ├── rtl.css            ← Arabic / right-to-left mirroring (docs/07)
│   │   ├── reduced-motion.css ← accessibility override (must load last)
│   │   └── components/
│   │       ├── interactions.css    G1–G5, G9, G10, G12  buttons, links, header (+ auto-hide), progress, menu, toast, fields, dropdown arrow
│   │       ├── page-transition.css G6              gradient page wipe + inner-page hero entrance
│   │       ├── reveal.css          G7, G8          scroll reveal system + number roll
│   │       ├── hero.css            H1–H8           hero load choreography + loops
│   │       ├── app-showcase.css    A1–A6           floating phones, parallax, swipe row
│   │       ├── journey.css         J1–J8           4-step auto-playing journey
│   │       ├── capabilities.css    C1–C6           cards (desktop) / list (phone)
│   │       ├── orbit.css           O1–O8           player-identity orbit
│   │       ├── sections.css        B, M, R, P, F, K smaller section motions
│   │       └── overlays.css        V1–V9           map picker, success, confetti canvas
│   └── js/
│       ├── index.js           ← entry: initMotion() + every module exported
│       ├── core/
│       │   ├── env.js         ← reduced-motion, breakpoints, helpers
│       │   └── frame-loop.js  ← one shared requestAnimationFrame loop
│       └── modules/
│           ├── reveal.js            G7, G8
│           ├── scroll-effects.js    G4, H8, A2
│           ├── header.js            G3b (hide on scroll down, show on scroll up)
│           ├── sparks.js            H7
│           ├── journey.js           J1–J8
│           ├── orbit.js             O1–O8
│           ├── pointer-spotlight.js C2, F2
│           ├── page-transition.js   G6, G11
│           ├── ui.js                G9, G10, V1, R6
│           ├── map-pin.js           V2–V4
│           └── confetti.js          V9
├── dist/                      ← built files (window.GXMotion) for non-bundled sites
├── demo/                      ← working reference page (demo-layout.css is demo-only)
└── docs/
    ├── 01-motion-principles.md        why it moves like this
    ├── 02-motion-tokens.md            every value in one table
    ├── 03-animation-catalogue.md      every animation, ID, trigger, timing, phone behaviour
    ├── 04-responsive-behaviour.md     breakpoints, touch vs hover, phone changes, test list
    ├── 05-integration-guide.md        React/Next, Vue/Nuxt, SSR, API reference
    ├── 06-accessibility-performance.md reduced motion, keyboard, performance budget
    └── 07-arabic-rtl.md               Arabic version: what mirrors, fonts, language switch
```

### Architecture in one paragraph
**Tokens** hold every number. **Keyframes** hold every movement shape.
**Component CSS** combines the two per section and only contains motion rules
(no colours/spacing from the design). **JS modules** handle what CSS can't:
scroll position, timers, canvas, pointer tracking. Each module is a pure
`init…(element) → { destroy }` function with no global state, so it plugs into
any framework lifecycle. Behaviour hooks are `data-gx-*` attributes, styling
hooks are `gx-*` BEM classes, so designers can restyle without breaking
behaviour and vice versa.

---

## How to use it in the project

1. Copy `src/` into the codebase (or `npm install` this folder as a local package).
2. Import `src/styles/gxper-motion.css` after the base styles.
3. Call `initMotion()` once on the client; call `.destroy()` on route change.
4. Add the `gx-*` classes and `data-gx-*` attributes to the real components.
   `demo/index.html` shows the exact markup for every section.
5. Wire the page wipe into the router: `pageTransition(() => router.push(url))`.

Full details and framework examples: **`docs/05-integration-guide.md`**.

---

## Non-negotiables

| Rule | Why |
|---|---|
| Use the tokens; never hard-code a duration or curve | One place to tune the whole site |
| Keep `reduced-motion.css` last and keep the JS checks | Accessibility (WCAG 2.3.3) and motion-sickness safety |
| Hover effects stay inside `@media (hover: hover)` | No sticky hover on phones |
| Animate only transform / opacity / clip-path / filter | 60fps on mid-range phones |
| Elements on the first screen are never pre-hidden | No flash or layout jump on load |
| Images go in `<img>`/`<picture>`, not CSS variables | Paths survive bundling; better loading |
| Journey: 5.2s per step, pauses off-screen / on hover | Matches the approved prototype |

---

## Responsive summary
Mobile web is the **same site with the same animations**, just re-laid-out.
Nothing is switched off on phones.


| Width | Changes |
|---|---|
| > 1100px | Full experience incl. phone parallax |
| ≤ 1100px | App phones → swipe row (parallax stays on) |
| ≤ 900px | Hamburger + full-screen menu |
| ≤ 760px | Mobile journey layout, capability list with glowing icons, shorter travel, phone hero crop, 72px header |
| ≤ 640px | Header CTA hidden, smaller logo |

---

## Browser support
Latest Chrome, Edge, Safari (macOS + iOS 15.4+), Firefox, Samsung Internet.
`@property` (rotating CTA border) is supported in all current browsers; in older
ones the border is simply static.

## Questions
Motion questions → the designer, quoting the catalogue ID (e.g. "J2 title wipe
feels slow on Android"). Values change in `src/tokens/` only.
