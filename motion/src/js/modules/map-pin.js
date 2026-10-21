/**
 * V2–V4  Location picker pin
 *
 * Markup
 *   <div class="gx-map" data-gx-map tabindex="0" aria-label="Map, click to place the pin">
 *     <img data-gx-map-img src="map-location.jpg" width="976" height="355" alt="">
 *     <div class="gx-map__pin" data-gx-map-pin><div class="gx-map__pin-drop" data-gx-map-pin-drop>…pin svg…</div></div>
 *   </div>
 *   <span class="gx-roll-text"><span data-gx-map-label>Jeddah, Saudi Arabia</span></span>
 *
 * Behaviour
 *   click / tap      pin glides to the point (700ms spring), drops from
 *                    26px above (600ms spring), ripple spreads (900ms),
 *                    nearest city is selected, label rolls to the new name
 *   arrow keys       nudge the pin 12 map-px (accessible alternative)
 *   resize           pin repositions instantly (no animation)
 *
 * Map coordinates are in the artwork's own pixels (976 × 355) so they stay
 * correct at any rendered size.
 */
import { prefersReducedMotion, $, restartClass } from '../core/env.js';

const ART_W = 976, ART_H = 355;

export function initMapPin(map, { cities = [], start = { x: 477, y: 184 }, onChange } = {}) {
  if (!map) return null;
  const img = $('[data-gx-map-img]', map);
  const pin = $('[data-gx-map-pin]', map);
  const drop = $('[data-gx-map-pin-drop]', map);
  const label = $('[data-gx-map-label]');
  let pos = { ...start };

  const scale = () => ({ sx: img.clientWidth / ART_W, sy: img.clientHeight / ART_H, ox: img.offsetLeft, oy: img.offsetTop });
  const place = (x, y, animate) => {
    pos = { x, y };
    const m = scale();
    pin.style.transition = animate ? '' : 'none';
    pin.style.transform = `translate(${m.ox + x * m.sx}px, ${m.oy + y * m.sy}px)`;
  };
  const nearest = (x, y) => cities.reduce((best, c) => {
    const d = (c.x - x) ** 2 + (c.y - y) ** 2;
    return d < best.d ? { c, d } : best;
  }, { c: null, d: Infinity }).c;
  const ripple = (px, py) => {
    if (prefersReducedMotion()) return;
    const r = document.createElement('i');
    r.className = 'gx-map__ripple';
    r.style.left = `${px}px`; r.style.top = `${py}px`;
    map.appendChild(r);
    setTimeout(() => r.remove(), 950);
  };
  const setLabel = (text) => {
    if (!label || label.textContent === text) return;
    label.classList.add('is-out');
    setTimeout(() => { label.textContent = text; label.classList.remove('is-out'); }, prefersReducedMotion() ? 0 : 220);
  };
  const dropTo = (x, y) => {
    place(x, y, true);
    if (drop && !prefersReducedMotion()) restartClass(drop, 'is-dropping');
    const m = scale();
    ripple(m.ox + x * m.sx, m.oy + y * m.sy);
    const c = nearest(x, y);
    if (c) { setLabel(`${c.name}, ${c.country}`); onChange?.(c); }
  };

  const onClick = (e) => {
    const r = map.getBoundingClientRect(), m = scale();
    dropTo((e.clientX - r.left - m.ox) / m.sx, (e.clientY - r.top - m.oy) / m.sy);
  };
  const onKey = (e) => {
    const k = { ArrowLeft: [-12, 0], ArrowRight: [12, 0], ArrowUp: [0, -12], ArrowDown: [0, 12] }[e.key];
    if (!k) return;
    e.preventDefault();
    dropTo(Math.max(0, Math.min(ART_W, pos.x + k[0])), Math.max(0, Math.min(ART_H, pos.y + k[1])));
  };
  const onResize = () => place(pos.x, pos.y, false);
  map.addEventListener('click', onClick);
  map.addEventListener('keydown', onKey);
  addEventListener('resize', onResize);
  place(pos.x, pos.y, false);

  return {
    dropTo,
    refresh: onResize,  // call after the modal becomes visible
    destroy() { map.removeEventListener('click', onClick); map.removeEventListener('keydown', onKey); removeEventListener('resize', onResize); },
  };
}
