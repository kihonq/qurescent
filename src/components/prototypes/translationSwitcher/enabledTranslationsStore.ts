// PROTOTYPE — throwaway. Mirrors the existing `src/stores/theme.ts` nanostores convention to
// answer ticket #8's Q3 (site-wide preference, not per-verse): the enabled translation codes are
// stored once and shared across every verse/surah on the page.
import { atom } from "nanostores";
import { DEFAULT_ENABLED_CODES } from "./mockData";

const STORAGE_KEY = "qurescent.prototype.enabledTranslations";

const readInitial = (): string[] => {
  if (typeof localStorage === "undefined") return DEFAULT_ENABLED_CODES;
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : DEFAULT_ENABLED_CODES;
};

export const enabledTranslationsAtom = atom<string[]>(readInitial());

export const setEnabledTranslations = (codes: string[]) => {
  enabledTranslationsAtom.set(codes);
  if (typeof localStorage !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(codes));
  }
};

export const toggleTranslation = (code: string) => {
  const current = enabledTranslationsAtom.get();
  const next = current.includes(code)
    ? current.filter((c) => c !== code)
    : [...current, code];
  setEnabledTranslations(next);
};
