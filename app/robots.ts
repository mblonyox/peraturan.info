import { MetadataRoute } from "next";

import { BASE_URL } from "@/lib/constants";
import { getDB, getFilterByJenisCount, getFilterByTahunCount } from "@/lib/db";

export async function generateSitemaps() {
  const db = await getDB();
  const jenis = getFilterByJenisCount(db, {});
  return jenis
    .flatMap((j) => {
      const tahun = getFilterByTahunCount(db, { jenis: j.jenis });
      return tahun.map((t) => ({ id: `${j.jenis}-${t.tahun}` }));
    })
    .concat({ id: "root" });
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
