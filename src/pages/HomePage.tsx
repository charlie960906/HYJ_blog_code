import React, { useState, useEffect, useRef } from 'react';
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
  const sidebarRef = useRef<HTMLDivElement>(null);
  const mainContentRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  const searchQuery = searchParams.get('search');
  const tagFilter = searchParams.get('tag');

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true);
        let allPosts: Post[];

        if (category) {
          allPosts = await getPostsByCategory(category);
        } else {
          allPosts = await getAllPosts();
        }

        setPosts(allPosts);

        const filtered = filterPosts(allPosts, {
          search: searchQuery,
          tag: tagFilter,
        });

        setFilteredPosts(filtered);

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

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const handleScroll = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (!sidebarRef.current || !mainContentRef.current || !footerRef.current) return;

        const mainContent = mainContentRef.current;
        const footer = footerRef.current;
        const sidebar = sidebarRef.current;

        const mainContentBottom = mainContent.getBoundingClientRect().bottom;
        const footerTop = footer.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        if (mainContentBottom <= windowHeight && footerTop > windowHeight) {
          sidebar.style.position = 'absolute';
          sidebar.style.bottom = '0';
          sidebar.style.top = 'auto';
        } else {
          sidebar.style.position = 'sticky';
          sidebar.style.top = '5rem';
          sidebar.style.bottom = 'auto';
        }
      }, 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeout);
    };
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  const getCategoryTitle = (cat: string) => {
    const categoryTitles: Record<string, string> = {
      information: '資訊文章',
      reviews: '評測',
      finance: '財經',
      travel: '旅行',
      life: '生活',
    };
    return categoryTitles[cat] || cat;
  };

  return (
    <div className="container mx-auto px-4 py-8" style={{ paddingTop: category ? '6rem' : '2rem' }}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content on the left */}
        <div className="order-1 lg:order-none lg:col-span-2 main-content" ref={mainContentRef}>
          {category && (
            <div className="glassmorphism-card p-6 mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">
                {getCategoryTitle(category)}
              </h2>
              <p className="text-white/80">共 {filteredPosts.length} 篇文章</p>
            </div>
          )}
          {searchQuery && (
            <div className="glassmorphism-card p-4 mb-8">
              <p className="text-white/80">
                搜尋 "{searchQuery}" 的結果：{filteredPosts.length} 篇文章
              </p>
            </div>
          )}
          {tagFilter && (
            <div className="glassmorphism-card p-4 mb-8">
              <p className="text-white/80">
                標籤 "{tagFilter}" 的文章：{filteredPosts.length} 篇
              </p>
            </div>
          )}
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
                <PostCard key={post.slug} post={post} isLazy={index > 2} />
              ))
            )}
          </div>
        </div>

        {/* Sidebar on the right */}
        <div className="order-2 lg:order-none lg:col-span-1 sidebar-container">
          <div className="sidebar-content" ref={sidebarRef}>
            <Sidebar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
