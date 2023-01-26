import type { Component } from "solid-js";

import type { IChapter } from "_types/chapter";

const Chapter: Component<{ chapter: IChapter }> = (props) => {
  return (
    <a
      href={`/chapter/${props.chapter.id}`}
      class="flex h-36 w-36 flex-col rounded-md bg-gray-200 text-center transition duration-150 hover:bg-gray-100 dark:bg-container-300 dark:hover:bg-container-50"
    >
      <div class="flex flex-row justify-between p-2 text-xs dark:text-slate-500">
        <span>{props.chapter.id}</span>
        <span>{props.chapter.totalVerse}</span>
      </div>
      <span
        dir="rtl"
        class="text-center font-surah-name text-5xl text-slate-600 transition duration-150 dark:text-amber-300"
      >
        {props.chapter.id.toString().padStart(3, "0")}
      </span>
      <h2 class="flex flex-col justify-center space-y-1 transition duration-150 dark:text-slate-300">
        <strong>{props.chapter.englishName}</strong>
        <span class="text-xs">{props.chapter.englishNameTranslation}</span>
      </h2>
    </a>
  );
};

export default Chapter;
