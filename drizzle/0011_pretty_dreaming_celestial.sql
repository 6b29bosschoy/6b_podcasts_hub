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
	`privacyConsent` boolean NOT NULL DEFAULT false,
	`status` enum('pending','contacted','rejected','archived') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `host_applications_id` PRIMARY KEY(`id`)
);
