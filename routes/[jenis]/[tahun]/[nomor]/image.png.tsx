import { encodeBase64 } from "@std/encoding/base64";
import { dirname, fromFileUrl, resolve } from "@std/path";
import type { Peraturan } from "~/models/mod.ts";
import { define } from "~/utils/define.ts";
import { ellipsis } from "~/utils/string.ts";
import { ImageResponse } from "$og_edge";

const getLogo = async () => {
  const buffer = await Deno.readFile(
    resolve(
      dirname(fromFileUrl(import.meta.url)),
      "../../../../static/icons/pwa-512x512.png",
    ),
  );
  return "data:image/png;base64," +
    encodeBase64(buffer);
};

export const handler = define.handlers(async (ctx) => {
  const cache = await caches.open("og-image");
  const cachedContent = await cache.match(ctx.url);
  if (cachedContent) return cachedContent;
  const peraturan = ctx.state.peraturan as Peraturan;
  const logo = await getLogo();
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
        src={logo}
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
        {new URL(peraturan.path, ctx.url).href}
      </div>
    </div>,
  );
  await cache.put(ctx.url, response.clone());
  return response;
});
