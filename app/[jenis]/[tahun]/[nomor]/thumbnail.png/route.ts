import { notFound } from "next/navigation";
import { type NextRequest, NextResponse } from "next/server";

import { getPeraturanData } from "../data";

type Context = RouteContext<"/[jenis]/[tahun]/[nomor]/thumbnail.png">;

export async function GET(_request: NextRequest, { params }: Context) {
  const { thumbnail } = await getPeraturanData(await params);
  if (!thumbnail) notFound();
  return new NextResponse(thumbnail, {
    headers: { "Content-Type": "image/png" },
  });
}
