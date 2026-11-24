import { Router } from "express";
import bcrypt from "bcrypt";
import { z } from "zod";
import { StatusCodes as S } from "http-status-codes";
import { User, ROLES } from "../models/User.js";
import { Booking } from "../models/Booking.js";
import { auth, requireRole } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { checkId } from "../middleware/checkId.js";
import { fail, pub } from "../utils/http.js";

const router = Router();
router.param("id", checkId);
const staff = [auth, requireRole("admin", "super_admin")];

router.get("/users", ...staff, async (req, res) => {
  const role = typeof req.query.role === "string" ? req.query.role : undefined;
  const filter = role ? ({ role } as Record<string, string>) : {};
  res.json(await User.find(filter).sort("-createdAt"));
});

const activeSchema = z.object({ active: z.boolean() });
router.patch(
  "/users/:id/active",
  ...staff,
  validate(activeSchema),
  async (req, res) => {
    const target = await User.findById(String(req.params.id));
    if (!target || target.id === req.user!.id)
      return fail(res, S.BAD_REQUEST, "Action impossible");
    if (target.role !== "client" && req.user!.role !== "super_admin")
      return fail(res, S.FORBIDDEN, "Accès refusé");
    target.active = (req.body as z.infer<typeof activeSchema>).active;
    await target.save();
    res.json(pub(target));
  },
);

const adminSchema = z.object({
  name: z.string().min(2),
  email: z.email(),
  password: z.string().min(8),
});
router.post(
  "/admins",
  auth,
  requireRole("super_admin"),
  validate(adminSchema),
  async (req, res) => {
    const { name, email, password } = req.body as z.infer<typeof adminSchema>;
    if (await User.exists({ email }))
      return fail(res, S.CONFLICT, "E-mail déjà utilisé");
    const admin = await User.create({
      name,
      email,
      role: "admin",
      password: await bcrypt.hash(password, 10),
    });
    res.status(S.CREATED).json(pub(admin));
  },
);

const roleSchema = z.object({ role: z.enum(ROLES) });
router.patch(
  "/users/:id/role",
  auth,
  requireRole("super_admin"),
  validate(roleSchema),
  async (req, res) => {
    if (String(req.params.id) === req.user!.id)
      return fail(
        res,
        S.BAD_REQUEST,
        "Vous ne pouvez pas changer votre propre rôle",
      );
    const user = await User.findByIdAndUpdate(
      String(req.params.id),
      { role: (req.body as z.infer<typeof roleSchema>).role },
      { new: true },
    );
    if (!user) return fail(res, S.NOT_FOUND, "Utilisateur introuvable");
    res.json(pub(user));
  },
);

router.get("/stats", ...staff, async (_req, res) => {
  const by = await Booking.aggregate<{ _id: string; n: number }>([
    { $group: { _id: "$status", n: { $sum: 1 } } },
  ]);
  res.json({
    bookings: Object.fromEntries(by.map((x) => [x._id, x.n])),
    clients: await User.countDocuments({ role: "client" }),
    admins: await User.countDocuments({ role: "admin" }),
    superAdmins: await User.countDocuments({ role: "super_admin" }),
  });
});

export default router;
