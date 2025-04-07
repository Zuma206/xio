import { eq, InferInsertModel } from "drizzle-orm";
import { db } from "../database/connection";
import { channels } from "../database/schema";
import { generateId } from "./utils";
import { SQLiteTransaction } from "drizzle-orm/sqlite-core";

export function getChannels(userId: string) {
  return db.select().from(channels).where(eq(channels.ownerId, userId));
}

export function insertChannel(
  channel: Omit<InferInsertModel<typeof channels>, "id">
) {
  return db.transaction(async (tx) => {
    const ownedChannels = await tx
      .select()
      .from(channels)
      .where(eq(channels.ownerId, channel.ownerId));
    if (ownedChannels.length >= 3) return false;

    await db.insert(channels).values({ ...channel, id: generateId() });
    return true;
  });
}
