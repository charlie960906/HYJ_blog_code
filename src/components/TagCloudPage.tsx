import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Tag } from 'lucide-react';
import { getTagsWithFrequency } from '../utils/tags';

interface TagData {
  name: string;
  count: number;
  size: number;
  color: string;
}

// 新增 usePageLoaded hook
function usePageLoaded() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      setLoaded(true);
    } else {
      const onReady = () => setLoaded(true);
      window.addEventListener('DOMContentLoaded', onReady);
      return () => window.removeEventListener('DOMContentLoaded', onReady);
    }
  }, []);
  return loaded;
}

const TagCloudPage: React.FC = () => {
  const [tags, setTags] = useState<TagData[]>([]);
  const [loading, setLoading] = useState(true);
  // 新增：判斷頁面是否載入完成
  const pageLoaded = usePageLoaded();

  useEffect(() => {
    const loadTags = async () => {
      try {
        const tagData = await getTagsWithFrequency();
        
        // 預定義顏色組合
        const colors = [
          '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
          '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
          '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2',
          '#A3E4D7', '#F9E79F', '#D5A6BD', '#AED6F1', '#A9DFBF'
        ];

        const processedTags = tagData.map((tag, index) => ({
          ...tag,
          color: colors[index % colors.length]
        }));
        
        setTags(processedTags);
      } catch (error) {
        console.error('Failed to load tags:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTags();
  }, []);

  if (loading || !pageLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="glassmorphism-card p-8 text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-white/80">載入標籤中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 sm:pt-24 lg:pt-28 px-4 static-page-container">
      <div className="container mx-auto max-w-6xl">
        <Link
          to="/"
          className="inline-flex items-center text-white/80 hover:text-white transition-colors mb-8 sm:mb-10 text-sm sm:text-base"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          返回首頁
        </Link>

        <div className="glassmorphism-card p-4 sm:p-6 lg:p-8 static-page-content">
          <div className="flex items-center mb-8">
            <Tag className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400 mr-2 sm:mr-3" />
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">標籤雲</h1>
          </div>

          {/* 標籤雲容器 - 使用 flexbox 自然排列 */}
          <div className="relative w-full min-h-80 sm:min-h-96 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-indigo-900/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-white/10 tag-cloud-container">
            {/* 背景裝飾 */}
            <div className="absolute inset-0 opacity-10 rounded-xl sm:rounded-2xl">
              <div className="w-full h-full" style={{
                backgroundImage: `
                  radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.3) 0%, transparent 50%),
                  radial-gradient(circle at 75% 75%, rgba(139, 92, 246, 0.3) 0%, transparent 50%)
                `
              }}></div>
            </div>
            
            {/* 標籤容器 - 使用 flex wrap 自然排列 */}
            <div className="relative z-10 flex flex-wrap items-center justify-center gap-2 sm:gap-3 lg:gap-4 min-h-60 sm:min-h-80">
              {tags.map((tag, index) => (
                <Link
                  key={tag.name}
                  to={`/?tag=${encodeURIComponent(tag.name)}`}
                  className="transition-all duration-300 hover:scale-110 cursor-pointer select-none inline-block tag-cloud-item"
                  style={{
                    fontSize: `${Math.min(Math.max(tag.size * 0.8, 0.875), 1.8)}rem`,
                    color: tag.color,
                    fontWeight: tag.count > 2 ? '600' : '500',
                    textShadow: '0 2px 8px rgba(0,0,0,0.5)',
                    lineHeight: '1.3',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '0.75rem',
                    background: `${tag.color}15`,
                    backdropFilter: 'blur(5px)',
                    border: `1px solid ${tag.color}30`,
                    margin: '0.125rem',
                    whiteSpace: 'nowrap'
                  }}
                  title={`${tag.name} (${tag.count} 篇文章)`}
                >
                  {tag.name}
                </Link>
              ))}
            </div>
          </div>

          {/* 標籤統計 */}
          <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-white/20">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-center">
              <div className="glassmorphism-mini p-3 sm:p-4 rounded-lg">
                <div className="text-xl sm:text-2xl font-bold text-white">
                  {tags.length}
                </div>
                <div className="text-xs sm:text-sm text-white/70">總標籤數</div>
              </div>
              <div className="glassmorphism-mini p-3 sm:p-4 rounded-lg">
                <div className="text-xl sm:text-2xl font-bold text-white">
                  {tags.reduce((sum, tag) => sum + tag.count, 0)}
                </div>
                <div className="text-xs sm:text-sm text-white/70">標籤使用次數</div>
              </div>
              <div className="glassmorphism-mini p-3 sm:p-4 rounded-lg">
                <div className="text-xl sm:text-2xl font-bold text-white">
                  {Math.max(...tags.map(t => t.count))}
                </div>
                <div className="text-xs sm:text-sm text-white/70">最高使用次數</div>
              </div>
              <div className="glassmorphism-mini p-3 sm:p-4 rounded-lg">
                <div className="text-xl sm:text-2xl font-bold text-white">
                  {tags.filter(t => t.count > 1).length}
                </div>
                <div className="text-xs sm:text-sm text-white/70">熱門標籤</div>
              </div>
            </div>
          </div>

          {/* 標籤列表 */}
          <div className="mt-6 sm:mt-8">
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">所有標籤</h3>
            <div className="flex flex-wrap gap-1 sm:gap-2">
              {tags
                .sort((a, b) => b.count - a.count)
                .map((tag) => (
                  <Link
                    key={`list-${tag.name}`}
                    to={`/?tag=${encodeURIComponent(tag.name)}`}
                    className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 hover:scale-105"
                    style={{
                      backgroundColor: `${tag.color}20`,
                      color: tag.color,
                      border: `1px solid ${tag.color}40`
                    }}
                  >
                    {tag.name} ({tag.count})
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TagCloudPage;