import { getProfilePicture, getUserName } from "./repository/users";

export async function getAuthData(gid: string) {
  const [name, picture] = await Promise.all([
    getUserName(gid),
    getProfilePicture(gid),
  ]);
  if (!picture) throw new Error("GID doesn't exist");
  return {
    id: gid,
    picture,
    name,
  };
}
