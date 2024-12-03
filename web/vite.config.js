import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1',  // Hoặc '0.0.0.0' để truy cập từ mạng nội bộ
    port: 5173,         // Cổng bạn đang sử dụng, có thể thay đổi nếu cần
    open: true,        
  },
  build: {
    outDir: 'dist', 
    emptyOutDir: true,   
    rollupOptions: {     
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'], 
        },
      },
    },
  },
});
