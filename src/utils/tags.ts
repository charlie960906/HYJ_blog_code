import { getAllPosts } from './posts';

export const getTagsWithFrequency = async () => {
  const posts = await getAllPosts();
  const tagCounts: Record<string, number> = {};
  
  // 計算每個標籤的出現次數
  posts.forEach(post => {
    post.tags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });
  
  const counts = Object.values(tagCounts);
  const maxCount = Math.max(...counts);
  const minCount = Math.min(...counts);
  
  // 計算標籤雲的大小（1.2rem 到 2.2rem，縮小差距）
  return Object.entries(tagCounts)
    .map(([name, count]) => ({
      name,
      count,
      size: 1.2 + (count - minCount) / (maxCount - minCount) * 1.0
    }))
    .sort((a, b) => b.count - a.count);
};

export const getAllTags = async (): Promise<string[]> => {
  const posts = await getAllPosts();
  const tags = new Set<string>();
  
  posts.forEach(post => {
    post.tags.forEach(tag => tags.add(tag));
  });
  
  return Array.from(tags).sort();
};

export const getTagCategories = async () => {
  const tags = await getTagsWithFrequency();
  
  // 根據標籤內容分類
  const categories = {
    technology: tags.filter(tag => 
      ['題解','技術', 'AI', '開發', '科技', '資訊'].includes(tag.name)
    ),
    reviews: tags.filter(tag => 
      ['評測', '電影', '影集', '遊戲'].includes(tag.name)
    ),
    finance: tags.filter(tag => 
      ['股市財經', '投資', '理財', '股市'].includes(tag.name)
    ),
    lifestyle: tags.filter(tag => 
      ['生活', '旅行', '工具', '效率', '推薦'].includes(tag.name)
    )
  };
  
  return categories;
};