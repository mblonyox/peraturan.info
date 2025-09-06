import { Readable } from "node:stream";
import { define } from "~/utils/define.ts";
import { type SitemapItemLoose, SitemapStream, streamToPromise } from "sitemap";

export const handler = define.handlers({
  GET: async ({ url }) => {
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
    return new Response(
      await streamToPromise(stream),
      { headers: { "Content-Type": "application/xml" } },
    );
  },
});
