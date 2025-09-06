import { Readable } from "node:stream";
import { getDB } from "~/lib/db/mod.ts";
import { getFilterByTahunCount } from "~/models/peraturan.ts";
import { define } from "~/utils/define.ts";
import type { RouteConfig } from "fresh";
import { SitemapIndexStream, streamToPromise } from "sitemap";

export const config: RouteConfig = {
  routeOverride: "/sitemap-:jenis(\\w+).xml",
};

export const handler = define.handlers({
  GET: async ({ url, params }) => {
    const origin = url.origin;
    const { jenis } = params;
    const db = await getDB();
    const items = getFilterByTahunCount(db, { jenis })
      .map(({ tahun }) => origin + `/sitemap-${jenis}-${tahun}.xml`);
    const stream = Readable.from(items).pipe(new SitemapIndexStream());
    return new Response(
      await streamToPromise(stream),
      { headers: { "Content-Type": "application/xml" } },
    );
  },
});
