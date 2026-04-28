import { type NextConfig } from "next";
import { PHASE_PRODUCTION_SERVER } from "next/constants";

export default function AppConfig(phase: string) {
  const nextConfig: NextConfig = {
    /* config options here */
    output: "standalone",
    headers() {
      return [
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
      ];
    },
  };

  if (phase === PHASE_PRODUCTION_SERVER) {
    nextConfig.rewrites = () => [
      {
        source: "/api/mouthful/:path*",
        destination: `${process.env.MOUTHFUL_URL}/:path*`,
      },
    ];
  }

  return nextConfig;
}
