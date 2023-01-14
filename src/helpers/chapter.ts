import { isServer } from "solid-js/web";
import type { IChapter } from "../types/chapter";

export const fetchChapter = async (
  chapterID: number
): Promise<IChapter | undefined> => {
  try {
    const versesUrl = `https://api.quran.com/api/v4/quran/verses/uthmani_tajweed?chapter_number=${chapterID}`;
    const chapterURL = `https://api.quran.com/api/v4/chapters/${chapterID}?language=en`;

    const headers: Record<string, string> = isServer
      ? { "User-Agent": "chrome" }
      : {};

    const chapterRes = await fetch(chapterURL, { headers });
    const versesRes = await fetch(versesUrl, { headers });
    const chapterRaw = await chapterRes.text();
    const versesRaw = await versesRes.text();

    const parsedChapter = JSON.parse(chapterRaw);
    const parsedVerses = JSON.parse(versesRaw);

    const {
      verses_count,
      name_simple,
      name_arabic,
      translated_name: { name: englishNameTranslation },
      ...chapter
    } = parsedChapter.chapter;
    const { verses } = parsedVerses;

    return {
      totalVerse: verses_count,
      verses: verses.map(
        ({
          text_uthmani_tajweed,
          id,
        }: {
          text_uthmani_tajweed: string;
          verse_key: `${number}:${number}`;
          id: number;
        }) => ({
          id,
          text: text_uthmani_tajweed,
        })
      ),
      name: name_arabic,
      englishName: name_simple,
      englishNameTranslation,
      ...chapter,
    };
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

export const fetchChapters = async (): Promise<IChapter[]> => {
  try {
    const headers: Record<string, string> = isServer
      ? { "User-Agent": "chrome" }
      : {};

    const chapterRes = await fetch("https://api.alquran.cloud/v1/surah", {
      headers,
    });
    const chapterRaw = await chapterRes.text();

    const parsed = JSON.parse(chapterRaw);

    return parsed.data.map(
      ({
        number,
        numberOfAyahs,
        ...chapter
      }: Partial<IChapter> & {
        number: number;
        numberOfAyahs: number;
      }) => ({
        id: number,
        totalVerse: numberOfAyahs,
        ...chapter,
      })
    );
  } catch (error) {
    console.error(error);
    return [];
  }
};
