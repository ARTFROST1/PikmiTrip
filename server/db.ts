import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from "@shared/schema";

// Database connection for Supabase
let db: any = null;

// Use provided Supabase URL or environment variable
const supabaseUrl = process.env.DATABASE_URL;

if (supabaseUrl && supabaseUrl.includes('supabase.co')) {
  try {
    // Create the connection to Supabase PostgreSQL
    const client = postgres(supabaseUrl, { 
      prepare: false,
      ssl: 'require', // Supabase requires SSL
      max: 20, // Maximum number of connections
      idle_timeout: 30, // Idle timeout in seconds
      connect_timeout: 10 // Connection timeout in seconds
    });
    db = drizzle(client, { schema });
    console.log("✅ Connected to Supabase database");
  } catch (error) {
    console.error("❌ Failed to connect to Supabase:", error);
    console.log("⚠️ Falling back to in-memory storage for development");
    db = null;
  }
} else {
  console.log("⚠️ DATABASE_URL not properly configured, using in-memory storage for development");
  db = null;
}

export { db };
