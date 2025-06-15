
// https://vitejs.dev/config
// vite.main.config.ts
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/backend/main.ts',
      formats: ['es'],
    },
    rollupOptions: {
      external: ['electron'],
    },
  },
});

