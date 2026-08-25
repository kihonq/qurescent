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
        class="cursor-pointer rounded-full border border-(--sl-color-gray-5) px-2.5 py-1 text-xs font-medium text-(--sl-color-white) transition-colors duration-200 hover:border-(--sl-color-accent) hover:bg-(--sl-color-gray-6)"
        aria-expanded={open()}
        aria-haspopup="dialog"
        aria-controls="translation-settings"
      >
        Aa Translations
      </button>
      <Show when={open()}>
        <div
          id="translation-settings"
          role="dialog"
          aria-label="Enabled translations"
          class="absolute right-0 z-20 mt-2 w-56 rounded-lg border border-(--sl-color-gray-5) bg-(--sl-color-gray-6) p-2 shadow-lg"
        >
          <For each={translationCatalog}>
            {(t) => (
              <label class="flex cursor-pointer items-center gap-2 rounded px-1.5 py-1 text-sm text-(--sl-color-white) transition-colors duration-200 hover:bg-(--sl-color-gray-5)">
                <input
                  type="checkbox"
                  checked={enabled().includes(t.code)}
                  onChange={() => toggleTranslation(t.code)}
                />
                <span>{t.language}</span>
                <span class="ml-auto text-xs text-(--sl-color-gray-2)">
                  {t.code}
                </span>
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
              <p class="text-sm leading-relaxed text-(--sl-color-gray-1)">
                <span class="mr-1 text-xs font-medium text-(--sl-color-gray-2)">
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
