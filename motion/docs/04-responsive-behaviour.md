# 04 · Responsive behaviour (web + mobile web)

Breakpoints are shared by CSS and JS (`BREAKPOINTS` in `motion-tokens.js`).

| Name | Width | What changes in the motion |
|---|---|---|
| Desktop | > 1100px | Everything on |
| Tablet | ≤ 1100px | App phones become a swipe row (A6); parallax stays on |
| Nav | ≤ 900px | Desktop nav hidden → hamburger + full-screen menu (G10) |
| Mobile | ≤ 760px | Shorter travel distances, mobile journey layout, capability list, header 72px, phone hero crop |
| Small | ≤ 640px | Header CTA hidden, logo 26px |

## Hover vs touch
Hover effects are not limited to mouse devices. On phones and tablets they
play when the visitor taps, so the feedback is the same as on desktop.
The cursor spotlight (C2, F2) follows the finger while it's on the card.

## Rule: same animations on every screen
Phones and tablets get **every** animation the desktop has. Only the layout
re-flows (and travel distances shrink a little so motion fits the smaller
screen). Nothing is switched off for mobile, except hover-only effects, which
become tap effects.

## What changes on phones (≤ 760px)

| Area | Desktop | Phone |
|---|---|---|
| Reveal travel | 34px | 24px (`--gx-shift-reveal`) |
| Phone mock entrance | 90px + tilt | 48px + tilt; the swipe row reveals together |
| App phones | 3 in a row, parallax | Swipe row, edge to edge: 175px phones, 2px gap, 6px from the screen edge, third phone peeks in (Figma mobile) |
| Header | Hides on scroll down, back on scroll up (G3b) | Same |
| Hero | photo `hero-arena.jpg`, centred | `hero-arena-m.jpg`, focus at 72% so the trophy stays in frame |
| Journey | copy left, visual right, timeline with nodes | Stacked: copy → visual → 4 tabs. Ghost number top-right; track, nodes, halo pulse and glowing head sit on top of the tabs |
| Capabilities | 2×2 cards with hover effects | List rows; same effects on tap, plus the icon glow (C6) |
| Orbit | 670px drawing | Same drawing scaled to the container width (`orbit.js`) |
| Page wipe logo | 180 × 118px | 140 × 92px |
| Confetti | 120 pieces | 80 pieces |
| Sparks | up to 70 | about 17 (1 per 22px of width) |
| Anchor offset | 82px | 72px (`--gx-header-h`) |

## Safe areas (iPhone notch / home bar)
Toast, overlays and the menu use `env(safe-area-inset-*)`, so nothing sits under
the notch or the home bar. Keep `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">`.

## Testing checklist
- [ ] Desktop 1440 and 1280: every catalogue item from doc 03
- [ ] iPad portrait (820) and landscape (1180)
- [ ] iPhone SE (375), iPhone 15 (393), large Android (412)
- [ ] Rotate a phone while the journey plays: no layout jump
- [ ] macOS / iOS **Reduce motion** on: no movement, every section visible
- [ ] Low-power mode on iOS: loops may slow down; nothing breaks
- [ ] Keyboard only: menu, journey steps, map pin (arrow keys), overlays (Esc)
