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
    <footer className="glassmorphism-card mt-16 p-8">
      <div className="container mx-auto">
        {/* 版權資訊 */}
        <div className="text-center text-white/70 text-sm">
          <p>© 2025 HYJ's Blog.</p>
          <p className="mt-2">
            Powered by React 18 & Vite
          </p>
          
          {/* 運行時間 - 居中 */}
          <div className="mt-4 flex items-center justify-center">
            <Clock className="w-4 h-4 text-blue-400 mr-2" />
            <span className="text-white/60 mr-3">運行時間:</span>
            <div className="flex items-center space-x-2">
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
          
          {/* 統計資訊 - 居中，與運行時間在同一行 */}
          <div className="mt-3 flex items-center justify-center space-x-6">
            <div className="flex items-center">
              <FileText className="w-4 h-4 text-blue-400 mr-1" />
              <span className="text-white/60 mr-2">文章:</span>
              <span className="text-white font-medium">{analytics.totalPosts}</span>
            </div>
            <div className="flex items-center">
              <BarChart3 className="w-4 h-4 text-green-400 mr-1" />
              <span className="text-white/60 mr-2">字數:</span>
              <span className="text-white font-medium">{analytics.totalWords.toLocaleString()}</span>
            </div>
          </div>
          
          <div className="text-xs text-white/50 mt-2">
            自 2025年3月1日 起穩定運行
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;