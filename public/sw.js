// DripPilot Service Worker — Push Notifications

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(clients.claim()));

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
  const url = '/dashboard/notifications';
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
