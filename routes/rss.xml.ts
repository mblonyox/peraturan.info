import { Handlers } from "$fresh/server.ts";
import { Feed } from "feed";
import { getDB } from "@/data/db.ts";
import { getFeedListPeraturan } from "@/models/mod.ts";

export const handler: Handlers = {
  GET: async (req, _ctx) => {
    const url = new URL(req.url);
    const db = await getDB();
    const list = getFeedListPeraturan(db);
    const feed = new Feed({
      title: "Peraturan.deno.dev Feed",
      description: "Feed Peraturan Perundang-undangan terbaru " +
        "yang tersedia di peraturan.deno.dev.",
      id: url.origin,
      link: url.origin,
      image: url.origin + "/og-image.png",
      favicon: url.origin + "/favicon.ico",
      copyright: "@mblonyox",
      generator: "deno-deploy",
      feedLinks: {
        atom: url.origin + "/atom.xml",
        json: url.origin + "/feed.json",
        rss: url.origin + "/rss.xml",
      },
    });
    list.forEach((p) => {
      feed.addItem({
        title: p.rujukPendek,
        content: p.judul,
        link: url.origin + p.path,
        date: p.created_at,
      });
    });
    return new Response(feed.rss2(), {
      headers: { "Content-Type": "application/rss+xml" },
    });
  },
};
