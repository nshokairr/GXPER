# 01 · Motion principles

These rules explain *why* the motion looks the way it does. Use them when you
build something new that this package doesn't cover.

## The feeling
GXPER is an esports arena: dark, cinematic, a bit electric. Motion should feel
like **stage lighting coming on**, not like a playful app. Fast in, slow and
confident landing, nothing bouncy except tiny feedback moments.

## Five rules

1. **One signature curve.** Almost everything uses `--gx-ease-out`
   (`cubic-bezier(.22, 1, .36, 1)`): it leaves quickly and settles softly.
   The springy curve (`--gx-ease-spring`) is only for small "pop" feedback
   (icons, badges, modal panel, map pin). Loops use `ease-in-out` or `linear`.

2. **Every element moves once, then stays.** Scroll reveals play the first time
   an element appears and never replay on scroll-up. Nothing on the first
   screen is ever hidden waiting for JS.

3. **Ambient loops are slow and quiet.** Background loops (sweeps, glows,
   floating phones, orbit) run between 3s and 26s, at low opacity. If you
   notice a loop while reading, it's too strong.

4. **Brand colour leads the eye.** Lines and progress use the brand gradient
   (magenta → yellow → cyan). Glows and focus use yellow `#fff400`. Magenta is
   only a soft accent glow.

5. **Respect the visitor.** With *Reduce motion* switched on, every animation
   finishes instantly, decorative loops are removed, and nothing waits on a
   scroll.

6. **Same on every screen.** Phones, tablets and desktop get the same
   animations; only the layout re-flows. Hover effects play on tap.

## Performance rules
- Animate only `transform`, `opacity`, `clip-path` and `filter`. Never `top`,
  `left`, `width` or `height` in a loop (the journey progress bar width is the
  one exception; it's one small element).
- Continuous JS animations share one `requestAnimationFrame` loop
  (`core/frame-loop.js`) and pause when off-screen or the tab is hidden.
- Canvas effects cap pixel ratio at 2 and reduce particle count on small screens.
- Scroll handlers are passive and throttled to one update per frame.
