import type { CSSProperties, ReactNode } from "react";
import { useStore } from "@nanostores/react";

import type { IVerse, IWord } from "_types/chapter";
import {
  qcfFontFamily,
  qcfFontPalette,
  type QcfTheme,
} from "@helpers/qcfFont";
import { useHydrated } from "@hooks/useHydrated";
import { coloredTajweedAtom, wordByWordAtom } from "@stores/readerPrefs";

const isWord = (w: IWord) => w.charType === "word";

/** Mushaf-style leading — QF / Quran.com reading view uses ~2.5 for Arabic. */
const ARABIC_LEADING =
  "text-4xl leading-[2.45] md:text-5xl md:leading-[2.5]";

type Props = {
  verse: IVerse;
  fontsReady: boolean;
  theme: QcfTheme;
};

function qcfStyle(
  pageNumber: number,
  fontsReady: boolean,
  theme: QcfTheme,
  showTajweed: boolean,
): CSSProperties | undefined {
  if (!fontsReady) return undefined;
  return {
    fontFamily: qcfFontFamily(pageNumber),
    fontPalette: qcfFontPalette(
      pageNumber,
      theme,
      showTajweed,
    ) as CSSProperties["fontPalette"],
  };
}

function WordGlyph({
  word,
  fontsReady,
  theme,
  showTajweed,
}: {
  word: IWord;
  fontsReady: boolean;
  theme: QcfTheme;
  showTajweed: boolean;
}) {
  const style = qcfStyle(word.pageNumber, fontsReady, theme, showTajweed);

  if (fontsReady) {
    return (
      <span
        className="whitespace-nowrap"
        style={style}
        dangerouslySetInnerHTML={{ __html: word.codeV2 }}
      />
    );
  }

  return (
    <span className="inline-block w-[1.25em]" aria-hidden="true">
      &nbsp;
    </span>
  );
}

/**
 * Ayah end mark — same QCF glyph/metrics as the last word (`code_v2`).
 * Always uses the *colored* theme palette: mono bases flatten numeral + casing
 * to one ink, so the digit disappears inside the ornament.
 */
function AyahMark({
  end,
  fontsReady,
  theme,
}: {
  end: IWord;
  fontsReady: boolean;
  theme: QcfTheme;
}) {
  const style = qcfStyle(end.pageNumber, fontsReady, theme, true);

  if (fontsReady) {
    return (
      <span
        className="shrink-0 whitespace-nowrap"
        style={style}
        dangerouslySetInnerHTML={{ __html: end.codeV2 }}
      />
    );
  }

  return (
    <span className="inline-block w-[1em] shrink-0" aria-hidden="true">
      &nbsp;
    </span>
  );
}

function WordColumn({
  word,
  fontsReady,
  theme,
  showTajweed,
  wbw,
  end,
}: {
  word: IWord;
  fontsReady: boolean;
  theme: QcfTheme;
  showTajweed: boolean;
  wbw: boolean;
  end?: IWord;
}) {
  return (
    <span className="inline-flex flex-col items-center px-0.5">
      {/* One Arabic line box: last word + end mark share metrics / vertical center */}
      <span
        className={`inline-flex flex-row flex-nowrap items-center gap-x-1 whitespace-nowrap ${ARABIC_LEADING}`}
      >
        <WordGlyph
          word={word}
          fontsReady={fontsReady}
          theme={theme}
          showTajweed={showTajweed}
        />
        {end ? (
          <AyahMark end={end} fontsReady={fontsReady} theme={theme} />
        ) : null}
      </span>
      {wbw && word.translation ? (
        <span
          dir="ltr"
          className="mt-1 text-center text-xs leading-snug text-(--sl-color-gray-2)"
        >
          {word.translation}
        </span>
      ) : null}
    </span>
  );
}

/** Presentational ayah row — fonts/theme owned by ChapterReader. */
export default function Verse({ verse, fontsReady, theme }: Props) {
  const hydrated = useHydrated();
  const showWbw = useStore(wordByWordAtom);
  const showTajweed = useStore(coloredTajweedAtom);
  const wbw = hydrated && showWbw;

  const words = verse.words;
  const contentWords = words.filter(isWord);
  const plainText = contentWords.map((w) => w.textUthmani).join(" ");
  const diacritizedText = contentWords
    .map((w) => w.textQpcHafs || w.textUthmani)
    .join(" ");

  const nodes: ReactNode[] = [];
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    if (!isWord(word)) continue;

    const end = words[i + 1]?.charType === "end" ? words[i + 1] : undefined;
    if (end) i += 1; // consume end so it never wraps alone

    nodes.push(
      <WordColumn
        key={`${word.position}-${i}`}
        word={word}
        fontsReady={fontsReady}
        theme={theme}
        showTajweed={showTajweed}
        wbw={wbw}
        end={end}
      />,
    );
  }

  return (
    <div className="mb-10" dir="rtl">
      <div className="sr-only" aria-label={`Ayah ${verse.number}`}>
        <div>{plainText}</div>
        <div>{diacritizedText}</div>
      </div>

      <p
        className="flex flex-row flex-wrap items-start justify-start gap-x-1.5 gap-y-6 md:gap-y-8"
        aria-hidden="true"
      >
        {nodes}
      </p>
    </div>
  );
}
