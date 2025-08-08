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
  }

  // 設置內容安全政策 (CSP)
  private setupCSP(): void {
    const cspMeta = document.createElement('meta');
    cspMeta.httpEquiv = 'Content-Security-Policy';
    cspMeta.content = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://www.google-analytics.com",
      "frame-src 'self' https://open.spotify.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'"
    ].join('; ');
    
    document.head.appendChild(cspMeta);
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
    set: (key: string, value: unknown): void => {
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

    get: (key: string): unknown => {
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
      } catch {
        localStorage.removeItem(key);
        return null;
      }
    }
  };

  private generateChecksum(data: string): string {
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // 轉換為 32 位整數
    }
    return hash.toString();
  }
}