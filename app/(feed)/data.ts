import { Feed } from "feed";

import { BASE_URL } from "@/lib/constants";
import { getDB, getFeedListPeraturan } from "@/lib/db";

const me = {
  name: "Sukirno",
  email: "mblonyox@gmail.com",
  link: "https://mblonyox.com",
};

export async function createPeraturanFeed() {
  const db = await getDB();
  const list = getFeedListPeraturan(db);
  const feed = new Feed({
    title: "Peraturan.Info Feed",
    description:
      "Feed Peraturan Perundang-undangan terbaru " +
      "yang tersedia di peraturan.info.",
    id: BASE_URL + "/",
    link: BASE_URL,
    image: BASE_URL + "/og-image.png",
    favicon: BASE_URL + "/favicon.ico",
    copyright: "@mblonyox",
    generator: "nodejs",
    feedLinks: {
      atom: BASE_URL + "/atom.xml",
      json: BASE_URL + "/feed.json",
      rss: BASE_URL + "/rss.xml",
    },
    author: me,
  });
  list.forEach((p) => {
    feed.addItem({
      id: BASE_URL + p.path,
      title: p.rujukPendek,
      description: p.judul,
      content: p.rujukPanjang,
      link: BASE_URL + p.path,
      date: p.created_at,
      author: [me],
    });
  });
  return feed;
}
