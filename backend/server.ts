import { createApp } from "./app.js";
import { PORT } from "./config.js";
import { pool } from "./db.js";

try {
  await pool.query("SELECT id FROM tasks LIMIT 0");
  const server = createApp().listen(PORT, () => {
    const address = server.address();
    const port = address && typeof address === "object" ? address.port : PORT;
    console.log(`StudyTrack backend berjalan di http://localhost:${port}`);
  });
  let stopping = false;
  const shutdown = () => {
    if (stopping) return;
    stopping = true;
    server.close(() => { void pool.end().then(() => process.exit(0)); });
    setTimeout(() => process.exit(1), 10000).unref();
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
  server.on("error", (error) => {
    console.error("Server gagal dimulai:", error.message);
    void pool.end().then(() => { process.exitCode = 1; });
  });
} catch (error) {
  console.error("PostgreSQL belum siap. Periksa DATABASE_URL dan jalankan npm run db:migrate.");
  console.error(error instanceof Error ? error.message : error);
  await pool.end();
  process.exitCode = 1;
}
