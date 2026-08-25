import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import starlight from "@astrojs/starlight";
import mermaid from "astro-mermaid";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://qurescent.kihong.dev",
  output: "static",
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
      description:
        "Quran from an engineer lens — static mushaf, named sources, tajwid, tadabbur, lineage.",
      customCss: ["./src/styles/global.css"],
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
          link: "/read/",
        },
        {
          label: "Guide",
          items: [
            { label: "Overview", slug: "guide" },
            {
              label: "Tajwid",
              items: [
                { label: "Overview", slug: "guide/tajwid" },
                { label: "Color legend", slug: "guide/tajwid/color-legend" },
              ],
            },
            { label: "Tadabbur", slug: "guide/tadabbur" },
            { label: "Lineage & history", slug: "guide/lineage" },
          ],
        },
        {
          label: "About",
          slug: "about",
        },
      ],
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
