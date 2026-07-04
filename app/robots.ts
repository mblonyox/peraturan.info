import type { MetadataRoute } from "next";
import { unstable_cache } from "next/cache";

import { BASE_URL } from "@/lib/constants";

import { sitemapsIds } from "./sitemap-ids";

export const dynamic = "force-dynamic";

const sitemapUrls = unstable_cache(
  async () => {
    const ids = await sitemapsIds();
    return ids.map(({ id }) => `${BASE_URL}/sitemap/${id}.xml`);
  },
  ["sitemap-urls"],
  { revalidate: 30 * 24 * 60 * 60 }, // 30 days
);

export default async function robots(): Promise<MetadataRoute.Robots> {
  const sitemap = await sitemapUrls();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap,
  };
}
