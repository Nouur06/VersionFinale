import { Schema, model } from "mongoose";

const schema = new Schema({
  name: { type: String, required: true },
  type: { type: String, default: "double" },
  description: { type: String, default: "" },
  capacity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 },
  photos: { type: [String], default: [] },
  available: { type: Boolean, default: true },
});

// Format attendu par le frontend : id, image, pricePerNight
schema.set("toJSON", {
  transform: (_doc, ret: Record<string, any>) => {
    ret.id = String(ret._id);
    ret.pricePerNight = ret.price;
    ret.image = ret.photos?.[0] ?? "/images/placeholder.jpg";
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const Room = model("Room", schema);
