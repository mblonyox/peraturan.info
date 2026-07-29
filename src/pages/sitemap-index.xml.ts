import { Readable } from "node:stream";

import type { APIRoute } from "astro";
import { SitemapIndexStream } from "sitemap";

import { getFilterByTahunCount, JENIS2_PERATURAN } from "@/lib/db";

export const GET: APIRoute = async ({ site }) => {
  const smiStream = new SitemapIndexStream();
  const stream = Readable.from(generateItems(site?.origin)).pipe(smiStream);
  const body = Readable.toWeb(stream) as ReadableStream;
  return new Response(body, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};

async function* generateItems(origin?: string): AsyncGenerator<string> {
  yield `${origin}/sitemap.xml`;
  for (const jenis of JENIS2_PERATURAN) {
    const filterByTahun = await getFilterByTahunCount({ jenis });
    for (const tahun of Object.keys(filterByTahun)) {
      yield `${origin}/${jenis}/${tahun}/sitemap.xml`;
    }
  }
}
