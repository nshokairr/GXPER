/**
 * G7 / G8  Scroll reveal + number roll
 *
 * Markup
 *   <h2 data-gx-reveal="mask">…</h2>
 *   <p  data-gx-reveal style="--gx-delay:.1s">…</p>
 *   <ul data-gx-stagger=".08"> <li data-gx-reveal>…</li> … </ul>   (auto delays)
 *   <span data-gx-roll><span>01</span></span>
 *
 * Rules
 *   • Only elements that START below 92% of the viewport are hidden, so
 *     nothing on the first screen ever flashes or jumps.
 *   • Each element reveals once, when its top passes 6% above the bottom
 *     of the viewport. It never hides again on scroll-up.
 *   • With reduced motion nothing is hidden at all.
 *   • Call init() again after a client-side page change (SPA) — it
 *     disconnects the previous observers first.
 */
import { REVEAL } from '../../tokens/motion-tokens.js';
import { prefersReducedMotion, $$ } from '../core/env.js';

export function initReveal(root = document) {
  const reduced = prefersReducedMotion();
  const vh = innerHeight;

  // Auto-stagger children of [data-gx-stagger]
  $$('[data-gx-stagger]', root).forEach((group) => {
    const step = parseFloat(group.dataset.gxStagger) || 0.08;
    $$('[data-gx-reveal]', group).forEach((el, i) => {
      if (!el.style.getPropertyValue('--gx-delay')) el.style.setProperty('--gx-delay', `${(i * step).toFixed(2)}s`);
    });
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      // Phones in a horizontal swipe row: the ones off to the side never
      // intersect, so the whole row reveals together (stagger keeps the order).
      const row = e.target.closest('.gx-phones');
      (row ? $$('[data-gx-reveal]', row) : [e.target]).forEach((t) => {
        t.classList.remove('is-pending');
        io.unobserve(t);
      });
    });
  }, { rootMargin: REVEAL.rootMargin, threshold: 0 });

  $$('[data-gx-reveal]', root).forEach((el) => {
    if (reduced) { el.classList.remove('is-pending'); return; }
    if (el.getBoundingClientRect().top > vh * REVEAL.preHideBelow) {
      el.classList.add('is-pending');
      io.observe(el);
    } else {
      el.classList.remove('is-pending');
    }
  });

  // Number roll: reveal when 40% visible
  const rollIo = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.remove('is-pending');
      rollIo.unobserve(e.target);
    });
  }, { threshold: 0.4 });
  $$('[data-gx-roll]', root).forEach((el) => {
    if (reduced || el.getBoundingClientRect().top < vh) return;
    el.classList.add('is-pending');
    rollIo.observe(el);
  });

  return { destroy() { io.disconnect(); rollIo.disconnect(); } };
}
