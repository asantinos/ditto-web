import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { APIContext } from "astro";

/**
 * RSS feed for the changelog at /changelog.xml.
 *
 * Each release becomes one feed item. The description is built from
 * the optional added/improved/fixed arrays — each non-empty group
 * appears as a "<h4>Group</h4><ul>…</ul>" block, mirroring the visual
 * structure of the on-page ReleaseEntry component.
 */
export async function GET(context: APIContext) {
  const releases = (await getCollection("changelog")).sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime(),
  );

  return rss({
    title: "Ditto — Changelog",
    description:
      "Local voice-to-text for Windows. Release notes for every Ditto version.",
    site: context.site!,
    items: releases.map((r) => ({
      title: `${r.data.version} — ${r.data.title}`,
      pubDate: r.data.date,
      link: `/changelog#${r.data.version}`,
      description: buildDescription(r.data),
    })),
    customData: "<language>en-us</language>",
  });
}

function buildDescription(data: {
  badge: "major" | "minor" | "patch";
  added?: string[];
  improved?: string[];
  fixed?: string[];
}): string {
  const sections: string[] = [];
  sections.push(`<p><strong>${data.badge.toUpperCase()}</strong></p>`);

  for (const [label, items] of [
    ["Added", data.added],
    ["Improved", data.improved],
    ["Fixed", data.fixed],
  ] as const) {
    if (!items || items.length === 0) continue;
    sections.push(
      `<h4>${label}</h4><ul>${items.map((i) => `<li>${escapeHtml(i)}</li>`).join("")}</ul>`,
    );
  }

  return sections.join("");
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
