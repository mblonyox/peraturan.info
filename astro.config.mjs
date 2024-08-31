import { defineConfig } from 'astro/config';
import deno from '@deno/astro-adapter';
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  integrations: [react(), tailwind({ applyBaseStyles: false })],
  output: 'server',
  adapter: deno()
}); 