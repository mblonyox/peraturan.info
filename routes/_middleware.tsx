import { getCookies } from "$std/http/cookie.ts";
import { MiddlewareHandler } from "$fresh/server.ts";
import { AppContext } from "@/utils/app_context.ts";

export const handler: MiddlewareHandler<AppContext>[] = [
  (req, ctx) => {
    if (ctx.destination === "route") {
      const cookies = getCookies(req.headers);
      if (cookies.theme === "dark" || cookies.theme === "light") {
        ctx.state.theme = cookies.theme;
      }
    }
    return ctx.next();
  },
  async (_req, ctx) => {
    const resp = await ctx.next();
    if (
      resp.headers.get("content-type")?.startsWith("text/html")
    ) {
      const theme = ctx.state.theme;
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
