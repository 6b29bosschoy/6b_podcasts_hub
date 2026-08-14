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
  authorEmail: varchar("authorEmail", { length: 320 }),
  authorBio: text("authorBio"),
  coverImage: text("coverImage"),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  category: mysqlEnum("category", ["relationship", "fengshui", "lifestyle", "interview", "other"]).default("other").notNull(),
  status: mysqlEnum("status", ["pending", "approved", "rejected"]).default("pending").notNull(),
  // JSON array of S3 image URLs (max 5), stored as varchar to support TiDB default value
  images: varchar("images", { length: 5000 }).default("[]").notNull(),
  // JSON array of { title, url } link objects (max 3)
  links: varchar("links", { length: 2000 }).default("[]").notNull(),
  // Article view count for social proof
  viewCount: int("viewCount").default(0).notNull(),
  // JSON array of { question, answer } FAQ objects for SEO/GEO structured data
  faq: varchar("faq", { length: 5000 }).default("[]").notNull(),
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

// Reader submissions – audience stories, questions, confessions
export const readerSubmissions = mysqlTable("reader_submissions", {
  id: int("id").autoincrement().primaryKey(),
  nickname: varchar("nickname", { length: 50 }).notNull(),
  category: mysqlEnum("category", ["relationship", "fengshui", "confession", "question", "other"]).default("other").notNull(),
  content: text("content").notNull(),
  isAnonymous: boolean("isAnonymous").default(false).notNull(),
  gender: varchar("gender", { length: 20 }),
  ageGroup: varchar("ageGroup", { length: 20 }),
  relationshipStatus: varchar("relationshipStatus", { length: 32 }).default("not_provided").notNull(),
  topicTags: varchar("topicTags", { length: 1000 }).default("[]").notNull(),
  problemDuration: varchar("problemDuration", { length: 32 }),
  publicPermission: varchar("publicPermission", { length: 64 }).default("not_specified").notNull(),
  deepInterpretation: varchar("deepInterpretation", { length: 32 }).default("not_specified").notNull(),
  contactMethod: varchar("contactMethod", { length: 255 }),
  // JSON array of S3 image URLs (max 5), stored as varchar to support TiDB default value
  images: varchar("images", { length: 5000 }).default("[]").notNull(),
  status: mysqlEnum("status", ["pending", "approved", "rejected", "published"]).default("pending").notNull(),
  // Where to publish: "home" = homepage featured, "blog" = guest column
  publishTarget: mysqlEnum("publishTarget", ["home", "blog"]).default("home"),
  adminNote: text("adminNote"),
  likes: int("likes").default(0).notNull(),
  publishedAt: timestamp("publishedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ReaderSubmission = typeof readerSubmissions.$inferSelect;
export type InsertReaderSubmission = typeof readerSubmissions.$inferInsert;

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

// Reader comments on blog posts
export const comments = mysqlTable("comments", {
  id: int("id").autoincrement().primaryKey(),
  postSlug: varchar("postSlug", { length: 255 }).notNull(),
  authorName: varchar("authorName", { length: 100 }).notNull(),
  content: text("content").notNull(),
  // approved = visible; pending = awaiting moderation (default: auto-approved)
  approved: boolean("approved").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type Comment = typeof comments.$inferSelect;
export type InsertComment = typeof comments.$inferInsert;

// Host recruitment applications
export const hostApplications = mysqlTable("host_applications", {
  id: int("id").autoincrement().primaryKey(),
  // 1. 點稱呼？
  name: varchar("name", { length: 100 }).notNull(),
  // 2. 對邊類玄學話題最有興趣？除玄學外，會唔會有其他話題有興趣
  interests: text("interests").notNull(), // e.g., "風水, 命理, 兩性討論"
  // 3. 有冇拍片、直播、主持、KOL 或出鏡經驗？如有可以 send link。
  experience: text("experience"), // optional, can be empty or contain links
  // 4. 你覺得自己適合做主持、嘉賓主持，定單集嘉賓？
  hostType: mysqlEnum("hostType", ["host", "co-host", "guest"]).notNull(),
  // 5. 可以簡單介紹下自己嗎？例如你係邊個、點解對玄學節目有興趣、最想問玄學家咩問題。
  introduction: text("introduction").notNull(),
  // 6. 如果之後合作感覺好，你會唔會有興趣長期參與？
  longTermInterest: boolean("longTermInterest").default(false).notNull(),
  // 7. 除咗玄學，我哋亦有兩性討論、運動健身、人物訪談等節目，你會唔會都有興趣？
  otherShowsInterest: text("otherShowsInterest"), // optional, e.g., "兩性討論, 人物訪談"
  // 8. 聯絡方法。ig account / whatsapp。
  contactMethod: varchar("contactMethod", { length: 255 }).notNull(), // e.g., "@instagram_handle" or "WhatsApp: +852 1234 5678"
  // 9. 能夠拍攝時間 星期1至日  14:00 到18:00 19:00到23:00
  availableTime: text("availableTime").notNull(), // e.g., "星期一至五 14:00-18:00, 19:00-23:00"
  // New fields for form upgrade
  // 時間段多選：JSON array of { day: string, timeSlot: string }[]
  availableTimeSlots: varchar("availableTimeSlots", { length: 2000 }).default("[]").notNull(),
  // 近照上傳：JSON array of S3 image URLs (max 5)
  hostPhotos: varchar("hostPhotos", { length: 5000 }).default("[]").notNull(),
  // 是否接拍商業合作
  acceptCommercial: boolean("acceptCommercial").default(false).notNull(),
  // Privacy & consent
  privacyConsent: boolean("privacyConsent").default(false).notNull(), // User agrees data is for internal use only
  // Status
  status: mysqlEnum("status", ["pending", "contacted", "rejected", "archived"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type HostApplication = typeof hostApplications.$inferSelect;
export type InsertHostApplication = typeof hostApplications.$inferInsert;

// Mystic analysis daily usage tracking
export const mysticUsage = mysqlTable("mystic_usage", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  usageDate: varchar("usageDate", { length: 10 }).notNull(), // YYYY-MM-DD
  count: int("count").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type MysticUsage = typeof mysticUsage.$inferSelect;
export type InsertMysticUsage = typeof mysticUsage.$inferInsert;
