# KDN Pewarnaan Tajwid + Waqaf/Ibtida vs Dar Al-Maarifah vs QCF V4

Research for [#20](https://github.com/kihonq/qurescent/issues/20), child of map [#18](https://github.com/kihonq/qurescent/issues/18) (Book mode / KDN color-tajweed mushaf).

**Scope:** primary-source capture of Malaysia **KDN** official coloring rules for tajwid and waqaf/ibtida, compared to **Dar Al-Maarifah** Mus'haf al-Tajweed and to **QCF V4 COLRv1** colors already used on qurescent. This file is **not** a product decision on whether Book mode must match KDN waqaf/juz chrome — that is ticket [#24](https://github.com/kihonq/qurescent/issues/24).

## Bottom line

1. **KDN has an official, enforceable color spec** for colored tajweed mushafs sold/printed in Malaysia: *Garis Panduan Al-Quran Tajwid Berwarna Berserta Waqaf dan Ibtida’* (LPPPQ / KDN, filename `GP_Kaedah_Hukum_Tajwid_dan_Waqaf_IBTIDA_2020.pdf`), linked from the KDN “Garis Panduan Teks Al-Qur'an” pages on [moha.gov.my](https://www.moha.gov.my/utama/index.php/ms/component/content/article/548-garis-panduan-teks-al-quran?catid=158). Compliance is required for colored mushafs seeking *perakuan betul pruf akhir* under APTQ 1986.
2. **That KDN legend is related to, but not identical with, Dar Al-Maarifah.** The GP itself lists *Mushaf Tajwid Dar Al-Maarifah, Syria Damsyik* as reference (vi), alongside Indonesia’s *Pedoman Tajwid Sistem Berwarna*. Rule families overlap (madd tiers, ghunnah green, qalqalah blue-family, tafkhīm of ر), but **color→rule assignments and hexes diverge** in several places that matter for a how-to-read guide (especially madd 2-count ink, madd 6-count hue, ر tafkhīm hue, silent/gray letters, and waqaf/ibtida highlights).
3. **Qurescent’s live reader ink is QCF V4 COLRv1** (glyph-baked colors; light palette dumped from `public/fonts/qcf-v4/colrv1/p1.woff2`). The site guide (`/guide/tajwid/`) maps those CPAL slots to **Dar Al-Maarifah rule names**, not to KDN names/hexes. QCF has **no** soft-red / soft-green **word-background** waqaf/ibtida chrome; those are page-layout highlights in the KDN system, not COLR slots.
4. **MYQuran KDN** ([qurankdn.moha.gov.my](https://qurankdn.moha.gov.my/)) is the public digital specimen of KDN’s “penandaan wakaf ibtida’ dan tajwid berwarna” — page raster images with a Malay bottom legend that matches the GP families. Sample pages 1–2 show Madinah-style content (page 2 ends at Al-Baqarah 2:5). **Official GP does not specify per-juz border/chrome color rotation**; retail “30 juz berwarna berbeza” cues are publisher chrome beyond this GP (relevant to #24, not proven as LPPPQ law here).
5. **Guide implication:** how-to-read content that teaches the **Reference Mushaf** (Malaysia retail / KDN) must explain **KDN** families + waqaf/ibtida highlights; content that teaches **what the site currently paints** must explain **QCF≈DAM**. They are not drop-in interchangeable legends.

## 1. Primary sources used

| Source | Role | URL / location |
| --- | --- | --- |
| KDN GP 2020 PDF | **Authoritative Malaysia coloring law for colored mushafs** | [GP_Kaedah_Hukum_Tajwid_dan_Waqaf_IBTIDA_2020.pdf](https://www.moha.gov.my/utama/images/Borang/Teks%20Al-quran/GP_Kaedah_Hukum_Tajwid_dan_Waqaf_IBTIDA_2020.pdf) (also mirrored under `/utama/images/Akta%20Perundangan/GARIS%20PANDUAN%20TEKS%20Al-QURAN/`) |
| KDN listing pages | Confirms the GP is one of the official *Garis Panduan Teks Al-Qur'an* | [catid=158](https://www.moha.gov.my/utama/index.php/ms/component/content/article/548-garis-panduan-teks-al-quran?catid=158), [catid=112](https://www.moha.gov.my/utama/index.php/ms/component/content/article/320-garis-panduan-teks-al-quran?catid=112) |
| MYQuran KDN | Official digital mushaf images + on-page Malay legend | [qurankdn.moha.gov.my](https://qurankdn.moha.gov.my/) — e.g. `/myquran/quran_img/{page}.jpg` |
| e-PQ KDN | Pruf-akhir / licensing portal (login-gated; public pruf list) | [epq.kdn.gov.my](https://epq.kdn.gov.my/) — public [senarai pruf](https://epq.kdn.gov.my/e-pq/index.php?mod=public&opt=pruf) |
| Dar Al-Maarifah color roles | Publisher’s documented legend | [easyquran.com — Tajweed Quran Colors Roles](https://easyquran.com/en/tajweed-quran-colors-roles/); supporting: [Explaining the idea](https://easyquran.com/en/explaining-the-idea/), [Al-Azhar accreditation (1999)](https://easyquran.com/en/al-azhar-accreditation/) |
| QCF V4 on qurescent | Measured CPAL palette 0 from self-hosted font | `public/fonts/qcf-v4/colrv1/p1.woff2`; guide draft `src/content/docs/guide/tajwid/index.mdx`; loader `src/helpers/qcfFont.ts` |
| Prior repo research | DAM vs older API-tag mapping context | `docs/research/tajwid-color-standard.md`, `docs/research/tajwid-rendering-audit.md` |

**Not used as Malaysia authority:** Indonesia Kemenag *Pedoman Tajwid Sistem Warna* (cited by KDN as a *rujukan*, different hex set and waqaf-sign coloring model). Retail Shopee blurbs naming “Lajnah Tasheh” are marketing shorthand for KDN/LPPPQ approval, not a separate published color PDF found in this pass.

## 2. What KDN officially specifies

Authority: LPPPQ decision Bil.85.1/2016 → GP document (14 pages). Purpose: standardize coloring so the same tajwid rule is not painted differently by different publishers; applies to publishers/printers/importers **and** enforcement agencies under APTQ 1986.

### 2.1 Pewarnaan Tajwid (letter / harakah ink)

Prose rules (§6) + suggested CMYK/RGB codes (tables pp. 6–10). Base mushaf ink must be black (§8.v). Companies may use **all or a subset** of the colors (§8.vi). Other colors need LPPPQ approval (§8.ii). A color key must appear **outside the text at the bottom of every page** (§8.iv). Pages smaller than 6×9 cm (small, no translation) may not use coloring (§8.i).

| KDN color name | Suggested RGB (from GP) | Suggested CMYK | Applies to |
| --- | --- | --- | --- |
| Hitam (2 harakat) | `rgb(35,31,32)` ≈ `#231F20` | 0 / 0 / 0 / 100 | Mad Asli, Badal, Syibh bil Badal, Silah Qasirah, Tamkin, Iwadh |
| Coklat gelap (6 harakat) | `rgb(167,53,33)` ≈ `#A73521` | 20 / 90 / 100 / 20 | Mad Lazim (kalimi/harfi, muthaqqal/mukhaffaf), Mad Faraq |
| Jingga (2 / 4 / 6) | `rgb(242,101,34)` ≈ `#F26522` | 0 / 75 / 100 / 0 | Mad ‘Arid Lissukun, Mad Lin (ra’s ayah aware) |
| Merah (4 atau 5) | `rgb(237,28,36)` ≈ `#ED1C24` | 0 / 100 / 100 / 0 | Mad Wajib Muttasil, Mad Jaiz Munfasil, Mad Silah Kubra/Tawilah |
| Hijau (dengung) | `rgb(23,175,75)` ≈ `#17AF4B` | 80 / 0 / 100 / 0 | Idgham ma‘al ghunnah, Idgham mislain / mutamathilain (as listed), Wajibul Ghunnah, Ikhfa’ Haqiqi, Ikhfa’ Syafawi, Iqlab, nun/mim tashdid |
| Biru muda (qalqalah) | `rgb(0,152,188)` ≈ `#0098BC` | 90 / 20 / 20 / 0 | Qalqalah (incl. ra’s-ayah major cases in examples) |
| Ungu (ra’ tebal) | `rgb(156,133,190)` ≈ `#9C85BE` | 40 / 50 / 0 / 0 | Ra’ dibaca tebal (examples show ر + harakah / tanwin / sukun / ra’s ayah). Table title also says “TEBAL (RA’ & LAM)” but extracted examples are **ra’-only** — treat lam-tafkhīm as **not demonstrated** in the GP tables |

GP tables also note *which* graphemes get ink (e.g. alif + madd mark for mad lazim kalimi; waw + madd for jaiz munfasil; nun + following letter for ikhfa’). That is application detail for publishers, not a second color set.

**Not in the KDN tajwid color table:** a dedicated gray/ash for “written but not pronounced” letters (DAM/QCF feature). Silent letters stay default black unless some other rule paints them.

### 2.2 Waqaf & Ibtida’ (word background highlights)

§7 — separate from letter tajwid colors:

1. Only used where the mushaf has **no existing waqaf sign**.
2. Placement must follow *sumber muktabar*.
3. Method: **highlight the word background** (*latar belakang kalimah*), not recolor letters.
4. Non-colored mushafs may instead use **gray underlines**.

| Category | Meaning (GP) | Suggested RGB | Suggested CMYK | MYQuran page-legend Malay (observed on pages 1–2) |
| --- | --- | --- | --- | --- |
| Waqaf — merah lembut | Reader may **stop** at end of the word | `rgb(249,192,199)` ≈ `#F9C0C7` | 0 / 30 / 10 / 0 | “Berhenti dan teruskan bacaan” |
| Ibtida’ (mengulang) — hijau lembut | Reader may **start** at the word **by repeating** | `rgb(206,230,193)` ≈ `#CEE6C1` | 20 / 0 / 30 / 0 | “Berhenti dan ulang bacaan” |

### 2.3 What the GP does **not** specify

- Per-juz border / ornament / header color schemes.
- Exact ornamental frame design (MYQuran’s teal floral frames are specimen chrome, not hex-coded in the GP).
- Pixel-matching to Madinah *Mujamma‘ Malik Fahd* page layout (GP explicitly notes plain Madinah mushafs are traditionally uncolored; coloring is a permitted learning aid).
- Equivalence tables mapping KDN slots → QCF CPAL indices (none exist officially).

### 2.4 MYQuran KDN specimen check

Fetched `https://qurankdn.moha.gov.my/myquran/quran_img/1.jpg` and `…/2.jpg` (2079×2953 JPEG). Observed:

- Bottom legend with the six tajwid swatches + two soft highlight swatches in Malay — aligned with GP families.
- Soft pink/red and soft green **word washes** on selected phrases (waqaf / ibtida).
- Letter inks in red / brown / orange / green / cyan-blue / purple on top of black base text.
- Page 2 content ends at **2:5** (Madinah-style page end), matching map #18’s Reference Mushaf cue for page-end parity research (#19), independent of color law.

## 3. Dar Al-Maarifah Mus'haf al-Tajweed (documented legend)

Primary: [Tajweed Quran Colors Roles](https://easyquran.com/en/tajweed-quran-colors-roles/) (publisher site). Al-Azhar Islamic Research Academy endorsement of the *idea* and application: [accreditation page](https://easyquran.com/en/al-azhar-accreditation/) (committee reports Sep / Nov 1999). Longer Arabic explanation: store “about” pages and [Explaining the idea](https://easyquran.com/en/explaining-the-idea/).

DAM documents **families by hue words**, not a public CMYK table like KDN:

| Family | DAM meaning |
| --- | --- |
| Dark red | Necessary prolongation (**madd lāzim**) — 6 counts |
| Blood / saturated red | Obligatory prolongation (**madd wājib**) — ~4–5 (muttaṣil, munfaṣil, ṣilah kubrā in the Arabic write-ups) |
| Orange-red | Permissible prolongation (**madd jāʾiz**) — 2 / 4 / 6 (‘āriḍ, līn) |
| Cumin red | Natural / normal prolongation (**madd ṭabīʿī**) — 2 counts |
| Green | Ghunnah / nasalization (ikhfāʾ, shaddah nūn/mīm, etc.; iqlāb uses green + gray on the nūn) |
| Dark blue | Emphatic **ر** (tafkhīm) |
| Light / sky blue | **Qalqalah** |
| Gray | Written but **not pronounced** (solar lām, silent letters, assimilated nūn in idghām, etc.) |

DAM does **not** present KDN-style soft-red/soft-green **word-background waqaf/ibtida** as part of this color-roles page. Standard Ottoman waqaf *signs* remain orthographic; coloring is tajwid-on-letters.

## 4. QCF V4 COLRv1 as used on qurescent

Measured from `p1.woff2` CPAL **palette 0** (light) via fontTools (identical across sampled pages per guide draft):

| CPAL index | Hex | Guide draft mapping (`/guide/tajwid/`) |
| --- | --- | --- |
| 0 | `#000000` | Default ink |
| 1, 2, 15 | `#A5A5A5` | Unpronounced / gray |
| 3 | `#B50000` | Madd lāzim (~6) |
| 9 | `#F40000` | Madd wājib (~4–5) |
| 4 | `#FF7B00` | Madd jāʾiz (2/4/6) |
| 5 | `#CE9E00` | Madd ṭabīʿī (~2) |
| 6 | `#09B000` | Ghunnah family |
| 7 | `#3F48E6` | Tafkhīm of ر |
| 8 | `#2FADFF` | Qalqalah |
| 10–12 | `#2CA4AB`, `#FF0080`, `#D8E9D8` | Present; mapping **not** confirmed as tajwid rules |

Dark/sepia palettes (1/2) retint the same slots for theme contrast; mono palettes 3–5 force leftover slots toward ink (`src/helpers/qcfFont.ts`).

Quran.com / QF are widely said to model Dar Al-Maarifah; that remains a **plausible unofficial claim** (see prior `tajwid-color-standard.md`), not a QF-published index→rule table. Qurescent’s guide already hedges that.

## 5. Comparison matrix (decision-relevant deltas)

| Topic | KDN GP / MYQuran | Dar Al-Maarifah | QCF V4 on qurescent (≈DAM naming) |
| --- | --- | --- | --- |
| Madd 2-count (asli / ṭabīʿī) | **Black** `#231F20` (same as base ink family) | **Cumin red** | **Gold** `#CE9E00` (CPAL 5) |
| Madd 4–5 (wājib + jaiz munfasil + ṣilah kubrā) | **Single red** `#ED1C24` for *both* wājib **and** jaiz munfasil | **Blood red** = wājib; **orange** = jāʾiz (‘āriḍ/līn) — jaiz *munfasil* grouped with wājib in DAM blood-red write-ups | `#F40000` wājib (9) vs `#FF7B00` jāʾiz (4) — DAM-style split |
| Madd 6 (lāzim / faraq) | **Dark brown** `#A73521` | **Dark red** | `#B50000` (3) |
| ‘Āriḍ / līn | **Orange** `#F26522` | Orange-red (jāʾiz) | `#FF7B00` (4) |
| Ghunnah family | Green `#17AF4B` | Green | `#09B000` (6) — same family, different hex |
| Qalqalah | Cyan/light blue `#0098BC` | Light blue | `#2FADFF` (8) |
| ر tafkhīm | **Purple** `#9C85BE` | **Dark blue** | **Dark blue** `#3F48E6` (7) |
| Silent / unpronounced | Not a dedicated tajwid color | Gray | Gray `#A5A5A5` |
| Waqaf / ibtida teaching chrome | Soft **word highlights** pink `#F9C0C7` / green `#CEE6C1` | Not in color-roles legend | **Absent** from COLR glyphs |
| Per-page legend required | Yes (§8.iv) | Legend in mushaf (end / codes) | Site guide page, not per mushaf page |
| Per-juz color chrome | **Not in GP** | N/A (product-dependent) | N/A |
| Institutional backing | LPPPQ / KDN under APTQ (Malaysia market) | Al-Azhar review of DAM idea (1999) | Font tech from QF; coloring claim → DAM |

### Practical reading of the deltas

- A user trained on **KDN/MYQuran** who opens qurescent colored tajweed will see **different hues for the same named rules** (notably ر: purple vs blue; lāzim: brown vs dark red; 2-count madd: “invisible” black vs gold).
- A user trained on **DAM/QCF** who opens a Malaysia retail colored mushaf will miss **gray silent-letter cues** and will encounter **waqaf/ibtida washes** that QCF never draws.
- **Matching KDN letter colors inside QCF** is not a CSS tweak: colors are glyph-baked; would need a different font/palette pipeline or overlay system. Matching **waqaf/ibtida** needs layout highlights on top of (or instead of) pure QCF pages — orthogonal to COLR tajwid.

## 6. Implications for later tickets (not decided here)

### For #24 (match vs decline KDN waqaf/juz chrome)

Evidence available now:

- **Waqaf/ibtida soft highlights** are first-class in the KDN GP and visible on MYQuran — if Book mode’s bar expands beyond page-end parity into “reads like the Reference Mushaf’s teaching chrome,” these matter.
- **Per-juz color distinction** is a retail/marketing cue, **not** found as a required rule in the GP PDF. Declining juz chrome can cite “not specified by LPPPQ GP”; matching it needs the pinned physical Reference Mushaf (#19), not this GP alone.
- Letter-color parity with KDN is a **third** axis (ink system), separate from waqaf/juz chrome.

### For the tajweed guide how-to-read + portion content (#18 destination / guide-scope ticket)

Teach, at minimum, as checkable claims tied to named sources:

1. **Two legends exist on the product surface:** “what KDN requires of Malaysia colored mushafs” vs “what QCF V4 paints in this app.”
2. **KDN letter families** with the GP RGB table (or MYQuran legend wording).
3. **KDN waqaf (stop/continue) vs ibtida’ (stop/repeat)** as *background* highlights, including the GP rule that they apply only where no printed waqaf sign exists.
4. **DAM/QCF families** as currently in `/guide/tajwid/`, with CPAL hexes from the font dump.
5. **Explicit mismatch callouts** (ر purple vs blue; 2-count madd black vs cumin/gold; lāzim brown vs dark red; gray silent letters; waqaf washes).
6. GP pedagogical stance: coloring is an **aid**; proper learning remains *talaqqi musyafahah* (GP §3) — suitable as a short how-to-read caveat, not as an ustaz gate for engineering claims.

Worked **portion** examples should preferably pick verses that show both letter colors and (for KDN teaching) a waqaf or ibtida highlight — MYQuran page 2 (2:1–5) is a concrete specimen already hosting both.

## 7. Claims deliberately not certified here

- Whether the owner’s physical retail mushaf uses the full KDN set or a §8.vi subset.
- Whether any given Shopee “KDN approved” edition’s per-juz colors are LPPPQ-approved extras or pure decoration.
- Religious correctness of any individual waqaf/ibtida placement on MYQuran pages (GP defers to *sumber muktabar*; this research does not audit placements).
- Pixel identity between MYQuran rasters and any one printed edition.

---

*Captured for wayfinder research #20. Primary PDF: KDN `GP_Kaedah_Hukum_Tajwid_dan_Waqaf_IBTIDA_2020.pdf` (text extracted 2026-10-29). QCF CPAL dumped from repo font `p1.woff2`.*
