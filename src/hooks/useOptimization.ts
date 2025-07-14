import { useEffect } from 'react';
import { PerformanceMonitor } from '../utils/performance';
import { SEOManager } from '../utils/seo';
import { SecurityManager } from '../utils/security';
import { ResponsiveManager } from '../utils/responsive';
import { AccessibilityManager } from '../utils/accessibility';

// 效能優化 Hook
export const usePerformanceOptimization = () => {
  useEffect(() => {
    const monitor = PerformanceMonitor.getInstance();
    
    // 預載入關鍵資源
    monitor.preloadCriticalResources();
    
    // 設置圖片懶載入
    const imageObserver = monitor.createImageObserver();
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => imageObserver.observe(img));
    
    // 監控記憶體使用
    const memoryInterval = setInterval(() => {
      monitor.monitorMemoryUsage();
    }, 30000); // 每 30 秒檢查一次
    
    return () => {
      clearInterval(memoryInterval);
      imageObserver.disconnect();
    };
  }, []);
};

// SEO 優化 Hook
export const useSEOOptimization = (metadata?: {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  author?: string;
}) => {
  useEffect(() => {
    const seoManager = SEOManager.getInstance();
    
    if (metadata) {
      seoManager.setPageMetadata({
        title: metadata.title || "HYJ's Blog",
        description: metadata.description || "HYJ's Blog - 分享程式設計、演算法、財經投資等內容",
        keywords: metadata.keywords || ['程式設計', '演算法', '財經', '投資', 'C++', 'JavaScript'],
        image: metadata.image || '/images/icon.jpg',
        type: metadata.type || 'website',
        publishedTime: metadata.publishedTime,
        author: metadata.author || 'HYJ'
      });
      
      seoManager.generateStructuredData({
        title: metadata.title || "HYJ's Blog",
        description: metadata.description || "HYJ's Blog - 分享程式設計、演算法、財經投資等內容",
        type: metadata.type || 'website',
        publishedTime: metadata.publishedTime,
        author: metadata.author || 'HYJ'
      });
    }
  }, [metadata]);
};

// 安全性優化 Hook
export const useSecurityOptimization = () => {
  useEffect(() => {
    const security = SecurityManager.getInstance();
    security.initializeSecurity();
    security.enforceHTTPS();
  }, []);
};

// 響應式優化 Hook
export const useResponsiveOptimization = () => {
  useEffect(() => {
    const responsive = ResponsiveManager.getInstance();
    responsive.initialize();
    
    return () => {
      // 清理事件監聽器
      window.removeEventListener('resize', responsive.setupResizeListener);
    };
  }, []);
};

// 無障礙優化 Hook
export const useAccessibilityOptimization = () => {
  useEffect(() => {
    const accessibility = AccessibilityManager.getInstance();
    accessibility.initialize();
  }, []);
};

// 綜合優化 Hook
export const useWebsiteOptimization = (seoMetadata?: Parameters<typeof useSEOOptimization>[0]) => {
  usePerformanceOptimization();
  useSEOOptimization(seoMetadata);
  useSecurityOptimization();
  useResponsiveOptimization();
  useAccessibilityOptimization();
};