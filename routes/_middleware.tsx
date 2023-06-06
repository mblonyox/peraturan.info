import { getCookies } from "$std/http/cookie.ts";
import { MiddlewareHandler } from "$fresh/server.ts";

type State = {
  theme?: "dark" | "light";
};

export const handler: MiddlewareHandler<State>[] = [
  (req, ctx) => {
    const cookies = getCookies(req.headers);
    if (cookies.theme === "dark" || cookies.theme === "light") {
      ctx.state.theme = cookies.theme;
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
