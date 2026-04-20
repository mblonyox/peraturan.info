import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

import { getPeraturanData } from "./data";

type Context = RouteContext<"/[jenis]/[tahun]/[nomor]">;

export async function GET(request: NextRequest, { params }: Context) {
  const { md } = await getPeraturanData(await params);
  const subPath = md ? "/isi" : "/info";
  return redirect(`${request.url}${subPath}`);
}
