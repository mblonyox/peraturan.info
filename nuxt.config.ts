// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  typescript: {
    typeCheck: true
  },
  devtools: { enabled: true },
  modules: [
    "@nuxt/fonts",
    '@nuxt/image',
    "@nuxt/ui",
    '@nuxtjs/i18n',
    "@nuxtjs/seo"
  ],
  ui: {
    icons: ['hugeicons']
  },
  i18n: {
    langDir: "./languages",
    locales: [
      { name: "Bahasa Indonesia", code: "id", iso: "id-ID", file: "id.json" },
      { name: "English", code: "en", iso: "en-US", file: "en.json" }
    ],
    defaultLocale: 'id',
    strategy: "prefix_and_default",
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n",
      redirectOn: "root"
    },
  },
  compatibilityDate: '2024-07-23'
})