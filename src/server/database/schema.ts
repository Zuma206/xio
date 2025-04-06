import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text().primaryKey(),
  name: text().notNull().unique(),
  picture: text().notNull(),
});

export const channels = sqliteTable("channels", {
  id: text().primaryKey(),
  name: text().notNull(),
  ownerId: text()
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
});

export const messages = sqliteTable("messages", {
  id: text().primaryKey(),
  content: text().notNull(),
  date: integer().notNull(),
  channelId: text()
    .notNull()
    .references(() => channels.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  authorId: text()
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
});
