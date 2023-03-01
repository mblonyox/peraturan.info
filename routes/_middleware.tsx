import { getCookies } from "$std/http/cookie.ts";
import { MiddlewareHandler } from "$fresh/server.ts";
import { AppContextState } from "@/utils/app_context.tsx";
import { generate_social_image } from "@/utils/social_image.ts";

export const handler: MiddlewareHandler<AppContextState>[] = [
  (req, ctx) => {
    ctx.state.url = req.url;
    const cookies = getCookies(req.headers);
    if (cookies.theme === "dark" || cookies.theme === "light") {
      ctx.state.theme = cookies.theme;
    }
    return ctx.next();
  },
  async (req, ctx) => {
    const response = await ctx.next();
    const url = req.url;
    const socialImage = new URL(url).searchParams.get("social-image");
    const seo = ctx.state.seo;
    if ((socialImage !== null) && seo) {
      const image = await generate_social_image({ ...seo, url });
      return new Response(image);
    }
    return response;
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
