import { Link } from "react-router-dom";
import HeritageImage from "../components/HeritageImage";
import { themes, timeline, unescoSites } from "../content/heritage";
import { hotel } from "../content/hotel";

const eyebrow = "text-xs font-medium uppercase tracking-[0.18em] text-or-fonce";

export default function About() {
  return (
    <main>
      <section className="relative overflow-hidden bg-linear-to-br from-vert to-teal-800 px-4 py-24 text-center text-white">
        <div className="motif-zellige absolute inset-0" />
        <div className="relative mx-auto max-w-3xl">
          <p className="mb-4 text-xs uppercase tracking-[0.18em] text-white/80">
            Patrimoine et culture
          </p>
          <h1 className="font-titre text-4xl leading-tight sm:text-6xl">
            Découvrir l’Algérie
          </h1>
          <p className="mt-6 text-lg text-white/90">
            Histoire, Casbah, saveurs, musiques, artisanat et grands espaces.
            Choisissez ce qui vous attire : pour chaque thème, vous découvrirez
            de quoi il s’agit, pourquoi y aller, puis vous choisirez de le vivre
            avec un guide ou en toute liberté.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20">
        <p className={`${eyebrow} mb-3 text-center`}>
          Que souhaitez-vous découvrir ?
        </p>
        <h2 className="mb-12 text-center font-titre text-3xl text-vert sm:text-4xl">
          Sept façons de voyager
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {themes.map((t) => (
            <Link
              key={t.slug}
              to={`/a-propos/${t.slug}`}
              className="group overflow-hidden bg-white shadow-md transition hover:-translate-y-1 hover:shadow-xl"
            >
              <HeritageImage
                slug={t.slug}
                alt={t.title}
                gradient={t.gradient}
                className="h-44 w-full transition duration-700 group-hover:scale-105"
              />
              <div className="p-6">
                <h3 className="font-titre text-2xl text-vert">{t.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{t.tagline}</p>
                <p className="mt-4 text-xs uppercase tracking-[0.18em] text-or-fonce">
                  Avec un guide · En liberté →
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-3xl px-4">
          <p className={`${eyebrow} mb-3 text-center`}>Repères</p>
          <h2 className="mb-10 text-center font-titre text-3xl text-vert sm:text-4xl">
            L’Algérie à travers les siècles
          </h2>
          <ol className="relative space-y-6 border-l border-or/60 pl-8">
            {timeline.map((e) => (
              <li key={e.when} className="relative">
                <span className="absolute left-[-2.45rem] top-1.5 h-3 w-3 rounded-full border-2 border-or bg-white" />
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-or-fonce">
                  {e.when}
                </p>
                <p className="mt-1 text-gray-700">{e.what}</p>
              </li>
            ))}
          </ol>
          <p className="mt-8 text-center">
            <Link to="/a-propos/histoire" className="text-vert underline">
              Explorer l’histoire en détail
            </Link>
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20">
        <p className={`${eyebrow} mb-3 text-center`}>Patrimoine mondial</p>
        <h2 className="mb-10 text-center font-titre text-3xl text-vert sm:text-4xl">
          Sept sites classés à l’UNESCO
        </h2>
        <ul className="grid gap-px bg-or/30 sm:grid-cols-2 lg:grid-cols-4">
          {unescoSites.map((s) => (
            <li key={s.name} className="bg-stone-50 p-6 text-center">
              <p className="font-titre text-xl text-vert">{s.name}</p>
              <p className="mt-1 text-sm text-gray-600">Classé en {s.year}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-vert px-4 py-20 text-white">
        <div className="mx-auto max-w-3xl">
          <p className="mb-3 text-center text-xs uppercase tracking-[0.18em] text-or">
            L’hôtel
          </p>
          <h2 className="mb-8 text-center font-titre text-3xl sm:text-4xl">
            À propos de Dar El Bahdja
          </h2>
          <div className="space-y-4 text-white/90">
            {hotel.story.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {hotel.pillars.map((v) => (
              <div
                key={v.title}
                className="border border-white/20 p-5 text-center"
              >
                <h3 className="mb-2 font-titre text-xl text-or">{v.title}</h3>
                <p className="text-sm text-white/80">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
