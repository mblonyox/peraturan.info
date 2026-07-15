import { type NextConfig } from "next";

import { MOUTHFUL_URL } from "./lib/constants";

const nextConfig: NextConfig = {
  /* config options here */
  poweredByHeader: false,
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
        {
          key: "Cache-Control",
          value: "public, max-age=86400, stale-while-revalidate=2592000",
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
  images: {
    loader: "custom",
    loaderFile: "./lib/cf/image-loader.ts",
  },
};

export default nextConfig;

import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
