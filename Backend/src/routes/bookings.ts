import { Router } from "express";
import { isValidObjectId } from "mongoose";
import { z } from "zod";
import { StatusCodes as S } from "http-status-codes";
import { Booking } from "../models/Booking.js";
import { Room } from "../models/Room.js";
import { auth, requireRole } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { checkId } from "../middleware/checkId.js";
import { fail } from "../utils/http.js";

const router = Router();
router.param("id", checkId);
const staff = [auth, requireRole("admin", "super_admin")];

// Transitions de statut autorisées
const NEXT: Record<string, string[]> = {
  en_attente: ["confirmee", "refusee"],
  confirmee: ["terminee", "annulee"],
};

const busy = (room: unknown, a: Date, b: Date) =>
  Booking.exists({
    room,
    status: "confirmee",
    checkIn: { $lt: b },
    checkOut: { $gt: a },
  } as Record<string, unknown>);

const createSchema = z.object({
  room: z.string().refine((v) => isValidObjectId(v), "Chambre invalide"),
  checkIn: z.coerce.date(),
  checkOut: z.coerce.date(),
  guests: z.number().int().min(1, "Au moins une personne"),
  notes: z.string().max(500).optional(),
});

router.post("/", auth, validate(createSchema), async (req, res) => {
  const { room, checkIn, checkOut, guests, notes } = req.body as z.infer<
    typeof createSchema
  >;
  const rm = await Room.findById(room);
  if (!rm || !rm.available) return fail(res, S.BAD_REQUEST, "Chambre invalide");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (checkIn < today || checkOut <= checkIn)
    return fail(res, S.BAD_REQUEST, "Dates invalides");
  if (guests > rm.capacity)
    return fail(
      res,
      S.BAD_REQUEST,
      `Capacité maximale : ${rm.capacity} personnes`,
    );
  if (await busy(rm._id, checkIn, checkOut))
    return fail(res, S.CONFLICT, "Chambre indisponible à ces dates");
  const nights = Math.round((+checkOut - +checkIn) / 864e5);
  const booking = await Booking.create({
    client: req.user!.id,
    room: rm._id,
    checkIn,
    checkOut,
    guests,
    notes: notes ?? "",
    total: nights * rm.price,
  });
  res.status(S.CREATED).json(booking);
});

router.get("/mine", auth, async (req, res) => {
  const filter = { client: req.user!.id } as Record<string, string>;
  res.json(
    await Booking.find(filter).populate("room", "name").sort("-createdAt"),
  );
});

router.patch("/:id/cancel", auth, async (req, res) => {
  const b = await Booking.findOne({
    _id: String(req.params.id),
    client: req.user!.id,
  } as Record<string, string>);
  if (!b || b.status !== "en_attente")
    return fail(res, S.BAD_REQUEST, "Annulation impossible");
  b.status = "annulee";
  await b.save();
  res.json(b);
});

router.get("/", ...staff, async (req, res) => {
  const status =
    typeof req.query.status === "string" ? req.query.status : undefined;
  const filter = status ? ({ status } as Record<string, string>) : {};
  res.json(
    await Booking.find(filter)
      .populate("room", "name")
      .populate("client", "name email")
      .sort("-createdAt"),
  );
});

router.get("/:id", auth, async (req, res) => {
  const b = await Booking.findById(String(req.params.id));
  const isStaff = ["admin", "super_admin"].includes(req.user!.role);
  if (!b || (!isStaff && String(b.client) !== req.user!.id))
    return fail(res, S.NOT_FOUND, "Réservation introuvable");
  await b.populate("room", "name");
  res.json(b);
});

const statusSchema = z.object({
  status: z.enum(["confirmee", "refusee", "terminee", "annulee"]),
});

router.patch(
  "/:id/status",
  ...staff,
  validate(statusSchema),
  async (req, res) => {
    const { status } = req.body as z.infer<typeof statusSchema>;
    const b = await Booking.findById(String(req.params.id));
    if (!b) return fail(res, S.NOT_FOUND, "Réservation introuvable");
    if (!(NEXT[b.status] ?? []).includes(status))
      return fail(
        res,
        S.BAD_REQUEST,
        `Transition ${b.status} → ${status} interdite`,
      );
    if (status === "confirmee" && (await busy(b.room, b.checkIn, b.checkOut)))
      return fail(
        res,
        S.CONFLICT,
        "Chevauchement avec une réservation confirmée",
      );
    b.status = status;
    await b.save();
    res.json(b);
  },
);

export default router;
