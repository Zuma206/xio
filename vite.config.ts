import { defineConfig } from "vite";
import autoprefixer from "autoprefixer";
import { reactRouter } from "@react-router/dev/vite";

export default defineConfig({
  plugins: [reactRouter()],
  css: {
    postcss: {
      plugins: [autoprefixer],
    },
  },
});
