import type { APIRoute, Params, Props } from "astro";
import { ImageResponse } from "cf-workers-og";

import OpenGraphImage from "@/components/OpenGraphImage";
import { YEAR } from "@/lib/constants";
import { getPeraturan } from "@/lib/db";

interface ApiParams extends Params {
  jenis: string;
  tahun: string;
  nomor: string;
}

export const GET: APIRoute<Props, ApiParams> = async ({
  cache,
  params,
  rewrite,
  site,
}) => {
  const { jenis, tahun, nomor } = params;
  const peraturan = await getPeraturan(params);
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
