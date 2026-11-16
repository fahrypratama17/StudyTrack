import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config.js";
import { pool } from "../db.js";
import { asyncHandler, HttpError } from "./errors.js";
import type { UserProfile } from "../types.js";

export const requireAuth = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) throw new HttpError(401, "Token tidak ditemukan. Silakan login terlebih dahulu.");
  let id: number;
  try {
    const payload = jwt.verify(token, JWT_SECRET, { algorithms: ["HS256"] });
    if (typeof payload === "string" || !/^\d+$/.test(String(payload.sub))) throw new Error();
    id = Number(payload.sub);
    if (!Number.isSafeInteger(id) || id < 1 || id > 2147483647) throw new Error();
  } catch {
    throw new HttpError(401, "Token tidak valid atau sudah kedaluwarsa.");
  }
  const { rows } = await pool.query<UserProfile>("SELECT id, nama, email FROM users WHERE id = $1", [id]);
  if (!rows[0]) throw new HttpError(401, "Akun tidak ditemukan. Silakan login kembali.");
  req.user = rows[0];
  next();
});
