// 錯誤報告工具
export interface ErrorReport {
  type: '404' | '500' | 'other';
  url: string;
  pathname: string;
  referrer: string;
  userAgent: string;
  timestamp: number;
  message?: string;
}

export class ErrorReporter {
  private static instance: ErrorReporter;
  private errorQueue: ErrorReport[] = [];
  private maxQueueSize = 10;

  static getInstance(): ErrorReporter {
    if (!ErrorReporter.instance) {
      ErrorReporter.instance = new ErrorReporter();
    }
    return ErrorReporter.instance;
  }

  // 報告404錯誤
  report404Error(pathname: string, referrer: string = ''): void {
    const errorReport: ErrorReport = {
      type: '404',
      url: window.location.href,
      pathname,
      referrer,
      userAgent: navigator.userAgent,
      timestamp: Date.now(),
      message: `404錯誤：頁面 ${pathname} 未找到`
    };

    this.addToQueue(errorReport);
    this.sendErrorReport(errorReport);
  }

  // 報告一般錯誤
  reportError(error: Error, context?: string): void {
    const errorReport: ErrorReport = {
      type: 'other',
      url: window.location.href,
      pathname: window.location.pathname,
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      timestamp: Date.now(),
      message: `${context ? context + ': ' : ''}${error.message}`
    };

    this.addToQueue(errorReport);
    this.sendErrorReport(errorReport);
  }

  // 添加到錯誤隊列
  private addToQueue(errorReport: ErrorReport): void {
    this.errorQueue.push(errorReport);
    
    // 保持隊列大小
    if (this.errorQueue.length > this.maxQueueSize) {
      this.errorQueue.shift();
    }

    // 保存到本地存儲
    this.saveToLocalStorage();
  }

  // 發送錯誤報告
  private sendErrorReport(errorReport: ErrorReport): void {
    // 這裡可以發送到分析服務或日誌服務
    // 目前只是記錄到控制台
    console.warn('錯誤報告:', errorReport);

    // 如果有Google Analytics，可以發送事件
    if (typeof gtag !== 'undefined') {
      gtag('event', 'error_report', {
        event_category: 'error',
        event_label: errorReport.type,
        value: 1,
        custom_map: {
          'error_url': errorReport.url,
          'error_pathname': errorReport.pathname,
          'error_referrer': errorReport.referrer
        }
      });
    }
  }

  // 保存到本地存儲
  private saveToLocalStorage(): void {
    try {
      localStorage.setItem('error_reports', JSON.stringify(this.errorQueue));
    } catch (error) {
      console.warn('無法保存錯誤報告到本地存儲:', error);
    }
  }

  // 從本地存儲載入
  loadFromLocalStorage(): void {
    try {
      const stored = localStorage.getItem('error_reports');
      if (stored) {
        this.errorQueue = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('無法從本地存儲載入錯誤報告:', error);
    }
  }

  // 獲取錯誤統計
  getErrorStats(): { total: number; byType: Record<string, number> } {
    const stats = {
      total: this.errorQueue.length,
      byType: {} as Record<string, number>
    };

    this.errorQueue.forEach(error => {
      stats.byType[error.type] = (stats.byType[error.type] || 0) + 1;
    });

    return stats;
  }

  // 清除錯誤隊列
  clearQueue(): void {
    this.errorQueue = [];
    localStorage.removeItem('error_reports');
  }

  // 獲取最近的錯誤
  getRecentErrors(count: number = 5): ErrorReport[] {
    return this.errorQueue.slice(-count);
  }
}

// 全局錯誤處理器
export const setupGlobalErrorHandling = (): void => {
  const errorReporter = ErrorReporter.getInstance();

  // 載入已保存的錯誤報告
  errorReporter.loadFromLocalStorage();

  // 捕獲未處理的錯誤
  window.addEventListener('error', (event) => {
    errorReporter.reportError(event.error, '未處理的錯誤');
  });

  // 捕獲未處理的Promise拒絕
  window.addEventListener('unhandledrejection', (event) => {
    errorReporter.reportError(
      new Error(event.reason?.message || 'Promise拒絕'),
      '未處理的Promise拒絕'
    );
  });
}; 