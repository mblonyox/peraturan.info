import type { APIRoute } from "astro";

import { WEEK } from "@/lib/constants";
import { createPeraturanFeed } from "@/lib/utils/feed";

export const GET: APIRoute = async ({ cache, site, rewrite }) => {
  const origin = site?.origin;
  if (!origin) return rewrite("/404");
  cache.set({
    maxAge: WEEK,
    tags: ["feed"],
  });
  const feed = await createPeraturanFeed(origin);
  return new Response(feed.atom1(), {
    headers: { "Content-Type": "application/atom+xml; charset=utf-8" },
  });
};
