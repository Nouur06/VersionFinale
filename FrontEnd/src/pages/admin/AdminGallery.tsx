import { useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useAsyncData } from "../../hooks/useAsyncData";
import { apiError, assetUrl, galleryApi } from "../../services/api";
import { GALLERY_CATEGORIES } from "../../lib/galleryCategories";
import type { GalleryCategory, GalleryPhoto } from "../../types";

const ALLOWED = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024; // 5 Mo, comme côté serveur
const field = "w-full rounded-lg border border-gray-300 bg-white p-2 text-sm";

function Item({ photo, onChanged, onError }: { photo: GalleryPhoto; onChanged: () => void; onError: (m: string) => void }) {
  const [caption, setCaption] = useState(photo.caption);
  const [busy, setBusy] = useState(false);

  async function run(action: () => Promise<unknown>) {
    setBusy(true);
    try {
      await action();
      onChanged();
    } catch (e) {
      onError(apiError(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <li className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <img src={assetUrl(photo.url)} alt={photo.caption || "Photo de la galerie"} loading="lazy" className="h-40 w-full object-cover" />
      <div className="space-y-2 p-3">
        <select
          aria-label="Catégorie"
          className={field}
          value={photo.category}
          disabled={busy}
          onChange={(e) => run(() => galleryApi.update(photo.id, { category: e.target.value as GalleryCategory }))}
        >
          {GALLERY_CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
        <input
          aria-label="Légende"
          className={field}
          placeholder="Légende (facultatif)"
          maxLength={120}
          value={caption}
          disabled={busy}
          onChange={(e) => setCaption(e.target.value)}
          onBlur={() => {
            if (caption.trim() !== photo.caption) run(() => galleryApi.update(photo.id, { caption: caption.trim() }));
          }}
        />
        <button
          type="button"
          disabled={busy}
          onClick={() => {
            if (window.confirm("Supprimer cette photo de la galerie ?")) run(() => galleryApi.remove(photo.id));
          }}
          className="w-full rounded-lg border border-red-300 px-3 py-1 text-sm text-red-700 hover:bg-red-50 disabled:opacity-60"
        >
          Supprimer
        </button>
      </div>
    </li>
  );
}

export default function AdminGallery() {
  const { data: photos, loading, error, reload } = useAsyncData(galleryApi.list);
  const [files, setFiles] = useState<File[]>([]);
  const [category, setCategory] = useState<GalleryCategory>("hotel");
  const [caption, setCaption] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const input = useRef<HTMLInputElement>(null);

  function onPick(e: ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files ?? []);
    setMsg(null);
    if (picked.length > 8) return setMsg({ ok: false, text: "8 images maximum par envoi." });
    if (picked.some((f) => !ALLOWED.includes(f.type))) return setMsg({ ok: false, text: "Format accepté : JPG, PNG ou WebP." });
    if (picked.some((f) => f.size > MAX_SIZE)) return setMsg({ ok: false, text: "Image trop lourde (5 Mo maximum)." });
    setFiles(picked);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (files.length === 0) return setMsg({ ok: false, text: "Choisissez au moins une photo." });
    setBusy(true);
    setMsg(null);
    try {
      const created = await galleryApi.upload(files, category, caption);
      setFiles([]);
      setCaption("");
      if (input.current) input.current.value = "";
      setMsg({ ok: true, text: `${created.length} photo${created.length > 1 ? "s ajoutées" : " ajoutée"} à la galerie.` });
      await reload();
    } catch (err) {
      setMsg({ ok: false, text: apiError(err) });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <form onSubmit={onSubmit} className="mb-8 space-y-4 rounded-xl border border-or/40 bg-white p-6" noValidate>
        <h2 className="font-titre text-2xl text-vert">Ajouter des photos</h2>
        <input
          ref={input}
          type="file"
          multiple
          accept={ALLOWED.join(",")}
          aria-label="Photos à ajouter"
          onChange={onPick}
          disabled={busy}
          className="block w-full text-sm"
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-sm text-gray-700">
            Catégorie
            <select
              className={`${field} mt-1`}
              value={category}
              onChange={(e) => setCategory(e.target.value as GalleryCategory)}
            >
              {GALLERY_CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm text-gray-700">
            Légende (facultatif, appliquée à toutes les photos choisies)
            <input
              className={`${field} mt-1`}
              maxLength={120}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
          </label>
        </div>
        <p className="text-xs text-gray-500">JPG, PNG ou WebP · 5 Mo max par photo · 8 photos par envoi</p>
        {msg && (
          <p role={msg.ok ? "status" : "alert"} className={msg.ok ? "text-green-700" : "text-red-600"}>
            {msg.text}
          </p>
        )}
        <button disabled={busy} className="rounded-lg bg-vert px-5 py-2 text-sm font-semibold text-white disabled:opacity-60">
          {busy ? "Envoi…" : files.length > 0 ? `Envoyer ${files.length} photo${files.length > 1 ? "s" : ""}` : "Envoyer"}
        </button>
      </form>

      {loading && <p className="text-gray-600">Chargement…</p>}
      {error && (
        <p role="alert" className="text-red-600">
          {error}
        </p>
      )}
      {photos && photos.length === 0 && <p className="text-gray-600">La galerie est vide pour le moment.</p>}
      {photos && photos.length > 0 && (
        <>
          <p className="mb-4 text-gray-600">{photos.length} photo(s)</p>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {photos.map((p) => (
              <Item
                key={p.id}
                photo={p}
                onChanged={reload}
                onError={(text) => setMsg({ ok: false, text })}
              />
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
