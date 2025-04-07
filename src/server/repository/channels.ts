import { eq, InferInsertModel } from "drizzle-orm";
import { db, Transaction } from "../database/connection";
import { channels } from "../database/schema";
import { first, generateId } from "./utils";
import { getUserById } from "./users";

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

function getChannelById(channelId: string, tx: Transaction = db) {
  return first(tx.select().from(channels).where(eq(channels.id, channelId)));
}

export async function isInChannel(userId: string, channelId: string) {
  const channel = await getChannelById(channelId);
  return channel?.ownerId == userId;
}
