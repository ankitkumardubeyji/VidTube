import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server:{
    proxy:{
      '/api':'https://vidtube-7f2l.onrender.com',
    }
  },
  plugins: [react()],
})
