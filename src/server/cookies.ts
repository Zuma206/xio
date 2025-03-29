import {
  CookieOptions,
  CookieSerializeOptions,
  createCookie,
} from "react-router";
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
    serialize(value: T, options?: CookieSerializeOptions) {
      return cookie.serialize(value, options);
    },
    async safeParse(request: Request) {
      return schema.safeParse(
        await cookie.parse(request.headers.get("Cookie"))
      );
    },
  };
}

export const stateCookie = (key: string) =>
  createTypedCookie(`XIO-State-${key}`, z.string(), {
    httpOnly: true,
  });

export const gidCookie = createTypedCookie("XIO-GID", z.string(), {
  httpOnly: true,
  secrets: [env.APP_SECRET],
});
