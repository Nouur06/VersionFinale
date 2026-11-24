import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const BOOKING_PATH = "/booking";

const links = [
  { to: "/", label: "Accueil" },
  { to: "/chambres", label: "Chambres" },
  { to: "/galerie", label: "Galerie" },
  { to: "/a-propos", label: "Patrimoine" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState<boolean>(false);
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-xs uppercase tracking-[0.18em] transition hover:text-or ${isActive ? "text-or" : ""}`;

  function onLogout() {
    logout();
    setOpen(false);
    navigate("/");
  }

  return (
    <nav className="relative top-0 z-30 border-b border-or/40 bg-vert text-white shadow-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
        <Link
          to="/"
          className="font-titre text-2xl font-semibold uppercase tracking-[0.18em] text-or"
        >
          Dar El Bahdja
        </Link>

        <button
          className="text-2xl md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
          aria-expanded={open}
        >
          ☰
        </button>

        <ul
          className={`${open ? "flex" : "hidden"} absolute left-0 top-full z-10 w-full flex-col gap-5 border-t border-or/40 bg-vert p-6 md:static md:flex md:w-auto md:flex-row md:items-center md:gap-8 md:border-0 md:p-0`}
        >
          {links.map((l) => (
            <li key={l.to}>
              <NavLink
                to={l.to}
                end={l.to === "/"}
                onClick={() => setOpen(false)}
                className={linkClass}
              >
                {l.label}
              </NavLink>
            </li>
          ))}

          {!loading && user && (
            <>
              <li>
                <NavLink
                  to="/mes-reservations"
                  onClick={() => setOpen(false)}
                  className={linkClass}
                >
                  Mes réservations
                </NavLink>
              </li>
              {(user.role === "admin" || user.role === "super_admin") && (
                <li>
                  <NavLink
                    to="/admin"
                    onClick={() => setOpen(false)}
                    className={linkClass}
                  >
                    Administration
                  </NavLink>
                </li>
              )}
              <li>
                <NavLink
                  to="/profil"
                  onClick={() => setOpen(false)}
                  className="text-xs tracking-widest text-white/70 transition hover:text-or"
                >
                  {user.name}
                </NavLink>
              </li>
              <li>
                <button
                  onClick={onLogout}
                  className="text-xs uppercase tracking-[0.18em] transition hover:text-or"
                >
                  Déconnexion
                </button>
              </li>
            </>
          )}
          {!loading && !user && (
            <li>
              <NavLink
                to="/login"
                onClick={() => setOpen(false)}
                className={linkClass}
              >
                Connexion
              </NavLink>
            </li>
          )}

          <li>
            <Link
              to={BOOKING_PATH}
              onClick={() => setOpen(false)}
              className="inline-block border border-or px-5 py-2 text-xs uppercase tracking-[0.18em] text-or transition hover:bg-or hover:text-white"
            >
              Réserver
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
