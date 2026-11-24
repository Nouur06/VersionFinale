import { Schema, model } from "mongoose";

export const GALLERY_CATEGORIES = [
  "hotel",
  "chambres",
  "alger",
  "gastronomie",
  "culture",
  "sites",
] as const;
export type GalleryCategory = (typeof GALLERY_CATEGORIES)[number];

const schema = new Schema(
  {
    url: { type: String, required: true },
    caption: { type: String, default: "", maxlength: 120 },
    category: { type: String, enum: GALLERY_CATEGORIES, default: "hotel" },
  },
  { timestamps: true },
);

schema.index({ category: 1, createdAt: -1 });

// Format attendu par le frontend : id au lieu de _id
schema.set("toJSON", {
  transform: (_doc, ret: Record<string, any>) => {
    ret.id = String(ret._id);
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const GalleryPhoto = model("GalleryPhoto", schema);
