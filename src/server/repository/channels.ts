import { eq } from "drizzle-orm";
import { db } from "../database/connection";
import { activatedUsers, channels, messages } from "../database/schema";

export function createChannel(userId: number, name: string) {
  return db.transaction(async (tx) => {
    const existingChannels = await tx
      .select({ id: channels.id })
      .from(channels)
      .where(eq(channels.owner, userId));
    if (existingChannels.length >= 3) return false;
    await tx.insert(channels).values({ name, owner: userId });
    return true;
  });
}

export function getChannels(id: number) {
  return db.select().from(channels).where(eq(channels.owner, id));
}

export function getMessages(channelId: number) {
  return db
    .select()
    .from(messages)
    .where(eq(messages.channel, channelId))
    .orderBy(messages.date);
}
