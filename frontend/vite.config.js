import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Bind all interfaces (0.0.0.0): Vite's default "localhost" can bind IPv6-only
  // (::1), leaving 127.0.0.1/localhost-v4 clients with connection-refused.
  server: { host: true },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
})
