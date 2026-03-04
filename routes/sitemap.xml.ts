import process from "node:process";
import { define } from "~/utils/define.ts";
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
  const { readable, writable } = SitemapStream.toWeb(sitemapStream);
  ReadableStream.from(items).pipeTo(writable);
  return new Response(readable as ReadableStream, {
    headers: { "Content-Type": "application/xml" },
  });
});
