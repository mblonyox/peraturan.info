import { notFound, redirect } from "next/navigation";
import type { NextRequest } from "next/server";

import { getPeraturanMarkdown } from "./data";

type Context = RouteContext<"/[jenis]/[tahun]/[nomor]">;

export async function GET(_: NextRequest, { params }: Context) {
  const { jenis, tahun, nomor } = await params;
  const md = await getPeraturanMarkdown({ jenis, tahun, nomor });
  if (!md) notFound();
  const subPath = md ? "isi" : "info";
  return redirect(`/${jenis}/${tahun}/${nomor}/${subPath}`);
}
