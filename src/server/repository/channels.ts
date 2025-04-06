import { eq } from "drizzle-orm";
import { db } from "../database/connection";
import { channels } from "../database/schema";

export function getChannels(userId: string) {
  return db.select().from(channels).where(eq(channels.ownerId, userId));
}
