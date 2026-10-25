/* Demo wiring: a tiny navigator built only from the public GXAppMotion API.
   Read this file to see how the pieces fit together in a real app shell. */
(() => {
  const M = window.GXAppMotion, T = M.tokens;
  const vp = document.getElementById('vp'), wipeEl = document.getElementById('wipe'), toastEl = document.getElementById('toast');

  const AUTH = new Set(['splash', 'welcome']);
  const TABS = new Set(['home', 'board', 'profile']);
  let cur = null, curName = '', stack = [], busy = false, overlay = null, live = [], under = null;

  const make = (name) => document.getElementById('s-' + name).content.firstElementChild.cloneNode(true);

  function setup(screen, name) {
    live.forEach((x) => x.destroy && x.destroy()); live = [];
    const sc = screen.querySelector('.gxa-scroller');
    if (sc) live.push(M.initDragScroll(sc));
    if (name === 'detail') renderSegment(screen, 'details');
    if (name === 'welcome') live.push(M.sparks(screen, { height: 420 }));
    if (name === 'splash') live.push(M.sparks(screen), M.autoAdvance(() => go('welcome', { forced: 'wipe' })));
    if (name === 'alert' || name === 'success') live.push(M.sparks(screen, { height: 470, alert: true }));
    if (name === 'success') setTimeout(() => curName === 'success' && M.confetti(vp), T.SIGNATURE.confettiDelayMs);
    if (name === 'gone') { const w = screen.querySelector('.badge-wrap'); M.pingRings(w, 55, 55, 96); }
    const sw = screen.querySelector('[data-swipe]');
    if (sw) live.push(M.initSwipe(sw, { follow: screen.querySelector('.gxa-scroller'), onLeft: () => go('profile', { forced: 'swipeL', game: +1 }), onRight: () => go('profile', { forced: 'swipeR', game: -1 }) }));
  }

  const GAMES = [['FC26', '#18361f'], ['TEKKEN 8', '#3a1414'], ['ROCKET LEAGUE', '#132a45']];
  let game = 0;

  async function go(name, o = {}) {
    if (busy || !document.getElementById('s-' + name)) return;
    busy = true;
    if (overlay) { await overlay.close(true); overlay = null; }
    const next = make(name), prev = cur;
    if (name === 'profile' && o.game) { game = (game + o.game + 3) % 3; }
    if (name === 'profile') { const c = next.querySelector('.pcard'); c.querySelector('.game').textContent = GAMES[game][0]; c.style.background = `linear-gradient(160deg,${GAMES[game][1]},#141110 70%)`; }
    const kind = M.chooseTransition({
      forced: o.forced,
      fromAuth: AUTH.has(curName), toAuth: AUTH.has(name),
      fromIsGoodbye: curName === 'gone',
      toIsSheetScreen: name === 'confirm',
      tappedTabBar: TABS.has(curName) && TABS.has(name) && !o.forced,
      inBackStack: stack.includes(name),
    });
    const reveal = (s, opt) => M.revealScreen(s, opt);
    if (!prev) { vp.appendChild(next); reveal(next, { delay: .15 }); }
    else if (kind === 'wipe') { stack = []; await M.gradientWipe(wipeEl, () => { prev.remove(); vp.appendChild(next); reveal(next, { delay: .2 }); }); }
    else if (kind === 'tab') { stack = []; reveal(next, { delay: .12 }); await M.tabSwitch(vp, next, prev); }
    else if (kind === 'sheetin') { stack.push(curName); await M.sheetScreenIn(vp, next, [...next.querySelectorAll('[data-sheet-part]')], { travel: 300 }); }
    else if (kind === 'pop' || kind === 'swipeR') { if (kind === 'pop') stack = stack.slice(0, stack.lastIndexOf(name)); else reveal(next, { delay: .12, soft: true }); await M.pop(vp, next, prev); }
    else { if (kind === 'push') stack.push(curName); reveal(next, { delay: .16, soft: true }); await M.push(vp, next, prev); }
    if (kind === 'sheetin') under = prev;            // keep the screen visible under the sheet
    else { if (prev && prev.isConnected) prev.remove(); if (under) { under.remove(); under = null; } }
    cur = next; curName = name; setup(next, name); busy = false;
  }

  async function back() {
    if (busy) return;
    if (overlay) { await overlay.close(); overlay = null; return; }
    if (!stack.length) { M.flashTargets(vp); return; }
    const name = stack.pop();
    if (curName === 'confirm') {
      busy = true; const prev = cur, next = under || make(name); under = null;
      if (next.isConnected) next.remove();
      await M.sheetScreenOut(vp, next, prev, [...prev.querySelectorAll('[data-sheet-part]')], { travel: 300 });
      cur = next; curName = name; setup(next, name); busy = false; return;
    }
    stack.push(name); return go(name);
  }

  function renderSegment(screen, which) {
    const body = screen.querySelector('.segbody');
    const rows = { details: ['Location · Jeddah', 'Reward · SR 150,000', 'Dates · Jun 1 – Aug 31', 'Participants · 12 / 24'], matches: ['No matches yet'], sponsors: ['Gold · Mercedes-Benz', 'Gold · McDonald’s', 'Silver · Amazon Prime'] }[which];
    body.innerHTML = rows.map((r, i) => `<div class="li" data-gxa-reveal data-y="${400 + i * 60}">${r}</div>`).join('');
  }
  async function segment(btn) {
    const screen = btn.closest('.gxa-screen');
    screen.querySelectorAll('.seg button').forEach((b) => b.classList.toggle('on', b === btn));
    const old = [...screen.querySelectorAll('.segbody [data-gxa-reveal]')];
    await Promise.all(old.map((b) => b.animate([{ opacity: 1 }, { opacity: 0 }], { duration: T.TRANSITION.segmentOutMs, easing: 'ease-in', fill: 'both' }).finished));
    renderSegment(screen, btn.dataset.seg);
    M.revealScreen(screen, { from: 380, delay: 0 });
  }

  async function openOverlay(kind) {
    const tpl = document.getElementById('t-' + kind).content.firstElementChild.cloneNode(true);
    overlay = kind === 'sheet' ? await M.openSheet(vp, tpl, { onClose: () => { overlay = null; } }) : await M.openModal(vp, tpl, { onClose: () => { overlay = null; } });
  }

  M.initPress(vp, { scale: () => vp.getBoundingClientRect().width / 393 });

  vp.addEventListener('click', async (e) => {
    const t = e.target;
    const tab = t.closest('[data-tab]'); const seg = t.closest('[data-seg]');
    const field = t.closest('[data-field]'); const tick = t.closest('[data-tick]');
    const goEl = t.closest('[data-go]'); const openEl = t.closest('[data-open]');
    if (t.closest('[data-share]')) { M.toast(toastEl, t.closest('[data-share]').dataset.share); overlay && overlay.close(); return; }
    if (t.closest('[data-close]')) { await M.afterTap(); overlay && overlay.close(); return; }
    if (tab) { await M.afterTap(); return go(tab.dataset.tab); }
    if (seg) return segment(seg);
    if (field) return M.focusField(field);
    if (tick) return M.toggleTick(tick);
    if (openEl) { await M.afterTap(); return openOverlay(openEl.dataset.open); }
    if (t.closest('[data-back]')) { await M.afterTap(); return back(); }
    if (t.closest('[data-logout]')) { if (t.closest('[data-gxa-press="cta"]')) await M.runCta(t.closest('button')); return go('welcome', { forced: 'wipe' }); }
    if (t.closest('[data-login]')) { await M.runCta(t.closest('button')); return go('home', { forced: 'wipe' }); }
    if (goEl) {
      if (goEl.dataset.gxaPress === 'cta') await M.runCta(goEl); else await M.afterTap();
      if (goEl.hasAttribute('data-reset')) stack = [];
      return go(goEl.dataset.go);
    }
    if (!t.closest('button')) M.flashTargets(vp);
  });
  vp.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { const k = e.target.closest('[data-tick]'); if (k) { e.preventDefault(); M.toggleTick(k); } } });

  /* side-panel buttons */
  const actions = {
    T1: () => go(curName === 'home' ? 'detail' : 'home', curName === 'home' ? {} : { forced: 'push' }),
    T2: () => back(),
    T3: () => go(curName === 'board' ? 'profile' : 'board', TABS.has(curName) ? {} : { forced: 'tab' }),
    T4: async () => { if (curName !== 'detail') await go('detail'); const b = [...cur.querySelectorAll('.seg button')].find((x) => !x.classList.contains('on')); segment(b); },
    T5: () => go(AUTH.has(curName) ? 'home' : 'welcome', { forced: 'wipe' }),
    T6: async () => { if (curName !== 'profile') await go('profile', { forced: 'tab' }); go('profile', { forced: 'swipeL', game: 1 }); },
    T7: async () => { if (curName !== 'settings') { stack = []; await go('settings', { forced: 'push' }); } go('confirm'); },
    T8: () => curName === 'confirm' ? back() : actions.T7(),
    E1: () => cur && M.revealScreen(cur, { delay: .1 }),
    E5: () => go('home', { forced: 'tab' }),
    I5: async () => { if (curName !== 'form') await go('form', { forced: 'push' }); M.runCta(cur.querySelector('[data-gxa-press="cta"]')); },
    I6: async () => { if (curName !== 'form') await go('form', { forced: 'push' }); M.focusField(cur.querySelector('[data-field]')); },
    I7: async () => { if (curName !== 'form') await go('form', { forced: 'push' }); M.toggleTick(cur.querySelector('[data-tick]')); },
    I8: () => { const r = vp.getBoundingClientRect(), c = cur.querySelector('.chip, .seg button, .li'); if (!c) return; const b = c.getBoundingClientRect(), k = r.width / 393; M.pulse(vp, { left: (b.left - r.left) / k, top: (b.top - r.top) / k, width: b.width / k, height: b.height / k }); },
    I9: () => M.flashTargets(vp),
    I11: () => M.toast(toastEl, 'Email copied: hello@scooring.com'),
    S1: async () => { if (curName !== 'form') await go('form', { forced: 'push' }); openOverlay('sheet'); },
    S4: async () => { if (curName !== 'profile') await go('profile', { forced: 'tab' }); openOverlay('modal'); },
    U1: () => go('splash', { forced: 'wipe' }),
    U5: () => go('welcome', { forced: 'wipe' }),
    U8: () => go('alert', { forced: 'wipe' }),
    U9: () => M.confetti(vp),
    U10: () => go('gone', { forced: 'wipe' }),
  };
  document.querySelector('.side').addEventListener('click', (e) => { const b = e.target.closest('[data-demo]'); if (b && actions[b.dataset.demo]) actions[b.dataset.demo](); });

  // every tappable thing is a flash target (I9)
  new MutationObserver(() => vp.querySelectorAll('button,[data-field],[data-tick]').forEach((b) => b.setAttribute('data-gxa-target', ''))).observe(vp, { childList: true, subtree: true });

  const fit = () => { const ph = document.querySelector('.phone'); const k = Math.min(1, (innerHeight - 48) / 852); ph.style.setProperty('--k', k.toFixed(3)); ph.style.margin = `${-(852 * (1 - k)) / 2}px ${-(393 * (1 - k)) / 2}px`; };
  addEventListener('resize', fit); fit();
  go('splash');
})();
