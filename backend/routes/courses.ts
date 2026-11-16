import { Router } from "express";
import { pool } from "../db.js";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler, HttpError } from "../middleware/errors.js";
import { positiveId, text } from "../validation.js";
import type { Course } from "../types.js";

const router = Router();
router.use(requireAuth);

router.get("/", asyncHandler(async (req, res) => {
  const { rows } = await pool.query<Course>("SELECT * FROM courses WHERE user_id = $1 ORDER BY id", [req.user!.id]);
  res.json({ courses: rows });
}));

router.post("/", asyncHandler(async (req, res) => {
  const name = text(req.body.name, "Nama mata kuliah", 200);
  const kode = req.body.kode === undefined ? "" : text(req.body.kode, "Kode", 50, true);
  const dosen = req.body.dosen === undefined ? "" : text(req.body.dosen, "Dosen", 200, true);
  const { rows } = await pool.query<Course>(
    "INSERT INTO courses (user_id, name, kode, dosen) VALUES ($1, $2, $3, $4) RETURNING *",
    [req.user!.id, name, kode, dosen],
  );
  res.status(201).json({ course: rows[0] });
}));

router.put("/:id", asyncHandler(async (req, res) => {
  const id = positiveId(req.params.id);
  const name = req.body.name === undefined ? null : text(req.body.name, "Nama mata kuliah", 200);
  const kode = req.body.kode === undefined ? null : text(req.body.kode, "Kode", 50, true);
  const dosen = req.body.dosen === undefined ? null : text(req.body.dosen, "Dosen", 200, true);
  const { rows } = await pool.query<Course>(
    `UPDATE courses SET name = COALESCE($3, name), kode = COALESCE($4, kode), dosen = COALESCE($5, dosen)
     WHERE id = $1 AND user_id = $2 RETURNING *`, [id, req.user!.id, name, kode, dosen],
  );
  if (!rows[0]) throw new HttpError(404, "Mata kuliah tidak ditemukan.");
  res.json({ course: rows[0] });
}));

router.delete("/:id", asyncHandler(async (req, res) => {
  const { rowCount } = await pool.query("DELETE FROM courses WHERE id = $1 AND user_id = $2", [positiveId(req.params.id), req.user!.id]);
  if (!rowCount) throw new HttpError(404, "Mata kuliah tidak ditemukan.");
  res.json({ success: true });
}));
export default router;
