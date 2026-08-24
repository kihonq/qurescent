// PROTOTYPE — mounted once per verse. Renders whichever variant is currently selected via
// `?variant=`, re-rendering live when the floating switcher changes it (no reload needed).
// `initialVariant` comes from the server (Astro reads the query string) so SSR and the first
// client render always agree; only *subsequent* changes are picked up via the window event.
import { Component, Match, Switch, createSignal, onCleanup, onMount } from "solid-js";
import VariantA from "./VariantA";
import VariantB from "./VariantB";
import VariantC from "./VariantC";
import { getVariantFromUrl } from "./PrototypeSwitcher";

const TranslationStack: Component<{
  verseNumber: number;
  initialVariant: string;
}> = (props) => {
  const [variant, setVariant] = createSignal(props.initialVariant);
  const onChange = () => setVariant(getVariantFromUrl());

  onMount(() => {
    if (typeof window === "undefined") return;
    window.addEventListener("prototype-variant-change", onChange);
  });
  onCleanup(() => {
    if (typeof window === "undefined") return;
    window.removeEventListener("prototype-variant-change", onChange);
  });

  return (
    <Switch fallback={<VariantA verseNumber={props.verseNumber} />}>
      <Match when={variant() === "A"}>
        <VariantA verseNumber={props.verseNumber} />
      </Match>
      <Match when={variant() === "B"}>
        <VariantB verseNumber={props.verseNumber} />
      </Match>
      <Match when={variant() === "C"}>
        <VariantC verseNumber={props.verseNumber} />
      </Match>
    </Switch>
  );
};

export default TranslationStack;
