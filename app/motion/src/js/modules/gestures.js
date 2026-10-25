/**
 * Gestures + scrolling
 *
 *   initSwipe(cardEl, { onLeft, onRight, follow: bodyEl })   T6 drag-to-switch
 *   initDragScroll(scroller)                                 mouse-drag scrolling (desktop review)
 *   initScrollProgress(scroller, barEl)                      E5 gradient progress line
 */
import { GESTURE, EASE } from '../../tokens/app-motion-tokens.js';

/** T6 · Horizontal swipe on a card. The content follows the finger at 35%
 *  once the drag is clearly horizontal (>8px and more X than Y). Released
 *  past 50px → onLeft/onRight (play the push/pop slide). Otherwise it
 *  springs back in 450ms. A plain tap (no drag) calls onTap. */
export function initSwipe(target, { onLeft, onRight, onTap, follow = target, scale = () => 1 } = {}) {
  const down = (e) => {
    const x0 = e.clientX, y0 = e.clientY;
    let dx = 0, active = false;
    const move = (ev) => {
      dx = (ev.clientX - x0) / scale();
      const dy = (ev.clientY - y0) / scale();
      if (!active && Math.abs(dx) > GESTURE.swipeLockPx && Math.abs(dx) > Math.abs(dy)) { active = true; target.setPointerCapture(ev.pointerId); }
      if (active) follow.style.transform = `translateX(${dx * GESTURE.swipeFollow}px)`;
    };
    const up = () => {
      removeEventListener('pointermove', move); removeEventListener('pointerup', up);
      if (!active) { onTap && onTap(); return; }
      if (Math.abs(dx) > GESTURE.swipeCommitPx) { follow.style.transform = ''; (dx < 0 ? onLeft : onRight)?.(); }
      else follow.animate([{ transform: follow.style.transform }, { transform: 'none' }], { duration: 450, easing: EASE.spring })
        .finished.then(() => { follow.style.transform = ''; });
    };
    addEventListener('pointermove', move); addEventListener('pointerup', up);
  };
  target.addEventListener('pointerdown', down);
  return { destroy() { target.removeEventListener('pointerdown', down); } };
}

/** Mouse only: click-and-drag scrolls like a Figma prototype. A drag of
 *  more than 5px cancels the click that would follow. */
export function initDragScroll(scroller, { scale = () => 1 } = {}) {
  let suppress = false;
  const down = (e) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    const y0 = e.clientY, s0 = scroller.scrollTop;
    let moved = false;
    const move = (ev) => {
      const dy = (ev.clientY - y0) / scale();
      if (Math.abs(dy) > GESTURE.dragScrollPx) moved = true;
      if (moved) scroller.scrollTop = s0 - dy;
    };
    const up = () => {
      removeEventListener('pointermove', move); removeEventListener('pointerup', up);
      if (moved) { suppress = true; setTimeout(() => { suppress = false; }, 50); }
    };
    addEventListener('pointermove', move); addEventListener('pointerup', up);
  };
  const click = (e) => { if (suppress) { e.stopPropagation(); e.preventDefault(); suppress = false; } };
  scroller.addEventListener('pointerdown', down);
  scroller.addEventListener('click', click, true);
  return { destroy() { scroller.removeEventListener('pointerdown', down); scroller.removeEventListener('click', click, true); } };
}

/** E5 · 2px brand-gradient line under the fixed header that grows with
 *  scroll; appears after 4px of scroll. Only on screens taller than ~872px. */
export function initScrollProgress(scroller, bar) {
  const on = () => {
    const max = scroller.scrollHeight - scroller.clientHeight;
    bar.style.setProperty('--p', (max > 0 ? scroller.scrollTop / max : 0).toFixed(4));
    bar.classList.toggle('is-on', scroller.scrollTop > 4);
  };
  scroller.addEventListener('scroll', on, { passive: true });
  return { destroy() { scroller.removeEventListener('scroll', on); } };
}
