import { Feed } from "feed";

import { getFeedListPeraturan } from "@/lib/db";

const me = {
  name: "Sukirno",
  email: "mblonyox@gmail.com",
  link: "https://mblonyox.com",
};

export async function createPeraturanFeed(origin: string) {
  const list = await getFeedListPeraturan();
  const feed = new Feed({
    title: "Peraturan.Info Feed",
    description:
      "Feed Peraturan Perundang-undangan terbaru " +
      "yang tersedia di peraturan.info.",
    id: origin + "/",
    link: origin,
    image: origin + "/og-image.png",
    favicon: origin + "/favicon.ico",
    copyright: "@mblonyox",
    generator: "astrojs",
    feedLinks: {
      atom: origin + "/atom.xml",
      json: origin + "/feed.json",
      rss: origin + "/rss.xml",
    },
    author: me,
  });
  list.forEach((p) => {
    feed.addItem({
      id: origin + p.path,
      title: p.rujukPendek,
      description: p.judul,
      content: p.rujukPanjang,
      link: origin + p.path,
      date: p.created_at,
      author: [me],
    });
  });
  return feed;
}
