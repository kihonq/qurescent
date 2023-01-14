import { atom } from "nanostores";

export enum Theme {
  Light = "light",
  Dark = "dark",
}

export const storeTheme = (theme: Theme | undefined) =>
  theme && localStorage.setItem("qurescent.theme", theme);

export const themeAtom = atom<Theme | undefined>();
