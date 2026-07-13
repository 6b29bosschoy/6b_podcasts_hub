ALTER TABLE `host_applications` ADD `availableTimeSlots` varchar(2000) DEFAULT '[]' NOT NULL;--> statement-breakpoint
ALTER TABLE `host_applications` ADD `hostPhotos` varchar(5000) DEFAULT '[]' NOT NULL;--> statement-breakpoint
ALTER TABLE `host_applications` ADD `acceptCommercial` boolean DEFAULT false NOT NULL;