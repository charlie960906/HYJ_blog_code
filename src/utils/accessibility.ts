// 無障礙功能工具
export class AccessibilityManager {
  private static instance: AccessibilityManager;

  static getInstance(): AccessibilityManager {
    if (!AccessibilityManager.instance) {
      AccessibilityManager.instance = new AccessibilityManager();
    }
    return AccessibilityManager.instance;
  }

  // 初始化無障礙功能
  initialize(): void {
    this.setupKeyboardNavigation();
    this.setupFocusManagement();
    this.setupScreenReaderSupport();
    this.setupColorContrastCheck();
    this.setupReducedMotion();
  }

  // 鍵盤導航
  private setupKeyboardNavigation(): void {
    document.addEventListener('keydown', (event) => {
      // ESC 鍵關閉模態框
      if (event.key === 'Escape') {
        const modals = document.querySelectorAll('[role="dialog"], .modal, .lightbox');
        modals.forEach(modal => {
          if (modal.classList.contains('active') || modal.classList.contains('open')) {
            (modal as HTMLElement).click();
          }
        });
      }

      // Tab 鍵焦點管理
      if (event.key === 'Tab') {
        this.handleTabNavigation(event);
      }

      // Enter 和 Space 鍵激活元素
      if (event.key === 'Enter' || event.key === ' ') {
        const target = event.target as HTMLElement;
        if (target.getAttribute('role') === 'button' && !target.disabled) {
          event.preventDefault();
          target.click();
        }
      }
    });
  }

  // 焦點管理
  private setupFocusManagement(): void {
    // 跳過連結
    this.createSkipLink();

    // 焦點指示器
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
      }
    });

    document.addEventListener('mousedown', () => {
      document.body.classList.remove('keyboard-navigation');
    });
  }

  // 創建跳過連結
  private createSkipLink(): void {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = '跳到主要內容';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
      position: absolute;
      top: -40px;
      left: 6px;
      background: #000;
      color: #fff;
      padding: 8px;
      text-decoration: none;
      z-index: 10000;
      border-radius: 4px;
    `;

    skipLink.addEventListener('focus', () => {
      skipLink.style.top = '6px';
    });

    skipLink.addEventListener('blur', () => {
      skipLink.style.top = '-40px';
    });

    document.body.insertBefore(skipLink, document.body.firstChild);
  }

  // Tab 導航處理
  private handleTabNavigation(event: KeyboardEvent): void {
    const focusableElements = this.getFocusableElements();
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey) {
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  }

  // 獲取可聚焦元素
  private getFocusableElements(): HTMLElement[] {
    const selector = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])'
    ].join(', ');

    return Array.from(document.querySelectorAll(selector)) as HTMLElement[];
  }

  // 螢幕閱讀器支援
  private setupScreenReaderSupport(): void {
    // 為圖片添加 alt 屬性檢查
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      if (!img.alt && !img.getAttribute('aria-label')) {
        console.warn('圖片缺少 alt 屬性:', img.src);
        img.alt = '圖片';
      }
    });

    // 為互動元素添加 ARIA 標籤
    const interactiveElements = document.querySelectorAll('button, [role="button"]');
    interactiveElements.forEach(element => {
      if (!element.getAttribute('aria-label') && !element.textContent?.trim()) {
        console.warn('互動元素缺少標籤:', element);
      }
    });
  }

  // 顏色對比檢查
  private setupColorContrastCheck(): void {
    if (import.meta.env.DEV) {
      const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, a');
      
      textElements.forEach(element => {
        const styles = window.getComputedStyle(element);
        const textColor = styles.color;
        const backgroundColor = styles.backgroundColor;
        
        if (this.getContrastRatio(textColor, backgroundColor) < 4.5) {
          console.warn('顏色對比度不足:', element, { textColor, backgroundColor });
        }
      });
    }
  }

  // 計算顏色對比度
  private getContrastRatio(color1: string, color2: string): number {
    // 簡化的對比度計算，實際應用中需要更精確的計算
    const rgb1 = this.parseRGB(color1);
    const rgb2 = this.parseRGB(color2);
    
    const l1 = this.getLuminance(rgb1);
    const l2 = this.getLuminance(rgb2);
    
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    
    return (lighter + 0.05) / (darker + 0.05);
  }

  private parseRGB(color: string): [number, number, number] {
    const match = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (match) {
      return [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];
    }
    return [0, 0, 0];
  }

  private getLuminance([r, g, b]: [number, number, number]): number {
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  }

  // 減少動畫設定
  private setupReducedMotion(): void {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const handleReducedMotion = (mediaQuery: MediaQueryList) => {
      if (mediaQuery.matches) {
        document.documentElement.classList.add('reduce-motion');
        // 禁用所有動畫
        const style = document.createElement('style');
        style.textContent = `
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        `;
        document.head.appendChild(style);
      }
    };

    handleReducedMotion(prefersReducedMotion);
    prefersReducedMotion.addEventListener('change', handleReducedMotion);
  }

  // 設置 ARIA 實時區域
  setupLiveRegion(): HTMLElement {
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    liveRegion.style.cssText = `
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    `;
    document.body.appendChild(liveRegion);
    return liveRegion;
  }

  // 宣告訊息給螢幕閱讀器
  announceToScreenReader(message: string): void {
    const liveRegion = document.querySelector('[aria-live]') || this.setupLiveRegion();
    liveRegion.textContent = message;
    
    // 清除訊息
    setTimeout(() => {
      liveRegion.textContent = '';
    }, 1000);
  }
}