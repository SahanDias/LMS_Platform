import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 3001,
    hmr: {
      overlay: false,
    },
    proxy: {
      "/api/v1/course": {
        target: "http://localhost:7878",
        changeOrigin: true,
      },
      "/api/enrollments": {
        target: "http://localhost:8082",
        changeOrigin: true,
      },
      "/api/waitlist": {
        target: "http://localhost:8082",
        changeOrigin: true,
      },
      "/api/catalog": {
        target: "http://localhost:8082",
        changeOrigin: true,
      },
      "/payments": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
      "/create-payment-session": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
      "/videos": {
        target: "http://localhost:8083",
        changeOrigin: true,
      },
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
