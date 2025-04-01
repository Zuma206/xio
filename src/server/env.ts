import { z } from "zod";

export const env = z
  .object({
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
    APP_ROOT_URL: z.string(),
    APP_SECRET: z.string(),
    APP_DB_URL: z.string(),
    SOCKTOPUS_ROOT_URL: z.string(),
    SOCKTOPUS_SECRET: z.string(),
    SOCKTOPUS_NAME: z.string(),
  })
  .parse(process.env);
