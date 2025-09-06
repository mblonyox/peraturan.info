import { Readable } from "node:stream";
import { getDB } from "~/lib/db/mod.ts";
import { getListPeraturan } from "~/models/peraturan.ts";
import { define } from "~/utils/define.ts";
import { lastModMd, readTextMd } from "~/utils/fs.ts";
import { createMarked, type PeraturanToken } from "~/utils/md.ts";
import type { RouteConfig } from "fresh";
import {
  EnumChangefreq,
  type SitemapItemLoose,
  SitemapStream,
  streamToPromise,
} from "sitemap";

export const config: RouteConfig = {
  routeOverride: "/sitemap-:jenis(\\w+)-:tahun(\\d+).xml",
};

export const handler = define.handlers({
  GET: async ({ url, params }) => {
    const origin = url.origin;
    const { jenis, tahun } = params;
    const db = await getDB();
    const { hasil } = getListPeraturan(db, {
      jenis,
      tahun,
      pageSize: 10000,
    });
    const items: SitemapItemLoose[] = [];
    for (const p of hasil) {
      const lastmod = p.created_at;
      items.push({
        url: p.path + "/info",
        img: p.path + "/preview.png",
        lastmod: lastmod.toString(),
        changefreq: EnumChangefreq.YEARLY,
        priority: 0.5,
      }, {
        url: p.path + "/terkait",
        lastmod: lastmod.toString(),
        changefreq: EnumChangefreq.YEARLY,
        priority: 0.5,
      });
      const md = await readTextMd({
        jenis,
        tahun,
        nomor: p.nomor,
      });
      if (md) {
        const lastmod = await lastModMd({
          jenis,
          tahun,
          nomor: p.nomor,
        });
        const paths = getPartialPaths(md);
        paths.forEach((path) => {
          items.push({
            url: p.path + path,
            lastmod: lastmod?.toString(),
            changefreq: EnumChangefreq.YEARLY,
            priority: 1.0,
          });
        });
      }
    }
    const stream = Readable.from(items)
      .pipe(new SitemapStream({ hostname: origin }));
    return new Response(
      await streamToPromise(stream),
      { headers: { "Content-Type": "application/xml" } },
    );
  },
});

const getPartialPaths = (md: string): string[] => {
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
        ...token.tokens!.map((token) =>
          getSubPaths(token as PeraturanToken, path)
        )
          .flat(),
      ];
    }
    if (token.type === "pasal") {
      path = "/" + token.nomor?.toLowerCase().replace(" ", "-");
      return [
        path,
        ...token.tokens!.map((token) =>
          getSubPaths(token as PeraturanToken, path)
        )
          .flat(),
      ];
    }
    if (token.type === "ayat") {
      return [
        path + "/ayat-" + token.nomor?.toLowerCase().replaceAll(
          /[\(\)]/g,
          "",
        ),
      ];
    }
    return [];
  };
  return paths.concat(
    rootTokens.map((token) => getSubPaths(token)).flat(),
  );
};
