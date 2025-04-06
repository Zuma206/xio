import { redirect } from "react-router";
import { idCookie } from "./cookies";
import { getUserByGid, getUserName } from "./repository/users";

export async function requireActivatedUser(request: Request) {
  const gid = await idCookie.safeParse(request);
  const user = gid.success ? await getUserByGid(gid.data) : null;
  if (!user) throw redirect("/account-setup");
  return user;
}
