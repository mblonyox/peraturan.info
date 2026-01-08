import { resolve } from "node:path";
import { fresh } from "@fresh/plugin-vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, type Plugin } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

function copySsrAssets(): Plugin {
  return {
    ...viteStaticCopy({
      targets: [
        {
          src: "node_modules/@vercel/og/dist/resvg.wasm",
          dest: "assets",
        },
        {
          src: "node_modules/@vercel/og/dist/noto-sans-v27-latin-regular.ttf",
          dest: "assets",
        },
      ],
    }).find((p) => p.apply === "build"),
    name: "copy-ssr-assets",
    applyToEnvironment: (env) => env.name === "ssr",
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
