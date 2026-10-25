var GXAppMotion = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // src/js/index.js
  var js_exports = {};
  __export(js_exports, {
    afterTap: () => afterTap,
    autoAdvance: () => autoAdvance,
    chooseTransition: () => chooseTransition,
    confetti: () => confetti,
    flashTargets: () => flashTargets,
    focusField: () => focusField,
    gradientWipe: () => gradientWipe,
    initDragScroll: () => initDragScroll,
    initPress: () => initPress,
    initScrollProgress: () => initScrollProgress,
    initSwipe: () => initSwipe,
    openModal: () => openModal,
    openSheet: () => openSheet,
    pingRings: () => pingRings,
    pop: () => pop,
    prefersReducedMotion: () => prefersReducedMotion,
    pulse: () => pulse,
    push: () => push,
    revealDelayFor: () => revealDelayFor,
    revealScreen: () => revealScreen,
    ripple: () => ripple,
    runCta: () => runCta,
    segmentSwap: () => segmentSwap,
    sheetScreenIn: () => sheetScreenIn,
    sheetScreenOut: () => sheetScreenOut,
    shine: () => shine,
    sparks: () => sparks,
    swipe: () => swipe,
    tabSwitch: () => tabSwitch,
    toast: () => toast,
    toggleTick: () => toggleTick,
    tokens: () => app_motion_tokens_exports
  });

  // src/tokens/app-motion-tokens.js
  var app_motion_tokens_exports = {};
  __export(app_motion_tokens_exports, {
    EASE: () => EASE,
    FEEDBACK: () => FEEDBACK,
    GESTURE: () => GESTURE,
    OVERLAY: () => OVERLAY,
    PALETTE: () => PALETTE,
    REVEAL: () => REVEAL,
    SCREEN: () => SCREEN,
    SIGNATURE: () => SIGNATURE,
    TRANSITION: () => TRANSITION
  });
  var EASE = {
    out: "cubic-bezier(.22, 1, .36, 1)",
    spring: "cubic-bezier(.34, 1.56, .64, 1)",
    in: "cubic-bezier(.5, 0, .75, 0)",
    inOut: "ease-in-out",
    linear: "linear",
    // control points, for libraries / native SDKs
    outPoints: [0.22, 1, 0.36, 1],
    springPoints: [0.34, 1.56, 0.64, 1],
    inPoints: [0.5, 0, 0.75, 0]
  };
  var TRANSITION = {
    pushMs: 560,
    popMs: 520,
    parallaxUnder: -0.28,
    // screen underneath moves 28% of its width
    dimUnder: 0.4,
    // and dims to brightness(.4)
    edgeShadow: "-24px 0 50px rgba(0,0,0,.55)",
    tabOutMs: 220,
    tabOutScale: 0.985,
    tabInMs: 300,
    tabInDelayMs: 80,
    segmentOutMs: 140,
    wipeMs: 900,
    wipeSwapAtMs: 430,
    // swap the screen while the gradient covers it
    sheetScreenInMs: 560,
    sheetScreenFadeMs: 280,
    sheetScreenOutMs: 340,
    sheetScreenUnfadeMs: 180,
    sheetOvershootPx: 20
    // sheet starts/ends 20px below the screen edge
  };
  var REVEAL = {
    opacityMs: 750,
    moveMs: 850,
    maskMs: 950,
    risePx: 26,
    riseSoftPx: 12,
    riseBigPx: 18,
    bigBlockPx: 260,
    // blocks taller than this use the mask wipe (E2)
    staggerMs: 55,
    staggerCapMs: 600,
    firstDelay: { load: 150, push: 160, swipe: 120, tab: 120, wipe: 200, segment: 0 },
    softResetMs: 1600,
    // soft rise flag removed after this
    rootMargin: "0px 0px -6% 0px"
  };
  var FEEDBACK = {
    rippleMs: 750,
    rippleScale: 6,
    pressMs: 140,
    pressScale: 0.955,
    releaseMs: 500,
    shineMs: 700,
    shineMinWidth: 150,
    // only buttons ≥150px wide and ≤56px tall get the sheen
    shineMaxHeight: 56,
    loadbarMs: 900,
    // CTA holds this long before navigating
    navDelayMs: 120,
    // every other tap waits this long so the ripple reads
    focusMs: 400,
    tickPopMs: 450,
    tickDrawMs: 400,
    tickDrawDelayMs: 120,
    pulseMs: 700,
    flashMs: 900,
    toastMs: 500,
    toastHoldMs: 2e3
  };
  var OVERLAY = {
    shadeInMs: 320,
    sheetInMs: 560,
    sheetOutMs: 320,
    sheetOutFastMs: 200,
    snapBackMs: 450,
    dismissPx: 70,
    modalInMs: 620,
    modalFrom: { y: 26, scale: 0.9 },
    modalTo: { y: 20, scale: 0.94 }
  };
  var SIGNATURE = {
    splashHoldMs: 2900,
    loaderMs: 2500,
    loaderDelayMs: 300,
    logoPopMs: 1e3,
    logoGlowLoopMs: 3e3,
    logoGlowDelayMs: 1100,
    kenBurnsMs: 2800,
    kenBurnsFrom: 1.07,
    sweepLoopMs: 6e3,
    sweepDelayMs: 1e3,
    breatheLoopMs: 4500,
    cornerLoopMs: 5e3,
    confettiDelayMs: 700,
    confettiMs: 2300,
    confettiCount: 110,
    sparksCount: 34,
    spinInMs: 1e3,
    pingLoopMs: 2600,
    pingSecondDelayMs: 1300
  };
  var GESTURE = {
    swipeLockPx: 8,
    swipeFollow: 0.35,
    swipeCommitPx: 50,
    dragScrollPx: 5
  };
  var PALETTE = {
    sparks: ["255,12,225", "255,238,6", "105,210,255", "255,238,6"],
    sparksAlert: ["255,244,0", "208,233,80", "255,238,6"],
    confetti: ["#eb008b", "#fff400", "#69d2ff", "#f7f6f5"]
  };
  var SCREEN = { width: 393, height: 852 };

  // src/js/core/env.js
  var rmQuery = typeof matchMedia === "function" ? matchMedia("(prefers-reduced-motion: reduce)") : null;
  var prefersReducedMotion = () => !!(rmQuery && rmQuery.matches);
  var $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  var wait = (ms) => new Promise((r) => setTimeout(r, prefersReducedMotion() ? 0 : ms));
  function el(tag, cls, css) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (css) Object.assign(e.style, css);
    return e;
  }
  function animate(node, keyframes, options) {
    const o = Object.assign({ fill: "both" }, options);
    if (prefersReducedMotion()) {
      o.duration = 1;
      o.delay = 0;
    }
    return node.animate(keyframes, o).finished.catch(() => {
    });
  }
  function restartClass(node, cls) {
    node.classList.remove(cls);
    void node.offsetWidth;
    node.classList.add(cls);
  }
  function clearAnimations(node) {
    node.getAnimations({ subtree: true }).forEach((a) => {
      if (a.constructor === Animation) a.cancel();
    });
    node.style.transform = "";
    node.style.opacity = "";
    node.style.filter = "";
  }

  // src/js/modules/transitions.js
  var under = (pct) => `translateX(${pct * 100}%)`;
  async function push(viewport, incoming, outgoing) {
    viewport.appendChild(incoming);
    incoming.classList.add("is-edge");
    await Promise.all([
      animate(incoming, [{ transform: "translateX(100%)" }, { transform: "none" }], { duration: TRANSITION.pushMs, easing: EASE.out }),
      outgoing && animate(outgoing, [
        { transform: "none", filter: "brightness(1)" },
        { transform: under(TRANSITION.parallaxUnder), filter: `brightness(${TRANSITION.dimUnder})` }
      ], { duration: TRANSITION.pushMs, easing: EASE.out })
    ]);
    incoming.classList.remove("is-edge");
    finish(incoming, outgoing);
  }
  async function pop(viewport, incoming, outgoing) {
    viewport.insertBefore(incoming, outgoing);
    outgoing.classList.add("is-edge");
    await Promise.all([
      animate(incoming, [
        { transform: under(TRANSITION.parallaxUnder), filter: `brightness(${TRANSITION.dimUnder})` },
        { transform: "none", filter: "brightness(1)" }
      ], { duration: TRANSITION.popMs, easing: EASE.out }),
      animate(outgoing, [{ transform: "none" }, { transform: "translateX(100%)" }], { duration: TRANSITION.popMs, easing: EASE.out })
    ]);
    finish(incoming, outgoing);
  }
  async function tabSwitch(viewport, incoming, outgoing) {
    viewport.appendChild(incoming);
    await Promise.all([
      outgoing && animate(outgoing, [{ opacity: 1, transform: "none" }, { opacity: 0, transform: `scale(${TRANSITION.tabOutScale})` }], { duration: TRANSITION.tabOutMs, easing: "ease-out" }),
      animate(incoming, [{ opacity: 0 }, { opacity: 1 }], { duration: TRANSITION.tabInMs, delay: TRANSITION.tabInDelayMs, easing: "ease-out" })
    ]);
    finish(incoming, outgoing);
  }
  async function segmentSwap(viewport, incoming, outgoing, { fromY = 0, blocksOf, scrollerOf, revealFn } = {}) {
    const below = (s) => (blocksOf ? blocksOf(s) : []).filter((b) => +b.dataset.y >= fromY);
    await Promise.all(below(outgoing).map((b) => animate(b, [{ opacity: 1 }, { opacity: 0 }], { duration: TRANSITION.segmentOutMs, easing: "ease-in" })));
    const keep = scrollerOf ? scrollerOf(outgoing).scrollTop : 0;
    viewport.appendChild(incoming);
    if (scrollerOf) scrollerOf(incoming).scrollTop = keep;
    if (revealFn) revealFn(incoming, { from: fromY, delay: 0 });
    finish(incoming, outgoing);
  }
  async function gradientWipe(wipeEl, swap) {
    if (!prefersReducedMotion()) restartClass(wipeEl, "is-running");
    await wait(TRANSITION.wipeSwapAtMs);
    await swap();
    await wait(TRANSITION.wipeMs - TRANSITION.wipeSwapAtMs);
  }
  function swipe(viewport, incoming, outgoing, direction) {
    return direction === "left" ? push(viewport, incoming, outgoing) : pop(viewport, incoming, outgoing);
  }
  async function sheetScreenIn(viewport, incoming, sheetParts, { travel }) {
    viewport.appendChild(incoming);
    await Promise.all([
      animate(incoming, [{ opacity: 0 }, { opacity: 1 }], { duration: TRANSITION.sheetScreenFadeMs, easing: "ease-out" }),
      ...sheetParts.map((p) => animate(p, [{ transform: `translateY(${travel}px)` }, { transform: "none" }], { duration: TRANSITION.sheetScreenInMs, easing: EASE.out }))
    ]);
    finish(incoming);
  }
  async function sheetScreenOut(viewport, incoming, outgoing, sheetParts, { travel }) {
    viewport.insertBefore(incoming, outgoing);
    await Promise.all(sheetParts.map((p) => animate(p, [{ transform: "none" }, { transform: `translateY(${travel}px)` }], { duration: TRANSITION.sheetScreenOutMs, easing: EASE.in })));
    await animate(outgoing, [{ opacity: 1 }, { opacity: 0 }], { duration: TRANSITION.sheetScreenUnfadeMs });
    finish(incoming, outgoing);
  }
  function finish(incoming, outgoing) {
    if (outgoing && outgoing.isConnected) outgoing.remove();
    clearAnimations(incoming);
  }
  function chooseTransition(ctx) {
    if (ctx.forced) return ctx.forced;
    if (ctx.fromAuth !== ctx.toAuth || ctx.fromIsGoodbye) return "wipe";
    if (ctx.toIsSheetScreen) return "sheetin";
    if (ctx.tappedTabBar) return "tab";
    if (ctx.tappedSegment) return "segment";
    if (ctx.fromOverlaySameFamily) return "segment";
    if (ctx.inBackStack) return "pop";
    return "push";
  }

  // src/js/modules/reveal.js
  function revealScreen(screen, { scroller, from = 0, delay = 0, soft = false } = {}) {
    if (prefersReducedMotion()) return { destroy() {
    } };
    const sc = scroller || screen.querySelector(".gxa-scroller") || screen;
    const top = sc.scrollTop, bottom = top + SCREEN.height;
    const blocks = $$("[data-gxa-reveal]", screen);
    const y = (b) => b.dataset.y !== void 0 ? +b.dataset.y : b.offsetTop;
    const below = [];
    let i = 0;
    for (const b of blocks) {
      if (y(b) < from) continue;
      if (b.offsetHeight > REVEAL.bigBlockPx) b.classList.add("is-big");
      b.classList.add("is-pre");
      if (soft) b.classList.add("is-soft");
      if (y(b) < bottom) {
        const d = Math.min(delay * 1e3 + i * REVEAL.staggerMs, delay * 1e3 + REVEAL.staggerCapMs);
        b.style.setProperty("--gxa-delay", `${(d / 1e3).toFixed(3)}s`);
        i++;
      } else below.push(b);
    }
    void screen.offsetWidth;
    requestAnimationFrame(() => blocks.forEach((b) => {
      if (y(b) >= from && y(b) < bottom) b.classList.remove("is-pre");
    }));
    let io = null;
    if (below.length) {
      io = new IntersectionObserver((entries) => entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.style.setProperty("--gxa-delay", "0s");
        e.target.classList.remove("is-pre");
        io.unobserve(e.target);
      }), { root: sc, rootMargin: REVEAL.rootMargin });
      below.forEach((b) => io.observe(b));
    }
    const t = setTimeout(() => blocks.forEach((b) => b.classList.remove("is-soft")), REVEAL.softResetMs);
    return { destroy() {
      io && io.disconnect();
      clearTimeout(t);
    } };
  }
  var revealDelayFor = (kind) => {
    var _a;
    return ((_a = REVEAL.firstDelay[kind]) != null ? _a : 0) / 1e3;
  };

  // src/js/modules/press.js
  function ripple(host, x, y) {
    const r = el("i", "gxa-ripple", { left: `${x}px`, top: `${y}px` });
    host.appendChild(r);
    setTimeout(() => r.remove(), FEEDBACK.rippleMs + 50);
  }
  function shine(button) {
    let s = button.querySelector(":scope > .gxa-shine");
    if (!s) {
      s = el("i", "gxa-shine");
      button.appendChild(s);
    }
    button.classList.remove("is-shining");
    void button.offsetWidth;
    button.classList.add("is-shining");
  }
  async function runCta(button) {
    if (prefersReducedMotion()) return;
    button.classList.add("is-down");
    shine(button);
    const bar = el("i", "gxa-loadbar");
    button.appendChild(bar);
    await wait(FEEDBACK.loadbarMs);
    bar.remove();
    button.classList.remove("is-down");
  }
  function initPress(viewport, { scale = () => 1 } = {}) {
    let pressed = null;
    const down = (e) => {
      const b = e.target.closest("[data-gxa-press]");
      if (!b) return;
      pressed = b;
      b.classList.add("is-down");
    };
    const up = () => {
      if (pressed) pressed.classList.remove("is-down");
      pressed = null;
    };
    const click = (e) => {
      const b = e.target.closest("[data-gxa-press]");
      if (!b) return;
      const r = viewport.getBoundingClientRect(), k = scale();
      ripple(viewport, (e.clientX - r.left) / k, (e.clientY - r.top) / k);
      const wide = b.dataset.gxaPress === "wide" || b.dataset.gxaPress === "cta" || b.offsetWidth >= FEEDBACK.shineMinWidth && b.offsetHeight <= FEEDBACK.shineMaxHeight;
      if (wide) shine(b);
    };
    viewport.addEventListener("pointerdown", down);
    addEventListener("pointerup", up);
    addEventListener("pointercancel", up);
    viewport.addEventListener("click", click);
    return { destroy() {
      viewport.removeEventListener("pointerdown", down);
      removeEventListener("pointerup", up);
      removeEventListener("pointercancel", up);
      viewport.removeEventListener("click", click);
    } };
  }
  var afterTap = () => wait(FEEDBACK.navDelayMs);

  // src/js/modules/feedback.js
  function focusField(field) {
    const root = field.closest(".gxa-screen") || document;
    root.querySelectorAll(".gxa-field.is-focused").forEach((f) => f !== field && f.classList.remove("is-focused"));
    restartClass(field, "is-focused");
  }
  var CHECK = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" stroke="#fff400" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  function toggleTick(box) {
    const on = box.getAttribute("aria-checked") !== "true";
    box.setAttribute("aria-checked", String(on));
    box.classList.toggle("gxa-tick", on);
    box.innerHTML = on ? CHECK : "";
    if (on) restartClass(box, "gxa-tick");
    return on;
  }
  function pulse(host, { left, top, width, height }) {
    const p = el("div", "gxa-pulse", { left: `${left}px`, top: `${top}px`, width: `${width}px`, height: `${height}px` });
    host.appendChild(p);
    setTimeout(() => p.remove(), FEEDBACK.pulseMs + 50);
  }
  function flashTargets(viewport) {
    restartClass(viewport, "gxa-flash");
    clearTimeout(flashTargets.t);
    flashTargets.t = setTimeout(() => viewport.classList.remove("gxa-flash"), FEEDBACK.flashMs + 50);
  }
  function toast(toastEl, message) {
    toastEl.textContent = message;
    toastEl.classList.add("is-shown");
    clearTimeout(toast.t);
    toast.t = setTimeout(() => toastEl.classList.remove("is-shown"), FEEDBACK.toastHoldMs);
  }

  // src/js/modules/overlays.js
  function mount(viewport, card) {
    const wrap = el("div", "gxa-overlay");
    const shade = el("div", "gxa-shade");
    wrap.append(shade, card);
    viewport.appendChild(wrap);
    return { wrap, shade };
  }
  async function openSheet(viewport, sheet, { scale = () => 1, onClose } = {}) {
    sheet.classList.add("gxa-sheet");
    const { wrap, shade } = mount(viewport, sheet);
    const grab = el("div", "gxa-sheet-grab");
    sheet.appendChild(grab);
    let closing = false;
    const close = async (fast) => {
      if (closing) return;
      closing = true;
      const d = fast ? OVERLAY.sheetOutFastMs : OVERLAY.sheetOutMs;
      await Promise.all([
        animate(shade, [{ opacity: 1 }, { opacity: 0 }], { duration: d }),
        animate(sheet, [{ transform: getComputedStyle(sheet).transform }, { transform: "translateY(100%)" }], { duration: d, easing: EASE.in })
      ]);
      wrap.remove();
      onClose && onClose();
    };
    shade.addEventListener("click", () => close());
    let y0 = null, dy = 0;
    grab.addEventListener("pointerdown", (e) => {
      y0 = e.clientY;
      dy = 0;
      grab.setPointerCapture(e.pointerId);
      sheet.getAnimations().forEach((a) => {
        a.commitStyles();
        a.cancel();
      });
    });
    grab.addEventListener("pointermove", (e) => {
      if (y0 === null) return;
      dy = Math.max(0, (e.clientY - y0) / scale());
      sheet.style.transform = `translateY(${dy}px)`;
    });
    grab.addEventListener("pointerup", () => {
      if (y0 === null) return;
      y0 = null;
      if (dy > OVERLAY.dismissPx) close();
      else sheet.animate([{ transform: `translateY(${dy}px)` }, { transform: "none" }], { duration: OVERLAY.snapBackMs, easing: EASE.spring }).finished.then(() => {
        sheet.style.transform = "";
      });
    });
    await Promise.all([
      animate(shade, [{ opacity: 0 }, { opacity: 1 }], { duration: OVERLAY.shadeInMs, easing: "ease-out" }),
      animate(sheet, [{ transform: "translateY(100%)" }, { transform: "none" }], { duration: OVERLAY.sheetInMs, easing: EASE.out })
    ]);
    return { close, element: sheet };
  }
  async function openModal(viewport, card, { onClose } = {}) {
    card.classList.add("gxa-modal");
    const { wrap, shade } = mount(viewport, card);
    const { modalFrom: f, modalTo: t } = OVERLAY;
    let closing = false;
    const close = async (fast) => {
      if (closing) return;
      closing = true;
      const d = fast ? OVERLAY.sheetOutFastMs : OVERLAY.sheetOutMs;
      await Promise.all([
        animate(shade, [{ opacity: 1 }, { opacity: 0 }], { duration: d }),
        animate(card, [{ opacity: 1, transform: "none" }, { opacity: 0, transform: `translateY(${t.y}px) scale(${t.scale})` }], { duration: d, easing: "ease-in" })
      ]);
      wrap.remove();
      onClose && onClose();
    };
    shade.addEventListener("click", () => close());
    await Promise.all([
      animate(shade, [{ opacity: 0 }, { opacity: 1 }], { duration: OVERLAY.shadeInMs, easing: "ease-out" }),
      animate(card, [{ opacity: 0, transform: `translateY(${f.y}px) scale(${f.scale})` }, { opacity: 1, transform: "none" }], { duration: OVERLAY.modalInMs, easing: EASE.spring })
    ]);
    return { close, element: card };
  }

  // src/js/modules/gestures.js
  function initSwipe(target, { onLeft, onRight, onTap, follow = target, scale = () => 1 } = {}) {
    const down = (e) => {
      const x0 = e.clientX, y0 = e.clientY;
      let dx = 0, active = false;
      const move = (ev) => {
        dx = (ev.clientX - x0) / scale();
        const dy = (ev.clientY - y0) / scale();
        if (!active && Math.abs(dx) > GESTURE.swipeLockPx && Math.abs(dx) > Math.abs(dy)) {
          active = true;
          target.setPointerCapture(ev.pointerId);
        }
        if (active) follow.style.transform = `translateX(${dx * GESTURE.swipeFollow}px)`;
      };
      const up = () => {
        var _a;
        removeEventListener("pointermove", move);
        removeEventListener("pointerup", up);
        if (!active) {
          onTap && onTap();
          return;
        }
        if (Math.abs(dx) > GESTURE.swipeCommitPx) {
          follow.style.transform = "";
          (_a = dx < 0 ? onLeft : onRight) == null ? void 0 : _a();
        } else follow.animate([{ transform: follow.style.transform }, { transform: "none" }], { duration: 450, easing: EASE.spring }).finished.then(() => {
          follow.style.transform = "";
        });
      };
      addEventListener("pointermove", move);
      addEventListener("pointerup", up);
    };
    target.addEventListener("pointerdown", down);
    return { destroy() {
      target.removeEventListener("pointerdown", down);
    } };
  }
  function initDragScroll(scroller, { scale = () => 1 } = {}) {
    let suppress = false;
    const down = (e) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      const y0 = e.clientY, s0 = scroller.scrollTop;
      let moved = false;
      const move = (ev) => {
        const dy = (ev.clientY - y0) / scale();
        if (Math.abs(dy) > GESTURE.dragScrollPx) moved = true;
        if (moved) scroller.scrollTop = s0 - dy;
      };
      const up = () => {
        removeEventListener("pointermove", move);
        removeEventListener("pointerup", up);
        if (moved) {
          suppress = true;
          setTimeout(() => {
            suppress = false;
          }, 50);
        }
      };
      addEventListener("pointermove", move);
      addEventListener("pointerup", up);
    };
    const click = (e) => {
      if (suppress) {
        e.stopPropagation();
        e.preventDefault();
        suppress = false;
      }
    };
    scroller.addEventListener("pointerdown", down);
    scroller.addEventListener("click", click, true);
    return { destroy() {
      scroller.removeEventListener("pointerdown", down);
      scroller.removeEventListener("click", click, true);
    } };
  }
  function initScrollProgress(scroller, bar) {
    const on = () => {
      const max = scroller.scrollHeight - scroller.clientHeight;
      bar.style.setProperty("--p", (max > 0 ? scroller.scrollTop / max : 0).toFixed(4));
      bar.classList.toggle("is-on", scroller.scrollTop > 4);
    };
    scroller.addEventListener("scroll", on, { passive: true });
    return { destroy() {
      scroller.removeEventListener("scroll", on);
    } };
  }

  // src/js/modules/signature.js
  function sparks(host, { top = 0, height = SCREEN.height, width = SCREEN.width, alert = false, count = SIGNATURE.sparksCount } = {}) {
    if (prefersReducedMotion()) return { destroy() {
    } };
    const cv = el("canvas", "gxa-canvas", { top: `${top}px`, height: `${height}px` });
    host.appendChild(cv);
    const ctx = cv.getContext("2d"), dpr = Math.min(2, devicePixelRatio || 1);
    cv.width = width * dpr;
    cv.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const cols = alert ? PALETTE.sparksAlert : PALETTE.sparks;
    const pts = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.5 + 0.4,
      // radius 0.4–1.9px
      s: Math.random() * 0.35 + 0.12,
      // rise 0.12–0.47px per frame
      a: Math.random() * 0.5 + 0.15,
      // max opacity 0.15–0.65
      p: Math.random() * 6.28,
      // phase
      c: cols[Math.floor(Math.random() * cols.length)]
    }));
    let raf;
    (function loop(t) {
      if (!cv.isConnected) return;
      raf = requestAnimationFrame(loop);
      ctx.clearRect(0, 0, width, height);
      for (const p of pts) {
        p.y -= p.s;
        p.x += Math.sin(t / 1600 + p.p) * 0.25;
        if (p.y < -6) {
          p.y = height + 6;
          p.x = Math.random() * width;
        }
        const tw = 0.55 + 0.45 * Math.sin(t / 700 + p.p * 3);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, 6.283);
        ctx.fillStyle = `rgba(${p.c},${(p.a * tw).toFixed(3)})`;
        ctx.fill();
      }
    })(0);
    return { destroy() {
      cancelAnimationFrame(raf);
      cv.remove();
    } };
  }
  function confetti(viewport, { x = 196, y = 300, width = SCREEN.width, height = SCREEN.height } = {}) {
    if (prefersReducedMotion()) return;
    const cv = el("canvas", "", { position: "absolute", inset: "0", zIndex: 70, pointerEvents: "none" });
    viewport.appendChild(cv);
    const dpr = Math.min(2, devicePixelRatio || 1);
    cv.width = width * dpr;
    cv.height = height * dpr;
    const ctx = cv.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const cols = PALETTE.confetti;
    const ps = Array.from({ length: SIGNATURE.confettiCount }, () => {
      const a = Math.random() * 6.283, v = Math.random() * 8 + 3;
      return { x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 4, s: Math.random() * 6 + 3, r: Math.random() * 6.28, vr: (Math.random() - 0.5) * 0.4, c: cols[Math.floor(Math.random() * cols.length)] };
    });
    const t0 = performance.now();
    (function frame(t) {
      ctx.clearRect(0, 0, width, height);
      const age = (t - t0) / 1e3;
      for (const p of ps) {
        p.vy += 0.22;
        p.vx *= 0.985;
        p.x += p.vx;
        p.y += p.vy;
        p.r += p.vr;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.r);
        ctx.globalAlpha = Math.max(0, 1 - age / 2.2);
        ctx.fillStyle = p.c;
        ctx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2);
        ctx.restore();
      }
      if (age < SIGNATURE.confettiMs / 1e3) requestAnimationFrame(frame);
      else cv.remove();
    })(t0);
  }
  function autoAdvance(go, ms = SIGNATURE.splashHoldMs) {
    const t = setTimeout(go, ms);
    return { destroy() {
      clearTimeout(t);
    } };
  }
  function pingRings(host, cx, cy, size = 96) {
    const css = { left: `${cx - size / 2}px`, top: `${cy - size / 2}px`, width: `${size}px`, height: `${size}px` };
    host.append(el("i", "gxa-ping", css), el("i", "gxa-ping is-second", css));
  }
  return __toCommonJS(js_exports);
})();
