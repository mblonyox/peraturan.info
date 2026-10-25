import type { APIRoute } from "astro";

import { YEAR } from "@/lib/constants";
import { getData } from "@/lib/utils/data";
import { $peraturanPaths } from "@/lib/utils/validate";

export const ALL: APIRoute = async ({ params, redirect, cache, rewrite }) => {
  const paths = await $peraturanPaths.safeParseAsync(params);
  if (!paths.success) return rewrite("/404");
  const { jenis, tahun, nomor } = paths.data;
  cache.set({
    maxAge: YEAR,
    tags: ["peraturan", `${jenis}/${tahun}/${nomor}`],
  });
  const path = `${jenis}/${tahun}/${nomor}/fulltext.md`;
  const md = await getData(path, { format: "text" });
  const subPath = md ? "isi" : "info";
  return redirect(`/${jenis}/${tahun}/${nomor}/${subPath}`);
};
