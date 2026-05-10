import { DB } from "~/lib/db/mod.ts";
import { getFeedListPeraturan } from "~/models/mod.ts";
import { define } from "~/utils/define.ts";
import { createPeraturanFeed } from "~/utils/feed.ts";

export const handler = define.handlers({
  GET: ({ url }) => {
    using db = new DB();
    const list = getFeedListPeraturan(db);
    const feed = createPeraturanFeed(list, url.origin);
    return new Response(feed.atom1(), {
      headers: { "Content-Type": "application/atom+xml; charset=utf-8" },
    });
  },
});
