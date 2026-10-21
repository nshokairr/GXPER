# 02 · Motion tokens

All values live in **`src/tokens/motion-tokens.css`** (CSS custom properties)
and **`src/tokens/motion-tokens.js`** (same values for JavaScript). Change a value
there and every animation using it updates. Never type a raw duration or curve
inside a component.

## Easing

| Token | Value | Use it for |
|---|---|---|
| `--gx-ease-out` | `cubic-bezier(.22, 1, .36, 1)` | Default for entrances, moves, hovers, page wipe |
| `--gx-ease-spring` | `cubic-bezier(.34, 1.56, .64, 1)` | Small pops: arrow nudge, icons, badges, modal panel, map pin |
| `--gx-ease-in-out` | `ease-in-out` | Ambient loops (float, breathe, glow) |
| `--gx-ease-linear` | `linear` | Endless rotation and light sweeps |

## Durations: interaction

| Token | ms | Examples |
|---|---|---|
| `--gx-dur-instant` | 200 | Colour-only changes |
| `--gx-dur-fast` | 300 | Hover border/background, menu fade |
| `--gx-dur-quick` | 350 | Button lift, arrow nudge, social icons, badges |
| `--gx-dur-base` | 450 | Nav underline, overlay fade, selected-city roll |
| `--gx-dur-medium` | 550 | Metric tile fill, menu links |
| `--gx-dur-slow` | 700 | Modal panel rise, button sheen, card bar, title wipe |
| `--gx-dur-slower` | 900 | Scroll reveal, page wipe, ghost number, ripple |
| `--gx-dur-hero` | 1000 | Headline line-up, number roll, success ring |

## Durations: ambient loops

| Token | Value | Used by |
|---|---|---|
| `--gx-loop-blink` | 2.4s | "Launching across" dot |
| `--gx-loop-ping` | 3.2s | Orbit ripples |
| `--gx-loop-glow` | 3.2s | Journey glow |
| `--gx-loop-float` | 4s | Journey visual float |
| `--gx-loop-breathe` | 4.5s | Orbit halo, GXPER mark glow |
| `--gx-loop-runner` | 4.5s | Light running along the hero line |
| `--gx-loop-bob` | 6s | App phones floating |
| `--gx-loop-border` | 6s | Final CTA rotating border |
| `--gx-loop-sweep` | 7s | Hero light sweep |
| `--gx-loop-radar` | 9s | Orbit radar cone |
| `--gx-loop-orbit` | 16s | Orbit satellite |
| `--gx-loop-pan` | 26s | Request map slow pan |

## Distances and stagger

| Token | Desktop | Phone (≤ 760px) | Use |
|---|---|---|---|
| `--gx-shift-xs` | 2px | 2px | Button lift |
| `--gx-shift-sm` | 4px | 4px | Card lift, arrow nudge |
| `--gx-shift-md` | 16px | 16px | Menu links, journey description |
| `--gx-shift-reveal` | 34px | **24px** | Scroll reveal travel |
| `--gx-shift-mask` | 24px | 24px | Masked headline travel |
| `--gx-shift-phone` | 90px | **48px** | Phone mock entrance |
| `--gx-stagger-tight` | 50ms | 50ms | Menu links |
| `--gx-stagger` | 80ms | 80ms | Cards, list rows, metric tiles |
| `--gx-stagger-loose` | 150ms | 150ms | Phones |

## Journey and page transition (JS)

| Token (`motion-tokens.js`) | Value | Meaning |
|---|---|---|
| `JOURNEY.stepMs` | 5200 | Each journey step stays on screen 5.2s |
| `JOURNEY.swapMs` | 380 | New title written 380ms into the change |
| `JOURNEY.descLagMs` | 120 | Description returns 120ms after the title |
| `JOURNEY.startProgress` | 0.62 | First step starts 62% done, so the first change comes after ~2s |
| `PAGE_TRANSITION.totalMs` | 900 | Full wipe in + out |
| `PAGE_TRANSITION.swapAtMs` | 430 | Page content swaps while the screen is covered |
| `PARALLAX.heroContent` | 0.22 | Hero text moves at 22% of scroll speed |
| `PARALLAX.heroFadeEnd` | 760 | Hero text fully faded after 760px of scroll |
| `PARALLAX.heroBackground` | 0.12 | Hero photo moves at 12% of scroll speed |
| `PARALLAX.phoneSpeeds` | −0.06 / 0.04 / −0.03 | App phones, desktop only |
| `REVEAL.rootMargin` | `0px 0px -6% 0px` | Reveal when the element is 6% inside the viewport |
| `REVEAL.preHideBelow` | 0.92 | Only hide elements starting below 92% of the first screen |
