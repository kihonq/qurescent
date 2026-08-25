# Static Quran data sources

Fetched once by `bun run data:ingest`. Not re-fetched at build or runtime.

| Asset | Source | License / notes |
| --- | --- | --- |
| `chapters.json` | `api.alquran.cloud/v1/surah` | Invites full-corpus mirrors |
| `translations/*.json` | `api.alquran.cloud/v1/quran/{edition}` | Same |
| `chapters/{id}.json` (glyphs, pages, wbw EN) | `api.quran.com` one-shot (`mushaf=19`) | Snapshot for static use; QUL JSON downloads require sign-in |

Ingested: 2026-08-25T13:28:31.478Z

## QCF V4 fonts (deploy)

- **Permission**: Ayman24x7 (#13) — non-commercial, ads-free; **attribution required** on the site ([/about/](https://qurescent.kihong.dev/about/)) and in repo `NOTICE`. Source: [qul.tarteel.ai](https://qul.tarteel.ai).
- **Local**: `bun run data:fonts` → `public/fonts/qcf-v4/` (~628MB, gitignored).
- **Ship**: fonts are part of the Pages artifact (`dist/fonts/*`), not git. File count stays under the free Pages 20k limit.
- **CI / machine**: run `data:fonts` once and cache `public/fonts/qcf-v4/` across builds (do not re-download every Pages build — 20m timeout risk). Prefer Wrangler deploy from a machine that already has the cache: `bun run deploy`.
- **Headers**: `public/_headers` sets long-cache on `/fonts/*`.
- **Fallback**: if CI cannot finish downloads, put the same tree on R2 and same-origin route later — not required while local/cached deploy works.
