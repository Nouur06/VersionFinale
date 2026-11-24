import { Router } from "express";
import { z } from "zod";
import { StatusCodes } from "http-status-codes";
import { GalleryPhoto, GALLERY_CATEGORIES } from "../models/GalleryPhoto.js";
import { auth, requireRole } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { checkId } from "../middleware/checkId.js";
import {
  uploadRoomPhotos,
  storePhotos,
  removePhotoFile,
  removePhotoFiles,
  useCloudinary,
  ROOM_URL_PREFIX,
} from "../middleware/upload.js";
import { fail } from "../utils/http.js";

const router = Router();
router.param("id", checkId);
const staff = [auth, requireRole("admin", "super_admin")];

const category = z.enum(GALLERY_CATEGORIES);
const caption = z.string().trim().max(120, "Légende : 120 caractères maximum");

// Liste publique : /api/gallery ou /api/gallery?category=alger
router.get("/", async (req, res) => {
  const parsed = category.safeParse(req.query.category);
  const filter = parsed.success ? { category: parsed.data } : {};
  res.json(await GalleryPhoto.find(filter).sort({ createdAt: -1 }).limit(300));
});

// Envoi : multipart/form-data, champ "photos" (+ champs texte "category" et "caption")
router.post("/", ...staff, (req, res, next) => {
  uploadRoomPhotos(req, res, async (err) => {
    if (err) return next(err);
    const files = (req.files as Express.Multer.File[] | undefined) ?? [];
    if (files.length === 0)
      return fail(res, StatusCodes.BAD_REQUEST, "Aucune image reçue (champ « photos »)");

    const cat = category.safeParse(req.body?.category ?? "hotel");
    const cap = caption.safeParse(req.body?.caption ?? "");
    let urls: string[] = [];
    try {
      if (!cat.success || !cap.success) {
        // En mode disque, multer a déjà écrit les fichiers : on les supprime (rien n'est parti chez Cloudinary)
        if (!useCloudinary)
          await removePhotoFiles(files.map((f) => `${ROOM_URL_PREFIX}${f.filename}`));
        return fail(
          res,
          StatusCodes.BAD_REQUEST,
          cap.success ? "Catégorie invalide" : "Légende : 120 caractères maximum",
        );
      }
      urls = await storePhotos(files);
      const created = await GalleryPhoto.insertMany(
        urls.map((url) => ({ url, category: cat.data, caption: cap.data })),
      );
      res.status(StatusCodes.CREATED).json(created);
    } catch (e) {
      await removePhotoFiles(urls);
      next(e);
    }
  });
});

const patchSchema = z.object({ category: category.optional(), caption: caption.optional() });
router.patch("/:id", ...staff, validate(patchSchema), async (req, res) => {
  const photo = await GalleryPhoto.findByIdAndUpdate(String(req.params.id), req.body, {
    new: true,
    runValidators: true,
  });
  if (!photo) return fail(res, StatusCodes.NOT_FOUND, "Photo introuvable");
  res.json(photo);
});

router.delete("/:id", ...staff, async (req, res) => {
  const photo = await GalleryPhoto.findByIdAndDelete(String(req.params.id));
  if (!photo) return fail(res, StatusCodes.NOT_FOUND, "Photo introuvable");
  await removePhotoFile(photo.url);
  res.status(StatusCodes.NO_CONTENT).end();
});

export default router;
