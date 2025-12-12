// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  app: {
    head: {
      title: 'AgileMunk',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Simple agile tool for personal projects' }
      ]
    }
  },

  css: ['~/assets/css/main.css'],

  compatibilityDate: '2024-12-12'
})
