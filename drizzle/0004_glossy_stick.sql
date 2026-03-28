CREATE TABLE `reader_submissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nickname` varchar(50) NOT NULL,
	`category` enum('relationship','fengshui','confession','question','other') NOT NULL DEFAULT 'other',
	`content` text NOT NULL,
	`isAnonymous` boolean NOT NULL DEFAULT false,
	`status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
	`likes` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `reader_submissions_id` PRIMARY KEY(`id`)
);
