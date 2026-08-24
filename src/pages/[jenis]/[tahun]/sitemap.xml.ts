import { Readable } from "node:stream";

import type { APIRoute, Params, Props } from "astro";
import { EnumChangefreq, type SitemapItemLoose, SitemapStream } from "sitemap";

import { getListPeraturan } from "@/lib/db";
import { createMarked, type PeraturanToken } from "@/lib/marked";
import { getData } from "@/lib/utils/data";

interface ApiParams extends Params {
  jenis: string;
  tahun: string;
}

export const GET: APIRoute<Props, ApiParams> = async ({
  params,
  site,
  cache,
}) => {
  const { jenis, tahun } = params;
  const smStream = new SitemapStream({ hostname: site?.origin });
  const stream = Readable.from(generateItems(jenis, tahun)).pipe(smStream);
  const body = Readable.toWeb(stream) as ReadableStream;
  cache.set({
    maxAge: 31536000,
    tags: ["peraturan", `jenis-${jenis}`, `tahun-${tahun}`, "sitemap"],
  });
  return new Response(body, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};

async function* generateItems(
  jenis: string,
  tahun: string,
): AsyncGenerator<SitemapItemLoose> {
  const { hasil } = await getListPeraturan({
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
    };
    yield {
      url: p.path + "/terkait",
      lastmod: lastmod.toString(),
      changefreq: EnumChangefreq.YEARLY,
      priority: 0.5,
    };
    const path = `${jenis}/${tahun}/${p.nomor}/fulltext.md`;
    const md = await getData(path, { format: "text" });
    if (md) {
      const paths = getPartialPaths(md);
      for await (const path of paths) {
        yield {
          url: p.path + path,
          changefreq: EnumChangefreq.YEARLY,
          priority: 1.0,
        };
      }
    }
  }
}

async function* getPartialPaths(md: string): AsyncGenerator<string> {
  const paths = [
    "/isi",
    "/judul",
    "/pembukaan",
    "/konsideran",
    "/dasar-hukum",
    "/batang-tubuh",
  ];
  yield* paths;
  const marked = createMarked();
  const rootTokens = [...marked.lexer(md)] as PeraturanToken[];
  yield* getSubPaths(rootTokens);
}

function* getSubPaths(tokens: PeraturanToken[], path = ""): Generator<string> {
  for (const token of tokens) {
    if (["buku", "bab", "bagian", "paragraf"].includes(token.type)) {
      const subPath = path + "/" + token.nomor?.toLowerCase().replace(" ", "-");
      yield subPath;
      const tokens = token.tokens ?? [];
      yield* getSubPaths(tokens, subPath);
    }
    if (token.type === "pasal") {
      const subPath = "/" + token.nomor?.toLowerCase().replace(" ", "-");
      yield subPath;
      const tokens = token.tokens ?? [];
      yield* getSubPaths(tokens, subPath);
    }
    if (token.type === "ayat") {
      const nomorAyat = token.nomor?.toLowerCase().replaceAll(/[\(\)]/g, "");
      yield path + "/ayat-" + nomorAyat;
    }
  }
}
