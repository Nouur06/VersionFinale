import { Router } from "express";
import { z } from "zod";
import { StatusCodes } from "http-status-codes";
import { Room } from "../models/Room.js";
import { Booking } from "../models/Booking.js";
import { auth, requireRole } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { checkId } from "../middleware/checkId.js";
import {
  uploadRoomPhotos,
  storePhotos,
  removePhotoFile,
  removePhotoFiles,
} from "../middleware/upload.js";
import { fail } from "../utils/http.js";

const router = Router();
router.param("id", checkId);
const staff = [auth, requireRole("admin", "super_admin")];

const roomSchema = z.object({
  name: z.string().min(2),
  type: z.string().optional(),
  description: z.string().optional(),
  capacity: z.number().int().min(1),
  price: z.number().min(0),
  photos: z.array(z.string()).optional(),
  available: z.boolean().optional(),
});

const searchSchema = z.object({
  checkIn: z.coerce.date().optional(),
  checkOut: z.coerce.date().optional(),
  guests: z.coerce.number().int().min(1).optional(),
});

// Liste publique, avec recherche optionnelle : /api/rooms?checkIn=2026-12-01&checkOut=2026-12-05&guests=2
router.get("/", async (req, res) => {
  const q = searchSchema.safeParse(req.query);
  if (!q.success)
    return fail(
      res,
      StatusCodes.BAD_REQUEST,
      q.error.issues[0]?.message ?? "Paramètres invalides",
    );
  const { checkIn, checkOut, guests } = q.data;

  if (Boolean(checkIn) !== Boolean(checkOut))
    return fail(
      res,
      StatusCodes.BAD_REQUEST,
      "checkIn et checkOut sont requis ensemble",
    );
  if (checkIn && checkOut && checkOut <= checkIn)
    return fail(res, StatusCodes.BAD_REQUEST, "Dates invalides");

  const filter: Record<string, unknown> = { available: true };
  if (guests) filter.capacity = { $gte: guests };
  if (checkIn && checkOut) {
    const taken = await Booking.distinct("room", {
      status: "confirmee",
      checkIn: { $lt: checkOut },
      checkOut: { $gt: checkIn },
    });
    filter._id = { $nin: taken };
  }
  res.json(await Room.find(filter));
});

// Toutes les chambres (y compris indisponibles) pour l'admin — avant "/:id"
router.get("/all", ...staff, async (_req, res) =>
  res.json(await Room.find().sort("name")),
);

router.get("/:id", async (req, res) => {
  const room = await Room.findById(String(req.params.id));
  if (!room) return fail(res, StatusCodes.NOT_FOUND, "Chambre introuvable");
  res.json(room);
});

// Périodes déjà confirmées (pour griser un calendrier côté frontend)
router.get("/:id/availability", async (req, res) => {
  const id = String(req.params.id);
  if (!(await Room.exists({ _id: id })))
    return fail(res, StatusCodes.NOT_FOUND, "Chambre introuvable");
  const booked = await Booking.find({
    room: id,
    status: "confirmee",
    checkOut: { $gte: new Date() },
  })
    .select("checkIn checkOut -_id")
    .sort("checkIn");
  res.json({ booked });
});

// Envoi de photos : multipart/form-data, champ "photos" (jusqu'à 8 images JPG/PNG/WebP, 5 Mo chacune)
router.post("/:id/photos", ...staff, (req, res, next) => {
  uploadRoomPhotos(req, res, async (err) => {
    if (err) return next(err);
    const files = (req.files as Express.Multer.File[] | undefined) ?? [];
    if (files.length === 0)
      return fail(
        res,
        StatusCodes.BAD_REQUEST,
        "Aucune image reçue (champ « photos »)",
      );
    let urls: string[] = [];
    try {
      urls = await storePhotos(files);
      const room = await Room.findByIdAndUpdate(
        String(req.params.id),
        { $push: { photos: { $each: urls } } },
        { new: true },
      );
      if (!room) {
        await removePhotoFiles(urls); // chambre inconnue : on ne garde pas les fichiers
        return fail(res, StatusCodes.NOT_FOUND, "Chambre introuvable");
      }
      res.status(StatusCodes.CREATED).json(room);
    } catch (e) {
      await removePhotoFiles(urls);
      next(e);
    }
  });
});

const removePhotoSchema = z.object({ photo: z.string().min(1) });
router.delete(
  "/:id/photos",
  ...staff,
  validate(removePhotoSchema),
  async (req, res) => {
    const { photo } = req.body as z.infer<typeof removePhotoSchema>;
    const room = await Room.findOneAndUpdate(
      { _id: String(req.params.id), photos: photo },
      { $pull: { photos: photo } },
      { new: true },
    );
    if (!room)
      return fail(
        res,
        StatusCodes.NOT_FOUND,
        "Photo introuvable pour cette chambre",
      );
    await removePhotoFile(photo);
    res.json(room);
  },
);

router.post("/", ...staff, validate(roomSchema), async (req, res) => {
  res.status(StatusCodes.CREATED).json(await Room.create(req.body));
});

router.put(
  "/:id",
  ...staff,
  validate(roomSchema.partial()),
  async (req, res) => {
    const room = await Room.findByIdAndUpdate(String(req.params.id), req.body, {
      new: true,
    });
    if (!room) return fail(res, StatusCodes.NOT_FOUND, "Chambre introuvable");
    res.json(room);
  },
);

// Si la chambre a un historique de réservations, on l'archive (available=false) au lieu de la supprimer
router.delete("/:id", ...staff, async (req, res) => {
  const id = String(req.params.id);
  if (await Booking.exists({ room: id })) {
    const room = await Room.findByIdAndUpdate(
      id,
      { available: false },
      { new: true },
    );
    if (!room) return fail(res, StatusCodes.NOT_FOUND, "Chambre introuvable");
    return res.json({ archived: true, room });
  }
  const room = await Room.findByIdAndDelete(id);
  if (!room) return fail(res, StatusCodes.NOT_FOUND, "Chambre introuvable");
  await removePhotoFiles(room.photos); // supprime aussi les fichiers uploadés
  res.status(StatusCodes.NO_CONTENT).end();
});

export default router;
