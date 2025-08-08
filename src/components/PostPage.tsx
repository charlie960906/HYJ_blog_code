import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Tag, Share2, X } from 'lucide-react';
import { Post } from '../types/post';
import { getPostBySlug } from '../utils/posts';
import { trackPageView, trackPostRead } from '../utils/analytics';
import { useSEOOptimization } from '../hooks/useOptimization';

const PostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // SEO 優化
  useSEOOptimization(post ? {
    title: `${post.title} - HYJ's Blog`,
    description: post.summary,
    keywords: post.tags,
    type: 'article',
    publishedTime: post.date,
    author: 'HYJ'
  } : undefined);
  useEffect(() => {
    const loadPost = async () => {
      if (!slug) {
        setError('文章 ID 不存在');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const loadedPost = await getPostBySlug(slug);
        
        if (!loadedPost) {
          setError('文章未找到');
          return;
        }
        
        setPost(loadedPost);

        // GA4 頁面觀看事件
        trackPageView(loadedPost.title, window.location.href);
        trackPostRead(slug, loadedPost.title);


      } catch (err) {
        setError(err instanceof Error ? err.message : '載入文章時發生錯誤');
      } finally {
        setLoading(false);
      }
    };

    loadPost();

  }, [slug]);

  // 圖片燈箱功能
  useEffect(() => {
    const handleImageClick = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'IMG' && target.closest('.prose .image-container')) {
        e.preventDefault();
        const img = target as HTMLImageElement;
        setLightboxImage(img.src);
      }
    };

    const handleImageLoad = (e: Event) => {
      const target = e.target as HTMLImageElement;
      if (target.hasAttribute('loading') && target.getAttribute('loading') === 'lazy') {
        target.classList.add('loaded');
      }
    };

    // 添加事件監聽器
    document.addEventListener('click', handleImageClick);
    document.addEventListener('load', handleImageLoad, true);

    return () => {
      document.removeEventListener('click', handleImageClick);
      document.removeEventListener('load', handleImageLoad, true);
    };
  }, [post]);

  // 關閉燈箱
  const closeLightbox = () => {
    setLightboxImage(null);
  };

  // ESC 鍵關閉燈箱
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && lightboxImage) {
        closeLightbox();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [lightboxImage]);
  const handleShare = async () => {
    if (!post) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.summary,
          url: window.location.href
        });
      } catch {
        // 用戶取消分享或發生錯誤，回退到複製連結
        await navigator.clipboard.writeText(window.location.href);
        alert('連結已複製到剪貼板');
      }
    } else {
      // 瀏覽器不支援 Web Share API，回退到複製連結
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('連結已複製到剪貼板');
      } catch (err) {
        console.error('無法複製連結:', err);
      }
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
    const textContent = content.replace(/<[^>]*>/g, '');
    const words = textContent.split(/\s+/).filter(word => word.length > 0).length;
    return Math.ceil(words / wordsPerMinute);
  };

  // 如果正在加載，顯示加載圖標
  if (loading) {
    return (
      <div className="min-h-screen pt-20">
        <div className="container mx-auto px-4">
          <div className="glassmorphism-card p-6 sm:p-8 flex flex-col items-center justify-center">
            <div className="spinner mb-4"></div>
            <p className="text-white/80 text-lg">文章載入中...</p>
          </div>
        </div>
      </div>
    );
  }

  // 如果有錯誤，顯示錯誤信息
  if (error) {
    return (
      <div className="min-h-screen pt-20">
        <div className="container mx-auto px-4">
          <div className="glassmorphism-card p-6 sm:p-8 text-center">
            <p className="text-red-400 text-lg mb-4">😢 {error}</p>
            <Link to="/" className="inline-flex items-center text-blue-400 hover:text-blue-300">
              <ArrowLeft size={16} className="mr-1" />
              返回首頁
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!post) return null;

  return (
    <article className="min-h-screen pt-20 sm:pt-24 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* 返回按鈕 */}
        <Link
          to="/"
          className="inline-flex items-center text-white/80 hover:text-white transition-colors mb-8 sm:mb-10 text-sm sm:text-base"
          aria-label="返回首頁"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          返回首頁
        </Link>

        {/* 文章標題區 */}
        <header className="glassmorphism-card p-6 sm:p-8 mb-6 sm:mb-8 z-10 relative">
          <div className="flex flex-wrap gap-1 sm:gap-2 mb-4">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-100 border border-blue-400/30"
                role="button"
                tabIndex={0}
              >
                <Tag className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1" />
                {tag}
              </span>
            ))}
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-col items-start sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0 text-sm text-white/70 text-left">
              <div className="flex items-center">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                <time className="text-xs sm:text-sm" dateTime={post.date}>
                  {formatDate(post.date)}
                </time>
              </div>
              <div className="flex items-center">
                <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                <span className="text-xs sm:text-sm">{estimateReadTime(post.content)} 分鐘閱讀</span>
              </div>
            </div>

            <button
              onClick={handleShare}
              className="flex items-center px-3 py-2 text-white/80 hover:text-white transition-colors text-sm sm:text-base self-start sm:self-auto"
              aria-label="分享文章"
            >
              <Share2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              分享
            </button>
          </div>
        </header>

        {/* 文章內容 */}
        <section className="glassmorphism-card p-6 sm:p-8 mb-6 sm:mb-8 z-10 relative">
          <div
            className="prose prose-invert prose-sm sm:prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </section>

        {/* 圖片燈箱 */}
        {lightboxImage && (
          <div 
            className="image-lightbox" 
            onClick={closeLightbox}
            role="dialog"
            aria-modal="true"
            aria-label="圖片放大檢視"
          >
            <button
              className="image-lightbox-close"
              onClick={closeLightbox}
              aria-label="關閉圖片"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={lightboxImage}
              alt="放大檢視"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}
      </div>
    </article>
  );
};

export default PostPage;