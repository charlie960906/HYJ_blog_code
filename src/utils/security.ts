// 資安防護工具
export class SecurityManager {
  private static instance: SecurityManager;

  static getInstance(): SecurityManager {
    if (!SecurityManager.instance) {
      SecurityManager.instance = new SecurityManager();
    }
    return SecurityManager.instance;
  }

  // 初始化安全措施
  initializeSecurity(): void {
    this.setupCSP();
    this.preventClickjacking();
    this.sanitizeInputs();
    this.setupSecureHeaders();
    this.setupPrivacyConsent();
  }

  // 設置內容安全政策 (CSP)
  private setupCSP(): void {
    // 生成 nonce 用於內聯腳本
    const nonce = this.generateSecureId();

    const cspMeta = document.createElement('meta');
    cspMeta.httpEquiv = 'Content-Security-Policy';
    cspMeta.content = [
      "default-src 'self'",
      `script-src 'self' https://www.googletagmanager.com https://www.google-analytics.com 'nonce-${nonce}'`,
      "style-src 'self' https://fonts.googleapis.com 'nonce-${nonce}'",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://www.google-analytics.com",
      "frame-src 'self' https://open.spotify.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "upgrade-insecure-requests"
    ].join('; ');

    document.head.appendChild(cspMeta);

    // 將 nonce 存儲在全局變數中供其他腳本使用
    (window as any).cspNonce = nonce;
  }

  // 防止點擊劫持
  private preventClickjacking(): void {
    const frameOptions = document.createElement('meta');
    frameOptions.httpEquiv = 'X-Frame-Options';
    frameOptions.content = 'DENY';
    document.head.appendChild(frameOptions);
  }

  // 設置安全標頭
  private setupSecureHeaders(): void {
    // X-Content-Type-Options
    const noSniff = document.createElement('meta');
    noSniff.httpEquiv = 'X-Content-Type-Options';
    noSniff.content = 'nosniff';
    document.head.appendChild(noSniff);

    // Referrer Policy
    const referrerPolicy = document.createElement('meta');
    referrerPolicy.name = 'referrer';
    referrerPolicy.content = 'strict-origin-when-cross-origin';
    document.head.appendChild(referrerPolicy);
  }

  // 輸入清理
  private sanitizeInputs(): void {
    // 監聽所有表單輸入
    document.addEventListener('input', (event) => {
      const target = event.target as HTMLInputElement;
      if (target.type === 'text' || target.tagName === 'TEXTAREA') {
        target.value = this.sanitizeString(target.value);
      }
    });
  }

  // 字串清理函數
  sanitizeString(input: string): string {
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // 移除 script 標籤
      .replace(/javascript:/gi, '') // 移除 javascript: 協議
      .replace(/on\w+\s*=/gi, '') // 移除事件處理器
      .replace(/data:/gi, '') // 移除 data: 協議
      .trim();
  }

  // URL 驗證
  isValidUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return ['http:', 'https:'].includes(urlObj.protocol);
    } catch {
      return false;
    }
  }

  // 檢查惡意內容
  detectMaliciousContent(content: string): boolean {
    const maliciousPatterns = [
      /<script/i,
      /javascript:/i,
      /vbscript:/i,
      /on\w+\s*=/i,
      /<iframe/i,
      /<object/i,
      /<embed/i
    ];

    return maliciousPatterns.some(pattern => pattern.test(content));
  }

  // 生成安全的隨機 ID
  generateSecureId(): string {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  // 檢查 HTTPS
  enforceHTTPS(): void {
    if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
      location.replace(`https:${location.href.substring(location.protocol.length)}`);
    }
  }

  // 防止 XSS 攻擊的 HTML 編碼
  escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // 安全的 localStorage 操作
  secureStorage = {
    set: (key: string, value: any): void => {
      try {
        const secureValue = {
          data: value,
          timestamp: Date.now(),
          checksum: this.generateChecksum(JSON.stringify(value))
        };
        localStorage.setItem(key, JSON.stringify(secureValue));
      } catch (error) {
        console.error('Storage error:', error);
      }
    },

    get: (key: string): any => {
      try {
        const stored = localStorage.getItem(key);
        if (!stored) return null;

        const parsed = JSON.parse(stored);
        const expectedChecksum = this.generateChecksum(JSON.stringify(parsed.data));
        
        if (parsed.checksum !== expectedChecksum) {
          localStorage.removeItem(key);
          return null;
        }

        return parsed.data;
      } catch (error) {
        localStorage.removeItem(key);
        return null;
      }
    }
  };

  // 隱私同意管理
  private setupPrivacyConsent(): void {
    const consent = this.getPrivacyConsent();
    if (!consent) {
      this.showPrivacyBanner();
    }
  }

  // 顯示隱私同意橫幅
  private showPrivacyBanner(): void {
    const banner = document.createElement('div');
    banner.id = 'privacy-banner';
    banner.className = 'fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 z-50';
    banner.innerHTML = `
      <div class="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between">
        <div class="mb-4 sm:mb-0 sm:mr-4">
          <p class="text-sm">
            我們使用 cookies 和類似技術來改善您的瀏覽體驗並分析網站流量。
            <a href="/privacy" class="underline hover:no-underline">了解更多</a>
          </p>
        </div>
        <div class="flex space-x-2">
          <button id="accept-all" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm">
            接受全部
          </button>
          <button id="accept-essential" class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded text-sm">
            僅必要
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(banner);

    // 添加事件監聽器
    document.getElementById('accept-all')?.addEventListener('click', () => {
      this.setPrivacyConsent({ analytics: true, marketing: true });
      banner.remove();
    });

    document.getElementById('accept-essential')?.addEventListener('click', () => {
      this.setPrivacyConsent({ analytics: false, marketing: false });
      banner.remove();
    });
  }

  // 獲取隱私同意
  getPrivacyConsent(): { analytics: boolean; marketing: boolean } | null {
    try {
      const consent = localStorage.getItem('privacy-consent');
      return consent ? JSON.parse(consent) : null;
    } catch {
      return null;
    }
  }

  // 設置隱私同意
  setPrivacyConsent(consent: { analytics: boolean; marketing: boolean }): void {
    try {
      localStorage.setItem('privacy-consent', JSON.stringify(consent));
    } catch (error) {
      console.error('無法儲存隱私同意:', error);
    }
  }

  // 檢查是否可以載入分析腳本
  canLoadAnalytics(): boolean {
    const consent = this.getPrivacyConsent();
    return consent ? consent.analytics : false;
  }