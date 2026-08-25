import { useEffect, useRef, useState } from "react";
import { useStore } from "@nanostores/react";

import {
  selectTranslation,
  selectedTranslationAtom,
  translationCatalog,
} from "@stores/translations";
import {
  coloredTajweedAtom,
  setColoredTajweed,
  setWordByWord,
  wordByWordAtom,
} from "@stores/readerPrefs";
import { useHydrated } from "@hooks/useHydrated";

function Switch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={[
        "relative h-5 w-9 shrink-0 cursor-pointer rounded-full border transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--sl-color-accent)",
        checked
          ? "border-(--sl-color-accent) bg-(--sl-color-accent)"
          : "border-(--sl-color-gray-4) bg-(--sl-color-gray-5)",
      ].join(" ")}
    >
      <span
        className={[
          "absolute top-0.5 left-0.5 block h-3.5 w-3.5 rounded-full bg-white transition-transform duration-200",
          checked ? "translate-x-4" : "translate-x-0",
        ].join(" ")}
      />
    </button>
  );
}

function SettingsIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

/** Single settings control — word-by-word, colored tajweed, one translation. */
export function ReaderControls() {
  const selected = useStore(selectedTranslationAtom);
  const wbw = useStore(wordByWordAtom);
  const tajweed = useStore(coloredTajweedAtom);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!open) return;
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="relative shrink-0" dir="ltr" ref={rootRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={[
          "inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border bg-transparent text-(--sl-color-gray-1) transition-colors duration-200 hover:border-(--sl-color-accent) hover:text-(--sl-color-white) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--sl-color-accent)",
          open
            ? "border-(--sl-color-accent) text-(--sl-color-white)"
            : "border-(--sl-color-gray-5)",
        ].join(" ")}
        aria-label="Settings"
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-controls="reader-settings"
      >
        <SettingsIcon />
      </button>
      {open ? (
        <div
          id="reader-settings"
          role="dialog"
          aria-label="Reader settings"
          className="absolute right-0 z-30 mt-2 w-64 rounded border border-(--sl-color-gray-5) bg-(--sl-color-bg) p-3 shadow-lg"
        >
          <div className="space-y-3">
            <label className="flex cursor-pointer items-center justify-between gap-3 text-sm text-(--sl-color-white)">
              <span>Word-by-word</span>
              <Switch
                label="Word-by-word"
                checked={wbw}
                onChange={setWordByWord}
              />
            </label>
            <label className="flex cursor-pointer items-center justify-between gap-3 text-sm text-(--sl-color-white)">
              <span>Colored tajweed</span>
              <Switch
                label="Colored tajweed"
                checked={tajweed}
                onChange={setColoredTajweed}
              />
            </label>
            <div>
              <p className="mb-1.5 text-sm text-(--sl-color-white)">
                Translation
              </p>
              <div
                className="flex gap-1.5"
                role="group"
                aria-label="Translation language"
              >
                {translationCatalog.map((t) => {
                  const on = selected === t.code;
                  return (
                    <button
                      key={t.code}
                      type="button"
                      className={[
                        "min-w-11 cursor-pointer rounded border px-2.5 py-1 text-xs font-medium uppercase tracking-wide transition-colors duration-200",
                        on
                          ? "border-(--sl-color-accent) bg-(--sl-color-accent-low) text-(--sl-color-white)"
                          : "border-(--sl-color-gray-5) bg-transparent text-(--sl-color-gray-1) hover:border-(--sl-color-accent)",
                      ].join(" ")}
                      aria-pressed={on}
                      onClick={() => selectTranslation(t.code)}
                    >
                      {t.code}
                    </button>
                  );
                })}
              </div>
              <p className="mt-1.5 text-[11px] leading-snug text-(--sl-color-gray-2)">
                One language at a time. Tap again to hide.
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

/** @deprecated use ReaderControls */
export const TranslationSettingsDrawer = ReaderControls;

/** Per-verse texts keyed by edition id (e.g. `en.sahih`). */
export type VerseTranslations = Record<string, string>;

export default function TranslationStack({
  translations,
}: {
  translations: VerseTranslations;
}) {
  const hydrated = useHydrated();
  const selected = useStore(selectedTranslationAtom);
  if (!hydrated) return null;

  const edition =
    translationCatalog.find((t) => t.code === selected) ?? null;
  const text = edition ? (translations[edition.id] ?? "") : "";

  if (!edition || !text) return null;

  return (
    <p
      className="mt-1 mb-6 max-w-prose text-left text-sm leading-relaxed text-(--sl-color-gray-1)"
      dir="ltr"
    >
      {text}
    </p>
  );
}
