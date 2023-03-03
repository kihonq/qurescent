import type { JSX } from "solid-js";

import { type Tajweed, TAJWEED_META } from "_types/verse";

const shaddaRegex =
  /(?<![\u0627\u0623\u0625\u0648])[\u0652](?![\u0627\u0623\u0625\u0648])/g;
export const sukunRegex = /[\u064C\u064D\u064E\u064F\u0650\u0651\u0652]\u0652/g;
const tajweedRegex =
  /<tajweed class=(.*?)>(((?:(?!<\/tajweed>)[\s\S])|(?R))*)<\/tajweed>|<span class=(.*?)>(.*?)<\/span>/g;

const wordsSplitter = (
  sentence: (JSX.Element | JSX.Element[])[],
  acc: JSX.Element[][] = []
) => {
  let isContinue = true;

  sentence.forEach((el) => {
    if (typeof el === "string") {
      const [firstChunk, ...chunks] = el.split(" ");
      if (firstChunk) {
        if (acc[acc.length - 1]?.length && isContinue) {
          acc[acc.length - 1].push(firstChunk);
        } else {
          acc.push([firstChunk]);
        }
      }

      const isUntrimmed = chunks.length && !chunks[chunks.length - 1];

      (isUntrimmed ? chunks.slice(0, -1) : chunks).forEach((word) =>
        acc.push([word])
      );

      isContinue = !isUntrimmed;
    } else if (Array.isArray(el)) {
      wordsSplitter(el, acc);
    } else {
      if (acc[acc.length - 1]?.length && isContinue) {
        acc[acc.length - 1].push(el);
      } else {
        acc.push([el]);
      }
      isContinue = true;
    }
  });

  return acc;
};

const replaceDiacritics = (text: string) =>
  text.replace(
    /((?<=[\u0627\u0623\u0625\u0648])|(?<![\u0627\u0623\u0625\u0648]))[\u0652]((?=[\u0627\u0623\u0625\u0648])|(?![\u0627\u0623\u0625\u0648]))|[\u064C\u064D\u064E\u064F\u0650\u0651\u0652]\u0652|ا۟|((?<=َ)ٲ|(?<!َ)ٲ)/g,
    (match) => {
      if (match === "\u0652") {
        return "\u06E1";
      } else if (match === "ا۟") {
        return "اْ";
      } else if (match === "ٲ") {
        return "ٰ";
      } else if (
        match === "\u064C\u0652" ||
        match === "\u064D\u0652" ||
        match === "\u064E\u0652" ||
        match === "\u064F\u0652" ||
        match === "\u0650\u0652" ||
        match === "\u0651\u0652"
      ) {
        return "\u064B";
      }
      return match;
    }
  );

export const generateTuples = (
  text: string,
  tuples: [index: number, element: JSX.Element][] = []
) => {
  let rawVerse = text;

  const matches = rawVerse.match(tajweedRegex) ?? [];

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

      if (chars.indexOf("tajweed") !== -1) {
        console.log({ match, chars });

        generateTuples(chars);
      } else if (chars.indexOf(" ") !== -1) {
        const charMatches = chars.match(/\S+|\s/g) ?? [];
        tuples.push([
          start,
          charMatches.map((charMatch) =>
            charMatch === " " ? (
              " "
            ) : (
              <span class={meta.class}>{charMatch}</span>
            )
          ),
        ]);
      } else {
        tuples.push([start, <span class={meta.class}>{chars}</span>]);
      }
    }
    rawVerse = rawVerse.replace(match, "");
  }

  return { rawVerse, tuples };
};

export const mapVerse = (text: string) => {
  const { rawVerse, tuples } = generateTuples(
    replaceDiacritics(
      "يَ<tajweed class=madda_obligatory>ـٰٓ</tajweed>أَيُّهَا <tajweed class=ham_wasl>ٱ</tajweed>لَّذِينَ ءَامَنُو<tajweed class=slnt>اْ</tajweed> <tajweed class=ham_wasl>ٱ</tajweed>تَّقُو<tajweed class=slnt>اْ</tajweed> <tajweed class=ham_wasl>ٱ</tajweed>للَّهَ وَذَرُو<tajweed class=slnt>اْ</tajweed> مَا بَقِىَ مِنَ <tajweed class=ham_wasl>ٱ</tajweed><tajweed class=laam_shamsiyah>ل</tajweed>رِّبَ<tajweed class=madda_obligatory><tajweed class=slnt>و</tajweed>ٲٓاْ</tajweed> إِ<tajweed class=ikhafa>ن ك</tajweed>ُ<tajweed class=ikhafa>نت</tajweed><tajweed class=idgham_shafawi>ُم م</tajweed>ُّؤْمِن<tajweed class=madda_permissible>ِي</tajweed>نَ <span class=end>٢٧٨</span>"
    )
  );
  const result: JSX.Element[] = [];

  let i = 0;
  for (const tuple of tuples) {
    const [start, element] = tuple;
    result.push(rawVerse.slice(i, start));
    result.push(element);
    i = start;
  }

  result.push(rawVerse.slice(i));

  return wordsSplitter(result);
};
