// Service Worker for caching and performance optimization
const CACHE_NAME = 'hyj-blog-v2';
const STATIC_CACHE = 'static-v2';
const DYNAMIC_CACHE = 'dynamic-v2';
const IMAGE_CACHE = 'images-v1';

// 需要快取的靜態資源
const STATIC_ASSETS = [
  '/',
  '/images/icon.jpg',
  '/images/my.jpg',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
];

// 行動裝置優化 - 條件性快取背景圖片
const CONDITIONAL_ASSETS = [
  '/images/background.jpg' // 僅桌面版快取
];
// 安裝事件 - 快取靜態資源
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then((cache) => {
        return cache.addAll(STATIC_ASSETS);
      }),
      // 條件性快取 - 僅桌面版
      self.clients.matchAll().then((clients) => {
        const isDesktop = clients.some(client => 
          client.url.includes('desktop') || 
          !client.url.includes('mobile')
        );
        if (isDesktop) {
          return caches.open(STATIC_CACHE).then((cache) => {
            return cache.addAll(CONDITIONAL_ASSETS);
          });
        }
      })
    ]).then(() => {
      return self.skipWaiting();
    })
  );
});

// 激活事件 - 清理舊快取
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && 
                cacheName !== DYNAMIC_CACHE && 
                cacheName !== IMAGE_CACHE) {
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

  // 圖片資源 - Cache First 策略，專用快取
  if (request.url.includes('/images/') || 
      request.destination === 'image') {
    event.respondWith(
      caches.open(IMAGE_CACHE).then((cache) => {
        return cache.match(request).then((response) => {
          if (response) {
            return response;
          }
          return fetch(request).then((fetchResponse) => {
            // 只快取成功的圖片請求
            if (fetchResponse.ok) {
              cache.put(request, fetchResponse.clone());
            }
            return fetchResponse;
          });
        });
      })
    );
    return;
  }

  // 靜態資源 - Cache First 策略
  if (STATIC_ASSETS.includes(request.url) || 
      request.url.includes('fonts.googleapis.com')) {
    event.respondWith(
      caches.match(request)
        .then((response) => {
          return response || fetch(request)
            .then((fetchResponse) => {
              if (fetchResponse.ok) {
                return caches.open(STATIC_CACHE)
                  .then((cache) => {
                    cache.put(request, fetchResponse.clone());
                    return fetchResponse;
                  });
              }
              return fetchResponse;
            });
        })
    );
    return;
  }

  // Markdown 文章 - 優化的 Stale While Revalidate 策略
  if (request.url.includes('/posts/') && request.url.endsWith('.md')) {
    event.respondWith(
      caches.match(request)
        .then((response) => {
          const fetchPromise = fetch(request)
            .then((fetchResponse) => {
              if (fetchResponse.ok) {
                // 異步更新快取，不阻塞回應
                caches.open(DYNAMIC_CACHE).then((cache) => {
                  cache.put(request, fetchResponse.clone());
                });
              }
              return fetchResponse;
            })
            .catch(() => {
              // 網路失敗時返回快取
              return caches.match(request);
            });

          return response || fetchPromise;
        })
    );
    return;
  }

  // API 請求 - Network First 策略，短時間快取
  if (request.url.includes('/api/') || 
      request.url.includes('analytics')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => {
              // 短時間快取 API 回應
              cache.put(request, responseClone);
              // 5分鐘後自動清除
              setTimeout(() => {
                cache.delete(request);
              }, 5 * 60 * 1000);
            });
          }
          return response;
        })
        .catch(() => {
          return caches.match(request);
        })
    );
    return;
  }

  // 其他請求 - 優化的 Network First 策略
  event.respondWith(
    fetch(request, {
      // 行動裝置優化 - 較短的超時時間
      signal: AbortSignal.timeout(5000)
    })
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

// 快取清理 - 定期清理過期快取
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CLEAN_CACHE') {
    event.waitUntil(
      caches.open(DYNAMIC_CACHE).then((cache) => {
        return cache.keys().then((requests) => {
          return Promise.all(
            requests.map((request) => {
              return cache.match(request).then((response) => {
                if (response) {
                  const cacheTime = new Date(response.headers.get('date')).getTime();
                  const now = Date.now();
                  // 清理超過 1 小時的動態快取
                  if (now - cacheTime > 60 * 60 * 1000) {
                    return cache.delete(request);
                  }
                }
              });
            })
          );
        });
      })
    );
  }
});
// 背景同步 - 離線時的數據同步
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // 優化的背景同步邏輯
      Promise.resolve().then(() => {
        // 同步離線時的用戶操作
        return self.clients.matchAll().then((clients) => {
          clients.forEach((client) => {
            client.postMessage({
              type: 'BACKGROUND_SYNC',
              message: 'Background sync completed'
            });
          });
        });
      })
    );
  }
});

// 推送通知 - 優化的通知處理
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/images/icon.jpg',
      badge: '/images/icon.jpg',
      vibrate: [100, 50, 100],
      tag: 'blog-notification', // 避免重複通知
      renotify: false,
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
    clients.matchAll().then((clientList) => {
      // 如果已有開啟的視窗，聚焦到該視窗
      for (const client of clientList) {
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }
      // 否則開啟新視窗
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});