import { type NextConfig } from "next";
import { PHASE_PRODUCTION_BUILD } from "next/constants";

import { MOUTHFUL_URL } from "./lib/constants";

export default function AppConfig(phase: string) {
  const nextConfig: NextConfig = {
    /* config options here */
    output: "standalone",
    poweredByHeader: false,
    env: {
      SKIP_REMOTE_DATA: phase === PHASE_PRODUCTION_BUILD ? "true" : undefined,
    },
    headers: () => [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
      {
        source: "/search.xml",
        headers: [
          {
            key: "Content-Type",
            value: "application/opensearchdescription+xml",
          },
        ],
      },
    ],
    rewrites: () => [
      {
        source: "/api/mouthful/:path*",
        destination: `${MOUTHFUL_URL}/:path*`,
      },
    ],
  };

  return nextConfig;
}
