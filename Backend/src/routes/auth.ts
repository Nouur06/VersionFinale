import { Router } from "express";
import bcrypt from "bcrypt";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { StatusCodes } from "http-status-codes";
import { User } from "../models/User.js";
import { auth, signToken } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { fail, pub } from "../utils/http.js";

const router = Router();

// 20 tentatives / 15 min / IP sur les routes sensibles (anti brute force)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Trop de tentatives, réessayez plus tard" },
});

const registerSchema = z.object({
  name: z.string().min(2, "Nom requis"),
  email: z.email("E-mail invalide"),
  phone: z.string().optional(),
  password: z.string().min(8, "Mot de passe : 8 caractères minimum"),
});
const loginSchema = z.object({ email: z.email("E-mail invalide"), password: z.string().min(1, "Mot de passe requis") });

router.post("/register", limiter, validate(registerSchema), async (req, res) => {
  const { name, email, phone, password } = req.body as z.infer<typeof registerSchema>;
  if (await User.exists({ email })) return fail(res, StatusCodes.CONFLICT, "E-mail déjà utilisé");
  const user = await User.create({ name, email, phone: phone ?? "", password: await bcrypt.hash(password, 10) });
  res.status(StatusCodes.CREATED).json({ token: signToken(user.id), user: pub(user) });
});

router.post("/login", limiter, validate(loginSchema), async (req, res) => {
  const { email, password } = req.body as z.infer<typeof loginSchema>;
  const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
  if (!user || !user.active || !(await bcrypt.compare(password, user.password)))
    return fail(res, StatusCodes.UNAUTHORIZED, "Identifiants invalides");
  res.json({ token: signToken(user.id), user: pub(user) });
});

router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user!.id);
  if (!user) return fail(res, StatusCodes.NOT_FOUND, "Utilisateur introuvable");
  res.json(pub(user));
});

const profileSchema = z.object({ name: z.string().min(2, "Nom requis").optional(), phone: z.string().max(30).optional() });
router.patch("/me", auth, validate(profileSchema), async (req, res) => {
  const { name, phone } = req.body as z.infer<typeof profileSchema>;
  const user = await User.findById(req.user!.id);
  if (!user) return fail(res, StatusCodes.NOT_FOUND, "Utilisateur introuvable");
  if (name !== undefined) user.name = name;
  if (phone !== undefined) user.phone = phone;
  await user.save();
  res.json(pub(user));
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Mot de passe actuel requis"),
  newPassword: z.string().min(8, "Mot de passe : 8 caractères minimum"),
});
router.patch("/me/password", auth, limiter, validate(passwordSchema), async (req, res) => {
  const { currentPassword, newPassword } = req.body as z.infer<typeof passwordSchema>;
  const user = await User.findById(req.user!.id).select("+password");
  if (!user || !(await bcrypt.compare(currentPassword, user.password)))
    return fail(res, StatusCodes.UNAUTHORIZED, "Mot de passe actuel incorrect");
  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();
  res.json({ ok: true });
});

export default router;
