import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.js"),
      name: "VueGSAP",
      fileName: (format) => `gsap-vue.${format}.js`
    },
    rollupOptions: {
      external: ["vue", "gsap"],
      output: {
        globals: {
          vue: "Vue",
          gsap: "gsap"
        }
      }
    }
  },
  server: {
    port: 5173
  }
});
