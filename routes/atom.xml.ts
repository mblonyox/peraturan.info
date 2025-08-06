import { getDB } from "~/lib/db/mod.ts";
import { getFeedListPeraturan } from "~/models/mod.ts";
import { createPeraturanFeed } from "~/utils/feed.ts";
import { define } from "~/utils/define.ts";

export const handler = define.handlers({
  GET: async (ctx) => {
    const req = ctx.req;
    const url = new URL(req.url);
    const db = await getDB();
    const list = getFeedListPeraturan(db);
    const feed = createPeraturanFeed(list, url.origin);
    return new Response(feed.atom1(), {
      headers: { "Content-Type": "application/atom+xml" },
    });
  },
});
