import bcrypt from "bcryptjs";
import { pool } from "../db.js";

// Seed opt-in dan idempotent; tidak menghapus/mengganti data pengguna yang ada.
const client = await pool.connect();
try {
  if (process.env.NODE_ENV === "production") throw new Error("Seed demo hanya untuk development/test.");
  await client.query("BEGIN");
  const { rows } = await client.query<{ id: number }>(
    `INSERT INTO users (nama, email, password_hash) VALUES ($1, $2, $3)
     ON CONFLICT (email) DO NOTHING RETURNING id`,
    ["Demo Mahasiswa", "demo@studytrack.test", await bcrypt.hash("demo1234", 10)],
  );
  if (!rows[0]) {
    console.log("Akun demo sudah ada; seed dilewati tanpa mengubah data.");
  } else {
    const userId = rows[0].id;
    const courses = [
      ["Database Systems", "CS 186", "Dr. Andi Wijaya"],
      ["Data Structures", "CS 61B", "Dr. Sari Lestari"],
      ["Software Engineering", "CS 169", "Dr. Budi Santoso"],
    ];
    const tasks = [
      ["Lab 4: Query Optimization Report", "Laporan hasil eksperimen optimasi query beserta analisis query plan.", "2026-07-03T23:59:00+07:00", "2026-06-15T09:00:00+07:00"],
      ["Project 3: BSTMap Implementation", "Implementasi BSTMap beserta pengujian dasarnya.", "2026-07-02T10:00:00+07:00", "2026-06-16T14:00:00+07:00"],
      ["Sprint 2: Backend API Integration", "Integrasi endpoint backend ke frontend untuk sprint 2.", "2026-07-06T23:59:00+07:00", "2026-06-17T11:00:00+07:00"],
    ];
    for (let i = 0; i < courses.length; i++) {
      const course = await client.query<{ id: number }>(
        "INSERT INTO courses (user_id, name, kode, dosen) VALUES ($1, $2, $3, $4) RETURNING id", [userId, ...courses[i]],
      );
      await client.query(
        `INSERT INTO tasks (user_id, mata_kuliah_id, judul, deskripsi, deadline, created_at)
         VALUES ($1, $2, $3, $4, $5, $6)`, [userId, course.rows[0].id, ...tasks[i]],
      );
    }
    console.log("Seed selesai: demo@studytrack.test / demo1234 (3 mata kuliah, 3 tugas).");
  }
  await client.query("COMMIT");
} catch (error) {
  await client.query("ROLLBACK");
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
} finally {
  client.release();
  await pool.end();
}
