# Read Page Overrides

> **PROJECT:** Qurescent  
> **Page:** `/read/`, `/read/[id]`  
> Overrides `design-system/qurescent/MASTER.md` for mushaf surfaces.

---

## Layout

- Surah index: compact grid; interaction = cell itself (border + hover accent), not elevated cards
- Chapter view: Arabic is the primary plane; sticky header chrome (glyph · English · settings)
- Translation stack: `max-w-prose` (~65ch), left-aligned under each ayah
- No Copy / share chrome until product scope includes it

## Reader chrome

- One **ChapterReader** client island (settings + verses + translations)
- Sticky header row: **Arabic surah glyph** (left) · **English name** (center) · **circular settings icon** (right)
- On scroll: English fades out; Arabic + settings stay at the edges under Starlight nav (`top: var(--sl-nav-height)`)
- Panel contents:
  - Word-by-word — switch
  - Colored tajweed — switch
  - Translation — exclusive `[EN]` / `[MS]` (tap again to clear); no language prefix on the verse line
- Prefs via `@nanostores/persistent` (`qurescent.*` keys)
- Settings control is a circular icon button; panel uses sharp `rounded` borders — not pill capsules
- Starlight title `ContentPanel` hidden on `/read/[id]` (document `<title>` kept for SEO)

## Typography / glyphs

- Always QCF V4 **COLRv1** + `code_v2` (same file for colored / plain)
- Colored on: `font-palette` base 0/1/2 (light/dark/sepia)
- Colored off: mono bases 3/4/5 — **identical metrics**, no QPC Hafs swap
- Arabic **line-height ~2.45–2.5** (Quran Foundation reading-view guidance); wrap rows get `gap-y-6` / `md:gap-y-8`
- Resolve theme from `document.documentElement[data-theme]` (+ `prefers-color-scheme` when `auto`)
- End-of-ayah marker: QCF `code_v2` (same font/size/leading as the last word); glue to last word so it never orphans; center on the **Arabic glyph line** only, not the word-by-word row. Always use colored theme palette (0/1/2) — mono flattens numeral into the casing
- While fonts load: **MushafLoader** pulse bars (not empty opacity-0); preload page `.woff2` in `<head>`

## Density

- Verse block spacing: `mb-10` between ayahs; generous wrap `gap-y` within an ayah
- Controls: circular 40px settings hit target; panel rows `text-sm`, 200ms color transitions

## Avoid on this page

- Capsule “Aa Translations” styling
- Copy button
- Filled gray card tiles for surahs
- Showing translation lines when enabled list is empty
