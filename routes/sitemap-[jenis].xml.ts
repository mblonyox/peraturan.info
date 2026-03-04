import process from "node:process";
import { Readable } from "node:stream";
import { arrayBuffer } from "node:stream/consumers";
import { getDB } from "~/lib/db/mod.ts";
import { getFilterByTahunCount } from "~/models/peraturan.ts";
import { define } from "~/utils/define.ts";
import type { RouteConfig } from "fresh";
import { SitemapIndexStream } from "sitemap";

globalThis.process = process;

export const config: RouteConfig = {
  routeOverride: "/sitemap-:jenis(\\w+).xml",
};

export const handler = define.handlers(async ({ url, params }) => {
  const origin = url.origin;
  const { jenis } = params;
  const db = await getDB();
  const items = getFilterByTahunCount(db, { jenis })
    .map(({ tahun }) => origin + `/sitemap-${jenis}-${tahun}.xml`);
  const stream = Readable.from(items).pipe(new SitemapIndexStream());
  const body = await arrayBuffer(stream);
  return new Response(body, { headers: { "Content-Type": "application/xml" } });
});
