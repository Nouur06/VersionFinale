import multer from "multer";
import path from "node:path";
import fs from "node:fs";
import { randomUUID } from "node:crypto";
import { v2 as cloudinary } from "cloudinary";
import { env } from "../config/env.js";

export const UPLOAD_ROOT = path.resolve("uploads");
export const ROOM_DIR = path.join(UPLOAD_ROOT, "rooms");
export const ROOM_URL_PREFIX = "/uploads/rooms/";
const CLOUDINARY_FOLDER = "dar-el-bahdja/rooms";

// Cloudinary est utilisé dès que les 3 variables sont renseignées
export const useCloudinary = Boolean(
  env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET,
);

// Le dossier local reste servi : il contient les anciennes photos, et sert en développement
fs.mkdirSync(ROOM_DIR, { recursive: true });

if (useCloudinary) {
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
    secure: true,
  });
  console.log("Photos : stockage Cloudinary");
} else {
  console.log("Photos : stockage sur le disque local (dossier uploads)");
  if (env.NODE_ENV === "production")
    console.warn(
      "⚠️  Cloudinary non configuré en production : les photos seront perdues à chaque redémarrage.",
    );
}

// L'extension vient du type MIME vérifié, jamais du nom envoyé par l'utilisateur
const EXT: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

export const uploadRoomPhotos = multer({
  // Cloudinary : le fichier reste en mémoire puis part vers Cloudinary ; sinon écrit sur le disque
  storage: useCloudinary
    ? multer.memoryStorage()
    : multer.diskStorage({
        destination: (_req, _file, cb) => cb(null, ROOM_DIR),
        filename: (_req, file, cb) =>
          cb(null, `${randomUUID()}${EXT[file.mimetype]}`),
      }),
  limits: { fileSize: 5 * 1024 * 1024, files: 8 }, // 5 Mo par image, 8 images max
  fileFilter: (_req, file, cb) => {
    if (EXT[file.mimetype]) return cb(null, true);
    cb(
      Object.assign(new Error("Format accepté : JPG, PNG ou WebP"), {
        code: "BAD_FILE_TYPE",
      }),
    );
  },
}).array("photos", 8);

function uploadToCloudinary(file: Express.Multer.File): Promise<string> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: CLOUDINARY_FOLDER,
        public_id: randomUUID(),
        resource_type: "image",
        allowed_formats: ["jpg", "png", "webp"], // Cloudinary vérifie aussi le contenu réel
        transformation: [{ width: 2000, height: 2000, crop: "limit" }], // évite les images énormes
      },
      (error, result) =>
        error || !result
          ? reject(error ?? new Error("Échec de l'envoi vers Cloudinary"))
          : resolve(result.secure_url),
    );
    stream.end(file.buffer);
  });
}

/** Enregistre les fichiers reçus et renvoie leurs URL (relatives en local, https sur Cloudinary). */
export async function storePhotos(files: Express.Multer.File[]): Promise<string[]> {
  if (!useCloudinary) return files.map((f) => `${ROOM_URL_PREFIX}${f.filename}`);

  const results = await Promise.allSettled(files.map(uploadToCloudinary));
  const urls = results.flatMap((r) => (r.status === "fulfilled" ? [r.value] : []));
  const failed = results.find((r): r is PromiseRejectedResult => r.status === "rejected");
  if (failed) {
    await removePhotoFiles(urls); // tout ou rien : on ne garde pas un envoi à moitié réussi
    throw failed.reason;
  }
  return urls;
}

// URL de nos images Cloudinary : https://res.cloudinary.com/<cloud>/image/upload/v123/dar-el-bahdja/rooms/<id>.jpg
const CLOUDINARY_URL = new RegExp(
  `^https://res\\.cloudinary\\.com/([^/]+)/image/upload/(?:v\\d+/)?(${CLOUDINARY_FOLDER}/[\\w-]+)\\.\\w+$`,
);

/** Supprime une photo (disque local ou Cloudinary). Ne lève jamais d'erreur. */
export async function removePhotoFile(url: string): Promise<void> {
  try {
    if (url.startsWith(ROOM_URL_PREFIX)) {
      // basename : impossible de sortir du dossier avec ../
      await fs.promises.rm(path.join(ROOM_DIR, path.basename(url)), { force: true });
      return;
    }
    const match = CLOUDINARY_URL.exec(url);
    const publicId = match?.[2];
    // On ne détruit que NOS images (même compte Cloudinary, même dossier)
    if (useCloudinary && publicId && match?.[1] === env.CLOUDINARY_CLOUD_NAME) {
      await cloudinary.uploader.destroy(publicId, { invalidate: true });
    }
  } catch (error) {
    console.error("Suppression de photo impossible :", error);
  }
}

export async function removePhotoFiles(urls: string[]): Promise<void> {
  await Promise.all(urls.map(removePhotoFile));
}
