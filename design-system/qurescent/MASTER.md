# Design System Master File

> **LOGIC:** When building a specific page, first check `design-system/qurescent/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.
>
> Auto-generated ui-ux-pro-max output was revised for Qurescent constraints
> (techdoc shell, Islamic education respect, no purple/Inter/cream-terracotta defaults).
> Source ticket: [#15](https://github.com/kihonq/qurescent/issues/15).

---

**Project:** Qurescent  
**Updated:** 2026-08-25  
**Category:** Techdoc manual (Starlight) + mushaf reader  
**Voice:** Learning the Quran from an engineer lens — sources, certainty, static tooling

---

## Global Rules

### Style

- **Name:** Minimal / Swiss documentation
- **Keywords:** clean, readable, spacious, high contrast, functional, dense-where-needed
- **Shell:** Astro Starlight (sidebar, Pagefind, light + dark)
- **Avoid:** purple-on-white / indigo default, Inter-only UI, cream + terracotta AI look, pill clusters, heavy glass cards, emoji-as-icons, glow effects, “AI purple”

### Color Palette (semantic)

| Role | Light | Dark | Notes |
|------|-------|------|-------|
| Accent | Teal (`#0D9488` / teal-600) | Teal (`#2DD4BF` / teal-400) | Links, sidebar active, CTAs |
| Neutrals | Slate scale | Slate scale | Body text / surfaces via Starlight gray |
| Background | `#F8FAFC` (slate-50) | Starlight dark gray | Soft hierarchy, not flat void |
| Text | `#0F172A` (slate-900) | `#F8FAFC` | ≥ 4.5:1 on body |

**Implementation:** map Tailwind `teal` → Starlight `--color-accent-*` and `slate` → `--color-gray-*` in `src/styles/global.css` `@theme`.

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

### Copy (engineer lens)

- Prefer mechanisms and certainty markers over marketing adjectives
- State what the site is and is not (e.g. not a tafsir corpus)
- Name sources (QCF V4, QUL, Dar Al-Maarifah) when claiming fidelity

---

## Page overrides

Create `design-system/qurescent/pages/<name>.md` only when a surface needs to diverge. Default = this Master.
