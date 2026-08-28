import { Readable } from "node:stream";

import type { APIRoute } from "astro";
import { SitemapIndexStream } from "sitemap";

import { YEAR } from "@/lib/constants";
import { getFilterByTahunCount, JENIS2_PERATURAN } from "@/lib/db";

export const GET: APIRoute = async ({ site, cache }) => {
  const smiStream = new SitemapIndexStream();
  const stream = Readable.from(generateItems(site?.origin)).pipe(smiStream);
  const body = Readable.toWeb(stream) as ReadableStream;
  cache.set({
    maxAge: YEAR,
    tags: ["sitemap"],
  });
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
