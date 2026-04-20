import { NextResponse } from "next/server";

import { createPeraturanFeed } from "../data";

export async function GET() {
  const feed = await createPeraturanFeed();
  return new NextResponse(feed.atom1(), {
    headers: { "Content-Type": "application/atom+xml; charset=utf-8" },
  });
}
