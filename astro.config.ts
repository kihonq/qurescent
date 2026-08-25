import { defineConfig } from "astro/config";
import solidJS from "@astrojs/solid-js";
import starlight from "@astrojs/starlight";
import mermaid from "astro-mermaid";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  output: "static",
  integrations: [
    // Must precede Starlight so rehype processes ```mermaid fences.
    mermaid({
      theme: "neutral",
      autoTheme: true,
      enableLog: false,
    }),
    solidJS(),
    starlight({
      title: "Qurescent",
      description:
        "A documentation-style manual for the Quran — mushaf, tajwid, tadabbur, lineage.",
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
      ],
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
