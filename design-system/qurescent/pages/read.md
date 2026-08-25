# Page override: `/read/*` (mushaf)

Overrides `design-system/qurescent/MASTER.md` for the Quran reader chrome.

## Contrast floor (WCAG 2.2 AA)

AccessLint on `/read/1` (2026-08-25) failed muted UI at 2.03–3.74:1.

| Surface | Token | Notes |
| --- | --- | --- |
| Body / translation text | `--sl-color-gray-1` | Prefer over Tailwind `gray-400` / `slate-500` |
| Labels, wbw gloss | `--sl-color-gray-2` | Muted secondary |
| Copy / controls | `--sl-color-white` | gray-1 still ~4.3:1 on dark — use white |
| Avoid | `text-gray-400`, `dark:text-slate-500`, Copy on gray-2 | Known failures |

## Interaction

- `cursor-pointer` + `transition-colors duration-200` on Copy / Aa Translations
- Translation drawer: `role="dialog"` + `aria-controls` / `aria-expanded`

## Out of scope here

- QCF glyph tajweed colors (font-baked; human review #2)
- Starlight sidebar `<summary>` name quirk (upstream shell)
