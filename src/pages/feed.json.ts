import type { APIRoute } from "astro";

import { createPeraturanFeed } from "@/lib/utils/feed";

export const GET: APIRoute = async () => {
  const feed = await createPeraturanFeed();
  return new Response(feed.json1(), {
    headers: { "Content-Type": "application/feed+json; charset=utf-8" },
  });
};
