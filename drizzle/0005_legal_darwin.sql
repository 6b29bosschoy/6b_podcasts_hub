ALTER TABLE `reader_submissions` MODIFY COLUMN `status` enum('pending','approved','rejected','published') NOT NULL DEFAULT 'pending';--> statement-breakpoint
ALTER TABLE `reader_submissions` ADD `images` text DEFAULT ('[]') NOT NULL;--> statement-breakpoint
ALTER TABLE `reader_submissions` ADD `publishTarget` enum('home','blog') DEFAULT 'home';--> statement-breakpoint
ALTER TABLE `reader_submissions` ADD `adminNote` text;--> statement-breakpoint
ALTER TABLE `reader_submissions` ADD `publishedAt` timestamp;