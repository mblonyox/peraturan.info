import { getCookies } from "@std/http/cookie";

import { HOSTNAME } from "~/utils/const.ts";
import { define } from "~/utils/define.ts";
import { isValidTheme } from "~/utils/theme.ts";

const redirectHostname = define.middleware((ctx) => {
  if (HOSTNAME && ctx.url.hostname !== HOSTNAME) {
    const url = new URL(ctx.url);
    url.hostname = HOSTNAME;
    return Response.redirect(url, 301);
  }
  return ctx.next();
});

const setTheme = define.middleware((ctx) => {
  const cookies = getCookies(ctx.req.headers);
  if (isValidTheme(cookies.theme)) ctx.state.theme = cookies.theme;
  return ctx.next();
});

export const handler = [redirectHostname, setTheme];
