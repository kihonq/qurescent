# Tajwid / word-by-word rendering audit

> Reconstructed note: this file was lost mid-session to a git working-tree collision between concurrent
> research agents (never committed the first time). Reconstructed from the original findings summary
> that fed the resolution on issue #2 (closed). Re-derive exact line numbers/regex behavior from the
> live code (`src/components/Verse.tsx`, `src/helpers/verse.tsx`) if a future session needs to cite
> them precisely — the qualitative findings below are accurate, the exact character offsets are not
> guaranteed to match current `main` line-for-line.

Context: the current chapter/verse reader renders inline tajwid color-coding and word-by-word
translation by parsing `text_uthmani_tajweed` (an HTML-ish tagged string from `api.quran.com`) with
hand-rolled regex, plus manual Unicode-substitution hacks, plus a custom `wordsSplitter` helper that
reconstructs word boundaries from the *rendered* colored output. The repo owner flagged a real,
lived concern: some hijaiyyah letters didn't render/split correctly in the past, and any migration
must not carry forward unverified workarounds given the zero-tolerance-for-errors bar on Quran text.

## 1. Current implementation, end to end

- `src/helpers/chapter.ts` fetches `text_uthmani_tajweed` from `api.quran.com/api/v4/quran/verses/uthmani_tajweed`.
- `src/components/Verse.tsx` regex-parses `<tajweed class="...">...</tajweed>` / `<span class="...">...</span>`
  tags out of that string, maps each tag's class to a CSS class via `TAJWEED_META` (`src/types/verse.ts`),
  and rebuilds a JSX tree of colored spans.
- Two Unicode-substitution hacks are applied to the raw text before parsing:
  - A sukun (`\u0652`) → small-high-meem (`\u06E1`) substitution, guarded by a negative
    lookbehind/lookahead excluding certain alef/waw variants.
  - An alef-wasla-like (`ٲ`) → superscript-alef (`ٰ`) substitution, apparently guarded by a fatha
    lookbehind.
- `src/helpers/verse.tsx`'s `wordsSplitter` then walks the *already-colored* JSX output to regroup it
  into per-word chunks, so each chunk can be paired positionally with the separately-fetched
  `verse.words[]` array (from `verses/by_key?words=true`) for word-by-word popovers.

## 2. Commit history

Only three commits in the repo's history touch this logic:
- **`d52ac8f` "Fix unicode misbehaving"** (Jan 2023) — introduced *both* Unicode substitution hacks,
  with no test coverage; the only "test case" is a leftover Arabic string left in a code comment.
- **`f7497dc` "Add word by word translation"** — added the word-by-word feature and `wordsSplitter`.
- **`9c702ef` "Fix many tajweeds"** — on an **unmerged branch**, `origin/fix/many-tajweed`, never
  merged to `main`. Its existence as a separate, still-open branch is itself evidence the `d52ac8f`
  fix was incomplete.

## 3. Structural defects found (code-provable, verified by direct execution/reading, not guesswork)

- **`main`'s regex-based tag parser cannot handle nested `<tajweed>` tags.** The API genuinely emits
  nested tags in real verse data (confirmed via a fixture embedded in the abandoned branch's own
  commit) — non-greedy regex plus `indexOf`/`replace`-based extraction fundamentally cannot round-trip
  arbitrary nesting. This is a structural defect, not a hypothetical edge case.
- **One of the two Unicode substitution "hacks" is dead logic.** Running the `ٲ`→`ٰ` regex directly
  (in Node) shows its "fatha lookbehind guard" is tautological — it matches unconditionally either
  way, so despite looking context-sensitive, it isn't actually gated by anything.
- **The `fix/many-tajweed` branch (`9c702ef`) is not safely resumable as committed.** Direct execution
  found three fatal defects:
  1. Its recursive regex uses PCRE-only `(?R)` syntax — a hard `SyntaxError` in JavaScript; the file
     cannot even load in any JS engine.
  2. Its `mapVerse()` function ignores the verse-text argument passed to it and always parses one
     hardcoded Al-Baqarah 2:278 string.
  3. Its new `Letter.tsx` component is unused dead code.
  There is no evidence this branch was ever run successfully even once.

## 4. Which letters/combinations are most likely mishandled

The sukun-exclusion regex's character class (`[\u0627\u0623\u0625\u0648]` — alef, alef-with-hamza-above,
alef-with-hamza-below, waw) is the main suspect for incompleteness: any hijaiyyah/diacritic combination
*not* covered by that lookbehind/lookahead class is a plausible failure point. **This specific claim —
whether the exclusion set is actually incomplete across the full 6,236-verse corpus — needs a
tajwid-literate human reviewer or a full-corpus rendering test to confirm; it cannot be fully
self-certified from reading the regex alone.**

## 5. What Quran.com itself does now

Quran.com's own production frontend **abandoned client-side parsing of `text_uthmani_tajweed`
entirely, around September 2024**. Instead of reconstructing colored spans from tagged text at
runtime, they render **pre-colored QCF V4 glyph fonts** (COLRv1/OT-SVG color-font technology) — the
tajwid coloring is baked into the font's glyphs themselves, eliminating this whole bug class by
construction. (Follow-up: this font was researched separately for licensing in issue #3 — it turned
out to be **proprietary and not currently redistributable** by qurescent; see
`docs/research/qcf-font-licensing.md`.)

The tajwid rule tagging data itself (whichever text-based source is used) is **community-curated**
(via Tarteel's QUL), not the output of a single infallible, singularly-credentialed authority — it's
actively correctable, not inherently authoritative just because it comes from Quran.com/QF.

## 6. Options landscape for the migration (not a decision — see issue #4)

1. **Resume/rewrite the `fix/many-tajweed` approach** — rejected as a direct resume target (see §3);
   could inform a fresh implementation's design (its `Letter.tsx`/per-letter idea) but not its code.
2. **Adopt Quran.com's font-glyph approach** — blocked pending font-licensing outreach (issue #3).
3. **Build a hardened text/regex or offset-based parser** against a properly licensed dataset (e.g.
   `quran/quran-tajweed`, CC BY 4.0) instead of the live/ported regex logic.
4. **Mandatory full-corpus manual QA pass**, regardless of which code approach is chosen, given the
   zero-tolerance bar — this is a human-review requirement, not an engineering choice, and doesn't
   substitute for picking one of options 1-3.

**Human sign-off is explicitly required before shipping** on: whether the sukun-regex's
letter-exclusion set is actually incomplete in practice across the full corpus, whether the
nested-tag parsing failure is visually perceptible in real verses, and final acceptance of whichever
rendering approach is chosen. This audit's author (an AI agent) cannot self-certify Quran text/tajwid
correctness — only the code-mechanical facts above, which are deliberately kept separate from the
"needs a reviewer" claims.
