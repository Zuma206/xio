import { InferSelectModel } from "drizzle-orm";
import {
  integer,
  primaryKey,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";

export type User = InferSelectModel<typeof users>;
export const users = sqliteTable("users", {
  id: text().primaryKey(),
  name: text().notNull().unique(),
  picture: text().notNull(),
});

export type Channel = InferSelectModel<typeof channels>;
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

export type Message = InferSelectModel<typeof messages>;
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

export type UserInChannel = InferSelectModel<typeof userInChannel>;
export const userInChannel = sqliteTable(
  "user_in_channel",
  {
    userId: text()
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    channelId: text()
      .notNull()
      .references(() => channels.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
  },
  (userInChannel) => [
    primaryKey({ columns: [userInChannel.userId, userInChannel.channelId] }),
  ]
);
