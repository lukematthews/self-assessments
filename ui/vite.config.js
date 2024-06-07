import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // string shorthand: http://localhost:5173/foo -> http://localhost:4567/foo
      '/ui': 'http://localhost:3000',
      '/api': 'http://localhost:3000',
      // with options: http://localhost:5173/api/bar-> http://jsonplaceholder.typicode.com/bar
    },
  },
  build: {
    outDir: "../dist/ui"
  }
})