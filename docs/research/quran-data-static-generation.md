# Quran data sources for a fully static build

> Reconstructed note: this file was lost mid-session to a git working-tree collision between concurrent
> research agents (never committed the first time). Reconstructed from the original findings summary;
> treat as a starting point for ticket #5 (Pick build-time Quran data source(s)), re-verify specific
> ToS/rate-limit numbers against the live source before finalizing that decision if it matters.

Context: qurescent currently fetches Quran text/translations/word-by-word data **live, per request**
from `api.quran.com/api/v4` (chapters, `verses/uthmani_tajweed`, `verses/by_key` with words) and
`api.alquran.cloud/v1` (surah list) — see `src/helpers/chapter.ts`. The map's hard constraint is fully
static generation (no live per-request API calls). This investigates build-time alternatives.

## 1. `api.quran.com` (Quran Foundation Content API)

This is no longer the informal community API it once was — it's now **Quran Foundation's Content
API**, gated behind **OAuth2 client-credentials** auth. No numeric rate limit is published (rate
limits are contractually described as confidential). Critically, the **Developer Terms forbid caching
QF content for longer than 1 week** unless the app resyncs via QF's official Content Sync API at least
every 7 days. This is structurally incompatible with a "build once, ship forever" static site — using
it as a build-time source would still require a recurring resync job, not a one-time fetch.

## 2. `api.alquran.cloud`

Far friendlier for this use case:
- **Key-less** — no auth/API key required.
- Published soft rate limit of **12 requests/sec** (confirmed via live response headers at research
  time).
- ToS explicitly **invites full-corpus mirrors** rather than discouraging them.
- Exposes a genuine **bulk endpoint**: `GET /v1/quran/{edition}` returns the *entire* 6,236-ayah Quran
  in a single response (~2MB), across **330 available editions** (various translations/recitations
  text).

## 3. Better build-time-native sources than either live API

- **Tanzil.net** — the canonical, widely-cited downloadable Quran text corpus (Uthmani and Simple
  script), licensed **CC BY 3.0**. This is the de-facto "anchor" text that other datasets (like
  Quran.com's own tajwid annotations) key their character offsets against.
- **Quran Foundation's QUL library** (qul.tarteel.ai) — not an API, a **downloadable-resource hub**:
  translations, word-by-word data, tajweed-annotated script, and chapter/verse metadata. The *platform*
  is MIT-licensed; each individual downloadable *resource* carries its own data license (check per
  resource before use).
- The old `quran/quran.com-api` GitHub repo (an earlier open community API) is **dead** (404 at
  research time) — not usable as a reference or fallback.

## 4. Audio recitation sourcing

- **EveryAyah.com** and **Al Quran Cloud's own CDN** both offer per-verse recitation audio under
  licenses usable/bundlable for a non-commercial project like this.
- **Quran.com/Quran Foundation's own audio CDN is explicitly restricted** — it's "QF Content,"
  requiring written permission to redistribute (there's a real public GitHub issue where a third-party
  developer had to formally request this permission).

## 5. Data volume estimate

Measured live at research time: Uthmani-tajweed text + word-by-word data + one English translation,
for all 6,236 verses, comes to roughly **~35MB raw JSON**, likely **~10-15MB compressed**. This is
trivial to check into a git repository directly as static content — no external asset hosting needed
for text/translation data.

Audio is the opposite case: at ~150-215KB/ayah average (128kbps), a **single reciter's full-corpus
audio is ~900MB-1.3GB** — this needs external CDN/object storage, not the git repo, regardless of
which reciter/hosting choice ticket #9 lands on.

## 6. Tajwid data independent of the live `uthmani_tajweed` endpoint

`quran/quran-tajweed` — Quran.com's own GitHub org, **CC BY 4.0** — publishes a
character-offset-indexed JSON dataset of tajwid rule spans, keyed against a **pinned Tanzil Uthmani
text file** (not a live API call). This is a solid, explicitly-licensed fallback/primary source for
tajwid rule data independent of whether the live `uthmani_tajweed` endpoint is otherwise usable, and
is the dataset ticket #5 (data sources) and #4 (rendering implementation) both point at.
