import { For, Show, createSignal } from "solid-js";
import type { Component } from "solid-js";
import { useStore } from "@nanostores/solid";

import {
  enabledTranslationsAtom,
  toggleTranslation,
  translationCatalog,
} from "@stores/translations";

/**
 * Settings-drawer pattern (wayfinder #8 Variant C): verse view stays bare;
 * a header trigger opens the checkbox drawer for which translations are shown.
 */
export const TranslationSettingsDrawer: Component = () => {
  const enabled = useStore(enabledTranslationsAtom);
  const [open, setOpen] = createSignal(false);

  return (
    <div class="relative" dir="ltr">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        class="rounded-full border border-gray-300 px-2.5 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 dark:border-gray-600 dark:text-slate-300 dark:hover:bg-gray-800"
        aria-expanded={open()}
        aria-haspopup="true"
      >
        Aa Translations
      </button>
      <Show when={open()}>
        <div class="absolute right-0 z-20 mt-2 w-56 rounded-lg border border-gray-200 bg-white p-2 shadow-lg dark:border-gray-700 dark:bg-container-300">
          <For each={translationCatalog}>
            {(t) => (
              <label class="flex cursor-pointer items-center gap-2 rounded px-1.5 py-1 text-sm hover:bg-gray-50 dark:hover:bg-gray-800">
                <input
                  type="checkbox"
                  checked={enabled().includes(t.code)}
                  onChange={() => toggleTranslation(t.code)}
                />
                <span class="text-gray-700 dark:text-slate-300">{t.language}</span>
                <span class="ml-auto text-xs text-gray-400">{t.code}</span>
              </label>
            )}
          </For>
        </div>
      </Show>
    </div>
  );
};

/** Per-verse texts keyed by edition id (e.g. `en.sahih`). */
export type VerseTranslations = Record<string, string>;

const TranslationStack: Component<{
  translations: VerseTranslations;
}> = (props) => {
  const enabled = useStore(enabledTranslationsAtom);

  return (
    <div class="mt-1 mb-4 max-w-2xl space-y-1.5 text-left" dir="ltr">
      <For each={translationCatalog.filter((t) => enabled().includes(t.code))}>
        {(t) => {
          const text = () => props.translations[t.id] ?? "";
          return (
            <Show when={text()}>
              <p class="text-sm text-gray-600 dark:text-slate-400">
                <span class="mr-1 text-xs font-medium text-gray-400 dark:text-slate-500">
                  {t.editionName}:
                </span>
                {text()}
              </p>
            </Show>
          );
        }}
      </For>
    </div>
  );
};

export default TranslationStack;
