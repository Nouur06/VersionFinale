import { assetUrl } from "../services/api";
import type { Room } from "../types";

interface RoomImageProps {
  room: Room;
  className?: string;
  src?: string; // photo précise (sinon la première)
}

/** Affiche la photo de la chambre, ou un dégradé si aucune photo n'a été envoyée. */
export default function RoomImage({
  room,
  className = "",
  src,
}: RoomImageProps) {
  const photo = src ?? room.photos[0];
  if (!photo) {
    return (
      <div
        className={`bg-linear-to-br from-vert to-or/70 ${className}`}
        role="img"
        aria-label={room.name}
      />
    );
  }
  return (
    <img
      src={assetUrl(photo)}
      alt={room.name}
      className={`object-cover ${className}`}
    />
  );
}
