import { useCallback, useEffect, useState } from "react";
import { apiError } from "../services/api";

/**
 * Charge des données au montage et permet de les recharger (`reload`) après une action.
 * `fetcher` doit être stable (fonction du module ou useCallback).
 */
export function useAsyncData<T>(fetcher: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const reload = useCallback(
    () =>
      fetcher()
        .then((d) => {
          setData(d);
          setError("");
        })
        .catch((e: unknown) => setError(apiError(e)))
        .finally(() => setLoading(false)),
    [fetcher],
  );

  useEffect(() => {
    reload();
  }, [reload]);

  return { data, loading, error, reload };
}
