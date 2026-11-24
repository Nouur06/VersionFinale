import { Schema, model } from "mongoose";

export const STATUSES = [
  "en_attente",
  "confirmee",
  "refusee",
  "annulee",
  "terminee",
] as const;

const schema = new Schema(
  {
    client: { type: Schema.Types.ObjectId, ref: "User", required: true },
    room: { type: Schema.Types.ObjectId, ref: "Room", required: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    guests: { type: Number, required: true, min: 1 },
    total: { type: Number, required: true },
    notes: { type: String, default: "" },
    status: { type: String, enum: STATUSES, default: "en_attente" },
  },
  { timestamps: true },
);

schema.index({ room: 1, status: 1, checkIn: 1, checkOut: 1 });
schema.index({ client: 1, createdAt: -1 });

export const Booking = model("Booking", schema);
