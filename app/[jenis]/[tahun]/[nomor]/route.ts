import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";

import { getPeraturanData } from "./data";

type Context = RouteContext<"/[jenis]/[tahun]/[nomor]">;

export async function GET(_: NextRequest, { params }: Context) {
  const { jenis, tahun, nomor } = await params;
  const { md } = await getPeraturanData({ jenis, tahun, nomor });
  const subPath = md ? "isi" : "info";
  return redirect(`/${jenis}/${tahun}/${nomor}/${subPath}`);
}
