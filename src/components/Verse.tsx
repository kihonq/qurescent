import { For, Show, createSignal, onMount } from "solid-js";
import type { Component } from "solid-js";

import type { IVerse, IWord } from "_types/chapter";
import { loadQcfPageFonts, qcfFontFamily, type QcfTheme } from "@helpers/qcfFont";
import { Theme, themeAtom } from "@stores/theme";
import { useStore } from "@nanostores/solid";

const isWord = (w: IWord) => w.charType === "word";

const Verse: Component<{ verse: IVerse }> = (props) => {
  const theme = useStore(themeAtom);
  const [fontsReady, setFontsReady] = createSignal(false);
  const [copied, setCopied] = createSignal(false);

  const words = () => props.verse.words;
  const contentWords = () => words().filter(isWord);
  const pageNumbers = () => words().map((w) => w.pageNumber);

  const plainText = () =>
    contentWords()
      .map((w) => w.textUthmani)
      .join(" ");

  const diacritizedText = () =>
    contentWords()
      .map((w) => w.textQpcHafs || w.textUthmani)
      .join(" ");

  const qcfTheme = (): QcfTheme =>
    theme() === Theme.Dark ? "dark" : "light";

  onMount(() => {
    void loadQcfPageFonts(pageNumbers(), qcfTheme()).then(() =>
      setFontsReady(true),
    );
  });

  const copyVerse = async () => {
    const text = `${diacritizedText()} (${props.verse.key})`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard may be denied; ignore.
    }
  };

  return (
    <div class="mb-6" dir="rtl">
      {/* Screen-reader / SEO / copy source — real Unicode Arabic */}
      <div class="sr-only" aria-label={`Ayah ${props.verse.number}`}>
        <div>{plainText()}</div>
        <div>{diacritizedText()}</div>
      </div>

      <p
        class="flex flex-row flex-wrap items-end justify-start gap-x-1"
        aria-hidden="true"
      >
        <For each={words()}>
          {(word) => {
            if (word.charType === "end") {
              return (
                <span class="mx-1 inline-flex flex-col items-center font-hafs-uthmanic text-2xl text-amber-600 dark:text-amber-300 md:text-3xl">
                  {word.textQpcHafs || word.textUthmani || "۝"}
                </span>
              );
            }

            if (!isWord(word)) return null;

            return (
              <span class="group relative flex flex-col items-center px-0.5">
                <span
                  class="block whitespace-nowrap text-4xl leading-relaxed md:text-5xl"
                  style={
                    fontsReady()
                      ? { "font-family": qcfFontFamily(word.pageNumber) }
                      : undefined
                  }
                  classList={{
                    "font-hafs-uthmanic opacity-70": !fontsReady(),
                  }}
                  // Glyph codes must be set as HTML (QF docs); Solid's text
                  // children go through textContent. Use innerHTML via prop.
                  // eslint-disable-next-line solid/no-innerhtml
                  innerHTML={
                    fontsReady()
                      ? word.codeV2
                      : word.textQpcHafs || word.textUthmani
                  }
                />
                <Show when={word.translation}>
                  <span
                    dir="ltr"
                    class="mt-0.5 text-center text-xs text-gray-500 dark:text-slate-400"
                  >
                    {word.translation}
                  </span>
                </Show>
                <Show when={word.transliteration}>
                  <span class="pointer-events-none absolute left-1/2 top-full z-10 mt-1 -translate-x-1/2 whitespace-nowrap rounded-md bg-gray-800 px-1.5 py-0.5 text-xs text-gray-100 opacity-0 transition-opacity group-hover:opacity-100">
                    {word.transliteration}
                  </span>
                </Show>
              </span>
            );
          }}
        </For>
      </p>

      <div class="mt-1 flex justify-end" dir="ltr">
        <button
          type="button"
          onClick={copyVerse}
          class="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-slate-300"
          aria-label={`Copy ayah ${props.verse.key}`}
        >
          {copied() ? "Copied" : "Copy"}
        </button>
      </div>
    </div>
  );
};

export default Verse;
