import { getPostStats } from './posts';

export const getAnalyticsData = async () => {
  const { totalPosts, totalWords } = await getPostStats();
  
  // 模擬點擊和觀看數據（在真實應用中，這些會來自 GA4 API）
  const totalClicks = Math.floor(totalPosts * 45 + Math.random() * 100);
  const totalViews = Math.floor(totalPosts * 120 + Math.random() * 200);
  
  return {
    totalPosts,
    totalWords,
    totalClicks,
    totalViews
  };
};

// GA4 事件追蹤函數
export const trackEvent = (eventName: string, parameters: Record<string, any> = {}) => {
  if (typeof gtag !== 'undefined') {
    gtag('event', eventName, parameters);
  }
};

export const trackPageView = (pageTitle: string, pageLocation: string) => {
  if (typeof gtag !== 'undefined') {
    gtag('event', 'page_view', {
      page_title: pageTitle,
      page_location: pageLocation,
      content_group1: 'blog_post'
    });
  }
};

export const trackPostRead = (postSlug: string, postTitle: string) => {
  trackEvent('post_read', {
    event_category: 'engagement',
    event_label: postSlug,
    post_title: postTitle
  });
};

export const trackSearch = (searchQuery: string, resultCount: number) => {
  trackEvent('search', {
    search_term: searchQuery,
    result_count: resultCount
  });
};