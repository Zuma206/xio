import { customAlphabet } from "nanoid";

export async function first<T>(arrayPromise: Promise<T[]>) {
  const array = await arrayPromise;
  return array.length > 0 ? array[0] : null;
}

export const generateId = customAlphabet(
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  13
);
