import React, { useState, useEffect } from 'react';
import { BarChart3, Eye, MousePointer, FileText, Clock } from 'lucide-react';
import { calculateUptime } from '../utils/time';
import { getAnalyticsData } from '../utils/analytics';

const Footer: React.FC = () => {
  const [uptime, setUptime] = useState(calculateUptime());
  const [analytics, setAnalytics] = useState({
    totalPosts: 0,
    totalWords: 0,
    totalClicks: 0,
    totalViews: 0
  });

  useEffect(() => {
    // Update uptime every second
    const interval = setInterval(() => {
      setUptime(calculateUptime());
    }, 1000);

    // Load analytics data
    const loadAnalytics = async () => {
      const data = await getAnalyticsData();
      setAnalytics(data);
    };

    loadAnalytics();

    return () => clearInterval(interval);
  }, []);

  const stats = [
    {
      icon: FileText,
      label: '文章數量',
      value: analytics.totalPosts,
      color: 'text-blue-400'
    },
    {
      icon: BarChart3,
      label: '總字數',
      value: analytics.totalWords.toLocaleString(),
      color: 'text-green-400'
    },
    {
      icon: MousePointer,
      label: '點擊次數',
      value: analytics.totalClicks.toLocaleString(),
      color: 'text-yellow-400'
    },
    {
      icon: Eye,
      label: '觀看次數',
      value: analytics.totalViews.toLocaleString(),
      color: 'text-purple-400'
    }
  ];

  return (
    <footer className="glassmorphism-card mt-16 p-8">
      <div className="container mx-auto">
        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="flex justify-center mb-2">
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-white/70">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Uptime */}
        <div className="glassmorphism-card p-6 mb-8">
          <div className="flex items-center justify-center mb-4">
            <Clock className="w-5 h-5 text-blue-400 mr-2" />
            <h3 className="text-lg font-semibold text-white">網站運行時間</h3>
          </div>
          <div className="text-center space-y-2">
            <div className="text-sm text-white/70">
              自 2025年3月4日 起運行
            </div>
            <div className="grid grid-cols-4 gap-4 text-center">
              <div className="glassmorphism-mini p-3 rounded-lg">
                <div className="text-2xl font-bold text-white">
                  {uptime.days}
                </div>
                <div className="text-xs text-white/70">天</div>
              </div>
              <div className="glassmorphism-mini p-3 rounded-lg">
                <div className="text-2xl font-bold text-white">
                  {uptime.hours}
                </div>
                <div className="text-xs text-white/70">小時</div>
              </div>
              <div className="glassmorphism-mini p-3 rounded-lg">
                <div className="text-2xl font-bold text-white">
                  {uptime.minutes}
                </div>
                <div className="text-xs text-white/70">分鐘</div>
              </div>
              <div className="glassmorphism-mini p-3 rounded-lg">
                <div className="text-2xl font-bold text-white">
                  {uptime.seconds}
                </div>
                <div className="text-xs text-white/70">秒</div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-white/70 text-sm border-t border-white/20 pt-6">
          <p>© 2025 HYJ's Blog. 用 ❤️ 製作</p>
          <p className="mt-2">
            Powered by React 18 & Vite | Inspired by Hexo & Redefine Theme
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;