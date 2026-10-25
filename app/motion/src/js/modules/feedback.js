/**
 * I6–I11 · Form + state feedback
 *
 *   focusField(fieldEl)        I6 lime ring settles in; only one field at a time
 *   toggleTick(boxEl)          I7 checkbox pops (spring) and the check draws
 *   pulse(host, rect)          I8 one-off ring for chips, toggles, accordions
 *   flashTargets(viewport)     I9 tap on empty space → all tappable areas flash
 *   toast(toastEl, message)    I11 yellow pill springs up for 2s
 */
import { FEEDBACK } from '../../tokens/app-motion-tokens.js';
import { el, restartClass } from '../core/env.js';

export function focusField(field) {
  const root = field.closest('.gxa-screen') || document;
  root.querySelectorAll('.gxa-field.is-focused').forEach((f) => f !== field && f.classList.remove('is-focused'));
  restartClass(field, 'is-focused');
}

const CHECK = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" stroke="#fff400" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>';

/** Toggle a checkbox. `box` is the visual square; state lives in aria-checked. */
export function toggleTick(box) {
  const on = box.getAttribute('aria-checked') !== 'true';
  box.setAttribute('aria-checked', String(on));
  box.classList.toggle('gxa-tick', on);
  box.innerHTML = on ? CHECK : '';
  if (on) restartClass(box, 'gxa-tick');
  return on;
}

export function pulse(host, { left, top, width, height }) {
  const p = el('div', 'gxa-pulse', { left: `${left}px`, top: `${top}px`, width: `${width}px`, height: `${height}px` });
  host.appendChild(p);
  setTimeout(() => p.remove(), FEEDBACK.pulseMs + 50);
}

export function flashTargets(viewport) {
  restartClass(viewport, 'gxa-flash');
  clearTimeout(flashTargets.t);
  flashTargets.t = setTimeout(() => viewport.classList.remove('gxa-flash'), FEEDBACK.flashMs + 50);
}

export function toast(toastEl, message) {
  toastEl.textContent = message;
  toastEl.classList.add('is-shown');
  clearTimeout(toast.t);
  toast.t = setTimeout(() => toastEl.classList.remove('is-shown'), FEEDBACK.toastHoldMs);
}
