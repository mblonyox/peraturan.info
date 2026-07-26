import type { APIRoute, Params, Props } from "astro";

import { getPeraturanMarkdown } from "./[nomor]/data";

interface ApiParams extends Params {
  jenis: string;
  tahun: string;
  nomor: string;
}

export const ALL: APIRoute<Props, ApiParams> = async ({
  params,
  redirect,
  rewrite,
  cache,
}) => {
  const { jenis, tahun, nomor } = params;
  cache.set({
    maxAge: 86400,
    swr: 259200,
    tags: ["peraturan", jenis, tahun, nomor],
  });
  const md = await getPeraturanMarkdown({ jenis, tahun, nomor });
  if (!md) return rewrite("/404");
  const subPath = md ? "isi" : "info";
  return redirect(`/${jenis}/${tahun}/${nomor}/${subPath}`);
};
