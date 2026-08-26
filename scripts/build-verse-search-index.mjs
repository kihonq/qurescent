/**
 * Build a static Lunr index over all verses + EN/MS translations.
 * Arabic is diacritic-normalized; Unicode-safe pipeline (no lunr-ar stemmer).
 *
 * Run: bun scripts/build-verse-search-index.mjs
 */
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import lunr from "lunr";
import { normalizeArabic } from "../src/lib/arabic-normalize.ts";
import { useQurescentLunrPipeline } from "../src/lib/lunr-pipeline.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const chaptersDir = path.join(root, "src/data/chapters");
const outDir = path.join(root, "public/search");
const outFile = path.join(outDir, "verses.json");

const chaptersMeta = JSON.parse(
  await readFile(path.join(root, "src/data/chapters.json"), "utf8"),
);
const en = JSON.parse(
  await readFile(path.join(root, "src/data/translations/en.sahih.json"), "utf8"),
);
const ms = JSON.parse(
  await readFile(path.join(root, "src/data/translations/ms.basmeih.json"), "utf8"),
);

const metaById = new Map(chaptersMeta.map((c) => [c.id, c]));

const docs = [];

const files = (await readdir(chaptersDir))
  .filter((f) => /^\d+\.json$/.test(f))
  .sort((a, b) => Number(a.replace(".json", "")) - Number(b.replace(".json", "")));

for (const file of files) {
  const chapter = JSON.parse(
    await readFile(path.join(chaptersDir, file), "utf8"),
  );
  const meta = metaById.get(chapter.id);
  const surahLabel = meta?.englishName ?? `Surah ${chapter.id}`;
  const surahAr = meta?.name ? normalizeArabic(meta.name) : "";

  for (const verse of chapter.verses) {
    const displayArabic = verse.words
      .filter((w) => w.charType === "word")
      .map((w) => w.textUthmani)
      .join(" ");
    const enText = en[verse.key] ?? "";
    const msText = ms[verse.key] ?? "";
    const excerpt = (enText || msText || displayArabic).slice(0, 160);
    docs.push({
      id: verse.key,
      arabic: normalizeArabic(displayArabic),
      en: enText,
      ms: msText,
      surah: [surahLabel, surahAr, meta?.englishNameTranslation ?? ""]
        .filter(Boolean)
        .join(" "),
      chapter: chapter.id,
      verse: verse.number,
      url: `/read/${chapter.id}/#${verse.key.replace(":", "-")}`,
      excerpt,
      displayArabic,
      surahLabel,
    });
  }
}

const index = lunr(function () {
  useQurescentLunrPipeline(this);
  this.ref("id");
  this.field("arabic", { boost: 10 });
  this.field("surah", { boost: 12 });
  this.field("en", { boost: 5 });
  this.field("ms", { boost: 4 });

  for (const doc of docs) {
    this.add({
      id: doc.id,
      arabic: doc.arabic,
      surah: doc.surah,
      en: doc.en,
      ms: doc.ms,
    });
  }
});

const payload = {
  version: 2,
  builtAt: new Date().toISOString(),
  count: docs.length,
  index,
  docs: Object.fromEntries(
    docs.map((d) => [
      d.id,
      {
        chapter: d.chapter,
        verse: d.verse,
        surah: d.surahLabel,
        url: d.url,
        excerpt: d.excerpt,
        arabic: d.displayArabic.slice(0, 120),
      },
    ]),
  ),
};

await mkdir(outDir, { recursive: true });
await writeFile(outFile, JSON.stringify(payload));

const sizeMb = (Buffer.byteLength(JSON.stringify(payload)) / (1024 * 1024)).toFixed(2);
console.log(
  `Wrote ${outFile} — ${docs.length} verses, ${sizeMb} MB (Lunr + Arabic normalize)`,
);
