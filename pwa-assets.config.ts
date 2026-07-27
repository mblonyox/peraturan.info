import {
  createAppleSplashScreens,
  defineConfig,
  minimal2023Preset,
} from "@vite-pwa/assets-generator/config";

export default defineConfig({
  headLinkOptions: {
    preset: "2023",
  },
  preset: {
    ...minimal2023Preset,
    appleSplashScreens: createAppleSplashScreens(
      {
        padding: 0.3,
        resizeOptions: {
          fit: "contain",
          background: {
            r: 238,
            g: 238,
            b: 238,
          },
        },
        darkResizeOptions: {
          fit: "contain",
          background: { r: 21, g: 25, b: 30 },
        },
        linkMediaOptions: {
          log: true,
          addMediaScreen: true,
          xhtml: true,
        },
      },
      ['iPad Air 9.7"'],
    ),
  },
  images: "public/logo.webp",
});
