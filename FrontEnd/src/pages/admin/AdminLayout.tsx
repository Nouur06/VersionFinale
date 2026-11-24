import { NavLink, Outlet } from "react-router-dom";

const tabs = [
  { to: "/admin", label: "Tableau de bord", end: true },
  { to: "/admin/reservations", label: "Réservations", end: false },
  { to: "/admin/chambres", label: "Chambres", end: false },
  { to: "/admin/galerie", label: "Galerie", end: false },
  { to: "/admin/utilisateurs", label: "Utilisateurs", end: false },
];

export default function AdminLayout() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-6 font-titre text-4xl text-vert">Administration</h1>
      <nav className="mb-8 flex flex-wrap gap-1 border-b border-gray-200">
        {tabs.map((t) => (
          <NavLink
            key={t.to}
            to={t.to}
            end={t.end}
            className={({ isActive }) =>
              `-mb-px border-b-2 px-4 py-2 text-sm ${
                isActive
                  ? "border-or font-semibold text-vert"
                  : "border-transparent text-gray-600 hover:text-vert"
              }`
            }
          >
            {t.label}
          </NavLink>
        ))}
      </nav>
      <Outlet />
    </div>
  );
}
