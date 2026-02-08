import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// ... mantenha os imports iguais
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
    base: './', 
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
      plugins: [react()],
      define: {
        // Isso garante que qualquer chamada a 'process.env' não quebre o site
        'process.env': {} 
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
