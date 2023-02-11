import { getCookies } from "$std/http/cookie.ts";
import { MiddlewareHandlerContext } from "$fresh/server.ts";

export async function handler(req: Request, ctx: MiddlewareHandlerContext) {
  const resp = await ctx.next();
  if (
    resp.headers.get("content-type")?.startsWith("text/html")
  ) {
    const cookies = getCookies(req.headers);
    if (cookies.theme === "dark" || cookies.theme === "light") {
      const body = await resp.text();
      return new Response(
        body.replace(/<html(?=.+?>)/, `<html data-bs-theme="${cookies.theme}"`),
        {
          headers: resp.headers,
          status: resp.status,
          statusText: resp.statusText,
        },
      );
    }
  }
  return resp;
}
