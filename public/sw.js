// Service Worker for caching and performance optimization
const CACHE_NAME = 'hyj-blog-v1';
const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';

// 需要快取的靜態資源
const STATIC_ASSETS = [
  '/',
  '/tags',
  '/about',
  '/friends',
  '/images/icon.jpg',
  '/images/my.jpg',
  '/images/background.jpg',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
];

// 動態加入 /assets/ 下的 JS/CSS（build 後會自動快取）
self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(STATIC_CACHE);
      // 預快取靜態資源
      await cache.addAll(STATIC_ASSETS);
      // 嘗試快取 /assets/ 下的 JS/CSS
      try {
        const assets = [
          '/assets/index.js',
          '/assets/index.css'
        ];
        for (const asset of assets) {
          try { await cache.add(asset); } catch {}
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
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
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

// 攔截請求 - 實施快取策略
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 只處理 GET 請求
  if (request.method !== 'GET') {
    return;
  }

  // 靜態資源 - Cache First 策略
  if (
    STATIC_ASSETS.includes(url.pathname) ||
    request.url.includes('/images/') ||
    request.url.includes('fonts.googleapis.com') ||
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
                caches.open(DYNAMIC_CACHE)
                  .then((cache) => {
                    cache.put(request, fetchResponse.clone());
                  });
              }
              return fetchResponse;
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
        return caches.match(request);
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