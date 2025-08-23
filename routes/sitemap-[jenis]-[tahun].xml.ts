import type { RouteConfig } from "fresh";

import { getDB } from "~/lib/db/mod.ts";
import { getListPeraturan } from "~/models/peraturan.ts";
import { define } from "~/utils/define.ts";
import { lastModMd, readTextMd } from "~/utils/fs.ts";
import { createMarked, PeraturanToken } from "~/utils/md.ts";

type UrlTag = {
  loc: string;
  lastmod?: Date;
  changefreq?:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority?: number;
};

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
    const urls: UrlTag[] = [];
    for (const p of hasil) {
      const lastmod = p.created_at;
      urls.push({
        loc: origin + p.path + "/info",
        lastmod,
        changefreq: "yearly",
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
          urls.push({
            loc: origin + p.path + path,
            lastmod,
            changefreq: "yearly",
            priority: 1.0,
          });
        });
      }
    }

    return new Response(
      '<?xml version="1.0" encoding="UTF-8"?>' +
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
        urls.map(({ loc, lastmod, changefreq, priority }) =>
          "<url>" +
          `<loc>${loc}</loc>` +
          (lastmod ? `<lastmod>${lastmod?.toISOString()}</lastmod>` : "") +
          (changefreq ? `<changefreq>${changefreq}</changefreq>` : "") +
          (priority ? `<priority>${priority}</priority>` : "") +
          "</url>"
        )
          .join("") +
        "</urlset>",
      { headers: { "Content-Type": "text/xml" } },
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
