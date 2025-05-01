import { VitePWA } from "vite-plugin-pwa";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path-browserify";
import svgr from "vite-plugin-svgr";
import { visualizer } from "rollup-plugin-visualizer";
import { compression } from "vite-plugin-compression2";

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
    compression({
      algorithm: "gzip",
      exclude: [/\.(br)$/, /\.(gz)$/],
    }) as any,
    compression({
      algorithm: "brotliCompress",
      exclude: [/\.(br)$/, /\.(gz)$/],
    }) as any,
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
    }) as any,
    VitePWA({
      registerType: "prompt",
      injectRegister: false,
      manifest: {
        name: "oyan-store",
        short_name: "Oyan store",
        description: "oyan-store",
        theme_color: "#ffffff",
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,ico,woff2}"],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        globIgnores: [
          "**/x14l-*.png",
          "**/x15l-*.png",
          "**/*-large.png",
          "**/*-original.png",
        ],
        maximumFileSizeToCacheInBytes: 2 * 1024 * 1024, // reduced to 2MB
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
    chunkSizeWarningLimit: 1000,
    reportCompressedSize: true,
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: [
            "react",
            "react-dom",
            "react-router-dom",
            "@reduxjs/toolkit",
            "react-redux",
          ],
          mui: [
            "@mui/material",
            "@mui/icons-material",
            "@emotion/react",
            "@emotion/styled",
          ],
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
