import { defineConfig } from "astro/config";

// https://astro.build/config
import solidJS from "@astrojs/solid-js";

// https://astro.build/config
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
import { netlifyEdgeFunctions } from "@astrojs/netlify";

// https://astro.build/config
export default defineConfig({
  output: "server",
  integrations: [solidJS(), tailwind()],
  adapter: netlifyEdgeFunctions(),
});
