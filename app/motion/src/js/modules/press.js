/**
 * I1–I5 · Tap feedback for every button
 *
 *   initPress(viewport);           // wires all [data-gxa-press] inside
 *   await runCta(button);          // I5 loading bar, resolves after 900ms
 *
 * What happens on a tap
 *   pointerdown  → I2 squeeze to 95.5% in 140ms (ease-out)
 *   pointerup    → I3 spring back to 100% in 500ms (spring curve)
 *   click        → I1 lime ring at the touch point grows ×6 and fades (750ms)
 *                → I4 sheen sweeps across if the button is ≥150px wide and
 *                   ≤56px tall, or data-gxa-press="wide" | "cta"
 *   then wait 120ms before acting so the ripple is seen (FEEDBACK.navDelayMs),
 *   or for a primary CTA (data-gxa-press="cta") show the I5 bar and wait 900ms.
 */
import { FEEDBACK } from '../../tokens/app-motion-tokens.js';
import { el, wait, prefersReducedMotion } from '../core/env.js';

export function ripple(host, x, y) {
  const r = el('i', 'gxa-ripple', { left: `${x}px`, top: `${y}px` });
  host.appendChild(r);
  setTimeout(() => r.remove(), FEEDBACK.rippleMs + 50);
}

export function shine(button) {
  let s = button.querySelector(':scope > .gxa-shine');
  if (!s) { s = el('i', 'gxa-shine'); button.appendChild(s); }
  button.classList.remove('is-shining'); void button.offsetWidth; button.classList.add('is-shining');
}

export async function runCta(button) {
  if (prefersReducedMotion()) return;
  button.classList.add('is-down');
  shine(button);
  const bar = el('i', 'gxa-loadbar');
  button.appendChild(bar);
  await wait(FEEDBACK.loadbarMs);
  bar.remove();
  button.classList.remove('is-down');
}

/** Wire squeeze/spring/ripple/sheen. `scale` = CSS px per screen px if the
 *  viewport is scaled (the prototype phone is shrunk to fit small windows). */
export function initPress(viewport, { scale = () => 1 } = {}) {
  let pressed = null;
  const down = (e) => {
    const b = e.target.closest('[data-gxa-press]');
    if (!b) return;
    pressed = b;
    b.classList.add('is-down');
  };
  const up = () => { if (pressed) pressed.classList.remove('is-down'); pressed = null; };
  const click = (e) => {
    const b = e.target.closest('[data-gxa-press]');
    if (!b) return;
    const r = viewport.getBoundingClientRect(), k = scale();
    ripple(viewport, (e.clientX - r.left) / k, (e.clientY - r.top) / k);
    const wide = b.dataset.gxaPress === 'wide' || b.dataset.gxaPress === 'cta' ||
      (b.offsetWidth >= FEEDBACK.shineMinWidth && b.offsetHeight <= FEEDBACK.shineMaxHeight);
    if (wide) shine(b);
  };
  viewport.addEventListener('pointerdown', down);
  addEventListener('pointerup', up);
  addEventListener('pointercancel', up);
  viewport.addEventListener('click', click);
  return { destroy() { viewport.removeEventListener('pointerdown', down); removeEventListener('pointerup', up); removeEventListener('pointercancel', up); viewport.removeEventListener('click', click); } };
}

/** Wait the standard 120ms after a tap before navigating. */
export const afterTap = () => wait(FEEDBACK.navDelayMs);
