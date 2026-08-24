// PROTOTYPE — Variant C: "Settings drawer"
// The verse view itself stays clean, showing only the currently-enabled translations stacked
// below the Arabic with no inline controls at all. A single small "Aa" affordance (meant to sit
// once near the page header, not per-verse) opens a slide-down drawer listing every available
// translation as a checkbox. Structurally different from A/B: no per-verse chrome whatsoever,
// management is fully separated from reading.
import { Component, For, Show, createSignal } from "solid-js";
import { useStore } from "@nanostores/solid";
import { getAllMockTranslations } from "./mockData";
import {
  enabledTranslationsAtom,
  toggleTranslation,
} from "./enabledTranslationsStore";

export const TranslationSettingsDrawer: Component = () => {
  const enabled = useStore(enabledTranslationsAtom);
  const all = getAllMockTranslations();
  const [open, setOpen] = createSignal(false);

  return (
    <div class="relative" dir="ltr">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        class="rounded-full border border-gray-300 px-2.5 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 dark:border-gray-600 dark:text-slate-300 dark:hover:bg-gray-800"
      >
        Aa Translations
      </button>
      <Show when={open()}>
        <div class="absolute right-0 z-10 mt-2 w-56 rounded-lg border border-gray-200 bg-white p-2 shadow-lg dark:border-gray-700 dark:bg-container-300">
          <For each={all}>
            {(t) => (
              <label class="flex items-center gap-2 rounded px-1.5 py-1 text-sm hover:bg-gray-50 dark:hover:bg-gray-800">
                <input
                  type="checkbox"
                  checked={enabled().includes(t.code)}
                  onChange={() => toggleTranslation(t.code)}
                />
                <span class="text-gray-700 dark:text-slate-300">
                  {t.language}
                </span>
                <span class="ml-auto text-xs text-gray-400">{t.code}</span>
              </label>
            )}
          </For>
        </div>
      </Show>
    </div>
  );
};

const VariantC: Component<{ verseNumber: number }> = () => {
  const enabled = useStore(enabledTranslationsAtom);
  const all = getAllMockTranslations();

  return (
    <div class="mt-2 max-w-2xl space-y-1.5 text-left" dir="ltr">
      <For each={all.filter((t) => enabled().includes(t.code))}>
        {(t) => (
          <p class="text-sm text-gray-600 dark:text-slate-400">{t.text}</p>
        )}
      </For>
    </div>
  );
};

export default VariantC;
