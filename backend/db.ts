import pg from "pg";
import { DATABASE_URL } from "./config.js";

// TIMESTAMPTZ selalu keluar sebagai ISO UTC, konsisten untuk semua endpoint.
pg.types.setTypeParser(1184, (value: string) => new Date(value).toISOString());

export const pool = new pg.Pool({
  connectionString: DATABASE_URL,
  max: 10,
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 30000,
});

pool.on("error", (error) => {
  console.error("Koneksi PostgreSQL idle terputus:", error.message);
});
