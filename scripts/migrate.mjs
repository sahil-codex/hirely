import dns from "node:dns";
dns.setDefaultResultOrder("ipv4first");

import dotenv from "dotenv";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/neon-http/migrator";
import { readMigrationFiles } from "drizzle-orm/migrator";
import { join } from "node:path";

dotenv.config({ path: ".env.local" });

const databaseUrl = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("Missing DATABASE_URL in .env.local");
  process.exit(1);
}

const sql = neon(databaseUrl);
const db = drizzle(sql);
const migrationsFolder = join(process.cwd(), "drizzle");
const mode = process.argv[2] ?? "migrate";

async function ensureMigrationsTable() {
  await sql`CREATE SCHEMA IF NOT EXISTS drizzle`;
  await sql`
    CREATE TABLE IF NOT EXISTS drizzle.__drizzle_migrations (
      id SERIAL PRIMARY KEY,
      hash text NOT NULL,
      created_at bigint
    )
  `;
}

async function baseline() {
  await ensureMigrationsTable();
  const migrations = readMigrationFiles({ migrationsFolder });
  const existing = await sql`SELECT hash FROM drizzle.__drizzle_migrations`;
  const existingHashes = new Set(existing.map((r) => r.hash));

  for (const migration of migrations) {
    if (existingHashes.has(migration.hash)) continue;
    await sql`
      INSERT INTO drizzle.__drizzle_migrations (hash, created_at)
      VALUES (${migration.hash}, ${migration.folderMillis})
    `;
  }
}

try {
  if (mode === "baseline") {
    await baseline();
  } else {
    await migrate(db, { migrationsFolder });
  }
} catch (err) {
  console.error(err.message ?? err);
  process.exit(1);
}
