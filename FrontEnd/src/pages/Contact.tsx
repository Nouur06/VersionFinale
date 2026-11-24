import { Link, useSearchParams } from "react-router-dom";
import { getTheme } from "../content/heritage";
import { hotel } from "../content/hotel";

export default function Contact() {
  const [params] = useSearchParams();
  const theme = getTheme(params.get("theme") ?? undefined);
  const type = params.get("type");
  const { phone, email, address, hours } = hotel.contact;
  const rows = [
    ["Téléphone", phone],
    ["E-mail", email],
    ["Adresse", address],
    ["Horaires de la réception", hours],
  ].filter(([, value]) => value);

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-6 font-titre text-4xl text-vert">Contact</h1>

      {theme && (type === "guide" || type === "conseil") && (
        <section className="mb-8 border-l-4 border-or bg-white p-6 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-or-fonce">
            {type === "guide" ? "Demande de visite guidée" : "Demande de conseils"}
          </p>
          <p className="mt-2 font-titre text-2xl text-vert">{theme.title}</p>
          <p className="mt-3 text-gray-700">
            Contactez la réception en indiquant ce thème, vos dates de séjour, le nombre de personnes
            {type === "guide" ? " et la langue souhaitée pour la visite" : ""}. Nous reviendrons vers vous
            avec une proposition.
          </p>
        </section>
      )}

      <p className="text-gray-700">
        Pour toute question concernant votre séjour, contactez notre équipe.
      </p>

      {rows.length > 0 ? (
        <dl className="mt-8 divide-y divide-gray-200 border-y border-gray-200">
          {rows.map(([label, value]) => (
            <div key={label} className="grid gap-1 py-4 sm:grid-cols-3">
              <dt className="text-xs font-medium uppercase tracking-[0.18em] text-or-fonce">{label}</dt>
              <dd className="text-gray-800 sm:col-span-2">{value}</dd>
            </div>
          ))}
        </dl>
      ) : (
        <p className="mt-6 text-gray-600">Adressez-vous directement à la réception de l’hôtel.</p>
      )}

      <p className="mt-10">
        <Link to="/a-propos" className="text-vert underline">
          Retour au patrimoine
        </Link>
      </p>
    </main>
  );
}
