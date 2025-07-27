// 響應式設計工具
export class ResponsiveManager {
  private static instance: ResponsiveManager;
  private breakpoints = {
    xs: 320,
    sm: 480,
    md: 768,
    lg: 1024,
    xl: 1440,
    xxl: 1920
  };
  private resizeListeners: Array<() => void> = [];

  static getInstance(): ResponsiveManager {
    if (!ResponsiveManager.instance) {
      ResponsiveManager.instance = new ResponsiveManager();
    }
    return ResponsiveManager.instance;
  }

  // 獲取當前斷點
  getCurrentBreakpoint(): string {
    const width = window.innerWidth;
    
    if (width < this.breakpoints.sm) return 'xs';
    if (width < this.breakpoints.md) return 'sm';
    if (width < this.breakpoints.lg) return 'md';
    if (width < this.breakpoints.xl) return 'lg';
    if (width < this.breakpoints.xxl) return 'xl';
    return 'xxl';
  }

  // 檢查是否為行動裝置
  isMobile(): boolean {
    return window.innerWidth < this.breakpoints.md || 
           ('ontouchstart' in window && window.innerWidth < this.breakpoints.lg);
  }

  // 檢查是否為平板
  isTablet(): boolean {
    const width = window.innerWidth;
    return width >= this.breakpoints.md && width < this.breakpoints.lg;
  }

  // 檢查是否為桌面
  isDesktop(): boolean {
    return window.innerWidth >= this.breakpoints.lg;
  }

  // 檢查裝置方向
  getOrientation(): 'portrait' | 'landscape' {
    return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
  }

  // 檢查是否支援觸控
  isTouchDevice(): boolean {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }

  // 動態調整字體大小
  adjustFontSize(): void {
    const baseSize = 16;
    const width = window.innerWidth;
    let scale = 1;

    if (width < this.breakpoints.sm) {
      scale = 0.875; // 14px
    } else if (width < this.breakpoints.md) {
      scale = 0.9375; // 15px
    } else if (width > this.breakpoints.xl) {
      scale = 1.125; // 18px
    }

    document.documentElement.style.fontSize = `${baseSize * scale}px`;
  }

  // 動態調整間距
  adjustSpacing(): void {
    const breakpoint = this.getCurrentBreakpoint();
    const root = document.documentElement;

    switch (breakpoint) {
      case 'xs':
        root.style.setProperty('--spacing-unit', '0.75rem');
        break;
      case 'sm':
        root.style.setProperty('--spacing-unit', '1rem');
        break;
      case 'md':
        root.style.setProperty('--spacing-unit', '1.25rem');
        break;
      case 'lg':
        root.style.setProperty('--spacing-unit', '1.5rem');
        break;
      default:
        root.style.setProperty('--spacing-unit', '2rem');
    }
  }

  // 優化圖片載入
  optimizeImages(): void {
    const images = document.querySelectorAll('img[data-responsive]');
    const isMobile = this.isMobile();
    
    images.forEach((img) => {
      const htmlImg = img as HTMLImageElement;
      const baseSrc = htmlImg.dataset.src || htmlImg.src;
      
      // 根據裝置選擇圖片
      if (isMobile) {
        // 行動裝置使用小圖
        const smallSrc = baseSrc.replace(/\.(jpg|jpeg|png|webp)$/i, '-small.$1');
        htmlImg.src = smallSrc;
        
        // 添加懶載入屬性
        if (!htmlImg.hasAttribute('loading')) {
          htmlImg.setAttribute('loading', 'lazy');
        }
        
        // 添加解碼屬性
        if (!htmlImg.hasAttribute('decoding')) {
          htmlImg.setAttribute('decoding', 'async');
        }
      } else {
        // 桌面版使用原圖
        htmlImg.src = baseSrc;
      }
    });
    
    // 優化背景圖片
    this.optimizeBackgroundImages();
  }
  
  // 優化背景圖片
  optimizeBackgroundImages(): void {
    const isMobile = this.isMobile();
    const elements = document.querySelectorAll('[data-bg-responsive]');
    
    elements.forEach(el => {
      const element = el as HTMLElement;
      const bgImage = element.dataset.bgSrc || '';
      
      if (bgImage) {
        if (isMobile) {
          // 行動裝置使用小圖
          const smallBgImage = bgImage.replace(/\.(jpg|jpeg|png|webp)$/i, '-small.$1');
          element.style.backgroundImage = `url('${smallBgImage}')`;
        } else {
          element.style.backgroundImage = `url('${bgImage}')`;
        }
      }
    });
  }
  
  // 根據裝置類型調整 UI 佈局
  adjustLayout(): void {
    const isMobile = this.isMobile();
    const isTablet = this.isTablet();
    
    if (isMobile) {
      // 行動裝置佈局調整
      document.documentElement.classList.add('is-mobile');
      document.documentElement.classList.remove('is-tablet', 'is-desktop');
      
      // 簡化行動裝置上的動畫
      if (this.shouldReduceMotion()) {
        document.documentElement.classList.add('reduce-motion');
      }
    } else if (isTablet) {
      // 平板佈局調整
      document.documentElement.classList.add('is-tablet');
      document.documentElement.classList.remove('is-mobile', 'is-desktop');
    } else {
      // 桌面佈局調整
      document.documentElement.classList.add('is-desktop');
      document.documentElement.classList.remove('is-mobile', 'is-tablet');
    }
  }
  
  // 檢測是否應該減少動畫效果
  shouldReduceMotion(): boolean {
    // 檢查用戶系統偏好
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return true;
    }
    
    // 檢查是否為低效能裝置
    if (this.isLowPerformanceDevice()) {
      return true;
    }
    
    // 檢查電池狀態
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        if (battery.level < 0.2 && !battery.charging) {
          return true;
        }
      }).catch(() => false);
    }
    
    return false;
  }
  
  // 檢測是否為低效能裝置
  isLowPerformanceDevice(): boolean {
    // 檢查處理器核心數
    const cores = navigator.hardwareConcurrency || 0;
    if (cores < 4) return true;
    
    // 檢查裝置記憶體 (如果可用)
    if ('deviceMemory' in navigator) {
      const memory = (navigator as any).deviceMemory || 0;
      if (memory < 4) return true;
    }
    
    // 檢查是否為舊版 Android
    const userAgent = navigator.userAgent;
    if (/Android\s[0-5]\./.test(userAgent)) {
      return true;
    }
    
    return false;
  }

  // 監聽視窗大小變化
  setupResizeListener(): void {
    let resizeTimer: NodeJS.Timeout;
    
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        this.adjustFontSize();
        this.adjustSpacing();
        this.optimizeImages();
        this.updateViewportHeight();
        this.adjustLayout();
        
        // 觸發所有註冊的 resize 監聽器
        this.resizeListeners.forEach(listener => listener());
      }, 250);
    };
    
    window.addEventListener('resize', handleResize);
  }
  
  // 註冊 resize 監聽器
  addResizeListener(listener: () => void): void {
    this.resizeListeners.push(listener);
  }
  
  // 移除 resize 監聽器
  removeResizeListener(listener: () => void): void {
    const index = this.resizeListeners.indexOf(listener);
    if (index !== -1) {
      this.resizeListeners.splice(index, 1);
    }
  }

  // 更新視窗高度 (解決行動裝置地址欄問題)
  updateViewportHeight(): void {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }

  // 檢查瀏覽器支援
  checkBrowserSupport(): {
    webp: boolean;
    avif: boolean;
    intersectionObserver: boolean;
    serviceWorker: boolean;
    css: {
      grid: boolean;
      flexbox: boolean;
      customProperties: boolean;
    };
  } {
    return {
      webp: this.supportsWebP(),
      avif: this.supportsAVIF(),
      intersectionObserver: 'IntersectionObserver' in window,
      serviceWorker: 'serviceWorker' in navigator,
      css: {
        grid: CSS.supports('display', 'grid'),
        flexbox: CSS.supports('display', 'flex'),
        customProperties: CSS.supports('--test', 'test')
      }
    };
  }

  private supportsWebP(): boolean {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }
  
  private supportsAVIF(): boolean {
    return false; // 目前簡單返回 false，實際應該使用特性檢測
  }

  // 初始化響應式功能
  initialize(): void {
    this.adjustFontSize();
    this.adjustSpacing();
    this.updateViewportHeight();
    this.setupResizeListener();
    this.adjustLayout();
    
    // 設置 CSS 自定義屬性
    const support = this.checkBrowserSupport();
    document.documentElement.classList.toggle('webp', support.webp);
    document.documentElement.classList.toggle('no-webp', !support.webp);
    document.documentElement.classList.toggle('avif', support.avif);
    document.documentElement.classList.toggle('no-avif', !support.avif);
    
    // 檢查是否為觸控裝置
    if (this.isTouchDevice()) {
      document.documentElement.classList.add('touch-device');
    } else {
      document.documentElement.classList.add('no-touch');
    }
    
    // 初始優化圖片
    this.optimizeImages();
    
    // 初始化完成後觸發一次 resize 事件
    window.dispatchEvent(new Event('resize'));
  }
}