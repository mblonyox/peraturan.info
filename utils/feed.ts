import { Peraturan } from "@/models/peraturan.ts";
import { Feed } from "feed";

export const createPeraturanFeed = (list: Peraturan[], origin: string) => {
  const feed = new Feed({
    title: "Peraturan.deno.dev Feed",
    description: "Feed Peraturan Perundang-undangan terbaru " +
      "yang tersedia di peraturan.deno.dev.",
    id: origin + "/",
    link: origin,
    image: origin + "/og-image.png",
    favicon: origin + "/favicon.ico",
    copyright: "@mblonyox",
    generator: "deno-deploy",
    feedLinks: {
      atom: origin + "/atom.xml",
      json: origin + "/feed.json",
      rss: origin + "/rss.xml",
    },
  });
  list.forEach((p) => {
    feed.addItem({
      id: origin + p.path,
      title: p.rujukPendek,
      description: p.judul,
      content: p.rujukPanjang,
      link: origin + p.path,
      date: p.created_at,
      author: [],
    });
  });
  return feed;
};
