import { define } from "./define.ts";

export const secureHeaders = () =>
  define.middleware(async (ctx) => {
    const response = await ctx.next();
    const headers = new Headers(response.headers);
    headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains; preload",
    );
    headers.set(
      "Content-Security-Policy",
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'https://mouthful.inoxsegar.com'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self' 'https://mouthful.inoxsegar.com'; frame-ancestors 'none'; form-action 'none'; base-uri 'self';",
    );
    headers.set("X-Frame-Options", "DENY");
    headers.set("X-Content-Type-Options", "nosniff");
    headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    headers.set(
      "Permissions-Policy",
      "geolocation=(), microphone=(), camera=(), payment=(), usb=(), gyroscope=(), accelerometer=(), magnetometer=(), speaker=(), fullscreen=(), interest-cohort=()",
    );
    return new Response(response.body, { headers, status: response.status });
  });
