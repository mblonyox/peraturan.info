import type { APIRoute } from "astro";
import { ImageResponse } from "cf-workers-og";

import OpenGraphImage from "@/components/OpenGraphImage";
import { YEAR } from "@/lib/constants";
import { getPeraturan } from "@/lib/db";
import { $peraturanPaths } from "@/lib/utils/validate";

export const GET: APIRoute = async ({ cache, params, rewrite, site }) => {
  const paths = $peraturanPaths.safeParse(params);
  if (!paths.success) return rewrite("/404");
  const { jenis, tahun, nomor } = paths.data;
  const peraturan = await getPeraturan({ jenis, tahun, nomor });
  if (!peraturan) return rewrite("/404");
  const url = new URL(peraturan.path, site?.origin).href;

  cache.set({
    maxAge: YEAR,
    tags: ["peraturan", `${jenis}/${tahun}/${nomor}`],
  });

  return ImageResponse.create(
    OpenGraphImage({
      title: peraturan.judul,
      description: peraturan.rujukPendek,
      url,
    }),
  );
};
