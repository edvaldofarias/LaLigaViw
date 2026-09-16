CREATE TABLE `daily_visitors` (
	`day` text NOT NULL,
	`visitor_id` text NOT NULL,
	PRIMARY KEY(`day`, `visitor_id`)
);
--> statement-breakpoint
CREATE TABLE `visitors` (
	`id` text PRIMARY KEY NOT NULL,
	`first_day` text NOT NULL
);
