import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: 'src/preload/preload.ts',
      formats: ['cjs'],
      fileName: () => 'preload.js',
    },
    rollupOptions: {
      external: ['electron'],
    },
     emptyOutDir: false,
  },
})
