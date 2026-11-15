import type { APIRoute } from "astro";
import { ImageResponse } from "cf-workers-og";
import { resize } from "pixl-resize";

import placeholder from "@/assets/placeholder.png?arraybuffer";
import Thumbnail from "@/components/Thumbnail";
import { YEAR } from "@/lib/constants";
import { getPeraturan } from "@/lib/db";
import { getData } from "@/lib/utils/data";
import { $peraturanPaths } from "@/lib/utils/validate";

export const GET: APIRoute = async ({ params, cache, rewrite, url }) => {
  const paths = $peraturanPaths.safeParse(params);
  if (!paths.success) return rewrite("/404");
  const { jenis, tahun, nomor } = paths.data;
  const peraturan = await getPeraturan({ jenis, tahun, nomor });
  if (!peraturan) return rewrite("/404");
  const path = `${jenis}/${tahun}/${nomor}/thumbnail.png`;
  let thumbnail = await getData(path);
  cache.set({
    maxAge: YEAR,
    tags: ["peraturan", `${jenis}/${tahun}/${nomor}`],
  });
  if (!thumbnail) {
    try {
      const imageResponse = await ImageResponse.create(
        Thumbnail({
          jenis: peraturan.namaJenisPanjang,
          nomor: peraturan.nomorPanjang,
          judul: peraturan.judul,
        }),
        { width: 540, height: 890 },
      );
      thumbnail = await imageResponse.arrayBuffer();
    } catch (error) {
      console.error(error);
    }
  }
  thumbnail ??= placeholder;
  const width = Number(url.searchParams.get("width")) || undefined;
  const height = Number(url.searchParams.get("height")) || undefined;
  if (width && height) {
    const input = Buffer.from(thumbnail);
    thumbnail = resize(input, { width, height }).buffer as ArrayBuffer;
  }
  return new Response(thumbnail, {
    headers: {
      "Content-Type": "image/png",
      "No-Vary-Search": 'key-order, params, except("width" "height")',
    },
  });
};
