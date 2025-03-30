import { eq } from "drizzle-orm";
import { db } from "../database/connection";
import { channels } from "../database/schema";

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
