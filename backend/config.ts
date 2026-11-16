/**
 * Konfigurasi backend yang dibaca dari environment (file `.env`).
 *
 * `dotenv/config` harus di-import paling awal. Dengan begitu isi `.env` sudah
 * terbaca sebelum modul lain (route dan middleware) membaca `process.env`.
 */
import "dotenv/config";

export const PORT = Number(process.env.PORT || 4000);

// Nilai bawaan hanya untuk pengembangan lokal. Ganti sebelum aplikasi di-deploy.
export const JWT_SECRET = process.env.JWT_SECRET || "studytrack-secret-key-change-this";

export const DATABASE_URL = process.env.DATABASE_URL;
export const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173";

if (!Number.isInteger(PORT) || PORT < 0 || PORT > 65535) {
  throw new Error("PORT harus berupa integer antara 0 dan 65535.");
}
if (process.env.NODE_ENV === "production" &&
    (!process.env.JWT_SECRET || JWT_SECRET === "studytrack-secret-key-change-this" || JWT_SECRET.length < 32)) {
  throw new Error("JWT_SECRET production wajib diisi dengan minimal 32 karakter acak.");
}
