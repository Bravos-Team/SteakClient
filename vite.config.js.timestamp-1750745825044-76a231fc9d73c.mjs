// vite.config.js
import tailwindcss from "file:///home/tvt/Code/DuAnTotNghiep/SteakClient/node_modules/@tailwindcss/vite/dist/index.mjs";
import { defineConfig } from "file:///home/tvt/Code/DuAnTotNghiep/SteakClient/node_modules/vite/dist/node/index.js";
import vue from "file:///home/tvt/Code/DuAnTotNghiep/SteakClient/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import electron from "file:///home/tvt/Code/DuAnTotNghiep/SteakClient/node_modules/electron/index.js";
import vueDevTools from "file:///home/tvt/Code/DuAnTotNghiep/SteakClient/node_modules/vite-plugin-vue-devtools/dist/vite.mjs";
import path from "path";
var __vite_injected_original_dirname = "/home/tvt/Code/DuAnTotNghiep/SteakClient";
var vite_config_default = defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    tailwindcss()
  ],
  base: "./",
  resolve: {
    alias: {
      // '@': fileURLToPath(new URL('./src', import.meta.url))
      "@": path.resolve(__vite_injected_original_dirname, "./src/frontend")
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS90dnQvQ29kZS9EdUFuVG90TmdoaWVwL1N0ZWFrQ2xpZW50XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS90dnQvQ29kZS9EdUFuVG90TmdoaWVwL1N0ZWFrQ2xpZW50L3ZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3R2dC9Db2RlL0R1QW5Ub3ROZ2hpZXAvU3RlYWtDbGllbnQvdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyBmaWxlVVJMVG9QYXRoLCBVUkwgfSBmcm9tICdub2RlOnVybCdcbmltcG9ydCB0YWlsd2luZGNzcyBmcm9tICdAdGFpbHdpbmRjc3Mvdml0ZSdcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnXG5pbXBvcnQgdnVlIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZSdcbmltcG9ydCBlbGVjdHJvbiBmcm9tICdlbGVjdHJvbidcbmltcG9ydCB2dWVEZXZUb29scyBmcm9tICd2aXRlLXBsdWdpbi12dWUtZGV2dG9vbHMnXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuXG4vLyBodHRwczovL3ZpdGUuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtcbiAgICB2dWUoKSxcbiAgICB2dWVEZXZUb29scygpLHRhaWx3aW5kY3NzKCksXG4gIF0sXG4gIGJhc2UgOiAnLi8nLFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgIC8vICdAJzogZmlsZVVSTFRvUGF0aChuZXcgVVJMKCcuL3NyYycsIGltcG9ydC5tZXRhLnVybCkpXG4gICAgICAnQCc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYy9mcm9udGVuZCcpLFxuICAgIH0sXG4gIH0sXG59KVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUNBLE9BQU8saUJBQWlCO0FBQ3hCLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sU0FBUztBQUNoQixPQUFPLGNBQWM7QUFDckIsT0FBTyxpQkFBaUI7QUFDeEIsT0FBTyxVQUFVO0FBTmpCLElBQU0sbUNBQW1DO0FBU3pDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLElBQUk7QUFBQSxJQUNKLFlBQVk7QUFBQSxJQUFFLFlBQVk7QUFBQSxFQUM1QjtBQUFBLEVBQ0EsTUFBTztBQUFBLEVBQ1AsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBO0FBQUEsTUFFTCxLQUFLLEtBQUssUUFBUSxrQ0FBVyxnQkFBZ0I7QUFBQSxJQUMvQztBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
