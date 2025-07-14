// 效能監控與優化工具
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  // 測量載入時間
  measureLoadTime(name: string, startTime: number): void {
    const endTime = performance.now();
    const duration = endTime - startTime;
    this.metrics.set(name, duration);
    
    // 只在開發環境記錄
    if (import.meta.env.DEV) {
      console.log(`⚡ ${name}: ${duration.toFixed(2)}ms`);
    }
  }

  // 圖片懶載入觀察器
  createImageObserver(): IntersectionObserver {
    return new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
              img.classList.add('loaded');
            }
          }
        });
      },
      {
        rootMargin: '50px 0px',
        threshold: 0.01
      }
    );
  }

  // 預載入關鍵資源
  preloadCriticalResources(): void {
    const criticalImages = ['/images/icon.jpg', '/images/my.jpg'];
    
    criticalImages.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    });
  }

  // 記憶體使用監控
  monitorMemoryUsage(): void {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      if (import.meta.env.DEV) {
        console.log('Memory Usage:', {
          used: `${(memory.usedJSHeapSize / 1048576).toFixed(2)} MB`,
          total: `${(memory.totalJSHeapSize / 1048576).toFixed(2)} MB`,
          limit: `${(memory.jsHeapSizeLimit / 1048576).toFixed(2)} MB`
        });
      }
    }
  }
}

// 圖片優化工具
export const ImageOptimizer = {
  // 創建響應式圖片
  createResponsiveImage(src: string, alt: string, sizes?: string): string {
    const webpSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    return `
      <picture>
        <source srcset="${webpSrc}" type="image/webp">
        <img src="${src}" alt="${alt}" loading="lazy" decoding="async" ${sizes ? `sizes="${sizes}"` : ''}>
      </picture>
    `;
  },

  // 圖片壓縮建議
  getOptimizationSuggestions(file: File): string[] {
    const suggestions: string[] = [];
    
    if (file.size > 1024 * 1024) { // 1MB
      suggestions.push('建議壓縮圖片至 1MB 以下');
    }
    
    if (!file.type.includes('webp')) {
      suggestions.push('建議使用 WebP 格式以獲得更好的壓縮率');
    }
    
    return suggestions;
  }
};

// 快取管理
export const CacheManager = {
  // 設置快取策略
  setCacheHeaders(): void {
    // 這將在 service worker 中實現
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(console.error);
    }
  },

  // 清除過期快取
  clearExpiredCache(): void {
    const cacheKeys = ['posts-cache', 'images-cache', 'static-cache'];
    
    cacheKeys.forEach(key => {
      const cached = localStorage.getItem(key);
      if (cached) {
        try {
          const data = JSON.parse(cached);
          const expiry = data.expiry || 0;
          if (Date.now() > expiry) {
            localStorage.removeItem(key);
          }
        } catch (error) {
          localStorage.removeItem(key);
        }
      }
    });
  }
};