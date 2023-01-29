import { Handlers } from "$fresh/server.ts";
import { RouteConfig } from "$fresh/server.ts";
import { listPeraturan } from "../models/peraturan.ts";
import { db } from "../data/db.ts";

export const config: RouteConfig = {
  routeOverride: "/sitemap-:jenis.xml",
};

export const handler: Handlers = {
  GET: (_req, ctx) => {
    const { jenis } = ctx.params;
    const { hasil } = listPeraturan(db, { jenis, pageSize: 10000 });

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
