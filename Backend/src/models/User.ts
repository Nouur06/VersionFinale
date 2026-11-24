import { Schema, model } from "mongoose";

export const ROLES = ["client", "admin", "super_admin"] as const;
export type Role = (typeof ROLES)[number];

const schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, default: "" },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ROLES, default: "client" },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const User = model("User", schema);
