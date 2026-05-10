import { withBase } from './paths';

// Web Vitals 指標類型
interface WebVitalsMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  timestamp: number;
}

// 效能監控與優化工具
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number> = new Map();
  private webVitalsMetrics: WebVitalsMetric[] = [];

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

  // 初始化 Web Vitals 監控
  initWebVitalsTracking(): void {
    this.trackLCP();
    this.trackFID();
    this.trackCLS();
    this.trackFCP();
    this.trackTTFB();
  }

  // 監控 Largest Contentful Paint (LCP)
  private trackLCP(): void {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        
        const metric: WebVitalsMetric = {
          name: 'LCP',
          value: lastEntry.startTime,
          rating: this.getRating('LCP', lastEntry.startTime),
          timestamp: Date.now()
        };
        
        this.webVitalsMetrics.push(metric);
        this.reportWebVital(metric);
      });
      
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    }
  }

  // 監控 First Input Delay (FID)
  private trackFID(): void {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          const metric: WebVitalsMetric = {
            name: 'FID',
            value: entry.processingStart - entry.startTime,
            rating: this.getRating('FID', entry.processingStart - entry.startTime),
            timestamp: Date.now()
          };
          
          this.webVitalsMetrics.push(metric);
          this.reportWebVital(metric);
        });
      });
      
      observer.observe({ entryTypes: ['first-input'] });
    }
  }

  // 監控 Cumulative Layout Shift (CLS)
  private trackCLS(): void {
    let clsValue = 0;
    let clsEntries: any[] = [];
    
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries() as any[];
        
        entries.forEach((entry) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            clsEntries.push(entry);
          }
        });
      });
      
      observer.observe({ entryTypes: ['layout-shift'] });
      
      // 在頁面卸載時報告最終 CLS 值
      window.addEventListener('beforeunload', () => {
        if (clsValue > 0) {
          const metric: WebVitalsMetric = {
            name: 'CLS',
            value: clsValue,
            rating: this.getRating('CLS', clsValue),
            timestamp: Date.now()
          };
          
          this.webVitalsMetrics.push(metric);
          this.reportWebVital(metric);
        }
      });
    }
  }

  // 監控 First Contentful Paint (FCP)
  private trackFCP(): void {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        
        const metric: WebVitalsMetric = {
          name: 'FCP',
          value: lastEntry.startTime,
          rating: this.getRating('FCP', lastEntry.startTime),
          timestamp: Date.now()
        };
        
        this.webVitalsMetrics.push(metric);
        this.reportWebVital(metric);
      });
      
      observer.observe({ entryTypes: ['paint'] });
    }
  }

  // 監控 Time to First Byte (TTFB)
  private trackTTFB(): void {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        
        const ttfb = lastEntry.responseStart - lastEntry.requestStart;
        
        const metric: WebVitalsMetric = {
          name: 'TTFB',
          value: ttfb,
          rating: this.getRating('TTFB', ttfb),
          timestamp: Date.now()
        };
        
        this.webVitalsMetrics.push(metric);
        this.reportWebVital(metric);
      });
      
      observer.observe({ entryTypes: ['navigation'] });
    }
  }

  // 根據指標類型和值確定評分
  private getRating(metric: string, value: number): 'good' | 'needs-improvement' | 'poor' {
    switch (metric) {
      case 'LCP':
        return value <= 2500 ? 'good' : value <= 4000 ? 'needs-improvement' : 'poor';
      case 'FID':
        return value <= 100 ? 'good' : value <= 300 ? 'needs-improvement' : 'poor';
      case 'CLS':
        return value <= 0.1 ? 'good' : value <= 0.25 ? 'needs-improvement' : 'poor';
      case 'FCP':
        return value <= 1800 ? 'good' : value <= 3000 ? 'needs-improvement' : 'poor';
      case 'TTFB':
        return value <= 800 ? 'good' : value <= 1800 ? 'needs-improvement' : 'poor';
      default:
        return 'good';
    }
  }

  // 報告 Web Vital 指標
  private reportWebVital(metric: WebVitalsMetric): void {
    // 在開發環境記錄到控制台
    if (import.meta.env.DEV) {
      const emoji = metric.rating === 'good' ? '✅' : metric.rating === 'needs-improvement' ? '⚠️' : '❌';
      console.log(`${emoji} ${metric.name}: ${metric.value.toFixed(2)}ms - ${metric.rating}`);
    }
    
    // 可以發送到分析服務
    // this.sendToAnalytics(metric);
  }

  // 獲取所有 Web Vitals 指標
  getWebVitalsMetrics(): WebVitalsMetric[] {
    return [...this.webVitalsMetrics];
  }

  // 獲取最新指標摘要
  getLatestMetricsSummary(): { [key: string]: WebVitalsMetric | undefined } {
    const summary: { [key: string]: WebVitalsMetric | undefined } = {};
    const metrics = ['LCP', 'FID', 'CLS', 'FCP', 'TTFB'];
    
    metrics.forEach(metric => {
      const latest = this.webVitalsMetrics
        .filter(m => m.name === metric)
        .sort((a, b) => b.timestamp - a.timestamp)[0];
      summary[metric] = latest;
    });
    
    return summary;
  }

  // 增強的圖片懶載入觀察器（支持現代格式）
  createEnhancedImageObserver(): IntersectionObserver {
    return new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement;
            
            // 處理普通的 img 標籤
            if (target.tagName === 'IMG') {
              const img = target as HTMLImageElement;
              if (img.dataset.src) {
                // 生成低質量預覽圖
                if (img.dataset.placeholder) {
                  img.src = img.dataset.placeholder;
                }
                
                // 預載入高質量圖片
                const highResImage = new Image();
                highResImage.onload = () => {
                  img.src = img.dataset.src!;
                  img.classList.add('loaded');
                  img.classList.remove('opacity-0');
                };
                highResImage.src = img.dataset.src;
                
                img.removeAttribute('data-src');
                img.removeAttribute('data-placeholder');
              }
            }
            
            // 處理 picture 元素
            else if (target.tagName === 'PICTURE') {
              const picture = target as HTMLPictureElement;
              const img = picture.querySelector('img');
              if (img && img.dataset.src) {
                // 預載入所有來源
                const sources = picture.querySelectorAll('source');
                sources.forEach(source => {
                  if (source.dataset.srcset) {
                    const preloadLink = document.createElement('link');
                    preloadLink.rel = 'preload';
                    preloadLink.as = 'image';
                    preloadLink.href = source.dataset.srcset;
                    document.head.appendChild(preloadLink);
                  }
                });
                
                // 設置最終圖片來源
                if (img.dataset.src) {
                  img.src = img.dataset.src;
                  img.classList.add('loaded');
                  picture.classList.remove('opacity-0');
                }
              }
            }
            
            // 停止觀察已載入的圖片
            this.disconnect();
          }
        });
      },
      {
        rootMargin: '50px 0px', // 提前50px開始載入
        threshold: 0.01
      }
    );
  }

  // 預載入關鍵資源
  preloadCriticalResources(): void {
    const criticalImages = [withBase('images/icon.jpg'), withBase('images/my.jpg')];
    const criticalFonts = [
      {
        href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap',
        as: 'style'
      }
    ];
    
    // 預載入關鍵圖片
    criticalImages.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    });
    
    // 預載入關鍵字體 with font-display: swap
    criticalFonts.forEach(font => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = font.as;
      link.href = font.href;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
      
      // 添加實際的字體連結
      const fontLink = document.createElement('link');
      fontLink.rel = 'stylesheet';
      fontLink.href = font.href;
      fontLink.crossOrigin = 'anonymous';
      document.head.appendChild(fontLink);
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
    return `
      <img 
        src="${src}" 
        data-src="${src}" 
        alt="${alt}" 
        loading="lazy" 
        decoding="async" 
        ${sizes ? `sizes="${sizes}"` : ''}
        class="transition-opacity opacity-0"
        onload="this.classList.remove('opacity-0')"
      >
    `;
  },

  // 創建現代圖片格式支持（WebP/AVIF with fallbacks）
  createModernImage(src: string, alt: string, sizes?: string): string {
    const baseName = src.replace(/\.[^/.]+$/, ''); // 移除副檔名
    const webpSrc = `${baseName}.webp`;
    const avifSrc = `${baseName}.avif`;
    
    return `
      <picture class="transition-opacity opacity-0" onload="this.classList.remove('opacity-0')">
        <source srcset="${avifSrc}" type="image/avif">
        <source srcset="${webpSrc}" type="image/webp">
        <img 
          src="${src}" 
          alt="${alt}" 
          loading="lazy" 
          decoding="async" 
          ${sizes ? `sizes="${sizes}"` : ''}
        >
      </picture>
    `;
  },

  // 創建響應式圖片 with srcset
  createResponsiveImageWithSrcset(src: string, alt: string, breakpoints?: { width: number; src: string }[]): string {
    if (!breakpoints || breakpoints.length === 0) {
      return this.createModernImage(src, alt);
    }
    
    const sources = breakpoints.map(bp => 
      `<source media="(max-width: ${bp.width}px)" srcset="${bp.src}">`
    ).join('\n        ');
    
    return `
      <picture class="transition-opacity opacity-0" onload="this.classList.remove('opacity-0')">
        ${sources}
        <img 
          src="${src}" 
          alt="${alt}" 
          loading="lazy" 
          decoding="async"
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

// 預取管理器
export const PrefetchManager = {
  // 預取可能的下一個頁面
  prefetchLikelyPages(): void {
    const currentPath = window.location.pathname;
    
    // 根據當前頁面預取可能的下一個頁面
    const prefetchUrls = this.getPrefetchUrls(currentPath);
    
    prefetchUrls.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = url;
      link.as = 'document';
      document.head.appendChild(link);
    });
  },

  // 根據當前路徑確定要預取的URL
  private getPrefetchUrls(currentPath: string): string[] {
    const urls: string[] = [];
    
    if (currentPath === '/') {
      // 在首頁時，預取第一篇文章和標籤頁面
      urls.push('/post/introduction__c++', '/tags');
    } else if (currentPath.startsWith('/post/')) {
      // 在文章頁面時，預取相關文章和分類頁面
      urls.push('/tags', '/category/information');
    } else if (currentPath === '/tags') {
      // 在標籤頁面時，預取熱門標籤的文章
      urls.push('/category/reviews');
    }
    
    return urls;
  },

  // 預取資源
  prefetchResource(url: string, as: string = 'fetch'): void {
    const existingLink = document.querySelector(`link[href="${url}"]`);
    if (!existingLink) {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = url;
      link.as = as;
      document.head.appendChild(link);
    }
  },

  // 智能預取（基於用戶行為）
  setupSmartPrefetch(): void {
    let prefetchTimeout: number;
    
    const handleMouseEnter = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const link = target.closest('a') as HTMLAnchorElement;
      
      if (link && link.href && link.href.startsWith(window.location.origin)) {
        clearTimeout(prefetchTimeout);
        prefetchTimeout = window.setTimeout(() => {
          this.prefetchResource(link.href, 'document');
        }, 100); // 100ms 延遲以避免過度預取
      }
    };

    const handleMouseLeave = () => {
      clearTimeout(prefetchTimeout);
    };

    document.addEventListener('mouseenter', handleMouseEnter, true);
    document.addEventListener('mouseleave', handleMouseLeave, true);
  }
};

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