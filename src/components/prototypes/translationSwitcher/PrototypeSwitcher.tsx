// PROTOTYPE — floating bottom-bar variant switcher, per .agents/skills/prototype/UI.md.
// Hidden automatically outside dev builds. Updates `?variant=` so the choice is shareable/reload-stable.
// `initialVariant` comes from the server; see TranslationStack.tsx comment for why.
import { Component, createSignal, onCleanup, onMount } from "solid-js";

const VARIANTS = [
  { key: "A", label: "Chip toggle bar" },
  { key: "B", label: "Add/remove rows" },
  { key: "C", label: "Settings drawer" },
] as const;

const getVariantFromUrl = (): string => {
  if (typeof window === "undefined") return "A";
  const params = new URLSearchParams(window.location.search);
  return params.get("variant") ?? "A";
};

const setVariantInUrl = (key: string) => {
  const url = new URL(window.location.href);
  url.searchParams.set("variant", key);
  window.history.replaceState({}, "", url.toString());
  window.dispatchEvent(new Event("prototype-variant-change"));
};

const PrototypeSwitcher: Component<{ initialVariant: string }> = (props) => {
  if (import.meta.env.PROD) return null;

  const [current, setCurrent] = createSignal(props.initialVariant);

  const cycle = (dir: 1 | -1) => {
    const idx = VARIANTS.findIndex((v) => v.key === current());
    const next = VARIANTS[(idx + dir + VARIANTS.length) % VARIANTS.length];
    setCurrent(next.key);
    setVariantInUrl(next.key);
  };

  const onKeydown = (e: KeyboardEvent) => {
    const target = e.target as HTMLElement | null;
    if (
      target &&
      (target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable)
    ) {
      return;
    }
    if (e.key === "ArrowLeft") cycle(-1);
    if (e.key === "ArrowRight") cycle(1);
  };

  onMount(() => {
    if (typeof window === "undefined") return;
    window.addEventListener("keydown", onKeydown);
  });
  onCleanup(() => {
    if (typeof window === "undefined") return;
    window.removeEventListener("keydown", onKeydown);
  });

  const label = () => VARIANTS.find((v) => v.key === current())?.label ?? "";

  return (
    <div class="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-full border border-amber-300 bg-gray-900 px-4 py-2 text-white shadow-xl">
      <button
        type="button"
        aria-label="Previous variant"
        onClick={() => cycle(-1)}
        class="px-1 text-lg leading-none"
      >
        ←
      </button>
      <span class="whitespace-nowrap text-xs font-medium">
        {current()} ({label()}) — ticket #8 prototype
      </span>
      <button
        type="button"
        aria-label="Next variant"
        onClick={() => cycle(1)}
        class="px-1 text-lg leading-none"
      >
        →
      </button>
    </div>
  );
};

export default PrototypeSwitcher;
export { getVariantFromUrl, VARIANTS };
