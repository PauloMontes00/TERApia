import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // no need to specify port here; Vite default is 5173
    proxy: {
      // proxy API requests to the backend during development
      '/api': {
        target: process.env.BACKEND_URL || 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
        ws: true, // support socket.io websocket proxying
      },
    },
  },
});
