import type { IChapter, IChapterMeta } from "_types/chapter";

import chaptersMeta from "../data/chapters.json";

const chapterModules = import.meta.glob<{
  default: { id: number; verses: IChapter["verses"] };
}>("../data/chapters/*.json", { eager: true });

export const getChapters = (): IChapterMeta[] => chaptersMeta as IChapterMeta[];

export const getChapter = (chapterID: number): IChapter | undefined => {
  const meta = (chaptersMeta as IChapterMeta[]).find((c) => c.id === chapterID);
  if (!meta) return undefined;

  const mod = chapterModules[`../data/chapters/${chapterID}.json`];
  if (!mod) return undefined;

  return {
    ...meta,
    verses: mod.default.verses,
  };
};

/** @deprecated Use getChapters — kept so old call sites compile during the cutover. */
export const fetchChapters = async (): Promise<IChapterMeta[]> => getChapters();

/** @deprecated Use getChapter — kept so old call sites compile during the cutover. */
export const fetchChapter = async (
  chapterID: number,
): Promise<IChapter | undefined> => getChapter(chapterID);
