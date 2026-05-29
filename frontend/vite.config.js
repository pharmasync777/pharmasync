import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Output build ke frontend/dist
  build: {
    outDir: 'dist',
  },
  server: {
    port: 5173,
    // Development: proxy /api ke backend lokal
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
})
