import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173, // ✅ Explicit (optional but good)
    proxy: {
      "/api": {
        target: "http://localhost:5000", // ✅ Backend port
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
