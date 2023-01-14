import type { Component } from "solid-js";

import type { IChapter } from "_types/chapter";

const Chapter: Component<{ chapter: IChapter }> = (props) => {
  return (
    <a
      href={`/chapter/${props.chapter.id}`}
      class="flex flex-col space-y-1 justify-center transition duration-150 dark:bg-container-300 dark:hover:bg-container-50 hover:bg-gray-100 bg-gray-200 w-36 h-36 rounded-md text-center"
    >
      <span
        dir="ltr"
        class="transition duration-150 dark:text-amber-300 text-slate-600 text-5xl font-surah-name"
      >
        {props.chapter.id.toString().padStart(3, "0")}
      </span>
      <h2 class="flex flex-col space-y-1 dark:text-slate-300 transition duration-150 justify-center">
        <strong>{props.chapter.englishName}</strong>
        <span class="text-xs">{props.chapter.englishNameTranslation}</span>
      </h2>
    </a>
  );
};

export default Chapter;
