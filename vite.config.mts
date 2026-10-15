import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig(({ mode, command, isPreview }) => {
  const configuredOrigin = (
    process.env.VITE_API_BASE_URL ?? loadEnv(mode, process.cwd()).VITE_API_BASE_URL
  )?.trim();
  const apiUrl = new URL(configuredOrigin || "http://localhost:8000");
  const useLocalProxy =
    command === "serve" && !isPreview && ["localhost", "127.0.0.1"].includes(apiUrl.hostname);
  const origins = new Set<string>();
  if (configuredOrigin && !useLocalProxy) {
    origins.add(apiUrl.origin);
  }
  return {
    plugins: [
      {
        name: "api-connect-policy",
        transformIndexHtml: (html) =>
          html.replace("__API_CONNECT_SOURCES__", [...origins].join(" ")),
      },
      react(),
      visualizer({
        filename: "./dist/stats.html",
        open: false,
        gzipSize: true,
        brotliSize: true,
      }),
    ],
    resolve: {
      alias: {
        "@": new URL("./src", import.meta.url).pathname,
      },
    },
    server: {
      proxy: useLocalProxy ? { "/v1": { target: apiUrl.origin, changeOrigin: true } } : undefined,
      // Vite's default (was implicit). Note: some planning docs reference
      // localhost:3000 (the historical CRA default), but 5173 is the actual,
      // already-established convention here — backend CORS allowlists
      // (config_local.yml/config_dev.yml), playwright.config.ts, and
      // docs/getting-started.md all already assume 5173.
      port: 5173,
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            // Vendor chunks (used on every route — always eager)
            "vendor-react": ["react", "react-dom", "react-router-dom"],
            "vendor-redux": ["@reduxjs/toolkit", "react-redux"],
            // antd/icons deliberately NOT forced into one vendor chunk: routes
            // are lazy-loaded (src/app/routing/lazy-loader.ts), so leaving antd
            // unassigned lets Rollup split it along those same route boundaries.
            // Forcing it into one bucket produced a single 1.2MB+ eager chunk;
            // leaving it alone reduced the largest chunk by ~44% to ~690KB by
            // giving each lazy route its own slice of antd instead of all of it.

            // Feature chunks (loaded on-demand via lazy routes)
            // These will be automatically split by dynamic imports
          },
        },
      },
      // 750KB: antd is an inherently large UI kit: even after route-based
      // splitting above, the shared chunk used by multiple routes sits at
      // ~690KB raw (~223KB gzipped, the actual network cost). Default 500KB
      // is a generic heuristic, not a hard budget — this reflects this app's
      // real profile rather than silencing a warning that would otherwise
      // always fire regardless of any real regression.
      chunkSizeWarningLimit: 750,
    },
  };
});
