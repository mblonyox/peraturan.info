import type { APIRoute, Params, Props } from "astro";
import { ImageResponse } from "cf-workers-og";

import OpenGraphImage from "@/components/OpenGraphImage";

export const prerender = true;

interface ApiParams extends Params {
  jenis: string;
  tahun: string;
  nomor: string;
}

export const GET: APIRoute<Props, ApiParams> = async () => {
  return ImageResponse.create(
    OpenGraphImage({
      title: "Peraturan.Info",
      description:
        "Peraturan.Info adalah upaya untuk meningkatkan cara penyajian " +
        "peraturan perundang-undangan di Indonesia sehingga lebih user-friendly " +
        "yang terinspirasi dari legislation.gov.uk.",
      url: "https://peraturan.info",
    }),
  );
};
