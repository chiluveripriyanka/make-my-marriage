import "server-only";

import { z } from "zod";

const envSchema = z.object({
  MONGODB_URI: z.string().min(1),
  SESSION_COOKIE_NAME: z.string().min(1).default("mmm_session"),
  SESSION_TTL_DAYS: z.coerce.number().int().positive().default(30),
});

export const env = envSchema.parse({
  MONGODB_URI: process.env.MONGODB_URI,
  SESSION_COOKIE_NAME: process.env.SESSION_COOKIE_NAME,
  SESSION_TTL_DAYS: process.env.SESSION_TTL_DAYS,
});
