import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiError, bookingsApi } from "../services/api";
import type { Booking, BookingStatus } from "../types";

const STATUS: Record<BookingStatus, { label: string; cls: string }> = {
  en_attente: { label: "En attente", cls: "bg-amber-100 text-amber-800" },
  confirmee: { label: "Confirmée", cls: "bg-green-100 text-green-800" },
  refusee: { label: "Refusée", cls: "bg-red-100 text-red-800" },
  annulee: { label: "Annulée", cls: "bg-gray-200 text-gray-700" },
  terminee: { label: "Terminée", cls: "bg-blue-100 text-blue-800" },
};

// Les dates sont stockées en UTC : on les affiche en UTC pour éviter un décalage d'un jour
const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString("fr-FR", {
    timeZone: "UTC",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

export default function MyBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState("");

  useEffect(() => {
    let cancelled = false;
    bookingsApi
      .mine()
      .then((data) => {
        if (!cancelled) setBookings(data);
      })
      .catch((e: unknown) => {
        if (!cancelled) setError(apiError(e));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function cancel(id: string) {
    if (!window.confirm("Annuler cette réservation ?")) return;
    setBusyId(id);
    setError("");
    try {
      const updated = await bookingsApi.cancel(id);
      setBookings((list) =>
        list.map((b) => (b._id === id ? { ...b, status: updated.status } : b)),
      );
    } catch (e) {
      setError(apiError(e));
    } finally {
      setBusyId("");
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-8 font-titre text-4xl text-vert">Mes réservations</h1>
      {loading && <p className="text-gray-600">Chargement…</p>}
      {error && (
        <p role="alert" className="mb-4 text-red-600">
          {error}
        </p>
      )}
      {!loading && bookings.length === 0 && !error && (
        <p className="text-gray-600">
          Vous n’avez pas encore de réservation.{" "}
          <Link to="/chambres" className="text-vert underline">
            Découvrir nos chambres
          </Link>
        </p>
      )}
      <ul className="space-y-4">
        {bookings.map((b) => (
          <li
            key={b._id}
            className="rounded-xl border border-gray-200 bg-white p-5"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-titre text-2xl text-vert">
                {b.room?.name ?? "Chambre supprimée"}
              </h2>
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS[b.status].cls}`}
              >
                {STATUS[b.status].label}
              </span>
            </div>
            <p className="mt-2 text-sm text-gray-700">
              Du {fmt(b.checkIn)} au {fmt(b.checkOut)} · {b.guests} personne
              {b.guests > 1 ? "s" : ""}
            </p>
            <p className="mt-1 text-sm text-gray-700">
              Total : <strong>{b.total.toLocaleString("fr-DZ")} DA</strong>
            </p>
            {b.notes && (
              <p className="mt-1 text-sm italic text-gray-500">« {b.notes} »</p>
            )}
            {b.status === "en_attente" && (
              <button
                onClick={() => cancel(b._id)}
                disabled={busyId === b._id}
                className="mt-4 rounded-lg border border-red-300 px-4 py-2 text-sm text-red-700 hover:bg-red-50 disabled:opacity-60"
              >
                {busyId === b._id ? "Annulation…" : "Annuler"}
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
