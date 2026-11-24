import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import HeritageImage from "../components/HeritageImage";
import NotFound from "./NotFound";
import { getTheme, themes } from "../content/heritage";
import type { HeritageTheme } from "../content/heritage";

const eyebrow = "text-xs font-medium uppercase tracking-[0.18em] text-or-fonce";
const btnOr =
  "inline-block border border-or bg-or px-7 py-3 text-xs font-medium uppercase tracking-[0.18em] text-white transition hover:bg-transparent hover:text-or-fonce";
const btnLigne =
  "inline-block border border-vert px-7 py-3 text-xs font-medium uppercase tracking-[0.18em] text-vert transition hover:bg-vert hover:text-white";

type Mode = "guide" | "solo";

function Detail({ theme }: { theme: HeritageTheme }) {
  const [mode, setMode] = useState<Mode>("guide");
  const others = themes.filter((t) => t.slug !== theme.slug);

  const option = (value: Mode, title: string, text: string) => (
    <button
      type="button"
      role="tab"
      id={`tab-${value}`}
      aria-selected={mode === value}
      aria-controls="panel-mode"
      onClick={() => setMode(value)}
      className={`flex-1 border p-6 text-left transition ${
        mode === value ? "border-vert bg-vert text-white shadow-lg" : "border-gray-300 bg-white text-gray-800 hover:border-vert"
      }`}
    >
      <span className="block font-titre text-2xl">{title}</span>
      <span className={`mt-2 block text-sm ${mode === value ? "text-white/80" : "text-gray-600"}`}>{text}</span>
    </button>
  );

  return (
    <main>
      <section className="relative">
        <HeritageImage slug={theme.slug} alt={theme.title} gradient={theme.gradient} className="h-72 w-full sm:h-96" />
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-0 flex flex-col justify-end px-4 pb-10">
          <div className="mx-auto w-full max-w-4xl text-white">
            <Link to="/a-propos" className="text-xs uppercase tracking-[0.18em] text-white/80 hover:text-white">
              ← Tous les thèmes
            </Link>
            <h1 className="mt-3 font-titre text-4xl sm:text-6xl">{theme.title}</h1>
            <p className="mt-2 text-lg text-white/90">{theme.tagline}</p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 py-16">
        <div className="space-y-5 text-lg leading-relaxed text-gray-700">
          {theme.intro.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>

        <aside className="my-12 border-l-4 border-or bg-white p-6 shadow-sm">
          <p className={`${eyebrow} mb-2`}>Pourquoi le découvrir</p>
          <p className="font-titre text-2xl leading-snug text-vert">{theme.why}</p>
        </aside>

        <h2 className="mb-6 font-titre text-3xl text-vert">À ne pas manquer</h2>
        <ul className="grid gap-4 sm:grid-cols-2">
          {theme.highlights.map((h) => (
            <li key={h.title} className="border border-gray-200 bg-white p-5">
              <h3 className="font-titre text-xl text-vert">{h.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{h.text}</p>
            </li>
          ))}
        </ul>

        <section className="mt-20" aria-labelledby="mode-title">
          <p className={`${eyebrow} mb-3 text-center`}>Votre façon de voyager</p>
          <h2 id="mode-title" className="mb-8 text-center font-titre text-3xl text-vert sm:text-4xl">
            Comment souhaitez-vous le découvrir ?
          </h2>

          <div role="tablist" aria-label="Façon de découvrir" className="flex flex-col gap-4 sm:flex-row">
            {option("guide", "Avec un guide", "Accompagné par un connaisseur, sans rien à organiser")}
            {option("solo", "En toute liberté", "À votre rythme, avec un itinéraire et des conseils")}
          </div>

          <div
            id="panel-mode"
            role="tabpanel"
            aria-labelledby={`tab-${mode}`}
            className="mt-6 border border-gray-200 bg-white p-8"
          >
            {mode === "guide" ? (
              <>
                <h3 className="font-titre text-2xl text-vert">Visite guidée</h3>
                <p className="mt-3 text-gray-700">{theme.guided.summary}</p>
                <p className="mt-4 text-sm">
                  <span className={eyebrow}>Durée</span>
                  <span className="ml-3 text-gray-700">{theme.guided.duration}</span>
                </p>
                <p className={`${eyebrow} mb-2 mt-6`}>Ce que comprend la visite</p>
                <ul className="list-disc space-y-1 pl-5 text-gray-700">
                  {theme.guided.includes.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
                <p className="mt-6 text-sm text-gray-500">
                  Sur demande auprès de la réception, selon les disponibilités. Indiquez vos dates, le nombre
                  de personnes et la langue souhaitée.
                </p>
                <div className="mt-6">
                  <Link to={`/contact?type=guide&theme=${theme.slug}`} className={btnOr}>
                    Demander une visite guidée
                  </Link>
                </div>
              </>
            ) : (
              <>
                <h3 className="font-titre text-2xl text-vert">Découverte en liberté</h3>
                <p className="mt-3 text-gray-700">{theme.solo.summary}</p>
                <p className="mt-4 text-sm">
                  <span className={eyebrow}>Durée</span>
                  <span className="ml-3 text-gray-700">{theme.solo.duration}</span>
                </p>
                <p className={`${eyebrow} mb-2 mt-6`}>{theme.solo.routeTitle}</p>
                <ol className="list-decimal space-y-1 pl-5 text-gray-700">
                  {theme.solo.route.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ol>
                <p className={`${eyebrow} mb-2 mt-6`}>Conseils pratiques</p>
                <ul className="list-disc space-y-1 pl-5 text-gray-700">
                  {theme.solo.tips.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
                <div className="mt-6 flex flex-wrap gap-4">
                  <Link to="/chambres" className={btnOr}>
                    Réserver une chambre
                  </Link>
                  <Link to={`/contact?type=conseil&theme=${theme.slug}`} className={btnLigne}>
                    Demander des conseils
                  </Link>
                </div>
              </>
            )}
          </div>
        </section>

        <section className="mt-20">
          <h2 className="mb-6 font-titre text-2xl text-vert">Continuer la découverte</h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {others.map((t) => (
              <li key={t.slug}>
                <Link
                  to={`/a-propos/${t.slug}`}
                  className="block border border-gray-200 bg-white p-4 transition hover:border-vert"
                >
                  <span className="font-titre text-lg text-vert">{t.title}</span>
                  <span className="mt-1 block text-sm text-gray-600">{t.tagline}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}

export default function HeritageDetail() {
  const { slug } = useParams();
  const theme = getTheme(slug);
  if (!theme) return <NotFound />;
  // key : repart de zéro (choix « guide » par défaut) quand on change de thème
  return <Detail key={theme.slug} theme={theme} />;
}
