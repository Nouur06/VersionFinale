import type { GalleryCategory } from "../types";

export const GALLERY_CATEGORIES: { value: GalleryCategory; label: string }[] = [
  { value: "hotel", label: "Notre hôtel" },
  { value: "chambres", label: "Chambres" },
  { value: "alger", label: "Alger et la Casbah" },
  { value: "gastronomie", label: "Gastronomie" },
  { value: "culture", label: "Culture et traditions" },
  { value: "sites", label: "Sites et paysages" },
];

export const categoryLabel = (c: GalleryCategory) =>
  GALLERY_CATEGORIES.find((x) => x.value === c)?.label ?? c;
