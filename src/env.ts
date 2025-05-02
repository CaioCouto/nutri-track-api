import dotnev from 'dotenv';
import { z } from "zod";

dotnev.config();

const envSchema = z.object({
  SUPABASE_URL: z.string(),
  SUPABASE_ANON_KEY: z.string(),
});

export const env = envSchema.parse(process.env);