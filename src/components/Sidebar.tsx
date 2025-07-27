import React, { useState, useEffect } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { User, Tag as TagIcon } from 'lucide-react';
import { getTagsWithFrequency } from '../utils/tags';
import SidebarSkeleton from './SidebarSkeleton';

interface TagData {
  name: string;
  count: number;
  size: number;
  color: string;
}

interface SidebarProps {
  isLoading?: boolean;
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

const Sidebar: React.FC<SidebarProps> = ({ isLoading = false }) => {
  const [tags, setTags] = useState<TagData[]>([]);
  const [tagsLoading, setTagsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // 新增：判斷頁面是否載入完成
  const pageLoaded = usePageLoaded();
  // 獲取當前路徑和分類參數，用於檢測頁面變化
  const location = useLocation();
  const { category } = useParams();

  useEffect(() => {
    const loadTags = async () => {
      try {
        setTagsLoading(true);
        const tagData = await getTagsWithFrequency();
        const colors = [
          'bg-red-500/20 text-red-100 border-red-400/30',
          'bg-cyan-500/20 text-cyan-100 border-cyan-400/30',
          'bg-blue-500/20 text-blue-100 border-blue-400/30',
          'bg-green-500/20 text-green-100 border-green-400/30',
          'bg-yellow-500/20 text-yellow-100 border-yellow-400/30',
          'bg-purple-500/20 text-purple-100 border-purple-400/30',
          'bg-teal-500/20 text-teal-100 border-teal-400/30',
          'bg-indigo-500/20 text-indigo-100 border-indigo-400/30',
          'bg-pink-500/20 text-pink-100 border-pink-400/30',
          'bg-sky-500/20 text-sky-100 border-sky-400/30',
          'bg-emerald-500/20 text-emerald-100 border-emerald-400/30',
          'bg-orange-500/20 text-orange-100 border-orange-400/30',
          'bg-lime-500/20 text-lime-100 border-lime-400/30',
          'bg-violet-500/20 text-violet-100 border-violet-400/30',
          'bg-rose-500/20 text-rose-100 border-rose-400/30',
          'bg-gray-500/20 text-gray-100 border-gray-400/30',
          'bg-blue-600/20 text-blue-100 border-blue-500/30',
          'bg-green-600/20 text-green-100 border-green-500/30',
          'bg-purple-600/20 text-purple-100 border-purple-500/30',
          'bg-teal-600/20 text-teal-100 border-teal-500/30'
        ];

        const processedTags = tagData
          .filter((tag: any) => tag.name && typeof tag.count === 'number' && typeof tag.size === 'number')
          .map((tag: any, index: number) => ({
            ...tag,
            color: colors[index % colors.length]
          }))
          .sort((a: TagData, b: TagData) => b.count - a.count || a.name.localeCompare(b.name));

        setTags(processedTags);
      } catch (err) {
        setError('載入標籤失敗，請稍後再試');
        console.error('Failed to load tags:', err);
      } finally {
        setTagsLoading(false);
      }
    };

    loadTags();
  }, [location.pathname, category]); // 添加依賴項，當路徑或分類變化時重新加載標籤

  // 如果整體還在載入，顯示骨架屏
  if (isLoading || !pageLoaded || tagsLoading) {
    return <SidebarSkeleton />;
  }

  // 如果加載標籤時出錯
  if (error) {
    return (
      <aside className="space-y-6">
        <div className="glassmorphism-card p-6">
          <div className="flex items-center mb-4">
            <TagIcon className="w-5 h-5 text-red-400 mr-2" />
            <h3 className="text-xl font-semibold text-white">標籤載入失敗</h3>
          </div>
          <p className="text-white/80 text-sm">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 text-blue-400 hover:text-blue-300 text-sm flex items-center"
          >
            重新整理頁面
          </button>
        </div>
      </aside>
    );
  }

  return (
    <aside className="space-y-6 mt-0 lg:mt-0">
      {/* About Me */}
      <div className="glassmorphism-card p-6">
        <div className="flex items-center mb-4">
          <User className="w-5 h-5 text-blue-400 mr-2" />
          <h3 className="text-xl font-semibold text-white">關於我</h3>
        </div>
        <div className="space-y-3">
          <picture>
            <source srcSet="/images/my.webp" type="image/webp" />
            <img src="/images/my.jpg" alt="HYJ's Image" loading="lazy" className="w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 rounded-full mx-auto mb-3 sm:mb-4 object-cover sidebar-about-image" />
          </picture>
          <p className="text-white text-base sm:text-lg font-bold text-center mb-2">老黃</p>
          <p className="text-white/80 text-xs sm:text-sm text-center leading-relaxed">
            目前主要興趣在於演算法、人工智慧、財經投資等～
          </p>
          <div className="flex justify-center">
            <Link
              to="/about"
              className="text-blue-400 hover:text-blue-300 text-xs sm:text-sm font-medium transition-colors"
            >
              了解更多 →
            </Link>
          </div>
        </div>
      </div>

      {/* Tag Cloud */}
      <div className="glassmorphism-card p-4 sm:p-6">
        <div className="flex items-center mb-4">
          <TagIcon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 mr-2" />
          <h3 className="text-lg sm:text-xl font-semibold text-white">標籤雲</h3>
        </div>
        <div className="flex flex-wrap gap-1 sm:gap-2">
          {tagsLoading ? (
            <p className="text-gray-400 text-xs sm:text-sm">載入中...</p>
          ) : error ? (
            <p className="text-red-400 text-xs sm:text-sm">{error}</p>
          ) : tags.length > 0 ? (
            tags
              .slice(0, 12)
              .map((tag) => (
                <Link
                  key={tag.name}
                  to={`/?tag=${encodeURIComponent(tag.name)}`}
                  className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium border transition-all duration-200 hover:scale-105 ${tag.color || 'bg-gray-500/20 text-gray-100 border-gray-400/30'}`}
                >
                  {tag.name} ({tag.count})
                </Link>
              ))
          ) : (
            <p className="text-gray-400 text-xs sm:text-sm">暫無標籤</p>
          )}
        </div>
        <div className="mt-3 sm:mt-4 text-center">
          <Link
            to="/tags"
            className="text-blue-400 hover:text-blue-300 text-xs sm:text-sm font-medium transition-colors"
          >
            查看所有標籤 →
          </Link>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;