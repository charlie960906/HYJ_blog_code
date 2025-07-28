import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SEOManager } from '../utils/seo';
import { trackEvent } from '../utils/analytics';
import { AccessibilityManager } from '../utils/accessibility';
import { ErrorReporter } from '../utils/errorReporting';

const NotFoundPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();

  // 頁面載入後立即顯示
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // SEO 優化
  useEffect(() => {
    const seoManager = SEOManager.getInstance();
    seoManager.setPageMetadata({
      title: "404 - 頁面未找到 | HYJ's Blog",
      description: "抱歉，您要尋找的頁面不存在。讓我們一起回到首頁，繼續探索精彩內容吧！",
      keywords: ['404', '頁面未找到', '錯誤頁面'],
      type: 'website',
      url: window.location.href
    });

    // 追蹤 404 錯誤
    trackEvent('404_error', {
      event_category: 'error',
      event_label: window.location.pathname,
      page_url: window.location.href,
      referrer: document.referrer
    });

    // 報告 404 錯誤
    const errorReporter = ErrorReporter.getInstance();
    errorReporter.report404Error(window.location.pathname, document.referrer);

    // 無障礙功能
    const accessibilityManager = AccessibilityManager.getInstance();
    accessibilityManager.announceToScreenReader('404錯誤頁面已載入，頁面未找到');

    // 添加 noindex 標籤，避免搜尋引擎索引 404 頁面
    const noindexMeta = document.createElement('meta');
    noindexMeta.name = 'robots';
    noindexMeta.content = 'noindex, nofollow';
    document.head.appendChild(noindexMeta);
    
    return () => {
      // 清理時移除 noindex 標籤
      const existingNoindex = document.querySelector('meta[name="robots"][content="noindex, nofollow"]');
      if (existingNoindex) {
        existingNoindex.remove();
      }
    };
  }, []);

  // 處理搜尋
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      trackEvent('404_search', { 
        event_category: 'navigation',
        search_term: searchQuery.trim()
      });
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 pt-20">
      <div className={`text-center max-w-2xl mx-auto transition-all duration-1000 ${
        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        {/* 404 圖示 */}
        <div className="mb-8 animate-fadeIn">
          <div className="relative h-40 sm:h-48 md:h-56 lg:h-64 flex items-center justify-center">
            <div className="text-7xl sm:text-8xl md:text-9xl lg:text-[10rem] font-bold text-white/10 select-none animate-pulse-subtle">404</div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white/20 select-none animate-pulse-subtle" style={{ animationDelay: '0.2s' }}>404</div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white/30 select-none animate-pulse-subtle" style={{ animationDelay: '0.4s' }}>404</div>
            </div>
          </div>
        </div>

        {/* 主要內容 */}
        <div className="glassmorphism-card p-8 mb-8 animate-slideInUp" style={{ animationDelay: '0.3s' }}>
          <h1 className="text-4xl font-bold text-white mb-4">
            頁面不見了！
          </h1>
          <p className="text-white/80 text-lg mb-6 leading-relaxed">
            看起來您要找的頁面已經搬家了，或者從來沒有存在過。
            <br />
            別擔心，讓我們一起找到正確的方向！
          </p>

          {/* 搜尋功能 */}
          <div className="mb-8 animate-fadeIn" style={{ animationDelay: '0.6s' }}>
            <form onSubmit={handleSearch} className="max-w-md mx-auto">
              <div className="flex items-center bg-white/10 rounded-lg border border-white/20 focus-within:border-blue-400 transition-colors">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜尋文章..."
                  className="flex-1 px-4 py-3 bg-transparent text-white placeholder-white/60 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-3 text-white/80 hover:text-white transition-colors"
                  disabled={!searchQuery.trim()}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </form>
          </div>

          {/* 建議操作 */}
          <div className="space-y-4 mb-8 animate-fadeIn" style={{ animationDelay: '0.8s' }}>
            <div className="flex items-center justify-center space-x-2 text-white/60">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="text-sm">檢查網址是否正確</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-white/60">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span className="text-sm">瀏覽其他精彩文章</span>
            </div>
          </div>

          {/* 按鈕組 */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fadeIn" style={{ animationDelay: '1s' }}>
            <Link
              to="/"
              onClick={() => trackEvent('404_home_click', { event_category: 'navigation' })}
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              回到首頁
            </Link>
            <button
              onClick={() => {
                trackEvent('404_back_click', { event_category: 'navigation' });
                window.history.back();
              }}
              className="inline-flex items-center justify-center px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-all duration-200 hover:scale-105 border border-white/20"
              aria-label="返回上一頁"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              返回上頁
            </button>
          </div>
        </div>

        {/* 額外建議 */}
        <div className="glassmorphism-card p-6 animate-slideInUp" style={{ animationDelay: '0.5s' }}>
          <h2 className="text-xl font-semibold text-white mb-4">
            您可能感興趣的內容
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              to="/"
              onClick={() => trackEvent('404_latest_posts_click', { event_category: 'navigation' })}
              className="block p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-all duration-200 hover:scale-105 border border-white/10"
            >
              <h3 className="text-white font-medium mb-2">最新文章</h3>
              <p className="text-white/60 text-sm">探索最新的程式設計和演算法文章</p>
            </Link>
            <Link
              to="/tags"
              onClick={() => trackEvent('404_tags_click', { event_category: 'navigation' })}
              className="block p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-all duration-200 hover:scale-105 border border-white/10"
            >
              <h3 className="text-white font-medium mb-2">標籤雲</h3>
              <p className="text-white/60 text-sm">按主題瀏覽所有文章標籤</p>
            </Link>
            <Link
              to="/about"
              onClick={() => trackEvent('404_about_click', { event_category: 'navigation' })}
              className="block p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-all duration-200 hover:scale-105 border border-white/10"
            >
              <h3 className="text-white font-medium mb-2">關於我</h3>
              <p className="text-white/60 text-sm">了解更多關於 HYJ 的資訊</p>
            </Link>
            <Link
              to="/friends"
              onClick={() => trackEvent('404_friends_click', { event_category: 'navigation' })}
              className="block p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-all duration-200 hover:scale-105 border border-white/10"
            >
              <h3 className="text-white font-medium mb-2">友情連結</h3>
              <p className="text-white/60 text-sm">發現其他優秀的技術部落格</p>
            </Link>
          </div>
        </div>

        {/* 有趣的 404 事實 */}
        <div className="mt-8 text-center animate-fadeIn" style={{ animationDelay: '1.2s' }}>
          <div className="inline-block glassmorphism-card p-4">
            <p className="text-white/60 text-sm">
              💡 你知道嗎？404 錯誤是以 HTTP 狀態碼命名的，
              <br />
              代表「找不到請求的資源」
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage; 