import React from 'react';

const PostCardSkeleton: React.FC = () => {
  return (
    <article className="glassmorphism-card p-4 sm:p-6 animate-pulse">
      <div className="space-y-3 sm:space-y-4">
        {/* Tags skeleton */}
        <div className="flex flex-wrap gap-1 sm:gap-2">
          <div className="h-6 bg-white/10 rounded-full w-16"></div>
          <div className="h-6 bg-white/10 rounded-full w-20"></div>
          <div className="h-6 bg-white/10 rounded-full w-14"></div>
        </div>

        {/* Title skeleton */}
        <div className="space-y-2">
          <div className="h-6 sm:h-8 bg-white/20 rounded w-3/4"></div>
          <div className="h-6 sm:h-8 bg-white/20 rounded w-1/2"></div>
        </div>

        {/* Meta info skeleton */}
        <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
          <div className="flex items-center">
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-white/10 rounded mr-1"></div>
            <div className="h-4 bg-white/10 rounded w-20"></div>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-white/10 rounded mr-1"></div>
            <div className="h-4 bg-white/10 rounded w-16"></div>
          </div>
        </div>

        {/* Summary skeleton */}
        <div className="space-y-2">
          <div className="h-4 bg-white/10 rounded w-full"></div>
          <div className="h-4 bg-white/10 rounded w-5/6"></div>
          <div className="h-4 bg-white/10 rounded w-4/6"></div>
        </div>

        {/* Button skeleton */}
        <div className="flex justify-between items-center pt-3 sm:pt-4">
          <div className="h-10 bg-white/10 rounded-full w-24"></div>
        </div>
      </div>
    </article>
  );
};

export default PostCardSkeleton;