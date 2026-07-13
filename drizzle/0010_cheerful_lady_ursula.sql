CREATE TABLE `comments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`postSlug` varchar(255) NOT NULL,
	`authorName` varchar(100) NOT NULL,
	`content` text NOT NULL,
	`approved` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `comments_id` PRIMARY KEY(`id`)
);
