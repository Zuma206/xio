import {
  eq,
  exists,
  InferInsertModel,
  and,
  sql,
  or,
  getTableColumns,
} from "drizzle-orm";
import { db, Transaction } from "../database/connection";
import { channels, userInChannel, users } from "../database/schema";
import { first, generateId } from "./utils";
import { union } from "drizzle-orm/sqlite-core";

export function getChannels(userId: string, tx: Transaction = db) {
  return tx
    .selectDistinct({ ...getTableColumns(channels) })
    .from(channels)
    .leftJoin(userInChannel, eq(userInChannel.channelId, channels.id))
    .where(or(eq(channels.ownerId, userId), eq(userInChannel.userId, userId)));
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

export async function isInChannel(
  userId: string,
  channelId: string,
  tx: Transaction = db
) {
  return Boolean(
    await first(
      tx
        .select({ exists: sql`1` })
        .from(users)
        .where(
          and(
            eq(users.id, userId),
            exists(
              union(
                tx
                  .select({ exists: sql`1` })
                  .from(channels)
                  .where(
                    and(
                      eq(channels.ownerId, userId),
                      eq(channels.id, channelId)
                    )
                  ),
                tx
                  .select({ exists: sql`1` })
                  .from(userInChannel)
                  .where(
                    and(
                      eq(userInChannel.userId, userId),
                      eq(userInChannel.channelId, channelId)
                    )
                  )
              )
            )
          )
        )
    )
  );
}
