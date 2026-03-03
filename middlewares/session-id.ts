import { type Cookie, getCookies, setCookie } from "@std/http/cookie";
import type { Middleware } from "fresh";
import { regexes } from "zod";

export function sessionId<T = unknown>(name = "sessionId"): Middleware<T> {
  const cookieName = "__Host-" + name;
  return async (ctx) => {
    const cookies = getCookies(ctx.req.headers);
    let sessionId = cookies[cookieName];
    let cookie: Cookie | undefined;
    if (!sessionId || !regexes.uuid4.test(sessionId)) {
      sessionId = crypto.randomUUID();
      cookie = {
        name: cookieName,
        value: sessionId,
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "Lax",
        maxAge: 31536000,
      };
    }
    const response = await ctx.next();
    if (cookie) {
      const headers = new Headers(response.headers);
      setCookie(headers, cookie);
      return new Response(response.body, {
        status: response.status,
        headers,
      });
    }
    return response;
  };
}
