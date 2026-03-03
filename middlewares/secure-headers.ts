import type { Middleware } from "fresh";

export function secureHeaders<T>(): Middleware<T> {
  return async (ctx) => {
    const response = await ctx.next();
    const headers = new Headers(response.headers);
    headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains; preload",
    );
    headers.set(
      "Content-Security-Policy",
      [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com", // unsafe-inline needed for fresh
        "style-src 'self' 'unsafe-inline' blob:",
        "font-src 'self'",
        "img-src 'self' data:",
        "media-src 'self' data: blob:",
        "worker-src 'self' blob:",
        "connect-src 'self' https://mouthful.inoxsegar.com",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "frame-ancestors 'none'",
        "frame-src 'self' https://docs.google.com",
        "upgrade-insecure-requests",
      ].join("; "),
    );
    headers.set("X-Frame-Options", "DENY");
    headers.set("X-Content-Type-Options", "nosniff");
    headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    headers.set(
      "Permissions-Policy",
      "geolocation=(), microphone=(), camera=(), payment=(), usb=(), gyroscope=(), accelerometer=(), magnetometer=(), fullscreen=(), interest-cohort=()",
    );
    return new Response(response.body, { headers, status: response.status });
  };
}
