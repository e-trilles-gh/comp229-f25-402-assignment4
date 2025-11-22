import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:3000'
    }
  },
  preview: {
      allowedHosts: [
      'comp229-f25-402-week2.onrender.com'
    ]
  }
})
