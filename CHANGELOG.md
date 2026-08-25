# Changelog

## [0.1.0-alpha.0] — 2026-08-26

First public alpha of the Starlight techdoc + static mushaf rebuild.

### Highlights

- Astro 7 + Starlight shell (sidebar, Pagefind, light/dark)
- Static mushaf under `/read/` — QCF V4 COLRv1 tajweed glyphs, word-by-word, EN/MS translation
- React `ChapterReader` island: sticky Arabic | English | settings chrome
- Cloudflare Pages deploy (`qurescent.kihong.dev`) with long-cache fonts
- Guide stubs: tajwid (draft color legend), tadabbur, lineage (Mermaid)

### Known limits (alpha)

- Tajwid color legend is a **draft** — spot-check vs physical Dar Al-Maarifah mushaf still required (#2)
- QCF fonts are gitignored (~628MB); run `bun run data:fonts` before local preview / deploy
- Arabic-capable Quran search (Lunr) not shipped yet (#7)
- Content pillars (tadabbur / lineage depth) are thin
- Per-verse audio out of scope for this map (#9)

### Upgrade notes

- Package manager is **Bun** (`bun.lock`); pnpm workspace removed
- Deploy: `bun run deploy` (Pages production branch `main`)
