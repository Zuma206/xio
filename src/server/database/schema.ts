import { InferSelectModel } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  gid: text().primaryKey(),
  picture: text().notNull(),
});

export const activatedUsers = sqliteTable("activated_users", {
  id: integer().primaryKey({ autoIncrement: true }),
  name: text().notNull().unique(),
  gid: text()
    .references(() => users.gid, { onDelete: "cascade", onUpdate: "cascade" })
    .unique(),
});

export const channels = sqliteTable("channels", {
  id: integer().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  owner: integer()
    .references(() => activatedUsers.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    })
    .notNull(),
});

export type Message = InferSelectModel<typeof messages>;
export const messages = sqliteTable("messages", {
  id: integer().primaryKey({ autoIncrement: true }),
  author: integer()
    .references(() => activatedUsers.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    })
    .notNull(),
  content: text().notNull(),
  date: integer().notNull(),
  channel: integer()
    .references(() => channels.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    })
    .notNull(),
});
