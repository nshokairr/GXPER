var GXMotion = (() => {
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
    closeOverlay: () => closeOverlay,
    confetti: () => confetti,
    flagFieldError: () => flagFieldError,
    holdHeader: () => holdHeader,
    initHeaderAutoHide: () => initHeaderAutoHide,
    initJourney: () => initJourney,
    initMapPin: () => initMapPin,
    initMenu: () => initMenu,
    initMotion: () => initMotion,
    initOrbit: () => initOrbit,
    initReveal: () => initReveal,
    initScrollEffects: () => initScrollEffects,
    initSparks: () => initSparks,
    initSpotlights: () => initSpotlights,
    openOverlay: () => openOverlay,
    pageTransition: () => pageTransition,
    replayEntrance: () => replayEntrance,
    scrollToSection: () => scrollToSection,
    toast: () => toast,
    tokens: () => motion_tokens_exports
  });

  // src/tokens/motion-tokens.js
  var motion_tokens_exports = {};
  __export(motion_tokens_exports, {
    BREAKPOINTS: () => BREAKPOINTS,
    DURATION: () => DURATION,
    EASE: () => EASE,
    HEADER_AUTOHIDE: () => HEADER_AUTOHIDE,
    HEADER_HEIGHT: () => HEADER_HEIGHT,
    JOURNEY: () => JOURNEY,
    PAGE_TRANSITION: () => PAGE_TRANSITION,
    PARALLAX: () => PARALLAX,
    REVEAL: () => REVEAL,
    cssToken: () => cssToken
  });
  var EASE = {
    out: "cubic-bezier(.22, 1, .36, 1)",
    spring: "cubic-bezier(.34, 1.56, .64, 1)",
    inOut: "ease-in-out",
    linear: "linear",
    // Same curves as arrays, for libraries that take control points
    outPoints: [0.22, 1, 0.36, 1],
    springPoints: [0.34, 1.56, 0.64, 1]
  };
  var DURATION = {
    instant: 200,
    fast: 300,
    quick: 350,
    base: 450,
    medium: 550,
    slow: 700,
    slower: 900,
    hero: 1e3
  };
  var JOURNEY = {
    stepMs: 5200,
    // each step stays on screen this long
    swapMs: 380,
    // new title/description written at this moment
    descLagMs: 120,
    // description returns this long after the title
    startProgress: 0.62
    // first step starts 62% "filled" so the first change comes sooner
  };
  var PAGE_TRANSITION = {
    totalMs: 900,
    // full wipe in + out
    swapAtMs: 430,
    // page content is swapped while the screen is covered
    anchorDelayMs: 60
    // after swapping, wait before scrolling to a section
  };
  var REVEAL = {
    rootMargin: "0px 0px -6% 0px",
    // trigger slightly before the element is fully in view
    preHideBelow: 0.92
    // only hide elements that start below 92% of the viewport
  };
  var PARALLAX = {
    heroContent: 0.22,
    // hero text moves at 22% of scroll speed
    heroFadeEnd: 760,
    // hero text fully faded after 760px of scroll
    heroBackground: 0.12,
    heroLimit: 1e3,
    // stop calculating after 1000px of scroll
    phoneSpeeds: [-0.06, 0.04, -0.03]
    // app phones, all screen sizes
  };
  var BREAKPOINTS = {
    tablet: 1100,
    // phones row becomes a swipe row, 2-column grids stack
    nav: 900,
    // desktop nav hides, hamburger menu appears
    mobile: 760,
    // mobile layouts for journey, capabilities, app showcase, footer
    small: 640
    // header CTA hidden, logo 26px
  };
  var HEADER_HEIGHT = { desktop: 82, mobile: 72 };
  var HEADER_AUTOHIDE = {
    minScroll: 120,
    // always visible in the first 120px of the page
    threshold: 6,
    // px of movement in one direction before it reacts
    holdAfterJumpMs: 1400
    // stays visible while the page glides to a section
    // slide: 450ms ease-out (--gx-dur-base / --gx-ease-out), see interactions.css
  };
  var cssToken = (name, el = document.documentElement) => getComputedStyle(el).getPropertyValue(name).trim();

  // src/js/core/env.js
  var rmQuery = typeof matchMedia === "function" ? matchMedia("(prefers-reduced-motion: reduce)") : null;
  var hoverQuery = typeof matchMedia === "function" ? matchMedia("(hover: hover) and (pointer: fine)") : null;
  var prefersReducedMotion = () => !!(rmQuery && rmQuery.matches);
  var $ = (sel, root = document) => root.querySelector(sel);
  var $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  function restartClass(el, cls) {
    el.classList.remove(cls);
    void el.offsetWidth;
    el.classList.add(cls);
  }
  var headerHeight = () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--gx-header-h")) || 82;

  // src/js/modules/reveal.js
  function initReveal(root = document) {
    const reduced = prefersReducedMotion();
    const vh = innerHeight;
    $$("[data-gx-stagger]", root).forEach((group) => {
      const step = parseFloat(group.dataset.gxStagger) || 0.08;
      $$("[data-gx-reveal]", group).forEach((el, i) => {
        if (!el.style.getPropertyValue("--gx-delay")) el.style.setProperty("--gx-delay", `${(i * step).toFixed(2)}s`);
      });
    });
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const row = e.target.closest(".gx-phones");
        (row ? $$("[data-gx-reveal]", row) : [e.target]).forEach((t) => {
          t.classList.remove("is-pending");
          io.unobserve(t);
        });
      });
    }, { rootMargin: REVEAL.rootMargin, threshold: 0 });
    $$("[data-gx-reveal]", root).forEach((el) => {
      if (reduced) {
        el.classList.remove("is-pending");
        return;
      }
      if (el.getBoundingClientRect().top > vh * REVEAL.preHideBelow) {
        el.classList.add("is-pending");
        io.observe(el);
      } else {
        el.classList.remove("is-pending");
      }
    });
    const rollIo = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.remove("is-pending");
        rollIo.unobserve(e.target);
      });
    }, { threshold: 0.4 });
    $$("[data-gx-roll]", root).forEach((el) => {
      if (reduced || el.getBoundingClientRect().top < vh) return;
      el.classList.add("is-pending");
      rollIo.observe(el);
    });
    return { destroy() {
      io.disconnect();
      rollIo.disconnect();
    } };
  }

  // src/js/core/frame-loop.js
  var subs = /* @__PURE__ */ new Set();
  var rafId = 0;
  var last = 0;
  function tick(now) {
    const dt = Math.min(64, now - (last || now));
    last = now;
    subs.forEach((fn) => fn(now, dt));
    rafId = subs.size ? requestAnimationFrame(tick) : 0;
  }
  function subscribe(fn) {
    subs.add(fn);
    if (!rafId) {
      last = 0;
      rafId = requestAnimationFrame(tick);
    }
    return () => {
      subs.delete(fn);
      if (!subs.size && rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
    };
  }
  function rafThrottle(fn) {
    let queued = false;
    return (...args) => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        fn(...args);
      });
    };
  }

  // src/js/modules/scroll-effects.js
  function initScrollEffects(root = document) {
    const bar = $("[data-gx-progress]", root);
    const heroContent = $("[data-gx-hero-content]", root);
    const heroPhoto = $("[data-gx-hero-photo]", root);
    const phones = $$("[data-gx-parallax]", root);
    const update = rafThrottle(() => {
      const max = document.documentElement.scrollHeight - innerHeight;
      if (bar) bar.style.setProperty("--gx-progress", max > 0 ? (scrollY / max).toFixed(4) : "0");
      if (prefersReducedMotion()) return;
      const y = scrollY;
      if (y < PARALLAX.heroLimit) {
        if (heroContent) {
          heroContent.style.transform = `translateY(${(y * PARALLAX.heroContent).toFixed(1)}px)`;
          heroContent.style.opacity = Math.max(0, 1 - y / PARALLAX.heroFadeEnd).toFixed(3);
        }
        if (heroPhoto) heroPhoto.style.translate = `0 ${(y * PARALLAX.heroBackground).toFixed(1)}px`;
      }
      const mid = innerHeight / 2;
      phones.forEach((p) => {
        const r = p.getBoundingClientRect();
        const offset = r.top + r.height / 2 - mid;
        p.firstElementChild.style.setProperty("--gx-py", `${(offset * parseFloat(p.dataset.gxParallax)).toFixed(1)}px`);
      });
    });
    addEventListener("scroll", update, { passive: true });
    addEventListener("resize", update);
    update();
    return {
      update,
      destroy() {
        removeEventListener("scroll", update);
        removeEventListener("resize", update);
      }
    };
  }

  // src/js/modules/sparks.js
  var COLOURS = ["255,12,225", "255,238,6", "105,210,255", "255,238,6"];
  function initSparks(canvas) {
    if (!canvas || prefersReducedMotion()) return { destroy() {
    } };
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(2, devicePixelRatio || 1);
    let w = 0, h = 0, pts = [], visible = true;
    const size = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const seed = () => {
      pts = Array.from({ length: Math.round(Math.min(70, w / 22)) }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.6 + 0.4,
        s: Math.random() * 0.35 + 0.12,
        a: Math.random() * 0.5 + 0.12,
        p: Math.random() * Math.PI * 2,
        c: COLOURS[Math.random() * COLOURS.length | 0]
      }));
    };
    const onResize = () => {
      size();
      seed();
    };
    size();
    seed();
    addEventListener("resize", onResize);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
    });
    io.observe(canvas);
    const off = subscribe((t) => {
      if (!visible || document.hidden) return;
      ctx.clearRect(0, 0, w, h);
      for (const p of pts) {
        p.y -= p.s;
        p.x += Math.sin(t / 1600 + p.p) * 0.25;
        if (p.y < -10) {
          p.y = h + 10;
          p.x = Math.random() * w;
        }
        const twinkle = 0.55 + 0.45 * Math.sin(t / 700 + p.p * 3);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.c},${(p.a * twinkle).toFixed(3)})`;
        ctx.fill();
      }
    });
    return { destroy() {
      off();
      io.disconnect();
      removeEventListener("resize", onResize);
    } };
  }

  // src/js/modules/journey.js
  function initJourney(section) {
    if (!section) return null;
    const steps = $$("[data-gx-journey-step]", section);
    const visuals = $$("[data-gx-journey-visual]", section);
    const title = $("[data-gx-journey-title]", section);
    const desc = $("[data-gx-journey-desc]", section);
    const ghost = $("[data-gx-journey-ghost]", section);
    const progress = $("[data-gx-journey-progress]", section);
    const data = steps.map((b) => ({ title: b.dataset.title, desc: b.dataset.desc }));
    const count = steps.length;
    let index = 0;
    let elapsed = JOURNEY.stepMs * JOURNEY.startProgress;
    let hovered = false, inView = false, manualPause = false;
    let swapTimer = 0, descTimer = 0;
    function paint(i, animate) {
      steps.forEach((s, k) => {
        s.classList.toggle("is-active", k === i);
        s.classList.toggle("is-done", k < i);
        s.setAttribute("aria-selected", String(k === i));
        s.tabIndex = k === i ? 0 : -1;
      });
      visuals.forEach((v2, k) => v2.classList.toggle("is-hidden", k !== i));
      const v = visuals[i];
      if (v) {
        v.classList.remove("is-switching");
        if (animate) restartClass(v, "is-switching");
      }
      const write = () => {
        if (title && data[i].title) title.textContent = data[i].title;
        if (desc && data[i].desc) desc.textContent = data[i].desc;
        if (ghost) ghost.textContent = String(i + 1).padStart(2, "0");
      };
      if (!animate) {
        write();
        return;
      }
      title == null ? void 0 : title.classList.add("is-out");
      desc == null ? void 0 : desc.classList.add("is-out");
      if (ghost) ghost.style.transform = "translateY(-100%)";
      clearTimeout(swapTimer);
      clearTimeout(descTimer);
      swapTimer = setTimeout(() => {
        write();
        if (ghost) {
          ghost.style.transition = "none";
          ghost.style.transform = "translateY(100%)";
          void ghost.offsetWidth;
          ghost.style.transition = "";
          ghost.style.transform = "";
        }
        title == null ? void 0 : title.classList.remove("is-out");
        descTimer = setTimeout(() => desc == null ? void 0 : desc.classList.remove("is-out"), JOURNEY.descLagMs);
      }, JOURNEY.swapMs);
    }
    function go(i, { animate = !prefersReducedMotion() } = {}) {
      index = (i + count) % count;
      elapsed = 0;
      paint(index, animate);
    }
    const off = subscribe((now, dt) => {
      var _a;
      const playing = inView && !hovered && !manualPause && !document.hidden && !prefersReducedMotion();
      if (playing) elapsed += dt;
      const p = Math.min(1, elapsed / JOURNEY.stepMs);
      progress == null ? void 0 : progress.style.setProperty("--gx-journey-progress", ((index + p) / count).toFixed(4));
      (_a = steps[index]) == null ? void 0 : _a.style.setProperty("--gx-step-progress", p.toFixed(3));
      if (p >= 1) go(index + 1);
    });
    const io = new IntersectionObserver(([e]) => {
      inView = e.isIntersecting;
      section.classList.toggle("is-offscreen", !inView);
    }, { threshold: 0.35 });
    io.observe(section);
    const enter = (e) => {
      if (e.pointerType === "mouse") hovered = true;
    };
    const leave = () => {
      hovered = false;
    };
    section.addEventListener("pointerenter", enter);
    section.addEventListener("pointerleave", leave);
    const clicks = steps.map((s, k) => {
      const fn = () => go(k);
      s.addEventListener("click", fn);
      return fn;
    });
    const onKey = (e) => {
      const rtl = getComputedStyle(section).direction === "rtl";
      const k = { ArrowRight: rtl ? -1 : 1, ArrowLeft: rtl ? 1 : -1 }[e.key];
      if (!k || !e.target.matches("[data-gx-journey-step]")) return;
      e.preventDefault();
      go(index + k);
      steps[index].focus();
    };
    section.addEventListener("keydown", onKey);
    paint(0, false);
    return {
      go: (i) => go(i),
      pause: () => {
        manualPause = true;
      },
      resume: () => {
        manualPause = false;
      },
      get index() {
        return index;
      },
      destroy() {
        off();
        io.disconnect();
        clearTimeout(swapTimer);
        clearTimeout(descTimer);
        section.removeEventListener("pointerenter", enter);
        section.removeEventListener("pointerleave", leave);
        section.removeEventListener("keydown", onKey);
        steps.forEach((s, k) => s.removeEventListener("click", clicks[k]));
      }
    };
  }

  // src/js/modules/orbit.js
  function initOrbit(box) {
    if (!box) return null;
    const orbit = $("[data-gx-orbit]", box);
    const BASE_W = 670;
    const scale = () => orbit.style.setProperty("--gx-orbit-scale", Math.min(1, box.clientWidth / BASE_W).toFixed(4));
    const ro = new ResizeObserver(scale);
    ro.observe(box);
    scale();
    let revealIo = null;
    if (!prefersReducedMotion() && box.getBoundingClientRect().top > innerHeight * 0.8) {
      orbit.classList.add("is-pending");
      revealIo = new IntersectionObserver(([e]) => {
        if (!e.isIntersecting) return;
        orbit.classList.remove("is-pending");
        revealIo.disconnect();
      }, { threshold: 0.3 });
      revealIo.observe(box);
    }
    const visIo = new IntersectionObserver(([e]) => orbit.classList.toggle("is-offscreen", !e.isIntersecting));
    visIo.observe(box);
    return { destroy() {
      ro.disconnect();
      visIo.disconnect();
      revealIo == null ? void 0 : revealIo.disconnect();
    } };
  }

  // src/js/modules/pointer-spotlight.js
  function initSpotlights(root = document) {
    const els = $$("[data-gx-spotlight]", root);
    const handlers = els.map((el) => {
      const fn = (e) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty("--gx-mx", `${e.clientX - r.left}px`);
        el.style.setProperty("--gx-my", `${e.clientY - r.top}px`);
      };
      el.addEventListener("pointermove", fn, { passive: true });
      return fn;
    });
    return { destroy() {
      els.forEach((el, i) => el.removeEventListener("pointermove", handlers[i]));
    } };
  }

  // src/js/modules/ui.js
  function initMenu(root = document) {
    const btn = $("[data-gx-menu-toggle]", root);
    if (!btn) return null;
    const menu = document.getElementById(btn.getAttribute("aria-controls"));
    const set = (open) => {
      document.body.classList.toggle("is-menu-open", open);
      document.body.classList.toggle("is-scroll-locked", open);
      btn.setAttribute("aria-expanded", String(open));
    };
    const toggle = () => set(!document.body.classList.contains("is-menu-open"));
    const onKey = (e) => {
      if (e.key === "Escape") set(false);
    };
    const onLink = (e) => {
      if (e.target.closest("a")) set(false);
    };
    btn.addEventListener("click", toggle);
    document.addEventListener("keydown", onKey);
    menu == null ? void 0 : menu.addEventListener("click", onLink);
    return {
      open: () => set(true),
      close: () => set(false),
      destroy() {
        btn.removeEventListener("click", toggle);
        document.removeEventListener("keydown", onKey);
        menu == null ? void 0 : menu.removeEventListener("click", onLink);
      }
    };
  }
  var toastTimer = 0;
  function toast(message, ms = 2200) {
    const el = $("[data-gx-toast]");
    if (!el) return;
    el.textContent = message;
    el.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("is-visible"), ms);
  }
  function openOverlay(el) {
    el.hidden = false;
    document.body.classList.add("is-scroll-locked");
    requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add("is-open")));
  }
  function closeOverlay(el) {
    el.classList.remove("is-open");
    document.body.classList.remove("is-scroll-locked");
    return new Promise((r) => setTimeout(() => {
      el.hidden = true;
      r();
    }, prefersReducedMotion() ? 0 : 420));
  }
  function flagFieldError(field) {
    field.classList.remove("is-error");
    void field.offsetWidth;
    field.classList.add("is-error");
  }

  // src/js/modules/header.js
  var html = document.documentElement;
  var holdUntil = 0;
  function holdHeader(ms = HEADER_AUTOHIDE.holdAfterJumpMs) {
    holdUntil = performance.now() + ms;
    html.classList.remove("is-header-hidden");
  }
  function initHeaderAutoHide(root = document) {
    const header = $(".gx-header", root);
    if (!header) return null;
    const { minScroll, threshold } = HEADER_AUTOHIDE;
    let lastY = scrollY;
    const update = rafThrottle(() => {
      const y = Math.max(0, scrollY);
      const dy = y - lastY;
      const menuOpen = html.classList.contains("is-menu-open") || document.body.classList.contains("is-menu-open");
      if (y < minScroll || menuOpen || performance.now() < holdUntil) html.classList.remove("is-header-hidden");
      else if (dy > threshold) html.classList.add("is-header-hidden");
      else if (dy < -threshold) html.classList.remove("is-header-hidden");
      if (Math.abs(dy) > threshold || y < minScroll) lastY = y;
    });
    const onFocus = (e) => {
      if (header.contains(e.target)) holdHeader(400);
    };
    addEventListener("scroll", update, { passive: true });
    document.addEventListener("focusin", onFocus);
    update();
    return {
      destroy() {
        removeEventListener("scroll", update);
        document.removeEventListener("focusin", onFocus);
        html.classList.remove("is-header-hidden");
      }
    };
  }

  // src/js/modules/page-transition.js
  var running = false;
  function pageTransition(swap) {
    const wipe = $("[data-gx-wipe]");
    if (!wipe || prefersReducedMotion()) {
      swap == null ? void 0 : swap();
      scrollTo(0, 0);
      return Promise.resolve();
    }
    if (running) return Promise.resolve();
    running = true;
    restartClass(wipe, "is-running");
    return new Promise((resolve) => {
      setTimeout(async () => {
        await (swap == null ? void 0 : swap());
        const html2 = document.documentElement;
        const prev = html2.style.scrollBehavior;
        html2.style.scrollBehavior = "auto";
        scrollTo(0, 0);
        html2.style.scrollBehavior = prev;
      }, PAGE_TRANSITION.swapAtMs);
      setTimeout(() => {
        running = false;
        wipe.classList.remove("is-running");
        resolve();
      }, PAGE_TRANSITION.totalMs);
    });
  }
  function scrollToSection(id) {
    const behavior = prefersReducedMotion() ? "auto" : "smooth";
    if (!id) {
      scrollTo({ top: 0, behavior });
      return;
    }
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + scrollY - headerHeight();
    holdHeader();
    scrollTo({ top: Math.max(0, top), behavior });
  }
  function replayEntrance(root) {
    $$(".gx-page-hero__eyebrow, .gx-page-hero__line > span, .gx-page-hero__intro", root).forEach((el) => {
      el.style.animation = "none";
      void el.offsetWidth;
      el.style.animation = "";
    });
  }

  // src/js/modules/map-pin.js
  var ART_W = 976;
  var ART_H = 355;
  function initMapPin(map, { cities = [], start = { x: 477, y: 184 }, onChange } = {}) {
    if (!map) return null;
    const img = $("[data-gx-map-img]", map);
    const pin = $("[data-gx-map-pin]", map);
    const drop = $("[data-gx-map-pin-drop]", map);
    const label = $("[data-gx-map-label]");
    let pos = { ...start };
    const scale = () => ({ sx: img.clientWidth / ART_W, sy: img.clientHeight / ART_H, ox: img.offsetLeft, oy: img.offsetTop });
    const place = (x, y, animate) => {
      pos = { x, y };
      const m = scale();
      pin.style.transition = animate ? "" : "none";
      pin.style.transform = `translate(${m.ox + x * m.sx}px, ${m.oy + y * m.sy}px)`;
    };
    const nearest = (x, y) => cities.reduce((best, c) => {
      const d = (c.x - x) ** 2 + (c.y - y) ** 2;
      return d < best.d ? { c, d } : best;
    }, { c: null, d: Infinity }).c;
    const ripple = (px, py) => {
      if (prefersReducedMotion()) return;
      const r = document.createElement("i");
      r.className = "gx-map__ripple";
      r.style.left = `${px}px`;
      r.style.top = `${py}px`;
      map.appendChild(r);
      setTimeout(() => r.remove(), 950);
    };
    const setLabel = (text) => {
      if (!label || label.textContent === text) return;
      label.classList.add("is-out");
      setTimeout(() => {
        label.textContent = text;
        label.classList.remove("is-out");
      }, prefersReducedMotion() ? 0 : 220);
    };
    const dropTo = (x, y) => {
      place(x, y, true);
      if (drop && !prefersReducedMotion()) restartClass(drop, "is-dropping");
      const m = scale();
      ripple(m.ox + x * m.sx, m.oy + y * m.sy);
      const c = nearest(x, y);
      if (c) {
        setLabel(`${c.name}, ${c.country}`);
        onChange == null ? void 0 : onChange(c);
      }
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
    map.addEventListener("click", onClick);
    map.addEventListener("keydown", onKey);
    addEventListener("resize", onResize);
    place(pos.x, pos.y, false);
    return {
      dropTo,
      refresh: onResize,
      // call after the modal becomes visible
      destroy() {
        map.removeEventListener("click", onClick);
        map.removeEventListener("keydown", onKey);
        removeEventListener("resize", onResize);
      }
    };
  }

  // src/js/modules/confetti.js
  var COLOURS2 = ["#eb008b", "#fff400", "#69d2ff", "#f7f6f5"];
  function confetti() {
    const cv = $("[data-gx-confetti]");
    if (!cv || prefersReducedMotion()) return;
    cv.hidden = false;
    const ctx = cv.getContext("2d");
    const dpr = Math.min(2, devicePixelRatio || 1);
    const W = innerWidth, H = innerHeight;
    cv.width = W * dpr;
    cv.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const cx = W / 2, cy = H / 2 - 120;
    const n = W <= 760 ? 80 : 120;
    const parts = Array.from({ length: n }, () => {
      const a = Math.random() * Math.PI * 2, v = Math.random() * 9 + 4;
      return { x: cx, y: cy, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 4, s: Math.random() * 6 + 3, r: Math.random() * 6.28, vr: (Math.random() - 0.5) * 0.4, c: COLOURS2[Math.random() * 4 | 0] };
    });
    const t0 = performance.now();
    (function frame(t) {
      const age = (t - t0) / 1e3;
      ctx.clearRect(0, 0, W, H);
      const life = Math.max(0, 1 - age / 2.2);
      for (const p of parts) {
        p.vy += 0.22;
        p.vx *= 0.985;
        p.x += p.vx;
        p.y += p.vy;
        p.r += p.vr;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.r);
        ctx.globalAlpha = life;
        ctx.fillStyle = p.c;
        ctx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2);
        ctx.restore();
      }
      if (age < 2.3) requestAnimationFrame(frame);
      else {
        ctx.clearRect(0, 0, W, H);
        cv.hidden = true;
      }
    })(t0);
  }

  // src/js/index.js
  function initMotion(root = document) {
    const parts = [
      initReveal(root),
      initScrollEffects(root),
      initSparks($("[data-gx-sparks]", root)),
      initJourney($("[data-gx-journey]", root)),
      initOrbit($("[data-gx-orbit-box]", root)),
      initSpotlights(root),
      initMenu(root),
      initHeaderAutoHide(root)
    ].filter(Boolean);
    return { destroy: () => parts.forEach((p) => {
      var _a;
      return (_a = p.destroy) == null ? void 0 : _a.call(p);
    }) };
  }
  return __toCommonJS(js_exports);
})();
