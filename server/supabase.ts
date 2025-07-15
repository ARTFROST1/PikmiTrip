import { createClient } from '@supabase/supabase-js';

// Supabase client for REST API operations (if needed)
let supabase: any = null;

if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
  supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );
  console.log("✅ Supabase client initialized");
}

export { supabase };