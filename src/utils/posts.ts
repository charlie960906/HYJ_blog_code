import { Post } from '../types/post';
import { parseMarkdown } from './markdown';

const getAvailablePostSlugs = (): string[] => {
  return [
  'Introduction__c++',
  'Operators_c++',
  'Statements_c++',
  'function_variables_c++',
  'arrary_c++',
  'linked_list_c++',
  'class_c++',
  'pointer_c++',
  'sorting_c++',
  'stack_quere_c++',
  'stl_vector_c++',
  'string_c++',
  'struct_c++',
  'PE_zj_a225' 
];
};

export const getAllPosts = async (): Promise<Post[]> => {
  const slugs = getAvailablePostSlugs();
  const posts: Post[] = [];
  
  for (const slug of slugs) {
    try {
      const response = await fetch(`/posts/${slug}.md`);
      if (response.ok) {
        const markdown = await response.text();
        const post = parseMarkdown(markdown, slug);
        posts.push(post);
      }
    } catch (error) {
      console.error(`Failed to load post: ${slug}`, error);
    }
  }
  
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