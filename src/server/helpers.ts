import { redirect } from "react-router";
import { gidCookie } from "./cookies";
import { getUserByGid, getUserName } from "./repository/users";

export async function requireActivatedUser(request: Request) {
  const gid = await gidCookie.safeParse(request);
  const user = gid.success ? await getUserByGid(gid.data) : null;
  if (!user) throw redirect("/account-setup");
  return user;
}
