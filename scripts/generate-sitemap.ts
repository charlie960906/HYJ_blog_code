import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const domain = 'https://hyjblog.hyjdevelop.com';
const publicPostPath = path.join(__dirname, '../public/posts');
const distSitemapPath = path.join(__dirname, '../dist/sitemap.xml');

const staticRoutes = ['', '/tags', '/about', '/friends'];
const categoryRoutes = ['information', 'reviews', 'finance', 'travel', 'life'];

const buildSitemap = () => {
  const posts = fs.readdirSync(publicPostPath)
    .filter(name => name.endsWith('.md'))
    .map(name => name.replace(/\.md$/, ''));

  const urls = [
    ...staticRoutes.map(route => `
<url>
  <loc>${domain}${route}</loc>
  <changefreq>monthly</changefreq>
  <priority>0.6</priority>
</url>`),

    ...categoryRoutes.map(cat => `
<url>
  <loc>${domain}/category/${cat}</loc>
  <changefreq>weekly</changefreq>
  <priority>0.7</priority>
</url>`),

    ...posts.map(slug => `
<url>
  <loc>${domain}/post/${slug}</loc>
  <changefreq>monthly</changefreq>
  <priority>0.8</priority>
</url>`)
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

  fs.writeFileSync(distSitemapPath, sitemap);
  console.log('✅ sitemap.xml generated at dist/sitemap.xml');
};

buildSitemap();
