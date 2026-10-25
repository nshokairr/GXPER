# 07 · Arabic version (right-to-left)

The site has an **EN / عربي** button in the header. It switches the whole
site, including the copy, the reading direction and the fonts, without
leaving the page. Open `prototype/index.html` and press **عربي** to see it.

**The one rule:** Arabic is a mirror of English. Everything that moves
"forward" moves toward the reading direction: → in English, ← in Arabic.
Timings, easing curves and distances stay exactly the same.

## 1. Switching language

| What | How |
|---|---|
| Button | `عربي` in English mode, `EN` in Arabic mode. Same style as the menu button (46px, 12px radius), placed before the header CTA. On phones it sits next to the menu button. |
| Transition | The page wipe (G6) covers the screen, the language swaps at 430ms, then the wipe uncovers. In Arabic the wipe sweeps right → left. With Reduce Motion the swap is instant. |
| `<html>` | `lang="ar" dir="rtl"` (English: `lang="en" dir="ltr"`). All the RTL CSS hangs off these two attributes. |
| Remembered | The choice is saved (`localStorage gxLang`). `?lang=ar` in the URL opens straight in Arabic. On the real site, prefer a URL per language (`/ar/…`) for SEO. |
| Copy | Every string has an Arabic version (see the `AR` table in `prototype/index.html`). Brand and game names (GXPER, VALORANT, EA SPORTS FC 26…) and the email stay in English. **The Arabic copy should be reviewed by a native copywriter before launch.** |

## 2. Fonts

Arabic letters use their own fonts; English letters keep League Gothic +
Poppins. This is done with `unicode-range`, so a mixed line like
"تحدّث مع GXPER" uses the right font for each part automatically.

| Role | English | Arabic | File |
|---|---|---|---|
| Headlines | League Gothic | **Changa** 600 / 700 | `prototype/assets/fonts/changa-arabic-*.woff2` |
| Body | Poppins | **IBM Plex Sans Arabic** 400 / 500 / 600 | `prototype/assets/fonts/ibm-plex-sans-arabic-*.woff2` |

```css
@font-face {
  font-family: 'GX Arabic Display';
  src: url(/fonts/changa-arabic-700-normal.woff2) format('woff2');
  font-weight: 651 1000;
  size-adjust: 80%;                 /* sits at League Gothic's height, so every headline size works in both languages */
  unicode-range: U+0600-06FF, U+0750-077F, U+08A0-08FF, U+FB50-FDFF, U+FE70-FEFC, U+200C-200E;
}
--display: 'League Gothic', 'GX Arabic Display', sans-serif;
--body:    'Poppins', 'GX Arabic Text', system-ui, sans-serif;
```

Both fonts are free (SIL Open Font License, from Google Fonts / Fontsource).

Type rules in Arabic:
- **No letter-spacing.** Spacing pulls joined Arabic letters apart, so tracking is set to 0. The eyebrow "track in" animation (H2) becomes a plain fade.
- **No uppercase.** Arabic has no capitals, so nothing to do.
- **Eyebrows 13px** (instead of 11.5px). Small Arabic text needs a little more size.
- **Masked headlines get extra room** (`padding-block: .08em`). Arabic letters reach higher and lower, so the line-rise mask (H3, G7) would otherwise clip dots and marks.

## 3. What mirrors

`dir="rtl"` mirrors every flex and grid layout on its own: header, nav, cards,
form, footer, swipe rows, the capability list. The table covers what needs
help. All of these rules are in `src/styles/rtl.css`.

| ID | English | Arabic |
|---|---|---|
| G1 | Button arrow points →, slides 4px → on hover, sheen sweeps → | Arrow points ←, slides ←, sheen sweeps ← |
| G2 | Nav underline grows from the left | Grows from the right |
| G3b | Header hides / shows | Same (vertical, no change) |
| G4 | Progress bar fills from the left | Fills from the right |
| G5 | Arrow links nudge →, back link nudges ← | Mirrored |
| G6 | Wipe sweeps left → right | Sweeps right → left |
| G7 | Line reveals draw from the left | Draw from the right |
| G12 | Dropdown arrow on the right | On the left |
| H1 | Hero copy on the left, photo as is | Copy on the right, photo and shade mirrored (`scale: -1 1`) |
| H5 | Hero rule draws →, light runs → | Draws ←, light runs ← |
| A6 | Swipe row starts at the left edge | Starts at the right edge (native with `dir="rtl"`) |
| J1 | Timeline fills left → right, glowing head on the right | Fills right → left, head on the left. Step 01 is on the right |
| J2 | Title wipes out to the left | Wipes out to the right |
| J6 | Rule after the eyebrow, on the right | Rule after the eyebrow, on the left |
| — | Journey keys: → next, ← back | ← next, → back (`journey.js` reads the direction) |
| C1, C4 | Phone list row nudges →, bar draws → | Nudges ←, draws ← |
| R2 | Form top glint runs → | Runs ← |
| K1, M1 | Contact card / metric title nudge → | Nudge ← |
| V | Map picker: buttons top-right | Buttons top-left. **The map itself never mirrors** (it's geography) |

What does **not** mirror:
- Maps, map pins, the orbit drawing, phone screenshots, logos, the game controller art.
- Vertical motion: reveals rising, floating phones, header hide, parallax.
- Numbers ("01", "250+") are written left to right inside Arabic text, as normal.

## 4. Testing checklist
- Press **عربي** on every page (home, contact, privacy, marketing, support, copyright), then press **EN**. The English must come back exactly the same.
- Check that the journey auto-plays right → left and that clicking a step works.
- Pick a city on the map: the label reads "جدة، المملكة العربية السعودية".
- Submit the form with letters in "عدد المشاركين": the Arabic error toast appears.
- Phone width: the swipe row starts at the right and the third phone peeks in from the left.
- Turn on Reduce Motion: the switch is instant and nothing animates.
