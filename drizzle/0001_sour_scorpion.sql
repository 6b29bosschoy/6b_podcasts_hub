ALTER TABLE `reader_submissions` ADD `gender` varchar(20);--> statement-breakpoint
ALTER TABLE `reader_submissions` ADD `ageGroup` varchar(20);--> statement-breakpoint
ALTER TABLE `reader_submissions` ADD `relationshipStatus` varchar(32) DEFAULT 'not_provided' NOT NULL;--> statement-breakpoint
ALTER TABLE `reader_submissions` ADD `topicTags` varchar(1000) DEFAULT '[]' NOT NULL;--> statement-breakpoint
ALTER TABLE `reader_submissions` ADD `problemDuration` varchar(32);--> statement-breakpoint
ALTER TABLE `reader_submissions` ADD `publicPermission` varchar(64) DEFAULT 'not_specified' NOT NULL;--> statement-breakpoint
ALTER TABLE `reader_submissions` ADD `deepInterpretation` varchar(32) DEFAULT 'not_specified' NOT NULL;--> statement-breakpoint
ALTER TABLE `reader_submissions` ADD `contactMethod` varchar(255);