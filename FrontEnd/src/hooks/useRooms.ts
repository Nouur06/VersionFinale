import { useEffect, useState } from "react";
import { apiError, roomsApi } from "../services/api";
import type { Room, RoomSearch } from "../types";

/** Charge les chambres. Pour une recherche différente, remonter le composant avec une `key`. */
export function useRooms(search: RoomSearch = {}) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { checkIn, checkOut, guests } = search;
  useEffect(() => {
    let cancelled = false;
    roomsApi
      .list({ checkIn, checkOut, guests })
      .then((data) => {
        if (!cancelled) setRooms(data);
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
  }, [checkIn, checkOut, guests]);

  return { rooms, loading, error };
}
