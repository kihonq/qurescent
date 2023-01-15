import type { Component, JSX } from "solid-js";
import type { IChapterVerse } from "_types/chapter";
import { Tajweed, TAJWEED_META } from "_types/verse";

const Verse: Component<{ verse: IChapterVerse }> = (props) => {
  let rawVerse = props.verse.text.replace(
    /(?<![\u0627\u0623\u0625\u0648])[\u0652](?![\u0627\u0623\u0625\u0648])/g,
    "\u06E1"
  );
  const tajweedRegex =
    /<tajweed class=(.*?)>(.*?)<\/tajweed>|<span class=(.*?)>(.*?)<\/span>/g;

  const matches = rawVerse.match(tajweedRegex);
  const tuples: [index: number, element: JSX.Element][] = (matches ?? []).map(
    (match) => {
      const tajweed = match.replace(tajweedRegex, "$1") as Tajweed;
      const meta = TAJWEED_META[tajweed];
      const isEnd = match.replace(tajweedRegex, "$3") === "end";
      const className = isEnd
        ? "transition duration-150 dark:text-amber-300 text-slate-600"
        : meta.class;
      const start = rawVerse.indexOf(match);
      const char = isEnd
        ? match.replace(tajweedRegex, "$4")
        : match.replace(tajweedRegex, "$2").replace(/((?<=َ)ٲ|(?<!َ)ٲ)/g, "ٰ");
      rawVerse = rawVerse.replace(match, "");

      return [start ?? 0, <span class={className}>{char}</span>];
    }
  );

  const result = [];

  let i = 0;
  for (const tup of tuples) {
    const [start, element] = tup;
    result.push(rawVerse.slice(i, start));
    result.push(element);
    i = start;
  }

  result.push(rawVerse.slice(i));

  return (
    <div>
      <p class="text-4xl font-thin leading-normal font-hafs-uthmanic">
        {result}
      </p>
    </div>
  );
};

// ٱلصَّلَوٰةذَٰلِكَ
export default Verse;
