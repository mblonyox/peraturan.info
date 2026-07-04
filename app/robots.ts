import type { MetadataRoute } from "next";

import { sitemapUrls } from "./sitemap";

export const dynamic = "force-dynamic";

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
