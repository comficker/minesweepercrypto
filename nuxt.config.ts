import {pwa} from './config/pwa'
import {appDescription} from './constants'

export default defineNuxtConfig({
  modules: [
    '@vueuse/nuxt',
    '@unocss/nuxt',
    '@pinia/nuxt',
    '@nuxtjs/color-mode',
    '@vite-pwa/nuxt',
  ],
  experimental: {
    // when using generate, payload js assets included in sw precache manifest
    // but missing on offline, disabling extraction it until fixed
    payloadExtraction: false,
    reactivityTransform: true,
    inlineSSRStyles: false,
  },
  css: [
    '~/assets/font.css',
    '@unocss/reset/tailwind.css',
  ],
  colorMode: {
    classSuffix: '',
  },
  nitro: {
    esbuild: {
      options: {
        target: 'esnext',
      },
    },
    prerender: {
      crawlLinks: false,
      ignore: ['/'],
    },
  },
  app: {
    head: {
      viewport: 'width=device-width,initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=1',
      link: [
        {rel: 'icon', href: '/favicon.png', sizes: 'any'},
        {rel: 'icon', type: 'image/png', href: '/favicon.png'},
        {rel: 'apple-touch-icon', href: '/apple-touch-icon.png'},
      ],
      meta: [
        {name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes'},
        {name: 'description', content: appDescription},
        {name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent'},
      ],
      script: [
        {
          hid: 'gtmHead',
          innerHTML: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-55P679J');`,
          body: true
        },
      ],
      htmlAttrs: {
        lang: 'en'
      }
    },
  },
  pwa,
  runtimeConfig: {
    public: {
      apiBase: process.env.API,
      socket: process.env.SOCKET
    }
  },
  sourcemap: {
    server: true,
    client: true,
  },
})
