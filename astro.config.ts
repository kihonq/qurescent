import { defineConfig } from "astro/config";

// https://astro.build/config
import solidJS from "@astrojs/solid-js";

// https://astro.build/config
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  output: "static",
  integrations: [solidJS()],
  vite: {
    plugins: [tailwindcss()],
  },
});
