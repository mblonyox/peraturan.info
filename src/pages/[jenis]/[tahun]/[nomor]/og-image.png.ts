import type { APIRoute } from "astro";
import { cache as fontCache, GoogleFont, ImageResponse } from "cf-workers-og";

import OpenGraphImage from "@/components/OpenGraphImage";
import { YEAR } from "@/lib/constants";
import { getPeraturan } from "@/lib/db";
import { $peraturanPaths } from "@/lib/utils/validate";

import { getThumbnailBytes } from "./thumbnail.png";

export const GET: APIRoute = async ({
  cache,
  params,
  rewrite,
  site,
  locals,
}) => {
  fontCache.setExecutionContext(locals.cfContext);
  const paths = $peraturanPaths.safeParse(params);
  if (!paths.success) return rewrite("/404");
  const { jenis, tahun, nomor } = paths.data;
  const peraturan = await getPeraturan({ jenis, tahun, nomor });
  if (!peraturan) return rewrite("/404");
  const url = new URL(peraturan.path, site?.origin).href;
  const thumbnail = await getThumbnailBytes(peraturan, 210, 330);

  cache.set({
    maxAge: YEAR,
    tags: [`${jenis}/${tahun}/${nomor}`, "og-image"],
  });

  return ImageResponse.create(
    OpenGraphImage({
      title: peraturan.rujukPendek,
      description: peraturan.judul,
      url,
      thumbnail,
    }),
    { fonts: [new GoogleFont("Plus Jakarta Sans")] },
  );
};
