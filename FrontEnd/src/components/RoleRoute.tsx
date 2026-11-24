import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import type { Role } from "../types";

/** Réserve les pages enfants à certains rôles (ex. admin et super_admin). */
export default function RoleRoute({ roles }: { roles: Role[] }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading)
    return <p className="px-4 py-12 text-center text-gray-600">Chargement…</p>;
  if (!user)
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (!roles.includes(user.role)) return <Navigate to="/" replace />;
  return <Outlet />;
}
