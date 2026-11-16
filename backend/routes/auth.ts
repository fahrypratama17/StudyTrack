import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../db.js";
import { JWT_SECRET } from "../config.js";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler, HttpError } from "../middleware/errors.js";
import { email as validateEmail, password as validatePassword, text } from "../validation.js";
import type { User, UserProfile } from "../types.js";

const router = Router();
const signToken = (user: UserProfile): string => jwt.sign(
  { nama: user.nama, email: user.email }, JWT_SECRET,
  { subject: String(user.id), expiresIn: "7d", algorithm: "HS256" },
);

router.post("/register", asyncHandler(async (req, res) => {
  const nama = text(req.body.nama, "Nama", 200);
  const email = validateEmail(req.body.email);
  const password = validatePassword(req.body.password);
  const hash = await bcrypt.hash(password, 10);
  const { rows } = await pool.query<UserProfile>(
    `INSERT INTO users (nama, email, password_hash) VALUES ($1, $2, $3)
     ON CONFLICT (email) DO NOTHING RETURNING id, nama, email`, [nama, email, hash],
  );
  const user = rows[0];
  if (!user) throw new HttpError(409, "Email sudah terdaftar.");
  res.status(201).json({ token: signToken(user), user });
}));

router.post("/login", asyncHandler(async (req, res) => {
  const email = validateEmail(req.body.email);
  const password = validatePassword(req.body.password);
  const { rows } = await pool.query<User>("SELECT * FROM users WHERE email = $1", [email]);
  const user = rows[0];
  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    throw new HttpError(401, "Email atau password salah.");
  }
  const profile: UserProfile = { id: user.id, nama: user.nama, email: user.email };
  res.json({ token: signToken(profile), user: profile });
}));

router.get("/me", requireAuth, (req, res) => { res.json({ user: req.user }); });

router.patch("/profile", requireAuth, asyncHandler(async (req, res) => {
  const nama = text(req.body.nama, "Nama", 100);
  if (nama.length < 2) throw new HttpError(400, "Nama harus terdiri dari 2–100 karakter.");
  const { rows } = await pool.query<UserProfile>(
    "UPDATE users SET nama = $1 WHERE id = $2 RETURNING id, nama, email", [nama, req.user!.id],
  );
  const user = rows[0];
  if (!user) throw new HttpError(401, "Akun tidak ditemukan. Silakan login kembali.");
  res.json({ token: signToken(user), user });
}));

router.patch("/password", requireAuth, asyncHandler(async (req, res) => {
  const currentPassword = validatePassword(req.body.currentPassword);
  const newPassword = validatePassword(req.body.newPassword);
  if (newPassword === currentPassword) throw new HttpError(400, "Password baru harus berbeda dari password lama.");
  const { rows } = await pool.query<User>("SELECT * FROM users WHERE id = $1", [req.user!.id]);
  const user = rows[0];
  if (!user || !(await bcrypt.compare(currentPassword, user.password_hash))) {
    throw new HttpError(400, "Password lama tidak sesuai.");
  }
  const hash = await bcrypt.hash(newPassword, 10);
  const { rowCount } = await pool.query(
    "UPDATE users SET password_hash = $1 WHERE id = $2 AND password_hash = $3",
    [hash, user.id, user.password_hash],
  );
  if (!rowCount) throw new HttpError(409, "Password telah berubah. Silakan coba lagi.");
  res.json({ success: true });
}));
export default router;
