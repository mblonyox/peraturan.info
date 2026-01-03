import { ImageResponse } from "@vercel/og";

import logoDataUrl from "~/assets/logo.png?url&inline";
import type { Peraturan } from "~/models/mod.ts";
import { define } from "~/utils/define.ts";
import { ellipsis } from "~/utils/string.ts";

export const handler = define.handlers(async ({ url, state }) => {
  const cache = await caches.open("og-image");
  const cachedContent = await cache.match(url);
  if (cachedContent) return cachedContent;
  const peraturan = state.peraturan as Peraturan;
  const response = new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "space-around",
        background: "linear-gradient(to left, #212529, #343a40, #2b3035)",
      }}
    >
      <img
        src={logoDataUrl}
        style={{
          width: 256,
          height: 256,
          position: "absolute",
          bottom: 0,
          right: 0,
        }}
      />
      <div
        style={{
          marginLeft: "10%",
          marginRight: "10%",
          fontSize: 32,
          fontWeight: "bold",
          color: "#ffffff",
          lineClamp: 3,
        }}
      >
        {ellipsis(peraturan.judul, 200)}
      </div>
      <div
        style={{
          fontSize: 48,
          marginLeft: "10%",
          marginRight: "10%",
          color: "#ffffff",
        }}
      >
        {peraturan.rujukPendek}
      </div>
      <div
        style={{
          alignSelf: "center",
          fontSize: 16,
          color: "#ffffff",
        }}
      >
        {new URL(peraturan.path, url).href}
      </div>
    </div>,
  );
  cache.put(url, response.clone()).catch(() => null);
  return response;
});
