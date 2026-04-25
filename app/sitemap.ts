import { MetadataRoute } from "next";

import { BASE_URL } from "@/lib/constants";
import {
  getDB,
  getFilterByJenisCount,
  getFilterByTahunCount,
  getListPeraturan,
} from "@/lib/db";
import { createMarked, PeraturanToken } from "@/lib/marked";
import { getPeraturanMarkdown } from "@/utils/data";

export async function generateSitemaps() {
  const db = await getDB();
  const jenis = getFilterByJenisCount(db, {});
  return jenis
    .flatMap((j) => {
      const tahun = getFilterByTahunCount(db, { jenis: j.jenis });
      return tahun.map((t) => ({ id: `${j.jenis}-${t.tahun}` }));
    })
    .concat({ id: "root" });
}

export default async function sitemap(props: {
  id: Promise<string>;
}): Promise<MetadataRoute.Sitemap> {
  const id = await props.id;
  if (id === "root") return generateRootItems();
  const [jenis, tahun] = id.split("-");
  return Array.fromAsync(generateItems(jenis, tahun));
}

type SitemapItem = MetadataRoute.Sitemap[number];

function generateRootItems() {
  const items: SitemapItem[] = [
    {
      url: BASE_URL,
      lastModified: new Date().toISOString(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/terbaru`,
      lastModified: new Date().toISOString(),
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  return items;
}

async function* generateItems(
  jenis: string,
  tahun: string,
): AsyncGenerator<SitemapItem> {
  const db = await getDB();
  const { hasil } = getListPeraturan(db, { jenis, tahun, pageSize: 1e4 });
  for (const p of hasil) {
    const lastmod = p.created_at;
    yield {
      url: `${BASE_URL}${p.path}/info`,
      images: [`${BASE_URL}${p.path}/thumbnail.png`],
      lastmod: lastmod.toString(),
      changefreq: "yearly",
      priority: 0.5,
    } as SitemapItem;
    yield {
      url: `${BASE_URL}${p.path}/terkait`,
      lastmod: lastmod.toString(),
      changefreq: "yearly",
      priority: 0.5,
    } as SitemapItem;
    const md = await getPeraturanMarkdown({
      jenis,
      tahun,
      nomor: p.nomor,
    });
    if (md) {
      const paths = getPartialPaths(md);
      for (const path of paths) {
        yield {
          url: `${BASE_URL}${p.path}${path}`,
          changefreq: "yearly",
          priority: 1.0,
        } as SitemapItem;
      }
    }
  }
}

function getPartialPaths(md: string): string[] {
  const paths = [
    "/isi",
    "/judul",
    "/pembukaan",
    "/konsideran",
    "/dasar-hukum",
    "/batang-tubuh",
  ];
  const marked = createMarked();
  const rootTokens = [...marked.lexer(md)] as PeraturanToken[];
  const getSubPaths = (token: PeraturanToken, path = ""): string[] => {
    if (["buku", "bab", "bagian", "paragraf"].includes(token.type)) {
      path += "/" + token.nomor?.toLowerCase().replace(" ", "-");
      return [
        path,
        ...token
          .tokens!.map((token) => getSubPaths(token as PeraturanToken, path))
          .flat(),
      ];
    }
    if (token.type === "pasal") {
      path = "/" + token.nomor?.toLowerCase().replace(" ", "-");
      return [
        path,
        ...token
          .tokens!.map((token) => getSubPaths(token as PeraturanToken, path))
          .flat(),
      ];
    }
    if (token.type === "ayat") {
      return [
        path + "/ayat-" + token.nomor?.toLowerCase().replaceAll(/[\(\)]/g, ""),
      ];
    }
    return [];
  };
  return paths.concat(rootTokens.flatMap((token) => getSubPaths(token)));
}
