import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'url'

export default defineConfig({
  plugins: [vue(), vueDevTools(), tailwindcss()],
   base: './',
   resolve: {
     alias: {
       // '@': fileURLToPath(new URL('./src', import.meta.url))
       '@': path.resolve(__dirname, './src/frontend'),
     },
   },
  
})
