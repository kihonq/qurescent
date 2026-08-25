# Static Quran data sources

Fetched once by `bun run data:ingest`. Not re-fetched at build or runtime.

| Asset | Source | License / notes |
| --- | --- | --- |
| `chapters.json` | `api.alquran.cloud/v1/surah` | Invites full-corpus mirrors |
| `translations/*.json` | `api.alquran.cloud/v1/quran/{edition}` | Same |
| `chapters/{id}.json` (glyphs, pages, wbw EN) | `api.quran.com` one-shot (`mushaf=19`) | Snapshot for static use; QUL JSON downloads require sign-in |

Ingested: 2026-08-25T13:28:31.478Z
