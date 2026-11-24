import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-24 bg-vert text-white">
      <div className="mx-auto max-w-6xl px-4 py-14 text-center">
        <p className="font-titre text-3xl uppercase tracking-[0.18em] text-or">
          Dar El Bahdja
        </p>
        <p lang="ar" dir="rtl" className="mt-2 text-lg">
          دار البهجة
        </p>
        <div className="mx-auto my-6 h-px w-16 bg-or" />
        <p className="text-sm text-gray-300">
          L'hospitalité algérienne, au cœur du patrimoine.
        </p>
        <ul className="mt-6 flex flex-wrap justify-center gap-6 text-xs uppercase tracking-[0.18em] text-gray-300">
          <li>
            <Link to="/chambres" className="hover:text-or">
              Chambres
            </Link>
          </li>
          <li>
            <Link to="/galerie" className="hover:text-or">
              Galerie
            </Link>
          </li>
          <li>
            <Link to="/a-propos" className="hover:text-or">
              Patrimoine
            </Link>
          </li>
          <li>
            <Link to="/contact" className="hover:text-or">
              Contact
            </Link>
          </li>
        </ul>
        <p className="mt-10 text-xs text-gray-400">
          © {new Date().getFullYear()} Dar El Bahdja. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
}
