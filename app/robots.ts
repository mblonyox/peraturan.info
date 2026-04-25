import { MetadataRoute } from "next";

import { BASE_URL } from "@/lib/constants";

import { generateSitemaps } from "./sitemap";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const sitemapsIds = await generateSitemaps();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: sitemapsIds.map(({ id }) => `${BASE_URL}/sitemap/${id}.xml`),
  };
}
