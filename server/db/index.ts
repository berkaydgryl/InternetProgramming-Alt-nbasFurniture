import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import path from "node:path";
import * as schema from "./schema.js";

const isProd = process.env.NODE_ENV === "production";
const client = postgres(process.env.DATABASE_URL!, {
  max: isProd ? 10 : 3,
  idle_timeout: 20,       // close an idle connection after 20s
  connect_timeout: 10,    // throw an error if the connection does not open in 10s
});
export const db = drizzle(client, { schema });

export async function runMigrations() {
  const migrationsFolder = path.join(import.meta.dirname, "migrations");
  await migrate(db, { migrationsFolder });
  console.log("✅ Database migrations applied");
}
