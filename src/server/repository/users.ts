import { eq, InferInsertModel } from "drizzle-orm";
import { db } from "../database/connection";
import { users } from "../database/schema";
import { first } from "./utils";

export function getUserById(id: string) {
  return first(db.select().from(users).where(eq(users.id, id)));
}

export async function insertUser(user: InferInsertModel<typeof users>) {
  await db.insert(users).values(user);
}
