import type { IChapterMeta } from "_types/chapter";

export default function Chapter({ chapter }: { chapter: IChapterMeta }) {
  return (
    <a
      href={`/read/${chapter.id}`}
      className="flex h-32 cursor-pointer flex-col border border-(--sl-color-gray-5) bg-transparent text-center no-underline transition-colors duration-200 hover:border-(--sl-color-accent) hover:bg-(--sl-color-gray-6)/40"
    >
      <div className="flex flex-row justify-between px-2.5 pt-2 text-[11px] tabular-nums text-(--sl-color-gray-2)">
        <span>{chapter.id}</span>
        <span>{chapter.totalVerse}</span>
      </div>
      <span
        dir="rtl"
        className="font-surah-name mt-0.5 text-center text-4xl text-(--sl-color-accent-high) md:text-5xl"
      >
        {chapter.id.toString().padStart(3, "0")}
      </span>
      <h2 className="mt-auto flex flex-col justify-end gap-0.5 px-2 pb-2.5 text-(--sl-color-white)">
        <strong className="font-sans text-sm font-medium tracking-tight">
          {chapter.englishName}
        </strong>
        <span className="text-[11px] font-normal leading-snug text-(--sl-color-gray-2)">
          {chapter.englishNameTranslation}
        </span>
      </h2>
    </a>
  );
}
