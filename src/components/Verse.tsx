import { For, Show } from "solid-js";
import type { Component, JSX } from "solid-js";

import type { IChapterVerse } from "_types/chapter";
import { Tajweed, TAJWEED_META } from "_types/verse";
import { wordsSplitter } from "@helpers/verse";

const Verse: Component<{ verse: IChapterVerse }> = (props) => {
  let rawVerse = props.verse.text.replace(
    /(?<![\u0627\u0623\u0625\u0648])[\u0652](?![\u0627\u0623\u0625\u0648])/g,
    "\u06E1"
  );
  const tajweedRegex =
    /<tajweed class=(.*?)>(.*?)<\/tajweed>|<span class=(.*?)>(.*?)<\/span>/g;

  const matches = rawVerse.match(tajweedRegex) ?? [];
  const tuples: [index: number, element: JSX.Element][] = [];

  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];
    const isEnd = match.replace(tajweedRegex, "$3") === "end";
    const start = rawVerse.indexOf(match);
    if (isEnd) {
      tuples.push([
        start,
        <span class="text-slate-600 transition duration-150 dark:text-amber-300">
          {match.replace(tajweedRegex, "$4")}
        </span>,
      ]);
    } else {
      const tajweed = match.replace(tajweedRegex, "$1") as Tajweed;
      const meta = TAJWEED_META[tajweed];
      const chars = match.replace(tajweedRegex, "$2");

      if (chars.indexOf(" ") !== -1) {
        const charMatches = chars.match(/\S+|\s/g) ?? [];
        tuples.push([
          start,
          charMatches.map((charMatch) =>
            charMatch === " " ? (
              " "
            ) : (
              <span class={meta.class}>
                {charMatch.replace(/((?<=َ)ٲ|(?<!َ)ٲ)/g, "ٰ")}
              </span>
            )
          ),
        ]);
      } else {
        tuples.push([
          start,
          <span class={meta.class}>
            {chars.replace(/((?<=َ)ٲ|(?<!َ)ٲ)/g, "ٰ")}
          </span>,
        ]);
      }
    }
    rawVerse = rawVerse.replace(match, "");
  }

  const result: JSX.Element[] = [];

  let i = 0;
  for (const tuple of tuples) {
    const [start, element] = tuple;
    result.push(rawVerse.slice(i, start));
    result.push(element);
    i = start;
  }

  result.push(rawVerse.slice(i));

  const kalimat: JSX.Element[][] = wordsSplitter(result);

  return (
    <p class="flex flex-row flex-wrap">
      <For each={kalimat}>
        {(kalima, i) => {
          const word = props.verse.words.find((w) => w.position === i() + 1);

          return (
            <span class="group relative flex flex-col items-center">
              <span class="block whitespace-nowrap font-hafs-uthmanic text-4xl md:text-5xl">
                {kalima}
              </span>
              <span>
                <Show when={word} keyed>
                  {(notNull) =>
                    i() !== kalimat.length - 1 && [
                      <span dir="ltr" class="text-center text-xs ">
                        {notNull.translation.text}
                      </span>,
                      <span class="absolute left-1/2 m-4 mx-auto -translate-x-1/2 translate-y-5 whitespace-nowrap rounded-md bg-gray-800 px-1 text-sm text-gray-100 opacity-0 transition-opacity group-hover:opacity-100">
                        {notNull.transliteration.text}
                      </span>,
                    ]
                  }
                </Show>
              </span>
            </span>
          );
        }}
      </For>
    </p>
  );
};

export default Verse;
