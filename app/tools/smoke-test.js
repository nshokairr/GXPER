/**
 * Browser smoke test for the prototype (Playwright).
 *   cd app/prototype && python3 -m http.server 8765
 *   node app/tools/smoke-test.js          → screenshots in ./qa-shots/
 * Walks: Home reveal → push to details → segment → tab bar → share popup + toast →
 * profile swipe → delete-account sheet screen → account deleted → thank-you confetti.
 */
const {chromium} = require('playwright');
const fs = require('fs'); fs.mkdirSync('qa-shots', {recursive: true});
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({viewport: {width: 1440, height: 900}});
  const errs = [];
  p.on('pageerror', e => errs.push(String(e)));
  const shot = async n => p.screenshot({path: `qa-shots/${n}.png`, clip: {x: 560, y: 0, width: 760, height: 900}});
  const tap = async (x, y) => { const r = await p.$eval('#phone', e => { const b = e.getBoundingClientRect(); return {l: b.left, t: b.top, k: b.width / 393}; }); await p.mouse.click(r.l + x * r.k, r.t + y * r.k); };
  await p.goto('http://localhost:8765/index.html#1:79288');
  await p.waitForTimeout(260); await shot('10-home-reveal-mid');
  await p.waitForTimeout(1200); await shot('11-home');
  await tap(196, 680); await p.waitForTimeout(300); await shot('12-push-details-mid');
  await p.waitForTimeout(900);
  await tap(243, 390); await p.waitForTimeout(160); await shot('13-seg-mid');
  await p.waitForTimeout(900); await shot('14-seg-end');
  await tap(274, 800); await p.waitForTimeout(150); await shot('15-tab-mid');
  await p.waitForTimeout(1000); await shot('16-profile');
  await tap(363, 209); await p.waitForTimeout(200); await shot('17-modal-mid');
  await p.waitForTimeout(700); await shot('18-modal');
  await tap(196, 702); await p.waitForTimeout(500); await shot('18b-toast');
  await p.waitForTimeout(900);
  // swipe profile card
  const r = await p.$eval('#phone', e => { const b = e.getBoundingClientRect(); return {l: b.left, t: b.top, k: b.width / 393}; });
  await p.mouse.move(r.l + 300 * r.k, r.t + 450 * r.k); await p.mouse.down(); await p.mouse.move(r.l + 200 * r.k, r.t + 455 * r.k, {steps: 8}); await p.mouse.move(r.l + 120 * r.k, r.t + 455 * r.k, {steps: 8}); await p.mouse.up();
  await p.waitForTimeout(250); await shot('19-swipe-mid');
  await p.waitForTimeout(900); await shot('20-swiped');
  console.log(await p.$eval('#nowV', e => e.textContent));
  // delete flow
  await p.goto('http://localhost:8765/index.html#2027:11595'); await p.reload(); await p.waitForTimeout(1200);
  await tap(196, 761); await p.waitForTimeout(500); await shot('21-busy');
  await p.waitForTimeout(700); await shot('22-sheetin');
  await p.waitForTimeout(800);
  await tap(196, 761); await p.waitForTimeout(1300); await shot('23-deleted-mid');
  await p.waitForTimeout(1500); await shot('24-deleted');
  await p.goto('http://localhost:8765/index.html#1:107042'); await p.reload(); await p.waitForTimeout(1100); await shot('25-thanks');
  console.log('errors', JSON.stringify(errs));
  await b.close();
})();
