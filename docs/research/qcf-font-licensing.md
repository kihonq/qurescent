# QCF V4 tajwid font licensing/redistribution feasibility (issue #3)

Research date: 2026-08-24. Scope: for GitHub issue
[kihonq/qurescent#3](https://github.com/kihonq/qurescent/issues/3) — determine whether Quran.com's
QCF V4 (COLRv1/OT-SVG) tajwid glyph font can legally be used/redistributed in qurescent's static
build, per primary sources only. Builds on, and does not repeat, the findings already captured in
[`docs/research/quran-data-static-generation.md`](./quran-data-static-generation.md) (Content API
ToS/rate-limits/caching) and [`docs/research/tajwid-rendering-audit.md`](./tajwid-rendering-audit.md)
(§5–6: how Quran.com's font-based tajwid pipeline works architecturally, and the options it implies).

**Bottom line up front:** The QCF V4 tajwid font is **not** a standalone open-source font
repo/package — it is a proprietary King Fahd Glorious Qur'an Printing Complex (KFGQPC) asset, with
the tajwid-coloring layer added by an individual developer who personally controls per-project
licensing. This is confirmed two ways: (1) the font's own creator, in a public GitHub issue,
states he individually licenses it project-by-project and currently licenses it only to Quran.com
and QuranWBW.com; and (2) **the font file itself**, inspected directly (its embedded OpenType
`name` table, extracted from the live, currently-served binary), carries a copyright notice
reading "King Fahad Complex, All rights reserved" and an explicit description field stating
"NOT FOR SALE, ONLY CHARITIABLE (SADAQA) PURPOSE ONLY. PRINTING AND PUBLISHING NOT PERMITTED
WITHOUT PRIOR PERMISSION." The font happens to be fetchable today without any Quran Foundation
API key/OAuth (it is served as a static file from two public, unauthenticated CDNs), but
technical fetchability is not the same as a redistribution license, and the license text embedded
in the file itself is unambiguous: qurescent may **not** bundle or redistribute this font in its
own static site without first obtaining permission from KFGQPC / the font's creator, independent
of any Quran Foundation Content API relationship.

---

## 1. Where the QCF V4 font actually lives — not a standalone open-source repo

**There is no dedicated `quran/mushaf-fonts`-style open-source font repo.** A full listing of the
`quran` GitHub org's 34 repos (`gh api`/GitHub REST API, verified live 2026-08-24) turned up one
repo with a font-shaped name, `quran/quran.com-fonts` — but it is **not** the QCF V4 tajwid font
source. Inspected directly via the GitHub API and its raw README:

- Created 2018-01-20, last real commit 2018-01-27 (only a dependency-bump-shaped push in
  2025-12), i.e. predates the QCF V4 tajwid font (developed ~2024–2025 per §2 below) by 6+ years.
- It is a small Express.js app (`app.js`, `routes/`, `views/`, `Dockerfile`) whose entire purpose,
  per its own README, is: "Access any font from the `/fonts` path... All fonts are served from
  the `./public/fonts` directory." — a legacy font-serving microservice, not a font source
  repository, and it ships with **no `LICENSE` file** (`license: null` in the GitHub API
  response).
  — [quran/quran.com-fonts](https://github.com/quran/quran.com-fonts),
  [README (raw)](https://raw.githubusercontent.com/quran/quran.com-fonts/master/README.md)

**The actual QCF V4 tajwid font is distributed as static binary assets from two CDNs, not as a
versioned source-code font repo:**

1. **Quran Foundation's own CDN**, documented in their official integration guide:
   `https://verses.quran.foundation/fonts/quran/hafs/v4/colrv1/{woff2,woff,ttf}/p{PAGE}.woff2`
   (COLRv1, for Chrome/Safari/Edge) and
   `https://verses.quran.foundation/fonts/quran/hafs/v4/ot-svg/{light,dark,sepia}/woff2/p{PAGE}.woff2`
   (OT-SVG, for Firefox) — one file per Mushaf page (1–604).
   — [Quran Foundation: "Integrating Quran Font Rendering"](https://api-docs.quran.foundation/docs/tutorials/fonts/font-rendering/)
2. **Tarteel's Quranic Universal Library (QUL)** static CDN:
   `https://static-cdn.tarteel.ai/qul/fonts/quran_fonts/v4-tajweed/{ttf,woff2,woff}/p{PAGE}.{ext}`,
   linked from the QUL resource page
   [qul.tarteel.ai/resources/font/240 ("QPC V4 Tajweed Font")](https://qul.tarteel.ai/resources/font/240).

**Verified live, both CDNs currently serve the identical font file without any authentication**
(no OAuth token, no API key, no `x-client-id` header — plain `GET`, `curl`, 2026-08-24):

```
GET https://verses.quran.foundation/fonts/quran/hafs/v4/colrv1/woff2/p1.woff2  → HTTP/2 200 (BunnyCDN)
GET https://static-cdn.tarteel.ai/qul/fonts/quran_fonts/v4-tajweed/ttf/p1.ttf   → HTTP/2 200 (Cloudflare/Wasabi)
```

Downloading both `p1` files and comparing their embedded OpenType `name`-table metadata (via
Python's `fontTools`, run directly against the two downloaded binaries) confirms they are **the
same font asset**, byte-identical in every metadata field checked — i.e. Quran Foundation's CDN
copy and QUL's CDN copy are the same font, not two independently-licensed variants (see §3 for the
exact extracted text).

**This directly answers the ticket's distribution-channel question: the font is bundled/served
statically by Quran.com's infrastructure and mirrored on QUL's CDN — it is not gated behind the
Content API's OAuth2 flow, and not exclusively bundled inside the proprietary frontend's own
build.** A static site *can* technically fetch or hotlink these exact URLs without any Quran
Foundation developer account. However — per §2 and §3 — being *fetchable* without auth is a
distinct question from being *licensed for redistribution*, and the answer to the licensing
question is no.

---

## 2. Who actually controls the license, in their own words (primary source: the font's creator)

The single most direct primary source on this question is a public GitHub issue thread where the
font's actual developer, replying under the handle `Ayman24x7`, answers exactly the "can I
redistribute this" question — asked by a *different* third-party developer (author of the
Tehreer-Cocoa/Tehreer-Android open-source text-rendering libraries) who wanted to do precisely
what this ticket is asking about:

> "I'm the developer of these v4 Tajweed fonts... I have developed these Color fonts (COLRv1 and
> OT-SVG) based on KFGQPC Mushaf Fonts, I would not say exactly from scratch but yes the coloring
> thing from scratch. These fonts are currently in public beta... **and I have licenced these to
> Quran.com and QuranWBW.com right now (other projects have not yet released). I would like to
> keep control of who uses these fonts** because I want to make sure the projects are completely
> for free or sadaqa e jaria purpose and does not contain ads... **you are free to direct whoever
> needs these fonts to me, and I'll licence them after knowing their project.**"
> — [`quran/quran.com-frontend-next` issue #2322, "Tajweed fonts usability"](https://github.com/quran/quran.com-frontend-next/issues/2322) (comment by Ayman24x7, 2025-02-22)

When the same asker followed up asking whether there's a dedicated font-only repo he could pin as
a submodule (functionally the same question this ticket is asking), the answer was explicit that
redistribution requires going through the developer personally, not a public open-source channel:

> "If you still want, then maybe you can just ship two pages of Surah Kahf... and say like Mushaf
> fonts are **licensed separately** and the developer can get access to them on qul.tarteel.ai
> (temporarily removed for QA checks and will be re-released in coming months.)... Once we finish
> our quality checks and improvements, these fonts will be re-released on QUL repository
> (qul.tarteel.ai) **under licensing terms (which is a free license but with conditions)**."
> — same issue, comment by Ayman24x7, 2025-02-24

A second, independent GitHub issue thread (Nov 2025), about a completely different feature request
(customizable tajwid colors), corroborates who owns the coloring and that it is contractually fixed
by an external rights holder, not something Quran.com's own team can freely re-license or alter:

> "The Tajweed colors are hard-coded within the font files... the Tajweed coloring system will be
> fixed (based on **Dar Al Marifa's patented coloring technique**)."
> — [`quran/quran.com-frontend-next` issue #2575, "customizable tajweed color"](https://github.com/quran/quran.com-frontend-next/issues/2575) (comment by Ayman24x7, 2025-11-05)

**QUL's own documentation, as of this research date, still describes the V4 font as withdrawn
pending proofreading** — which is inconsistent with the font actually being live-downloadable on
QUL's own resource page today (§1); this is flagged as an unresolved discrepancy between QUL's
prose documentation and QUL's actual current resource-page behavior, not resolved further by this
research:

> "V4: V4 has tajweed color embedded in the font. **We've disabled this font at the moment**,
> insh'Allah this font will be published again once we done the proofreading."
> — [QUL Documentation: "Glyph based"](https://qul.tarteel.ai/docs/glyph-based)

QUL's general FAQ (already partly cited in `quran-data-static-generation.md` §3) reiterates that
licensing is per-resource and must be individually checked, not blanket-open:

> "The resources available on QUL vary in their copyright status... We recommend reviewing the
> licensing information provided by each resource's author before use."
> — [QUL FAQ](https://qul.tarteel.ai/faq)

No dedicated QUL-wide Terms/License page exists at the URL pattern that would be expected
(`https://qul.tarteel.ai/terms` returns **404**, verified live 2026-08-24) — QUL's licensing
posture for this specific font is only findable in the primary-source GitHub issue quoted above and
in the font file's own embedded metadata (§3), not in a separate published license document on
the QUL site itself.

---

## 3. What license actually governs the font itself — verified directly from the shipped binary

Rather than rely only on secondhand descriptions, this research downloaded the live font file
(`p1`, page 1 of the Uthmani Mushaf) from **both** CDNs identified in §1 and parsed each file's
OpenType `name` table directly (Python `fontTools`, `TTFont(...)['name']`, run against the actual
downloaded bytes, 2026-08-24). **Both files are identical** and carry the following embedded,
first-party copyright/license metadata (this is the font vendor's own legally-relevant metadata,
baked into the font binary itself — the strongest and most specific primary source available for
this question, stronger than any secondary blog post or wrapper-package README):

| `name` table field | Value (verbatim, from the font binary) |
| --- | --- |
| Copyright notice (nameID 0) | `King Fahad Complex, All rights reserved.` |
| Font family (nameID 1) | `QCF4001_COLOR` |
| Unique identifier (nameID 3) | `QCF4001_COLOR Regular:Version 1.000` |
| Version (nameID 5) | `Version 1.000;June 6, 2025;FontCreator 15.0.0.3019 64-bit` |
| Trademark (nameID 7) | `All rights reserved` |
| Manufacturer (nameID 9) | `King Fahad Complex` |
| Description (nameID 10) | `Quran Tajweed Color Font features developed and added by Ayman, Rania, Amena, Naveed, Zahid, Tooba and Anza for Sadaqa-e-Jaria Only. NOT FOR SALE, ONLY CHARITIABLE (SADAQA) PURPOSE ONLY. PRINTING AND PUBLISHING NOT PERMITTED WITHOUT PRIOR PERMISSION FROM KING FAHAD GLORIOUS QURAN PRINTING COMPLEX AND DAR ALMARIFA EASY QURAN.` |
| Designer/vendor URL (nameID 12) | `https://qurancomplex.gov.sa` |

Reproduction steps (for verification): `curl` either
`https://verses.quran.foundation/fonts/quran/hafs/v4/colrv1/woff2/p1.woff2` or
`https://static-cdn.tarteel.ai/qul/fonts/quran_fonts/v4-tajweed/ttf/p1.ttf`, then
`fontTools.ttLib.TTFont(path)['name'].names`, read `nameID` 0/1/3/5/7/9/10/12. Both URLs' outputs
were byte-for-byte identical in every field checked.

**This is a categorical answer to the ticket's "what license governs the font itself" question:
"All rights reserved," explicitly "NOT FOR SALE," restricted to charitable/sadaqa use, and
"printing and publishing not permitted without prior permission" from the named rights holders.**
This is not an OFL, MIT, CC, or any other recognized open-source/open-content license — it is a
proprietary, permission-required license, stated by the copyright holder inside the artifact
itself, independent of and in addition to whatever the Quran Foundation Content API's Developer
Terms of Service say about "QF Content."

**For comparison**, the same extraction run against QCF V2 (the non-tajwid glyph-based Mushaf
font, same CDN, `https://verses.quran.foundation/fonts/quran/hafs/v2/woff2/p1.woff2`) returns much
thinner, placeholder-looking metadata (`Copyright: "Test Font, KFGQPC"`, `Version: "KFGQPC TEST"`)
— still KFGQPC-attributed, but without the explicit "sadaqa-only / not for sale / no publishing
without permission" restriction text that the V4 tajwid font carries. This suggests the harsher,
more explicit restriction language is specifically tied to the added tajwid-coloring layer
(consistent with §2's finding that the *coloring* is a separately-licensed addition on top of the
base KFGQPC Mushaf glyphs), not necessarily identical to whatever license covers bare KFGQPC
Mushaf glyph fonts — but this is inferred from a metadata comparison, not from a second explicit
statement, and should not be over-read as "QCF V2 is safely licensed for redistribution" without
separate verification if that ever becomes relevant.

**On the Content API's own "publicly distributable font assets" phrase:** the Quran Foundation
Content Sync API docs (already partially cited in `quran-data-static-generation.md` §1) describe a
Mushaf resource's full sync copy as containing "metadata, pages, **publicly distributable font
assets**, and words"
([Content Sync: resource-group table](https://api-docs.quran.foundation/docs/tutorials/content-sync/getting-started/)).
This phrase could be misread as Quran Foundation asserting the QCF V4 font is freely
redistributable. Given the font's own embedded copyright notice found in §3, the more defensible
reading is that "publicly distributable" here means "distributable to *your own Application's end
users through your own sync mechanism*" (i.e., not gated per-request behind a rate limit), not
"licensed for you to redistribute to third parties or bundle into your own separately-distributed
open-source project." **This is this research's interpretation, not a claim independently
confirmed by Quran Foundation** — flagged explicitly as something not confirmable from a primary
source in the time available; a direct written question to `developers@quran.com` (the contact
address given in the Developer Terms of Service) would be the way to get an authoritative,
non-ambiguous answer if certainty is required before shipping.

Separately, the Quran Foundation Developer Terms of Service (full text fetched live,
"Last updated: 2026-08-18") define **"QF Content"** narrowly as "Quran text, translations,
metadata, audio, reflections, and any other content returned by the APIs" and its no-redistribution
clause is scoped to that defined term
([Developer Terms of Service](https://api-docs.quran.foundation/legal/developer-terms/)). The word
"font" does not appear anywhere in that document. This means: **even if the font were not
independently proprietary (it is, per §3), the Content API's Developer Terms of Service would not
be the controlling license for it anyway**, because the font file is served from a separate static
CDN, not "returned by the APIs" in the ToS's own sense (the API returns a `code_v2` glyph-index
string; the font file is a separate static asset fetched by URL). The font's own embedded
copyright notice (§3) is therefore the operative license, not the Content API ToS — a distinction
the ticket explicitly asked to be kept separate, and which this research confirms are in fact two
separate, independently-restrictive licensing regimes (Content API ToS for the *text/data*; the
font's own proprietary copyright for the *font*), not one.

---

## 4. Answering the ticket's three questions directly

1. **Where does the font live — standalone open-source repo, or only bundled in the proprietary
   frontend?** Neither, precisely. It is not a standalone open-source font repo (§1 — no such repo
   exists in the `quran` GitHub org; `quran/quran.com-fonts` is a stale, unrelated legacy
   font-server app). It is also not *exclusively* bundled inside the proprietary frontend's own
   build — it is separately hosted as static binary files on two public CDNs (Quran Foundation's
   own CDN and QUL's CDN), fetchable by anyone without authentication, but as licensed,
   copyrighted binary assets, not as an open-source package with a permissive license attached.

2. **What license governs the font itself, separate from the Content API's ToS?** A proprietary,
   all-rights-reserved license held by King Fahd Glorious Qur'an Printing Complex, with the
   coloring layer separately attributed to and controlled by an individual developer
   (`Ayman24x7` and collaborators, per the font's own embedded description text), who has stated
   in a public GitHub issue that he personally reviews and grants per-project licenses and
   currently only licenses to Quran.com and QuranWBW.com. This is confirmed directly from the
   font binary's own embedded copyright metadata (§3), independent of the Content API ToS.

3. **Is it usable/redistributable in a separate open-source static site (qurescent) without a
   Quran Foundation API key/OAuth relationship?** **Fetchable, yes; legally redistributable/usable,
   no — not without separately obtaining permission.** No OAuth/API key is technically required to
   fetch the raw font files (§1), so the *Content API's* auth/ToS constraints
   (`docs/quran-data-static-generation.md` §1) are not the blocker here. The blocker is the font's
   own copyright, which explicitly requires "prior permission from King Fahad Glorious Quran
   Printing Complex and Dar AlMarifa Easy Quran" for "printing and publishing," and whose actual
   day-to-day licensing gatekeeper (per his own public statement) currently licenses it to exactly
   two named projects and asks anyone else to contact him individually before use. **qurescent
   cannot bundle or redistribute this font today without first doing that outreach and receiving
   an explicit yes** (per §2's quoted "you are free to direct whoever needs these fonts to me,
   and I'll licence them after knowing their project").

---

## 5. If not usable as-is: alternatives, with the same source-hierarchy caveats

This research did **not** find a fully open, explicitly-licensed, drop-in replacement
COLR/OT-SVG color font with the same "one word/ayah = one glyph, tajwid baked into the glyph
color" architecture as QCF V4. Every adjacent project found either (a) also depends on the same
proprietary KFGQPC/QCF V4 font under the same restriction, just repackaged with a permissive
*code* license around it, or (b) sidesteps the font question entirely by using a different
rendering strategy:

- **Wrapper packages that bundle the same proprietary font under a permissive *code* license, but
  explicitly disclaim the font itself:** e.g.
  [`m4hmoud-atef/qcf_quran`](https://github.com/m4hmoud-atef/qcf_quran) (MIT-licensed Flutter
  package) ships its own `LICENSE` file with an explicit carve-out:
  "Additional notice: The bundled QCF fonts are provided by King Fahd Complex for the Printing of
  the Holy Quran (KFGQPC). Their usage may be subject to separate terms. Ensure compliance with
  KFGQPC licensing when distributing applications that include these fonts," and its README states
  plainly "Disclaimer: This package and its bundled fonts are **NOT for commercial use**"
  ([pub.dev: qcf_quran](https://pub.dev/packages/qcf_quran),
  [`m4hmoud-atef/qcf_quran/LICENSE`](https://github.com/m4hmoud-atef/qcf_quran/blob/main/LICENSE)).
  Similarly, [`alheekmahlib/quran_library`](https://github.com/alheekmahlib/quran_library) ships a
  separate `NOTICE` file reiterating the same KFGQPC/QUL pass-through restriction, including a
  "no distracting ads (even halal/Islamic ads)" condition
  ([`alheekmahlib/quran_library/NOTICE`](https://github.com/alheekmahlib/quran_library/blob/main/NOTICE)).
  **None of these packages actually grant a new, more permissive license for the font — they
  confirm the same restriction found in §3, just documented by third parties who bundled the font
  anyway.** Using one of these packages would not change qurescent's underlying legal exposure.
- **`quran/quran-tajweed`** (also `cpfair/quran-tajweed`), CC BY 4.0, already documented in
  `docs/research/tajwid-rendering-audit.md` §5.b/§6(iii) — an *offset-annotation dataset*
  (codepoint ranges + rule name per ayah, keyed against plain Tanzil.net Uthmani text), not a font.
  This remains the strongest openly-licensed option found for tajwid *data*, usable to
  color-code a standard Unicode Arabic font client-side (avoiding both the QCF font's licensing
  restriction and, if implemented as a small recursive/offset-based parser rather than the current
  regex, `main`'s nested-tag regex bug class from the rendering audit).
- **`NedaaDevs/quran-image-generator`** — again depends on the same QCF V1/V2/V4 font files (it
  explicitly reads "V4 tajweed colors live in the font's `COLR`/`CPAL` color tables"
  — [repo README](https://github.com/NedaaDevs/quran-image-generator)) to pre-render page images;
  it does not solve the licensing question, it just moves *where* the same restricted font is
  consumed (build time vs. runtime).
- **Other independent open, explicitly-licensed color/tajwid Quran fonts:** none were found in
  this research pass. Every "V4"/"QCF4"/"quran-qcf4"-named project located via GitHub/npm/pub.dev
  search (`nuqayah/qpc-fonts`, `MohamadHajjRabee/quran-qcf4`, `quran-image-generator`,
  `quranfonts.com`'s font catalogue) traces back to the same King Fahd Complex-produced base
  glyphs, with the V4 tajwid coloring specifically traceable to the same `Ayman24x7`-attributed,
  sadaqa-only-licensed layer found in §2–§3. No pre-September-2024 QCF version was found to be
  under a materially different (i.e., more open) license than the current one — QCF V1/V2 (the
  non-tajwid glyph fonts) are also KFGQPC-attributed (§3's V2 comparison), just without the
  explicit tajwid-specific restriction text; they were not the subject of this ticket's question
  and were not exhaustively re-audited for open redistribution rights here.

**Practical recommendation implied by this research (not a decision — that is issue #4's job):**
if qurescent wants to keep the "font renders the color, no client-side parsing" architectural
benefit described in `tajwid-rendering-audit.md` §5–6(ii), the only currently-open path found is to
**contact the font's rights holder directly** (`Ayman24x7`, reachable via Discord per his own
GitHub comments, or via a new GitHub issue on `quran/quran.com-frontend-next`) and request a
project-specific license, exactly as he invites in §2's quoted comment — not to treat the font as
already-open because its files happen to be fetchable without an API key. If that permission is
not obtained, the CC BY 4.0 `quran/quran-tajweed` offset-annotation dataset (already documented in
the rendering audit) is the best-supported, verifiably open alternative for keeping tajwid
functionality at all, at the cost of returning to some form of client-side coloring logic (which
would need to be built correctly and safely, per the rendering audit's §6(iii)/(iv) recommendations
— a hardened offset-based approach, not the existing regex, and still gated on a full manual
tajwid-literate QA pass before shipping).

---

## Sources index

- `quran` GitHub org repo listing (`gh api orgs/quran/repos`, live, 2026-08-24) — https://github.com/quran
- `quran/quran.com-fonts` repo — https://github.com/quran/quran.com-fonts
- `quran/quran.com-fonts` README (raw) — https://raw.githubusercontent.com/quran/quran.com-fonts/master/README.md
- Quran Foundation: Integrating Quran Font Rendering — https://api-docs.quran.foundation/docs/tutorials/fonts/font-rendering/
- Quran Foundation Content Sync: Getting Started — https://api-docs.quran.foundation/docs/tutorials/content-sync/getting-started/
- Quran Foundation Developer Terms of Service (last updated 2026-08-18) — https://api-docs.quran.foundation/legal/developer-terms/
- `quran/quran.com-frontend-next` issue #2322, "Tajweed fonts usability" — https://github.com/quran/quran.com-frontend-next/issues/2322
- `quran/quran.com-frontend-next` issue #2575, "customizable tajweed color" — https://github.com/quran/quran.com-frontend-next/issues/2575
- QUL resource page: QPC V4 Tajweed Font — https://qul.tarteel.ai/resources/font/240
- QUL Documentation: "Glyph based" (V4 disabled-pending-proofreading statement) — https://qul.tarteel.ai/docs/glyph-based
- QUL Documentation: "V4" tag index — https://qul.tarteel.ai/docs/v4
- QUL FAQ — https://qul.tarteel.ai/faq
- QUL `/terms` (404, verified live) — https://qul.tarteel.ai/terms
- Live font binaries fetched and inspected directly (`curl` + Python `fontTools`, 2026-08-24):
  - https://verses.quran.foundation/fonts/quran/hafs/v4/colrv1/woff2/p1.woff2
  - https://static-cdn.tarteel.ai/qul/fonts/quran_fonts/v4-tajweed/ttf/p1.ttf
  - https://verses.quran.foundation/fonts/quran/hafs/v2/woff2/p1.woff2 (QCF V2 comparison)
- `m4hmoud-atef/qcf_quran` (pub.dev package + LICENSE) — https://pub.dev/packages/qcf_quran, https://github.com/m4hmoud-atef/qcf_quran/blob/main/LICENSE
- `alheekmahlib/quran_library` NOTICE — https://github.com/alheekmahlib/quran_library/blob/main/NOTICE
- `NedaaDevs/quran-image-generator` — https://github.com/NedaaDevs/quran-image-generator
- `MohamadHajjRabee/quran-qcf4` — https://github.com/mohamadhajjrabee/quran-qcf4
- `nuqayah/qpc-fonts` — https://github.com/nuqayah/qpc-fonts/
- `quran/quran-tajweed` (already cited in `tajwid-rendering-audit.md`) — https://github.com/quran/quran-tajweed
- KFGQPC developer platform — https://qurancomplex.gov.sa/quran-dev/
