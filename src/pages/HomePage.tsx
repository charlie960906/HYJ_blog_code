import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { useSearchParams, useParams } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import { Post } from '../types/post';
import { getAllPosts, getPostsByCategory, filterPosts } from '../utils/posts';
import { trackSearch } from '../utils/analytics';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Sidebar from '../components/Sidebar';
import PostCard from '../components/PostCard';
import PostCardSkeleton from '../components/PostCardSkeleton';

const POSTS_PER_PAGE = 6;
const INITIAL_LOAD_COUNT = 6; // 首次載入文章數量

// 移除 lazy 載入 Sidebar、PostCard、PostCardSkeleton，直接同步載入

const HomePage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(true);
  const [loadedPostsCount, setLoadedPostsCount] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const { category } = useParams();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const mainContentRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  const searchQuery = searchParams.get('search');
  const tagFilter = searchParams.get('tag');
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  // 首頁基本結構先載入
  useEffect(() => {
    // 模擬首頁基本結構載入完成
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // 漸進式載入文章
  useEffect(() => {
    const loadPosts = async () => {
      try {
        // 重置狀態，確保切換分類時顯示加載效果
        setPostsLoading(true);
        setLoadedPostsCount(0);
        setPosts([]);
        setFilteredPosts([]);
        
        let allPosts: Post[];

        if (category) {
          allPosts = await getPostsByCategory(category);
        } else {
          allPosts = await getAllPosts();
        }
        
        // 先載入部分文章
        const initialPosts = allPosts.slice(0, INITIAL_LOAD_COUNT);
        setPosts(initialPosts);
        setLoadedPostsCount(INITIAL_LOAD_COUNT);

        // 逐步載入剩餘文章
        const remainingPosts = allPosts.slice(INITIAL_LOAD_COUNT);
        for (let i = 0; i < remainingPosts.length; i += 2) {
          await new Promise(resolve => setTimeout(resolve, 200)); // 200ms 間隔
          const batch = remainingPosts.slice(i, i + 2);
          setPosts(prev => [...prev, ...batch]);
          setLoadedPostsCount(prev => prev + batch.length);
        }

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
        // 延遲結束加載狀態，確保有足夠時間顯示加載效果
        setTimeout(() => {
          setPostsLoading(false);
        }, 500);
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

  // 分頁邏輯
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const currentPosts = filteredPosts.slice(startIndex, endIndex);

  useEffect(() => {
    // 當頁面變更時，滾動到主內容區域
    if (mainContentRef.current) {
      const offsetTop = mainContentRef.current.getBoundingClientRect().top + window.pageYOffset;
      const NAVBAR_HEIGHT = 96;
      window.scrollTo({
        top: offsetTop - NAVBAR_HEIGHT,
        behavior: 'smooth',
      });
    }
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', page.toString());
    setSearchParams(newParams);
  };

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

  const getPaginationRange = (current: number, total: number): (number | string)[] => {
    const delta = 1;
    const range: (number | string)[] = [];
    const left = Math.max(2, current - delta);
    const right = Math.min(total - 1, current + delta);

    range.push(1);
    if (left > 2) range.push('...');

    for (let i = left; i <= right; i++) {
      range.push(i);
    }

    if (right < total - 1) range.push('...');
    if (total > 1) range.push(total);

    return range;
  };

  // 如果首頁基本結構還在載入，顯示載入畫面
  if (initialLoading) {
    return <LoadingSpinner />;
  }
  
  // 計算需要顯示的文章和骨架屏
  const totalExpectedPosts = filteredPosts.length || posts.length;
  const skeletonCount = Math.max(0, Math.min(POSTS_PER_PAGE - currentPosts.length, totalExpectedPosts - loadedPostsCount));

  // 如果是分類頁面且正在加載，顯示分類頁面專用的加載畫面
  if (category && postsLoading && posts.length === 0) {
    return (
      <div className="container mx-auto px-4 py-6 sm:py-8" style={{ paddingTop: '5rem' }}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 homepage-grid">
          <div className="order-1 lg:order-none lg:col-span-2 main-content">
            <div className="glassmorphism-card p-4 sm:p-6 mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                {getCategoryTitle(category)}
              </h2>
              <p className="text-sm sm:text-base text-white/80">載入中...</p>
            </div>
            <div className="glassmorphism-card p-8 sm:p-12 flex flex-col items-center justify-center">
              <div className="spinner mb-4"></div>
              <p className="text-white/80 text-lg">分類文章載入中...</p>
            </div>
          </div>
          <div className="sidebar-container" ref={sidebarRef}>
            <div className="sidebar-content">
              <Sidebar isLoading={postsLoading} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8" style={{ paddingTop: category ? '5rem' : '1.5rem' }}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 homepage-grid">
        {/* Main content */}
        <div className="lg:col-span-2 main-content scroll-mt-24" ref={mainContentRef}>
          {category && (
            <div className="glassmorphism-card p-4 sm:p-6 mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                {getCategoryTitle(category)}
              </h2>
              {postsLoading ? (
                <div className="flex items-center">
                  <div className="spinner-sm mr-2"></div>
                  <p className="text-sm sm:text-base text-white/80">文章數量載入中...</p>
                </div>
              ) : (
                <p className="text-sm sm:text-base text-white/80">共 {filteredPosts.length} 篇文章</p>
              )}
            </div>
          )}
          {searchQuery && (
            <div className="glassmorphism-card p-3 sm:p-4 mb-6 sm:mb-8">
              <p className="text-sm sm:text-base text-white/80">
                搜尋 "{searchQuery}" 的結果：{filteredPosts.length} 篇文章
              </p>
            </div>
          )}
          {tagFilter && (
            <div className="glassmorphism-card p-3 sm:p-4 mb-6 sm:mb-8">
              <p className="text-sm sm:text-base text-white/80">
                標籤 "{tagFilter}" 的文章：{filteredPosts.length} 篇
              </p>
            </div>
          )}
          <div className="space-y-6 sm:space-y-8">
            {currentPosts.length === 0 ? (
              !postsLoading ? (
                <div className="glassmorphism-card p-6 sm:p-8 text-center">
                <p className="text-white/80 text-base sm:text-lg">沒有找到相關文章</p>
                {(searchQuery || category) && (
                  <p className="text-white/60 text-xs sm:text-sm mt-2">
                    嘗試調整搜尋條件或瀏覽所有文章
                  </p>
                )}
                </div>
              ) : (
                <div className="glassmorphism-card p-8 sm:p-12 flex flex-col items-center justify-center">
                  <div className="spinner mb-4"></div>
                  <p className="text-white/80 text-lg">文章載入中...</p>
                </div>
              )
            ) : (
              <>
                {/* 如果是分類頁面且正在加載，顯示加載狀態 */}
                {category && postsLoading ? (
                  <div className="glassmorphism-card p-8 sm:p-12 flex flex-col items-center justify-center">
                    <div className="spinner mb-4"></div>
                    <p className="text-white/80 text-lg">分類文章載入中...</p>
                  </div>
                ) : (
                  <>
                    {currentPosts.map((post, index) => (
                      <PostCard key={post.slug} post={post} isLazy={index > 2} />
                    ))}
                    {/* 如果還有文章正在加載，顯示一個統一的加載圖標 */}
                    {postsLoading && skeletonCount > 0 && (
                      <PostCardSkeleton />
                    )}
                  </>
                )}
              </>
            )}
          </div>

          {/* 分頁控制 */}
          {totalPages > 1 && (
            <div className="pagination-container mt-6 sm:mt-8">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`pagination-button p-2 sm:p-3 rounded-full transition-colors ${
                  currentPage === 1
                    ? 'bg-gray-600 text-white/50 cursor-not-allowed opacity-50'
                    : 'inactive'
                }`}
                aria-label="上一頁"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {getPaginationRange(currentPage, totalPages).map((page, index) =>
                page === '...' ? (
                  <span key={index} className="px-1 sm:px-2 text-white/50 text-sm">
                    ...
                  </span>
                ) : (
                  <button
                    key={page}
                    onClick={() => handlePageChange(Number(page))}
                    className={`pagination-button px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                      currentPage === page
                        ? 'active'
                        : 'inactive'
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`pagination-button p-2 sm:p-3 rounded-full transition-colors ${
                  currentPage === totalPages
                    ? 'bg-gray-600 text-white/50 cursor-not-allowed opacity-50'
                    : 'inactive'
                }`}
                aria-label="下一頁"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="sidebar-container order-2 lg:order-none" ref={sidebarRef}>
          <div className="sidebar-content">
            <Sidebar isLoading={postsLoading} />
          </div>
        </div>
      </div>

      {/* Footer Reference */}
      <div ref={footerRef}></div>
    </div>
  );
};

export default HomePage;
