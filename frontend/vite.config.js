import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");
  const proxy = {
    "/api": {
      target: env.VITE_API_PROXY_TARGET || "http://localhost:4000",
      changeOrigin: true,
    },
  };

  return {
    plugins: [react(), tailwindcss()],
    server: {
      port: 5173,
      strictPort: true,
      // Meneruskan request /api/* ke backend agar tidak terkendala CORS saat development.
      proxy,
    },
    preview: { port: 4173, strictPort: true, proxy },
  };
});
