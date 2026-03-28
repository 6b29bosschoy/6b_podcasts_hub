import {
  boolean,
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Blog posts submitted by guests
export const blogPosts = mysqlTable("blog_posts", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  authorName: varchar("authorName", { length: 100 }).notNull(),
  authorEmail: varchar("authorEmail", { length: 320 }).notNull(),
  authorBio: text("authorBio"),
  coverImage: text("coverImage"),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  category: mysqlEnum("category", ["relationship", "fengshui", "lifestyle", "interview", "other"]).default("other").notNull(),
  status: mysqlEnum("status", ["pending", "approved", "rejected"]).default("pending").notNull(),
  publishedAt: timestamp("publishedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = typeof blogPosts.$inferInsert;

// Email subscriptions
export const subscriptions = mysqlTable("subscriptions", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  name: varchar("name", { length: 100 }),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = typeof subscriptions.$inferInsert;

// Service bookings
export const bookings = mysqlTable("bookings", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 30 }),
  serviceType: mysqlEnum("serviceType", ["fengshui", "bazi", "tarot", "spiritual", "course"]).notNull(),
  preferredDate: varchar("preferredDate", { length: 20 }),
  preferredTime: varchar("preferredTime", { length: 20 }),
  message: text("message"),
  status: mysqlEnum("status", ["pending", "confirmed", "cancelled"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = typeof bookings.$inferInsert;

// Contact / collaboration inquiries
export const contacts = mysqlTable("contacts", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 30 }),
  inquiryType: mysqlEnum("inquiryType", ["collaboration", "guest", "feedback", "other"]).default("other").notNull(),
  subject: varchar("subject", { length: 255 }).notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Contact = typeof contacts.$inferSelect;
export type InsertContact = typeof contacts.$inferInsert;

// YouTube API cache — reduces quota consumption
// cacheKey: e.g. "channel:6bpodcasts", "videos:all:6"
// data: JSON stringified payload
// expiresAt: cache TTL (24h for channel IDs, 1h for video lists)
export const youtubeCache = mysqlTable("youtube_cache", {
  id: int("id").autoincrement().primaryKey(),
  cacheKey: varchar("cacheKey", { length: 255 }).notNull().unique(),
  data: text("data").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type YoutubeCache = typeof youtubeCache.$inferSelect;
export type InsertYoutubeCache = typeof youtubeCache.$inferInsert;

// Web Push Notification subscriptions
export const pushSubscriptions = mysqlTable("push_subscriptions", {
  id: int("id").autoincrement().primaryKey(),
  endpoint: text("endpoint").notNull(),
  p256dh: text("p256dh").notNull(),
  auth: text("auth").notNull(),
  userId: int("userId"),
  userAgent: text("userAgent"),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PushSubscription = typeof pushSubscriptions.$inferSelect;
export type InsertPushSubscription = typeof pushSubscriptions.$inferInsert;

// Push notification send history
export const pushNotifications = mysqlTable("push_notifications", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  body: text("body").notNull(),
  url: varchar("url", { length: 500 }),
  icon: varchar("icon", { length: 500 }),
  sentCount: int("sentCount").default(0).notNull(),
  failedCount: int("failedCount").default(0).notNull(),
  sentAt: timestamp("sentAt").defaultNow().notNull(),
  createdBy: int("createdBy"),
});

export type PushNotification = typeof pushNotifications.$inferSelect;
export type InsertPushNotification = typeof pushNotifications.$inferInsert;
