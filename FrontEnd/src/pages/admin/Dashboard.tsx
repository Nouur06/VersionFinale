import { Link } from "react-router-dom";
import { useAsyncData } from "../../hooks/useAsyncData";
import { adminApi } from "../../services/api";
import { STATUS_LABEL } from "../../lib/BookingStatus";
import type { BookingStatus } from "../../types";

const ORDER: BookingStatus[] = [
  "en_attente",
  "confirmee",
  "terminee",
  "refusee",
  "annulee",
];

export default function Dashboard() {
  const { data: stats, loading, error } = useAsyncData(adminApi.stats);

  if (loading) return <p className="text-gray-600">Chargement…</p>;
  if (error || !stats)
    return (
      <p role="alert" className="text-red-600">
        {error || "Statistiques indisponibles."}
      </p>
    );

  const pending = stats.bookings.en_attente ?? 0;
  const total = ORDER.reduce((sum, s) => sum + (stats.bookings[s] ?? 0), 0);

  return (
    <div className="space-y-8">
      {pending > 0 ? (
        <Link
          to="/admin/reservations"
          className="block rounded-xl border border-amber-300 bg-amber-50 p-5 text-amber-900 hover:bg-amber-100"
        >
          <strong>{pending}</strong> demande{pending > 1 ? "s" : ""} de
          réservation en attente de réponse →
        </Link>
      ) : (
        <p className="rounded-xl border border-green-200 bg-green-50 p-5 text-green-800">
          Aucune demande en attente.
        </p>
      )}

      <section>
        <h2 className="mb-3 font-titre text-2xl text-vert">
          Réservations ({total})
        </h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          {ORDER.map((s) => (
            <div
              key={s}
              className="rounded-xl border border-gray-200 bg-white p-4 text-center"
            >
              <p className="text-3xl font-semibold text-vert">
                {stats.bookings[s] ?? 0}
              </p>
              <p
                className={`mt-2 inline-block rounded-full px-3 py-1 text-xs ${STATUS_LABEL[s].cls}`}
              >
                {STATUS_LABEL[s].label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 font-titre text-2xl text-vert">Comptes</h2>
        <div className="grid grid-cols-3 gap-4">
          {[
            ["Clients", stats.clients],
            ["Admins", stats.admins],
            ["Super admins", stats.superAdmins],
          ].map(([label, n]) => (
            <div
              key={label}
              className="rounded-xl border border-gray-200 bg-white p-4 text-center"
            >
              <p className="text-3xl font-semibold text-vert">{n}</p>
              <p className="mt-2 text-sm text-gray-600">{label}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
