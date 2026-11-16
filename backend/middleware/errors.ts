import type { ErrorRequestHandler, RequestHandler } from "express";

export class HttpError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
  }
}

export const asyncHandler = (handler: RequestHandler): RequestHandler => (req, res, next) => {
  Promise.resolve().then(() => handler(req, res, next)).catch(next);
};

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof HttpError) {
    res.status(error.status).json({ error: error.message });
    return;
  }
  if (error?.type === "entity.parse.failed") {
    res.status(400).json({ error: "Body JSON tidak valid." });
    return;
  }
  if (error?.type === "entity.too.large") {
    res.status(413).json({ error: "Body terlalu besar (maksimal 100 KB)." });
    return;
  }
  if (error?.code === "23505") {
    res.status(409).json({ error: "Data unik sudah terdaftar." });
    return;
  }
  if (error?.code === "23503") {
    res.status(400).json({ error: "Referensi data tidak ditemukan atau bukan milik pengguna." });
    return;
  }
  console.error("Request gagal:", error instanceof Error ? error.message : "Unknown error");
  res.status(500).json({ error: "Terjadi kesalahan pada server." });
};
