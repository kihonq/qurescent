import type { ITranslationEdition } from "_types/chapter";
import catalog from "../data/translations/catalog.json";

const translationModules = import.meta.glob<{ default: Record<string, string> }>(
  "../data/translations/*.json",
  { eager: true },
);

export const getTranslationCatalog = (): ITranslationEdition[] =>
  catalog as ITranslationEdition[];

/** All edition texts keyed by edition id, then by verse key (`1:1`). */
export const getAllTranslationMaps = (): Record<
  string,
  Record<string, string>
> => {
  const out: Record<string, Record<string, string>> = {};
  for (const edition of catalog as ITranslationEdition[]) {
    const mod = translationModules[`../data/translations/${edition.id}.json`];
    if (mod) out[edition.id] = mod.default;
  }
  return out;
};
