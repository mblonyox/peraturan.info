import { fresh } from "@fresh/plugin-vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  plugins: [
    VitePWA({ manifest: false, injectRegister: "inline" }),
    fresh(),
    tailwindcss(),
    {
      ...viteStaticCopy({
        targets: [
          {
            src: "node_modules/@hyzyla/pdfium/dist/pdfium.wasm",
            dest: "assets",
          },
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
    },
  ],
});
