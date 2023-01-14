import { useStore } from "@nanostores/solid";
import { atom } from "nanostores";

export enum Theme {
  Light = "light",
  Dark = "dark",
}

export const storeTheme = (theme: Theme | undefined) =>
  theme && localStorage.setItem("qurescent.theme", theme);

const themeAtom = atom<Theme | undefined>();
export const theme = useStore(themeAtom);
export const setTheme = (theme: Theme | undefined) => themeAtom.set(theme);
