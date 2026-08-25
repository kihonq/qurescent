import type { Component } from "solid-js";

import type { IChapterMeta } from "_types/chapter";

const Chapter: Component<{ chapter: IChapterMeta }> = (props) => {
  return (
    <a
      href={`/read/${props.chapter.id}`}
      class="flex h-36 flex-col rounded-lg border border-(--sl-color-gray-5) bg-(--sl-color-gray-6) text-center no-underline transition hover:border-(--sl-color-accent) hover:bg-(--sl-color-gray-5)"
    >
      <div class="flex flex-row justify-between p-2 text-xs text-(--sl-color-gray-3)">
        <span>{props.chapter.id}</span>
        <span>{props.chapter.totalVerse}</span>
      </div>
      <span
        dir="rtl"
        class="font-surah-name text-center text-5xl text-(--sl-color-accent-high)"
      >
        {props.chapter.id.toString().padStart(3, "0")}
      </span>
      <h2 class="flex flex-col justify-center space-y-1 text-(--sl-color-white)">
        <strong class="font-sans text-sm">{props.chapter.englishName}</strong>
        <span class="text-xs font-normal text-(--sl-color-gray-3)">
          {props.chapter.englishNameTranslation}
        </span>
      </h2>
    </a>
  );
};

export default Chapter;
