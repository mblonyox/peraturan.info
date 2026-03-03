import { getCookies } from "@std/http/cookie";
import { define } from "~/utils/define.ts";
import { isValidTheme } from "~/utils/theme.ts";

const setTheme = define.middleware((ctx) => {
  const cookies = getCookies(ctx.req.headers);
  if (isValidTheme(cookies.theme)) ctx.state.theme = cookies.theme;
  return ctx.next();
});

export const handler = [setTheme];
