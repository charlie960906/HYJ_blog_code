const fs = require('fs');
const path = require('path');

// 取得當前日期和時間
const now = new Date();
const version = now.getFullYear() + '-' + 
                String(now.getMonth() + 1).padStart(2, '0') + '-' + 
                String(now.getDate()).padStart(2, '0') + '-' + 
                String(now.getHours()).padStart(2, '0') + '-' + 
                String(now.getMinutes()).padStart(2, '0');

const swPath = path.join(__dirname, '../public/sw.js');
let swContent = fs.readFileSync(swPath, 'utf8');

// 取代所有快取名稱
swContent = swContent
  .replace(/hyj-blog-v[\w-]+/g, `hyj-blog-v${version}`)
  .replace(/static-v[\w-]+/g, `static-v${version}`)
  .replace(/dynamic-v[\w-]+/g, `dynamic-v${version}`)
  .replace(/images-v[\w-]+/g, `images-v${version}`)
  .replace(/fonts-v[\w-]+/g, `fonts-v${version}`);

fs.writeFileSync(swPath, swContent, 'utf8');
console.log(`sw.js cache version updated to: v${version}`);