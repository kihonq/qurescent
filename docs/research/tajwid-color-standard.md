# Tajwid color-coding: canonical standard vs. qurescent's current mapping

> Reconstructed note: this file was lost mid-session to a git working-tree collision between concurrent
> research agents (never committed the first time). Reconstructed from the original findings summary
> that fed the resolution on issue #2 (closed). The two specific hex-color mismatches below are
> reported as originally found; re-verify against `src/types/verse.ts` (`TAJWEED_META`) and the live
> `quran/quran-tajweed` or Dar Al-Maarifah legend if a future session needs to act on the exact values.

Context: qurescent color-codes Quran text by tajwid rule, currently sourced from
`text_uthmani_tajweed`'s `<tajweed class="...">` tags, mapped locally to colors via `TAJWEED_META`
in `src/types/verse.ts`. The repo owner asked directly: printed color-coded Tajweed Mushaf editions
do this "beautifully without error" — is there a canonical legend behind them, and does Quran.com's
(and by extension qurescent's) digital classification actually conform to it?

## 1. Is there one universal color legend?

**No single universal legend** — different publishers assign different colors to the same named
rules. However, there is one **institutionally credible** reference: **Dar Al-Maarifah's (Damascus)
patented "Mus'haf al-Tajweed" coloring system**, which was formally reviewed and endorsed by
**Al-Azhar Al-Sharif's Islamic Research Academy in 1999**. Other publishers (various Pakistani
"Tajveedi Para" editions, hifz-teacher study guides, even the RecitID app) demonstrably use different
color-to-rule assignments for the same underlying tajwid rules — so "a colored Tajweed Quran" alone
doesn't imply a single shared spec; Dar Al-Maarifah's is the one with real institutional backing.

## 2. Does Quran.com's classification match that legend?

Quran.com's current frontend doesn't even use CSS classes anymore for this — colors are baked
directly into the COLRv1/OT-SVG font glyphs (see `docs/research/tajwid-rendering-audit.md` §5). A
contributor comment on the `quran.com-frontend-next` GitHub repo states the coloring system is "based
on Dar Al Marifa's patented coloring technique" — but this is a **GitHub issue comment**, not an
official Quran.com statement, so treat it as a plausible-but-unofficial claim.

## 3. Where qurescent's current colors actually come from

Qurescent's exact class names, `type` strings, and rule descriptions in `TAJWEED_META` trace
**verbatim** to **Al Quran Cloud / Islamic Network's `alquran-tools` documentation** — a different
organization entirely, built on separate "Global Quran" project logic, **not** Quran.com's own
scheme, and with no discoverable connection to Dar Al-Maarifah's legend.

## 4. Coverage and color-accuracy check

- Live-fetching **all 114 chapters** from `api.quran.com` at research time confirmed the API emits
  exactly **17 distinct tajweed classes**.
- All 17 have a corresponding entry in `TAJWEED_META` — **no unstyled fall-through gap** (every class
  the API can emit is at least handled).
- However, comparing qurescent's actual hex colors for these 17 classes against the one documented
  Dar Al-Maarifah-derived legend found **at least 2 concrete mismatches**:
  - `madda_necessary`: qurescent uses `#003399`, documented legend uses `#000EBC`.
  - `idgham_shafawi`: qurescent uses `#6b8e23`, documented legend uses `#58B800`.

## 5. Recommendation landscape (not a decision)

- Treat the Dar Al-Maarifah/Al-Azhar-endorsed legend as the canonical reference to validate against,
  given it's the only one with real institutional backing found.
- Cross-check against Quran.com's own (font-based) implementation where feasible, given the plausible
  (if unofficial) claim that they model the same legend.
- Fix the at-least-2 known color mismatches regardless of which rendering approach (font vs. parser)
  is ultimately chosen for issue #4.
- **None of this substitutes for a qualified human tajwid-literate reviewer's sign-off** — correctness
  against the lived oral tradition, and any color choices beyond what's mechanically comparable here,
  cannot be self-certified by an AI agent. This is why issue #2's resolution locked in a mandatory
  human review gate (interim: the repo owner's own spot-checks against a personal physical
  color-coded Tajweed Quran; longer-term: a qualified reviewer, not yet sourced).
