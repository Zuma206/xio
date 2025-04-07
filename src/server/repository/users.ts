import { eq, InferInsertModel } from "drizzle-orm";
import { db, Transaction } from "../database/connection";
import { users } from "../database/schema";
import { first } from "./utils";

export function getUserById(id: string, tx: Transaction = db) {
  return first(tx.select().from(users).where(eq(users.id, id)));
}

export async function insertUser(user: InferInsertModel<typeof users>) {
  await db.insert(users).values(user);
}
