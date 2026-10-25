(() => {
'use strict';
const S = window.SCREENS;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const EASE = 'cubic-bezier(.22,1,.36,1)', SPRING = 'cubic-bezier(.34,1.56,.64,1)';
const VH = 852;
const START = '2010:11553';
const safe = id => id.replace(':', '-');
const img = id => `url(screens/${safe(id)}.webp)`;
const wait = ms => new Promise(r => setTimeout(r, RM ? 0 : ms));
const el = (tag, cls, css) => { const e = document.createElement(tag); if (cls) e.className = cls; if (css) Object.assign(e.style, css); return e; };

const SECTIONS = [
  ['onboarding', 'Onboarding', '2010:11553'],
  ['signup', 'Sign up & login', '73:5869'],
  ['tournaments', 'Tournaments', '1:79288'],
  ['profile', 'Leaderboard & profile', '1:119926'],
  ['settings', 'More & settings', '73:21265'],
  ['delete', 'Delete account', '2023:37254'],
  ['referee', 'Referee', '123:21661'],
  ['alerts', 'System alerts', '246:12395']
];
const AUTH = new Set(['2010:11553', '2010:11567', '2013:11594', '73:5869', '73:50013', '73:8711', '73:11539', '73:13409', '73:14354', '73:19958', '123:21661', '128:11728']);
const SHEET_FROM = {'2027:12575': 600};

/* per-screen signature moments */
const FX = {
  '2010:11553': {merge: [357, 495, 'glow'], loader: [131, 734, 132, 4], corners: true, sparks: [0, 852], auto: ['2010:11567', 2900]},
  '2010:11567': {first: 'kb', sweep: [0, 402], sparks: [0, 402]},
  '2013:11594': {first: 'kb', sweep: [0, 515], sparks: [0, 515]},
  '2027:13561': {spin: [196.5, 355], ping: [196.5, 355, 96]},
  '1:107042': {glow: 1, sparks: [0, 460], confetti: 700},
  '246:12395': {glow: 1, sparks: [0, 470]}, '246:13333': {glow: 1, sparks: [0, 470]}, '246:14271': {glow: 1, sparks: [0, 470]},
  '246:15209': {glow: 1, sparks: [0, 470]}, '248:11521': {glow: 1, sparks: [0, 470]}, '248:12459': {glow: 1, sparks: [0, 470]},
  '248:13397': {glow: 1, sparks: [0, 470]}, '249:14338': {glow: 1, sparks: [0, 470], red: 1}
};

/* ---------- refs ---------- */
const vp = $('#vp'), phone = $('#phone'), wipeEl = $('#wipe'), toastEl = $('#toast');
let cur = null, curView = null, stack = [], ov = null, lock = false, showHs = false;

/* ---------- toast ---------- */
let tt;
function say(msg) { toastEl.textContent = msg; toastEl.classList.add('show'); clearTimeout(tt); tt = setTimeout(() => toastEl.classList.remove('show'), 2000); }

/* ---------- phone scale ---------- */
let K = 1;
function fit() {
  const dev = $('#dev'), w = dev.clientWidth, h = dev.clientHeight;
  const small = innerWidth <= 520;
  const pad = small ? 0 : 76;
  K = Math.min((w - pad) / 393, (h - pad) / VH, small ? 9 : 1);
  phone.style.setProperty('--k', K.toFixed(4));
}
addEventListener('resize', fit);

/* ---------- building a screen from its slices ---------- */
function band(y0, y1, kind, color, off = 0) {
  const b = el('div', 'bd ' + kind, {top: (y0 - off) + 'px', height: (y1 - y0) + 'px'});
  if (kind.includes('c') && color) b.style.backgroundColor = color;
  const s = el('span'); s.style.setProperty('--by', (-y0) + 'px');
  b.appendChild(s); b.dataset.y0 = y0; b.dataset.y1 = y1;
  return b;
}
function label(a) {
  const t = a[0], d = a.slice(1);
  if (t === 'B') return 'Back';
  if (t === 'X') return 'Close';
  if (t === 'N') return 'Go to ' + S[d].n;
  if (t === 'O') return 'Open ' + S[d].n;
  return 'Interact';
}
function hotspot(h, off, view) {
  const [x, y, w, hh, a, , drag] = h;
  const b = el('button', 'hs' + (drag ? ' drag' : ''), {left: x + 'px', top: (y - off) + 'px', width: w + 'px', height: hh + 'px'});
  b.setAttribute('aria-label', drag ? 'Swipe to switch game' : label(a));
  b._h = h; b._view = view; b._off = off;
  return b;
}
function buildScreen(id) {
  const d = S[id];
  const root = el('div', 'scr');
  root.style.setProperty('--img', img(id));
  root.style.setProperty('--sw', d.w + 'px');
  root.style.background = d.bg;
  const sc = el('div', 'sc'), body = el('div', 'body', {height: d.h + 'px', background: d.bg});
  const view = {id, d, root, sc, body, bands: []};
  let bands = d.b.map(b => b.slice());
  const fx = FX[id] || {};
  if (fx.merge) {
    const [m0, m1, cls] = fx.merge;
    bands = bands.filter(b => b[1] <= m0 || b[0] >= m1);
    bands.push([m0, m1, d.bg, 1, cls]);
    bands.sort((a, b) => a[0] - b[0]);
  }
  const first = bands.length ? bands[0][0] : 0;
  if (!d.top && first > 0) body.appendChild(band(0, first, 's'));
  let firstContent = true;
  for (const [y0, y1, col, c, extra] of bands) {
    let k = c ? 'c' : 's';
    if (c) {
      if (y1 - y0 > 260) k += ' big';
      if (extra) k += ' ' + extra;
      if (firstContent && fx.first) k += ' ' + fx.first;
      if (fx.spin && fx.spin[1] >= y0 && fx.spin[1] <= y1) k += ' spin';
      firstContent = false;
    }
    const b = band(y0, y1, k, col);
    if (k.includes('spin')) { b.style.setProperty('--ox', fx.spin[0] + 'px'); b.style.setProperty('--oy', (fx.spin[1] - y0) + 'px'); }
    body.appendChild(b);
    if (c) view.bands.push(b);
  }
  sc.appendChild(body);
  root.appendChild(sc);
  if (d.top) {
    const t = el('div', 'fxt', {height: d.top + 'px'});
    t.appendChild(band(0, d.top, 's'));
    view.top = t; root.appendChild(t);
  }
  if (d.bot) {
    const b = el('div', 'fxb', {height: d.bot + 'px'});
    b.appendChild(band(d.h - d.bot, d.h, 's', null, d.h - d.bot));
    view.bot = b; root.appendChild(b);
  }
  for (const h of d.hs) {
    const layer = h[5];
    if (layer === 't' && view.top) view.top.appendChild(hotspot(h, 0, view));
    else if (layer === 'b' && view.bot) view.bot.appendChild(hotspot(h, d.h - d.bot, view));
    else body.appendChild(hotspot(h, 0, view));
  }
  if (d.h > VH + 20) {
    const p = el('i', 'prog', {top: (d.top || 0) + 'px'});
    root.appendChild(p); view.prog = p;
    sc.addEventListener('scroll', () => {
      const max = sc.scrollHeight - sc.clientHeight;
      const f = max > 0 ? sc.scrollTop / max : 0;
      p.style.setProperty('--p', f.toFixed(4)); p.classList.toggle('on', sc.scrollTop > 4);
    }, {passive: true});
  }
  dragScroll(sc);
  return view;
}

/* ---------- reveal (website .rv system: lineUp / fadeUp / mask) ---------- */
function reveal(view, opts = {}) {
  if (RM) return;
  const from = opts.from || 0, base = opts.delay || 0, soft = opts.soft;
  const top = view.sc.scrollTop, bottom = top + VH;
  let i = 0;
  const below = [];
  for (const b of view.bands) {
    const y0 = +b.dataset.y0;
    if (y0 < from) continue;
    b.classList.add('pre');
    if (soft) b.classList.add('soft');
    if (y0 < bottom) { b.style.setProperty('--dl', Math.min(base + i * .055, base + .6).toFixed(3) + 's'); i++; }
    else below.push(b);
  }
  void view.body.offsetWidth;
  requestAnimationFrame(() => view.bands.forEach(b => { if (+b.dataset.y0 < bottom && +b.dataset.y0 >= from) b.classList.remove('pre'); }));
  if (below.length) {
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.style.setProperty('--dl', '0s'); e.target.classList.remove('pre'); io.unobserve(e.target);
    }), {root: view.sc, rootMargin: '0px 0px -6% 0px'});
    below.forEach(b => io.observe(b));
    view.io = io;
  }
  setTimeout(() => view.bands.forEach(b => b.classList.remove('soft')), 1600);
}

/* ---------- signature effects ---------- */
function effects(view) {
  const fx = FX[view.id]; if (!fx) return;
  const body = view.body;
  if (fx.loader) {
    const [x, y, w, h] = fx.loader;
    const l = el('div', 'loader', {left: x + 'px', top: (y - 1) + 'px', width: w + 'px', height: (h + 1) + 'px'});
    l.appendChild(el('i')); body.appendChild(l);
  }
  if (fx.corners) {
    body.appendChild(el('div', 'fx corner', {left: 'auto', right: '-130px', top: '-130px', width: '260px', background: 'radial-gradient(circle,rgba(105,210,255,.35),transparent 65%)'}));
    body.appendChild(el('div', 'fx corner', {left: '-130px', top: '722px', width: '260px', background: 'radial-gradient(circle,rgba(235,0,139,.4),transparent 65%)', animationDelay: '-2s'}));
  }
  if (fx.glow) body.appendChild(el('div', 'fx glowtop', fx.red ? {background: 'radial-gradient(ellipse 60% 70% at 50% 0%,rgba(255,244,0,.18),transparent 70%)'} : null));
  if (fx.sweep) body.appendChild(el('div', 'fx sweep', {top: fx.sweep[0] + 'px', height: (fx.sweep[1] - fx.sweep[0]) + 'px'}));
  if (fx.sparks && !RM) sparks(view, fx.sparks[0], fx.sparks[1], fx.glow ? ['255,244,0', '208,233,80', '255,238,6'] : null);
  if (fx.ping) {
    const [cx, cy, s] = fx.ping;
    for (const c of ['', ' b']) body.appendChild(el('i', 'ping' + c, {left: (cx - s / 2) + 'px', top: (cy - s / 2) + 'px', width: s + 'px', height: s + 'px'}));
  }
  if (fx.confetti) setTimeout(() => { if (cur === view.id) burst(); }, RM ? 0 : fx.confetti);
  if (fx.auto) {
    const [dest, ms] = fx.auto;
    view.auto = setTimeout(() => { if (cur === view.id && !ov) nav(dest, {force: 'wipe'}); }, ms);
  }
}
function sparks(view, y0, y1, pal) {
  const cv = el('canvas', 'fx', {top: y0 + 'px', height: (y1 - y0) + 'px'});
  view.body.appendChild(cv);
  const ctx = cv.getContext('2d'), dpr = Math.min(2, devicePixelRatio || 1), w = 393, h = y1 - y0;
  cv.width = w * dpr; cv.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const cols = pal || ['255,12,225', '255,238,6', '105,210,255', '255,238,6'];
  const pts = Array.from({length: 34}, () => ({x: Math.random() * w, y: Math.random() * h, r: Math.random() * 1.5 + .4, s: Math.random() * .35 + .12, a: Math.random() * .5 + .15, p: Math.random() * 6.28, c: cols[Math.floor(Math.random() * cols.length)]}));
  (function loop(t) {
    if (!cv.isConnected) return;
    requestAnimationFrame(loop);
    ctx.clearRect(0, 0, w, h);
    for (const p of pts) {
      p.y -= p.s; p.x += Math.sin(t / 1600 + p.p) * .25;
      if (p.y < -6) { p.y = h + 6; p.x = Math.random() * w; }
      const tw = .55 + .45 * Math.sin(t / 700 + p.p * 3);
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283);
      ctx.fillStyle = `rgba(${p.c},${(p.a * tw).toFixed(3)})`; ctx.fill();
    }
  })(0);
}
function burst() {
  if (RM) return;
  const cv = el('canvas', '', {position: 'absolute', inset: '0', zIndex: 70, pointerEvents: 'none'});
  vp.appendChild(cv);
  const dpr = Math.min(2, devicePixelRatio || 1); cv.width = 393 * dpr; cv.height = VH * dpr;
  const ctx = cv.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const cx = 196, cy = 300, cols = ['#eb008b', '#fff400', '#69d2ff', '#f7f6f5'];
  const ps = Array.from({length: 110}, () => { const a = Math.random() * 6.283, v = Math.random() * 8 + 3; return {x: cx, y: cy, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 4, s: Math.random() * 6 + 3, r: Math.random() * 6.28, vr: (Math.random() - .5) * .4, c: cols[Math.floor(Math.random() * 4)]}; });
  const t0 = performance.now();
  (function f(t) {
    ctx.clearRect(0, 0, 393, VH);
    const age = (t - t0) / 1000;
    for (const p of ps) {
      p.vy += .22; p.vx *= .985; p.x += p.vx; p.y += p.vy; p.r += p.vr;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.globalAlpha = Math.max(0, 1 - age / 2.2); ctx.fillStyle = p.c; ctx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); ctx.restore();
    }
    if (age < 2.3) requestAnimationFrame(f); else cv.remove();
  })(t0);
}

/* ---------- transitions ---------- */
function anim(e, kf, o) { return e.animate(kf, Object.assign({fill: 'both'}, o)).finished.catch(() => {}); }
function preload(id) { const d = S[id]; if (!d) return; new Image().src = `screens/${safe(id)}.webp`; }
function preloadNext(id) { for (const h of S[id].hs) if ('NO'.includes(h[4][0])) preload(h[4].slice(1)); }

async function show(id, kind, opts = {}) {
  lock = true;
  const old = curView;
  if (old && old.auto) clearTimeout(old.auto);
  const v = buildScreen(id);
  cur = id; curView = v;
  preloadNext(id);
  panelSync();
  const dur = RM ? 1 : 560;
  if (!old || kind === 'none') {
    vp.appendChild(v.root); old && old.root.remove();
    reveal(v, {delay: .15}); effects(v);
  } else if (kind === 'push' || kind === 'swipeL') {
    vp.appendChild(v.root);
    v.root.style.boxShadow = '-24px 0 50px rgba(0,0,0,.55)';
    reveal(v, {delay: .16, soft: true}); effects(v);
    await Promise.all([
      anim(v.root, [{transform: 'translateX(100%)'}, {transform: 'none'}], {duration: dur, easing: EASE}),
      anim(old.root, [{transform: 'none', filter: 'brightness(1)'}, {transform: 'translateX(-28%)', filter: 'brightness(.4)'}], {duration: dur, easing: EASE})
    ]);
    v.root.style.boxShadow = '';
  } else if (kind === 'pop' || kind === 'swipeR') {
    vp.insertBefore(v.root, old.root);
    old.root.style.boxShadow = '-24px 0 50px rgba(0,0,0,.55)';
    if (kind === 'swipeR') { reveal(v, {delay: .12, soft: true}); }
    effects(v);
    await Promise.all([
      anim(v.root, [{transform: 'translateX(-28%)', filter: 'brightness(.4)'}, {transform: 'none', filter: 'brightness(1)'}], {duration: dur - 40, easing: EASE}),
      anim(old.root, [{transform: 'none'}, {transform: 'translateX(100%)'}], {duration: dur - 40, easing: EASE})
    ]);
  } else if (kind === 'tab') {
    vp.appendChild(v.root);
    reveal(v, {delay: .12}); effects(v);
    await Promise.all([
      anim(old.root, [{opacity: 1, transform: 'none'}, {opacity: 0, transform: 'scale(.985)'}], {duration: RM ? 1 : 220, easing: 'ease-out'}),
      anim(v.root, [{opacity: 0}, {opacity: 1}], {duration: RM ? 1 : 300, delay: RM ? 0 : 80, easing: 'ease-out'})
    ]);
  } else if (kind === 'seg') {
    const f = opts.from || 0;
    await Promise.all($$('.bd', old.body).filter(b => +b.dataset.y0 >= f).map(b => anim(b, [{opacity: 1}, {opacity: 0}], {duration: RM ? 1 : 140, easing: 'ease-in'})));
    vp.appendChild(v.root);
    v.sc.scrollTop = Math.min(opts.keepScroll || 0, v.d.h - VH);
    reveal(v, {from: f, delay: 0}); effects(v);
  } else if (kind === 'wipe') {
    if (!RM) { wipeEl.classList.remove('go'); void wipeEl.offsetWidth; wipeEl.classList.add('go'); }
    await wait(430);
    vp.appendChild(v.root); old.root.remove();
    reveal(v, {delay: .2}); effects(v);
    await wait(470);
  } else if (kind === 'sheetin') {
    vp.appendChild(v.root);
    const from = SHEET_FROM[id];
    const sheet = $$('.bd', v.body).filter(b => +b.dataset.y0 >= from);
    if (v.bot) sheet.push(v.bot);
    effects(v);
    await Promise.all([
      anim(v.root, [{opacity: 0}, {opacity: 1}], {duration: RM ? 1 : 280, easing: 'ease-out'}),
      ...sheet.map(b => anim(b, [{transform: `translateY(${VH - from + 20}px)`}, {transform: 'none'}], {duration: RM ? 1 : 560, easing: EASE}))
    ]);
  } else if (kind === 'sheetout') {
    vp.insertBefore(v.root, old.root);
    const from = SHEET_FROM[old.id];
    const sheet = $$('.bd', old.body).filter(b => +b.dataset.y0 >= from);
    if (old.bot) sheet.push(old.bot);
    effects(v);
    await Promise.all(sheet.map(b => anim(b, [{transform: 'none'}, {transform: `translateY(${VH - from + 20}px)`}], {duration: RM ? 1 : 340, easing: 'cubic-bezier(.5,0,.75,0)'})));
    await anim(old.root, [{opacity: 1}, {opacity: 0}], {duration: RM ? 1 : 180});
  }
  if (old && old.root.isConnected) old.root.remove();
  if (old && old.io) old.io.disconnect();
  v.root.getAnimations({subtree: true}).forEach(a => { if (a.constructor === Animation) a.cancel(); });
  v.root.style.transform = ''; v.root.style.opacity = ''; v.root.style.filter = '';
  lock = false;
}

function isTabTap(h, view) { return h && h[1] >= view.d.h - 92 && h[3] >= 48 && h[3] <= 56 && h[2] <= 64; }
function family(n) { return n.replace(/\s*-.*$/, '').replace(/[’']s Tournaments$/, ' Tournaments').trim(); }
function isSeg(src, dest, h) {
  if (!h) return false;
  const a = S[src], b = S[dest];
  const small = h[3] <= 40 && h[2] <= 130;
  return small && family(a.n) === family(b.n) && a.s === b.s;
}

async function nav(dest, info = {}) {
  if (lock || !S[dest]) return;
  if (ov) await closeOverlay(true);
  const src = cur, h = info.h;
  let kind = info.force;
  let from = 0, keepScroll = 0;
  if (!kind) {
    if (AUTH.has(src) !== AUTH.has(dest) || src === '2027:13561') { kind = 'wipe'; stack = []; }
    else if (SHEET_FROM[dest]) { kind = 'sheetin'; stack.push(src); }
    else if (info.fromView && isTabTap(h, info.fromView)) { kind = 'tab'; stack = []; }
    else if (info.fromView && isSeg(src, dest, h)) {
      kind = 'seg';
      from = h[1] + h[3]; keepScroll = curView.sc.scrollTop;
      if (h[5] === 't') from = curView.d.top;
    }
    else if (info.fromOv && family(S[src].n) === family(S[dest].n)) { kind = 'seg'; from = 0; }
    else if (stack.includes(dest)) { kind = 'pop'; stack = stack.slice(0, stack.lastIndexOf(dest)); }
    else { kind = 'push'; stack.push(src); }
  } else if (kind === 'wipe') stack = [];
  await show(dest, kind, {from, keepScroll});
}
async function back() {
  if (lock) return;
  if (ov) return closeOverlay();
  if (!stack.length) { flash(); return; }
  const dest = stack.pop();
  await show(dest, SHEET_FROM[cur] ? 'sheetout' : 'pop');
}

/* ---------- overlays: bottom sheets spring up, popups pop in ---------- */
async function openOverlay(id) {
  if (lock || ov) return;
  lock = true;
  const d = S[id];
  const wrap = el('div', 'ov'), shade = el('div', 'shade');
  const modal = d.ov === 'modal';
  const card = el('div', 'card', {width: d.w + 'px', height: d.h + 'px', left: ((393 - d.w) / 2) + 'px'});
  card.style.setProperty('--img', img(id));
  if (modal) card.style.top = Math.round((VH - d.h) / 2) + 'px'; else card.style.bottom = '0';
  const view = {id, d, root: card, body: card, ov: true};
  for (const h of d.hs) card.appendChild(hotspot(h, 0, view));
  if (!modal) {
    const g = el('div', 'grab'); card.appendChild(g); sheetDrag(g, card);
  }
  wrap.append(shade, card);
  vp.appendChild(wrap);
  ov = {id, wrap, shade, card, modal};
  shade.addEventListener('click', () => closeOverlay());
  preloadNext(id);
  panelSync();
  const dur = RM ? 1 : 1;
  await Promise.all([
    anim(shade, [{opacity: 0}, {opacity: 1}], {duration: RM ? 1 : 320, easing: 'ease-out'}),
    modal
      ? anim(card, [{opacity: 0, transform: 'translateY(26px) scale(.9)'}, {opacity: 1, transform: 'none'}], {duration: RM ? 1 : 620, easing: SPRING})
      : anim(card, [{transform: 'translateY(100%)'}, {transform: 'none'}], {duration: RM ? 1 : 560, easing: EASE})
  ]);
  void dur;
  lock = false;
}
async function closeOverlay(fast) {
  if (!ov) return;
  const o = ov; ov = null; lock = true;
  const d = fast ? 200 : 320;
  await Promise.all([
    anim(o.shade, [{opacity: 1}, {opacity: 0}], {duration: RM ? 1 : d}),
    o.modal
      ? anim(o.card, [{opacity: 1, transform: getComputedStyle(o.card).transform === 'none' ? 'none' : getComputedStyle(o.card).transform}, {opacity: 0, transform: 'translateY(20px) scale(.94)'}], {duration: RM ? 1 : d, easing: 'ease-in'})
      : anim(o.card, [{transform: getComputedStyle(o.card).transform}, {transform: 'translateY(100%)'}], {duration: RM ? 1 : d, easing: 'cubic-bezier(.5,0,.75,0)'})
  ]);
  o.wrap.remove(); lock = false; panelSync();
}
function sheetDrag(g, card) {
  let y0 = null, dy = 0;
  g.addEventListener('pointerdown', e => { y0 = e.clientY; dy = 0; g.setPointerCapture(e.pointerId); card.getAnimations().forEach(a => { a.commitStyles(); a.cancel(); }); });
  g.addEventListener('pointermove', e => { if (y0 === null) return; dy = Math.max(0, (e.clientY - y0) / K); card.style.transform = `translateY(${dy}px)`; });
  g.addEventListener('pointerup', () => {
    if (y0 === null) return; y0 = null;
    if (dy > 70) closeOverlay();
    else card.animate([{transform: `translateY(${dy}px)`}, {transform: 'none'}], {duration: 450, easing: SPRING}).finished.then(() => card.style.transform = '');
  });
}

/* ---------- taps ---------- */
function local(e, b) {
  const r = phone.getBoundingClientRect();
  return {x: (e.clientX - r.left) / K, y: (e.clientY - r.top) / K};
}
function ripple(p) { const r = el('i', 'rip', {left: p.x + 'px', top: p.y + 'px'}); vp.appendChild(r); setTimeout(() => r.remove(), 800); }
function flash() { vp.classList.remove('flash'); void vp.offsetWidth; vp.classList.add('flash'); clearTimeout(flash.t); flash.t = setTimeout(() => vp.classList.remove('flash'), 950); }

function lift(b, view) {
  const [x, y, w, h] = b._h;
  if (w >= 380 || w * h > 140000 || w < 20) return null;
  const host = b.parentNode, off = b._off;
  const box = el('div', 'lift', {left: x + 'px', top: (y - off) + 'px', width: w + 'px', height: h + 'px', borderRadius: Math.min(14, h / 3) + 'px'});
  const fill = bandColorAt(view, y);
  if (fill) box.style.background = fill;
  const s = el('span'); s.style.backgroundPosition = `${-x}px ${-y}px`; s.style.borderRadius = 'inherit';
  if (view.ov) { s.style.backgroundImage = img(view.id); s.style.backgroundSize = `${view.d.w}px ${view.d.h}px`; }
  s.appendChild(el('i', 'shine'));
  box.appendChild(s);
  host.appendChild(box);
  return box;
}
function bandColorAt(view, y) {
  if (view.ov) return null;
  for (const b of view.d.b) if (y >= b[0] && y < b[1]) return b[2];
  return view.d.bg;
}

let pressed = null;
vp.addEventListener('pointerdown', e => {
  const b = e.target.closest('.hs');
  if (!b || lock || b.classList.contains('drag')) return;
  const box = lift(b, b._view);
  if (box) requestAnimationFrame(() => box.classList.add('down'));
  pressed = {b, box, t: performance.now()};
});
addEventListener('pointerup', () => {
  if (!pressed) return;
  const {box} = pressed;
  if (box) { box.classList.remove('down'); box.classList.add('up'); box._rm = setTimeout(() => box.remove(), 520); }
});
addEventListener('pointercancel', () => { if (pressed && pressed.box) pressed.box.remove(); pressed = null; });

vp.addEventListener('click', async e => {
  if (suppressClick) { suppressClick = false; return; }
  const p = local(e);
  if (e.target.closest('.island')) return;
  const b = e.target.closest('.hs');
  if (!b || b.classList.contains('drag')) { if (!e.target.closest('.shade')) flash(); return; }
  if (lock) return;
  ripple(p);
  const h = b._h, view = b._view, a = h[4], t = a[0], dest = a.slice(1);
  const box = pressed && pressed.b === b ? pressed.box : null;
  pressed = null;
  if (t === 'C') return component(b, view, box);
  if (box && h[2] >= 150 && h[3] <= 56) { box.classList.add('shn'); }
  const cta = t === 'N' && h[2] >= 300 && h[3] <= 48 && (h[5] === 'b' || h[1] > view.d.h - 160) && !view.ov;
  if (cta && box && !RM) { clearTimeout(box._rm); box.classList.remove('up'); const l = el('i', 'load'); box.appendChild(l); box.classList.add('down', 'shn'); lock = true; await wait(900); lock = false; }
  else await wait(120);
  if (view.ov && t === 'X' && h[1] > 500) say(['Opening Snapchat…', 'Sharing to WhatsApp…', 'Profile card saved as PDF'][h[0] < 122 ? 0 : h[0] < 236 ? 1 : 2]);
  if (t === 'N') nav(dest, {h, fromView: view.ov ? null : view, fromOv: !!view.ov});
  else if (t === 'O') openOverlay(dest);
  else if (t === 'B') back();
  else if (t === 'X') closeOverlay();
});

/* component-level interactions Figma swaps variants for */
function component(b, view, box) {
  const [x, y, w, h] = b._h;
  const host = b.parentNode, off = b._off;
  if (box) box.remove();
  if (w <= 26 && h <= 26 && w >= 20) {
    const ex = host.querySelector(`.tick[data-k="${x},${y}"]`);
    if (ex) { ex.remove(); return; }
    const t = el('div', 'tick', {left: x + 'px', top: (y - off) + 'px', width: w + 'px', height: h + 'px'});
    t.dataset.k = x + ',' + y;
    t.innerHTML = '<svg viewBox="0 0 24 24" fill="none"><path d="M5 12.5l4.5 4.5L19 7.5" stroke="#fff400" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    host.appendChild(t);
    return;
  }
  if (h >= 40 && h <= 46 && w >= 150) {
    $$('.focus', view.root).forEach(f => f.remove());
    host.appendChild(el('div', 'focus', {left: x + 'px', top: (y - off) + 'px', width: w + 'px', height: h + 'px'}));
    return;
  }
  const p = el('div', 'pulse', {left: x + 'px', top: (y - off) + 'px', width: w + 'px', height: h + 'px'});
  host.appendChild(p); setTimeout(() => p.remove(), 750);
}

/* drag-to-swipe between games (Figma "On drag") */
let suppressClick = false;
vp.addEventListener('pointerdown', e => {
  const b = e.target.closest('.hs.drag');
  if (!b || lock) return;
  const x0 = e.clientX, y0 = e.clientY; let dx = 0, active = false;
  const view = b._view;
  const move = ev => {
    dx = (ev.clientX - x0) / K; const dy = (ev.clientY - y0) / K;
    if (!active && Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy)) { active = true; b.setPointerCapture(ev.pointerId); }
    if (active) view.body.style.transform = `translateX(${dx * .35}px)`;
  };
  const up = () => {
    removeEventListener('pointermove', move); removeEventListener('pointerup', up);
    if (!active) { flash(); return; }
    suppressClick = true; setTimeout(() => suppressClick = false, 50);
    if (Math.abs(dx) > 50) { view.body.style.transform = ''; nav(b._h[4].slice(1), {force: dx < 0 ? 'swipeL' : 'swipeR'}); }
    else view.body.animate([{transform: view.body.style.transform}, {transform: 'none'}], {duration: 450, easing: SPRING}).finished.then(() => view.body.style.transform = '');
  };
  addEventListener('pointermove', move); addEventListener('pointerup', up);
});

/* mouse drag scrolling, like a Figma prototype */
function dragScroll(sc) {
  sc.addEventListener('pointerdown', e => {
    if (e.pointerType !== 'mouse' || e.button !== 0 || e.target.closest('.hs.drag')) return;
    const y0 = e.clientY, s0 = sc.scrollTop; let moved = false;
    const move = ev => { const dy = (ev.clientY - y0) / K; if (Math.abs(dy) > 5) moved = true; if (moved) sc.scrollTop = s0 - dy; };
    const up = () => { removeEventListener('pointermove', move); removeEventListener('pointerup', up); if (moved) { suppressClick = true; setTimeout(() => suppressClick = false, 50); if (pressed && pressed.box) pressed.box.remove(); pressed = null; } };
    addEventListener('pointermove', move); addEventListener('pointerup', up);
  });
}

/* ---------- panel / drawer ---------- */
const nameCount = {};
const LIST = SECTIONS.map(([k, label, first]) => {
  const ids = Object.keys(S).filter(i => S[i].s === k && !S[i].ov);
  const seen = {};
  return {k, label, first, items: ids.map(i => { const n = S[i].n.replace(/\s+-\s+/g, ' · ').replace(/^login-forgot/, 'Login / forgot'); seen[n] = (seen[n] || 0) + 1; return [i, seen[n] > 1 ? `${n} (${seen[n]})` : n]; })};
});
void nameCount;
function renderFlows(host) {
  host.innerHTML = LIST.map((f, i) => `<div class="fl" data-k="${f.k}"><button type="button" data-first="${f.first}" aria-expanded="false"><span class="no">0${i + 1}</span><span class="nm">${f.label}</span><span class="ct">${f.items.length}</span><span class="chev"></span></button><ul>${f.items.map(([id, n]) => `<li><button type="button" data-go="${id}">${n}</button></li>`).join('')}</ul></div>`).join('');
  host.addEventListener('click', e => {
    const go = e.target.closest('[data-go]');
    if (go) { jump(go.dataset.go); closeDrawer(); return; }
    const hd = e.target.closest('[data-first]');
    if (hd) {
      const fl = hd.parentNode, open = !fl.classList.contains('open');
      $$('.fl', host).forEach(x => { x.classList.remove('open'); x.firstElementChild.setAttribute('aria-expanded', 'false'); });
      if (open) { fl.classList.add('open'); hd.setAttribute('aria-expanded', 'true'); }
    }
  });
}
async function jump(id) {
  if (lock) return;
  if (ov) await closeOverlay(true);
  if (id === cur) return;
  stack = [];
  await show(id, 'wipe');
}
const nowV = $('#nowV'), nowK = $('#nowK'), nowBar = $('#nowBar');
const ORDER = LIST.flatMap(f => f.items.map(x => x[0]));
function panelSync() {
  const id = ov ? ov.id : cur, d = S[id];
  const sec = LIST.find(f => f.k === S[cur].s);
  if (nowK) nowK.textContent = (sec ? sec.label : '') + (ov ? ' · overlay' : '');
  if (nowV) {
    const txt = d.n.replace(/\s+-\s+/g, ' · ').replace(/^login-forgot/, 'Login / forgot');
    if (nowV.textContent !== txt) { nowV.classList.add('out'); setTimeout(() => { nowV.textContent = txt; nowV.classList.remove('out'); }, RM ? 0 : 200); }
  }
  if (nowBar) nowBar.style.setProperty('--p', ((ORDER.indexOf(cur) + 1) / ORDER.length).toFixed(3));
  $$('[data-go]').forEach(b => b.setAttribute('aria-current', b.dataset.go === cur ? 'true' : 'false'));
  $$('.fl').forEach(f => f.classList.toggle('cur', f.dataset.k === S[cur].s));
}
$$('.flows').forEach(renderFlows);
const drawer = $('#drawer');
function openDrawer() { drawer.classList.add('open'); drawer.setAttribute('aria-hidden', 'false'); }
function closeDrawer() { drawer.classList.remove('open'); drawer.setAttribute('aria-hidden', 'true'); }
$('#island').addEventListener('click', e => { e.stopPropagation(); if (innerWidth <= 900) openDrawer(); else flash(); });
$('.drawer .sh').addEventListener('click', closeDrawer);
function toggleHs() {
  showHs = !showHs; vp.classList.toggle('show-hs', showHs);
  $$('[data-act="hs"]').forEach(b => b.setAttribute('aria-pressed', String(showHs)));
}
function restart() { closeDrawer(); stack = []; if (ov) { ov.wrap.remove(); ov = null; } lock = false; show(START, 'wipe'); }
document.addEventListener('click', e => {
  const a = e.target.closest('[data-act]'); if (!a) return;
  if (a.dataset.act === 'hs') toggleHs();
  if (a.dataset.act === 'back') { closeDrawer(); back(); }
  if (a.dataset.act === 'restart') restart();
});
document.addEventListener('keydown', e => {
  if (e.target.closest('input,textarea')) return;
  if (e.key === 'Escape') { if (drawer.classList.contains('open')) closeDrawer(); else if (ov) closeOverlay(); else back(); }
  else if (e.key === 'Backspace' || e.key === 'ArrowLeft') back();
  else if (e.key.toLowerCase() === 'h') toggleHs();
  else if (e.key.toLowerCase() === 'r') restart();
});

/* ---------- boot ---------- */
fit();
addEventListener('hashchange', () => { const h = decodeURIComponent(location.hash.slice(1)); if (S[h] && !S[h].ov && h !== cur) jump(h); });
const deep = decodeURIComponent((location.hash || '').slice(1));
show(S[deep] && !S[deep].ov ? deep : START, 'none');
})();
