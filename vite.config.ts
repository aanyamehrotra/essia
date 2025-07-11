import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

export default defineConfig(async ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  const isReplit = env.REPL_ID !== undefined;

  const proxyTarget =
    mode === "production"
      ? env.VITE_BACKEND_SERVER_URL || "http://13.127.230.171:5002"
      : env.VITE_BACKEND_LOCAL_URL || "http://localhost:5002";

  return {
    plugins: [
      react(),
      runtimeErrorOverlay(),
      ...(mode !== "production" && isReplit
        ? [
            // Cartographer only for Replit dev
            await import("@replit/vite-plugin-cartographer").then((m) =>
              m.cartographer()
            ),
          ]
        : []),
    ],

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
        "@shared": path.resolve(__dirname, "shared"),
        "@assets": path.resolve(__dirname, "attached_assets"),
      },
    },

    build: {
      outDir: "dist",
      emptyOutDir: true,
      chunkSizeWarningLimit: 2000,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules")) {
              return id
                .toString()
                .split("node_modules/")[1]
                .split("/")[0]
                .toString();
            }
          },
        },
      },
    },

    server: {
      fs: {
        strict: true,
        deny: ["**/.*"],
      },
      cors: {
        origin: env.VITE_FRONTEND_LOCAL_URL || "http://localhost:5173",
        credentials: true,
      },
      proxy: {
        "/api": {
          target: proxyTarget,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});