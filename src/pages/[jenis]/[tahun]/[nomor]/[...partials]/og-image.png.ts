import type { APIRoute } from "astro";
import { cache as fontCache, GoogleFont, ImageResponse } from "cf-workers-og";
import { z } from "zod";

import PartialsOgImage from "@/components/partials/OgImage";
import { YEAR } from "@/lib/constants";
import { getPeraturan } from "@/lib/db";
import { marked, type PeraturanToken } from "@/lib/marked";
import { getData } from "@/lib/utils/data";
import { handlerPartials } from "@/lib/utils/partials";
import { $peraturanPaths } from "@/lib/utils/validate";

export const GET: APIRoute = async ({
  cache,
  params,
  rewrite,
  site,
  locals,
}) => {
  fontCache.setExecutionContext(locals.cfContext);
  const paths = await $peraturanPaths
    .extend({ partials: z.string() })
    .safeParseAsync(params);
  if (!paths.success) return rewrite("/404");
  const { jenis, tahun, nomor, partials } = paths.data;
  const peraturan = await getPeraturan({ jenis, tahun, nomor });
  if (!peraturan) return rewrite("/404");
  const path = `${jenis}/${tahun}/${nomor}/fulltext.md`;
  const md = await getData(path, { format: "text" });
  if (!md) return rewrite("/404");
  let rootTokens = marked.lexer(md) as PeraturanToken[];
  if (partials === "isi") {
    rootTokens = rootTokens.filter((t) =>
      [
        "judul",
        "frasa-jabatan",
        "konsideran",
        "dasar-hukum",
        "diktum",
      ].includes(t.type),
    );
  }
  const data = handlerPartials(partials, rootTokens);
  if (!data) return rewrite("/404");
  const { tokens, title } = data;
  const url = new URL(peraturan.path + "/" + partials, site?.origin).href;

  cache.set({
    maxAge: YEAR,
    tags: [`${jenis}/${tahun}/${nomor}`, "og-image"],
  });

  return ImageResponse.create(
    PartialsOgImage({
      title: `${title} ${peraturan.rujukPanjang}`,
      tokens,
      url,
    }),
    {
      fonts: [
        new GoogleFont("Plus Jakarta Sans"),
        new GoogleFont("EB Garamond", { weight: 400 }),
      ],
    },
  );
};
