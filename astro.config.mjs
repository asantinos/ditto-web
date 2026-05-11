// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

// Final domain TBD (CLAUDE.md §8). Update both `site` and the canonical
// URL in Layout/RSS once decided. The sitemap, OG tags, and RSS feed
// derive their absolute URLs from this value.
const SITE = "https://dittoapp.com";

// https://astro.build/config
export default defineConfig({
  site: SITE,
  integrations: [mdx(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
