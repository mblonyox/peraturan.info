import { Handlers } from "$fresh/server.ts";
import { RouteConfig } from "$fresh/server.ts";
import { getDB, lastModDB } from "@/data/db.ts";
import { getFilterByTahunCount } from "@/models/peraturan.ts";

export const config: RouteConfig = {
  routeOverride: "/sitemap-:jenis.xml",
};

type SitemapTag = {
  loc: string;
  lastmod?: Date;
};

export const handler: Handlers = {
  GET: async (req, ctx) => {
    const origin = new URL(req.url).origin;
    const { jenis } = ctx.params;
    const db = await getDB();
    const lastmod = await lastModDB();
    const tahunJumlah = getFilterByTahunCount(db, { jenis });
    const indexes: SitemapTag[] = tahunJumlah.map(({ tahun }) => ({
      loc: origin + `/sitemap-${jenis}-${tahun}.xml`,
      lastmod,
    }));

    return new Response(
      '<?xml version="1.0" encoding="UTF-8"?>' +
        '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
        indexes.map(({ loc, lastmod }) =>
          "<sitemap>" + `<loc>${loc}</loc>` +
          `<lastmod>${lastmod?.toISOString()}</lastmod>` +
          "</sitemap>"
        ).join("") + "</sitemapindex>",
      { headers: { "Content-Type": "text/xml" } },
    );
  },
};
