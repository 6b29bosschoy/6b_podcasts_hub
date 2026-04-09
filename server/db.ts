import { and, desc, eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  BlogPost,
  Booking,
  Contact,
  InsertBlogPost,
  InsertBooking,
  InsertContact,
  InsertReaderSubmission,
  InsertSubscription,
  InsertUser,
  ReaderSubmission,
  Subscription,
  YoutubeCache,
  blogPosts,
  bookings,
  contacts,
  readerSubmissions,
  subscriptions,
  users,
  youtubeCache,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ─── Users ───────────────────────────────────────────────────────────────────

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot upsert user: database not available"); return; }
  try {
    const values: InsertUser = { openId: user.openId };
    const updateSet: Record<string, unknown> = {};
    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];
    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);
    if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; }
    if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; }
    else if (user.openId === ENV.ownerOpenId) { values.role = "admin"; updateSet.role = "admin"; }
    if (!values.lastSignedIn) values.lastSignedIn = new Date();
    if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();
    await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
  } catch (error) { console.error("[Database] Failed to upsert user:", error); throw error; }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot get user: database not available"); return undefined; }
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ─── Blog Posts ───────────────────────────────────────────────────────────────

export async function getApprovedBlogPosts(limit = 20, offset = 0): Promise<BlogPost[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(blogPosts)
    .where(eq(blogPosts.status, "approved"))
    .orderBy(desc(blogPosts.publishedAt))
    .limit(limit).offset(offset);
}

export async function getAllBlogPosts(limit = 50, offset = 0): Promise<BlogPost[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(blogPosts)
    .orderBy(desc(blogPosts.createdAt))
    .limit(limit).offset(offset);
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(blogPosts)
    .where(and(eq(blogPosts.slug, slug), eq(blogPosts.status, "approved")))
    .limit(1);
  return result[0];
}

export async function createBlogPost(data: InsertBlogPost): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(blogPosts).values(data);
}

export async function updateBlogPostStatus(id: number, status: "approved" | "rejected"): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const updateData: Partial<InsertBlogPost> = { status };
  if (status === "approved") updateData.publishedAt = new Date();
  await db.update(blogPosts).set(updateData).where(eq(blogPosts.id, id));
}

export async function incrementBlogPostViewCount(slug: string): Promise<void> {
  const db = await getDb();
  if (!db) return;
  try {
    await db.update(blogPosts)
      .set({ viewCount: sql`${blogPosts.viewCount} + 1` })
      .where(eq(blogPosts.slug, slug));
  } catch (error) {
    console.warn("[Database] Failed to increment view count:", error);
  }
}

// ─── Subscriptions ────────────────────────────────────────────────────────────

export async function createSubscription(data: InsertSubscription): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(subscriptions).values(data)
    .onDuplicateKeyUpdate({ set: { isActive: true, name: data.name ?? null } });
}

export async function getSubscriptions(): Promise<Subscription[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(subscriptions).where(eq(subscriptions.isActive, true)).orderBy(desc(subscriptions.createdAt));
}

// ─── Bookings ─────────────────────────────────────────────────────────────────

export async function createBooking(data: InsertBooking): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(bookings).values(data);
}

export async function getAllBookings(): Promise<Booking[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(bookings).orderBy(desc(bookings.createdAt));
}

export async function updateBookingStatus(id: number, status: "confirmed" | "cancelled"): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(bookings).set({ status }).where(eq(bookings.id, id));
}

// ─── Contacts ─────────────────────────────────────────────────────────────────

export async function createContact(data: InsertContact): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(contacts).values(data);
}

export async function getAllContacts(): Promise<Contact[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(contacts).orderBy(desc(contacts.createdAt));
}

// ─── Reader Submissions ───────────────────────────────────────────────────────

export async function createReaderSubmission(data: InsertReaderSubmission): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(readerSubmissions).values(data);
}

export async function getApprovedSubmissions(limit = 12, offset = 0): Promise<ReaderSubmission[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(readerSubmissions)
    .where(eq(readerSubmissions.status, "approved"))
    .orderBy(desc(readerSubmissions.createdAt))
    .limit(limit).offset(offset);
}

export async function getAllSubmissions(limit = 50, offset = 0): Promise<ReaderSubmission[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(readerSubmissions)
    .orderBy(desc(readerSubmissions.createdAt))
    .limit(limit).offset(offset);
}

export async function updateSubmissionStatus(
  id: number,
  status: "approved" | "rejected" | "published",
  extra?: { publishTarget?: "home" | "blog"; adminNote?: string }
): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const updateData: Partial<InsertReaderSubmission> & { publishedAt?: Date | null } = { status };
  if (extra?.publishTarget) updateData.publishTarget = extra.publishTarget;
  if (extra?.adminNote !== undefined) updateData.adminNote = extra.adminNote;
  if (status === "published") updateData.publishedAt = new Date();
  await db.update(readerSubmissions).set(updateData).where(eq(readerSubmissions.id, id));
}

export async function getPublishedSubmissions(target: "home" | "blog" = "home", limit = 12, offset = 0): Promise<ReaderSubmission[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(readerSubmissions)
    .where(and(eq(readerSubmissions.status, "published"), eq(readerSubmissions.publishTarget, target)))
    .orderBy(desc(readerSubmissions.publishedAt))
    .limit(limit).offset(offset);
}

export async function likeSubmission(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(readerSubmissions)
    .set({ likes: sql`${readerSubmissions.likes} + 1` })
    .where(and(eq(readerSubmissions.id, id), eq(readerSubmissions.status, "approved")));
}

// ─── YouTube Cache ──────────────────────────────────────────────────────────────────────────────

/**
 * Read a cache entry. Returns null if not found or expired.
 */
export async function getYoutubeCache(cacheKey: string): Promise<YoutubeCache | null> {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(youtubeCache)
    .where(eq(youtubeCache.cacheKey, cacheKey))
    .limit(1);
  if (result.length === 0) return null;
  const row = result[0];
  // Check expiry
  if (row.expiresAt < new Date()) {
    // Expired — delete asynchronously, don’t block the caller
    db.delete(youtubeCache).where(eq(youtubeCache.cacheKey, cacheKey)).catch(() => {});
    return null;
  }
  return row;
}

/**
 * Write (upsert) a cache entry with a given TTL in seconds.
 */
export async function setYoutubeCache(cacheKey: string, data: unknown, ttlSeconds: number): Promise<void> {
  const db = await getDb();
  if (!db) return;
  const expiresAt = new Date(Date.now() + ttlSeconds * 1000);
  const serialized = JSON.stringify(data);
  await db.insert(youtubeCache)
    .values({ cacheKey, data: serialized, expiresAt })
    .onDuplicateKeyUpdate({ set: { data: serialized, expiresAt, updatedAt: new Date() } });
}
