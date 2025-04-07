import { eq, InferInsertModel } from "drizzle-orm";
import { db } from "../database/connection";
import { messages, users } from "../database/schema";
import { generateId } from "./utils";

export function getMessages(channelId: string) {
  return db
    .select()
    .from(messages)
    .innerJoin(users, eq(users.id, messages.authorId))
    .where(eq(messages.channelId, channelId));
}

type InsertMessageOptions = {
  channelId: string;
  authorId: string;
  content: string;
};

export async function insertMessage(message: InsertMessageOptions) {
  await db
    .insert(messages)
    .values({ ...message, id: generateId(), date: Date.now() });
}
