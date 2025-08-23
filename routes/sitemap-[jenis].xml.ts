import type { RouteConfig } from "fresh";

import { getDB, lastModDB } from "~/lib/db/mod.ts";
import { getFilterByTahunCount } from "~/models/peraturan.ts";
import { define } from "~/utils/define.ts";

export const config: RouteConfig = {
  routeOverride: "/sitemap-:jenis(\\w+).xml",
};

type SitemapTag = {
  loc: string;
  lastmod?: Date;
};

export const handler = define.handlers({
  GET: async (ctx) => {
    const req = ctx.req;
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
          "<sitemap>" +
          `<loc>${loc}</loc>` +
          (lastmod ? `<lastmod>${lastmod?.toISOString()}</lastmod>` : "") +
          "</sitemap>"
        ).join("") + "</sitemapindex>",
      { headers: { "Content-Type": "text/xml" } },
    );
  },
});
