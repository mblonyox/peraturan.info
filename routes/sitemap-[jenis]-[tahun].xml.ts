import { Handlers } from "$fresh/server.ts";
import { RouteConfig } from "$fresh/server.ts";
import { getDB } from "@/data/db.ts";
import { getListPeraturan } from "@/models/peraturan.ts";
import { lastModMd, readTextMd } from "@/utils/fs.ts";
import { marked } from "marked";
import { PartialToken, peraturan as peraturanExtension } from "@/utils/md.ts";

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
  routeOverride: "/sitemap-:jenis-:tahun.xml",
};

export const handler: Handlers = {
  GET: async (req, ctx) => {
    const origin = new URL(req.url).origin;
    const { jenis, tahun } = ctx.params;
    const db = await getDB();
    const { hasil, total } = getListPeraturan(db, {
      jenis,
      tahun,
      pageSize: 10000,
    });
    const urls: UrlTag[] = [];
    for (const page of Array(Math.ceil(total / 10)).keys()) {
      urls.push({
        loc: origin + `/${jenis}/${tahun}?page=${page + 1}`,
        changefreq: "yearly",
        priority: 0.4,
      });
    }
    for (const p of hasil) {
      const lastmod = p.created_at;
      urls.push({
        loc: origin + p.path + "/info",
        lastmod,
        changefreq: "yearly",
        priority: 0.5,
      });
      urls.push({
        loc: origin + p.path + "/terkait",
        lastmod,
        changefreq: "yearly",
        priority: 0.9,
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
};

const getPartialPaths = (md: string): string[] => {
  const paths = [
    "/kerangka",
    "/isi",
    "/judul",
    "/pembukaan",
    "/konsideran",
    "/dasar-hukum",
    "/batang-tubuh",
  ];
  marked.use(peraturanExtension);
  const rootTokens = [...marked.lexer(md)] as PartialToken[];
  const getSubPaths = (token: PartialToken, path = ""): string[] => {
    if (["buku", "bab", "bagian", "paragraf"].includes(token.type)) {
      path += "/" + token.nomor.toLowerCase().replace(" ", "-");
      return [
        path,
        ...token.tokens!.map((token) =>
          getSubPaths(token as PartialToken, path)
        ).flat(),
      ];
    }
    if (token.type === "pasal") {
      path = "/" + token.nomor.toLowerCase().replace(" ", "-");
      return [
        path,
        ...token.tokens!.map((token) =>
          getSubPaths(token as PartialToken, path)
        ).flat(),
      ];
    }
    if (token.type === "ayat") {
      return [
        path + "/ayat-" + token.nomor.toLowerCase().replaceAll(
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
