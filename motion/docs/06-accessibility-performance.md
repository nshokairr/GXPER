# 06 · Accessibility and performance

## Reduced motion (required)
`src/styles/reduced-motion.css` must stay the **last** stylesheet. With the OS
"Reduce motion" setting on:
- every CSS animation and transition completes instantly
- decorative loops are removed (hero sweep, runner light, scan line, radar, form glint)
- nothing is pre-hidden for scroll reveals
- JS skips: parallax, sparks, confetti, journey auto-play (steps still change on click), page wipe (page swaps instantly), ripple

## Keyboard
- Menu: `Esc` closes it.
- Journey: steps are `role="tab"` buttons. ← / → move, Enter/Space select. The title has `aria-live="polite"`.
- Map picker: focusable; arrow keys move the pin 12 map-px.
- Overlays: `Esc` closes. Move focus into the dialog on open and back to the trigger on close (do this in your component).
- Focus ring: 2px yellow outline, 3px offset. Never remove it.

## Screen readers
- Decorative layers (`.gx-hero__sweep`, sparks canvas, orbit rings, wipe) are `aria-hidden` or have empty `alt`.
- Toast is `role="status" aria-live="polite"`.

## Performance budget
| Item | Target |
|---|---|
| JS bundle (min + gzip) | ≈ 5 KB |
| CSS (min + gzip) | ≈ 6 KB |
| Main-thread work per frame while scrolling | < 2 ms |
| Lighthouse "Avoid non-composited animations" | no motion items flagged |

What keeps it fast:
- Only `transform` / `opacity` / `clip-path` / `filter` are animated.
- One shared rAF loop; journey, sparks and orbit pause off-screen and when the tab is hidden.
- `will-change` only on the hero photo and hero content (the two parallax layers).
- Canvas pixel ratio capped at 2; particle counts scale with screen width.
- Hero photo: use `<picture>` with the phone crop and `fetchpriority="high"`; lazy-load everything below the fold.
