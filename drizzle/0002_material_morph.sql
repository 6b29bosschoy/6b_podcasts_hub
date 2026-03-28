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
