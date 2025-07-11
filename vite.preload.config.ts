import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: 'src/preload/index.ts',
      formats: ['cjs'],
    },
    rollupOptions: {
      external: ['electron'],
    },
     emptyOutDir: false,
  },
})
