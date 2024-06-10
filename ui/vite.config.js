import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
    server: {
      proxy: {
        '/ui': 'http://localhost:3000',
        '/api': 'http://localhost:3000',
      },
    },
  build: {
    outDir: "dist"
  }
})