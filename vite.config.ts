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
          markdown: ['marked'],
          // 為手機版單獨打包
          mobile: ['./src/utils/responsive.ts', './src/utils/performance.ts']
        },
        // 減少 chunk 大小
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split('/') : [];
          const fileName = facadeModuleId[facadeModuleId.length - 2] || '[name]';
          return `assets/${fileName}/[name].[hash].js`;
        }
      }
    },
    // 壓縮選項
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info']
      },
      format: {
        comments: false
      }
    },
    // 資源內聯閾值 - 小於此值的資源將被內聯為 base64
    assetsInlineLimit: 10240, // 10kb
    // 啟用 CSS 程式碼分割
    cssCodeSplit: true,
    // 停用 source map 以減少檔案大小
    sourcemap: false,
    // 壓縮大型輸出警告限制
    chunkSizeWarningLimit: 1000, // 1mb
    // 啟用 brotli 壓縮
    reportCompressedSize: true
  },
  // 開發伺服器優化
  server: {
    hmr: {
      overlay: false
    }
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
    include: ['react', 'react-dom', 'react-router-dom', 'marked']
  },
  // 預覽設定
  preview: {
    port: 4173,
    strictPort: true
  },
  // 解析選項
  resolve: {
    // 別名
    alias: {
      '@': '/src'
    }
  }
});
