import { Handlers } from "$fresh/server.ts";
import { getDB } from "@/data/db.ts";
import { getFeedListPeraturan } from "@/models/mod.ts";
import { createPeraturanFeed } from "@/utils/feed.ts";

export const handler: Handlers = {
  GET: async (req, _ctx) => {
    const url = new URL(req.url);
    const db = await getDB();
    const list = getFeedListPeraturan(db);
    const feed = createPeraturanFeed(list, url.origin);
    return new Response(feed.atom1(), {
      headers: { "Content-Type": "application/atom+xml" },
    });
  },
};
