import { after, before, describe, test } from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { once } from "node:events";
import type { Server } from "node:http";
import pg from "pg";

// Wajib URL eksplisit. Setiap run membuat schema baru, lalu menghapus schema itu saja.
const connectionString = process.env.TEST_DATABASE_URL;
if (!connectionString) throw new Error("Set TEST_DATABASE_URL ke PostgreSQL khusus pengujian sebelum menjalankan test:integration.");
const schema = `studytrack_test_${randomUUID().replaceAll("-", "")}`;
const admin = new pg.Pool({ connectionString });
let pool: pg.Pool | undefined;
let server: Server | undefined;
let base = "";
let currentTime = new Date("2026-07-03T12:00:00+07:00");
let token = "";
let otherToken = "";
let userId = 0;
let otherUserId = 0;
let courseId = 0;
let otherCourseId = 0;
let taskId = 0;

async function request(path: string, method = "GET", body?: unknown, auth = token) {
  const response = await fetch(`${base}/api${path}`, {
    method,
    headers: { "Content-Type": "application/json", ...(auth ? { Authorization: `Bearer ${auth}` } : {}) },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  return { status: response.status, body: await response.json(), headers: response.headers };
}

describe("API dengan PostgreSQL sungguhan", { concurrency: false }, () => {
  before(async () => {
    await admin.query(`CREATE SCHEMA "${schema}"`);
    process.env.DATABASE_URL = connectionString;
    process.env.PGOPTIONS = `-c search_path=${schema}`;
    process.env.NODE_ENV = "test";
    ({ pool } = await import("../db.js"));
    const { migrate } = await import("../scripts/migrate.js");
    await migrate();
    await migrate(); // Migrasi kedua harus aman dan tidak membuat ulang tabel.
    const { createApp } = await import("../app.js");
    server = createApp(() => currentTime).listen(0, "127.0.0.1");
    await once(server, "listening");
    const address = server.address();
    assert.ok(address && typeof address === "object");
    base = `http://127.0.0.1:${address.port}`;
  });

  after(async () => {
    if (server?.listening) await new Promise<void>((resolve, reject) => server!.close((error) => error ? reject(error) : resolve()));
    await pool?.end();
    await admin.query(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);
    await admin.end();
  });

  test("health, registrasi, login, profil, hash password dan duplikasi email", async () => {
    assert.equal((await request("/health", "GET", undefined, "")).status, 200);
    const first = await request("/auth/register", "POST", { nama: "Mahasiswa A", email: " TEST@studytrack.test ", password: "secret123" }, "");
    assert.equal(first.status, 201);
    token = first.body.token;
    userId = first.body.user.id;
    assert.equal(first.body.user.email, "test@studytrack.test");
    assert.equal(first.body.user.password_hash, undefined);
    const stored = await pool!.query("SELECT password_hash FROM users WHERE id = $1", [userId]);
    assert.notEqual(stored.rows[0].password_hash, "secret123");
    assert.ok(stored.rows[0].password_hash.startsWith("$2"));
    assert.equal((await request("/auth/register", "POST", { nama: "A", email: "test@studytrack.test", password: "secret123" }, "")).status, 409);
    assert.equal((await request("/auth/login", "POST", { email: "TEST@studytrack.test", password: "secret123" }, "")).status, 200);
    assert.equal((await request("/auth/login", "POST", { email: "test@studytrack.test", password: "wrong123" }, "")).status, 401);
    assert.equal((await request("/auth/me")).body.user.id, userId);
    const second = await request("/auth/register", "POST", { nama: "Mahasiswa B", email: "other@studytrack.test", password: "secret123" }, "");
    assert.equal(second.status, 201);
    otherToken = second.body.token;
    otherUserId = second.body.user.id;
  });

  test("halaman profil: nama tersimpan, password tervalidasi dan hanya akun sendiri yang berubah", async () => {
    assert.equal((await request("/auth/profile", "PATCH", { nama: "Baru" }, "")).status, 401);
    assert.equal((await request("/auth/password", "PATCH", { currentPassword: "secret123", newPassword: "newsecret123" }, "")).status, 401);
    for (const nama of [" ", "A", "A".repeat(101), null]) {
      assert.equal((await request("/auth/profile", "PATCH", { nama })).status, 400);
    }
    const profile = await request("/auth/profile", "PATCH", { nama: " Mahasiswa Baru ", id: otherUserId });
    assert.equal(profile.status, 200);
    assert.equal(profile.body.user.nama, "Mahasiswa Baru");
    assert.equal(profile.body.user.id, userId);
    assert.equal(profile.body.user.password_hash, undefined);
    assert.ok(profile.body.token);
    token = profile.body.token;
    assert.equal((await request("/auth/me")).body.user.nama, "Mahasiswa Baru");
    assert.equal((await request("/auth/me", "GET", undefined, otherToken)).body.user.nama, "Mahasiswa B");

    const originalHash = (await pool!.query("SELECT password_hash FROM users WHERE id = $1", [userId])).rows[0].password_hash;
    for (const body of [
      { currentPassword: "wrong123", newPassword: "newsecret123" },
      { currentPassword: "secret123", newPassword: "short" },
      { currentPassword: "secret123", newPassword: "secret123" },
      { currentPassword: "secret123", newPassword: "é".repeat(37) },
    ]) assert.equal((await request("/auth/password", "PATCH", body)).status, 400);
    assert.equal((await pool!.query("SELECT password_hash FROM users WHERE id = $1", [userId])).rows[0].password_hash, originalHash);
    const changed = await request("/auth/password", "PATCH", { currentPassword: "secret123", newPassword: "newsecret123", id: otherUserId });
    assert.equal(changed.status, 200);
    assert.equal(changed.body.success, true);
    assert.equal((await request("/auth/login", "POST", { email: "test@studytrack.test", password: "secret123" }, "")).status, 401);
    assert.equal((await request("/auth/login", "POST", { email: "test@studytrack.test", password: "newsecret123" }, "")).status, 200);
    assert.equal((await request("/auth/login", "POST", { email: "other@studytrack.test", password: "secret123" }, "")).status, 200);
    const newHash = (await pool!.query("SELECT password_hash FROM users WHERE id = $1", [userId])).rows[0].password_hash;
    assert.notEqual(newHash, originalHash);
    assert.notEqual(newHash, "newsecret123");
  });

  test("CRUD mata kuliah dan data contoh lintas mata kuliah", async () => {
    const courses = [
      ["Database Systems", "CS 186"], ["Data Structures", "CS 61B"], ["Software Engineering", "CS 169"],
    ];
    const samples = [
      ["Lab 4: Query Optimization Report", "2026-07-03T23:59", "2026-06-15T09:00:00+07:00"],
      ["Project 3: BSTMap Implementation", "2026-07-02T10:00", "2026-06-16T14:00:00+07:00"],
      ["Sprint 2: Backend API Integration", "2026-07-06T23:59", "2026-06-17T11:00:00+07:00"],
    ];
    for (let i = 0; i < courses.length; i++) {
      const created = await request("/courses", "POST", { name: courses[i][0], kode: courses[i][1] });
      assert.equal(created.status, 201);
      if (i === 0) courseId = created.body.course.id;
      const result = await request("/tasks", "POST", { mata_kuliah_id: String(created.body.course.id), judul: samples[i][0], deadline: samples[i][1] });
      assert.equal(result.status, 201);
      assert.equal(result.body.task.mata_kuliah, courses[i][0]);
      if (i === 0) taskId = result.body.task.id;
      await pool!.query("UPDATE tasks SET created_at = $1 WHERE id = $2", [samples[i][2], result.body.task.id]);
    }
    assert.equal((await request("/courses")).body.courses.length, 3);
    const updated = await request(`/courses/${courseId}`, "PUT", { dosen: "Dosen A" });
    assert.equal(updated.body.course.dosen, "Dosen A");
    const other = await request("/courses", "POST", { name: "Milik B" }, otherToken);
    assert.equal(other.status, 201);
    otherCourseId = other.body.course.id;
    assert.equal((await request("/tasks", "POST", { mata_kuliah_id: otherCourseId, judul: "B", deadline: "2026-07-03T15:00" }, otherToken)).status, 201);
  });

  test("F01-F04: kategori, urutan prioritas, waktu WIB, dan hanya tugas pemilik", async () => {
    const result = await request("/tasks");
    assert.equal(result.status, 200);
    assert.equal(result.headers.get("cache-control"), "no-store");
    assert.equal(result.body.server_time, currentTime.toISOString());
    assert.deepEqual(result.body.tasks.map((item: any) => item.deadline_category), ["mendekati_deadline", "overdue", "normal"]);
    assert.deepEqual(result.body.tasks.map((item: any) => item.judul), ["Lab 4: Query Optimization Report", "Project 3: BSTMap Implementation", "Sprint 2: Backend API Integration"]);
    assert.ok(result.body.tasks.every((item: any) => item.user_id === userId));
    assert.equal(result.body.tasks[0].deadline, "2026-07-03T16:59:00.000Z");
    assert.equal(result.body.tasks[0].remaining_seconds, 43140);
    assert.equal((await request("/tasks", "GET", undefined, otherToken)).body.tasks.length, 1);
    assert.equal((await request(`/tasks/${taskId}`)).body.task.deadline_category, "mendekati_deadline");
  });

  test("batas tepat 24 jam, lewat 1 ms, tepat deadline, selesai, dan dibuka kembali", async () => {
    const result = await request("/tasks", "POST", { mata_kuliah_id: courseId, judul: "Batas", deadline: "2026-07-04T12:00:00+07:00" });
    const id = result.body.task.id;
    assert.equal(result.body.task.deadline_category, "normal");
    currentTime = new Date("2026-07-03T12:00:00.001+07:00");
    assert.equal((await request(`/tasks/${id}`)).body.task.deadline_category, "mendekati_deadline");
    currentTime = new Date("2026-07-04T12:00:00+07:00");
    assert.equal((await request(`/tasks/${id}`)).body.task.deadline_category, "overdue");
    const completed = await request(`/tasks/${id}`, "PUT", { status: "selesai" });
    assert.equal(completed.body.task.status, "selesai");
    assert.equal(completed.body.task.deadline_category, "normal");
    assert.equal((await request(`/tasks/${id}`, "PUT", { status: "belum" })).body.task.deadline_category, "overdue");
    assert.equal((await request(`/tasks/${id}`, "DELETE")).status, 200);
    assert.equal((await request(`/tasks/${id}`)).status, 404);
    currentTime = new Date("2026-07-03T12:00:00+07:00");
  });

  test("akses lintas pengguna ditolak untuk detail, ubah, hapus, dan penambahan tugas", async () => {
    for (const method of ["GET", "PUT", "DELETE"]) {
      assert.equal((await request(`/tasks/${taskId}`, method, method === "PUT" ? { judul: "Dicuri" } : undefined, otherToken)).status, 404);
    }
    for (const method of ["PUT", "DELETE"]) {
      assert.equal((await request(`/courses/${courseId}`, method, method === "PUT" ? { name: "Dicuri" } : undefined, otherToken)).status, 404);
    }
    assert.equal((await request("/tasks", "POST", { mata_kuliah_id: courseId, judul: "Dicuri", deadline: "2026-07-03T23:00" }, otherToken)).status, 400);
    // Constraint database melindungi relasi pemilik bahkan jika API dilewati.
    await assert.rejects(pool!.query("INSERT INTO tasks (user_id, mata_kuliah_id, judul, deadline) VALUES ($1, $2, 'Invalid', now())", [otherUserId, courseId]), { code: "23503" });
  });

  test("input buruk, JWT tidak sah dan update gagal tidak mengubah data", async () => {
    for (const path of ["/tasks", "/courses", "/auth/me"]) {
      assert.equal((await request(path, "GET", undefined, "")).status, 401);
      assert.equal((await request(path, "GET", undefined, "invalid")).status, 401);
    }
    const before = (await request(`/tasks/${taskId}`)).body.task;
    for (const body of [
      { deadline: "2026-02-30T10:00Z" }, { deadline: null }, { judul: " " },
      { judul: "Tidak boleh tersimpan", status: "invalid" }, { judul: {} },
    ]) assert.equal((await request(`/tasks/${taskId}`, "PUT", body)).status, 400);
    assert.equal((await request(`/tasks/${taskId}`)).body.task.judul, before.judul);
    assert.equal((await request("/tasks/1 OR 1=1")).status, 400);
    assert.equal((await request("/tasks/2147483648")).status, 400);
    assert.equal((await request("/courses", "POST", { name: 123 })).status, 400);
    assert.equal((await request("/auth/register", "POST", { nama: "A", email: "invalid", password: "secret123" })).status, 400);
    const malformed = await fetch(`${base}/api/tasks`, { method: "POST", headers: { "Content-Type": "application/json" }, body: "{" });
    assert.equal(malformed.status, 400);
    await malformed.json();
    assert.equal((await request("/courses", "POST", [])).status, 400);
    assert.equal((await request("/dev/reset", "POST")).status, 404);
  });

  test("hapus mata kuliah menghapus tugas terkait tanpa memengaruhi pengguna lain", async () => {
    assert.equal((await request(`/courses/${courseId}`, "DELETE")).status, 200);
    assert.equal((await request(`/tasks/${taskId}`)).status, 404);
    assert.equal((await request("/tasks")).body.tasks.length, 2);
    assert.equal((await request("/tasks", "GET", undefined, otherToken)).body.tasks.length, 1);
    assert.equal((await request("/courses", "GET", undefined, otherToken)).body.courses[0].id, otherCourseId);
  });
});
