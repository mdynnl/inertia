import laravel from 'laravel-vite-plugin'
import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'

export default defineConfig({
  plugins: [
    laravel({
      input: ['resources/css/app.css', 'resources/js/app.tsx'],
      ssr: 'resources/js/ssr.tsx',
      refresh: true,
    }),
    solid({}),
  ],
  resolve: {
    alias: {
      '~': 'resources/js',
    },
  },
})
