import process from "node:process";
import { Readable } from "node:stream";
import { arrayBuffer } from "node:stream/consumers";
import { define } from "~/utils/define.ts";
import { type SitemapItemLoose, SitemapStream } from "sitemap";

globalThis.process = process;

export const handler = define.handlers(async ({ url }) => {
  const origin = url.origin;
  const items: (SitemapItemLoose | string)[] = [
    {
      url: "/",
      img: "/logo.webp",
    },
    "/terbaru",
  ];
  const stream = Readable.from(items)
    .pipe(new SitemapStream({ hostname: origin }));
  const body = await arrayBuffer(stream);
  return new Response(body, { headers: { "Content-Type": "application/xml" } });
});
