import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // 僅在需要時啟用 visualizer
    process.env.ANALYZE === 'true' && visualizer({
      open: true,
      filename: 'dist/bundle-report.html',
      gzipSize: true,
      brotliSize: true
    })
  ].filter(Boolean),
  build: {
    // 程式碼分割優化
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          icons: ['lucide-react'],
          markdown: ['marked']
        }
      }
    },
    // 壓縮選項
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    // 資源內聯閾值
    assetsInlineLimit: 4096,
    // 啟用 CSS 程式碼分割
    cssCodeSplit: true
  },
  // 開發伺服器優化
  server: {
    hmr: {
      overlay: false
    }
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
    include: ['react', 'react-dom', 'react-router-dom']
  },
  // 預覽設定
  preview: {
    port: 4173,
    strictPort: true
  }
});
