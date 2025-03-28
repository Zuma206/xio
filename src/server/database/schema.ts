import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  gid: text().primaryKey(),
  picture: text().notNull(),
});

export const activatedUsers = sqliteTable("activated_users", {
  id: integer().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  gid: text().references(() => users.gid),
});
