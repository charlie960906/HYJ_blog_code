import { useEffect, useState } from 'react';
import { PerformanceMonitor, CacheManager } from '../utils/performance';
import { SEOManager } from '../utils/seo';
import { SecurityManager } from '../utils/security';
import { ResponsiveManager } from '../utils/responsive';
import { AccessibilityManager } from '../utils/accessibility';

// 效能優化 Hook
export const usePerformanceOptimization = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const monitor = PerformanceMonitor.getInstance();
    const startTime = performance.now();
    
    // 檢測是否為行動裝置
    const responsive = ResponsiveManager.getInstance();
    const checkMobile = () => {
      const mobile = responsive.isMobile();
      setIsMobile(mobile);
      return mobile;
    };
    const mobile = checkMobile();
    
    // 預載入關鍵資源
    monitor.preloadCriticalResources();
    
    // 設置圖片懶載入
    const imageObserver = monitor.createImageObserver();
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => imageObserver.observe(img));
    
    // 延遲載入非關鍵資源
    setTimeout(() => {
      monitor.deferNonCriticalResources();
    }, 2000);
    
    // 清理過期快取
    CacheManager.clearExpiredCache();
    
    // 預熱快取 - 只在行動裝置上預熱必要的資源
    if (mobile) {
      CacheManager.prewarmCache([
        '/images/icon-small.webp',
        '/images/my-small.webp',
        '/images/background-small.webp'
      ]);
    }
    
    // 監控記憶體使用 - 僅在桌面版啟用
    let memoryInterval: number | undefined;
    if (!mobile) {
      memoryInterval = window.setInterval(() => {
        monitor.monitorMemoryUsage();
      }, 30000); // 每 30 秒檢查一次
    }
    
    // 監聽視窗大小變化
    const handleResize = () => {
      checkMobile();
    };
    window.addEventListener('resize', handleResize);
    
    // 測量載入時間
    window.addEventListener('load', () => {
      monitor.measureLoadTime('initial-load', startTime);
    });
    
    return () => {
      if (memoryInterval) clearInterval(memoryInterval);
      imageObserver.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return { isMobile };
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
      // 檢測是否為行動裝置，調整 meta 描述長度
      const responsive = ResponsiveManager.getInstance();
      const isMobile = responsive.isMobile();
      
      let description = metadata.description || "HYJ's Blog - 分享程式設計、演算法、財經投資等內容";
      if (isMobile && description.length > 120) {
        description = description.substring(0, 117) + '...';
      }
      
      seoManager.setPageMetadata({
        title: metadata.title || "HYJ's Blog",
        description: description,
        keywords: metadata.keywords || ['程式設計', '演算法', '財經', '投資', 'C++', 'JavaScript'],
        image: metadata.image || (isMobile ? '/images/icon-small.webp' : '/images/icon.webp'),
        type: metadata.type || 'website',
        publishedTime: metadata.publishedTime,
        author: metadata.author || 'HYJ'
      });
      
      seoManager.generateStructuredData({
        title: metadata.title || "HYJ's Blog",
        description: description,
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
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const responsive = ResponsiveManager.getInstance();
    responsive.initialize();
    
    // 初始檢測
    const checkMobile = () => {
      const mobile = responsive.isMobile();
      setIsMobile(mobile);
      
      // 根據裝置類型調整 UI
      if (mobile) {
        // 行動裝置優化
        responsive.adjustFontSize();
        responsive.adjustSpacing();
        responsive.updateViewportHeight();
        
        // 針對行動裝置優化圖片
        responsive.optimizeImages();
        
        // 添加行動裝置專用類別
        document.documentElement.classList.add('is-mobile');
      } else {
        document.documentElement.classList.remove('is-mobile');
      }
    };
    
    checkMobile();
    
    // 監聽視窗大小變化
    const handleResize = () => {
      checkMobile();
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return { isMobile };
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
  const { isMobile } = usePerformanceOptimization();
  useSEOOptimization(seoMetadata);
  useSecurityOptimization();
  const { isMobile: responsiveIsMobile } = useResponsiveOptimization();
  useAccessibilityOptimization();
  
  return { isMobile: isMobile || responsiveIsMobile };
};