import type { APIRoute } from "astro";
import { ImageResponse } from "cf-workers-og";

import placeholder from "@/assets/placeholder.png?arraybuffer";
import Thumbnail from "@/components/Thumbnail";
import { YEAR } from "@/lib/constants";
import { getPeraturan } from "@/lib/db";
import { getData } from "@/lib/utils/data";
import { $peraturanPaths } from "@/lib/utils/validate";

export const GET: APIRoute = async ({ params, cache, rewrite }) => {
  const paths = $peraturanPaths.safeParse(params);
  if (!paths.success) return rewrite("/404");
  const { jenis, tahun, nomor } = paths.data;
  const peraturan = await getPeraturan({ jenis, tahun, nomor });
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
