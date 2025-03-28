import { defineConfig } from "drizzle-kit";
import { env } from "./src/server/env";

export default defineConfig({
  schema: "src/server/database/schema.ts",
  dialect: "sqlite",
  dbCredentials: {
    url: env.APP_DB_URL,
  },
});
