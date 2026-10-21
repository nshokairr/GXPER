# 05 · Integration guide

The package is **framework-agnostic**: plain CSS + small ES modules, no runtime
dependencies. It works in Next.js, Nuxt, Astro, SvelteKit, Laravel/Blade or a
static site.

## 1. Add the files
Copy `src/` into the project (for example `src/motion/`), or build once and use
`dist/gxper-motion.css` + `dist/gxper-motion.js` (global `window.GXMotion`).

```css
/* global stylesheet, after your base/reset styles */
@import "motion/styles/gxper-motion.css";
```

```js
import { initMotion } from './motion/js/index.js';
const motion = initMotion();          // once the page DOM is ready
```

## 2. Mark up elements
The motion attaches through **classes for styling** (`gx-…`) and **data
attributes for behaviour** (`data-gx-…`). Copy the markup from `demo/index.html`;
each section there is labelled with its catalogue IDs.

| Want | Add |
|---|---|
| Reveal on scroll | `data-gx-reveal` (or `="mask"`, `="line"`, `="phone"`, `="divider"`) |
| Stagger children | `data-gx-stagger=".08"` on the parent |
| Custom delay | `style="--gx-delay:.2s"` |
| Number roll | `<span data-gx-roll><span>01</span></span>` |
| Cursor spotlight | `data-gx-spotlight` on `.gx-card` / `.gx-cta-panel` |
| Progress bar | `<div class="gx-progress" data-gx-progress>` |
| Hero parallax | `data-gx-hero-photo`, `data-gx-hero-content` |
| Phone parallax | `data-gx-parallax="-0.06"` |
| Sparks | `<canvas class="gx-hero__sparks" data-gx-sparks>` |
| Journey | `data-gx-journey` + the hooks listed in `journey.js` |
| Orbit | `data-gx-orbit-box` > `data-gx-orbit` |
| Menu | `data-gx-menu-toggle aria-controls="menu"` |
| Page wipe | `<div class="gx-wipe" data-gx-wipe><img class="gx-wipe__logo" …></div>` |

**Images**: use real `<img>`/`<picture>` for the hero, journey background and
wipe logo, not `url()` inside CSS variables. Bundlers resolve those paths
relative to the stylesheet and they break.

## 3. Framework examples

### React / Next.js
```jsx
'use client';
import { useEffect } from 'react';
import { initMotion } from '@/motion/js';

export default function MotionProvider({ children }) {
  useEffect(() => {
    const m = initMotion(document);
    return () => m.destroy();          // runs on route change / unmount
  }, []);
  return children;
}
```

A single component, for example the journey:
```jsx
useEffect(() => {
  const j = initJourney(ref.current);
  return () => j?.destroy();
}, []);
```

### Page transition with a router (Next.js App Router)
```js
import { pageTransition } from '@/motion/js';
const router = useRouter();
const go = (href) => pageTransition(() => router.push(href));
// <a href="/contact" onClick={(e) => { e.preventDefault(); go('/contact'); }}>
```
Links to a section on the same page should **not** use the wipe; use
`scrollToSection('request')`.

### Vue / Nuxt
```js
onMounted(() => { motion = initMotion(); });
onBeforeUnmount(() => motion?.destroy());
```

## 4. SSR notes
- All modules touch `window`/`document` only inside `init…()` calls, so import
  them freely but **call them on the client** (useEffect / onMounted).
- The CSS works without JS: nothing is hidden by default. `is-pending` is only
  added by JS, so a page without JS (or before hydration) shows everything.

## 5. API reference

| Function | Returns | Notes |
|---|---|---|
| `initMotion(root?)` | `{ destroy }` | Starts reveal, scroll effects, sparks, journey, orbit, spotlights, menu |
| `initReveal(root?)` | `{ destroy }` | Call again after new content mounts |
| `initScrollEffects(root?)` | `{ update, destroy }` | Progress + parallax |
| `initSparks(canvas)` | `{ destroy }` | No-op with reduced motion |
| `initJourney(section)` | `{ go(i), pause(), resume(), index, destroy }` | |
| `initOrbit(box)` | `{ destroy }` | |
| `initSpotlights(root?)` | `{ destroy }` | |
| `initMenu(root?)` | `{ open, close, destroy }` | |
| `pageTransition(swapFn)` | `Promise` | Resolves after 900ms |
| `scrollToSection(id)` | — | `null` = top |
| `replayEntrance(root)` | — | Restart inner-page hero entrance |
| `openOverlay(el)` / `closeOverlay(el)` | — / `Promise` | |
| `initMapPin(map, { cities, start, onChange })` | `{ dropTo, refresh, destroy }` | Call `refresh()` after the modal opens |
| `confetti()` | — | |
| `toast(message, ms?)` | — | |
| `flagFieldError(fieldEl)` | — | Restarts the shake |
| `tokens` | object | All JS tokens |
