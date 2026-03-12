import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Isso permite que você teste localmente a API
      '/api': 'http://localhost:3000'
    }
  },
  build: {
    // Garante que o Vite procure os arquivos na raiz
    rollupOptions: {
      input: './index.html'
    }
  }
} )
