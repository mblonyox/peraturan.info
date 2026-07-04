import { unstable_cache } from "next/cache";
import { NextResponse } from "next/server";

import { BASE_URL } from "@/lib/constants";

import { sitemapsIds } from "../sitemap-ids";

const sitemapUrls = unstable_cache(
  async () => {
    const ids = await sitemapsIds();
    return ids.map(({ id }) => `${BASE_URL}/sitemap/${id}.xml`);
  },
  ["sitemap-urls"],
  { revalidate: 30 * 24 * 60 * 60 }, // 30 days
);

export async function GET(): Promise<NextResponse> {
  const urls = await sitemapUrls();
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `<sitemap><loc>${url}</loc></sitemap>`).join("\n")}
</sitemapindex>`;

  return new NextResponse(body, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
