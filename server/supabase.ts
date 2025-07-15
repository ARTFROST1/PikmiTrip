import { createClient } from '@supabase/supabase-js';

// Supabase client for authentication and REST API operations
let supabase: any = null;
let supabaseAdmin: any = null;

if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
  supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );
  console.log("✅ Supabase client initialized");
}

if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
  supabaseAdmin = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );
  console.log("✅ Supabase Admin client initialized");
}

export { supabase, supabaseAdmin };