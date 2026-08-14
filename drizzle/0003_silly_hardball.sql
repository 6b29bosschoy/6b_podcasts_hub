ALTER TABLE `bookings` MODIFY COLUMN `email` varchar(320);--> statement-breakpoint
ALTER TABLE `bookings` ADD `preferredContactMethod` enum('whatsapp','phone') DEFAULT 'whatsapp' NOT NULL;--> statement-breakpoint
ALTER TABLE `bookings` ADD `privacyConsent` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `contacts` ADD `company` varchar(255);--> statement-breakpoint
ALTER TABLE `contacts` ADD `privacyConsent` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `reader_submissions` ADD `privacyConsent` boolean DEFAULT false NOT NULL;