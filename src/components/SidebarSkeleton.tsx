import React from 'react';
import { User, Tag } from 'lucide-react';

const SidebarSkeleton: React.FC = () => {
  return (
    <aside className="space-y-6">
      {/* About Me Skeleton */}
      <div className="glassmorphism-card p-6 animate-pulse">
        <div className="flex items-center mb-4">
          <User className="w-5 h-5 text-blue-400 mr-2" />
          <h3 className="text-xl font-semibold text-white">關於我</h3>
        </div>
        <div className="space-y-3">
          <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 rounded-full mx-auto mb-3 sm:mb-4 bg-white/10"></div>
          <div className="h-6 bg-white/10 rounded w-16 mx-auto mb-2"></div>
          <div className="space-y-2">
            <div className="h-4 bg-white/10 rounded w-full"></div>
            <div className="h-4 bg-white/10 rounded w-3/4 mx-auto"></div>
          </div>
          <div className="flex justify-center">
            <div className="h-4 bg-white/10 rounded w-20"></div>
          </div>
        </div>
      </div>

      {/* Tag Cloud Skeleton */}
      <div className="glassmorphism-card p-4 sm:p-6 animate-pulse">
        <div className="flex items-center mb-4">
          <Tag className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 mr-2" />
          <h3 className="text-lg sm:text-xl font-semibold text-white">標籤雲</h3>
        </div>
        <div className="flex flex-wrap gap-1 sm:gap-2">
          {Array.from({ length: 8 }, (_, index) => (
            <div
              key={index}
              className="h-6 bg-white/10 rounded-full"
              style={{ width: `${Math.random() * 40 + 40}px` }}
            ></div>
          ))}
        </div>
        <div className="mt-3 sm:mt-4 text-center">
          <div className="h-4 bg-white/10 rounded w-24 mx-auto"></div>
        </div>
      </div>
    </aside>
  );
};

export default SidebarSkeleton;