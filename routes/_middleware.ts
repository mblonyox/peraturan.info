import { FreshContext } from "$fresh/server.ts";
import { HOSTNAME } from "../utils/const.ts";

export const handler = (_req: Request, ctx: FreshContext) => {
  if (HOSTNAME && ctx.url.hostname !== HOSTNAME) {
    const url = new URL(ctx.url);
    url.hostname = HOSTNAME;
    return Response.redirect(url, 308);
  }
  return ctx.next();
};
