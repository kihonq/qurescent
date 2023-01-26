import { isServer } from "solid-js/web";
import type { IChapter } from "../types/chapter";

export const fetchChapter = async (
  chapterID: number
): Promise<IChapter | undefined> => {
  try {
    const tajweedURL = `https://api.quran.com/api/v4/quran/verses/uthmani_tajweed?chapter_number=${chapterID}`;
    const chapterURL = `https://api.quran.com/api/v4/chapters/${chapterID}?language=en`;
    const headers: Record<string, string> = isServer
      ? { "User-Agent": "chrome" }
      : {};
    const [chapterRes, tajweedRes] = await Promise.all(
      [chapterURL, tajweedURL].map((url) => fetch(url, { headers }))
    );
    const [parsedChapter, parsedTajweed] = await Promise.all(
      [chapterRes, tajweedRes].map((res) => res.json())
    );

    const {
      verses_count,
      name_simple,
      name_arabic,
      translated_name: { name: englishNameTranslation },
      ...chapter
    } = parsedChapter.chapter;

    return {
      totalVerse: verses_count,
      verses: await Promise.all(
        parsedTajweed.verses.map(
          async ({
            text_uthmani_tajweed,
            verse_key,
            id,
          }: {
            text_uthmani_tajweed: string;
            verse_key: `${number}:${number}`;
            id: number;
          }) => {
            const versesRes = await fetch(
              `https://api.quran.com/api/v4/verses/by_key/${verse_key}?language=en&words=true`,
              { headers }
            );
            const parsedVersed = await versesRes.json();

            return {
              id,
              text: text_uthmani_tajweed,
              numberInSurah: Number(verse_key.split(":")[1]),
              words: parsedVersed.verse.words,
            };
          }
        )
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
