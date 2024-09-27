import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1',  // Hoặc '127.0.0.1' nếu bạn muốn dùng địa chỉ IP
    port: 5173,            // Cổng bạn đang sử dụng, có thể thay đổi nếu cần
    open: true,            // Tự động mở trình duyệt khi chạy ứng dụng
  },
})
