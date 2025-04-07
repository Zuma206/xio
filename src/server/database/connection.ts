import { drizzle } from "drizzle-orm/better-sqlite3";
import { env } from "../env";

export const db = drizzle(env.APP_DB_URL);
type Database = typeof db;
export type Transaction =
  | Database
  | Parameters<Parameters<Database["transaction"]>[0]>[0];
