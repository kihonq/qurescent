// PROTOTYPE — Variant A: "Chip toggle bar"
// A row of language chips above the stack. Click a chip to show/hide that translation. All
// enabled translations render as stacked text blocks below the Arabic verse, in a fixed order.
import { Component, For } from "solid-js";
import { useStore } from "@nanostores/solid";
import { getAllMockTranslations } from "./mockData";
import {
  enabledTranslationsAtom,
  toggleTranslation,
} from "./enabledTranslationsStore";

const VariantA: Component<{ verseNumber: number }> = (props) => {
  const enabled = useStore(enabledTranslationsAtom);
  const all = getAllMockTranslations();

  return (
    <div class="mt-2 max-w-2xl text-left" dir="ltr">
      <div class="mb-2 flex flex-wrap gap-1.5">
        <For each={all}>
          {(t) => (
            <button
              type="button"
              onClick={() => toggleTranslation(t.code)}
              class={`rounded-full border px-2.5 py-0.5 text-xs transition-colors ${
                enabled().includes(t.code)
                  ? "border-amber-400 bg-amber-100 text-amber-900 dark:border-amber-300 dark:bg-amber-900/40 dark:text-amber-200"
                  : "border-gray-300 text-gray-500 hover:border-gray-400 dark:border-gray-600 dark:text-gray-400"
              }`}
            >
              {t.code.toUpperCase()}
            </button>
          )}
        </For>
      </div>
      <div class="space-y-1.5">
        <For each={all.filter((t) => enabled().includes(t.code))}>
          {(t) => (
            <p class="text-sm text-gray-600 dark:text-slate-400">
              <span class="mr-1 text-xs font-medium text-gray-400 dark:text-slate-500">
                {t.editionName}:
              </span>
              {t.text}
            </p>
          )}
        </For>
      </div>
    </div>
  );
};

export default VariantA;
