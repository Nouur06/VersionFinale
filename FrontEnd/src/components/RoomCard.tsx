import { Link } from "react-router-dom";
import RoomImage from "./RoomImage";
import type { Room } from "../types";

interface RoomCardProps {
  room: Room;
  search?: string; // ex. "?checkIn=...&checkOut=..." transmis à la page détail
}

export default function RoomCard({ room, search = "" }: RoomCardProps) {
  const to = `/chambres/${room.id}${search}`;
  return (
    <article className="group overflow-hidden bg-white shadow-md transition hover:shadow-xl">
      <Link to={to} className="block overflow-hidden">
        <RoomImage
          room={room}
          className="h-64 w-full transition duration-700 group-hover:scale-105"
        />
      </Link>
      <div className="p-6 text-center">
        <h3 className="font-titre text-2xl text-vert">{room.name}</h3>
        <div className="mx-auto my-3 h-px w-10 bg-or" />
        <p className="line-clamp-2 text-sm text-gray-600">{room.description}</p>
        <p className="mt-4 text-xs uppercase tracking-[0.18em] text-or-fonce">
          À partir de{" "}
          <span className="font-semibold">
            {room.pricePerNight.toLocaleString("fr-DZ")} DA
          </span>{" "}
          / nuit
        </p>
        <Link
          to={to}
          className="mt-5 inline-block border border-vert px-7 py-2 text-xs uppercase tracking-[0.18em] text-vert transition hover:bg-vert hover:text-white"
        >
          Découvrir
        </Link>
      </div>
    </article>
  );
}
