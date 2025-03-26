import { CookieOptions, createCookie } from "react-router";
import { z } from "zod";

function createTypedCookie<T>(
  name: string,
  schema: z.Schema<T>,
  cookieOptions?: CookieOptions
) {
  const cookie = createCookie(name, cookieOptions);
  return {
    parse(request: Request) {
      return schema.parse(cookie.parse(request.headers.get("Cookie")));
    },
    serialize(value: T) {
      return cookie.serialize(value);
    },
  };
}

export const stateCookie = (key: string) =>
  createTypedCookie(`xio-state-${key}`, z.string());
