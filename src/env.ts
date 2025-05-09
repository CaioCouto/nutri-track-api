import dotnev from 'dotenv';
import { z } from "zod";

dotnev.config();

const envSchema = z.object({
  API_PORT: z.number().default(3333),
  SUPABASE_URL: z.string(),
  SUPABASE_ANON_KEY: z.string(),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  REDIS_URL: z.string(),
});

export const env = envSchema.parse(process.env);