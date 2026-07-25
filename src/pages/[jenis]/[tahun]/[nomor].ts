import type { APIRoute, Params, Props } from "astro";

import { getPeraturanMarkdown } from "./[nomor]/data";

interface ApiParams extends Params {
  jenis: string;
  tahun: string;
  nomor: string;
}

export const GET: APIRoute<Props, ApiParams> = async ({
  params,
  redirect,
  rewrite,
}) => {
  const { jenis, tahun, nomor } = params;
  const md = await getPeraturanMarkdown({ jenis, tahun, nomor });
  if (!md) return rewrite("/404");
  const subPath = md ? "isi" : "info";
  return redirect(`/${jenis}/${tahun}/${nomor}/${subPath}`);
};
