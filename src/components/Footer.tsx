import React, { useState, useEffect } from 'react';
import { Clock, FileText, BarChart3 } from 'lucide-react';
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
    <footer className="footer glassmorphism-card mt-12 sm:mt-16 p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto">
        {/* 版權資訊 */}
        <div className="text-center text-white/70 text-xs sm:text-sm">
          <p className="text-sm sm:text-base">© 2025 HYJ's Blog.</p>
          <p className="mt-1 sm:mt-2 text-xs sm:text-sm">
            Powered by React 18 & Vite
          </p>
          
          {/* 運行時間 - 響應式布局 */}
          <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-0">
            <div className="flex items-center">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400 mr-2" />
              <span className="text-white/60 mr-2 sm:mr-3 text-xs sm:text-sm">運行時間:</span>
            </div>
            <div className="footer-uptime flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm">
              <span className="text-white font-medium">{uptime.days}</span>
              <span className="text-white/60">天</span>
              <span className="text-white font-medium">{uptime.hours}</span>
              <span className="text-white/60">時</span>
              <span className="text-white font-medium">{uptime.minutes}</span>
              <span className="text-white/60">分</span>
              <span className="text-white font-medium">{uptime.seconds}</span>
              <span className="text-white/60">秒</span>
            </div>
          </div>
          
          {/* 統計資訊 - 響應式網格 */}
          <div className="footer-stats mt-3 sm:mt-3 grid grid-cols-2 sm:flex sm:items-center sm:justify-center sm:space-x-6 gap-3 sm:gap-0">
            <div className="flex items-center justify-center sm:justify-start">
              <FileText className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400 mr-1" />
              <span className="text-white/60 mr-1 sm:mr-2 text-xs sm:text-sm">文章:</span>
              <span className="text-white font-medium text-xs sm:text-sm">{analytics.totalPosts}</span>
            </div>
            <div className="flex items-center justify-center sm:justify-start">
              <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4 text-green-400 mr-1" />
              <span className="text-white/60 mr-1 sm:mr-2 text-xs sm:text-sm">字數:</span>
              <span className="text-white font-medium text-xs sm:text-sm">{analytics.totalWords.toLocaleString()}</span>
            </div>
          </div>
          
          <div className="text-xs text-white/50 mt-2 sm:mt-2">
            自 2025年3月1日 起穩定運行
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;