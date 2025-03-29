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

export async function getProfilePicture(gid: string) {
  const results = await db
    .select({ picture: users.picture })
    .from(users)
    .where(eq(users.gid, gid));
  if (results.length < 1) return null;
  return results[0].picture;
}

export async function getUserName(gid: string) {
  const results = await db
    .select({ name: activatedUsers.name })
    .from(activatedUsers)
    .where(eq(activatedUsers.gid, gid));
  if (results.length < 1) return null;
  return results[0].name;
}
