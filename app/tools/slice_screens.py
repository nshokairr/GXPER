"""
Turn Figma screen captures into the prototype's screens + screens.json.

Input
  tools/figma-data/data1.json, data2.json   frame sizes, fixed layers, hotspots (exported from Figma, see README)
  tools/captures/<id with - instead of :>.png   one full-frame PNG per screen (not committed: 42MB)
Output
  prototype/screens/<id>.webp   one image per screen (overlays keep transparency)
  source/screens.json           per screen: name, section, size, fixed top/bottom, background,
                                overlay type, reveal bands, hotspots

Run from app/:  python3 tools/slice_screens.py
"""
import json, os
import numpy as np
from PIL import Image

APP = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(APP)

D1 = json.load(open('tools/figma-data/data1.json'))
D2 = json.load(open('tools/figma-data/data2.json'))

SECT = {
  'onboarding': ['2010:11553', '2010:11567', '2013:11594'],
  'signup': ['101:13712', '101:13987', '119:6346', '119:6400', '73:5869', '73:50013', '73:8711', '73:11539', '73:13409', '73:14354', '73:19958'],
  'profile': ['1:101340', '1:102584', '1:103828', '1:107968', '1:109118', '1:110268', '1:112764', '1:112916', '1:113068', '1:113220', '1:113372', '1:113524', '1:119926', '1:121104', '1:122282', '1:123460', '1:124633', '1:125806', '1:127545', '1:128565', '1:129585'],
  'settings': ['73:6824', '73:9653', '73:10597', '73:12474', '73:15293', '73:16230', '73:17172', '73:18095', '101:14031', '73:19030', '73:21265', '101:12569', '73:22272', '73:23235', '73:23246', '120:11313'],
  'delete': ['2026:11582', '2027:11595', '2027:12575', '2027:13561', '2023:37254'],
  'alerts': ['246:12395', '246:13333', '246:14271', '246:15209', '248:11521', '248:12459', '248:13397', '249:14338'],
}
rows = []
for r in D1:
    rows.append(dict(id=r[0], n=r[1], w=393, h=r[2], fx=r[3], hs=r[5]))
for r in D2:
    rows.append(dict(id=r[0], n=r[1], w=r[2], h=r[3], fx=r[4], hs=r[6]))

def section(i):
    for k, v in SECT.items():
        if i in v: return k
    if i.startswith(('123:', '128:', '171:', '126:', '122:', '127:', '163:', '225:')): return 'referee'
    return 'tournaments'

ids = {r['id'] for r in rows}
overlay_ids = set()
for r in rows:
    for h in r['hs']:
        if h[4].startswith('O'): overlay_ids.add(h[4][1:])
missing = set()

os.makedirs('prototype/screens', exist_ok=True)
S = {}
for r in rows:
    i, W, H = r['id'], r['w'], r['h']
    safe = i.replace(':', '-')
    im = Image.open(f'tools/captures/{safe}.png').convert('RGB')
    sc = im.width / W
    is_ov = i in overlay_ids or 'Sheet' in r['n'] or 'popup' in r['n'] or 'bottom sheet' in r['n']
    # fixed regions (only meaningful for scrollable screens)
    top = bot = 0
    if not is_ov and H > 852:
        top = 0
        changed = True
        while changed:
            changed = False
            for y, h in r['fx']:
                if y <= top + 1 and h <= 80 and y + h > top:
                    top = y + h; changed = True
        bmin = H
        changed = True
        while changed:
            changed = False
            for y, h in r['fx']:
                if y + h >= bmin - 1 and h <= 160 and y < bmin:
                    bmin = y; changed = True
        bot = H - bmin if bmin < H else 0
    # bands
    a = np.asarray(im).astype(np.int16)
    rng = (a.max(axis=1) - a.min(axis=1)).max(axis=1)  # per pixel-row spread
    flat = rng <= 10
    start = top if top else (50 if not is_ov else 0)
    end = H - bot
    # css-row flatness: a css row is flat if all its pixel rows are flat
    css_flat = []
    for y in range(H):
        p0, p1 = int(y * sc), max(int((y + 1) * sc), int(y * sc) + 1)
        css_flat.append(bool(flat[p0:min(p1, im.height)].all()) if p0 < im.height else True)
    segs = []  # [y0,y1,isContent]
    y = start
    while y < end:
        f = css_flat[y]
        y2 = y
        while y2 < end and css_flat[y2] == f: y2 += 1
        segs.append([y, y2, 0 if f else 1])
        y = y2
    # merge small gaps (<8) between content, and tiny content (<3)
    changed = True
    while changed:
        changed = False
        for k in range(1, len(segs) - 1):
            g = segs[k]
            if g[2] == 0 and g[1] - g[0] < 8 and segs[k - 1][2] == 1 and segs[k + 1][2] == 1:
                segs[k - 1][1] = segs[k + 1][1]; del segs[k:k + 2]; changed = True; break
    segs = [s for s in segs if not (s[2] == 1 and s[1] - s[0] < 3)] or segs
    # recompute contiguity: fold tiny removed content into neighbours by rebuilding cover
    cover = []
    y = start
    for s in segs:
        if s[0] > y: cover.append([y, s[0], 0])
        cover.append([max(s[0], y), s[1], s[2]]); y = s[1]
    if y < end: cover.append([y, end, 0])
    merged = []
    for s in cover:
        if s[1] <= s[0]: continue
        if merged and merged[-1][2] == s[2]: merged[-1][1] = s[1]
        else: merged.append(list(s))
    # colours: gap colour = median of its rows; content filler = gap above (or below)
    def rowcol(y0, y1):
        p0 = min(int(y0 * sc), im.height - 1); p1 = min(max(int(y1 * sc), p0 + 1), im.height)
        blk = a[p0:p1, 2:-2].reshape(-1, 3)
        c = np.median(blk, axis=0).astype(int)
        return '#%02x%02x%02x' % tuple(c)
    bands = []
    for k, s in enumerate(merged):
        if s[2] == 0: col = rowcol(s[0], s[1])
        else:
            nb = merged[k - 1] if k > 0 and merged[k - 1][2] == 0 else (merged[k + 1] if k + 1 < len(merged) and merged[k + 1][2] == 0 else None)
            col = rowcol(nb[0], nb[1]) if nb else rowcol(s[0], s[0] + 1)
        bands.append([s[0], s[1], col, s[2]])
    bg = rowcol(H - 2, H) if not is_ov else rowcol(int(H * 0.6), int(H * 0.6) + 2)
    # hotspots: drop C duplicates of N/O/B at same rect; drop AFTER triggers
    hs = []
    strong = {(h[0], h[1], h[2], h[3]) for h in r['hs'] if h[4][0] in 'NOBX'}
    for h in r['hs']:
        x, yy, w, hh, act = h[:5]
        trig = h[5] if len(h) > 5 else ''
        if trig.startswith('AFTER'): continue
        if act[0] == 'C' and (x, yy, w, hh) in strong: continue
        if act[0] in 'NO' and act[1:] not in ids:
            missing.add(act); continue
        layer = 't' if top and yy + hh <= top + 1 else ('b' if bot and yy >= H - bot - 1 else 'm')
        e = [x, yy, w, hh, act, layer]
        if trig: e.append('drag')
        hs.append(e)
    hs.sort(key=lambda e: -(e[2] * e[3]))
    if is_ov:
        Image.open(f'tools/captures/{safe}.png').convert('RGBA').save(f'prototype/screens/{safe}.webp', 'WEBP', quality=84, method=6)
    else:
        im.save(f'prototype/screens/{safe}.webp', 'WEBP', quality=82, method=6)
    S[i] = dict(n=r['n'], s=section(i), w=W, h=H, top=top, bot=bot, bg=bg, ov=('modal' if W < 393 else 'sheet') if is_ov else '', b=bands, hs=hs)

json.dump(S, open('source/screens.json', 'w'), separators=(',', ':'))
print('screens', len(S), 'missing dests', sorted(missing))
print('overlays', sorted(overlay_ids))
tot = sum(os.path.getsize('prototype/screens/' + f) for f in os.listdir('prototype/screens'))
print('webp MB', round(tot / 1e6, 1), 'json KB', os.path.getsize('source/screens.json') // 1000)
for k in ['1:79288', '73:5869', '1:101340', '1:119926', '2010:11567', '246:12395', '1:89580']:
    v = S[k]; print(k, v['n'], 'top', v['top'], 'bot', v['bot'], 'bands', [(b[0], b[1], b[3]) for b in v['b']][:14])
