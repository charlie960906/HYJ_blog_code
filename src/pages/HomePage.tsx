import React, { useState, useEffect } from 'react';
import { useSearchParams, useParams } from 'react-router-dom';
import PostCard from '../components/PostCard';
import Sidebar from '../components/Sidebar';
import LoadingSpinner from '../components/LoadingSpinner';
import { Post } from '../types/post';
import { getAllPosts, getPostsByCategory, filterPosts } from '../utils/posts';
import { trackSearch } from '../utils/analytics';

const HomePage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const { category } = useParams();

  const searchQuery = searchParams.get('search');
  const tagFilter = searchParams.get('tag');

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true);
        
        let allPosts: Post[];
        
        if (category) {
          // 如果有分類參數，只載入該分類的文章
          allPosts = await getPostsByCategory(category);
        } else {
          // 否則載入所有文章
          allPosts = await getAllPosts();
        }
        
        setPosts(allPosts);
        
        // 應用過濾器
        const filtered = filterPosts(allPosts, {
          search: searchQuery,
          tag: tagFilter
        });
        
        setFilteredPosts(filtered);

        // 如果有搜尋查詢，追蹤搜尋事件
        if (searchQuery) {
          trackSearch(searchQuery, filtered.length);
        }
        
      } catch (error) {
        console.error('載入文章失敗:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, [searchQuery, tagFilter, category]);

  if (loading) {
    return <LoadingSpinner />;
  }

  const getCategoryTitle = (cat: string) => {
    const categoryTitles: Record<string, string> = {
      'information': '資訊文章',
      'reviews': '產品評價',
      'finance': '股市財經',
      'travel': '旅行',
      'life': '生活'
    };
    return categoryTitles[cat] || cat;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 主要內容 */}
        <div className="lg:col-span-2">
          {/* 分類標題 */}
          {category && (
            <div className="glassmorphism-card p-6 mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">
                {getCategoryTitle(category)}
              </h2>
              <p className="text-white/80">
                共 {filteredPosts.length} 篇文章
              </p>
            </div>
          )}

          {/* 搜尋結果提示 */}
          {searchQuery && (
            <div className="glassmorphism-card p-4 mb-8">
              <p className="text-white/80">
                搜尋 "{searchQuery}" 的結果：{filteredPosts.length} 篇文章
              </p>
            </div>
          )}
          
          {/* 標籤過濾提示 */}
          {tagFilter && (
            <div className="glassmorphism-card p-4 mb-8">
              <p className="text-white/80">
                標籤 "{tagFilter}" 的文章：{filteredPosts.length} 篇
              </p>
            </div>
          )}

          {/* 文章列表 */}
          <div className="space-y-8">
            {filteredPosts.length === 0 ? (
              <div className="glassmorphism-card p-8 text-center">
                <p className="text-white/80 text-lg">沒有找到相關文章</p>
                {(searchQuery || tagFilter || category) && (
                  <p className="text-white/60 text-sm mt-2">
                    嘗試調整搜尋條件或瀏覽所有文章
                  </p>
                )}
              </div>
            ) : (
              filteredPosts.map((post, index) => (
                <PostCard
                  key={post.slug}
                  post={post}
                  isLazy={index > 2} // 前 3 篇文章立即載入，其餘懶載入
                />
              ))
            )}
          </div>
        </div>

        {/* 側邊欄 */}
        <div className="lg:col-span-1">
          <Sidebar />
        </div>
      </div>
    </div>
  );
};

export default HomePage;