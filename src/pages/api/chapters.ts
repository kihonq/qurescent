import type { APIRoute } from "astro";
import { isServer } from "solid-js/web";
import type { IChapter } from "_types/chapter";

export const get: APIRoute = async () => {
  const headers: Record<string, string> = isServer
    ? { "User-Agent": "chrome" }
    : {};

  const chapterRes = await fetch("https://api.alquran.cloud/v1/surah", {
    headers,
  });
  const chapterRaw = await chapterRes.text();

  const parsed = JSON.parse(chapterRaw);

  return {
    body: JSON.stringify(
      parsed.data.map(
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
      )
    ),
  };
};
