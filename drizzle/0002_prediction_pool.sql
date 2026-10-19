CREATE TABLE `pool_players` (
  `voter_hash` text PRIMARY KEY NOT NULL,
  `nickname` text NOT NULL COLLATE NOCASE UNIQUE,
  `created_at` text NOT NULL DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `pool_predictions` (
  `voter_hash` text NOT NULL,
  `round_id` text NOT NULL,
  `match_id` text NOT NULL,
  `home_score` integer NOT NULL CHECK (`home_score` BETWEEN 0 AND 99),
  `away_score` integer NOT NULL CHECK (`away_score` BETWEEN 0 AND 99),
  `updated_at` text NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY(`voter_hash`, `round_id`, `match_id`)
);
--> statement-breakpoint
CREATE INDEX `pool_predictions_round` ON `pool_predictions` (`round_id`);
