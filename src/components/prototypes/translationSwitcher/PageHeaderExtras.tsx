// PROTOTYPE — mounted once near the page header. Only Variant C has header-level chrome (the
// "Aa Translations" drawer trigger); A and B keep all controls inline with the verse stack, so
// this renders nothing for those variants. `initialVariant` comes from the server; see
// TranslationStack.tsx comment for why.
import { Component, Match, Switch, createSignal, onCleanup, onMount } from "solid-js";
import { TranslationSettingsDrawer } from "./VariantC";
import { getVariantFromUrl } from "./PrototypeSwitcher";

const PageHeaderExtras: Component<{ initialVariant: string }> = (props) => {
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
    <Switch>
      <Match when={variant() === "C"}>
        <TranslationSettingsDrawer />
      </Match>
    </Switch>
  );
};

export default PageHeaderExtras;
