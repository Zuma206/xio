import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import autoprefixer from "autoprefixer";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": "http://localhost:3000/",
    },
  },
  css: {
    postcss: {
      plugins: [autoprefixer],
    },
  },
});
