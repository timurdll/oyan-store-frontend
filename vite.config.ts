import { VitePWA } from "vite-plugin-pwa";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";
import react from "@vitejs/plugin-react";
import path from "path-browserify";
import svg from "vite-plugin-svgo";

// https://vitejs.dev/config/
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
    svg({
      multipass: true,
      plugins: [
        {
          name: "preset-default",
          params: {
            overrides: {
              convertColors: {
                currentColor: true,
              },
            },
          },
        },
      ],
    }),
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
        globPatterns: ["**/*.{js,css,html,svg,png,ico}"],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
      },

      devOptions: {
        enabled: true,
        navigateFallback: "index.html",
        suppressWarnings: true,
        type: "module",
      },
    }),
    svgr(),
  ],
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
