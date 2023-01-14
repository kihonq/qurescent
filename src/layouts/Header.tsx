import { Component, createEffect, onMount } from "solid-js";

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
    <div class="backdrop-blur-md transition duration-150 bg-white/30 dark:bg-neutral-900/50 sticky top-0 z-30 w-full py-6 px-8 flex flex-col md:flex-row gap-4">
      <div class="flex items-center flex-1">
        <IconLogo />
        <a
          href="/"
          class="text-2xl transition duration-150 dark:text-slate-200 ml-1 font-bold"
        >
          Qurescent
        </a>
      </div>
      <div class="w-12 h-6">
        <label class="w-full h-full transition duration-150 bg-gray-300 dark:bg-container-50 rounded-full p-1 flex justify-between cursor-pointer select-none">
          <span class="text-xs inline dark:hidden">🌞</span>
          <span class="w-4 h-4 rounded-full transition duration-150 bg-gray-50 dark:bg-container-300 block float-right dark:float-left"></span>
          <span class="text-xs hidden dark:inline">🌛</span>
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
