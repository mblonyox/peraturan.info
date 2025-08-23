import { getCookies, setCookie } from "@std/http/cookie";
import { regexes } from "zod";

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

const setSessionId = define.middleware(async (ctx) => {
  const cookies = getCookies(ctx.req.headers);
  let sessionId = cookies["sessionId"];
  if (!sessionId || !regexes.uuid4.test(sessionId)) {
    sessionId = crypto.randomUUID();
  }
  ctx.state.sessionId = sessionId;
  const response = await ctx.next();
  if (response.headers.get("Content-Type")?.includes("text/html")) {
    const headers = new Headers(response.headers);
    setCookie(headers, {
      name: "sessionId",
      value: sessionId,
      path: "/",
      httpOnly: true,
      secure: true,
      maxAge: 31536000,
    });
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  }
  return response;
});

export const handler = [redirectHostname, setTheme, setSessionId];
