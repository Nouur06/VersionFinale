import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAsyncData } from "../hooks/useAsyncData";
import { assetUrl, galleryApi } from "../services/api";
import { GALLERY_CATEGORIES, categoryLabel } from "../lib/galleryCategories";
import type { GalleryCategory, GalleryPhoto } from "../types";

function Lightbox({
  photos,
  index,
  onClose,
  onChange,
}: {
  photos: GalleryPhoto[];
  index: number;
  onClose: () => void;
  onChange: (i: number) => void;
}) {
  const photo = photos[index];
  const count = photos.length;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onChange((index - 1 + count) % count);
      if (e.key === "ArrowRight") onChange((index + 1) % count);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden"; // bloque le défilement de la page derrière
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [index, count, onClose, onChange]);

  if (!photo) return null;
  const btn = "absolute rounded-full bg-white/10 px-4 py-2 text-2xl text-white hover:bg-white/25";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Agrandissement de la photo"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
      onClick={onClose}
    >
      <button type="button" aria-label="Fermer" autoFocus onClick={onClose} className={`${btn} right-4 top-4`}>
        ×
      </button>
      {count > 1 && (
        <>
          <button
            type="button"
            aria-label="Photo précédente"
            onClick={(e) => {
              e.stopPropagation();
              onChange((index - 1 + count) % count);
            }}
            className={`${btn} left-4 top-1/2 -translate-y-1/2`}
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Photo suivante"
            onClick={(e) => {
              e.stopPropagation();
              onChange((index + 1) % count);
            }}
            className={`${btn} right-4 top-1/2 -translate-y-1/2`}
          >
            ›
          </button>
        </>
      )}
      <figure className="max-h-full max-w-5xl text-center" onClick={(e) => e.stopPropagation()}>
        <img
          src={assetUrl(photo.url)}
          alt={photo.caption || categoryLabel(photo.category)}
          className="mx-auto max-h-[80vh] max-w-full object-contain"
        />
        <figcaption className="mt-3 text-white">
          {photo.caption && <span className="font-titre text-xl">{photo.caption}</span>}
          <span className="ml-3 text-sm text-white/70">
            {categoryLabel(photo.category)} · {index + 1}/{count}
          </span>
        </figcaption>
      </figure>
    </div>
  );
}

export default function Gallery() {
  const { data, loading, error } = useAsyncData(galleryApi.list);
  const [filter, setFilter] = useState<"" | GalleryCategory>("");
  const [open, setOpen] = useState<number | null>(null);
  const close = useCallback(() => setOpen(null), []);

  const photos = data ?? [];
  const present = GALLERY_CATEGORIES.filter((c) => photos.some((p) => p.category === c.value));
  const shown = filter ? photos.filter((p) => p.category === filter) : photos;

  const chip = (active: boolean) =>
    `rounded-full border px-4 py-1 text-sm transition ${
      active ? "border-vert bg-vert text-white" : "border-gray-300 text-gray-700 hover:border-vert"
    }`;

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-or-fonce">Galerie</p>
      <h1 className="mb-3 font-titre text-4xl text-vert sm:text-5xl">L’hôtel et l’Algérie en images</h1>
      <p className="mb-8 max-w-2xl text-gray-600">
        Nos chambres, notre table, la Casbah et les paysages d’Algérie : un avant-goût de votre séjour.
      </p>

      {loading && <p className="text-gray-600">Chargement des photos…</p>}
      {error && (
        <p role="alert" className="text-red-600">
          {error}
        </p>
      )}

      {!loading && !error && photos.length === 0 && (
        <div className="border border-dashed border-or/60 bg-white p-10 text-center">
          <p className="font-titre text-2xl text-vert">Les photos arrivent bientôt</p>
          <p className="mt-2 text-gray-600">En attendant, partez à la découverte du patrimoine algérien.</p>
          <Link to="/a-propos" className="mt-6 inline-block text-vert underline">
            Découvrir le patrimoine
          </Link>
        </div>
      )}

      {photos.length > 0 && (
        <>
          <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label="Filtrer par catégorie">
            <button type="button" aria-pressed={filter === ""} onClick={() => setFilter("")} className={chip(filter === "")}>
              Toutes ({photos.length})
            </button>
            {present.map((c) => (
              <button
                key={c.value}
                type="button"
                aria-pressed={filter === c.value}
                onClick={() => setFilter(c.value)}
                className={chip(filter === c.value)}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
            {shown.map((p, i) => (
              <figure key={p.id} className="mb-4 break-inside-avoid overflow-hidden bg-white shadow-sm">
                <button
                  type="button"
                  onClick={() => setOpen(i)}
                  aria-label={`Agrandir : ${p.caption || categoryLabel(p.category)}`}
                  className="group block w-full overflow-hidden"
                >
                  <img
                    src={assetUrl(p.url)}
                    alt={p.caption || categoryLabel(p.category)}
                    loading="lazy"
                    className="h-auto w-full transition duration-700 group-hover:scale-105"
                  />
                </button>
                {p.caption && <figcaption className="p-3 font-titre text-lg text-vert">{p.caption}</figcaption>}
              </figure>
            ))}
          </div>
        </>
      )}

      {open !== null && shown.length > 0 && (
        <Lightbox photos={shown} index={Math.min(open, shown.length - 1)} onClose={close} onChange={setOpen} />
      )}
    </main>
  );
}
