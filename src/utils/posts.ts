import { Post } from '../types/post';
import { parseMarkdown } from './markdown';

// 動態獲取所有可用的文章檔案
const getAvailablePostSlugs = async (): Promise<string[]> => {
  try {
    // 嘗試讀取 posts 目錄的索引檔案（如果存在）
    const response = await fetch('/posts/index.json');
    if (response.ok) {
      const fileList = await response.json();
      return fileList.map((filename: string) => filename.replace('.md', ''));
    }
  } catch (error) {
    // 如果沒有索引檔案，使用已知的檔案列表作為後備
    console.warn('No index.json found, using fallback file list');
  }
  
  // 後備方案：已知的檔案列表
  return [
    'about-me-introduction',
    'react-18-features',
    'typescript-best-practices',
    'iphone-15-review',
    'stock-market-2025',
    'travel-japan-kyoto',
    'productivity-tools-2025',
    '123',
    'aaa'
  ];
};

// 嘗試從目錄結構中推斷可用檔案
const discoverPostFiles = async (): Promise<string[]> => {
  const knownFiles = [
    'about-me-introduction',
    'react-18-features', 
    'typescript-best-practices',
    'iphone-15-review',
    'stock-market-2025',
    'travel-japan-kyoto',
    'productivity-tools-2025',
    '123',
    'aaa'
  ];
  
  const availableFiles: string[] = [];
  
  // 並行檢查所有已知檔案是否存在
  const checkPromises = knownFiles.map(async (slug) => {
    try {
      const response = await fetch(`/posts/${slug}.md`, { method: 'HEAD' });
      if (response.ok) {
        return slug;
      }
    } catch (error) {
      console.warn(`File not found: ${slug}.md`);
    }
    return null;
  });
  
  const results = await Promise.all(checkPromises);
  results.forEach(slug => {
    if (slug) availableFiles.push(slug);
  });
  
  return availableFiles;
};

export const getAllPosts = async (): Promise<Post[]> => {
  let slugs: string[] = [];
  
  try {
    // 首先嘗試動態發現檔案
    slugs = await discoverPostFiles();
    
    // 如果沒有找到任何檔案，使用後備列表
    if (slugs.length === 0) {
      slugs = await getAvailablePostSlugs();
    }
  } catch (error) {
    console.error('Error discovering post files:', error);
    // 使用後備列表
    slugs = await getAvailablePostSlugs();
  }
  
  const posts: Post[] = [];
  
  // 並行載入所有文章
  const loadPromises = slugs.map(async (slug) => {
    try {
      const response = await fetch(`/posts/${slug}.md`);
      if (response.ok) {
        const markdown = await response.text();
        const post = parseMarkdown(markdown, slug);
        return post;
      } else {
        console.warn(`Failed to load post: ${slug} (${response.status})`);
      }
    } catch (error) {
      console.error(`Failed to load post: ${slug}`, error);
    }
    return null;
  });
  
  const results = await Promise.all(loadPromises);
  results.forEach(post => {
    if (post) posts.push(post);
  });
  
  // 按日期排序（最新的在前）
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const getPostBySlug = async (slug: string): Promise<Post | null> => {
  try {
    const response = await fetch(`/posts/${slug}.md`);
    if (!response.ok) {
      return null;
    }
    const markdown = await response.text();
    return parseMarkdown(markdown, slug);
  } catch (error) {
    console.error(`Failed to load post: ${slug}`, error);
    return null;
  }
};

export const getRelatedPosts = async (currentPost: Post): Promise<Post[]> => {
  const allPosts = await getAllPosts();
  
  // 找出有共同標籤的文章
  const relatedPosts = allPosts
    .filter(post => post.slug !== currentPost.slug)
    .map(post => {
      const commonTags = post.tags.filter(tag => currentPost.tags.includes(tag));
      return {
        post,
        relevance: commonTags.length
      };
    })
    .filter(item => item.relevance > 0)
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, 3)
    .map(item => item.post);
  
  return relatedPosts;
};

export const filterPosts = (posts: Post[], filters: {
  search?: string | null;
  tag?: string | null;
  category?: string | null;
}): Post[] => {
  return posts.filter(post => {
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch = 
        post.title.toLowerCase().includes(searchLower) ||
        post.summary.toLowerCase().includes(searchLower) ||
        post.content.toLowerCase().includes(searchLower) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchLower));
      if (!matchesSearch) return false;
    }
    
    if (filters.tag) {
      const matchesTag = post.tags.includes(filters.tag);
      if (!matchesTag) return false;
    }
    
    if (filters.category) {
      const matchesCategory = post.category === filters.category;
      if (!matchesCategory) return false;
    }
    
    return true;
  });
};

export const getPostsByCategory = async (category: string): Promise<Post[]> => {
  const allPosts = await getAllPosts();
  return allPosts.filter(post => post.category === category);
};

export const getPostStats = async () => {
  const posts = await getAllPosts();
  
  const totalPosts = posts.length;
  const totalWords = posts.reduce((total, post) => {
    // 計算文章字數（移除 HTML 標籤）
    const textContent = post.content.replace(/<[^>]*>/g, '');
    const wordCount = textContent.split(/\s+/).filter(word => word.length > 0).length;
    return total + wordCount;
  }, 0);
  
  return {
    totalPosts,
    totalWords
  };
};

// 新增：獲取所有可用的文章檔案名稱（用於調試）
export const getAvailablePostFiles = async (): Promise<string[]> => {
  return await discoverPostFiles();
};

// 新增：檢查特定文章是否存在
export const checkPostExists = async (slug: string): Promise<boolean> => {
  try {
    const response = await fetch(`/posts/${slug}.md`, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    return false;
  }
};