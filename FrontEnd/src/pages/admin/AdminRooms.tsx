import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import RoomImage from "../../components/RoomImage";
import { useAsyncData } from "../../hooks/useAsyncData";
import { adminApi, apiError } from "../../services/api";
import type { Room, RoomInput } from "../../types";

const ALLOWED = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024; // 5 Mo, comme côté serveur
const field = "w-full rounded-lg border border-gray-300 bg-white p-3";

function RoomPhotos({
  room,
  onChange,
}: {
  room: Room;
  onChange: (r: Room) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onPick(e: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = ""; // permet de re-choisir le même fichier
    if (files.length === 0) return;
    if (files.length > 8) return setError("8 images maximum par envoi.");
    if (files.some((f) => !ALLOWED.includes(f.type)))
      return setError("Format accepté : JPG, PNG ou WebP.");
    if (files.some((f) => f.size > MAX_SIZE))
      return setError("Image trop lourde (5 Mo maximum).");
    setError("");
    setBusy(true);
    try {
      onChange(await adminApi.uploadPhotos(room.id, files));
    } catch (err) {
      setError(apiError(err));
    } finally {
      setBusy(false);
    }
  }

  async function remove(photo: string) {
    if (!window.confirm("Supprimer cette photo ?")) return;
    setBusy(true);
    setError("");
    try {
      onChange(await adminApi.removePhoto(room.id, photo));
    } catch (err) {
      setError(apiError(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-6 border-t border-gray-200 pt-6">
      <h3 className="mb-3 font-titre text-xl text-vert">Photos</h3>
      {room.photos.length === 0 && (
        <p className="mb-3 text-sm text-gray-600">
          Aucune photo pour le moment.
        </p>
      )}
      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {room.photos.map((p) => (
          <div key={p} className="relative">
            <RoomImage room={room} src={p} className="h-28 w-full rounded-lg" />
            <button
              type="button"
              disabled={busy}
              onClick={() => remove(p)}
              aria-label="Supprimer la photo"
              className="absolute right-1 top-1 rounded-full bg-white/90 px-2 text-red-700 shadow hover:bg-white disabled:opacity-60"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <label className="inline-block cursor-pointer rounded-lg border border-vert px-4 py-2 text-sm text-vert hover:bg-vert hover:text-white">
        {busy ? "Envoi…" : "Ajouter des photos"}
        <input
          type="file"
          multiple
          accept={ALLOWED.join(",")}
          onChange={onPick}
          disabled={busy}
          className="hidden"
        />
      </label>
      <p className="mt-2 text-xs text-gray-500">
        JPG, PNG ou WebP · 5 Mo max · 8 photos par envoi
      </p>
      {error && (
        <p role="alert" className="mt-2 text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

function RoomForm({
  room,
  onSaved,
  onCancel,
}: {
  room: Room | null;
  onSaved: (r: Room) => void;
  onCancel: () => void;
}) {
  const [f, setF] = useState<RoomInput>({
    name: room?.name ?? "",
    type: room?.type || "double",
    description: room?.description ?? "",
    capacity: room?.capacity ?? 2,
    price: room?.price ?? 0,
    available: room?.available ?? true,
  });
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (f.name.trim().length < 2)
      return setError("Le nom est requis (2 caractères minimum).");
    if (!Number.isInteger(f.capacity) || f.capacity < 1)
      return setError("La capacité doit être au moins 1.");
    if (!(f.price >= 0)) return setError("Le prix doit être positif.");
    setError("");
    setSending(true);
    try {
      const data = { ...f, name: f.name.trim() };
      onSaved(
        room
          ? await adminApi.updateRoom(room.id, data)
          : await adminApi.createRoom(data),
      );
    } catch (err) {
      setError(apiError(err));
    } finally {
      setSending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <input
          className={field}
          placeholder="Nom de la chambre"
          value={f.name}
          onChange={(e) => setF({ ...f, name: e.target.value })}
        />
        <select
          className={field}
          aria-label="Type"
          value={f.type}
          onChange={(e) => setF({ ...f, type: e.target.value })}
        >
          {["double", "twin", "suite", "familiale"].map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <label className="text-sm text-gray-700">
          Capacité (personnes)
          <input
            className={`${field} mt-1`}
            type="number"
            min={1}
            value={f.capacity}
            onChange={(e) => setF({ ...f, capacity: +e.target.value })}
          />
        </label>
        <label className="text-sm text-gray-700">
          Prix par nuit (DA)
          <input
            className={`${field} mt-1`}
            type="number"
            min={0}
            value={f.price}
            onChange={(e) => setF({ ...f, price: +e.target.value })}
          />
        </label>
      </div>
      <textarea
        className={field}
        rows={3}
        placeholder="Description"
        value={f.description}
        onChange={(e) => setF({ ...f, description: e.target.value })}
      />
      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input
          type="checkbox"
          checked={f.available}
          onChange={(e) => setF({ ...f, available: e.target.checked })}
        />
        Visible et réservable par les clients
      </label>
      {error && (
        <p role="alert" className="text-red-600">
          {error}
        </p>
      )}
      <div className="flex gap-3">
        <button
          disabled={sending}
          className="rounded-lg bg-vert px-5 py-2 font-semibold text-white disabled:opacity-60"
        >
          {sending
            ? "Enregistrement…"
            : room
              ? "Enregistrer"
              : "Créer la chambre"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-gray-300 px-5 py-2 text-gray-700"
        >
          Fermer
        </button>
      </div>
    </form>
  );
}

export default function AdminRooms() {
  const { data: rooms, loading, error, reload } = useAsyncData(adminApi.rooms);
  const [editing, setEditing] = useState<Room | "new" | null>(null);
  const [notice, setNotice] = useState("");

  function onRoomChange(r: Room) {
    setEditing(r);
    setNotice("");
    reload();
  }

  async function remove(r: Room) {
    if (!window.confirm(`Supprimer « ${r.name} » ?`)) return;
    try {
      const { archived } = await adminApi.deleteRoom(r.id);
      setNotice(
        archived
          ? `« ${r.name} » a des réservations : elle a été masquée (archivée) au lieu d’être supprimée.`
          : `« ${r.name} » a été supprimée.`,
      );
      if (editing !== "new" && editing?.id === r.id) setEditing(null);
      await reload();
    } catch (e) {
      setNotice(apiError(e));
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-gray-600">
          {rooms ? `${rooms.length} chambre(s)` : ""}
        </p>
        <button
          onClick={() => {
            setEditing("new");
            setNotice("");
          }}
          className="rounded-lg bg-vert px-5 py-2 text-sm font-semibold text-white"
        >
          + Nouvelle chambre
        </button>
      </div>

      {notice && (
        <p className="mb-4 rounded-lg bg-amber-50 p-3 text-amber-900">
          {notice}
        </p>
      )}

      {editing && (
        <section className="mb-8 rounded-xl border border-or/40 bg-white p-6">
          <h2 className="mb-4 font-titre text-2xl text-vert">
            {editing === "new"
              ? "Nouvelle chambre"
              : `Modifier : ${editing.name}`}
          </h2>
          <RoomForm
            key={editing === "new" ? "new" : editing.id}
            room={editing === "new" ? null : editing}
            onSaved={onRoomChange}
            onCancel={() => setEditing(null)}
          />
          {editing !== "new" ? (
            <RoomPhotos
              key={editing.id}
              room={editing}
              onChange={onRoomChange}
            />
          ) : (
            <p className="mt-4 text-sm text-gray-500">
              Vous pourrez ajouter des photos après la création.
            </p>
          )}
        </section>
      )}

      {loading && <p className="text-gray-600">Chargement…</p>}
      {error && (
        <p role="alert" className="text-red-600">
          {error}
        </p>
      )}
      <ul className="space-y-3">
        {rooms?.map((r) => (
          <li
            key={r.id}
            className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4"
          >
            <RoomImage room={r} className="h-16 w-24 shrink-0 rounded-lg" />
            <div className="min-w-0 flex-1">
              <p className="truncate font-titre text-xl text-vert">
                {r.name}{" "}
                {!r.available && (
                  <span className="ml-2 rounded-full bg-gray-200 px-2 py-0.5 align-middle text-xs text-gray-700">
                    Masquée
                  </span>
                )}
              </p>
              <p className="text-sm text-gray-600">
                {r.type} · {r.capacity} pers. ·{" "}
                {r.price.toLocaleString("fr-DZ")} DA / nuit · {r.photos.length}{" "}
                photo{r.photos.length > 1 ? "s" : ""}
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <button
                onClick={() => {
                  setEditing(r);
                  setNotice("");
                }}
                className="rounded-lg border border-vert px-3 py-1 text-sm text-vert hover:bg-vert hover:text-white"
              >
                Modifier
              </button>
              <button
                onClick={() => remove(r)}
                className="rounded-lg border border-red-300 px-3 py-1 text-sm text-red-700 hover:bg-red-50"
              >
                Supprimer
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
