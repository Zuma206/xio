import { eq } from "drizzle-orm";
import { db } from "../database/connection";
import { activatedUsers, users } from "../database/schema";
import { createHash } from "node:crypto";
import { z } from "zod";

export async function createUserIfDoesntExist(id: string, email: string) {
  return db.transaction(async (tx) => {
    const results = await tx
      .select()
      .from(users)
      .where(eq(users.gid, id))
      .limit(1);
    if (results.length > 0) return;
    await tx.insert(users).values({
      picture:
        `https://gravatar.com/avatar/` +
        createHash("sha256").update(email).digest("hex"),
      gid: id,
    });
  });
}

export async function activateUser(gid: string, name: string) {
  await db.insert(activatedUsers).values({ gid, name });
}
