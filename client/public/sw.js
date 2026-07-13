/* 路邊電台 × 路邊玄學堂 — Web Push Service Worker */
const CACHE_NAME = "6bpodcasts-v1";

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim());
});

/** Handle incoming push messages */
self.addEventListener("push", (event) => {
  let data = {
    title: "路邊電台",
    body: "有新消息！",
    url: "/",
    icon: "/favicon.ico",
    badge: "/favicon.ico",
  };

  if (event.data) {
    try {
      const parsed = event.data.json();
      data = { ...data, ...parsed };
    } catch {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: data.icon,
    badge: data.badge,
    tag: "6bpodcasts-notification",
    renotify: true,
    requireInteraction: false,
    vibrate: [200, 100, 200],
    data: { url: data.url },
    actions: [
      { action: "open", title: "立即查看" },
      { action: "close", title: "關閉" },
    ],
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

/** Handle notification click */
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "close") return;

  const targetUrl = event.notification.data?.url ?? "/";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      // Focus existing tab if open
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && "focus" in client) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }
      // Otherwise open new tab
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
