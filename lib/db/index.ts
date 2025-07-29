import { config } from "dotenv";
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

config({ path: ".env" }); // or .env.local

// Default to local database if no DATABASE_URL is provided
const databaseUrl = process.env.DATABASE_URL!

// Create postgres client
const client = postgres(databaseUrl);

export const db = drizzle(client, { schema });
