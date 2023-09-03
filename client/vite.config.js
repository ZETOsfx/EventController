import {
  defineConfig
} from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  mode: 'development',
  build: {
    // manifest: true,
    sourcemap: true,
    lib: {
      entry: "./src/main.js",
      name: 'Main',
     formats: ["es"],
      fileName: 'main',
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
    }
  },
})