// SEO 優化工具
export interface SEOMetadata {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
}

export class SEOManager {
  private static instance: SEOManager;

  static getInstance(): SEOManager {
    if (!SEOManager.instance) {
      SEOManager.instance = new SEOManager();
    }
    return SEOManager.instance;
  }

  // 設置頁面 SEO 元數據
  setPageMetadata(metadata: SEOMetadata): void {
    // 設置標題
    document.title = metadata.title;

    // 清除舊的 meta 標籤
    this.removeExistingMetaTags();

    // 基本 meta 標籤
    this.setMetaTag('description', metadata.description);
    if (metadata.keywords) {
      this.setMetaTag('keywords', metadata.keywords.join(', '));
    }

    // Open Graph 標籤
    this.setMetaProperty('og:title', metadata.title);
    this.setMetaProperty('og:description', metadata.description);
    this.setMetaProperty('og:type', metadata.type || 'website');
    this.setMetaProperty('og:url', metadata.url || window.location.href);
    this.setMetaProperty('og:site_name', "HYJ's Blog");
    this.setMetaProperty('og:locale', 'zh_TW');

    if (metadata.image) {
      this.setMetaProperty('og:image', metadata.image);
      this.setMetaProperty('og:image:alt', metadata.title);
    }

    // Twitter Card 標籤
    this.setMetaName('twitter:card', 'summary_large_image');
    this.setMetaName('twitter:title', metadata.title);
    this.setMetaName('twitter:description', metadata.description);
    if (metadata.image) {
      this.setMetaName('twitter:image', metadata.image);
    }

    // 文章特定標籤
    if (metadata.type === 'article') {
      if (metadata.publishedTime) {
        this.setMetaProperty('article:published_time', metadata.publishedTime);
      }
      if (metadata.modifiedTime) {
        this.setMetaProperty('article:modified_time', metadata.modifiedTime);
      }
      if (metadata.author) {
        this.setMetaProperty('article:author', metadata.author);
      }
      if (metadata.section) {
        this.setMetaProperty('article:section', metadata.section);
      }
    }

    // 規範連結
    this.setCanonicalLink(metadata.url || window.location.href);
  }

  // 生成結構化數據
  generateStructuredData(metadata: SEOMetadata): void {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": metadata.type === 'article' ? "BlogPosting" : "WebSite",
      "headline": metadata.title,
      "description": metadata.description,
      "url": metadata.url || window.location.href,
      "publisher": {
        "@type": "Organization",
        "name": "HYJ's Blog",
        "logo": {
          "@type": "ImageObject",
          "url": `${window.location.origin}/images/icon.jpg`
        }
      }
    };

    if (metadata.type === 'article') {
      Object.assign(structuredData, {
        "author": {
          "@type": "Person",
          "name": metadata.author || "HYJ"
        },
        "datePublished": metadata.publishedTime,
        "dateModified": metadata.modifiedTime || metadata.publishedTime,
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": metadata.url || window.location.href
        }
      });

      if (metadata.image) {
        Object.assign(structuredData, {
          "image": {
            "@type": "ImageObject",
            "url": metadata.image
          }
        });
      }
    }

    // 移除舊的結構化數據
    const existingScript = document.querySelector('script[type="application/ld+json"]');
    if (existingScript) {
      document.head.removeChild(existingScript);
    }

    // 添加新的結構化數據
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);
  }

  // 生成網站地圖數據
  generateSitemapData(posts: Array<{ slug: string; date: string }>): string {
    const baseUrl = 'https://hyjblog.hyjdevelop.com';
    const staticPages = ['', '/tags', '/about', '/friends'];
    const categories = ['information', 'reviews', 'finance', 'travel', 'life'];

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    // 靜態頁面
    staticPages.forEach(page => {
      sitemap += `
  <url>
    <loc>${baseUrl}${page}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
    });

    // 分類頁面
    categories.forEach(category => {
      sitemap += `
  <url>
    <loc>${baseUrl}/category/${category}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
    });

    // 文章頁面
    posts.forEach(post => {
      sitemap += `
  <url>
    <loc>${baseUrl}/post/${post.slug}</loc>
    <lastmod>${post.date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>`;
    });

    sitemap += '\n</urlset>';
    return sitemap;
  }

  private setMetaTag(name: string, content: string): void {
    let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = name;
      document.head.appendChild(meta);
    }
    meta.content = content;
  }

  private setMetaProperty(property: string, content: string): void {
    let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('property', property);
      document.head.appendChild(meta);
    }
    meta.content = content;
  }

  private setMetaName(name: string, content: string): void {
    let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = name;
      document.head.appendChild(meta);
    }
    meta.content = content;
  }

  private setCanonicalLink(url: string): void {
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }
    link.href = url;
  }

  private removeExistingMetaTags(): void {
    const selectors = [
      'meta[name="description"]',
      'meta[name="keywords"]',
      'meta[property^="og:"]',
      'meta[name^="twitter:"]',
      'meta[property^="article:"]'
    ];

    selectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => element.remove());
    });
  }
}