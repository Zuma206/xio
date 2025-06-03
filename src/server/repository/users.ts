import { eq, getTableColumns, InferInsertModel } from "drizzle-orm";
import { db, Transaction } from "../database/connection";
import { channels, userInChannel, users } from "../database/schema";
import { first } from "./utils";
import { union } from "drizzle-orm/sqlite-core";

export function getUserById(id: string, tx: Transaction = db) {
  return first(tx.select().from(users).where(eq(users.id, id)));
}

export async function insertUser(user: InferInsertModel<typeof users>) {
  await db.insert(users).values(user);
}

export async function getUsersInChannel(
  channelId: string,
  tx: Transaction = db
) {
  return union(
    tx
      .select({ ...getTableColumns(users) })
      .from(userInChannel)
      .innerJoin(users, eq(userInChannel.channelId, channelId))
      .where(eq(userInChannel.channelId, channelId)),
    tx
      .select()
      .from(users)
      .where(
        eq(
          users.id,
          tx
            .select({ ownerId: channels.ownerId })
            .from(channels)
            .where(eq(channels.id, channelId))
        )
      )
  );
}
