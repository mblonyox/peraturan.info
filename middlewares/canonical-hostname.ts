import type { Middleware } from "fresh";

type Options = {
  hostname: string;
  exclude?: (string | RegExp)[];
};

export function canonicalHostname<T = unknown>(
  { hostname, exclude }: Options,
): Middleware<T> {
  return (ctx) => {
    if (
      hostname !== ctx.url.hostname &&
      !exclude?.some((t) => {
        if (typeof t === "string") {
          return ctx.url.hostname === t;
        }
        return t.test(ctx.url.hostname);
      })
    ) {
      const url = new URL(ctx.url);
      url.hostname = hostname;
      return Response.redirect(url, 301);
    }
    return ctx.next();
  };
}
