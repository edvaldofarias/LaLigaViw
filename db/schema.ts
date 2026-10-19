import {sqliteTable,text,integer,primaryKey,index} from 'drizzle-orm/sqlite-core';
export const visitors=sqliteTable('visitors',{id:text('id').primaryKey(),firstDay:text('first_day').notNull()});
export const dailyVisitors=sqliteTable('daily_visitors',{day:text('day').notNull(),visitorId:text('visitor_id').notNull()},t=>[primaryKey({columns:[t.day,t.visitorId]})]);
export const voterProfiles=sqliteTable('voter_profiles',{
  uid:text('uid').primaryKey(),
  email:text('email').notNull(),
  displayName:text('display_name').notNull(),
  nickname:text('nickname'),
  updatedAt:text('updated_at').notNull().default('CURRENT_TIMESTAMP'),
});
export const voteBallots=sqliteTable('vote_ballots',{
  voterUid:text('voter_uid').notNull(),
  matchId:text('match_id').notNull(),
  kind:text('kind').notNull(),
  favoriteTeamId:text('favorite_team_id'),
  bestPlayerId:text('best_player_id'),
  worstPlayerId:text('worst_player_id'),
  team1BestPlayerId:text('team1_best_player_id'),
  team1WorstPlayerId:text('team1_worst_player_id'),
  team2BestPlayerId:text('team2_best_player_id'),
  team2WorstPlayerId:text('team2_worst_player_id'),
  createdAt:text('created_at').notNull().default('CURRENT_TIMESTAMP'),
},t=>[
  primaryKey({columns:[t.voterUid,t.matchId,t.kind]}),
  index('vote_ballots_match_kind').on(t.matchId,t.kind),
]);
export const playerRatings=sqliteTable('player_ratings',{
  voterUid:text('voter_uid').notNull(),
  matchId:text('match_id').notNull(),
  playerId:text('player_id').notNull(),
  rating:integer('rating').notNull(),
},t=>[
  primaryKey({columns:[t.voterUid,t.matchId,t.playerId]}),
  index('player_ratings_match').on(t.matchId),
]);
export const poolPlayers=sqliteTable('pool_players',{
  voterUid:text('voter_uid').primaryKey(),
  createdAt:text('created_at').notNull().default('CURRENT_TIMESTAMP'),
});
export const poolPredictions=sqliteTable('pool_predictions',{
  voterUid:text('voter_uid').notNull(),
  roundId:text('round_id').notNull(),
  matchId:text('match_id').notNull(),
  homeScore:integer('home_score').notNull(),
  awayScore:integer('away_score').notNull(),
  updatedAt:text('updated_at').notNull().default('CURRENT_TIMESTAMP'),
},t=>[
  primaryKey({columns:[t.voterUid,t.roundId,t.matchId]}),
  index('pool_predictions_round').on(t.roundId),
]);
