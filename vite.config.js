import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite configuration - single React plugin, default dev server
export default defineConfig({
  plugins: [react()]
})
