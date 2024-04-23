// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  typescript: {
    typeCheck: true
  },
  devtools: { enabled: true },
  modules: [
    'nuxt-primevue',
    '@nuxt/image',
    '@nuxtjs/i18n',
    '@nuxtjs/sitemap'
  ],
  css: [
    'primevue/resources/themes/aura-dark-cyan/theme.css',
    'primeicons/primeicons.css']
})