import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      "localhost", // Разрешить локальный хост
      "*",
    ],
    host: true,
    port: 5173,
    watch: {
      usePolling: true // Важно для Docker
    }
  },
  preview: {
    port: 3000,
    host: true
  }
})