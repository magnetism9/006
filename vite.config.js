import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages: magnetism9.github.io/006/ → base '/006/'
// 커스텀 도메인 사용 시 VITE_BASE_URL=/ 로 오버라이드
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE_URL ?? '/006/',
})
