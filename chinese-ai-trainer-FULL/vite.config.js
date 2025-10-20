import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './', // ⚠️ rất quan trọng cho Vercel
  build: {
    outDir: 'dist'
  }
})
