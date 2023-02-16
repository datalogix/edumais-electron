import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import Vue from '@vitejs/plugin-vue'
import Unocss from 'unocss/vite'
import Components from 'unplugin-vue-components/vite'
import { PrimeVueResolver, VueUseComponentsResolver } from 'unplugin-vue-components/resolvers'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import AutoImport from 'unplugin-auto-import/vite'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [
      Vue(),
      Unocss(),
      Components({
        dts: resolve('src/renderer/src/components.d.ts'),
        directoryAsNamespace: true,
        globalNamespaces: ['Global'],
        dirs: [resolve('src/renderer/src/components')],
        resolvers: [
          PrimeVueResolver({
            importStyle: false,
            importIcons: false,
            prefix: 'P'
          }),

          IconsResolver({
            prefix: 'Icon'
          }),

          VueUseComponentsResolver()
        ]
      }),
      Icons({
        autoInstall: true
      }),
      AutoImport({
        dts: resolve('src/renderer/src/auto-imports.d.ts'),
        imports: [
          'vue',
          'vue-router',
          '@vueuse/core'
        ],
        dirs: [resolve('src/renderer/src/composables')],
        eslintrc: {
          enabled: true
        }
      })
    ]
  }
})
