import cloudflare from "@astrojs/cloudflare";
import { cacheCloudflare } from "@astrojs/cloudflare/cache";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import AstroPWA from "@vite-pwa/astro";
import { defineConfig } from "astro/config";
import icon from "astro-iconset";
import arraybuffer from "vite-plugin-arraybuffer";

import manifest from "./src/assets/manifest.json";
import { BASE_URL } from "./src/lib/constants";

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: cloudflare(),
  integrations: [
    react(),
    icon({
      include: {
        bi: ["rss-fill", "rss", "filetype-json"],
        ri: [
          "home-line",
          "arrow-drop-down-line",
          "arrow-right-up-box-line",
          "close-line",
          "error-warning-line",
          "filter-line",
          "github-fill",
          "information-line",
          "link",
          "linkedin-box-line",
          "menu-line",
          "node-tree",
          "palette-line",
          "printer-line",
          "search-line",
          "share-line",
          "twitter-x-line",
          "whatsapp-line",
        ],
      },
    }),
    AstroPWA({
      manifest,
      pwaAssets: {
        config: true,
      },
      workbox: {
        globPatterns: ["**/*.{css,js,html,svg,png,webp,ico,txt,xml}"],
        navigateFallback: "/not-found",
        navigateFallbackAllowlist: [/^\/api/, /^\/cdn-cgi/, /^\/not-found/],
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          {
            urlPattern: ({ url, sameOrigin }) =>
              sameOrigin && url.pathname.endsWith("thumbnail.png"),
            handler: "CacheFirst",
            options: { cacheName: "thumbnail-cache" },
          },
          {
            urlPattern: ({ url, sameOrigin, request }) =>
              sameOrigin &&
              request.mode === "navigate" &&
              !url.pathname.match(/^\/not-found/),
            handler: "NetworkFirst",
            options: {
              cacheName: "offline-ssr-pages-cache",
              /* check the options in the workbox-build docs */
              matchOptions: {
                ignoreVary: true,
                ignoreSearch: false,
              },
              cacheableResponse: {
                statuses: [200],
              },
              expiration: {
                maxEntries: 100,
              },
              plugins: [
                {
                  cachedResponseWillBeUsed: async (params) => {
                    // When handlerDidError is invoked, then we can prevent redirecting if there is an entry in the cache.
                    // To check the behavior, navigate to a product page, then disable the network and refresh the page.
                    params.state ??= {};
                    params.state.dontRedirect = params.cachedResponse;
                    console.log(
                      `[SW] cachedResponseWillBeUsed ${params.request.url}, ${params.state ? JSON.stringify(params.state) : ""}`,
                    );
                  },
                  // This callback will be called when the fetch call fails.
                  // Beware of the logic, will be also invoked if the server is down.
                  handlerDidError: async ({ request, state, error }) => {
                    if (state?.dontRedirect) {
                      return state.dontRedirect;
                    }

                    console.log(
                      `[SW] handlerDidError ${request.url}, ${state ? JSON.stringify(state) : ""}`,
                    );
                    return error &&
                      "name" in error &&
                      error.name === "no-response"
                      ? Response.redirect(state.dontRedirect.url, 404)
                      : undefined;
                  },
                },
              ],
            },
          },
        ],
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss(), arraybuffer()],
    resolve: {
      alias: {
        "@": "/src",
      },
    },
  },
  cache: {
    provider: cacheCloudflare(),
  },
  site: BASE_URL,
  session: false,
  image: { domains: [new URL(BASE_URL).hostname] },
});
