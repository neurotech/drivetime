import Database from "better-sqlite3";
import { existsSync, readFileSync } from "fs";
import { join } from "path";

const dbPath = process.env.DATABASE_PATH || "drivetime.db";
const migrationsDir = join(process.cwd(), "src/db/migrations");

console.log(`Running migrations on ${dbPath}...`);

const db = new Database(dbPath);

// Create migrations tracking table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS __drizzle_migrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    hash TEXT NOT NULL,
    created_at INTEGER NOT NULL
  )
`);

// Read the journal to get migration order
const journalPath = join(migrationsDir, "meta/_journal.json");
if (!existsSync(journalPath)) {
  console.log("No migrations journal found, skipping migrations.");
  process.exit(0);
}

const journal = JSON.parse(readFileSync(journalPath, "utf-8"));
const appliedMigrations = new Set(
  db
    .prepare("SELECT hash FROM __drizzle_migrations")
    .all()
    .map((r) => r.hash),
);

let applied = 0;
for (const entry of journal.entries) {
  const hash = entry.tag;

  if (appliedMigrations.has(hash)) {
    continue;
  }

  const sqlPath = join(migrationsDir, `${hash}.sql`);
  if (!existsSync(sqlPath)) {
    console.error(`Migration file not found: ${sqlPath}`);
    process.exit(1);
  }

  const sql = readFileSync(sqlPath, "utf-8");
  console.log(`Applying migration: ${hash}`);

  db.exec(sql);
  db.prepare(
    "INSERT INTO __drizzle_migrations (hash, created_at) VALUES (?, ?)",
  ).run(hash, Date.now());
  applied++;
}

db.close();

if (applied === 0) {
  console.log("No new migrations to apply.");
} else {
  console.log(`Applied ${applied} migration(s).`);
}
