import type { MetadataRoute } from "next";

import { BASE_URL } from "@/lib/constants";
import { getDB, getFilterByJenisCount, getFilterByTahunCount } from "@/lib/db";

export async function generateSitemaps() {
  const db = await getDB();
  const filterByJenis = await getFilterByJenisCount(db, {});
  const sitemapsIds: { id: string }[] = [];
  for (const j of Object.keys(filterByJenis)) {
    const filterByTahun = await getFilterByTahunCount(db, { jenis: j });
    sitemapsIds.push(
      ...Object.keys(filterByTahun).map((t) => ({ id: `${j}-${t}` })),
    );
  }
  return sitemapsIds.concat({ id: "root" });
}

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
