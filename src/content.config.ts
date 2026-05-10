import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

/**
 * CHANGELOG — one .mdx file per release.
 *
 * Frontmatter holds the structured data (version, date, badge, title).
 * The body is optional and unused for now; we render added/improved/fixed
 * from frontmatter arrays so the visual shape stays consistent across
 * releases.
 *
 * Slug naming: filename = version without 'v' (e.g. v1.0.0 → 1.0.0.mdx).
 * Astro derives the slug from the filename.
 */
const changelog = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/changelog" }),
  schema: z.object({
    version: z.string(),
    /**
     * Coerced to Date so we can compare/sort. Frontmatter values like
     * 2026-05-10 (YAML date) come in already as Date; strings still parse.
     */
    date: z.coerce.date(),
    badge: z.enum(["major", "minor", "patch"]),
    title: z.string(),
    added: z.array(z.string()).optional(),
    improved: z.array(z.string()).optional(),
    fixed: z.array(z.string()).optional(),
  }),
});

export const collections = { changelog };
