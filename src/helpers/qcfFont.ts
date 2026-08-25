/**
 * Client-side loader for self-hosted QCF V4 fonts (COLRv1).
 *
 * Same glyph file for colored + uncolored — only CSS `font-palette` changes:
 *   0 light / 1 dark / 2 sepia  (tajweed colors)
 *   3 mono-light / 4 mono-dark / 5 mono-sepia (plain ink, same metrics)
 *
 * Leftover palette slots 10–12 on mono bases are forced to ink via override-colors.
 *
 * @see https://api-docs.quran.foundation/docs/tutorials/fonts/font-rendering/
 */
const loaded = new Set<string>();
const palettesInjected = new Set<string>();

export type QcfTheme = "light" | "dark" | "sepia";

/** Resolve Starlight / system theme for mushaf ink. */
export function resolveQcfTheme(): QcfTheme {
  if (typeof document === "undefined") return "light";
  const attr = document.documentElement.getAttribute("data-theme");
  if (attr === "dark") return "dark";
  if (attr === "light") return "light";
  if (typeof window !== "undefined" && window.matchMedia) {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return "light";
}

export function qcfFontFamily(pageNumber: number): string {
  return `p${pageNumber}-v4`;
}

/**
 * CSS font-palette for COLRv1.
 * `colored` false → mono palettes (identical advance widths to tajweed).
 */
export function qcfFontPalette(
  pageNumber: number,
  theme: QcfTheme,
  colored: boolean,
): string {
  const family = qcfFontFamily(pageNumber);
  if (!colored) {
    const mono =
      theme === "dark" ? "MonoDark" : theme === "sepia" ? "MonoSepia" : "MonoLight";
    return `--${mono}-${family}`;
  }
  const label =
    theme === "dark" ? "Dark" : theme === "sepia" ? "Sepia" : "Light";
  return `--${label}-${family}`;
}

function injectFontPalettes(family: string): void {
  if (typeof document === "undefined" || palettesInjected.has(family)) return;
  const style = document.createElement("style");
  style.setAttribute("data-qcf-palette", family);
  // Mono bases 3/4/5 still leave slots 10–12 tinted in the font file — force ink.
  style.textContent = `
@font-palette-values --Light-${family} {
  font-family: '${family}';
  base-palette: 0;
}
@font-palette-values --Dark-${family} {
  font-family: '${family}';
  base-palette: 1;
}
@font-palette-values --Sepia-${family} {
  font-family: '${family}';
  base-palette: 2;
}
@font-palette-values --MonoLight-${family} {
  font-family: '${family}';
  base-palette: 3;
  override-colors: 10 #000000, 11 #000000, 12 #000000;
}
@font-palette-values --MonoDark-${family} {
  font-family: '${family}';
  base-palette: 4;
  override-colors: 10 #ffffff, 11 #ffffff, 12 #ffffff;
}
@font-palette-values --MonoSepia-${family} {
  font-family: '${family}';
  base-palette: 5;
  override-colors: 10 #000000, 11 #000000, 12 #000000, 13 #000000;
}
`.trim();
  document.head.appendChild(style);
  palettesInjected.add(family);
}

export async function loadQcfPageFont(pageNumber: number): Promise<string> {
  const family = qcfFontFamily(pageNumber);
  if (loaded.has(family)) {
    injectFontPalettes(family);
    return family;
  }

  if (typeof document === "undefined" || typeof FontFace === "undefined") {
    return family;
  }

  const face = new FontFace(
    family,
    `url('/fonts/qcf-v4/colrv1/p${pageNumber}.woff2')`,
  );
  face.display = "block";
  await face.load();
  document.fonts.add(face);
  loaded.add(family);
  injectFontPalettes(family);
  return family;
}

export async function loadQcfPageFonts(
  pageNumbers: Iterable<number>,
): Promise<void> {
  await Promise.all([...new Set(pageNumbers)].map((p) => loadQcfPageFont(p)));
}
