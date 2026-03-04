import process from "node:process";
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
  const sitemapIndexStream = new SitemapIndexStream();
  const { writable, readable } = SitemapIndexStream.toWeb(sitemapIndexStream);
  ReadableStream.from(items).pipeTo(writable);
  return new Response(readable as ReadableStream, {
    headers: { "Content-Type": "application/xml" },
  });
});
