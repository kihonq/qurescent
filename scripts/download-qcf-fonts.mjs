/**
 * Download QCF V4 tajweed fonts into public/fonts/qcf-v4/.
 *
 * Permission: Ayman24x7 via Discord (#13) — non-commercial, ads-free, credit qul.tarteel.ai.
 * Self-hosted per #14 (no runtime CDN dependency).
 *
 * Layout:
 *   public/fonts/qcf-v4/colrv1/p{N}.woff2
 *   public/fonts/qcf-v4/ot-svg/{light,dark,sepia}/p{N}.woff2
 *
 * Usage:
 *   pnpm data:fonts            # all 604 pages × formats
 *   pnpm data:fonts -- --pages=1-3   # subset for local testing
 */
import { mkdir, writeFile, access } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "public", "fonts", "qcf-v4");
const CDN = "https://verses.quran.foundation/fonts/quran/hafs/v4";

const VARIANTS = [
  { dir: "colrv1", path: (n) => `${CDN}/colrv1/woff2/p${n}.woff2` },
  { dir: "ot-svg/light", path: (n) => `${CDN}/ot-svg/light/woff2/p${n}.woff2` },
  { dir: "ot-svg/dark", path: (n) => `${CDN}/ot-svg/dark/woff2/p${n}.woff2` },
  { dir: "ot-svg/sepia", path: (n) => `${CDN}/ot-svg/sepia/woff2/p${n}.woff2` },
];

function parsePages(argv) {
  const arg = argv.find((a) => a.startsWith("--pages="));
  if (!arg) return { from: 1, to: 604 };
  const value = arg.slice("--pages=".length);
  if (value.includes("-")) {
    const [a, b] = value.split("-").map(Number);
    return { from: a, to: b };
  }
  const n = Number(value);
  return { from: n, to: n };
}

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function download(url, dest) {
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "qurescent-static-ingest/1.0 (sedekah; github.com/kihonq/qurescent)",
    },
  });
  if (!res.ok) throw new Error(`${url} → ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(dest, buf);
  return buf.length;
}

async function main() {
  const { from, to } = parsePages(process.argv.slice(2));
  console.log(`Downloading QCF V4 fonts for pages ${from}–${to}…`);

  let downloaded = 0;
  let skipped = 0;

  for (const variant of VARIANTS) {
    const dir = join(OUT, variant.dir);
    await mkdir(dir, { recursive: true });

    for (let page = from; page <= to; page++) {
      const dest = join(dir, `p${page}.woff2`);
      if (await exists(dest)) {
        skipped++;
        continue;
      }
      const bytes = await download(variant.path(page), dest);
      downloaded++;
      if (downloaded % 50 === 0) {
        console.log(`  … ${downloaded} downloaded, ${skipped} skipped`);
      }
      // light politeness delay
      if (downloaded % 20 === 0) await new Promise((r) => setTimeout(r, 50));
      void bytes;
    }
  }

  console.log(`Done. downloaded=${downloaded} skipped=${skipped}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
