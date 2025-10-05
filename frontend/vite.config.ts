import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: { transformAssetUrls }
    }),
    vueJsx(),
    vueDevTools(),
    quasar({
      // Using custom theme system instead of sassVariables
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @import "@/themes/quasar-admin/variables.scss";
          @import "@/themes/garnet-night/variables.scss";
        `
      }
    }
  },
  server: {
    port: 1811,
    host: true,
    strictPort: false
  }
})
