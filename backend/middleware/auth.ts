import jwt from "jsonwebtoken";
import type { RequestHandler } from "express";
import { JWT_SECRET } from "../config.js";

/**
 * Middleware autentikasi. Memverifikasi JWT dari header
 * `Authorization: Bearer <token>`.
 *
 * Jika token valid, data pengguna disimpan di `req.user` ({ id, nama, email })
 * dan request diteruskan. Jika tidak, server membalas 401.
 */
export const requireAuth: RequestHandler = (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: "Token tidak ditemukan. Silakan login terlebih dahulu." });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    if (typeof payload === "string") {
      throw new Error("Payload JWT tidak valid.");
    }
    const id: unknown = payload.sub;
    const nama: unknown = payload.nama;
    const email: unknown = payload.email;
    if (typeof id !== "number" || typeof nama !== "string" || typeof email !== "string") {
      throw new Error("Payload JWT tidak valid.");
    }
    req.user = { id, nama, email };
    next();
  } catch {
    return res.status(401).json({ error: "Token tidak valid atau sudah kedaluwarsa." });
  }
};
