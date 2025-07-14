import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Tag, Share2, X } from 'lucide-react';
import { Post } from '../types/post';
import { getPostBySlug } from '../utils/posts';
import { trackPageView, trackPostRead } from '../utils/analytics';
import LoadingSpinner from './LoadingSpinner';

const PostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

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

        // 更新文檔標題
        document.title = `${loadedPost.title} - HYJ's Blog`;

        // 添加結構化數據
        const structuredData = {
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "headline": loadedPost.title,
          "datePublished": loadedPost.date,
          "author": {
            "@type": "Person",
            "name": "HYJ"
          },
          "publisher": {
            "@type": "Organization",
            "name": "HYJ's Blog"
          },
          "description": loadedPost.summary,
          "keywords": loadedPost.tags.join(', ')
        };

        // 移除舊的結構化數據
        const existingScript = document.querySelector('script[type="application/ld+json"]');
        if (existingScript) {
          document.head.removeChild(existingScript);
        }

        // 添加新的結構化數據
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(structuredData);
        document.head.appendChild(script);

      } catch (err) {
        setError(err instanceof Error ? err.message : '載入文章時發生錯誤');
      } finally {
        setLoading(false);
      }
    };

    loadPost();

    // 清理函數
    return () => {
      document.title = "HYJ's Blog";
      const script = document.querySelector('script[type="application/ld+json"]');
      if (script) {
        document.head.removeChild(script);
      }
    };
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
      } catch (err) {
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

  if (loading) return <LoadingSpinner />;
  
  if (error) return (
    <div className="min-h-screen flex items-center justify-center pt-20 px-4">
      <div className="glassmorphism-card p-6 sm:p-8 text-center max-w-md mx-auto">
        <h1 className="text-xl sm:text-2xl font-bold text-white mb-4">文章未找到</h1>
        <p className="text-white/80 mb-6 text-sm sm:text-base">{error}</p>
        <Link
          to="/"
          className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors text-sm sm:text-base"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          返回首頁
        </Link>
      </div>
    </div>
  );

  if (!post) return null;

  return (
    <div className="min-h-screen pt-20 sm:pt-24 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* 返回按鈕 */}
        <Link
          to="/"
          className="inline-flex items-center text-white/80 hover:text-white transition-colors mb-8 sm:mb-10 text-sm sm:text-base"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          返回首頁
        </Link>

        {/* 文章標題區 */}
        <header className="glassmorphism-card p-6 sm:p-8 mb-6 sm:mb-8">
          <div className="flex flex-wrap gap-1 sm:gap-2 mb-4">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-100 border border-blue-400/30"
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
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0 text-sm text-white/70">
              <div className="flex items-center">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                <span className="text-xs sm:text-sm">{formatDate(post.date)}</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                <span className="text-xs sm:text-sm">{estimateReadTime(post.content)} 分鐘閱讀</span>
              </div>
            </div>

            <button
              onClick={handleShare}
              className="flex items-center px-3 py-2 text-white/80 hover:text-white transition-colors text-sm sm:text-base self-start sm:self-auto"
            >
              <Share2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              分享
            </button>
          </div>
        </header>

        {/* 文章內容 */}
        <article className="glassmorphism-card p-6 sm:p-8 mb-6 sm:mb-8">
          <div
            className="prose prose-invert prose-sm sm:prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>

        {/* 圖片燈箱 */}
        {lightboxImage && (
          <div className="image-lightbox" onClick={closeLightbox}>
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
    </div>
  );
};

export default PostPage;