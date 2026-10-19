DELETE FROM `player_ratings`;
--> statement-breakpoint
DELETE FROM `vote_ballots`;
--> statement-breakpoint
DELETE FROM `pool_predictions`;
--> statement-breakpoint
DELETE FROM `pool_players`;
--> statement-breakpoint
ALTER TABLE `vote_ballots` RENAME COLUMN `voter_hash` TO `voter_uid`;
--> statement-breakpoint
ALTER TABLE `player_ratings` RENAME COLUMN `voter_hash` TO `voter_uid`;
--> statement-breakpoint
ALTER TABLE `pool_players` RENAME COLUMN `voter_hash` TO `voter_uid`;
--> statement-breakpoint
ALTER TABLE `pool_predictions` RENAME COLUMN `voter_hash` TO `voter_uid`;
--> statement-breakpoint
CREATE TABLE `voter_profiles` (
  `uid` text PRIMARY KEY NOT NULL,
  `email` text NOT NULL,
  `display_name` text NOT NULL,
  `updated_at` text NOT NULL DEFAULT CURRENT_TIMESTAMP
);
