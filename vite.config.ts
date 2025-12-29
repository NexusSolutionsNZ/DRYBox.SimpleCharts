import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const useHttps = mode !== 'production';

  return {
    plugins: [react()],
    build: {
      sourcemap: true
    },
    server: useHttps ? {
      host: '0.0.0.0',
      port: 5173,
      https: {
        key: './certs/localhost.key',
        cert: './certs/localhost.crt',
      }
    } : undefined
  }
})
