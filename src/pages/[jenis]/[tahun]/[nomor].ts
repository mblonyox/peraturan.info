import type { APIRoute, Params, Props } from "astro";

import { YEAR } from "@/lib/constants";
import { getData } from "@/lib/utils/data";

interface ApiParams extends Params {
  jenis: string;
  tahun: string;
  nomor: string;
}

export const ALL: APIRoute<Props, ApiParams> = async ({
  params,
  redirect,
  cache,
}) => {
  const { jenis, tahun, nomor } = params;
  cache.set({
    maxAge: YEAR,
    tags: ["peraturan", `${jenis}/${tahun}/${nomor}`],
  });
  const path = `${jenis}/${tahun}/${nomor}/fulltext.md`;
  const md = await getData(path, { format: "text" });
  const subPath = md ? "isi" : "info";
  return redirect(`/${jenis}/${tahun}/${nomor}/${subPath}`);
};
