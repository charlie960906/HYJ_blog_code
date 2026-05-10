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
    this.checkTouchTargets();
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
      const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, a, button');
      
      textElements.forEach(element => {
        const styles = window.getComputedStyle(element);
        const textColor = styles.color;
        const backgroundColor = styles.backgroundColor;
        
        // 跳過透明背景
        if (backgroundColor === 'rgba(0, 0, 0, 0)' || backgroundColor === 'transparent') {
          return;
        }
        
        const contrastRatio = this.getContrastRatio(textColor, backgroundColor);
        const requiredRatio = this.getRequiredContrastRatio(element);
        
        if (contrastRatio < requiredRatio) {
          console.warn(`顏色對比度不足 (${contrastRatio.toFixed(2)}:${requiredRatio}):`, element, { textColor, backgroundColor });
        }
      });
    }
  }

  // 獲取所需的對比度比例
  private getRequiredContrastRatio(element: Element): number {
    const tagName = element.tagName.toLowerCase();
    const fontSize = parseFloat(window.getComputedStyle(element).fontSize);
    
    // 大文本（18pt+ 或 14pt+粗體）需要 3:1，其餘需要 4.5:1
    const isLargeText = fontSize >= 18 || (fontSize >= 14 && window.getComputedStyle(element).fontWeight >= '700');
    
    return isLargeText ? 3.0 : 4.5;
  }

  // 增強的顏色解析（支援 RGB、RGBA、HEX）
  private parseRGB(color: string): [number, number, number] | null {
    // RGB/RGBA 格式
    const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
    if (rgbMatch) {
      return [parseInt(rgbMatch[1]), parseInt(rgbMatch[2]), parseInt(rgbMatch[3])];
    }
    
    // HEX 格式
    const hexMatch = color.match(/^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
    if (hexMatch) {
      return [
        parseInt(hexMatch[1], 16),
        parseInt(hexMatch[2], 16),
        parseInt(hexMatch[3], 16)
      ];
    }
    
    // 簡寫 HEX 格式
    const shortHexMatch = color.match(/^#([a-f\d])([a-f\d])([a-f\d])$/i);
    if (shortHexMatch) {
      return [
        parseInt(shortHexMatch[1] + shortHexMatch[1], 16),
        parseInt(shortHexMatch[2] + shortHexMatch[2], 16),
        parseInt(shortHexMatch[3] + shortHexMatch[3], 16)
      ];
    }
    
    return null;
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

  // 檢查互動元素的可觸控目標大小
  checkTouchTargets(): void {
    if (import.meta.env.DEV) {
      const interactiveElements = document.querySelectorAll('button, a, input[type="button"], input[type="submit"], [role="button"]');
      
      interactiveElements.forEach(element => {
        const rect = element.getBoundingClientRect();
        const minSize = 44; // WCAG 建議的最小觸控目標大小（44x44px）
        
        if (rect.width < minSize || rect.height < minSize) {
          console.warn(`觸控目標太小 (${rect.width.toFixed(1)}x${rect.height.toFixed(1)}px，建議至少 ${minSize}x${minSize}px):`, element);
        }
      });
    }
  }
}