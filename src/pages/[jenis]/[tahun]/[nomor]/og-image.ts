import type { APIRoute, Params, Props } from "astro";
import { ImageResponse } from "cf-workers-og";

import OpenGraphImage from "@/components/OpenGraphImage";
import { BASE_URL } from "@/lib/constants";

import { getPeraturanData } from "./data";

interface ApiParams extends Params {
  jenis: string;
  tahun: string;
  nomor: string;
}

export const GET: APIRoute<Props, ApiParams> = async ({ params, rewrite }) => {
  const peraturan = await getPeraturanData(params);
  if (!peraturan) return rewrite("/404");
  const url = new URL(peraturan.path, BASE_URL).href;

  return ImageResponse.create(
    OpenGraphImage({
      title: peraturan.judul,
      description: peraturan.rujukPendek,
      url,
    }),
  );
};
