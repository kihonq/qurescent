# Qurescent

Quran from an engineer lens — a **static** [Astro Starlight](https://starlight.astro.build) techdoc site with an interactive mushaf under `/read/`.

**Live (alpha):** [qurescent.kihong.dev](https://qurescent.kihong.dev)  
**Release:** [v0.1.0-alpha.0](https://github.com/kihonq/qurescent/releases/tag/v0.1.0-alpha.0) · see [CHANGELOG.md](./CHANGELOG.md)

> Sedekah jariah. Non-commercial, ads-free. Verse text, tajwid, and translation meaning are **zero-tolerance** — do not “fix” mushaf rendering from a hunch.

## What’s in the box

| Area | Status |
| --- | --- |
| Starlight shell (sidebar, Pagefind, light/dark) | Shipped |
| Mushaf `/read/` — QCF V4 COLRv1 tajweed, word-by-word, EN/MS | Alpha |
| Guide — tajwid (draft color legend), tadabbur, lineage | Thin / draft |
| Arabic Quran search (Lunr) | Not yet (#7) |
| Per-verse audio | Out of scope for current map (#9) |

Stack: **Astro 7**, **Starlight**, **React 19** (reader island), **Bun**, **nanostores**, **Cloudflare Pages**.

## Quick start

```bash
bun install
bun run data:fonts          # ~628MB QCF V4 → public/fonts/qcf-v4/ (gitignored)
bun run dev                 # http://localhost:4321
```

| Command | Action |
| --- | --- |
| `bun run dev` | Dev server |
| `bun run typecheck` | `astro check` |
| `bun run build` | Static build → `dist/` |
| `bun run deploy` | Build + deploy Pages (`main`) |
| `bun run data:ingest` | Re-fetch static Quran JSON (rarely needed) |
| `bun run data:fonts` | Download QCF V4 fonts |

Requires [Bun](https://bun.sh) (`packageManager` is `bun@1.3.11`). Node alone is not the supported path.

### Fonts & data

- **QCF V4** fonts are **not in git** (size + proprietary). Permission: non-commercial / ads-free; credit [qul.tarteel.ai](https://qul.tarteel.ai). Details: [`src/data/SOURCES.md`](./src/data/SOURCES.md).
- Chapter JSON + translations are checked in under `src/data/` (ingest once; no runtime Quran API).

## Repo layout (high level)

```
src/
  pages/read/          # Mushaf routes
  components/          # ChapterReader, Verse, …
  content/docs/        # Starlight Guide + homepage
  data/                # Static chapters + translations
  helpers/qcfFont.ts   # COLRv1 load + font-palette
design-system/         # UI brief (MASTER.md, pages/read.md)
docs/research/         # Wayfinder research notes
```

## Contributing

See **[CONTRIBUTING.md](./CONTRIBUTING.md)**. Issues and decisions live on GitHub ([map #1](https://github.com/kihonq/qurescent/issues/1)).

## Credits

- Mushaf glyphs: **QCF V4** (permission via #13; not redistributed in this repo)
- Static text / WBW / translations: sources listed in [`src/data/SOURCES.md`](./src/data/SOURCES.md)
- Tajwid color *names*: draft aligned to Dar Al-Maarifah’s published legend — [color legend](https://qurescent.kihong.dev/guide/tajwid/color-legend/) still pending human spot-check

## License

**No SPDX license file yet** — the GitHub repo is also still **private**. Until a license is chosen and the repo is public, treat the code as all-rights-reserved and ask before redistributing. Font and data terms are separate from any future code license (see SOURCES.md and CONTRIBUTING.md).
