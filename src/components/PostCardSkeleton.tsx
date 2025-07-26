import React from 'react';

const PostCardSkeleton: React.FC = () => {
  return (
    <article className="glassmorphism-card p-4 sm:p-6 flex items-center justify-center">
      <div className="flex flex-col items-center justify-center py-10">
        <div className="spinner mb-4"></div>
        <p className="text-white/70 text-base">載入中...</p>
      </div>
    </article>
  );
};

export default PostCardSkeleton;