import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const canonicalHostname = process.env.CANONICAL_HOSTNAME;
  if (canonicalHostname && request.nextUrl.hostname !== canonicalHostname) {
    const url = new URL(request.nextUrl);
    url.hostname = canonicalHostname;
    return NextResponse.redirect(url, 301);
  }
  return NextResponse.next();
}
