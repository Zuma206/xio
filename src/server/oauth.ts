import { randomBytes } from "node:crypto";
import { createCookie } from "react-router";
import { z } from "zod";

export const stateSchema = z.object({
  key: z.string(),
  value: z.string(),
});

export function createSigninFlow() {
  const state = {
    key: randomBytes(16).toString("base64url"),
    value: randomBytes(32).toString("base64url"),
  };
  return {
    url:
      "https://accounts.google.com/o/oauth2/v2/auth?" +
      new URLSearchParams([
        ["client_id", ""],
        ["redirect_uri", ""],
        ["response_type", "code"],
        ["scope", ""],
        ["state", JSON.stringify(state)],
      ]),
    state,
  };
}
