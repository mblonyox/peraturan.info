import { getCookies } from "$std/http/cookie.ts";
import { MiddlewareHandlerContext } from "$fresh/server.ts";

export const handler = [
  (req: Request, ctx: MiddlewareHandlerContext) => {
    ctx.state["url"] = req.url;
    const cookies = getCookies(req.headers);
    if (cookies.theme === "dark" || cookies.theme === "light") {
      ctx.state["theme"] = cookies.theme;
    }
    return ctx.next();
  },
  async (_req: Request, ctx: MiddlewareHandlerContext) => {
    const resp = await ctx.next();
    if (
      resp.headers.get("content-type")?.startsWith("text/html")
    ) {
      const theme = ctx.state["theme"];
      if (theme) {
        const body = await resp.text();
        return new Response(
          body.replace(/<html(?=.+?>)/, `<html data-bs-theme="${theme}"`),
          {
            headers: resp.headers,
            status: resp.status,
            statusText: resp.statusText,
          },
        );
      }
    }
    return resp;
  },
];
