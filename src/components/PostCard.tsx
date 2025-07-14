import React, { Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Tag, ArrowRight } from 'lucide-react';
import { Post } from '../types/post';

const RelatedPosts = lazy(() => import('./RelatedPosts'));

interface PostCardProps {
  post: Post;
  isLazy?: boolean;
}

const PostCard: React.FC<PostCardProps> = ({ post, isLazy = false }) => {
  const handleReadMore = () => {
    // GA4 event tracking
    if (typeof gtag !== 'undefined') {
      gtag('event', 'click', {
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
    const words = content.split(' ').length;
    return Math.ceil(words / wordsPerMinute);
  };

  return (
    <article className="post-card-container glassmorphism-card p-4 sm:p-6 hover:scale-105 transition-all duration-300 group">
      <div className="space-y-3 sm:space-y-4">
        {/* Tags */}
        <div className="post-card-tags flex flex-wrap gap-1 sm:gap-2">
          {post.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="post-card-tag inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-100 border border-blue-400/30"
            >
              <Tag className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1" />
              {tag}
            </span>
          ))}
          {post.tags.length > 4 && (
            <span className="post-card-tag inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium bg-gray-500/20 text-gray-100 border border-gray-400/30">
              +{post.tags.length - 4}
            </span>
          )}
        </div>

        {/* Title */}
        <h2 className="post-card-title text-xl sm:text-2xl font-bold text-white group-hover:text-blue-300 transition-colors duration-200 leading-tight">
          <Link to={`/post/${post.slug}`}>
            {post.title}
          </Link>
        </h2>

        {/* Meta Info */}
        <div className="post-card-meta flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0 text-sm text-white/70">
          <div className="flex items-center">
            <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
            <span className="text-xs sm:text-sm">{formatDate(post.date)}</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
            <span className="text-xs sm:text-sm">{estimateReadTime(post.content)} 分鐘閱讀</span>
          </div>
        </div>

        {/* Summary */}
        <p className="text-white/80 line-clamp-3 leading-relaxed text-sm sm:text-base">
          {post.summary}
        </p>

        {/* Read More Button */}
        <div className="flex justify-between items-center pt-3 sm:pt-4">
          <Link
            to={`/post/${post.slug}`}
            onClick={handleReadMore}
            className="inline-flex items-center px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full hover:from-blue-600 hover:to-purple-600 transition-all duration-200 group/btn text-sm sm:text-base"
          >
            閱讀更多
            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Related Posts */}
        {isLazy && (
          <Suspense fallback={<div className="animate-pulse bg-white/10 h-20 sm:h-24 rounded-lg"></div>}>
            <RelatedPosts currentPost={post} />
          </Suspense>
        )}
      </div>
    </article>
  );
};

export default PostCard;