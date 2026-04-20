import { NextResponse } from "next/server";
import { createPeraturanFeed } from "../data";

export async function GET() {
  const feed = await createPeraturanFeed();
  return new NextResponse(feed.json1(), {
    headers: { "Content-Type": "application/feed+json; charset=utf-8" },
  });
}
