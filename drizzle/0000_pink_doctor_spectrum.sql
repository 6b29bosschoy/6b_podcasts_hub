CREATE TABLE `blog_posts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`authorName` varchar(100) NOT NULL,
	`authorEmail` varchar(320),
	`authorBio` text,
	`coverImage` text,
	`excerpt` text,
	`content` text NOT NULL,
	`category` enum('relationship','fengshui','lifestyle','interview','other') NOT NULL DEFAULT 'other',
	`status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
	`images` varchar(5000) NOT NULL DEFAULT '[]',
	`links` varchar(2000) NOT NULL DEFAULT '[]',
	`viewCount` int NOT NULL DEFAULT 0,
	`faq` varchar(5000) NOT NULL DEFAULT '[]',
	`publishedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `blog_posts_id` PRIMARY KEY(`id`),
	CONSTRAINT `blog_posts_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `bookings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(30),
	`serviceType` enum('fengshui','bazi','tarot','spiritual','course') NOT NULL,
	`preferredDate` varchar(20),
	`preferredTime` varchar(20),
	`message` text,
	`status` enum('pending','confirmed','cancelled') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `bookings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `comments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`postSlug` varchar(255) NOT NULL,
	`authorName` varchar(100) NOT NULL,
	`content` text NOT NULL,
	`approved` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `comments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `contacts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(30),
	`inquiryType` enum('collaboration','guest','feedback','other') NOT NULL DEFAULT 'other',
	`subject` varchar(255) NOT NULL,
	`message` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `contacts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `host_applications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`interests` text NOT NULL,
	`experience` text,
	`hostType` enum('host','co-host','guest') NOT NULL,
	`introduction` text NOT NULL,
	`longTermInterest` boolean NOT NULL DEFAULT false,
	`otherShowsInterest` text,
	`contactMethod` varchar(255) NOT NULL,
	`availableTime` text NOT NULL,
	`availableTimeSlots` varchar(2000) NOT NULL DEFAULT '[]',
	`hostPhotos` varchar(5000) NOT NULL DEFAULT '[]',
	`acceptCommercial` boolean NOT NULL DEFAULT false,
	`privacyConsent` boolean NOT NULL DEFAULT false,
	`status` enum('pending','contacted','rejected','archived') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `host_applications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `mystic_usage` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`usageDate` varchar(10) NOT NULL,
	`count` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `mystic_usage_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `push_notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`body` text NOT NULL,
	`url` varchar(500),
	`icon` varchar(500),
	`sentCount` int NOT NULL DEFAULT 0,
	`failedCount` int NOT NULL DEFAULT 0,
	`sentAt` timestamp NOT NULL DEFAULT (now()),
	`createdBy` int,
	CONSTRAINT `push_notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `push_subscriptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`endpoint` text NOT NULL,
	`p256dh` text NOT NULL,
	`auth` text NOT NULL,
	`userId` int,
	`userAgent` text,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `push_subscriptions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reader_submissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nickname` varchar(50) NOT NULL,
	`category` enum('relationship','fengshui','confession','question','other') NOT NULL DEFAULT 'other',
	`content` text NOT NULL,
	`isAnonymous` boolean NOT NULL DEFAULT false,
	`images` varchar(5000) NOT NULL DEFAULT '[]',
	`status` enum('pending','approved','rejected','published') NOT NULL DEFAULT 'pending',
	`publishTarget` enum('home','blog') DEFAULT 'home',
	`adminNote` text,
	`likes` int NOT NULL DEFAULT 0,
	`publishedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `reader_submissions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `subscriptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`name` varchar(100),
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `subscriptions_id` PRIMARY KEY(`id`),
	CONSTRAINT `subscriptions_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
--> statement-breakpoint
CREATE TABLE `youtube_cache` (
	`id` int AUTO_INCREMENT NOT NULL,
	`cacheKey` varchar(255) NOT NULL,
	`data` text NOT NULL,
	`expiresAt` timestamp NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `youtube_cache_id` PRIMARY KEY(`id`),
	CONSTRAINT `youtube_cache_cacheKey_unique` UNIQUE(`cacheKey`)
);
