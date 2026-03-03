import { cache } from "~/middlewares/cache.ts";

export const handler = [cache({
  cacheName: "peraturan",
  cacheControl: "public, max-age=31536000, immutable",
})];
