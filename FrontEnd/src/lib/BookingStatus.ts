import type { BookingStatus } from "../types";

export const STATUS_LABEL: Record<
  BookingStatus,
  { label: string; cls: string }
> = {
  en_attente: { label: "En attente", cls: "bg-amber-100 text-amber-800" },
  confirmee: { label: "Confirmée", cls: "bg-green-100 text-green-800" },
  refusee: { label: "Refusée", cls: "bg-red-100 text-red-800" },
  annulee: { label: "Annulée", cls: "bg-gray-200 text-gray-700" },
  terminee: { label: "Terminée", cls: "bg-blue-100 text-blue-800" },
};

// Dates stockées en UTC : on les affiche en UTC pour éviter un décalage d'un jour
export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("fr-FR", {
    timeZone: "UTC",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
