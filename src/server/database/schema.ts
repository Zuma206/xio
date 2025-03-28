import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  gid: text().primaryKey(),
  name: text().notNull(),
  dev: integer().notNull().default(0),
  pfp: integer().notNull(),
});
