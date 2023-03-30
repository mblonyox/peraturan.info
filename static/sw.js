const CACHE = "peraturan-cache-v1.0";

importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js",
);
// import("https://esm.sh/workbox-sw@6.5.4");

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

workbox.routing.registerRoute(
  "https://cdn.jsdelivr.net/(.*)",
  new workbox.strategies.CacheFirst({
    cacheName: "cdn-cache",
  }),
);

workbox.routing.registerRoute(
  ({ request }) => request.destination === "image",
  new workbox.strategies.CacheFirst({
    cacheName: "images-cache",
  }),
);

workbox.routing.registerRoute(
  new RegExp("/*"),
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: CACHE,
  }),
);
