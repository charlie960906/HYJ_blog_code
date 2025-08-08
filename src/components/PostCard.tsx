import React, { Suspense, lazy, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Tag, ArrowRight } from 'lucide-react';
import { Post } from '../types/post';

// 添加 Google Analytics 的類型定義
declare global {
  interface Window {
    gtag?: (command: string, action: string, params: object) => void;
  }
}

// 懶加載 RelatedPosts 組件
const RelatedPosts = lazy(() => import('./RelatedPosts'));

interface PostCardProps {
  post: Post;
  isLazy?: boolean;
}

const PostCard: React.FC<PostCardProps> = ({ post, isLazy = false }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isIntersecting, setIsIntersecting] = useState(false);

  // 使用 IntersectionObserver 檢測元素是否在可視區域內
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsIntersecting(true);
          // 當元素進入視窗後，稍微延遲顯示以避免一次性渲染過多內容
          setTimeout(() => setIsVisible(true), isLazy ? 200 : 0);
          observer.disconnect();
        }
      },
      { 
        rootMargin: '100px 0px', 
        threshold: 0.1 
      }
    );

    const currentElement = document.getElementById(`post-card-${post.slug}`);
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      observer.disconnect();
    };
  }, [post.slug, isLazy]);

  const handleReadMore = () => {
    // GA4 event tracking
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'click', {
        event_category: 'engagement',
        event_label: 'read_more',
        value: post.slug
      });
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const estimateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  // 渲染骨架屏
  if (!isIntersecting) {
    return (
      <div 
        id={`post-card-${post.slug}`}
        className="post-card-container glassmorphism-card p-4 sm:p-6 animate-pulse"
      >
        <div className="space-y-3 sm:space-y-4">
          {/* 標籤骨架屏 */}
          <div className="flex flex-wrap gap-1 sm:gap-2">
            {[...Array(3)].map((_, i) => (
              <div 
                key={i} 
                className="h-6 w-16 bg-white/10 rounded-full"
              />
            ))}
          </div>
          
          {/* 標題骨架屏 */}
          <div className="h-7 sm:h-8 bg-white/10 rounded-md w-3/4" />
          
          {/* 元信息骨架屏 */}
          <div className="flex gap-4">
            <div className="h-5 bg-white/10 rounded w-24" />
            <div className="h-5 bg-white/10 rounded w-20" />
          </div>
          
          {/* 摘要骨架屏 */}
          <div className="space-y-2">
            <div className="h-4 bg-white/10 rounded w-full" />
            <div className="h-4 bg-white/10 rounded w-5/6" />
            <div className="h-4 bg-white/10 rounded w-4/6" />
          </div>
          
          {/* 按鈕骨架屏 */}
          <div className="pt-3 sm:pt-4">
            <div className="h-9 bg-white/10 rounded-full w-28" />
          </div>
        </div>
      </div>
    );
  }

  // 渲染實際內容
  return (
    <article 
      id={`post-card-${post.slug}`}
      className={`post-card-container glassmorphism-card p-4 sm:p-6 lg:p-8 hover:scale-[1.02] transition-all duration-300 group cursor-pointer ${
        isVisible ? 'animate-fadeIn' : 'opacity-0'
      }`}
    >
      <div className="space-y-4 sm:space-y-5 lg:space-y-6">
        {/* Tags */}
        <div className="post-card-tags flex flex-wrap gap-2 sm:gap-3">
          {post.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="post-card-tag inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium bg-blue-500/20 text-blue-100 border border-blue-400/30 backdrop-blur-sm hover:bg-blue-500/30 transition-all duration-200"
            >
              <Tag className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5" />
              {tag}
            </span>
          ))}
          {post.tags.length > 4 && (
            <span className="post-card-tag inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium bg-gray-500/20 text-gray-100 border border-gray-400/30 backdrop-blur-sm">
              +{post.tags.length - 4}
            </span>
          )}
        </div>

        {/* Title */}
        <h2 className="post-card-title text-xl sm:text-2xl lg:text-3xl font-bold text-white group-hover:text-blue-300 transition-colors duration-200 leading-tight">
          <Link to={`/post/${post.slug}`} className="block">
            {post.title}
          </Link>
        </h2>

        {/* Meta Info */}
        <div className="post-card-meta flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-sm sm:text-base text-white/70 text-left">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-400" />
            <span className="text-sm sm:text-base">{formatDate(post.date)}</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-green-400" />
            <span className="text-sm sm:text-base">{estimateReadTime(post.content)} 分鐘閱讀</span>
          </div>
        </div>

        {/* Summary */}
        <p className="text-white/80 line-clamp-3 leading-relaxed text-sm sm:text-base lg:text-lg">
          {post.summary}
        </p>

        {/* Read More Button */}
        <div className="flex justify-between items-center pt-4 sm:pt-5 lg:pt-6">
          <Link
            to={`/post/${post.slug}`}
            onClick={handleReadMore}
            className="inline-flex items-center px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full hover:from-blue-600 hover:to-purple-600 transition-all duration-200 group/btn text-sm sm:text-base font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            閱讀更多
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover/btn:translate-x-1 transition-transform duration-200" />
          </Link>
        </div>

        {/* Related Posts - 只有當元素可見時才加載 */}
        {isLazy && isVisible && (
          <Suspense fallback={
            <div className="animate-pulse bg-white/10 h-24 sm:h-28 lg:h-32 rounded-xl mt-4 sm:mt-5 lg:mt-6"></div>
          }>
            <RelatedPosts currentPost={post} />
          </Suspense>
        )}
      </div>
    </article>
  );
};

export default React.memo(PostCard);