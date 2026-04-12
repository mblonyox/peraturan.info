import { resolve } from "node:path";
import { fresh } from "@fresh/plugin-vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, type Plugin } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

function copySsrAssets(): Plugin {
  const copyOnBuild = viteStaticCopy({
    environment: "ssr",
    targets: [
      {
        src: "node_modules/@vercel/og/dist/resvg.wasm",
        dest: "assets",
        rename: { stripBase: true },
      },
      {
        src: "node_modules/@vercel/og/dist/Geist-Regular.ttf",
        dest: "assets",
        rename: { stripBase: true },
      },
    ],
  }).find((p) => p.apply === "build");

  return {
    ...copyOnBuild,
    name: "copy-ssr-assets",
  };
}

export default defineConfig({
  plugins: [
    fresh(),
    tailwindcss(),
    copySsrAssets(),
  ],
  resolve: {
    alias: {
      "~": resolve(__dirname, "./"),
    },
  },
});
