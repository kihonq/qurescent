import { useEffect } from "react";
import { useStore } from "@nanostores/react";

import { storeTheme, Theme, themeAtom } from "@stores/theme";
import IconLogo from "@components/icons/logo";

/** Legacy shell header — Starlight owns primary chrome; kept for Layout.astro. */
export default function Header() {
  const theme = useStore(themeAtom);
  const setTheme = (next: Theme | undefined) => themeAtom.set(next);

  useEffect(() => {
    const root = document.documentElement;
    const initialColorValue = root.style.getPropertyValue(
      "--initial-theme",
    ) as Theme;
    setTheme(initialColorValue);
  }, []);

  useEffect(() => {
    if (theme) {
      document.documentElement.setAttribute("class", theme);
      storeTheme(theme);
    }
  }, [theme]);

  const handleClick = () =>
    setTheme(theme === Theme.Light ? Theme.Dark : Theme.Light);

  return (
    <div className="sticky top-0 z-30 flex w-full items-center bg-white/30 px-8 py-6 backdrop-blur-md transition duration-150 dark:bg-neutral-900/50">
      <div className="flex flex-1 items-center gap-6">
        <IconLogo />
        <a
          href="/"
          className="ml-1 text-2xl font-bold transition duration-150 dark:text-slate-200"
        >
          Qurescent
        </a>
        <a
          href="/guide/"
          className="text-sm font-medium text-gray-600 transition duration-150 hover:text-gray-900 dark:text-slate-400 dark:hover:text-slate-200"
        >
          Guide
        </a>
      </div>
      <div className="h-6 w-12">
        <label className="flex h-full w-full cursor-pointer select-none justify-between rounded-full bg-gray-300 p-1 transition duration-150 dark:bg-container-50">
          <span className="inline text-xs dark:hidden">🌞</span>
          <span className="float-right block h-4 w-4 rounded-full bg-gray-50 transition duration-150 dark:float-left dark:bg-container-300" />
          <span className="hidden text-xs dark:inline">🌛</span>
          <input
            type="checkbox"
            checked={theme === Theme.Dark}
            className="hidden"
            onChange={handleClick}
          />
        </label>
      </div>
    </div>
  );
}
