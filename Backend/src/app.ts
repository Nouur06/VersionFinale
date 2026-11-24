import express, { type ErrorRequestHandler } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import multer from "multer";
import { StatusCodes } from "http-status-codes";
import { env } from "./config/env.js";
import { fail } from "./utils/http.js";
import { UPLOAD_ROOT } from "./middleware/upload.js";
import authRoutes from "./routes/auth.js";
import roomRoutes from "./routes/rooms.js";
import bookingRoutes from "./routes/bookings.js";
import adminRoutes from "./routes/admin.js";
import galleryRoutes from "./routes/gallery.js";

export const app = express();

// Derrière un proxy (Render, Railway, Nginx...) : nécessaire pour le rate limit
if (env.NODE_ENV === "production") app.set("trust proxy", 1);

const origins =
  env.CLIENT_URL === "*"
    ? true
    : env.CLIENT_URL.split(",").map((o) => o.trim());

// cross-origin : sinon le navigateur bloque les images affichées par le frontend (autre origine)
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors({ origin: origins }));
app.use(express.json({ limit: "100kb" }));
if (env.NODE_ENV !== "test") app.use(morgan("dev"));

app.use(
  "/uploads",
  express.static(UPLOAD_ROOT, { maxAge: "7d", index: false }),
);

app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/admin", adminRoutes);

app.use((_req, res) => fail(res, StatusCodes.NOT_FOUND, "Route introuvable"));

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof multer.MulterError) {
    const msg =
      err.code === "LIMIT_FILE_SIZE"
        ? "Image trop lourde (5 Mo maximum)"
        : err.code === "LIMIT_FILE_COUNT" ||
            err.code === "LIMIT_UNEXPECTED_FILE"
          ? "8 images maximum, champ « photos »"
          : "Envoi invalide";
    return fail(res, StatusCodes.BAD_REQUEST, msg);
  }
  if (err?.code === "BAD_FILE_TYPE")
    return fail(res, StatusCodes.BAD_REQUEST, err.message);
  const status =
    typeof err?.status === "number" && err.status >= 400 && err.status < 500
      ? err.status
      : 500;
  if (status === 500) {
    console.error(err);
    return fail(res, 500, "Erreur serveur");
  }
  return fail(res, status, "Requête invalide"); // ex. JSON mal formé, corps trop gros
};
app.use(errorHandler);
