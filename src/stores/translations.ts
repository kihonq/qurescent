import { persistentAtom } from "@nanostores/persistent";
import type { ITranslationEdition } from "_types/chapter";
import catalog from "../data/translations/catalog.json";

const STORAGE_KEY = "qurescent.selectedTranslation";
const LEGACY_KEY = "qurescent.enabledTranslations";
/** Default: English. `null` = hide full-verse translation. */
const DEFAULT_CODE: string | null = "en";

/** One-shot migrate multi-select array → single code. */
function migrateLegacySelection(): void {
  if (typeof localStorage === "undefined") return;
  if (localStorage.getItem(STORAGE_KEY) !== null) return;
  try {
    const legacy = localStorage.getItem(LEGACY_KEY);
    if (legacy === null) return;
    const parsed = JSON.parse(legacy) as unknown;
    if (!Array.isArray(parsed)) return;
    let next: string | null = DEFAULT_CODE;
    if (parsed.length === 0) next = null;
    else if (parsed.includes("en")) next = "en";
    else {
      const first = parsed.find((c): c is string => typeof c === "string");
      next = first ?? null;
    }
    localStorage.setItem(STORAGE_KEY, next ?? "");
  } catch {
    /* ignore corrupt legacy */
  }
}

migrateLegacySelection();

export const translationCatalog = catalog as ITranslationEdition[];

export const selectedTranslationAtom = persistentAtom<string | null>(
  STORAGE_KEY,
  DEFAULT_CODE,
  {
    encode: (value) => value ?? "",
    decode: (value) => (value === "" || value === "null" ? null : value),
  },
);

export const setSelectedTranslation = (code: string | null) => {
  selectedTranslationAtom.set(code);
};

/** Exclusive select; click active code again to clear. */
export const selectTranslation = (code: string) => {
  const current = selectedTranslationAtom.get();
  setSelectedTranslation(current === code ? null : code);
};

/** @deprecated use selectedTranslationAtom */
export const enabledTranslationsAtom = selectedTranslationAtom;
