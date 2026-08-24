// PROTOTYPE — Variant B: "Itemized rows with add/remove"
// Each enabled translation is its own row: language label on the left, text in the middle, an
// "x" to remove it on the right. A dashed "+ Add translation" row at the bottom opens a small
// picklist. Structurally different from Variant A: no persistent chip bar, the affordance to add
// is only visible when you're already looking at the stack, and removing is per-row not a toggle.
import { Component, For, Show, createSignal } from "solid-js";
import { useStore } from "@nanostores/solid";
import { getAllMockTranslations } from "./mockData";
import {
  enabledTranslationsAtom,
  setEnabledTranslations,
} from "./enabledTranslationsStore";

const VariantB: Component<{ verseNumber: number }> = () => {
  const enabled = useStore(enabledTranslationsAtom);
  const all = getAllMockTranslations();
  const [pickerOpen, setPickerOpen] = createSignal(false);

  const removeCode = (code: string) =>
    setEnabledTranslations(enabled().filter((c) => c !== code));

  const addCode = (code: string) => {
    setEnabledTranslations([...enabled(), code]);
    setPickerOpen(false);
  };

  const available = () => all.filter((t) => !enabled().includes(t.code));

  return (
    <div class="mt-2 max-w-2xl text-left" dir="ltr">
      <For each={all.filter((t) => enabled().includes(t.code))}>
        {(t) => (
          <div class="group flex items-start gap-2 border-t border-gray-100 py-1.5 first:border-t-0 dark:border-gray-800">
            <span class="w-24 shrink-0 text-xs font-medium text-gray-400 dark:text-slate-500">
              {t.language}
            </span>
            <p class="flex-1 text-sm text-gray-600 dark:text-slate-400">
              {t.text}
            </p>
            <button
              type="button"
              onClick={() => removeCode(t.code)}
              class="shrink-0 text-gray-300 opacity-0 transition-opacity hover:text-red-500 group-hover:opacity-100 dark:text-gray-600"
              aria-label={`Remove ${t.language}`}
            >
              ×
            </button>
          </div>
        )}
      </For>

      <Show
        when={pickerOpen()}
        fallback={
          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            class="mt-1 w-full rounded border border-dashed border-gray-300 py-1 text-xs text-gray-400 hover:border-gray-400 hover:text-gray-500 dark:border-gray-700 dark:text-gray-500"
          >
            + Add translation
          </button>
        }
      >
        <div class="mt-1 flex flex-wrap gap-1.5 rounded border border-gray-200 p-2 dark:border-gray-700">
          <For each={available()}>
            {(t) => (
              <button
                type="button"
                onClick={() => addCode(t.code)}
                class="rounded border border-gray-300 px-2 py-0.5 text-xs text-gray-600 hover:bg-gray-100 dark:border-gray-600 dark:text-slate-300 dark:hover:bg-gray-800"
              >
                {t.language}
              </button>
            )}
          </For>
          <Show when={available().length === 0}>
            <span class="text-xs text-gray-400">All translations added</span>
          </Show>
        </div>
      </Show>
    </div>
  );
};

export default VariantB;
