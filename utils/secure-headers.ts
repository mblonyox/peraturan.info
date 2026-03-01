import { define } from "./define.ts";

export const secureHeaders = () =>
  define.middleware(async (ctx) => {
    const response = await ctx.next();
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains; preload",
    );
    response.headers.set(
      "Content-Security-Policy",
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'https://mouthful.inoxsegar.com'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self' https://mouthful.inoxsegar.com; frame-ancestors 'none'; form-action 'none'; base-uri 'self';",
    );
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    response.headers.set(
      "Permissions-Policy",
      "geolocation=(), microphone=(), camera=(), payment=(), usb=(), gyroscope=(), accelerometer=(), magnetometer=(), speaker=(), fullscreen=(), interest-cohort=()",
    );
    return response;
  });
