import { drizzle } from "drizzle-orm/better-sqlite3";
import { env } from "../env";

const db = drizzle(env.APP_DB_URL);
