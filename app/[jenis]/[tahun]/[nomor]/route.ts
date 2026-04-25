import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";

import { getPeraturanData } from "./data";

type Context = RouteContext<"/[jenis]/[tahun]/[nomor]">;

export async function GET(_: NextRequest, { params }: Context) {
  const { md } = await getPeraturanData(await params);
  const subPath = md ? "isi" : "info";
  return redirect(`./${subPath}`);
}
