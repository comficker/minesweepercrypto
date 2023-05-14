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
        {name: 'viewport', content: 'width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=1'},
        {name: 'description', content: appDescription},
        {name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent'},
      ],
      script: [
        {src: 'https://feedback.fish/ff.js?pid=8ef1a83add0137', defer: true}
      ]
    },
  },
  pwa,
  runtimeConfig: {
    public: {
      apiBase: process.env.API
    }
  },
})
