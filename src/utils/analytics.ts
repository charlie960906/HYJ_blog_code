import { getPostStats } from './posts';

export const getAnalyticsData = async () => {
  const { totalPosts, totalWords } = await getPostStats();
  
  // 實際應用中，這些數據應該來自真實的 Google Analytics API
  // 目前返回基於實際文章數據的統計
  return {
    totalPosts,
    totalWords,
    totalClicks: 0, // 需要從 GA4 API 獲取
    totalViews: 0   // 需要從 GA4 API 獲取
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