import { CookieOptions, createCookie } from "react-router";
import { z } from "zod";
import { env } from "./env";

function createTypedCookie<T>(
  name: string,
  schema: z.Schema<T>,
  cookieOptions?: CookieOptions
) {
  const cookie = createCookie(name, cookieOptions);
  return {
    async parse(request: Request) {
      return schema.parse(await cookie.parse(request.headers.get("Cookie")));
    },
    serialize(value: T) {
      return cookie.serialize(value);
    },
    async safeParse(request: Request) {
      return schema.safeParse(
        await cookie.parse(request.headers.get("Cookie"))
      );
    },
  };
}

export const stateCookie = (key: string) =>
  createTypedCookie(`xio-state-${key}`, z.string(), {
    httpOnly: true,
  });

export const gidCookie = createTypedCookie("xio-cookie", z.string(), {
  httpOnly: true,
  secrets: [env.APP_SECRET],
});
