/**
 * G4  Scroll progress bar
 * H8  Hero parallax (text drifts up + fades, photo moves slower)
 * A2  App phones parallax (all screen sizes)
 *
 * Markup
 *   <div class="gx-progress" data-gx-progress></div>
 *   <div class="gx-hero__photo"   data-gx-hero-photo></div>
 *   <div class="gx-hero__content" data-gx-hero-content>…</div>
 *   <div class="gx-phone" data-gx-parallax="-0.06"><div class="gx-phone__parallax">…</div></div>
 *
 * All work happens in one passive scroll listener, throttled to one update
 * per frame, and only writes transform/opacity (GPU-friendly, no layout).
 */
import { PARALLAX } from '../../tokens/motion-tokens.js';
import { prefersReducedMotion, $, $$ } from '../core/env.js';
import { rafThrottle } from '../core/frame-loop.js';

export function initScrollEffects(root = document) {
  const bar = $('[data-gx-progress]', root);
  const heroContent = $('[data-gx-hero-content]', root);
  const heroPhoto = $('[data-gx-hero-photo]', root);
  const phones = $$('[data-gx-parallax]', root);

  const update = rafThrottle(() => {
    const max = document.documentElement.scrollHeight - innerHeight;
    if (bar) bar.style.setProperty('--gx-progress', max > 0 ? (scrollY / max).toFixed(4) : '0');
    if (prefersReducedMotion()) return;

    const y = scrollY;
    if (y < PARALLAX.heroLimit) {
      if (heroContent) {
        heroContent.style.transform = `translateY(${(y * PARALLAX.heroContent).toFixed(1)}px)`;
        heroContent.style.opacity = Math.max(0, 1 - y / PARALLAX.heroFadeEnd).toFixed(3);
      }
      if (heroPhoto) heroPhoto.style.translate = `0 ${(y * PARALLAX.heroBackground).toFixed(1)}px`;
    }

    // Same on every screen size (desktop, tablet, phone)
    const mid = innerHeight / 2;
    phones.forEach((p) => {
      const r = p.getBoundingClientRect();
      const offset = r.top + r.height / 2 - mid;
      p.firstElementChild.style.setProperty('--gx-py', `${(offset * parseFloat(p.dataset.gxParallax)).toFixed(1)}px`);
    });
  });

  addEventListener('scroll', update, { passive: true });
  addEventListener('resize', update);
  update();

  return {
    update,
    destroy() {
      removeEventListener('scroll', update);
      removeEventListener('resize', update);
    },
  };
}
