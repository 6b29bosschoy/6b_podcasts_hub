import webpush from "web-push";
import { ENV } from "./_core/env";
import { getDb } from "./db";
import { pushSubscriptions, pushNotifications } from "../drizzle/schema";
import { eq, and } from "drizzle-orm";

// Initialize web-push with VAPID keys
export function initWebPush() {
  if (!ENV.vapidPublicKey || !ENV.vapidPrivateKey) {
    console.warn("[WebPush] VAPID keys not configured — push notifications disabled");
    return false;
  }
  webpush.setVapidDetails(
    "mailto:contact@6bpodcasts.com",
    ENV.vapidPublicKey,
    ENV.vapidPrivateKey
  );
  return true;
}

export interface PushSubscriptionPayload {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export interface PushMessagePayload {
  title: string;
  body: string;
  url?: string;
  icon?: string;
  badge?: string;
}

/** Save a new push subscription to the database */
export async function savePushSubscription(
  payload: PushSubscriptionPayload,
  userId?: number,
  userAgent?: string
): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Check if subscription already exists (by endpoint prefix to avoid text column issues)
  const existing = await db
    .select({ id: pushSubscriptions.id, isActive: pushSubscriptions.isActive })
    .from(pushSubscriptions)
    .limit(100);

  const match = existing.find(
    (r) => false // We'll use INSERT ... ON DUPLICATE KEY approach below
  );

  // Insert or update via raw approach — endpoint is TEXT so no unique index
  // We'll check by endpoint value manually
  const all = await db
    .select()
    .from(pushSubscriptions)
    .limit(1000);

  const existingByEndpoint = all.find((r) => r.endpoint === payload.endpoint);

  if (existingByEndpoint) {
    // Reactivate if previously unsubscribed
    await db
      .update(pushSubscriptions)
      .set({ isActive: true, updatedAt: new Date() })
      .where(eq(pushSubscriptions.id, existingByEndpoint.id));
  } else {
    await db.insert(pushSubscriptions).values({
      endpoint: payload.endpoint,
      p256dh: payload.keys.p256dh,
      auth: payload.keys.auth,
      userId: userId ?? null,
      userAgent: userAgent ?? null,
      isActive: true,
    });
  }
}

/** Mark a subscription as inactive (unsubscribe) */
export async function removePushSubscription(endpoint: string): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const all = await db.select().from(pushSubscriptions).limit(1000);
  const match = all.find((r) => r.endpoint === endpoint);
  if (match) {
    await db
      .update(pushSubscriptions)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(pushSubscriptions.id, match.id));
  }
}

/** Send a push notification to all active subscribers */
export async function sendPushToAll(
  message: PushMessagePayload,
  createdBy?: number
): Promise<{ sent: number; failed: number }> {
  const initialized = initWebPush();
  if (!initialized) throw new Error("VAPID keys not configured");

  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const subs = await db
    .select()
    .from(pushSubscriptions)
    .where(eq(pushSubscriptions.isActive, true));

  let sent = 0;
  let failed = 0;

  const payload = JSON.stringify({
    title: message.title,
    body: message.body,
    url: message.url ?? "/",
    icon: message.icon ?? "/favicon.ico",
    badge: message.badge ?? "/favicon.ico",
  });

  await Promise.allSettled(
    subs.map(async (sub) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: {
              p256dh: sub.p256dh,
              auth: sub.auth,
            },
          },
          payload
        );
        sent++;
      } catch (err: unknown) {
        failed++;
        // If subscription is expired/invalid (410 Gone), deactivate it
        const statusCode = (err as { statusCode?: number })?.statusCode;
        if (statusCode === 410 || statusCode === 404) {
          await db
            .update(pushSubscriptions)
            .set({ isActive: false, updatedAt: new Date() })
            .where(eq(pushSubscriptions.id, sub.id));
        }
        console.warn(`[WebPush] Failed to send to ${sub.endpoint.slice(0, 50)}:`, statusCode);
      }
    })
  );

  // Record in history
  await db.insert(pushNotifications).values({
    title: message.title,
    body: message.body,
    url: message.url ?? null,
    icon: message.icon ?? null,
    sentCount: sent,
    failedCount: failed,
    sentAt: new Date(),
    createdBy: createdBy ?? null,
  });

  return { sent, failed };
}

/** Get push notification history */
export async function getPushHistory(limit = 20) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(pushNotifications)
    .orderBy(pushNotifications.sentAt)
    .limit(limit);
}

/** Get active subscriber count */
export async function getPushSubscriberCount(): Promise<number> {
  const db = await getDb();
  if (!db) return 0;
  const rows = await db
    .select({ id: pushSubscriptions.id })
    .from(pushSubscriptions)
    .where(eq(pushSubscriptions.isActive, true));
  return rows.length;
}
