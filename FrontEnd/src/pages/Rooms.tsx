import { useSearchParams } from "react-router-dom";
import RoomCard from "../components/RoomCard";
import { useRooms } from "../hooks/useRooms";

function RoomsList({
  checkIn,
  checkOut,
  guests,
}: {
  checkIn: string;
  checkOut: string;
  guests: string;
}) {
  const { rooms, loading, error } = useRooms({ checkIn, checkOut, guests });
  const searching = Boolean(checkIn && checkOut);
  const qs = searching
    ? `?${new URLSearchParams({ checkIn, checkOut, ...(guests ? { guests } : {}) })}`
    : "";

  if (loading) return <p className="text-gray-600">Chargement des chambres…</p>;
  if (error)
    return (
      <p role="alert" className="text-red-600">
        {error}
      </p>
    );
  if (rooms.length === 0)
    return (
      <p className="text-gray-600">
        {searching
          ? "Aucune chambre disponible pour ces dates."
          : "Aucune chambre pour le moment."}
      </p>
    );

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {rooms.map((room) => (
        <RoomCard key={room.id} room={room} search={qs} />
      ))}
    </div>
  );
}

export default function Rooms() {
  const [params] = useSearchParams();
  const checkIn = params.get("checkIn") ?? "";
  const checkOut = params.get("checkOut") ?? "";
  const guests = params.get("guests") ?? "";
  const searching = Boolean(checkIn && checkOut);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="mb-2 font-titre text-4xl text-vert">
        Nos chambres et suites
      </h1>
      {searching && (
        <p className="mb-8 text-sm text-gray-600">
          Disponibles du {checkIn} au {checkOut}
          {guests ? ` pour ${guests} personne(s)` : ""}.
        </p>
      )}
      {!searching && <div className="mb-8" />}
      {/* key : relance proprement le chargement quand la recherche change */}
      <RoomsList
        key={`${checkIn}|${checkOut}|${guests}`}
        checkIn={checkIn}
        checkOut={checkOut}
        guests={guests}
      />
    </div>
  );
}
