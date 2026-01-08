import { getPeraturanThumbnail } from "~/utils/data.ts";
import { define } from "~/utils/define.ts";

import { HttpError } from "fresh";

export const handler = define.handlers({
  GET: async ({ params, url }) => {
    const cache = await caches.open("thumbnail");
    const cachedContent = await cache.match(url);
    if (cachedContent) return cachedContent;
    const { jenis, tahun, nomor } = params;
    const image = await getPeraturanThumbnail({ jenis, tahun, nomor });
    if (!image) throw new HttpError(404);
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
