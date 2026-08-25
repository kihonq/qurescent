/**
 * One-shot ingest of Quran data into src/data/.
 *
 * Sources (per wayfinder #5 / #14):
 * - Chapter metadata + full-verse translations: api.alquran.cloud (bulk, invited mirrors)
 * - Word glyphs (code_v2), page numbers, Uthmani/QPC text, word-by-word EN:
 *   api.quran.com one-shot dump — QUL JSON downloads require sign-in; this is a
 *   fetch-once, check-into-repo snapshot, never called at runtime.
 *
 * Usage: bun run data:ingest
 */
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DATA = join(ROOT, "src", "data");

const TRANSLATION_EDITIONS = [
  { id: "en.sahih", code: "en", language: "English", editionName: "Saheeh International" },
  { id: "ms.basmeih", code: "ms", language: "Bahasa Melayu", editionName: "Abdullah Basmeih" },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchJson(url, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "qurescent-static-ingest/1.0 (sedekah; github.com/kihonq/qurescent)",
      },
    });
    if (res.ok) return res.json();
    if (attempt === retries) {
      throw new Error(`${url} → ${res.status} ${res.statusText}`);
    }
    await sleep(500 * attempt);
  }
}

async function ingestChapters() {
  const raw = await fetchJson("https://api.alquran.cloud/v1/surah");
  const chapters = raw.data.map((s) => ({
    id: s.number,
    name: s.name,
    englishName: s.englishName,
    englishNameTranslation: s.englishNameTranslation,
    totalVerse: s.numberOfAyahs,
    revelationType: s.revelationType,
  }));
  await writeFile(join(DATA, "chapters.json"), JSON.stringify(chapters, null, 2) + "\n");
  console.log(`chapters.json — ${chapters.length} surahs`);
  return chapters;
}

async function ingestTranslations() {
  await mkdir(join(DATA, "translations"), { recursive: true });
  const catalog = [];

  for (const edition of TRANSLATION_EDITIONS) {
    const raw = await fetchJson(`https://api.alquran.cloud/v1/quran/${edition.id}`);
    const byKey = {};
    for (const surah of raw.data.surahs) {
      for (const ayah of surah.ayahs) {
        byKey[`${surah.number}:${ayah.numberInSurah}`] = ayah.text;
      }
    }
    await writeFile(
      join(DATA, "translations", `${edition.id}.json`),
      JSON.stringify(byKey) + "\n",
    );
    catalog.push({
      id: edition.id,
      code: edition.code,
      language: edition.language,
      editionName: edition.editionName,
    });
    console.log(`translations/${edition.id}.json — ${Object.keys(byKey).length} ayahs`);
  }

  await writeFile(
    join(DATA, "translations", "catalog.json"),
    JSON.stringify(catalog, null, 2) + "\n",
  );
}

async function ingestChapterWords(chapterId) {
  // mushaf=19 = QCF V4 tajweed (same code_v2 glyphs as V2, V4 font files)
  const base =
    `https://api.quran.com/api/v4/verses/by_chapter/${chapterId}` +
    `?words=true&word_fields=code_v2,text_uthmani,text_qpc_hafs,page_number,line_number` +
    `&mushaf=19&per_page=300`;

  const all = [];
  let page = 1;
  for (;;) {
    const raw = await fetchJson(`${base}&page=${page}`);
    all.push(...raw.verses);
    if (!raw.pagination.next_page) break;
    page = raw.pagination.next_page;
    await sleep(80);
  }

  const verses = all.map((v) => ({
    number: v.verse_number,
    key: v.verse_key,
    pageNumber: v.page_number,
    words: v.words.map((w) => ({
      position: w.position,
      charType: w.char_type_name,
      codeV2: w.code_v2 ?? "",
      textUthmani: w.text_uthmani ?? "",
      textQpcHafs: w.text_qpc_hafs ?? "",
      pageNumber: w.page_number ?? v.page_number,
      lineNumber: w.line_number ?? null,
      translation: w.translation?.text ?? "",
      transliteration: w.transliteration?.text ?? "",
    })),
  }));

  await writeFile(
    join(DATA, "chapters", `${chapterId}.json`),
    JSON.stringify({ id: chapterId, verses }) + "\n",
  );
  return verses.length;
}

async function main() {
  await mkdir(join(DATA, "chapters"), { recursive: true });
  await mkdir(join(DATA, "translations"), { recursive: true });

  console.log("Ingesting chapter metadata…");
  const chapters = await ingestChapters();

  console.log("Ingesting translations…");
  await ingestTranslations();

  console.log("Ingesting word/glyph data (114 chapters)…");
  for (const ch of chapters) {
    const n = await ingestChapterWords(ch.id);
    console.log(`  chapter ${ch.id} — ${n} verses`);
    await sleep(100);
  }

  await writeFile(
    join(DATA, "SOURCES.md"),
    [
      "# Static Quran data sources",
      "",
      "Fetched once by `bun run data:ingest`. Not re-fetched at build or runtime.",
      "",
      "| Asset | Source | License / notes |",
      "| --- | --- | --- |",
      "| `chapters.json` | `api.alquran.cloud/v1/surah` | Invites full-corpus mirrors |",
      "| `translations/*.json` | `api.alquran.cloud/v1/quran/{edition}` | Same |",
      "| `chapters/{id}.json` (glyphs, pages, wbw EN) | `api.quran.com` one-shot (`mushaf=19`) | Snapshot for static use; QUL JSON downloads require sign-in |",
      "",
      `Ingested: ${new Date().toISOString()}`,
      "",
    ].join("\n"),
  );

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
