import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'
import {FileSystemIconLoader} from '@iconify/utils/lib/loader/node-loaders'
import {animatedUno} from 'animated-unocss'

export default defineConfig({
  shortcuts: {},
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      collections: {
        'icons': FileSystemIconLoader(
          './assets/icons',
          svg => svg,
        )
      }
    }),
    presetTypography(),
    presetWebFonts({
      provider: 'google',
      fonts: {
        sans: 'Inter:300,400,600,700'
      }
    }),
    animatedUno()
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup()
  ],
  safelist: ['i-icons-facebook', 'i-icons-telegram', 'i-icons-twitter', 'i-icons-discord', 'i-icons-pinterest'],
  include: [/\.ts/, /\.vue$/, /\.vue\?vue/]
})
