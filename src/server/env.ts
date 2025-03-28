import { z } from "zod";

export const env = z
  .object({
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
    APP_ROOT_URL: z.string(),
  })
  .parse(process.env);
