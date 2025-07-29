import { config } from 'dotenv';
import { defineConfig } from "drizzle-kit";

config({ path: '.env' });

// Default to local database if no DATABASE_URL is provided
const databaseUrl = process.env.DATABASE_URL || 'postgresql://epify_user:epify_password@localhost:5432/epify_db';

export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl,
  },
});
