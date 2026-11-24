import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="font-titre text-6xl text-or">404</p>
      <h1 className="mt-4 font-titre text-3xl text-vert">Page introuvable</h1>
      <p className="mt-3 text-gray-600">
        Cette page n'existe pas ou a été déplacée.
      </p>
      <Link
        to="/"
        className="mt-8 inline-block rounded-lg bg-vert px-5 py-3 font-semibold text-white"
      >
        Retour à l’accueil
      </Link>
    </div>
  );
}
