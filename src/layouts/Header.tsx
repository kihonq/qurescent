import { createEffect, onMount } from "solid-js";
import type { Component } from "solid-js";

import { storeTheme, Theme, themeAtom } from "@stores/theme";
import IconLogo from "@components/icons/logo";
import { useStore } from "@nanostores/solid";

const Header: Component = () => {
  const theme = useStore(themeAtom);
  const setTheme = (theme: Theme | undefined) => themeAtom.set(theme);

  onMount(() => {
    const root = document.documentElement;
    const initialColorValue = root.style.getPropertyValue(
      "--initial-theme"
    ) as Theme;

    setTheme(initialColorValue);
  });

  const handleClick = () =>
    setTheme(theme() === Theme.Light ? Theme.Dark : Theme.Light);

  createEffect(() => {
    const currentTheme = theme();
    if (currentTheme) {
      document.documentElement.setAttribute("class", currentTheme);
      storeTheme(currentTheme);
    }
  });

  return (
    <div class="sticky top-0 z-30 flex w-full items-center bg-white/30 py-6 px-8 backdrop-blur-md transition duration-150 dark:bg-neutral-900/50">
      <div class="flex flex-1 items-center">
        <IconLogo />
        <a
          href="/"
          class="ml-1 text-2xl font-bold transition duration-150 dark:text-slate-200"
        >
          Qurescent
        </a>
      </div>
      <div class="h-6 w-12">
        <label class="flex h-full w-full cursor-pointer select-none justify-between rounded-full bg-gray-300 p-1 transition duration-150 dark:bg-container-50">
          <span class="inline text-xs dark:hidden">🌞</span>
          <span class="float-right block h-4 w-4 rounded-full bg-gray-50 transition duration-150 dark:float-left dark:bg-container-300"></span>
          <span class="hidden text-xs dark:inline">🌛</span>
          <input
            type="checkbox"
            checked={theme() === Theme.Dark}
            class="hidden"
            onClick={handleClick}
          />
        </label>
      </div>
    </div>
  );
};

export default Header;
