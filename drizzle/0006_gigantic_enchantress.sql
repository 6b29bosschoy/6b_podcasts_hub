ALTER TABLE `reader_submissions` MODIFY COLUMN `images` varchar(5000) NOT NULL DEFAULT '[]';--> statement-breakpoint
ALTER TABLE `blog_posts` ADD `images` varchar(5000) DEFAULT '[]' NOT NULL;--> statement-breakpoint
ALTER TABLE `blog_posts` ADD `links` varchar(2000) DEFAULT '[]' NOT NULL;