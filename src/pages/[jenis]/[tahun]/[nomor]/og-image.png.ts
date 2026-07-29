import type { APIRoute, Params, Props } from "astro";
import { ImageResponse } from "cf-workers-og";

import OpenGraphImage from "@/components/OpenGraphImage";
import { BASE_URL } from "@/lib/constants";
import { getPeraturan } from "@/lib/db";

interface ApiParams extends Params {
  jenis: string;
  tahun: string;
  nomor: string;
}

export const GET: APIRoute<Props, ApiParams> = async ({
  params,
  rewrite,
  cache,
}) => {
  const { jenis, tahun, nomor } = params;
  const peraturan = await getPeraturan(params);
  if (!peraturan) return rewrite("/404");
  const url = new URL(peraturan.path, BASE_URL).href;

  cache.set({
    maxAge: 31536000,
    tags: ["peraturan", jenis, tahun, nomor, "og-image"],
  });

  return ImageResponse.create(
    OpenGraphImage({
      title: peraturan.judul,
      description: peraturan.rujukPendek,
      url,
    }),
  );
};
