import process from "node:process";
import { getDB } from "~/lib/db/mod.ts";
import { getListPeraturan } from "~/models/peraturan.ts";
import { getPeraturanMarkdown } from "~/utils/data.ts";
import { define } from "~/utils/define.ts";
import { createMarked, type PeraturanToken } from "~/utils/md.ts";
import { toTransformStream } from "~/utils/streams.ts";
import type { RouteConfig } from "fresh";
import { EnumChangefreq, type SitemapItemLoose, SitemapStream } from "sitemap";

globalThis.process = process;

export const config: RouteConfig = {
  routeOverride: "/sitemap-:jenis(\\w+)-:tahun(\\d+).xml",
};

export const handler = define.handlers(({ url, params }) => {
  const origin = url.origin;
  const { jenis, tahun } = params;
  const sitemapStream = new SitemapStream({ hostname: origin });
  const stream = ReadableStream.from(generateItems(jenis, tahun))
    .pipeThrough(toTransformStream(sitemapStream));
  return new Response(stream, {
    headers: { "Content-Type": "application/xml" },
  });
});

async function* generateItems(jenis: string, tahun: string) {
  const db = await getDB();
  const { hasil } = getListPeraturan(db, {
    jenis,
    tahun,
    pageSize: 10000,
  });
  for (const p of hasil) {
    const lastmod = p.created_at;
    yield {
      url: p.path + "/info",
      img: p.path + "/thumbnail.png",
      lastmod: lastmod.toString(),
      changefreq: EnumChangefreq.YEARLY,
      priority: 0.5,
    } as SitemapItemLoose;
    yield {
      url: p.path + "/terkait",
      lastmod: lastmod.toString(),
      changefreq: EnumChangefreq.YEARLY,
      priority: 0.5,
    } as SitemapItemLoose;
    const md = await getPeraturanMarkdown({
      jenis,
      tahun,
      nomor: p.nomor,
    });
    if (md) {
      const paths = getPartialPaths(md);
      for (const path of paths) {
        yield {
          url: p.path + path,
          changefreq: EnumChangefreq.YEARLY,
          priority: 1.0,
        } as SitemapItemLoose;
      }
    }
  }
}

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
