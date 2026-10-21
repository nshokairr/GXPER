/**
 * C2 / F2  Cursor spotlight
 * A soft yellow light follows the mouse inside capability cards and the
 * final CTA panel. Writes --gx-mx / --gx-my (px, relative to the element);
 * the CSS ::before gradient reads them.
 *
 * Markup:  <article class="gx-card" data-gx-spotlight>…</article>
 * Works with mouse and touch: on phones the light follows the finger.
 */
import { $$ } from '../core/env.js';

export function initSpotlights(root = document) {
  const els = $$('[data-gx-spotlight]', root);
  const handlers = els.map((el) => {
    const fn = (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--gx-mx', `${e.clientX - r.left}px`);
      el.style.setProperty('--gx-my', `${e.clientY - r.top}px`);
    };
    el.addEventListener('pointermove', fn, { passive: true });
    return fn;
  });
  return { destroy() { els.forEach((el, i) => el.removeEventListener('pointermove', handlers[i])); } };
}
