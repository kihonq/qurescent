/**
 * Client-side loader for self-hosted QCF V4 page fonts.
 * COLRv1 for Chromium/Safari; OT-SVG theme files for Firefox.
 */
const loaded = new Set<string>();

const isFirefox = () =>
  typeof navigator !== "undefined" && /Firefox/i.test(navigator.userAgent);

export type QcfTheme = "light" | "dark" | "sepia";

export function qcfFontFamily(pageNumber: number): string {
  return `p${pageNumber}-v4`;
}

function fontUrl(pageNumber: number, theme: QcfTheme): string {
  if (isFirefox()) {
    return `/fonts/qcf-v4/ot-svg/${theme}/p${pageNumber}.woff2`;
  }
  return `/fonts/qcf-v4/colrv1/p${pageNumber}.woff2`;
}

export async function loadQcfPageFont(
  pageNumber: number,
  theme: QcfTheme = "light",
): Promise<string> {
  const family = qcfFontFamily(pageNumber);
  const cacheKey = `${family}:${isFirefox() ? theme : "colrv1"}`;
  if (loaded.has(cacheKey)) return family;

  if (typeof document === "undefined" || typeof FontFace === "undefined") {
    return family;
  }

  const face = new FontFace(family, `url('${fontUrl(pageNumber, theme)}')`);
  face.display = "block";
  await face.load();
  document.fonts.add(face);
  loaded.add(cacheKey);
  return family;
}

export async function loadQcfPageFonts(
  pageNumbers: Iterable<number>,
  theme: QcfTheme = "light",
): Promise<void> {
  await Promise.all([...new Set(pageNumbers)].map((p) => loadQcfPageFont(p, theme)));
}
