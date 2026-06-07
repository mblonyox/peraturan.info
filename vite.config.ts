import { resolve } from "node:path";
import { cloudflare } from "@cloudflare/vite-plugin";
import { fresh } from "@fresh/plugin-vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, type Plugin } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

function copySsrAssets(): Plugin {
  return {
    ...viteStaticCopy({
      environment: "ssr",
      targets: [
        {
          src: "node_modules/@vercel/og/dist/resvg.wasm",
          dest: "assets",
        },
        {
          src: "node_modules/@vercel/og/dist/Geist-Regular.ttf",
          dest: "assets",
        },
      ],
    }).find((p) => p.apply === "build"),
    name: "copy-ssr-assets",
  };
}

export default defineConfig({
  plugins: [
    fresh(),
    tailwindcss(),
    copySsrAssets(),
    cloudflare(),
  ],
  resolve: {
    alias: {
      "~": resolve(__dirname, "./"),
    },
  },
});
