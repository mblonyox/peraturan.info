import type { APIRoute, Params, Props } from "astro";

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
  if (!thumbnail)
    return Response.json({ error: "Thumbnail not found" }, { status: 404 });
  cache.set({
    maxAge: YEAR,
    tags: ["peraturan", `${jenis}/${tahun}/${nomor}`],
  });
  return new Response(thumbnail, { headers: { "Content-Type": "image/png" } });
};
