import { readdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { pool } from "../db.js";

export async function migrate(): Promise<void> {
  const folder = new URL(import.meta.url.includes("/dist/") ? "../../migrations/" : "../migrations/", import.meta.url);
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query("SELECT pg_advisory_xact_lock(11002026)");
    await client.query(`CREATE TABLE IF NOT EXISTS schema_migrations (
      version TEXT PRIMARY KEY, applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )`);
    const applied = await client.query<{ version: string }>("SELECT version FROM schema_migrations");
    const known = new Set(applied.rows.map((row) => row.version));
    for (const file of (await readdir(folder)).filter((name) => /^\d+.*\.sql$/.test(name)).sort()) {
      if (known.has(file)) continue;
      await client.query(await readFile(new URL(file, folder), "utf8"));
      await client.query("INSERT INTO schema_migrations (version) VALUES ($1)", [file]);
      console.log(`Migrasi diterapkan: ${file}`);
    }
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  try { await migrate(); }
  catch (error) { console.error(error instanceof Error ? error.message : error); process.exitCode = 1; }
  finally { await pool.end(); }
}
