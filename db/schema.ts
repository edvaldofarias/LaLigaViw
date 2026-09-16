import {sqliteTable,text,primaryKey} from 'drizzle-orm/sqlite-core';
export const visitors=sqliteTable('visitors',{id:text('id').primaryKey(),firstDay:text('first_day').notNull()});
export const dailyVisitors=sqliteTable('daily_visitors',{day:text('day').notNull(),visitorId:text('visitor_id').notNull()},t=>[primaryKey({columns:[t.day,t.visitorId]})]);
