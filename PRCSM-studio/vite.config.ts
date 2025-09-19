import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      '/api/shopify': {
        target: 'https://prcsm-studio.myshopify.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/shopify\/graphql\.json$/, '/api/2024-07/graphql.json'),
        headers: {
          'X-Shopify-Storefront-Access-Token': '0a0d7c39a36d2d9865f17d7b50bf9634'
        }
      }
    }
  }
});
