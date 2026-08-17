import type { APIRoute, Params, Props } from "astro";
import { ImageResponse } from "cf-workers-og";

import PartialsOgImage from "@/components/partials/OgImage";
import { getPeraturan } from "@/lib/db";
import { createMarked, type PeraturanToken } from "@/lib/marked";
import { readOrFetch } from "@/lib/utils/data";
import { handlerPartials } from "@/lib/utils/partials";

interface ApiParams extends Params {
  jenis: string;
  tahun: string;
  nomor: string;
  partials: string;
}

export const GET: APIRoute<Props, ApiParams> = async ({
  cache,
  params,
  rewrite,
  site,
}) => {
  const { jenis, tahun, nomor, partials } = params;
  const peraturan = await getPeraturan({ jenis, tahun, nomor });
  if (!peraturan) return rewrite("/404");
  const path = `${jenis}/${tahun}/${nomor}/fulltext.md`;
  const md = await readOrFetch(path, "text");
  if (!md) return rewrite("/404");
  const marked = createMarked();
  const rootTokens = marked.lexer(md) as PeraturanToken[];
  const data = handlerPartials(partials, rootTokens);
  if (!data) return rewrite("/404");
  const { tokens, title } = data;
  const url = new URL(peraturan.path + "/" + partials, site?.origin).href;

  cache.set({
    maxAge: 31536000,
    tags: ["peraturan", jenis, tahun, nomor, "og-image"],
  });

  return ImageResponse.create(
    PartialsOgImage({
      title: `${title} ${peraturan.rujukPanjang}`,
      tokens,
      url,
    }),
  );
};
