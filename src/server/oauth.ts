import { randomBytes } from "node:crypto";
import { z } from "zod";
import { env } from "./env";

export type State = z.infer<typeof stateSchema>;
export const stateSchema = z.object({
  key: z.string(),
  value: z.string(),
});

export function createSigninFlow() {
  const state: State = {
    key: randomBytes(16).toString("base64url"),
    value: randomBytes(32).toString("base64url"),
  };
  return {
    url:
      "https://accounts.google.com/o/oauth2/v2/auth?" +
      new URLSearchParams([
        ["client_id", env.GOOGLE_CLIENT_ID],
        ["redirect_uri", env.APP_ROOT_URL + "api/callback"],
        ["response_type", "code"],
        ["scope", "openid"],
        ["state", JSON.stringify(state)],
      ]),
    state,
  };
}
