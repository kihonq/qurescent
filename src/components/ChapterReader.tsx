import { useEffect, useMemo, useRef, useState } from "react";

import type { IChapter } from "_types/chapter";
import {
  loadQcfPageFonts,
  resolveQcfTheme,
  type QcfTheme,
} from "@helpers/qcfFont";
import Verse from "@components/Verse";
import MushafLoader from "@components/MushafLoader";
import TranslationStack, {
  ReaderControls,
  type VerseTranslations,
} from "@components/TranslationStack";

type Props = {
  chapter: IChapter;
  /** Full-verse translations keyed by verse key (`1:1`). */
  translationsByVerse: Record<string, VerseTranslations>;
};

/**
 * Single client island for a surah: settings, font load, verses, translations.
 */
export default function ChapterReader({
  chapter,
  translationsByVerse,
}: Props) {
  const [fontsReady, setFontsReady] = useState(false);
  const [theme, setTheme] = useState<QcfTheme>("light");
  const [compact, setCompact] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const pageNumbers = useMemo(() => {
    const pages = new Set<number>();
    for (const verse of chapter.verses) {
      for (const word of verse.words) pages.add(word.pageNumber);
    }
    return [...pages];
  }, [chapter.verses]);

  useEffect(() => {
    setTheme(resolveQcfTheme());

    const syncTheme = () => setTheme(resolveQcfTheme());
    const obs = new MutationObserver(syncTheme);
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onMq = () => {
      if (document.documentElement.getAttribute("data-theme") === "auto") {
        syncTheme();
      }
    };
    mq.addEventListener("change", onMq);

    return () => {
      obs.disconnect();
      mq.removeEventListener("change", onMq);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    setFontsReady(false);
    void loadQcfPageFonts(pageNumbers).then(() => {
      if (!cancelled) setFontsReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, [pageNumbers]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => setCompact(!entry.isIntersecting),
      { threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const loaderLines = Math.min(8, Math.max(4, chapter.verses.length));
  const surahCode = chapter.id.toString().padStart(3, "0");

  return (
    <div className="quran-reader not-content" dir="ltr">
      {/* Leaves viewport first → header goes compact (English fades). */}
      <div ref={sentinelRef} className="h-px w-full" aria-hidden="true" />

      <header
        className={[
          "sticky z-20 mb-8 border-b border-(--sl-color-gray-5) transition-[padding,background-color] duration-300",
          "top-(--sl-nav-height,3.5rem)",
          compact
            ? "bg-(--sl-color-bg)/90 py-2.5 backdrop-blur-md"
            : "bg-transparent py-3",
        ].join(" ")}
      >
        <div className="relative flex items-center justify-between gap-3">
          <p
            className={[
              "font-surah-name shrink-0 leading-none text-(--sl-color-white) transition-[font-size] duration-300",
              compact ? "text-3xl" : "text-4xl",
            ].join(" ")}
            aria-hidden="true"
          >
            {surahCode}
          </p>

          <div
            className={[
              "pointer-events-none absolute inset-x-12 flex flex-col items-center justify-center text-center transition-opacity duration-300 sm:inset-x-16",
              compact ? "opacity-0" : "opacity-100",
            ].join(" ")}
            aria-hidden={compact}
          >
            <p className="font-serif text-lg leading-tight font-semibold tracking-tight text-(--sl-color-white) sm:text-xl">
              {chapter.englishName}
            </p>
            <p className="mt-0.5 text-[11px] tracking-wide text-(--sl-color-gray-2)">
              {chapter.englishNameTranslation}
              <span className="mx-1.5 text-(--sl-color-gray-4)">·</span>
              <span className="tabular-nums">{chapter.totalVerse} ayahs</span>
            </p>
          </div>

          <span className="sr-only">
            Surah {chapter.englishName}, {chapter.englishNameTranslation},{" "}
            {chapter.totalVerse} ayahs
          </span>

          <ReaderControls />
        </div>
      </header>

      {chapter.id !== 1 ? (
        <div className="mb-8 flex justify-center">
          <p className="font-hafs-uthmanic text-4xl text-(--sl-color-white)">
            ﷽
          </p>
        </div>
      ) : null}

      <div className="relative min-h-48">
        {!fontsReady ? <MushafLoader lines={loaderLines} /> : null}

        <article
          dir="rtl"
          className={[
            "space-y-2 transition-opacity duration-300",
            fontsReady
              ? "relative opacity-100"
              : "pointer-events-none absolute inset-x-0 top-0 opacity-0",
          ].join(" ")}
          aria-busy={!fontsReady}
          aria-hidden={!fontsReady}
        >
          {chapter.verses.map((verse) => (
            <div key={verse.key}>
              <Verse verse={verse} fontsReady={fontsReady} theme={theme} />
              <TranslationStack
                translations={translationsByVerse[verse.key] ?? {}}
              />
            </div>
          ))}
        </article>
      </div>
    </div>
  );
}
