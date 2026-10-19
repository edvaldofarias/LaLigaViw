DROP INDEX IF EXISTS `voter_profiles_nickname_unique`;
--> statement-breakpoint
UPDATE `voter_profiles`
SET `nickname` = `display_name`
WHERE `nickname` IS NULL OR TRIM(`nickname`) = '';
