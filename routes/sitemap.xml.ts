import process from "node:process";
import { Readable } from "node:stream";
import { define } from "~/utils/define.ts";
import { type SitemapItemLoose, SitemapStream, streamToPromise } from "sitemap";

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
  const body = await streamToPromise(stream);
  return new Response(body as BodyInit, {
    headers: { "Content-Type": "application/xml" },
  });
});
