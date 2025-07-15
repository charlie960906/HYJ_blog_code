import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // 優化的程式碼分割
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          icons: ['lucide-react'],
          markdown: ['marked'],
          utils: ['./src/utils/posts', './src/utils/tags', './src/utils/markdown']
        }
      }
    },
    // 增強壓縮選項
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info'],
        passes: 2
      }
    },
    // 優化資源內聯閾值
    assetsInlineLimit: 2048, // 減少內聯大小，提升載入速度
    // 啟用 CSS 程式碼分割
    cssCodeSplit: true,
    // 優化 chunk 大小
    chunkSizeWarningLimit: 1000,
    // 啟用 sourcemap（僅開發環境）
    sourcemap: false
  },
  // 開發伺服器效能優化
  server: {
    hmr: {
      overlay: false
    },
    // 預構建優化
    force: true
  },
  // 依賴預構建優化
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'marked'],
    exclude: ['lucide-react']
  },
  // 預覽伺服器設定
  preview: {
    port: 4173,
    strictPort: true,
    // 啟用壓縮
    headers: {
      'Cache-Control': 'public, max-age=31536000'
    }
  },
  // CSS 優化
  css: {
    devSourcemap: false,
    preprocessorOptions: {
      // 如果使用 SCSS/SASS
      scss: {
        additionalData: `@import "src/styles/variables.scss";`
      }
    }
  }
});
