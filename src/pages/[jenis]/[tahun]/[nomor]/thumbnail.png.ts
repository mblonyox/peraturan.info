import type { APIRoute, Params, Props } from "astro";

import { readOrFetch } from "@/lib/utils/data";

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
  const thumbnail = await readOrFetch(path);
  if (!thumbnail)
    return Response.json({ error: "Thumbnail not found" }, { status: 404 });
  cache.set({
    maxAge: 31536000,
    tags: ["peraturan", jenis, tahun, nomor, "thumbnail"],
  });
  return new Response(thumbnail, { headers: { "Content-Type": "image/png" } });
};
