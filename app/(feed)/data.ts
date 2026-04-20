import { Feed } from "feed";

import { getDB, getFeedListPeraturan } from "@/lib/db";

const me = {
  name: "Sukirno",
  email: "mblonyox@gmail.com",
  link: "https://mblonyox.com",
};

const origin = `https://${process.env.HOSTNAME ?? "peraturan.info"}`;

export async function createPeraturanFeed() {
  const db = await getDB();
  const list = getFeedListPeraturan(db);
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
    generator: "nodejs",
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
