import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // 개발 서버 주소를 5180 으로 고정합니다.
  // 기본값(5173)은 다른 프로젝트(coffee-game)가 쓰고 있어서,
  // 둘을 동시에 띄워도 부딪히지 않도록 이 프로젝트만 옮겨 두었습니다.
  //   → 이 사이트는 http://localhost:5180
  // strictPort: 5180 이 막혀 있으면 조용히 다른 번호로 옮기지 않고 알려 줍니다.
  server: {
    port: 5180,
    strictPort: true,
  },
})
