import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  
  server: {
    headers: {
          "Cross-Origin-Opener-Policy": "same-origin-allow-popups"
    },
    host: '0.0.0.0',  // Required for dev containers
    port: 5173
  }
})