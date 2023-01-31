import { Handlers } from "$fresh/server.ts";
import { RouteConfig } from "$fresh/server.ts";
import { getListPeraturan } from "../models/peraturan.ts";
import { getDB } from "../data/db.ts";

export const config: RouteConfig = {
  routeOverride: "/sitemap-:jenis.xml",
};

export const handler: Handlers = {
  GET: async (_req, ctx) => {
    const { jenis } = ctx.params;
    const db = await getDB();
    const { hasil } = getListPeraturan(db, { jenis, pageSize: 10000 });

    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${
        hasil.map(({ jenis, tahun, nomor }) =>
          `<url><loc>https://peraturan.deno.dev/${jenis}/${tahun}/${nomor}</loc></url>`
        ).join("\n")
      }
    </urlset>`,
      { headers: { "Content-Type": "text/xml" } },
    );
  },
};
