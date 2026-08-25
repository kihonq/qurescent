import { atom } from "nanostores";
import type { ITranslationEdition } from "_types/chapter";
import catalog from "../data/translations/catalog.json";

const STORAGE_KEY = "qurescent.enabledTranslations";
const DEFAULT_CODES = ["en", "ms"];

const readInitial = (): string[] => {
  if (typeof localStorage === "undefined") return DEFAULT_CODES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_CODES;
    const parsed = JSON.parse(raw) as string[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_CODES;
  } catch {
    return DEFAULT_CODES;
  }
};

export const translationCatalog = catalog as ITranslationEdition[];

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
  // Keep at least one translation enabled.
  if (next.length === 0) return;
  setEnabledTranslations(next);
};
