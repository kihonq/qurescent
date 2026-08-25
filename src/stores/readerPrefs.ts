import { persistentAtom } from "@nanostores/persistent";

const boolCodec = {
  encode: (value: boolean) => (value ? "true" : "false"),
  decode: (value: string) => value === "true",
};

export const wordByWordAtom = persistentAtom<boolean>(
  "qurescent.wordByWord",
  true,
  boolCodec,
);

export const setWordByWord = (on: boolean) => wordByWordAtom.set(on);

export const toggleWordByWord = () => setWordByWord(!wordByWordAtom.get());

/** When on: QCF V4 colored palettes. When off: mono palettes (same glyphs). */
export const coloredTajweedAtom = persistentAtom<boolean>(
  "qurescent.coloredTajweed",
  true,
  boolCodec,
);

export const setColoredTajweed = (on: boolean) => coloredTajweedAtom.set(on);

export const toggleColoredTajweed = () =>
  setColoredTajweed(!coloredTajweedAtom.get());
