import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from "@shared/schema";

// Database connection for Supabase
let db: any = null;

if (process.env.DATABASE_URL) {
  // Create the connection to Supabase PostgreSQL
  const client = postgres(process.env.DATABASE_URL, { 
    prepare: false,
    ssl: 'require', // Supabase requires SSL
    max: 20, // Maximum number of connections
    idle_timeout: 30, // Idle timeout in seconds
    connect_timeout: 10 // Connection timeout in seconds
  });
  db = drizzle(client, { schema });
  console.log("✅ Connected to Supabase database");
} else {
  console.log("⚠️ DATABASE_URL not set, using in-memory storage for development");
}

export { db };
