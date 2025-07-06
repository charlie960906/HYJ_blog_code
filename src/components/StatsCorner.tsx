import React, { useState, useEffect } from 'react';
import { BarChart3, FileText } from 'lucide-react';
import { getAnalyticsData } from '../utils/analytics';

const StatsCorner: React.FC = () => {
  const [analytics, setAnalytics] = useState({
    totalPosts: 0,
    totalWords: 0
  });

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
    <div className="fixed bottom-4 right-4 z-40 glassmorphism-mini p-3 rounded-lg">
      <div className="flex flex-col space-y-2 text-xs">
        <div className="flex items-center">
          <FileText className="w-3 h-3 text-blue-400 mr-1" />
          <span className="text-white/70 mr-1">文章:</span>
          <span className="text-white font-medium">{analytics.totalPosts}</span>
        </div>
        <div className="flex items-center">
          <BarChart3 className="w-3 h-3 text-green-400 mr-1" />
          <span className="text-white/70 mr-1">字數:</span>
          <span className="text-white font-medium">{analytics.totalWords.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default StatsCorner;