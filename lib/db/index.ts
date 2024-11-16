import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "process";

const databaseUrl = env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL environment variable is not defined.");
}

const client = postgres(databaseUrl);
export const db = drizzle(client);
