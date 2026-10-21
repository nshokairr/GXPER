/* DEMO wiring only — shows how the motion API is called from app code.
   In the real project this logic lives in your router / form components. */
(() => {
  const M = window.GXMotion;          // the dist bundle exposes everything here
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];

  let motion = M.initMotion(document);

  /* ---- G6 page wipe between "Home" and "Contact" ---- */
  let current = 'home';
  function show(page) {
    if (page === current) return;
    M.pageTransition(() => {
      $('#page-home').hidden = page !== 'home';
      $('#page-contact').hidden = page !== 'contact';
      current = page;
      motion.destroy();
      motion = M.initMotion(document);
      M.replayEntrance($('#page-' + page));
    });
  }
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href').slice(1);
    e.preventDefault();
    if (a.dataset.demoPage) { show(a.dataset.demoPage); return; }
    if (current !== 'home') { show('home'); setTimeout(() => M.scrollToSection(id === 'top' ? null : id), 1000); return; }
    M.scrollToSection(id === 'top' ? null : id);           // G11 smooth scroll with header offset
  });

  /* ---- V1–V4 map picker ---- */
  const mapOv = $('[data-demo-map-ov]'), succOv = $('[data-demo-succ-ov]');
  const cities = [
    { name: 'Tabuk', country: 'Saudi Arabia', x: 300, y: 75 }, { name: 'Madinah', country: 'Saudi Arabia', x: 372, y: 150 },
    { name: 'Jeddah', country: 'Saudi Arabia', x: 395, y: 232 }, { name: 'Riyadh', country: 'Saudi Arabia', x: 505, y: 182 },
    { name: 'Dammam', country: 'Saudi Arabia', x: 560, y: 128 }, { name: 'Abha', country: 'Saudi Arabia', x: 447, y: 305 },
    { name: 'Abu Dhabi', country: 'United Arab Emirates', x: 642, y: 178 }, { name: 'Dubai', country: 'United Arab Emirates', x: 666, y: 162 },
  ];
  let chosen = cities[2];
  const pin = M.initMapPin($('[data-gx-map]'), { cities, start: { x: 395, y: 232 }, onChange: (c) => (chosen = c) });
  $('[data-demo-open-map]').addEventListener('click', () => { M.openOverlay(mapOv); requestAnimationFrame(() => pin.refresh()); });
  $('[data-demo-confirm]').addEventListener('click', () => { $('[data-demo-loc]').textContent = `${chosen.name}, ${chosen.country}`; M.closeOverlay(mapOv); M.toast('Pinned ' + chosen.name); });
  $$('[data-demo-close]').forEach((b) => b.addEventListener('click', () => M.closeOverlay(b.closest('.gx-overlay'))));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') $$('.gx-overlay.is-open').forEach(M.closeOverlay); });

  /* ---- R6 submit: validate → loading bar → success + confetti ---- */
  $('[data-demo-form]').addEventListener('submit', (e) => {
    e.preventDefault();
    const count = $('#f2');
    if (!/^\d{1,5}$/.test(count.value.trim())) { M.flagFieldError(count.closest('.gx-field')); M.toast('Enter the expected number of participants'); return; }
    const btn = $('[data-demo-submit]');
    btn.classList.add('is-busy'); $('[data-demo-submit-txt]').textContent = 'Sending request…';
    setTimeout(() => {
      btn.classList.remove('is-busy'); $('[data-demo-submit-txt]').textContent = 'Request Tournament';
      M.openOverlay(succOv); M.confetti();
    }, 950);
  });
  $('#f2').addEventListener('input', (e) => e.target.closest('.gx-field').classList.remove('is-error'));
})();
