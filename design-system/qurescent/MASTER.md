# Design System Master File

> **LOGIC:** When building a specific page, first check `design-system/qurescent/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.
>
> Auto-generated ui-ux-pro-max output was revised for Qurescent constraints
> (techdoc shell, Islamic education respect, no purple/Inter/cream-terracotta defaults).
> Source tickets: [#15](https://github.com/kihonq/qurescent/issues/15) (baseline),
> Plum Ink lock (2026-08-26).

---

**Project:** Qurescent  
**Updated:** 2026-08-26  
**Category:** Techdoc manual (Starlight) + mushaf reader  
**Voice:** Learning the Quran from an engineer lens — sources, certainty, static tooling

---

## Global Rules

### Style

- **Name:** Minimal / Swiss documentation
- **Keywords:** clean, readable, spacious, high contrast, functional, dense-where-needed
- **Shell:** Astro Starlight (sidebar, Cmd+K search, light + dark)
- **Avoid:** purple-on-white / indigo default, Inter-only UI, cream + terracotta AI look, pill clusters, heavy glass cards, emoji-as-icons, glow effects, “AI purple”

### Color Palette (semantic) — **Plum Ink**

Near-black / soft-white techdoc surfaces with a striking burgundy accent.
Implemented via Starlight `--sl-color-*` in `src/styles/theme.css` (see [Starlight theming](https://starlight.astro.build/guides/css-and-tailwind/#theming)) plus matching `--color-accent-*` / `--color-gray-*` in `src/styles/global.css` `@theme`.

| Role | Light | Dark | Notes |
|------|-------|------|-------|
| Accent | `#9B2458` | `#E891B0` | Links, sidebar current, CTAs |
| Accent high / low | `#5C1034` / `#F5D6E4` | `#F3D0DF` / `#2A0F22` | Text-on-accent / wash |
| Background (`--sl-color-black`) | `#FFFFFF` | `#0A090A` | Near-black (not muddy mid-charcoal); soft white |
| Elevated / chrome | `#FAFAFA` → `#F4F4F5` | `#121011` → `#1C191B` | Sidebar, borders |
| Text | `#0A090A` | `#F6F4F5` | Body ≥ 4.5:1 |

Mushaf tajweed uses **stock QCF CPAL** light/dark palettes (colors live in the glyphs). Do not put tajweed on cream/wine grounds without adapted `font-palette` overrides.

### Typography

| Role | Font | Why |
|------|------|-----|
| Body / UI | **Atkinson Hyperlegible** | Accessibility pairing |
| Headings / splash title | **Crimson Pro** | Scholarly presence without broadsheet |
| Arabic mushaf | Hafs Uthmanic / QCF V4 / Surah Name | Domain fonts — use theme packs for dark ink |

Self-host via `@fontsource/*` (static; no runtime Google Fonts).

### Motion & interaction

- Hover / color transitions: **150–300ms**, ease-out
- Clickable surfaces: `cursor-pointer`
- Visible focus rings (accent)
- Honor `prefers-reduced-motion: reduce`
- No layout-shifting scale hovers

### Layout

- One composition on splash first viewport (brand + one headline + one tagline + CTA group)
- Cards only where they are the interaction container (e.g. surah grid)
- Mushaf / guide inherit Starlight tokens — no orphan hex in reader chrome
- Chrome controls: sharp borders, compact density — not capsule “Aa” pills
- Sidebar: at most one nest level; no vertical level hairlines; Mushaf surah list scrolls (~10 rows + edge fade)

### Search

- **Docs:** Starlight Pagefind (Cmd+K → Docs tab)
- **Mushaf verses:** Lunr.js over diacritic-normalized Uthmani + EN/MS (Cmd+K → Mushaf tab); build-time index via `bun run search:index` (#7). Do not use `lunr-languages` Arabic stemmer under Vite/ESM (throws on `this`).

### Copy (engineer lens)

- Prefer mechanisms and certainty markers over marketing adjectives
- State what the site is and is not (e.g. not a tafsir corpus)
- Name sources (QCF V4, QUL, Dar Al-Maarifah) when claiming fidelity

---

## Page overrides

Create `design-system/qurescent/pages/<name>.md` only when a surface needs to diverge. Default = this Master.
