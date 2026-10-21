# 03 · Animation catalogue

Every animation on the site, with an ID you can quote in tickets and reviews.
**Trigger** says what starts it. **Phone** says how it changes at ≤ 760px.

Columns: ID · What the visitor sees · Trigger · Duration / curve · Phone behaviour · Where it lives

## G · Global

| ID | What the visitor sees | Trigger | Timing | Phone | Code |
|---|---|---|---|---|---|
| G1 | **Button**: lifts 2px, yellow glow, light sheen sweeps across, arrow slides 4px right. Press shrinks to 98% | Hover / press | 350ms ease-out (sheen 700ms, arrow spring) | Plays on tap | `interactions.css` `.gx-btn` |
| G2 | **Nav underline** grows in from the left, leaves to the right | Hover / current page | 450ms ease-out | Not shown (menu instead) | `.gx-nav-link` |
| G3 | **Header** slides down once on load; sticky with blur | Page load | 800ms ease-out | Same, header 72px | `.gx-header` |
| G4 | **Scroll progress**: 2px gradient line under the header grows with scroll | Scroll | per frame | Same | `scroll-effects.js` `.gx-progress` |
| G5 | **Small links**: arrow nudges 6px; back link moves 4px left; footer links turn yellow | Hover | 250–350ms | Plays on tap | `.gx-arrow-link` `.gx-back-link` `.gx-color-link` |
| G6 | **Page wipe**: brand-gradient bar sweeps across, black GXPER mark appears, page swaps behind it, bar exits right. New page title lines rise in | Navigate to another page | 900ms ease-out, swap at 430ms | Same; mark 140px wide | `page-transition.css/js` |
| G7 | **Scroll reveal**: fade + rise 34px; headlines wipe up from their baseline; lines draw left→right | Element enters viewport (once) | 900ms ease-out, 80ms stagger | Rise is 24px | `reveal.css/js` `data-gx-reveal` |
| G8 | **Number roll**: big "01" rolls up into its slot | 40% in view (once) | 1000ms ease-out | Same | `data-gx-roll` |
| G9 | **Toast**: yellow pill pops up from the bottom, disappears after 2.2s | Copy email, pin confirmed, form error | 500ms spring | Sits above the home bar (safe area) | `ui.js toast()` |
| G10 | **Mobile menu**: hamburger morphs to ✕, full-screen panel fades in, 4 big links rise one after another | Tap menu | 400ms panel, 550ms links, 50ms stagger | Phone + tablet (≤ 900px) | `ui.js initMenu()` |
| G11 | **Anchor scroll**: smooth scroll to a section, stopping below the sticky header | Click an in-page link | Browser smooth scroll | Offset 72px | `scrollToSection()` |

## H · Hero

| ID | What the visitor sees | Trigger | Timing | Phone | Code |
|---|---|---|---|---|---|
| H1 | Arena photo zooms from 112% to 100% | Load | 2.6s ease-out | Phone crop (`hero-arena-m.jpg`, focus 72%) | `hero.css` |
| H2 | Eyebrow letters close in from wide spacing | Load +0.2s | 1.2s ease-out | Same | |
| H3 | Headline lines rise from behind a mask, one after the other | Load +0.35s / +0.5s | 1.0s ease-out | Same | |
| H4 | Lead text then buttons fade up 22px | Load +0.75s / +0.9s | 0.9s ease-out | Same | |
| H5 | Gradient line draws across the bottom; a white-yellow light runs along it every 4.5s | Load +0.7s / loop from 2.4s | 1.6s draw, 4.5s loop | Same | |
| H6 | Soft yellow light sweeps diagonally across the photo | Loop from 1.6s | 7s | Same | |
| H7 | Small sparks (magenta / yellow / cyan) drift up and twinkle | Always while visible | per frame | ~17 sparks instead of 70 | `sparks.js` |
| H8 | **Parallax**: text drifts up 22% of scroll and fades out by 760px; photo moves 12% | Scroll | per frame | Same | `scroll-effects.js` |

## A · App showcase ("One profile. Every match.")

| ID | What the visitor sees | Trigger | Timing | Phone | Code |
|---|---|---|---|---|---|
| A1 | Each phone floats up and down 12px, never in sync | Loop | 6s ease-in-out, offsets −2s / −4s | Same | `app-showcase.css` |
| A2 | Phones drift at different speeds while scrolling | Scroll | −0.06 / 0.04 / −0.03 | Same | `scroll-effects.js` |
| A3 | Hovered phone lifts 10px, grows 2.5%, yellow glow | Hover | 500ms ease-out | Plays on tap | |
| A4 | Phones rise 90px and un-tilt from −5° | Reveal, 150ms stagger | 900ms ease-out | 48px rise; whole swipe row reveals together | `data-gx-reveal="phone"` |
| A5 | Store badges lift 3px with a glow | Hover | 350ms spring | Plays on tap | `.gx-badge` |
| A6 | **Swipe row**: first phone fully visible, next one peeks in from the edge; snaps per phone | Swipe | native scroll-snap | ≤ 1100px | `app-showcase.css` |

## J · Tournament journey

| ID | What the visitor sees | Trigger | Timing | Phone | Code |
|---|---|---|---|---|---|
| J1 | Gradient progress line with a glowing head fills along the timeline | Continuous | 5.2s per step | Same, on top of the 4 tabs | `journey.js` |
| J2 | Step change: title wipes out right→left, new title wipes in; description drops out and back | Auto every 5.2s, or click a step | 700ms wipe, new text at 380ms, desc +120ms | Same | |
| J3 | Big faded step number slides up out, new one slides up in | Step change | 900ms ease-out | Smaller, top-right corner | |
| J4 | Old visual shrinks to 86% and fades; new one switches on with a neon flicker, then floats | Step change | 600/800ms out, 900ms stepped flicker | Visual scaled down | |
| J5 | Background spotlight flickers; a light scans down the grid | Loop | 5.2s / 6.5s | Same | |
| J6 | Short yellow rule next to the eyebrow redraws each step | Loop | 5.2s | Same | |
| J7 | Active node: yellow dot pops in, halo pulses out | Step active | 600ms spring, 1.8s pulse | Same | |
| J8 | Pauses on mouse hover, when < 35% visible, when tab hidden | — | — | Hover pause n/a | |

Keyboard: Tab to the timeline, ← / → move between steps, Enter/Space selects.

## C · What we do (capabilities)

| ID | What the visitor sees | Trigger | Timing | Phone | Code |
|---|---|---|---|---|---|
| C1 | Card lifts 4px, border turns yellow | Hover / tap | 500ms ease-out | List row nudges 4px | `capabilities.css` |
| C2 | Soft yellow light follows the cursor inside the card | Mouse move | 400ms fade-in | Plays on tap | `pointer-spotlight.js` |
| C3 | Controller icon tilts −10° and grows 15% | Hover / tap | 600ms spring | Same | |
| C4 | Yellow bar draws along the bottom of the card | Hover / tap | 700ms ease-out | Same | |
| C5 | Cards / rows reveal one after another | Reveal | 900ms, 80ms stagger | Same | |
| C6 | Icon box glows softly, one row after another | Loop | 2.4s, +0.3s per row | **Phone only** | |

## O · Player identity orbit

| ID | What the visitor sees | Trigger | Timing | Phone | Code |
|---|---|---|---|---|---|
| O1 | Yellow radar cone sweeps around | Loop | 9s linear | Same (whole orbit scales down) | `orbit.css` |
| O2 | Middle ring slowly rotates | Loop | 70s linear | Same | |
| O3 | Halo behind the hub breathes | Loop | 4.5s | Same | |
| O4 | Two ripples ping out from the hub, 1.6s apart | Loop | 3.2s | Same | |
| O5 | GXPER mark glows magenta and back | Loop | 4.5s | Same | |
| O6 | Target satellite orbits the hub, always upright | Loop | 16s linear | Same | |
| O7 | GROW / EARN / CLIMB / BUILD labels slide in from the centre | 30% in view (once) | 800/900ms, stagger 100/250/400/550ms | Same | `orbit.js` |
| O8 | Each label's yellow bar grows down | With O7 +250ms | 800ms | Same | |

## M, B, R, P, F, K · Other sections

| ID | What the visitor sees | Trigger | Timing | Phone |
|---|---|---|---|---|
| B1 | Yellow dot in "Launching across" blinks | Loop 2.4s | ease-in-out | Same |
| M1 | Metric tile fills with yellow from the bottom, text turns dark, title nudges 6px | Hover (tap on phone) | 550ms fill | Plays on tap |
| R1 | Request background map slowly zooms/pans back and forth | Loop 26s | ease-in-out alternate | Same |
| R2 | Gradient glint runs across the top edge of the form | Loop 5s | ease-in-out | Same |
| R3 | Lightning bolt flickers like a neon sign | Loop 3.6s | stepped | Same |
| R4 | Perk rings ping outwards, 1s apart | Loop 3s | ease-out | Same |
| R5 | "Select location" button turns yellow, pin icon hops 3px | Hover | 300/500ms | Plays on tap |
| R6 | Invalid field shakes + red border; submit shows a dark loading bar for 0.9s | Submit | 400ms shake, 900ms bar | Same |
| P1 | Regional map slowly zooms (Ken Burns) | Loop 22s | ease-in-out alternate | Same |
| P2 | City pins ping, two rings 1.3s apart | Loop 2.6s | ease-out | Same |
| F1 | A short gradient arc travels around the final CTA border | Loop 6s | linear | Same |
| F2 | Soft yellow light follows the cursor in the panel | Mouse move | 500ms fade | Plays on tap |
| K1 | Contact card slides 6px right, yellow border, icon pops and tilts | Hover | 500ms | Plays on tap |

## V · Overlays (map picker + success)

| ID | What the visitor sees | Trigger | Timing | Phone |
|---|---|---|---|---|
| V1 | Backdrop fades in; panel rises 30px from 96% size | Open / close | 450ms fade, 700ms spring | Full-width panel |
| V2 | Pin glides to the clicked point and drops in from above | Click / tap / arrow keys | 700ms + 600ms spring | Same |
| V3 | Yellow ripple spreads from the click point | Click | 900ms | Same |
| V4 | "Selected location" text rolls up and is replaced | City changes | 450ms | Same |
| V5 | Round buttons grow 8%; ✕ rotates 90° | Hover | 400ms | Plays on tap |
| V6 | Success ring spins in | Success opens | 1.0s ease-out | Same |
| V7 | Yellow dot pops in | +200ms | 700ms spring | Same |
| V8 | Check mark draws itself | +650ms | 600ms ease-out | Same |
| V9 | Confetti bursts in brand colours, falls and fades | Success opens | 2.2s | 80 pieces instead of 120 |
