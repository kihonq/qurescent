import { Component, For, JSX, Show } from "solid-js";

import type { IChapterVerse } from "_types/chapter";
import { mapVerse } from "@helpers/verse";
{
  /* <tajweed class=madda_obligatory><tajweed class=slnt>و</tajweed>ٲٓاْ</tajweed> */
}
const Verse: Component<{ verse: IChapterVerse }> = (props) => {
  const kalimat: JSX.Element[][] = mapVerse(props.verse.text);
  const startWithDivider = kalimat[0].includes("۞");

  return (
    <p class="flex flex-row flex-wrap">
      <For each={kalimat}>
        {(kalima, i) => {
          const isDivider = () => kalima.includes("۞");
          const wordIndex = () => i() + (startWithDivider ? -1 : 0);
          const word = () => props.verse.words[wordIndex()];

          return (
            <span class="group relative flex flex-col items-center">
              <span class="block whitespace-nowrap font-hafs-uthmanic text-4xl md:text-5xl">
                {kalima}
              </span>
              <span>
                <Show when={word()} keyed>
                  {(notNull) =>
                    i() !== kalimat.length - 1 &&
                    !isDivider() && [
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
