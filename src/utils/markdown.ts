import { marked } from 'marked';
import { Post } from '../types/post';

// 配置 marked 選項
marked.setOptions({
  breaks: true,
  gfm: true,
});

// 自定義渲染器
const renderer = new marked.Renderer();

// 自定義圖片渲染
renderer.image = function(href, title, text) {
  const titleAttr = title ? ` title="${title}"` : '';
  const altAttr = text ? ` alt="${text}"` : '';
  
  return `
    <div class="image-container">
      <img src="${href}"${altAttr}${titleAttr} loading="lazy" />
      ${title ? `<p class="image-caption">${title}</p>` : ''}
    </div>
  `;
};

// 自定義連結渲染（支援圖片連結）
renderer.link = function(href, title, text) {
  const titleAttr = title ? ` title="${title}"` : '';
  const target = (typeof href === 'string' && href.startsWith('http')) ? ' target="_blank" rel="noopener noreferrer"' : '';
  
  return `<a href="${href}"${titleAttr}${target}>${text}</a>`;
};

export const parseMarkdown = (markdown: string, slug: string): Post => {
  const lines = markdown.split('\n');
  const frontMatterRegex = /^---\s*$/;
  
  let frontMatterStart = -1;
  let frontMatterEnd = -1;
  
  // Find front matter boundaries
  for (let i = 0; i < lines.length; i++) {
    if (frontMatterRegex.test(lines[i])) {
      if (frontMatterStart === -1) {
        frontMatterStart = i;
      } else {
        frontMatterEnd = i;
        break;
      }
    }
  }
  
  let frontMatter: Record<string, any> = {};
  let content = markdown;
  
  if (frontMatterStart !== -1 && frontMatterEnd !== -1) {
    // Parse front matter
    const frontMatterLines = lines.slice(frontMatterStart + 1, frontMatterEnd);
    frontMatterLines.forEach(line => {
      const match = line.match(/^(\w+):\s*(.*)$/);
      if (match) {
        const [, key, value] = match;
        if (key === 'tags') {
          frontMatter[key] = value.split(',').map(tag => tag.trim());
        } else {
          frontMatter[key] = value;
        }
      }
    });
    
    // Remove front matter from content
    content = lines.slice(frontMatterEnd + 1).join('\n');
  }
  
  // Parse markdown content
  const htmlContent = marked(content, { renderer });
  
  return {
    slug,
    title: frontMatter.title || 'Untitled',
    date: frontMatter.date || new Date().toISOString().split('T')[0],
    summary: frontMatter.summary || '',
    tags: frontMatter.tags || [],
    content: htmlContent,
    category: frontMatter.category
  };
};