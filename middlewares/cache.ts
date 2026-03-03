import type { Context, Middleware } from "fresh";

type CacheOptions<T = unknown> = {
  cacheName: string | ((ctx: Context<T>) => string | Promise<string>);
  cacheControl?: string;
  vary?: string;
  keyGenerator?: (ctx: Context<T>) => string | Promise<string>;
  cacheableStatusCodes?: number[];
};

const defaultCacheableStatusCodes = [200];

const shouldSkipCache = (res: Response) => {
  const vary = res.headers.get("Vary");
  if (vary && vary.includes("*")) {
    return true;
  }

  const cacheControl = res.headers.get("Cache-Control");
  if (
    cacheControl &&
    /(?:^|,\s*)(?:private|no-(?:store|cache))(?:\s*(?:=|,|$))/i.test(
      cacheControl,
    )
  ) {
    return true;
  }

  if (res.headers.has("Set-Cookie")) {
    return true;
  }

  return false;
};

export function cache<T>(options: CacheOptions<T>): Middleware<T> {
  // RFC 7231 Section 7.1.4 specifies that "*" is not allowed in Vary header.
  // See: https://datatracker.ietf.org/doc/html/rfc7231#section-7.1.4
  if (options.vary?.includes("*")) {
    throw new Error(
      'Middleware vary configuration cannot include "*", as it disallows effective caching.',
    );
  }
  const keyGenerator = options.keyGenerator ?? ((ctx) => ctx.url.toString());
  const cacheControlDirectives = options.cacheControl
    ?.split(",")
    .map((directive) => directive.toLowerCase());
  const varyDirectives = options.vary
    ?.split(",")
    .map((directive) => directive.trim());
  const addHeader = (res: Response) => {
    const headers = new Headers(res.headers);
    if (cacheControlDirectives) {
      const existingDirectives = headers
        .get("Cache-Control")
        ?.split(",")
        .map((d) => d.trim().split("=", 1)[0]) ?? [];
      for (const directive of cacheControlDirectives) {
        let [name, value] = directive.trim().split("=", 2);
        name = name.toLowerCase();
        if (!existingDirectives.includes(name)) {
          headers.append(
            "Cache-Control",
            `${name}${value ? `=${value}` : ""}`,
          );
        }
      }
    }
    if (varyDirectives) {
      const existingDirectives = headers
        .get("Vary")
        ?.split(",")
        .map((d) => d.trim()) ?? [];

      const vary = Array.from(
        new Set(
          [...existingDirectives, ...varyDirectives].map((directive) =>
            directive.toLowerCase()
          ),
        ),
      ).sort();

      if (vary.includes("*")) {
        headers.set("Vary", "*");
      } else {
        headers.set("Vary", vary.join(", "));
      }
    }
    return new Response(res.body, { headers, status: res.status });
  };

  const cacheableStatusCodes = new Set<number>(
    options.cacheableStatusCodes ?? defaultCacheableStatusCodes,
  );

  return async (ctx) => {
    const key = await keyGenerator(ctx);
    const cacheName = typeof options.cacheName === "function"
      ? await options.cacheName(ctx)
      : options.cacheName;
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(key);
    if (cachedResponse) return cachedResponse;
    let response = await ctx.next();
    if (!cacheableStatusCodes.has(response.status)) return response;
    response = addHeader(response);
    if (shouldSkipCache(response)) return response;
    await cache.put(key, response.clone());
    return response;
  };
}
