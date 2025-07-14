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
    return window.innerWidth < this.breakpoints.md;
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
    
    images.forEach((img) => {
      const htmlImg = img as HTMLImageElement;
      const breakpoint = this.getCurrentBreakpoint();
      const baseSrc = htmlImg.dataset.src || htmlImg.src;
      
      // 根據斷點載入不同尺寸的圖片
      let optimizedSrc = baseSrc;
      if (breakpoint === 'xs' || breakpoint === 'sm') {
        optimizedSrc = baseSrc.replace(/\.(jpg|jpeg|png)$/i, '_small.$1');
      } else if (breakpoint === 'md') {
        optimizedSrc = baseSrc.replace(/\.(jpg|jpeg|png)$/i, '_medium.$1');
      }
      
      htmlImg.src = optimizedSrc;
    });
  }

  // 監聽視窗大小變化
  setupResizeListener(): void {
    let resizeTimer: NodeJS.Timeout;
    
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        this.adjustFontSize();
        this.adjustSpacing();
        this.optimizeImages();
        this.updateViewportHeight();
      }, 250);
    });
  }

  // 更新視窗高度 (解決行動裝置地址欄問題)
  updateViewportHeight(): void {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }

  // 檢查瀏覽器支援
  checkBrowserSupport(): {
    webp: boolean;
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

  // 初始化響應式功能
  initialize(): void {
    this.adjustFontSize();
    this.adjustSpacing();
    this.updateViewportHeight();
    this.setupResizeListener();
    
    // 設置 CSS 自定義屬性
    const support = this.checkBrowserSupport();
    document.documentElement.classList.toggle('webp', support.webp);
    document.documentElement.classList.toggle('no-webp', !support.webp);
  }
}