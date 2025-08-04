import React, { useState, useEffect } from 'react';
import { Clock, FileText, BarChart3, Monitor } from 'lucide-react';
import { calculateUptime } from '../utils/time';
import { getAnalyticsData } from '../utils/analytics';

const Footer: React.FC = () => {
  const [uptime, setUptime] = useState(calculateUptime());
  const [analytics, setAnalytics] = useState({
    totalPosts: 0,
    totalWords: 0
  });

  useEffect(() => {
    // Update uptime every second
    const interval = setInterval(() => {
      setUptime(calculateUptime());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const loadAnalytics = async () => {
      const data = await getAnalyticsData();
      setAnalytics({
        totalPosts: data.totalPosts,
        totalWords: data.totalWords
      });
    };

    loadAnalytics();
  }, []);

  return (
    <footer className="footer glassmorphism-card mt-12 sm:mt-16 lg:mt-20 p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto">
        {/* 版權資訊 */}
        <div className="text-center text-white/70">
          <p className="text-sm sm:text-base lg:text-lg font-medium">© 2025 HYJ's Blog.</p>
          <p className="mt-1 sm:mt-2 text-xs sm:text-sm lg:text-base text-white/60">
            Powered by React 18 & Vite
          </p>
          
          {/* 運行時間 - 響應式布局 */}
          <div className="mt-4 sm:mt-5 lg:mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <div className="flex items-center">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 mr-2" />
              <span className="text-white/60 mr-2 sm:mr-3 text-sm sm:text-base">運行時間:</span>
            </div>
            <div className="footer-uptime flex items-center space-x-2 sm:space-x-3 text-sm sm:text-base">
              <span className="text-white font-semibold">{uptime.days}</span>
              <span className="text-white/60">天</span>
              <span className="text-white font-semibold">{uptime.hours}</span>
              <span className="text-white/60">時</span>
              <span className="text-white font-semibold">{uptime.minutes}</span>
              <span className="text-white/60">分</span>
              <span className="text-white font-semibold">{uptime.seconds}</span>
              <span className="text-white/60">秒</span>
            </div>
          </div>
          
          {/* 統計資訊 - 響應式網格 */}
          <div className="footer-stats mt-4 sm:mt-5 lg:mt-6 grid grid-cols-2 sm:flex sm:items-center sm:justify-center gap-4 sm:gap-8 lg:gap-12">
            <div className="flex items-center justify-center sm:justify-start">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 mr-2" />
              <span className="text-white/60 mr-2 text-sm sm:text-base">文章:</span>
              <span className="text-white font-semibold text-sm sm:text-base">{analytics.totalPosts}</span>
            </div>
            <div className="flex items-center justify-center sm:justify-start">
              <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 mr-2" />
              <span className="text-white/60 mr-2 text-sm sm:text-base">字數:</span>
              <span className="text-white font-semibold text-sm sm:text-base">{analytics.totalWords.toLocaleString()}</span>
            </div>
          </div>
          
          <div className="text-xs sm:text-sm lg:text-base text-white/50 mt-3 sm:mt-4 lg:mt-5">
            自 2025年3月1日 起穩定運行
          </div>
        </div>

        {/* 分隔線 */}
        <div className="border-t border-white/10 my-5 sm:my-6 lg:my-8"></div>

        {/* 建議使用的瀏覽器 - 簡潔文字版本 */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-3 sm:mb-4">
            <Monitor className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 mr-2" />
            <span className="text-white/60 text-sm sm:text-base font-medium">建議使用</span>
          </div>
          <div className="text-white/50 text-sm sm:text-base lg:text-lg">
            Chrome 90+ / Firefox 88+ / Safari 14+ / Edge 90+
          </div>
          <div className="text-white/40 text-xs sm:text-sm mt-2">
            支援 ES2020、CSS Grid、Flexbox、JPG 等現代技術
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;