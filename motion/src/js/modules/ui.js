/**
 * Small UI motions
 *   G10  Mobile menu open/close
 *   G9   Toast
 *   V1   Overlay open/close (map picker, success)
 *   R6   Field error shake
 */
import { prefersReducedMotion, $ } from '../core/env.js';

/* ---------- G10 Mobile menu ------------------------------------------------
   Markup:
     <button class="gx-burger" data-gx-menu-toggle aria-controls="menu" aria-expanded="false"><span></span></button>
     <nav id="menu" class="gx-menu"> <a class="gx-menu__link">…</a> … </nav>
   Toggles .is-menu-open on <body>. Closes on Escape or when a link is used. */
export function initMenu(root = document) {
  const btn = $('[data-gx-menu-toggle]', root);
  if (!btn) return null;
  const menu = document.getElementById(btn.getAttribute('aria-controls'));
  const set = (open) => {
    document.body.classList.toggle('is-menu-open', open);
    document.body.classList.toggle('is-scroll-locked', open);
    btn.setAttribute('aria-expanded', String(open));
  };
  const toggle = () => set(!document.body.classList.contains('is-menu-open'));
  const onKey = (e) => { if (e.key === 'Escape') set(false); };
  const onLink = (e) => { if (e.target.closest('a')) set(false); };
  btn.addEventListener('click', toggle);
  document.addEventListener('keydown', onKey);
  menu?.addEventListener('click', onLink);
  return {
    open: () => set(true),
    close: () => set(false),
    destroy() { btn.removeEventListener('click', toggle); document.removeEventListener('keydown', onKey); menu?.removeEventListener('click', onLink); },
  };
}

/* ---------- G9 Toast --------------------------------------------------------
   Markup: <div class="gx-toast" data-gx-toast role="status" aria-live="polite"></div>
   toast('Email copied')  — shows for 2.2s.                                  */
let toastTimer = 0;
export function toast(message, ms = 2200) {
  const el = $('[data-gx-toast]');
  if (!el) return;
  el.textContent = message;
  el.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('is-visible'), ms);
}

/* ---------- V1 Overlays -----------------------------------------------------
   Markup: <div class="gx-overlay" hidden> <div class="gx-overlay__panel">…</div> </div>
   openOverlay(el) / closeOverlay(el). Waits two frames before adding
   .is-open so the browser paints the start state first (otherwise the
   entrance would be skipped).                                              */
export function openOverlay(el) {
  el.hidden = false;
  document.body.classList.add('is-scroll-locked');
  requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('is-open')));
}
export function closeOverlay(el) {
  el.classList.remove('is-open');
  document.body.classList.remove('is-scroll-locked');
  return new Promise((r) => setTimeout(() => { el.hidden = true; r(); }, prefersReducedMotion() ? 0 : 420));
}

/* ---------- R6 Field error shake ------------------------------------------ */
export function flagFieldError(field) {
  field.classList.remove('is-error');
  void field.offsetWidth;
  field.classList.add('is-error');
}
