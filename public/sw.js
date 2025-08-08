// Service Worker for caching and performance optimization
const CACHE_NAME = 'hyj-blog-v2025-08-08-22-52';
const STATIC_CACHE = 'static-v2025-08-08-22-52';
const DYNAMIC_CACHE = 'dynamic-v2025-08-08-22-52';
const IMAGE_CACHE = 'images-v2025-08-08-22-52';
const FONT_CACHE = 'fonts-v2025-08-08-22-52';

// 需要快取的靜態資源
const STATIC_ASSETS = [
  '/',
  '/tags',
  '/about',
  '/friends',
  '/images/icon.jpg',
  '/images/my.jpg',
  '/images/background.jpg',
  '/images/f1_movie_pic1.jpg',
  '/images/f1_movie_pic2.jpg',
  '/images/f1_movie_pic3.jpg'
];

// 字體檔案
const FONT_FILES = [
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
  'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2',
  'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZ9hiJ-Ek-_EeA.woff2'
];

// 動態加入 /assets/ 下的 JS/CSS（build 後會自動快取）
self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      // 快取靜態資源
      const staticCache = await caches.open(STATIC_CACHE);
      await staticCache.addAll(STATIC_ASSETS);
      
      // 快取字體
      const fontCache = await caches.open(FONT_CACHE);
      await Promise.all(FONT_FILES.map(async (font) => {
        try {
          await fontCache.add(font);
        } catch (e) {
          console.error(`Failed to cache font: ${font}`, e);
        }
      }));
      
      // 嘗試快取 /assets/ 下的 JS/CSS
      try {
        const assets = [
          '/assets/index.js',
          '/assets/index.css'
        ];
        for (const asset of assets) {
          try { await staticCache.add(asset); } catch {}
        }
      } catch {}
      
      await self.skipWaiting();
    })()
  );
});

// 激活事件 - 清理舊快取
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // 清理舊版本的快取
            if (
              cacheName !== STATIC_CACHE && 
              cacheName !== DYNAMIC_CACHE &&
              cacheName !== IMAGE_CACHE &&
              cacheName !== FONT_CACHE
            ) {
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        return self.clients.claim();
      })
  );
});

// 檢測是否為行動裝置
const isMobile = (request) => {
  const userAgent = request.headers.get('User-Agent') || '';
  return /Mobile|Android|iPhone|iPad|iPod/i.test(userAgent);
};

// 攔截請求 - 實施快取策略
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 只處理 GET 請求
  if (request.method !== 'GET') {
    return;
  }

  // 字體檔案 - Cache First 策略，長期快取
  if (request.url.includes('fonts.googleapis.com') || request.url.includes('fonts.gstatic.com')) {
    event.respondWith(
      caches.match(request)
        .then((response) => {
          return response || fetch(request)
            .then((fetchResponse) => {
              return caches.open(FONT_CACHE)
                .then((cache) => {
                  cache.put(request, fetchResponse.clone());
                  return fetchResponse;
                });
            })
            .catch(() => {
              // 如果網絡請求失敗，返回一個基本的字體回退
              if (request.url.includes('.woff2')) {
                return new Response('', {
                  status: 200,
                  headers: new Headers({
                    'Content-Type': 'font/woff2'
                  })
                });
              }
              return fetch(request);
            });
        })
    );
    return;
  }

  // 圖片檔案 - Cache First
  if (request.url.includes('/images/') || request.url.endsWith('.jpg') || request.url.endsWith('.jpeg') || request.url.endsWith('.png')) {
    event.respondWith(
      caches.match(request)
        .then((response) => {
          if (response) {
            return response;
          }
          return fetch(request)
            .then((fetchResponse) => {
              // 快取圖片
              const responseToCache = fetchResponse.clone();
              caches.open(IMAGE_CACHE).then((cache) => {
                cache.put(request, responseToCache);
              });
              return fetchResponse;
            })
            .catch(() => {
              // 如果網絡請求失敗，返回一個佔位圖片
              return new Response(
                '<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="300" fill="#eee"/><text x="50%" y="50%" font-size="18" text-anchor="middle" fill="#999">Image not available</text></svg>',
                {
                  status: 200,
                  headers: new Headers({
                    'Content-Type': 'image/svg+xml'
                  })
                }
              );
            });
        })
    );
    return;
  }

  // 靜態資源 - Cache First 策略
  if (
    STATIC_ASSETS.includes(url.pathname) ||
    url.pathname.startsWith('/assets/')
  ) {
    event.respondWith(
      caches.match(request)
        .then((response) => {
          return response || fetch(request)
            .then((fetchResponse) => {
              return caches.open(STATIC_CACHE)
                .then((cache) => {
                  cache.put(request, fetchResponse.clone());
                  return fetchResponse;
                });
            });
        })
    );
    return;
  }

  // Markdown 文章 - Stale While Revalidate 策略
  if (request.url.includes('/posts/') && request.url.endsWith('.md')) {
    event.respondWith(
      caches.match(request)
        .then((response) => {
          const fetchPromise = fetch(request)
            .then((fetchResponse) => {
              if (fetchResponse.ok) {
                const responseToCache = fetchResponse.clone();
                caches.open(DYNAMIC_CACHE)
                  .then((cache) => {
                    cache.put(request, responseToCache);
                  });
              }
              return fetchResponse;
            })
            .catch(() => {
              // 如果網絡請求失敗且沒有快取，返回一個基本的回退
              if (!response) {
                return new Response('文章暫時無法載入，請檢查網絡連接。', {
                  status: 200,
                  headers: new Headers({
                    'Content-Type': 'text/markdown'
                  })
                });
              }
              return response;
            });

          return response || fetchPromise;
        })
    );
    return;
  }

  // 其他請求 - Network First 策略
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok) {
          const responseClone = response.clone();
          caches.open(DYNAMIC_CACHE)
            .then((cache) => {
              cache.put(request, responseClone);
            });
        }
        return response;
      })
      .catch(() => {
        return caches.match(request)
          .then(cachedResponse => {
            if (cachedResponse) {
              return cachedResponse;
            }
            
            // 如果是 HTML 頁面請求，返回離線頁面
            if (request.headers.get('Accept').includes('text/html')) {
              return caches.match('/');
            }
            
            return new Response('資源暫時無法載入', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'text/plain'
              })
            });
          });
      })
  );
});

// 背景同步 - 離線時的數據同步
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // 執行背景同步邏輯
      console.log('Background sync triggered')
    );
  }
});

// 推送通知
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/images/icon.jpg',
      badge: '/images/icon.jpg',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: data.primaryKey
      }
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// 通知點擊事件
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    clients.openWindow('/')
  );
});

// 定期清理過期快取
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'cache-cleanup') {
    event.waitUntil(
      (async () => {
        // 清理一週前的動態快取
        const cache = await caches.open(DYNAMIC_CACHE);
        const requests = await cache.keys();
        const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
        
        for (const request of requests) {
          const response = await cache.match(request);
          if (response) {
            const dateHeader = response.headers.get('date');
            if (dateHeader) {
              const date = new Date(dateHeader).getTime();
              if (date < oneWeekAgo) {
                await cache.delete(request);
              }
            }
          }
        }
      })()
    );
  }
});