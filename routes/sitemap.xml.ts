import process from "node:process";
import { define } from "~/utils/define.ts";
import { toTransformStream } from "~/utils/streams.ts";
import { type SitemapItemLoose, SitemapStream } from "sitemap";

globalThis.process = process;

export const handler = define.handlers(({ url }) => {
  const origin = url.origin;
  const items: (SitemapItemLoose | string)[] = [
    {
      url: "/",
      img: "/logo.webp",
    },
    "/terbaru",
  ];
  const sitemapStream = new SitemapStream({ hostname: origin });
  const stream = ReadableStream.from(items)
    .pipeThrough(toTransformStream(sitemapStream));
  return new Response(stream, {
    headers: { "Content-Type": "application/xml" },
  });
});
