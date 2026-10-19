ALTER TABLE `voter_profiles` ADD COLUMN `nickname` text COLLATE NOCASE;
--> statement-breakpoint
CREATE UNIQUE INDEX `voter_profiles_nickname_unique` ON `voter_profiles` (`nickname`);
--> statement-breakpoint
UPDATE `voter_profiles`
SET `nickname` = (
  SELECT `nickname`
  FROM `pool_players`
  WHERE `pool_players`.`voter_uid` = `voter_profiles`.`uid`
);
--> statement-breakpoint
ALTER TABLE `pool_players` RENAME TO `pool_players_old`;
--> statement-breakpoint
CREATE TABLE `pool_players` (
  `voter_uid` text PRIMARY KEY NOT NULL,
  `created_at` text NOT NULL DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
INSERT INTO `pool_players` (`voter_uid`, `created_at`)
SELECT `voter_uid`, `created_at` FROM `pool_players_old`;
--> statement-breakpoint
DROP TABLE `pool_players_old`;
