# Reference Mushaf for Book mode: Malaysia KDN color-tajweed vs mushaf=19

Ticket: [#19](https://github.com/kihonq/qurescent/issues/19) (map [#18](https://github.com/kihonq/qurescent/issues/18)).

## Question

What is the exact **Reference Mushaf** for Book mode — publisher, title, ISBN/KDN approval, page count, lines per page — matching the owner's Malaysia Shopee Arabic color-tajweed copy (KDN / Lajnah Tasheh cues, Resam Uthmani, per-juz color distinction, Arabic-only, Madinah-style page ends: page 2 ends at `2:5`)?

Does its page-end sequence match the repo's existing `mushaf=19` data (604 pages × 15 lines in `src/data/chapters/*.json`)? If not, what authoritative digital layout source documents the correct page ends?

## Verdict (short)

1. **Page-end family** that matches the owner cue `page 2 → 2:5` is the standard **Madinah 604 × 15** layout (King Fahd Complex / KFGQPC lineage). The repo's `mushaf=19` snapshot **already matches** that page-end sequence.
2. **Authoritative Malaysia digital gold for KDN color-tajweed + waqaf chrome on that same layout** is **MYQURAN KDN** (`https://qurankdn.moha.gov.my/`) — Arabic-only page images, Malay/English tajweed+waqaf legend, **604 pages**, Madinah ends verified on live scans (p2→`2:5`, p22→`2:145`, p42→`2:256`, p604→`114:6`).
3. **Printed KDN title** tied to that product family in the official e-PQ list: **Al-Quran Al-Karim Waqaf Ibtida' dan Tajwid Berwarna**, applicant **Kementerian Dalam Negeri**, approval **`KDN.PKK.600-16/18/1.2/QA/887/5/2022`**, size **17.6 × 25 cm** (B5). No public ISBN for that exact KDN-applicant row was found in e-PQ.
4. **Exact Shopee retail SKU / ISBN of the owner's personal copy cannot be proven from primary sources alone** without a photo of the approval stamp / ISBN page. Many common MY retail color-tajweed titles (Telaga Biru At-Tashil ~648p; Karya Bestari Arabic mushaf ~640p; translation editions ~662–664p) are **not** Madinah page-end compatible despite KDN stamps and juz color marketing.

## 1. What the repo already encodes (`mushaf=19`)

From `src/data/SOURCES.md`: chapter JSON page/line fields were ingested from `api.quran.com` with **`mushaf=19`**.

QUL / Quran Foundation name for id **19**:

- QUL layouts index: **“QPC v4 tajweed”** — 604 pages, 15 lines/page, Hafs ([qul.tarteel.ai/mushaf_layouts](https://qul.tarteel.ai/mushaf_layouts)).
- QUL resource page for the same id: **“KFGQPC V4 layout (1441H print)”** — King Fahd Glorious Quran Printing Complex, 604 × 15, V4 tajweed glyph fonts ([qul.tarteel.ai/resources/mushaf-layout/19](https://qul.tarteel.ai/resources/mushaf-layout/19)).
- QUL page table for layout 19 documents ayah ranges including **page 2 = `2:1`–`2:5`**, page 3 = `2:6`–`2:16`, … ([qul.tarteel.ai/mushaf_layouts/19](https://qul.tarteel.ai/mushaf_layouts/19)).

Checked against checked-in JSON (`src/data/chapters/*.json`):

| Page | Last ayah key (repo) |
| --- | --- |
| 1 | `1:7` |
| 2 | `2:5` |
| 3 | `2:16` |
| 22 | `2:145` |
| 42 | `2:256` |
| 582 | `78:30` (juz 30 starts `78:1` on p582) |
| 604 | `114:6` |

Body pages use **15 lines**; early/late pages can show fewer occupied body lines because of surah banners (same Madinah behaviour).

## 2. Official Malaysia KDN digital mushaf (primary)

**MYQURAN KDN** — Ministry of Home Affairs digital mushaf:

- Home banner title: **Al-Qur'an Al-Karim — Penandaan Wakaf Ibtida' dan Tajwid Berwarna** ([qurankdn.moha.gov.my](https://qurankdn.moha.gov.my/)).
- Page image CDN: `https://qurankdn.moha.gov.my/myquran/quran_img/{n}.jpg`.
- Page count: **`1.jpg`…`604.jpg` HTTP 200; `605.jpg` 404** → **604 pages**.
- Surah index lists Al-Ikhlas / Al-Falaq / An-Nas all starting on page **604**.
- Juz index page numbers (Juz 1 @1, Juz 2 @22, Juz 3 @42, … Juz 30 @582) match classic Madinah juz starts.

**Live page-image checks (2026-10-29):**

| Page | Observed end | Lines (body) | Notes |
| --- | --- | --- | --- |
| 2 | ends at **2:5** | Madinah short page after Al-Baqarah banner | Color tajweed + pink/green waqaf highlights; Malay/English legend |
| 22 | ends at **2:145** | **15** | Juz 2 header; matches repo |
| 42 | ends at **2:256** | **15** | Juz 3 start `2:253`; matches repo |
| 604 | ends at **114:6** | **15** | Final page; matches repo |

Conclusion: for **page-end parity**, MYQURAN KDN ≡ Madinah 604×15 ≡ repo `mushaf=19`.

Visual chrome (KDN Pewarnaan Tajwid 5-warna + waqaf background blocks + Malay legend) is **not** the same product as Dar Al-Maarifah letter-coloring alone (see prior `docs/research/tajwid-color-standard.md`). Book mode's **page-end** question is answered by the Madinah layout; **ink/color chrome** is a separate map decision (#18 Not-yet-specified).

## 3. Printed KDN approval row (e-PQ)

Official public list: [SENARAI KELULUSAN PRUF AKHIR TEKS AL-QURAN](https://epq.kdn.gov.my/e-pq/index.php?mod=public&opt=pruf).

Matching title / applicant for the MYQURAN product family:

| Field | Value |
| --- | --- |
| Title | **AL-QURAN AL-KARIM WAQAF IBTIDA DAN TAJWID BERWARNA** (also listed with apostrophe variants) |
| Applicant / company | **Kementerian Dalam Negeri** |
| Approval no. | **`KDN.PKK.600-16/18/1.2/QA/887/5/2022`** |
| Size (canonical row) | **17.6 cm × 25 cm** (B5) |
| Approval date | 26-03-2022 |
| ISBN | **Not published** in the e-PQ table for this row |

e-PQ also lists a pocket-size row under the same approval number with a conflicting size field (`6.25×9` vs `(17.6:25)` in the approval string) — treat **B5 17.6×25** as the authoritative size for the main edition.

**Mushaf Al-Sultan Abdullah** (KDN, 2024, A4) is a later KDN showcase mushaf with color tajweed / waqaf features; page count / Madinah parity were **not** confirmed from a primary page-count source in this pass — do not pin Book mode to it without a further check.

## 4. Common Malaysia retail SKUs — match vs trap

| Candidate | Publisher | Approx pages | Arabic-only? | Madinah p2→2:5? | Notes |
| --- | --- | --- | --- | --- | --- |
| MYQURAN KDN / QA/887/5/2022 print family | KDN | **604** | Yes (digital confirmed) | **Yes** | Best official pin for KDN color-tajweed **on Madinah ends** |
| Dar Al-Maarifah *Mus'haf al-Tajweed* (Arabic-only / 15-line hardbacks) | Dar Al-Maarifah (Damascus); MY retail via Darul Fikir etc. | **604** | Yes | **Yes** (Madinah Uthmani page ends) | Tajweed **color system** is Dar Al-Maarifah / Al-Azhar 1999 — not KDN Pewarnaan Tajwid; Shopee imports often marketed as “tajwid berwarna” |
| Karya Bestari *Al-Quran Al-Karim Mushaf* (Arabic, tajwid+waqaf) | Karya Bestari | **~640** | Yes | **No** (page count ≠ 604) | KDN Lajnah Tasheh; common Shopee Arabic-only SKU |
| Telaga Biru *At-Tashil* tajwid + waqaf | Telaga Biru | **648** (A4 TBAQ1058) | Arabic text focus | **No** | Explicit per-juz border + paper color every 5 juz; KDN 2022 — marketing matches “juz warna” better than Madinah page count |
| Telaga Biru / Karya Bestari tajwid **+ terjemahan** | Various | **~662–664** | No | Usually **No** | Prior map note; translation chrome expands pagination |
| Dakwah Corner / Karya Bestari *Mushaf Madinah* | DCB / Karya Bestari | **604** | Yes | **Yes** | KDN-approved Madinah script; **not** the color-tajweed product |

**Owner Shopee cues vs traps:** “KDN + Lajnah + juz warna + tajwid berwarna” alone often points at **640–664p local editions**. The owner's additional hard cue **page 2 ends at `2:5`** selects the **604 Madinah** family and **rules out** the common 640/648/664 SKUs for **page-end parity**.

Without the owner's ISBN / KDN stamp photo, the research pins:

- **Layout Reference** = Madinah 604×15 (digitally: `mushaf=19` / QUL 19 / MYQURAN KDN pages).
- **Malaysia KDN color-tajweed exemplar on that layout** = MYQURAN KDN + e-PQ **QA/887/5/2022** title above.
- **Optional physical import that matches page ends but not KDN color spec** = Dar Al-Maarifah Arabic-only 604×15.

## 5. Does `mushaf=19` match? Authoritative digital sources

**Yes — page-end sequence matches.** No alternate page-end encoding is required for Book mode parity against Madinah / MYQURAN KDN / the owner's stated page-2 end.

Authoritative digital layout sources (prefer these over blogs):

1. **QUL mushaf layout id 19** — [layouts list](https://qul.tarteel.ai/mushaf_layouts), [layout 19 page table](https://qul.tarteel.ai/mushaf_layouts/19), [KFGQPC V4 1441H resource](https://qul.tarteel.ai/resources/mushaf-layout/19).
2. **MYQURAN KDN page images** — official Malaysia KDN color-tajweed+waqaf scans on the same 604 ends ([qurankdn.moha.gov.my](https://qurankdn.moha.gov.my/)).
3. **Repo snapshot** — `src/data/chapters/*.json` `pageNumber` / `lineNumber` from `mushaf=19` (`src/data/SOURCES.md`).

Related but distinct: QUL id **1** “Mushaf Al Madinah V2 (1421H)” and id **5** “KFGQPC HAFS” share the same 604×15 page geometry; id **19** adds QPC V4 tajweed glyph encoding used by qurescent fonts.

## 6. Open residual (not blocking page-end parity)

- Owner should still photograph the **ISBN / KDN kelulusan stamp / publisher colophon** of the physical Shopee copy to lock a single commercial SKU if product chrome (cover, juz paper tint) must be named in the spec.
- “Per-juz color distinction” on MYQURAN scans appears primarily as **juz/hizb side tabs + headers**, not strongly as different full-border hues across juz (unlike At-Tashil marketing). If the owner's book has dramatic per-juz paper dyes, it may still be Madinah 604 **or** a non-Madinah local SKU — page-2 end remains the decisive check.
- Ink/color fidelity (KDN Pewarnaan Tajwid vs QCF V4 / Dar Al-Maarifah) remains a separate #18 decision.

## Sources

- [MYQURAN KDN](https://qurankdn.moha.gov.my/) and page images `/myquran/quran_img/{1..604}.jpg` (fetched 2026-10-29).
- [KDN e-PQ — Senarai Kelulusan Pruf Akhir Teks Al-Quran](https://epq.kdn.gov.my/e-pq/index.php?mod=public&opt=pruf) — QA/887/5/2022 rows.
- [QUL mushaf layouts](https://qul.tarteel.ai/mushaf_layouts); [layout 19](https://qul.tarteel.ai/mushaf_layouts/19); [KFGQPC V4 resource](https://qul.tarteel.ai/resources/mushaf-layout/19).
- Repo: `src/data/SOURCES.md`, `src/data/chapters/*.json`, `docs/research/tajwid-color-standard.md`.
- Publisher product pages (secondary, for page-count traps): Karya Bestari mushaf listings (~640p); Telaga Biru At-Tashil TBAQ1058 (648p, KDN approval on product page); Dar Al-Maarifah / Darul Fikir Arabic tajweed 17×24 retail; Dakwah Corner Mushaf Madinah 604p product sheet.
