import { define } from "~/utils/define.ts";
import { type SitemapItemLoose, SitemapStream } from "sitemap";

export const handler = define.handlers(({ url }) => {
  const origin = url.origin;
  const items: (SitemapItemLoose | string)[] = [
    {
      url: "/",
      img: "/logo.webp",
    },
    "/terbaru",
  ];
  const { readable, writable } = SitemapStream.toWeb(
    new SitemapStream({ hostname: origin }),
  );
  ReadableStream.from(items).pipeTo(writable);
  return new Response(readable as ReadableStream, {
    headers: { "Content-Type": "application/xml" },
  });
});
