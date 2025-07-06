import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { calculateUptime } from '../utils/time';

const Footer: React.FC = () => {
  const [uptime, setUptime] = useState(calculateUptime());

  useEffect(() => {
    // Update uptime every second
    const interval = setInterval(() => {
      setUptime(calculateUptime());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="glassmorphism-card mt-16 p-8">
      <div className="container mx-auto">
        {/* Copyright and Uptime */}
        <div className="text-center text-white/70 text-sm">
          <p>© 2025 HYJ's Blog. 用 ❤️ 製作</p>
          <p className="mt-2">
            Powered by React 18 & Vite | Inspired by Hexo & Redefine Theme
          </p>
          
          {/* Uptime - 融合在頁尾中 */}
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
          <div className="text-xs text-white/50 mt-1">
            自 2025年3月1日 起穩定運行
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;