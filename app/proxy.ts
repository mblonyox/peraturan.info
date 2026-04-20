import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const hostname = process.env.HOSTNAME;
  if (hostname && request.nextUrl.hostname !== hostname) {
    const url = new URL(request.nextUrl);
    url.hostname = hostname;
    return NextResponse.redirect(url, 301);
  }
  return NextResponse.next();
}
