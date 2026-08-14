CREATE TABLE `mystic_memberships` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`plan` varchar(32) NOT NULL DEFAULT 'unknown',
	`status` varchar(32) NOT NULL,
	`stripeSubscriptionId` varchar(255) NOT NULL,
	`stripeCustomerId` varchar(255),
	`currentPeriodEnd` timestamp,
	`cancelAtPeriodEnd` boolean NOT NULL DEFAULT false,
	`lastStripeEventId` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `mystic_memberships_id` PRIMARY KEY(`id`),
	CONSTRAINT `mystic_memberships_stripeSubscriptionId_unique` UNIQUE(`stripeSubscriptionId`)
);
--> statement-breakpoint
CREATE TABLE `stripe_webhook_events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`stripeEventId` varchar(255) NOT NULL,
	`eventType` varchar(120) NOT NULL,
	`stripeSubscriptionId` varchar(255),
	`receivedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `stripe_webhook_events_id` PRIMARY KEY(`id`),
	CONSTRAINT `stripe_webhook_events_stripeEventId_unique` UNIQUE(`stripeEventId`)
);
