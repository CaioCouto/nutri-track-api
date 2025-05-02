import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { env } from '../../env';
import { Database } from '../../Types/Supabase/database.types';

const SUPABASE_URL = env.SUPABASE_URL;
const SUPABASE_ANON_KEY = env.SUPABASE_ANON_KEY;

export function createSupabaseClient(access_token: string | null = null): SupabaseClient<Database> {
  if(!access_token) {
    return createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  
  return createClient<Database>(
    SUPABASE_URL, 
    SUPABASE_ANON_KEY,
    {
      global: {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      }
    }
  );
}