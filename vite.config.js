import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Critical: Point Vite to your nested frontend folder
  root: 'frontend',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './frontend/src'),
    },
  },
  build: {
    // Output the build to a 'dist' folder in the project root
    outDir: '../dist',
    emptyOutDir: true,
  }
})