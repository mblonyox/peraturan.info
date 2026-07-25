import type { APIRoute } from "astro";

import { createPeraturanFeed } from "@/lib/utils/feed";

export const GET: APIRoute = async ({ cache }) => {
  cache.set({
    maxAge: 86400,
    swr: 604800,
    tags: ["feed"],
  });
  const feed = await createPeraturanFeed();
  return new Response(feed.rss2(), {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
};
