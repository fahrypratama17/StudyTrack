import { Router } from "express";
import { pool } from "../db.js";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler, HttpError } from "../middleware/errors.js";
import { positiveId, parseDeadline, text } from "../validation.js";
import { presentTask, sortTasks } from "../services/deadlines.js";
import type { Task } from "../types.js";

type JoinedTask = Task & { mata_kuliah: string };
const SELECT_TASKS = `SELECT t.*, c.name AS mata_kuliah FROM tasks t
  JOIN courses c ON c.id = t.mata_kuliah_id AND c.user_id = t.user_id`;

export function createTaskRouter(clock: () => Date = () => new Date()): Router {
  const router = Router();
  router.use(requireAuth);

  router.get("/", asyncHandler(async (req, res) => {
    const { rows } = await pool.query<JoinedTask>(`${SELECT_TASKS} WHERE t.user_id = $1`, [req.user!.id]);
    const now = clock(); // Satu snapshot waktu untuk seluruh respons.
    res.json({ tasks: sortTasks(rows.map((task) => presentTask(task, now))), server_time: now.toISOString() });
  }));

  router.get("/:id", asyncHandler(async (req, res) => {
    const { rows } = await pool.query<JoinedTask>(`${SELECT_TASKS} WHERE t.id = $1 AND t.user_id = $2`,
      [positiveId(req.params.id), req.user!.id]);
    if (!rows[0]) throw new HttpError(404, "Tugas tidak ditemukan.");
    const now = clock();
    res.json({ task: presentTask(rows[0], now), server_time: now.toISOString() });
  }));

  router.post("/", asyncHandler(async (req, res) => {
    const courseId = positiveId(req.body.mata_kuliah_id);
    const judul = text(req.body.judul, "Judul", 300);
    const deskripsi = req.body.deskripsi === undefined ? "" : text(req.body.deskripsi, "Deskripsi", 10000, true);
    const deadline = parseDeadline(req.body.deadline);
    const { rows } = await pool.query<JoinedTask>(
      `WITH inserted AS (
         INSERT INTO tasks (user_id, mata_kuliah_id, judul, deskripsi, deadline)
         SELECT $1, id, $3, $4, $5::timestamptz FROM courses WHERE id = $2 AND user_id = $1
         RETURNING *
       ) SELECT inserted.*, c.name AS mata_kuliah FROM inserted JOIN courses c ON c.id = inserted.mata_kuliah_id`,
      [req.user!.id, courseId, judul, deskripsi, deadline],
    );
    if (!rows[0]) throw new HttpError(400, "Mata kuliah tidak ditemukan untuk user ini.");
    const now = clock();
    res.status(201).json({ task: presentTask(rows[0], now), server_time: now.toISOString() });
  }));

  router.put("/:id", asyncHandler(async (req, res) => {
    const id = positiveId(req.params.id);
    const judul = req.body.judul === undefined ? null : text(req.body.judul, "Judul", 300);
    const deskripsi = req.body.deskripsi === undefined ? null : text(req.body.deskripsi, "Deskripsi", 10000, true);
    const deadline = req.body.deadline === undefined ? null : parseDeadline(req.body.deadline);
    const status: unknown = req.body.status;
    if (status !== undefined && status !== "belum" && status !== "selesai") {
      throw new HttpError(400, "Status hanya boleh 'belum' atau 'selesai'.");
    }
    const { rows } = await pool.query<JoinedTask>(
      `WITH updated AS (
         UPDATE tasks SET judul = COALESCE($3, judul), deskripsi = COALESCE($4, deskripsi),
           deadline = COALESCE($5::timestamptz, deadline), status = COALESCE($6::task_status, status)
         WHERE id = $1 AND user_id = $2 RETURNING *
       ) SELECT updated.*, c.name AS mata_kuliah FROM updated JOIN courses c ON c.id = updated.mata_kuliah_id`,
      [id, req.user!.id, judul, deskripsi, deadline, status ?? null],
    );
    if (!rows[0]) throw new HttpError(404, "Tugas tidak ditemukan.");
    const now = clock();
    res.json({ task: presentTask(rows[0], now), server_time: now.toISOString() });
  }));

  router.delete("/:id", asyncHandler(async (req, res) => {
    const { rowCount } = await pool.query("DELETE FROM tasks WHERE id = $1 AND user_id = $2", [positiveId(req.params.id), req.user!.id]);
    if (!rowCount) throw new HttpError(404, "Tugas tidak ditemukan.");
    res.json({ success: true });
  }));
  return router;
}
