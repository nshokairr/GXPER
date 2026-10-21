# GXPER Website

Design handoff for the GXPER website (desktop web + mobile web).

| Folder | What it is |
|---|---|
| [`motion/`](motion/) | **Motion system for developers.** Every animation, transition, hover, timing and easing, with tokens, framework-agnostic CSS/JS modules, a working demo and 6 guides. Start with [`motion/README.md`](motion/README.md). |
| [`prototype/`](prototype/) | **Approved web prototype.** One HTML file + assets. Open `prototype/index.html` in a browser to see the full site with all motion. Use it as the visual reference. |

## Source of truth
- **Layout, colours, type, spacing** → Figma (GXPER Website file)
- **Motion** (timing, curves, choreography, responsive behaviour) → `motion/`
- **Reference build** → `prototype/`

## Rules
- Mobile web gets **the same animations** as desktop — only the layout re-flows. Hover effects play on tap.
- Use the values in `motion/src/tokens/` — never hard-code durations or curves.
- Keep the *Reduce motion* support (`motion/src/styles/reduced-motion.css`).
- Questions about motion: quote the catalogue ID from `motion/docs/03-animation-catalogue.md` (e.g. "J2").

## Quick start
```bash
cd motion
npm install
npm run build
npm run demo      # http://localhost:5173/demo/
```
The contact email `hello@scooring.com` is a placeholder until the final GXPER address is confirmed.
