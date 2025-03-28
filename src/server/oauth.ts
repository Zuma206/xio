import { randomBytes } from "node:crypto";
import { z } from "zod";
import { env } from "./env";

export type State = z.infer<typeof stateSchema>;
export const stateSchema = z.object({
  key: z.string(),
  value: z.string(),
});

const redirectUri = env.APP_ROOT_URL + "api/callback";

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
        ["redirect_uri", redirectUri],
        ["response_type", "code"],
        ["scope", "openid"],
        ["state", JSON.stringify(state)],
      ]),
    state,
  };
}

type OAuthCallback = {
  expectedState: string;
  providedState: string;
  code: string;
};

function getUnverifiedJWTPayload(jwt: string) {
  const [, unverifiedBase64Payload] = jwt.split(".");
  const unverifiedPayload = Buffer.from(
    unverifiedBase64Payload,
    "base64"
  ).toString();
  return JSON.parse(unverifiedPayload);
}

const jwtSchema = z.object({
  sub: z.string(),
});

export async function getGoogleIDFromCallback(opts: OAuthCallback) {
  if (opts.expectedState !== opts.providedState)
    throw new Error("State Mismatch");
  const token = await getTokenFromCode(opts.code);
  const { sub } = jwtSchema.parse(getUnverifiedJWTPayload(token.id_token));
  return sub;
}

const tokenSchema = z.object({
  id_token: z.string(),
});

async function getTokenFromCode(code: string) {
  const resp = await fetch("https://oauth2.googleapis.com/token", {
    body: new URLSearchParams([
      ["client_id", env.GOOGLE_CLIENT_ID],
      ["client_secret", env.GOOGLE_CLIENT_SECRET],
      ["code", code],
      ["grant_type", "authorization_code"],
      ["redirect_uri", redirectUri],
    ]),
    method: "post",
  });
  return tokenSchema.parse(await resp.json());
}
