// DripPilot Service Worker — PWA + Push Notifications

const CACHE_NAME = 'drippilot-v1';
const APP_SHELL = [
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/assets/logo-icon.png',
  '/assets/favicon.ico',
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      clients.claim(),
      caches.keys().then((keys) =>
        Promise.all(
          keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
        )
      ),
    ])
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  if (url.origin !== self.location.origin) return;

  if (url.pathname.startsWith('/_next/')) return;

  // Static assets (images, fonts, icons) — stale-while-revalidate
  if (/\.(png|jpg|jpeg|svg|ico|webp|woff2?)$/.test(url.pathname)) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cached = await cache.match(request);
        const networkFetch = fetch(request)
          .then((res) => {
            if (res.ok) cache.put(request, res.clone());
            return res;
          })
          .catch(() => cached);
        return cached ?? networkFetch;
      })
    );
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() =>
        caches.match(request).then((cached) => cached ?? Response.error())
      )
    );
    return;
  }
});

self.addEventListener('push', (event) => {
  if (!event.data) return;
  let payload;
  try { payload = event.data.json(); }
  catch { payload = { title: 'DripPilot', body: event.data.text() }; }

  const options = {
    body: payload.body || 'You have a new notification',
    icon: '/assets/logo-icon.png',
    badge: '/assets/logo-icon.png',
    data: payload.data || {},
    tag: `drippilot-${payload.data?.leadId || Date.now()}`,
    renotify: true,
    requireInteraction: false,
  };

  event.waitUntil(
    self.registration.showNotification(payload.title || 'DripPilot', options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const data = event.notification.data || {};
  const url = data.outreachId
    ? `/dashboard/messages/${data.outreachId}`
    : '/dashboard/messages';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      for (const client of list) {
        if (client.url.startsWith(self.location.origin) && 'focus' in client) {
          client.focus();
          if ('navigate' in client) return client.navigate(url);
          return;
        }
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});
