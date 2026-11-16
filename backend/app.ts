import express from "express";
import cors from "cors";
import { CORS_ORIGIN } from "./config.js";
import { pool } from "./db.js";
import authRoutes from "./routes/auth.js";
import courseRoutes from "./routes/courses.js";
import { createTaskRouter } from "./routes/tasks.js";
import { asyncHandler, errorHandler, HttpError } from "./middleware/errors.js";

export function createApp(clock: () => Date = () => new Date()) {
  const app = express();
  app.disable("x-powered-by");
  app.use(cors({ origin: CORS_ORIGIN }));
  app.use(express.json({ limit: "100kb" }));
  app.use((req, res, next) => {
    res.set("Cache-Control", "no-store");
    if (["POST", "PUT", "PATCH"].includes(req.method) &&
        (!req.body || typeof req.body !== "object" || Array.isArray(req.body))) {
      return next(new HttpError(400, "Body harus berupa objek JSON."));
    }
    next();
  });
  app.get("/api/health", asyncHandler(async (_req, res) => {
    try {
      await pool.query("SELECT 1");
      res.json({ status: "ok", database: "connected", message: "StudyTrack backend is running." });
    } catch {
      res.status(503).json({ status: "error", database: "unavailable" });
    }
  }));
  app.use("/api/auth", authRoutes);
  app.use("/api/courses", courseRoutes);
  app.use("/api/tasks", createTaskRouter(clock));
  app.use((_req, res) => { res.status(404).json({ error: "Endpoint tidak ditemukan." }); });
  app.use(errorHandler);
  return app;
}
