import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import RoomImage from "../components/RoomImage";
import { apiError, roomsApi } from "../services/api";
import type { Room } from "../types";

function Detail({ id }: { id: string }) {
  const [params] = useSearchParams();
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    roomsApi
      .get(id)
      .then((r) => {
        if (!cancelled) setRoom(r);
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
  }, [id]);

  if (loading)
    return (
      <p className="mx-auto max-w-3xl px-4 py-12 text-gray-600">Chargement…</p>
    );

  if (!room) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="mb-4 font-titre text-4xl text-vert">
          Chambre introuvable
        </h1>
        {error && error !== "Chambre introuvable" && (
          <p className="mb-4 text-gray-600">{error}</p>
        )}
        <Link to="/chambres" className="text-vert underline">
          Retour aux chambres
        </Link>
      </div>
    );
  }

  // On garde les dates choisies pour pré-remplir la réservation
  const bookingParams = new URLSearchParams({ room: room.id });
  for (const k of ["checkIn", "checkOut", "guests"]) {
    const v = params.get(k);
    if (v) bookingParams.set(k, v);
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <Link to="/chambres" className="text-vert underline">
        ← Toutes les chambres
      </Link>
      <h1 className="mb-4 mt-4 font-titre text-4xl text-vert">{room.name}</h1>
      <RoomImage room={room} className="mb-4 h-72 w-full rounded-xl" />
      {room.photos.length > 1 && (
        <div className="mb-6 grid grid-cols-4 gap-2">
          {room.photos.slice(1, 5).map((p) => (
            <RoomImage
              key={p}
              room={room}
              src={p}
              className="h-20 w-full rounded-lg"
            />
          ))}
        </div>
      )}
      <p className="mb-4 text-gray-700">{room.description}</p>
      <ul className="mb-6 space-y-1 text-gray-700">
        <li>Capacité : {room.capacity} personnes</li>
        <li>Tarif : {room.pricePerNight.toLocaleString("fr-DZ")} DA / nuit</li>
      </ul>
      <Link
        to={`/booking?${bookingParams}`}
        className="inline-block rounded-lg bg-vert px-5 py-3 font-semibold text-white"
      >
        Réserver cette chambre
      </Link>
    </div>
  );
}

export default function RoomDetail() {
  const { id = "" } = useParams();
  // key : recharge proprement quand on passe d'une chambre à l'autre
  return <Detail key={id} id={id} />;
}
