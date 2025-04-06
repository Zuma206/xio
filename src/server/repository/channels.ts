import { eq } from "drizzle-orm";
import { db } from "../database/connection";
import { activatedUsers, channels, messages, users } from "../database/schema";

export function createChannel(userId: number, name: string) {
  return db.transaction(async (tx) => {
    const existingChannels = await tx
      .select({ id: channels.id })
      .from(channels)
      .where(eq(channels.ownerId, userId));
    if (existingChannels.length >= 3) return false;
    await tx.insert(channels).values({ name, owner: userId });
    return true;
  });
}

export function getChannels(id: number) {
  return db.select().from(channels).where(eq(channels.ownerId, id));
}

export function getMessages(channelId: number) {
  return db
    .select({
      id: messages.id,
      name: activatedUsers.name,
      picture: users.picture,
      content: messages.content,
      date: messages.date,
    })
    .from(messages)
    .innerJoin(activatedUsers, eq(messages.authorId, activatedUsers.id))
    .innerJoin(users, eq(activatedUsers.gid, users.id))
    .where(eq(messages.channelId, channelId))
    .orderBy(messages.date);
}

export async function createMessage(
  userId: number,
  channelId: number,
  content: string
) {
  await db.insert(messages).values({
    channel: channelId,
    date: Date.now(),
    author: userId,
    content,
  });
}
