import React, { useState, useEffect } from 'react';

const ScrollProgress: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setScrollProgress(Math.min(progress, 100));
    };

    window.addEventListener('scroll', updateScrollProgress);
    updateScrollProgress(); // 初始計算

    return () => window.removeEventListener('scroll', updateScrollProgress);
  }, []);

  return (
    <>
      {/* 頂部進度條 */}
      <div className="fixed top-0 left-0 right-0 z-[60] h-1">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-300 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>
      
      {/* 側邊圓形進度指示器 */}
      <div className="fixed right-6 bottom-6 z-50">
        <div className="relative w-12 h-12">
          {/* 背景圓圈 */}
          <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
            <path
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="rgba(255, 255, 255, 0.2)"
              strokeWidth="2"
            />
            {/* 進度圓圈 */}
            <path
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="url(#progressGradient)"
              strokeWidth="2"
              strokeDasharray={`${scrollProgress}, 100`}
              className="transition-all duration-300 ease-out"
            />
            {/* 漸變定義 */}
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="50%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#EC4899" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* 中心百分比文字 */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-semibold text-white">
              {Math.round(scrollProgress)}%
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default ScrollProgress;