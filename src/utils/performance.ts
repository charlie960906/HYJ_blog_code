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
              // 使用低質量圖片先載入
              if (img.dataset.placeholder) {
                img.src = img.dataset.placeholder;
              }
              
              // 創建新圖片物件預載入高質量圖片
              const highResImage = new Image();
              highResImage.onload = () => {
                img.src = img.dataset.src!;
                img.classList.add('loaded');
              };
              highResImage.src = img.dataset.src;
              
              img.removeAttribute('data-src');
            }
          }
        });
      },
      {
        rootMargin: '100px 0px', // 增加預載入距離
        threshold: 0.01
      }
    );
  }

  // 預載入關鍵資源
  preloadCriticalResources(): void {
    const criticalImages = ['/images/icon.webp', '/images/my.webp'];
    const criticalFonts = ['https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap'];
    
    // 預載入關鍵圖片
    criticalImages.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    });
    
    // 預載入關鍵字體
    criticalFonts.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'style';
      link.href = src;
      link.onload = function() {
        this.onload = null;
        this.rel = 'stylesheet';
      };
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
  
  // 延遲載入非關鍵資源
  deferNonCriticalResources(): void {
    // 延遲載入非關鍵 CSS
    document.querySelectorAll('link[data-defer]').forEach((link) => {
      const htmlLink = link as HTMLLinkElement;
      htmlLink.setAttribute('media', 'print');
      setTimeout(() => {
        htmlLink.onload = () => {
          htmlLink.media = 'all';
        };
        htmlLink.href = htmlLink.href;
      }, 1000);
    });
    
    // 延遲載入非關鍵 JS
    document.querySelectorAll('script[data-defer]').forEach((script) => {
      const htmlScript = script as HTMLScriptElement;
      setTimeout(() => {
        const newScript = document.createElement('script');
        Array.from(htmlScript.attributes).forEach(attr => {
          if (attr.name !== 'data-defer') {
            newScript.setAttribute(attr.name, attr.value);
          }
        });
        newScript.appendChild(document.createTextNode(htmlScript.innerHTML));
        htmlScript.parentNode?.replaceChild(newScript, htmlScript);
      }, 2000);
    });
  }
}

// 圖片優化工具
export const ImageOptimizer = {
  // 創建響應式圖片
  createResponsiveImage(src: string, alt: string, sizes?: string): string {
    const webpSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    const smallSrc = webpSrc.replace(/\.webp$/i, '-small.webp');
    
    return `
      <picture>
        <source 
          srcset="${webpSrc}" 
          type="image/webp" 
          media="(min-width: 768px)"
        >
        <source 
          srcset="${smallSrc}" 
          type="image/webp" 
          media="(max-width: 767px)"
        >
        <img 
          src="${smallSrc}" 
          data-src="${src}" 
          alt="${alt}" 
          loading="lazy" 
          decoding="async" 
          ${sizes ? `sizes="${sizes}"` : ''}
          class="transition-opacity opacity-0"
          onload="this.classList.remove('opacity-0')"
        >
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
  },
  
  // 生成低質量預覽圖
  generateLowQualityPlaceholder(imgSrc: string): Promise<string> {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        // 創建 canvas 並縮小圖片
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // 縮小到 20px 寬度
        const aspectRatio = img.height / img.width;
        canvas.width = 20;
        canvas.height = Math.floor(20 * aspectRatio);
        
        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          // 返回低質量 base64 圖片
          resolve(canvas.toDataURL('image/jpeg', 0.1));
        } else {
          resolve('');
        }
      };
      img.onerror = () => resolve('');
      img.src = imgSrc;
    });
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
  },
  
  // 預熱快取
  prewarmCache(urls: string[]): void {
    if ('caches' in window) {
      caches.open('prewarm-cache').then(cache => {
        cache.addAll(urls).catch(err => {
          console.error('預熱快取失敗:', err);
        });
      });
    }
  }
};