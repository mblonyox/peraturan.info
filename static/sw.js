/// <reference types="https://raw.githubusercontent.com/DefinitelyTyped/DefinitelyTyped/master/types/workbox-sw/index.d.ts" />
/// <reference no-default-lib="true"/>
/// <reference lib="webworker" />

importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/7.0.0/workbox-sw.js",
);

const CACHE = "peraturan-cache-v1.0";
(() => {
  /**
   * @type {ServiceWorkerGlobalScope}
   */
  const self = globalThis.self;

  self.addEventListener("message", (event) => {
    if (event.data && event.data.type === "SKIP_WAITING") {
      caches.keys().then((cacheNames) => {
        cacheNames.forEach((cacheName) => {
          caches.delete(cacheName);
        });
      });
      self.skipWaiting();
    }
  });
})();

workbox.routing.registerRoute(
  new RegExp("https://cdn\\.jsdelivr\\.net/(.*)"),
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
