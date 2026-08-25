# Contributing to Qurescent

Thanks for caring about this project. Qurescent is sedekah jariah: a static Quran learning site. That means a higher bar than a typical app — especially anything that touches the mushaf.

## Before you start

1. Read the [README](./README.md) and [CHANGELOG](./CHANGELOG.md).
2. Skim [`src/data/SOURCES.md`](./src/data/SOURCES.md) (data + QCF font constraints).
3. Prefer an [issue](https://github.com/kihonq/qurescent/issues) before a large PR. Roadmap context: [wayfinder map #1](https://github.com/kihonq/qurescent/issues/1).

### Hard constraints

- **Fully static** — no SSR, no live per-request Quran API in production paths.
- **Non-commercial / ads-free** — required for QCF V4 font permission (#13). Do not add monetization, trackers that sell data, or ads.
- **Zero tolerance** for errors in verse text, tajwid coloring, translation meaning, and lineage/history claims. If unsure, open an issue — do not “improve” mushaf rendering from memory.
- **Do not commit** `public/fonts/qcf-v4/` (gitignored, ~628MB, proprietary). Document download via `bun run data:fonts` only.

## Setup

```bash
bun install
bun run data:fonts    # once per machine / CI cache
bun run dev
```

- Package manager: **Bun** only (`bun.lock`).
- Typecheck: `bun run typecheck`
- Production-shaped build: `bun run build` (needs fonts present under `public/fonts/qcf-v4/`)

## How we work

| Kind of change | Expectation |
| --- | --- |
| Typos, docs, Guide MDX | Small PR; no mushaf risk |
| Reader UI / CSS (non-glyph) | PR + screenshots if visual |
| Glyphs, `code_v2`, palettes, ingest | Issue first; human review before merge |
| New dependencies | Justify size + maintenance; prefer static-friendly |

### Pull requests

1. Branch from `main`.
2. Keep PRs focused; match existing code style (React reader island, Starlight docs, Tailwind v4 tokens in `src/styles/global.css`).
3. Describe **why**, not only what. Link issues.
4. Do not force-push shared branches; do not commit secrets (`.env`, Cloudflare tokens, font caches you aren’t supposed to redistribute).

Maintainers may request changes on anything that touches Quran rendering — that is normal, not hostility.

## What we are not taking (for now)

- Per-verse audio (#9 — out of current map)
- Porting old Solid/regex tajwid parsers
- Runtime dependency on Quran.com / AlQuran Cloud APIs for page views
- Community tafsir corpus as a first-class product surface (tadabbur may cite sources inline)

## Conduct

Be respectful. This project deals with sacred text; jokes or “clever” mutations of ayahs are not acceptable. Harassment or bad-faith PRs will be closed.

A formal `CODE_OF_CONDUCT.md` may land when the repo goes public; until then, contributor covenant norms are a reasonable default for behavior.

## Security / sensitive reports

If you find a problem that could misrepresent Quran text in production, **do not** open a drive-by PR that “fixes” glyphs without discussion. Open a private note to the maintainer (`@kihonq`) or an issue titled clearly (e.g. `mushaf: incorrect rendering on …`) so it can be triaged against authoritative sources.

## License note

There is **no LICENSE file yet**. Do not assume MIT/Apache. Ask before reusing substantial code elsewhere. Upstream data and QCF fonts have their **own** terms — see SOURCES.md.
