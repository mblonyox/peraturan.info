import { NextResponse } from "next/server";
import { createPeraturanFeed } from "../data";

export async function GET() {
  const feed = await createPeraturanFeed();
  return new NextResponse(feed.rss2(), {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
