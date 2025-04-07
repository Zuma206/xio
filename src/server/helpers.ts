import { redirect } from "react-router";
import { idCookie } from "./cookies";
import { getUserById } from "./repository/users";

export async function requireAuth(request: Request) {
  const { data: id, success: idExists } = await idCookie.safeParse(request);
  const user = idExists ? await getUserById(id) : null;
  if (!user) throw redirect("/account-setup");
  return user;
}
