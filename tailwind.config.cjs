/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");
const typography = require("@tailwindcss/typography");

module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        vanilla: "#fbfbfb",
        hover: "#f5f5f5",
        oreo: "#121212",
        container: {
          50: "#2a2a2a",
          100: "#242424",
          200: "#282828",
          300: "#1c1c1c",
        },
        input: {
          50: "#d9d9d9",
        },
        tajweed: {
          1: "#aaaaaa",
          2: "#aaaaaa",
          3: "#aaaaaa",
          4: "#537fff",
          5: "#4050ff",
          17: "#003399",
          6: "#dd0008",
          7: "#2144c1",
          8: "#d500b7",
          9: "#9400a8",
          10: "#6b8e23",
          11: "#26bffd",
          12: "#169777",
          13: "#169200",
          14: "#a1a1a1",
          15: "#a1a1a1",
          16: "#ff7e1e",
        },
      },
      fontFamily: {
        "hafs-uthmanic": ["Hafs Uthmanic"],
        "surah-name": ["Surah Name"],
        sans: [
          "Atkinson Hyperlegible",
          ...defaultTheme.fontFamily.sans,
        ],
        serif: ["Crimson Pro", ...defaultTheme.fontFamily.serif],
      },
    },
  },
  plugins: [typography],
};
