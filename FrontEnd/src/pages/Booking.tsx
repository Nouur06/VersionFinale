import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useRooms } from "../hooks/useRooms";
import { apiError, bookingsApi } from "../services/api";

const nightsBetween = (a: string, b: string) =>
  Math.round((+new Date(b) - +new Date(a)) / 864e5);

export default function Booking() {
  const [params] = useSearchParams();
  const { rooms, loading, error: loadError } = useRooms();
  const [f, setF] = useState({
    room: params.get("room") ?? "",
    checkIn: params.get("checkIn") ?? "",
    checkOut: params.get("checkOut") ?? "",
    guests: Number(params.get("guests")) || 2,
    notes: "",
  });
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState<{
    roomName: string;
    nights: number;
    total: number;
  } | null>(null);

  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const room = rooms.find((r) => r.id === f.room) ?? rooms[0];

  const datesOk = f.checkIn && f.checkOut && f.checkOut > f.checkIn;
  const estimate =
    room && datesOk
      ? nightsBetween(f.checkIn, f.checkOut) * room.pricePerNight
      : null;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!room) return setError("Choisissez une chambre.");
    if (!f.checkIn || !f.checkOut)
      return setError("Choisissez les dates d’arrivée et de départ.");
    if (f.checkIn < today)
      return setError("La date d’arrivée ne peut pas être passée.");
    if (f.checkOut <= f.checkIn)
      return setError("Le départ doit être après l’arrivée.");
    if (!Number.isInteger(f.guests) || f.guests < 1)
      return setError("Le nombre de personnes doit être au moins égal à 1.");
    if (f.guests > room.capacity)
      return setError(
        `Cette chambre accepte au maximum ${room.capacity} personnes.`,
      );

    setError("");
    setSending(true);
    try {
      const b = await bookingsApi.create({
        room: room.id,
        checkIn: f.checkIn,
        checkOut: f.checkOut,
        guests: f.guests,
        ...(f.notes.trim() ? { notes: f.notes.trim() } : {}),
      });
      setDone({
        roomName: room.name,
        nights: nightsBetween(f.checkIn, f.checkOut),
        total: b.total,
      });
    } catch (err) {
      setError(apiError(err));
    } finally {
      setSending(false);
    }
  }

  const field = "w-full rounded-lg border border-gray-300 bg-white p-3";

  if (done) {
    return (
      <div className="mx-auto max-w-xl px-4 py-12">
        <h1 className="mb-6 font-titre text-4xl text-vert">Demande envoyée</h1>
        <p className="rounded-lg bg-green-100 p-4 text-green-800">
          Votre demande pour <strong>{done.roomName}</strong> ({done.nights}{" "}
          nuit
          {done.nights > 1 ? "s" : ""}) est enregistrée. Total :{" "}
          <strong>{done.total.toLocaleString("fr-DZ")} DA</strong>. Elle sera
          confirmée par notre équipe.
        </p>
        <Link
          to="/mes-reservations"
          className="mt-6 inline-block text-vert underline"
        >
          Voir mes réservations
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      <h1 className="mb-6 font-titre text-4xl text-vert">Réserver</h1>
      {loading && <p className="text-gray-600">Chargement des chambres…</p>}
      {loadError && (
        <p role="alert" className="text-red-600">
          {loadError}
        </p>
      )}
      {!loading && !loadError && rooms.length === 0 && (
        <p className="text-gray-600">
          Aucune chambre n’est disponible pour le moment.
        </p>
      )}
      {rooms.length > 0 && (
        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <select
            className={field}
            value={room?.id ?? ""}
            onChange={(e) => setF({ ...f, room: e.target.value })}
            aria-label="Chambre"
          >
            {rooms.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name} ({r.pricePerNight.toLocaleString("fr-DZ")} DA / nuit)
              </option>
            ))}
          </select>
          <div className="grid grid-cols-2 gap-4">
            <input
              className={field}
              type="date"
              min={today}
              value={f.checkIn}
              onChange={(e) => setF({ ...f, checkIn: e.target.value })}
              aria-label="Arrivée"
            />
            <input
              className={field}
              type="date"
              min={f.checkIn || today}
              value={f.checkOut}
              onChange={(e) => setF({ ...f, checkOut: e.target.value })}
              aria-label="Départ"
            />
          </div>
          <input
            className={field}
            type="number"
            min={1}
            max={room?.capacity}
            value={f.guests}
            onChange={(e) => setF({ ...f, guests: +e.target.value })}
            aria-label="Personnes"
          />
          <textarea
            className={field}
            rows={3}
            maxLength={500}
            placeholder="Remarques (facultatif)"
            value={f.notes}
            onChange={(e) => setF({ ...f, notes: e.target.value })}
          />
          {estimate !== null && (
            <p className="text-sm text-gray-700">
              Total estimé :{" "}
              <strong>{estimate.toLocaleString("fr-DZ")} DA</strong>
            </p>
          )}
          {error && (
            <p role="alert" className="text-red-600">
              {error}
            </p>
          )}
          <button
            disabled={sending}
            className="w-full rounded-lg bg-vert px-5 py-3 font-semibold text-white disabled:opacity-60"
          >
            {sending ? "Envoi…" : "Envoyer la demande"}
          </button>
        </form>
      )}
    </div>
  );
}
