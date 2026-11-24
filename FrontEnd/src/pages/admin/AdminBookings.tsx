import { useCallback, useState } from "react";
import { useAsyncData } from "../../hooks/useAsyncData";
import { adminApi, apiError } from "../../services/api";
import { STATUS_LABEL, formatDate } from "../../lib/BookingStatus";
import type { BookingStatus } from "../../types";

const FILTERS: { value: "" | BookingStatus; label: string }[] = [
  { value: "", label: "Toutes" },
  { value: "en_attente", label: "En attente" },
  { value: "confirmee", label: "Confirmées" },
  { value: "terminee", label: "Terminées" },
  { value: "refusee", label: "Refusées" },
  { value: "annulee", label: "Annulées" },
];

// Transitions autorisées par le back-end
const ACTIONS: Partial<Record<BookingStatus, { to: BookingStatus; label: string; danger?: boolean }[]>> = {
  en_attente: [
    { to: "confirmee", label: "Confirmer" },
    { to: "refusee", label: "Refuser", danger: true },
  ],
  confirmee: [
    { to: "terminee", label: "Marquer terminée" },
    { to: "annulee", label: "Annuler", danger: true },
  ],
};

function BookingsList({ status }: { status: string }) {
  const fetcher = useCallback(() => adminApi.bookings(status), [status]);
  const { data, loading, error, reload } = useAsyncData(fetcher);
  const [busyId, setBusyId] = useState("");
  const [actionError, setActionError] = useState("");

  async function act(id: string, to: BookingStatus, danger?: boolean) {
    if (danger && !window.confirm("Confirmer cette action ?")) return;
    setBusyId(id);
    setActionError("");
    try {
      await adminApi.setBookingStatus(id, to);
      await reload();
    } catch (e) {
      setActionError(apiError(e));
    } finally {
      setBusyId("");
    }
  }

  if (loading) return <p className="text-gray-600">Chargement…</p>;
  if (error)
    return (
      <p role="alert" className="text-red-600">
        {error}
      </p>
    );
  if (!data || data.length === 0) return <p className="text-gray-600">Aucune réservation.</p>;

  return (
    <>
      {actionError && (
        <p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-red-700">
          {actionError}
        </p>
      )}
      <ul className="space-y-3">
        {data.map((b) => (
          <li key={b._id} className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h3 className="font-titre text-xl text-vert">{b.room?.name ?? "Chambre supprimée"}</h3>
                <p className="text-sm text-gray-700">
                  {b.client ? `${b.client.name} · ${b.client.email}` : "Client supprimé"}
                </p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_LABEL[b.status].cls}`}>
                {STATUS_LABEL[b.status].label}
              </span>
            </div>
            <p className="mt-2 text-sm text-gray-700">
              Du {formatDate(b.checkIn)} au {formatDate(b.checkOut)} · {b.guests} pers. ·{" "}
              <strong>{b.total.toLocaleString("fr-DZ")} DA</strong>
            </p>
            {b.notes && <p className="mt-1 text-sm italic text-gray-500">« {b.notes} »</p>}
            {(ACTIONS[b.status] ?? []).length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {ACTIONS[b.status]!.map((a) => (
                  <button
                    key={a.to}
                    disabled={busyId === b._id}
                    onClick={() => act(b._id, a.to, a.danger)}
                    className={
                      a.danger
                        ? "rounded-lg border border-red-300 px-4 py-2 text-sm text-red-700 hover:bg-red-50 disabled:opacity-60"
                        : "rounded-lg bg-vert px-4 py-2 text-sm text-white disabled:opacity-60"
                    }
                  >
                    {a.label}
                  </button>
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
    </>
  );
}

export default function AdminBookings() {
  const [status, setStatus] = useState("");
  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setStatus(f.value)}
            className={`rounded-full border px-4 py-1 text-sm ${
              status === f.value
                ? "border-vert bg-vert text-white"
                : "border-gray-300 text-gray-700 hover:border-vert"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
      {/* key : relance le chargement quand le filtre change */}
      <BookingsList key={status} status={status} />
    </div>
  );
}
