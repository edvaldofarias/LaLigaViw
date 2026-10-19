CREATE TABLE `vote_ballots` (
  `voter_hash` text NOT NULL,
  `match_id` text NOT NULL,
  `kind` text NOT NULL,
  `favorite_team_id` text,
  `best_player_id` text,
  `worst_player_id` text,
  `created_at` text NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY(`voter_hash`, `match_id`, `kind`)
);
--> statement-breakpoint
CREATE INDEX `vote_ballots_match_kind` ON `vote_ballots` (`match_id`,`kind`);
--> statement-breakpoint
CREATE TABLE `player_ratings` (
  `voter_hash` text NOT NULL,
  `match_id` text NOT NULL,
  `player_id` text NOT NULL,
  `rating` integer NOT NULL CHECK (`rating` BETWEEN 0 AND 10),
  PRIMARY KEY(`voter_hash`, `match_id`, `player_id`)
);
--> statement-breakpoint
CREATE INDEX `player_ratings_match` ON `player_ratings` (`match_id`);
