/**
 * Build a static Lunr index (Arabic stemmer + EN) over all verses + EN/MS
 * translations. Writes `public/search/verses.json` for client search (#7).
 *
 * Run: bun scripts/build-verse-search-index.mjs
 */
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import lunr from "lunr";
import stemmerSupport from "lunr-languages/lunr.stemmer.support.js";
import multiLanguage from "lunr-languages/lunr.multi.js";
import ar from "lunr-languages/lunr.ar.js";

stemmerSupport(lunr);
ar(lunr);
multiLanguage(lunr);

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

/** @type {Array<{ id: string, arabic: string, en: string, ms: string, chapter: number, verse: number, surah: string, url: string, excerpt: string }>} */
const docs = [];

const files = (await readdir(chaptersDir))
  .filter((f) => /^\d+\.json$/.test(f))
  .sort((a, b) => Number(a.replace(".json", "")) - Number(b.replace(".json", "")));

for (const file of files) {
  const chapter = JSON.parse(
    await readFile(path.join(chaptersDir, file), "utf8"),
  );
  const meta = metaById.get(chapter.id);
  const surah = meta?.englishName ?? `Surah ${chapter.id}`;

  for (const verse of chapter.verses) {
    const arabic = verse.words
      .filter((w) => w.charType === "word")
      .map((w) => w.textUthmani)
      .join(" ");
    const enText = en[verse.key] ?? "";
    const msText = ms[verse.key] ?? "";
    const excerpt = (enText || msText || arabic).slice(0, 160);
    docs.push({
      id: verse.key,
      arabic,
      en: enText,
      ms: msText,
      chapter: chapter.id,
      verse: verse.number,
      surah,
      url: `/read/${chapter.id}/#${verse.key.replace(":", "-")}`,
      excerpt,
    });
  }
}

const index = lunr(function () {
  this.use(lunr.multiLanguage("ar", "en"));
  this.ref("id");
  this.field("arabic", { boost: 10 });
  this.field("en", { boost: 5 });
  this.field("ms", { boost: 4 });

  for (const doc of docs) {
    this.add({
      id: doc.id,
      arabic: doc.arabic,
      en: doc.en,
      ms: doc.ms,
    });
  }
});

const payload = {
  version: 1,
  builtAt: new Date().toISOString(),
  count: docs.length,
  index,
  docs: Object.fromEntries(
    docs.map((d) => [
      d.id,
      {
        chapter: d.chapter,
        verse: d.verse,
        surah: d.surah,
        url: d.url,
        excerpt: d.excerpt,
        arabic: d.arabic.slice(0, 120),
      },
    ]),
  ),
};

await mkdir(outDir, { recursive: true });
await writeFile(outFile, JSON.stringify(payload));

const sizeMb = (Buffer.byteLength(JSON.stringify(payload)) / (1024 * 1024)).toFixed(2);
console.log(
  `Wrote ${outFile} — ${docs.length} verses, ${sizeMb} MB (Lunr ar+en multi)`,
);
