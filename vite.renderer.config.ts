import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  plugins: [vue(),vueDevTools(),tailwindcss()], // Hỗ trợ file .vue
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src/frontend'), // Khớp với tsconfig.json
    },
  },
  build: {
    // Đảm bảo build cho renderer process
    outDir: './dist',
    emptyOutDir : true ,
    
    rollupOptions: {
      // Nếu cần, thêm external modules
      external: ['electron'],
      input: path.resolve(__dirname, './index.html'),
    },

  },
});
