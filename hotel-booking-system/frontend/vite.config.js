import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // บังคับให้ใช้พอร์ต 3000 แทน 5173
    strictPort: false // ถ้า 3000 ไม่ว่าง ให้หาพอร์ตถัดไปให้เอง
  }
})