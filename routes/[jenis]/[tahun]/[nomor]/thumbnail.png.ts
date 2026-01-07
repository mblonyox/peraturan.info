import { define } from "~/utils/define.ts";
import { readThumbnail } from "~/utils/fs.ts";

export const handler = define.handlers({
  GET: async ({ params, url }) => {
    const cache = await caches.open("thumbnail");
    const cachedContent = await cache.match(url);
    if (cachedContent) return cachedContent;
    const { jenis, tahun, nomor } = params;
    const image = await readThumbnail({ jenis, tahun, nomor });
    const response = new Response(image, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
    cache.put(url, response.clone());
    return response;
  },
});
