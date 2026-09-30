import { pgTable, text, timestamp, varchar, integer, jsonb } from 'drizzle-orm/pg-core';

export const favoriteTeams = pgTable('favorite_teams', {
  id: varchar('id', { length: 64 }).primaryKey(),
  teamId: varchar('team_id', { length: 64 }).notNull(),
  teamName: varchar('team_name', { length: 255 }).notNull(),
  teamLogo: text('team_logo'),
  leagueId: varchar('league_id', { length: 64 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const favoriteLeagues = pgTable('favorite_leagues', {
  id: varchar('id', { length: 64 }).primaryKey(),
  leagueId: varchar('league_id', { length: 64 }).notNull(),
  leagueName: varchar('league_name', { length: 255 }).notNull(),
  leagueLogo: text('league_logo'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const favoriteMatches = pgTable('favorite_matches', {
  id: varchar('id', { length: 64 }).primaryKey(),
  matchId: varchar('match_id', { length: 64 }).notNull(),
  homeTeam: varchar('home_team', { length: 255 }).notNull(),
  awayTeam: varchar('away_team', { length: 255 }).notNull(),
  matchDate: varchar('match_date', { length: 64 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const apiCache = pgTable('api_cache', {
  cacheKey: varchar('cache_key', { length: 255 }).primaryKey(),
  cacheData: jsonb('cache_data').notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const newsletterSubscribers = pgTable('newsletter_subscribers', {
  id: varchar('id', { length: 64 }).primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
