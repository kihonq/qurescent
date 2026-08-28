import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import starlight from "@astrojs/starlight";
import mermaid from "astro-mermaid";
import tailwindcss from "@tailwindcss/vite";

import chapters from "./src/data/chapters.json";
import type { IChapterMeta } from "./src/types/chapter";

const mushafSurahs = (chapters as IChapterMeta[]).map((c) => ({
  label: `${String(c.id).padStart(3, "0")} ${c.englishName}`,
  link: `/read/${c.id}/`,
}));

// https://astro.build/config
export default defineConfig({
  site: "https://qurescent.kihong.dev",
  output: "static",
  redirects: {
    "/guide/tajwid/color-legend": "/guide/tajwid/",
  },
  integrations: [
    // Must precede Starlight so rehype processes ```mermaid fences.
    mermaid({
      theme: "neutral",
      autoTheme: true,
      enableLog: false,
    }),
    react(),
    starlight({
      title: "Qurescent",
      logo: {
        light: "./src/assets/logo-light.svg",
        dark: "./src/assets/logo-dark.svg",
        alt: "Qurescent",
      },
      favicon: "/favicon.svg",
      head: [
        {
          tag: "link",
          attrs: { rel: "icon", href: "/favicon.ico", sizes: "any" },
        },
        {
          tag: "link",
          attrs: { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
        },
      ],
      description:
        "Quran from an engineer lens — static mushaf, named sources, tajwid, tadabbur, lineage.",
      customCss: ["./src/styles/global.css"],
      components: {
        Search: "./src/components/overrides/Search.astro",
        Sidebar: "./src/components/overrides/Sidebar.astro",
      },
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/kihonq/qurescent",
        },
      ],
      sidebar: [
        {
          label: "Mushaf",
          collapsed: false,
          items: [
            { label: "All surahs", link: "/read/" },
            ...mushafSurahs,
          ],
        },
        { label: "Guide", slug: "guide" },
        { label: "Tajwid", slug: "guide/tajwid" },
        { label: "Tadabbur", slug: "guide/tadabbur" },
        { label: "Lineage & history", slug: "guide/lineage" },
        { label: "About", slug: "about" },
      ],
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
