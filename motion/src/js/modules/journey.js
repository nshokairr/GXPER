/**
 * J1–J8  Tournament journey controller
 *
 * Markup (classes from journey.css, hooks are data attributes)
 *   <section class="gx-journey" data-gx-journey>
 *     <div class="gx-journey__ghost"><span data-gx-journey-ghost>01</span></div>
 *     <p class="gx-journey__title" data-gx-journey-title>CHOOSE THE GAME</p>
 *     <p class="gx-journey__desc"  data-gx-journey-desc>Pick the game…</p>
 *     <div class="gx-journey__visual" data-gx-journey-visual>…</div>   × 4, in order
 *     <div class="gx-journey__progress" data-gx-journey-progress></div>
 *     <button class="gx-journey__step" data-gx-journey-step>…</button>  × 4, in order
 *   </section>
 *
 * Steps data comes from the buttons:
 *   <button data-gx-journey-step data-title="SET THE LOCATION" data-desc="Choose your city…">
 *
 * Behaviour
 *   • Advances every 5.2s (JOURNEY.stepMs), loops after step 4.
 *   • The first step starts 62% filled so the first change comes in ~2s.
 *   • Pauses: mouse over the section · section < 35% visible · tab hidden ·
 *     controller.pause() (e.g. when another page is shown in an SPA).
 *   • Click / Enter / Space on a step jumps to it and restarts its timer.
 *   • Left / Right arrow keys move between steps when a step has focus.
 *   • Reduced motion: no auto-play; clicking still changes the step
 *     instantly, without the wipe/flicker.
 *
 * API:  const j = initJourney(section);  j.go(2); j.pause(); j.resume(); j.destroy();
 */
import { JOURNEY } from '../../tokens/motion-tokens.js';
import { prefersReducedMotion, $, $$, restartClass } from '../core/env.js';
import { subscribe } from '../core/frame-loop.js';

export function initJourney(section) {
  if (!section) return null;
  const steps = $$('[data-gx-journey-step]', section);
  const visuals = $$('[data-gx-journey-visual]', section);
  const title = $('[data-gx-journey-title]', section);
  const desc = $('[data-gx-journey-desc]', section);
  const ghost = $('[data-gx-journey-ghost]', section);
  const progress = $('[data-gx-journey-progress]', section);
  const data = steps.map((b) => ({ title: b.dataset.title, desc: b.dataset.desc }));
  const count = steps.length;

  let index = 0;
  let elapsed = JOURNEY.stepMs * JOURNEY.startProgress;
  let hovered = false, inView = false, manualPause = false;
  let swapTimer = 0, descTimer = 0;

  function paint(i, animate) {
    steps.forEach((s, k) => {
      s.classList.toggle('is-active', k === i);
      s.classList.toggle('is-done', k < i);
      s.setAttribute('aria-selected', String(k === i));
      s.tabIndex = k === i ? 0 : -1;
    });
    visuals.forEach((v, k) => v.classList.toggle('is-hidden', k !== i));
    const v = visuals[i];
    if (v) { v.classList.remove('is-switching'); if (animate) restartClass(v, 'is-switching'); }

    const write = () => {
      if (title && data[i].title) title.textContent = data[i].title;
      if (desc && data[i].desc) desc.textContent = data[i].desc;
      if (ghost) ghost.textContent = String(i + 1).padStart(2, '0');
    };
    if (!animate) { write(); return; }

    // 1) wipe out title + description, slide ghost number up
    title?.classList.add('is-out');
    desc?.classList.add('is-out');
    if (ghost) ghost.style.transform = 'translateY(-100%)';
    clearTimeout(swapTimer); clearTimeout(descTimer);

    // 2) at 380ms write the new content and bring it back
    swapTimer = setTimeout(() => {
      write();
      if (ghost) {
        ghost.style.transition = 'none';
        ghost.style.transform = 'translateY(100%)';
        void ghost.offsetWidth;
        ghost.style.transition = '';
        ghost.style.transform = '';
      }
      title?.classList.remove('is-out');
      descTimer = setTimeout(() => desc?.classList.remove('is-out'), JOURNEY.descLagMs);
    }, JOURNEY.swapMs);
  }

  function go(i, { animate = !prefersReducedMotion() } = {}) {
    index = (i + count) % count;
    elapsed = 0;
    paint(index, animate);
  }

  // Continuous progress: the bar runs from the start of the active step to
  // the start of the next one (equal-width columns ⇒ (index + p) / count).
  const off = subscribe((now, dt) => {
    const playing = inView && !hovered && !manualPause && !document.hidden && !prefersReducedMotion();
    if (playing) elapsed += dt;
    const p = Math.min(1, elapsed / JOURNEY.stepMs);
    progress?.style.setProperty('--gx-journey-progress', ((index + p) / count).toFixed(4));
    steps[index]?.style.setProperty('--gx-step-progress', p.toFixed(3));
    if (p >= 1) go(index + 1);
  });

  // Visibility + hover pausing
  const io = new IntersectionObserver(([e]) => {
    inView = e.isIntersecting;
    section.classList.toggle('is-offscreen', !inView);
  }, { threshold: 0.35 });
  io.observe(section);
  const enter = (e) => { if (e.pointerType === 'mouse') hovered = true; };
  const leave = () => { hovered = false; };
  section.addEventListener('pointerenter', enter);
  section.addEventListener('pointerleave', leave);

  // Click + keyboard on the timeline
  const clicks = steps.map((s, k) => {
    const fn = () => go(k);
    s.addEventListener('click', fn);
    return fn;
  });
  const onKey = (e) => {
    // ← / → follow the reading direction: in Arabic (dir=rtl) ← is "next"
    const rtl = getComputedStyle(section).direction === 'rtl';
    const k = { ArrowRight: rtl ? -1 : 1, ArrowLeft: rtl ? 1 : -1 }[e.key];
    if (!k || !e.target.matches('[data-gx-journey-step]')) return;
    e.preventDefault();
    go(index + k);
    steps[index].focus();
  };
  section.addEventListener('keydown', onKey);

  paint(0, false);

  return {
    go: (i) => go(i),
    pause: () => { manualPause = true; },
    resume: () => { manualPause = false; },
    get index() { return index; },
    destroy() {
      off(); io.disconnect();
      clearTimeout(swapTimer); clearTimeout(descTimer);
      section.removeEventListener('pointerenter', enter);
      section.removeEventListener('pointerleave', leave);
      section.removeEventListener('keydown', onKey);
      steps.forEach((s, k) => s.removeEventListener('click', clicks[k]));
    },
  };
}
