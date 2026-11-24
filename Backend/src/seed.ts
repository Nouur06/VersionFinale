import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { env } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { User } from "./models/User.js";
import { Room } from "./models/Room.js";

await connectDB();

if (!env.SUPER_ADMIN_EMAIL || !env.SUPER_ADMIN_PASSWORD) {
  console.warn(
    "⚠️  SUPER_ADMIN_EMAIL / SUPER_ADMIN_PASSWORD absents du .env : aucun super admin créé.",
  );
} else if (await User.exists({ email: env.SUPER_ADMIN_EMAIL.toLowerCase() })) {
  console.log("Super admin déjà existant.");
} else {
  await User.create({
    name: "Super Admin",
    email: env.SUPER_ADMIN_EMAIL,
    role: "super_admin",
    password: await bcrypt.hash(env.SUPER_ADMIN_PASSWORD, 10),
  });
  console.log("Super admin créé.");
}

if ((await Room.countDocuments()) === 0) {
  await Room.insertMany([
    {
      name: "Double Deluxe",
      type: "double",
      capacity: 2,
      price: 18000,
      description: "Lit double, bureau, vue ville.",
    },
    {
      name: "Double Premium",
      type: "double",
      capacity: 2,
      price: 24000,
      description: "Plus d’espace, vue baie.",
    },
    {
      name: "Twin Premium",
      type: "twin",
      capacity: 2,
      price: 22000,
      description: "Deux lits séparés.",
    },
    {
      name: "Suite Paradis",
      type: "suite",
      capacity: 4,
      price: 45000,
      description: "Salon séparé et terrasse.",
    },
  ]);
  console.log("Chambres créées.");
}

console.log("Seed terminé");
await mongoose.disconnect();
