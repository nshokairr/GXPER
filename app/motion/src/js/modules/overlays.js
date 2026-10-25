/**
 * S1–S6 · Bottom sheets and popups
 *
 *   const o = await openSheet(viewport, sheetEl);    // S1 + S6
 *   const o = await openModal(viewport, cardEl);     // S4 + S6
 *   await o.close();          // S2 / S5
 *   await o.close(true);      // fast close (200ms) when navigating away
 *
 * Sheets get a 30px grab zone on top (S3): drag down; past 70px it closes,
 * otherwise it springs back in 450ms. Tapping the shade closes either type.
 */
import { OVERLAY, EASE } from '../../tokens/app-motion-tokens.js';
import { el, animate } from '../core/env.js';

function mount(viewport, card) {
  const wrap = el('div', 'gxa-overlay');
  const shade = el('div', 'gxa-shade');
  wrap.append(shade, card);
  viewport.appendChild(wrap);
  return { wrap, shade };
}

export async function openSheet(viewport, sheet, { scale = () => 1, onClose } = {}) {
  sheet.classList.add('gxa-sheet');
  const { wrap, shade } = mount(viewport, sheet);
  const grab = el('div', 'gxa-sheet-grab');
  sheet.appendChild(grab);

  let closing = false;
  const close = async (fast) => {
    if (closing) return; closing = true;
    const d = fast ? OVERLAY.sheetOutFastMs : OVERLAY.sheetOutMs;
    await Promise.all([
      animate(shade, [{ opacity: 1 }, { opacity: 0 }], { duration: d }),
      animate(sheet, [{ transform: getComputedStyle(sheet).transform }, { transform: 'translateY(100%)' }], { duration: d, easing: EASE.in }),
    ]);
    wrap.remove(); onClose && onClose();
  };
  shade.addEventListener('click', () => close());

  // S3 drag to dismiss
  let y0 = null, dy = 0;
  grab.addEventListener('pointerdown', (e) => {
    y0 = e.clientY; dy = 0; grab.setPointerCapture(e.pointerId);
    sheet.getAnimations().forEach((a) => { a.commitStyles(); a.cancel(); });
  });
  grab.addEventListener('pointermove', (e) => {
    if (y0 === null) return;
    dy = Math.max(0, (e.clientY - y0) / scale());
    sheet.style.transform = `translateY(${dy}px)`;
  });
  grab.addEventListener('pointerup', () => {
    if (y0 === null) return; y0 = null;
    if (dy > OVERLAY.dismissPx) close();
    else sheet.animate([{ transform: `translateY(${dy}px)` }, { transform: 'none' }], { duration: OVERLAY.snapBackMs, easing: EASE.spring })
      .finished.then(() => { sheet.style.transform = ''; });
  });

  await Promise.all([
    animate(shade, [{ opacity: 0 }, { opacity: 1 }], { duration: OVERLAY.shadeInMs, easing: 'ease-out' }),
    animate(sheet, [{ transform: 'translateY(100%)' }, { transform: 'none' }], { duration: OVERLAY.sheetInMs, easing: EASE.out }),
  ]);
  return { close, element: sheet };
}

export async function openModal(viewport, card, { onClose } = {}) {
  card.classList.add('gxa-modal');
  const { wrap, shade } = mount(viewport, card);
  const { modalFrom: f, modalTo: t } = OVERLAY;
  let closing = false;
  const close = async (fast) => {
    if (closing) return; closing = true;
    const d = fast ? OVERLAY.sheetOutFastMs : OVERLAY.sheetOutMs;
    await Promise.all([
      animate(shade, [{ opacity: 1 }, { opacity: 0 }], { duration: d }),
      animate(card, [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: `translateY(${t.y}px) scale(${t.scale})` }], { duration: d, easing: 'ease-in' }),
    ]);
    wrap.remove(); onClose && onClose();
  };
  shade.addEventListener('click', () => close());
  await Promise.all([
    animate(shade, [{ opacity: 0 }, { opacity: 1 }], { duration: OVERLAY.shadeInMs, easing: 'ease-out' }),
    animate(card, [{ opacity: 0, transform: `translateY(${f.y}px) scale(${f.scale})` }, { opacity: 1, transform: 'none' }], { duration: OVERLAY.modalInMs, easing: EASE.spring }),
  ]);
  return { close, element: card };
}
