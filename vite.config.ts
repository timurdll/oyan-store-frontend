import { VitePWA } from "vite-plugin-pwa";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path-browserify";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  css: {
    preprocessorOptions: {
      less: {
        math: "parens-division",
      },
      scss: {
        api: "modern-compiler",
      },
    },
  },
  plugins: [
    react(),
    svgr(),
    VitePWA({
      registerType: "prompt",
      injectRegister: false,
      pwaAssets: {
        disabled: false,
        config: true,
      },
      manifest: {
        name: "oyan-store",
        short_name: "Oyan store",
        description: "oyan-store",
        theme_color: "#ffffff",
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,ico,woff2}"],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        globIgnores: ["**/x14l-*.png", "**/x15l-*.png"],
        maximumFileSizeToCacheInBytes: 6 * 1024 * 1024, // увеличен лимит до 6MB
      },
      devOptions: {
        enabled: true,
        navigateFallback: "index.html",
        suppressWarnings: true,
        type: "module",
      },
    }),
  ],
  build: {
    chunkSizeWarningLimit: 1500, // увеличим лимит предупреждения до 1.5MB
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return "vendor";
          }
          if (id.includes("react") || id.includes("redux")) {
            return "framework";
          }
        },
      },
    },
  },
  server: {
    host: true,
    port: 4000,
  },
  resolve: {
    alias: {
      "@styles": path.resolve("src/styles"),
      "@components": path.resolve("src/components"),
      "@assets": path.resolve("src/assets"),
      "@utils": path.resolve("src/utils"),
      "@redux": path.resolve("src/redux"),
      "@features": path.resolve("src/features"),
      "@routes": path.resolve("src/routes"),
      "@pages": path.resolve("src/pages"),
      "@services": path.resolve("src/services"),
    },
  },
});
