import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Carrega as variáveis de ambiente (inclusive as da Vercel)
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    base: '/',
    plugins: [react()],
    define: {
      // Força a substituição de 'process.env' para não quebrar o navegador
      'process.env': {},
      // Injeta a chave DIRETAMENTE no código final
      'import.meta.env.VITE_GEMINI_API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});
