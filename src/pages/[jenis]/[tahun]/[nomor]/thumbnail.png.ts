import type { APIRoute, Params, Props } from "astro";

import placeholder from "@/assets/placeholder.png?arraybuffer";
import { YEAR } from "@/lib/constants";
import { getData } from "@/lib/utils/data";

interface PathParams extends Params {
  jenis: string;
  tahun: string;
  nomor: string;
}

export const GET: APIRoute<Props, PathParams> = async ({ params, cache }) => {
  const jenis = params.jenis;
  const tahun = params.tahun;
  const nomor = params.nomor;
  const path = `${jenis}/${tahun}/${nomor}/thumbnail.png`;
  const thumbnail = await getData(path);
  cache.set({
    maxAge: YEAR,
    tags: ["peraturan", `${jenis}/${tahun}/${nomor}`],
  });
  return new Response(thumbnail ?? placeholder, {
    headers: { "Content-Type": "image/png" },
  });
};
