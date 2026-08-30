import type { APIRoute, Params, Props } from "astro";
import { ImageResponse } from "cf-workers-og";

import placeholder from "@/assets/placeholder.png?arraybuffer";
import Thumbnail from "@/components/Thumbnail";
import { YEAR } from "@/lib/constants";
import { getPeraturan } from "@/lib/db";
import { getData } from "@/lib/utils/data";

interface PathParams extends Params {
  jenis: string;
  tahun: string;
  nomor: string;
}

export const GET: APIRoute<Props, PathParams> = async ({
  params,
  cache,
  rewrite,
}) => {
  const jenis = params.jenis;
  const tahun = params.tahun;
  const nomor = params.nomor;
  const peraturan = await getPeraturan(params);
  if (!peraturan) return rewrite("/404");
  const path = `${jenis}/${tahun}/${nomor}/thumbnail.png`;
  const thumbnail = await getData(path);
  cache.set({
    maxAge: YEAR,
    tags: ["peraturan", `${jenis}/${tahun}/${nomor}`],
  });
  if (!thumbnail) {
    try {
      return ImageResponse.create(
        Thumbnail({
          jenis: peraturan.namaJenisPanjang,
          nomor: peraturan.nomorPanjang,
          judul: peraturan.judul,
        }),
        { width: 540, height: 890 },
      );
    } catch (error) {
      console.error(error);
    }
  }
  return new Response(thumbnail ?? placeholder, {
    headers: { "Content-Type": "image/png" },
  });
};
