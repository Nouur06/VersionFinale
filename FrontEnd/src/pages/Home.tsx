import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRooms } from "../hooks/useRooms";
import { useAsyncData } from "../hooks/useAsyncData";
import { assetUrl, galleryApi } from "../services/api";
import RoomCard from "../components/RoomCard";
import HeritageImage from "../components/HeritageImage";
import { hotel } from "../content/hotel";
import { getTheme } from "../content/heritage";
import { categoryLabel } from "../lib/galleryCategories";

const BOOKING_PATH = "/booking";

const eyebrow = "text-xs font-medium uppercase tracking-[0.18em] text-or-fonce";
const btnOr =
  "inline-block border border-or bg-or px-7 py-3 text-xs font-medium uppercase tracking-[0.18em] text-white transition hover:bg-transparent hover:text-or";
const btnLigne =
  "inline-block border border-white px-7 py-3 text-xs font-medium uppercase tracking-[0.18em] text-white transition hover:bg-white hover:text-vert";
const btnVert =
  "inline-block border border-vert px-7 py-3 text-xs uppercase tracking-[0.18em] text-vert transition hover:bg-vert hover:text-white";

// Thèmes mis en avant sur l'accueil
const teaserSlugs = ["casbah", "gastronomie", "musique", "histoire"];

export default function Home() {
  const navigate = useNavigate();
  const { rooms, loading, error } = useRooms();
  const { data: gallery } = useAsyncData(galleryApi.list);
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const [d, setD] = useState({ checkIn: "", checkOut: "", guests: "2" });
  const go = (e: FormEvent) => {
    e.preventDefault();
    navigate(`/chambres?${new URLSearchParams(d)}`);
  };
  const field =
    "mt-1 w-full border-b border-or/50 bg-transparent py-2 text-sm normal-case tracking-normal text-gray-800 outline-none focus:border-vert";

  const photos = gallery ?? [];
  const featured = photos.find((p) => p.category === "hotel") ?? photos[0];
  const teasers = teaserSlugs.map((s) => getTheme(s)).filter((t) => t !== undefined);

  return (
    <main>
      <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden bg-linear-to-b from-vert to-or/70 px-4 text-center text-white">
        <div className="motif-zellige absolute inset-0" />
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-3xl">
          <p className="mb-5 text-xs uppercase tracking-[0.18em] text-white/80">
            Alger la Blanche
          </p>
          <h1 className="font-titre text-5xl leading-tight sm:text-7xl">
            Un séjour à l'image de la Bahdja
          </h1>
          <p lang="ar" dir="rtl" className="mt-3 text-xl text-or">
            دار البهجة
          </p>
          <p className="mx-auto mt-6 max-w-xl text-lg text-white/90">
            Un hôtel inspiré des maisons de la Casbah, pour séjourner, goûter,
            écouter et découvrir l’Algérie.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to={BOOKING_PATH} className={btnOr}>
              Réserver
            </Link>
            <Link to="/chambres" className={btnLigne}>
              Nos chambres
            </Link>
          </div>
        </div>
      </section>

      <form
        onSubmit={go}
        className="relative z-10 mx-auto -mt-12 grid max-w-4xl gap-6 bg-white p-6 shadow-xl sm:grid-cols-4 sm:items-end"
      >
        <label className={eyebrow}>
          Arrivée
          <input
            type="date"
            min={today}
            required
            className={field}
            value={d.checkIn}
            onChange={(e) =>
              setD((current) => ({
                ...current,
                checkIn: e.target.value,
                checkOut:
                  current.checkOut && current.checkOut <= e.target.value
                    ? ""
                    : current.checkOut,
              }))
            }
          />
        </label>
        <label className={eyebrow}>
          Départ
          <input
            type="date"
            min={d.checkIn || today}
            required
            className={field}
            value={d.checkOut}
            onChange={(e) => setD({ ...d, checkOut: e.target.value })}
          />
        </label>
        <label className={eyebrow}>
          Personnes
          <select
            className={field}
            value={d.guests}
            onChange={(e) => setD({ ...d, guests: e.target.value })}
          >
            {[1, 2, 3, 4].map((n) => (
              <option key={n}>{n}</option>
            ))}
          </select>
        </label>
        <button className={btnOr}>Vérifier</button>
      </form>

      {/* Présentation de l'hôtel */}
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-24 md:grid-cols-2">
        <div>
          <p className={`${eyebrow} mb-4`}>Bienvenue</p>
          <h2 className="mb-6 font-titre text-4xl text-vert sm:text-5xl">
            L’hospitalité algérienne, au cœur du patrimoine
          </h2>
          <div className="mb-8 space-y-4 leading-relaxed text-gray-600">
            {hotel.story.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <Link to="/a-propos" className={btnVert}>
            Découvrir le patrimoine
          </Link>
        </div>
        {featured ? (
          <img
            src={assetUrl(featured.url)}
            alt={featured.caption || categoryLabel(featured.category)}
            className="h-96 w-full object-cover shadow-xl"
          />
        ) : (
          <div
            role="img"
            aria-label="Dar El Bahdja"
            className="relative flex h-96 items-center justify-center overflow-hidden bg-linear-to-br from-or/60 to-vert shadow-xl"
          >
            <div className="motif-zellige absolute inset-0" />
            <p lang="ar" dir="rtl" className="relative text-6xl text-white/90">
              دار البهجة
            </p>
          </div>
        )}
      </section>

      <section className="bg-stone-50 py-16">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 sm:grid-cols-3">
          {hotel.pillars.map((v) => (
            <div key={v.title} className="border-t-2 border-or bg-white p-8 text-center shadow-sm">
              <h3 className="mb-2 font-titre text-2xl text-vert">{v.title}</h3>
              <p className="text-sm text-gray-600">{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white py-24">
        <div className="mx-auto max-w-6xl px-4">
          <p className={`${eyebrow} mb-4 text-center`}>Chambres et suites</p>
          <h2 className="mb-12 text-center font-titre text-4xl text-vert sm:text-5xl">
            Nos hébergements
          </h2>
          {loading && <p className="text-center text-gray-600">Chargement…</p>}
          {error && (
            <p role="alert" className="text-center text-red-600">
              {error}
            </p>
          )}
          <div className="grid gap-8 md:grid-cols-3">
            {rooms.slice(0, 3).map((r) => (
              <RoomCard key={r.id} room={r} />
            ))}
          </div>
          <p className="mt-10 text-center">
            <Link to="/chambres" className={btnVert}>
              Voir toutes les chambres
            </Link>
          </p>
        </div>
      </section>

      <section className="mx-auto mt-24 grid max-w-6xl gap-px bg-or/30 sm:grid-cols-2 lg:grid-cols-4">
        {hotel.services.map((s) => {
          const inner = (
            <>
              <h3 className="mb-1 font-titre text-2xl text-vert">{s.title}</h3>
              <p className="text-sm text-gray-600">{s.text}</p>
            </>
          );
          return s.to ? (
            <Link key={s.title} to={s.to} className="bg-stone-50 p-8 text-center transition hover:bg-white">
              {inner}
            </Link>
          ) : (
            <div key={s.title} className="bg-stone-50 p-8 text-center">
              {inner}
            </div>
          );
        })}
      </section>

      {/* Découvrir l'Algérie */}
      <section className="mx-auto max-w-6xl px-4 py-24">
        <p className={`${eyebrow} mb-4 text-center`}>Patrimoine et culture</p>
        <h2 className="mb-4 text-center font-titre text-4xl text-vert sm:text-5xl">
          Partez à la découverte de l’Algérie
        </h2>
        <p className="mx-auto mb-12 max-w-2xl text-center text-gray-600">
          Casbah d’Alger, histoire, cuisine, raï et chaâbi… Pour chaque thème, choisissez de le vivre
          accompagné d’un guide, ou en toute liberté.
        </p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {teasers.map((t) => (
            <Link
              key={t.slug}
              to={`/a-propos/${t.slug}`}
              className="group overflow-hidden bg-white shadow-md transition hover:-translate-y-1 hover:shadow-xl"
            >
              <HeritageImage
                slug={t.slug}
                alt={t.title}
                gradient={t.gradient}
                className="h-40 w-full transition duration-700 group-hover:scale-105"
              />
              <div className="p-5">
                <h3 className="font-titre text-xl text-vert">{t.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{t.tagline}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 grid gap-px bg-or/30 md:grid-cols-2">
          <div className="bg-vert p-8 text-white">
            <h3 className="mb-2 font-titre text-2xl text-or">Avec un guide</h3>
            <p className="text-white/90">
              Un connaisseur vous accompagne, vous raconte les lieux et organise tout pour vous.
            </p>
          </div>
          <div className="bg-white p-8">
            <h3 className="mb-2 font-titre text-2xl text-vert">En toute liberté</h3>
            <p className="text-gray-600">
              Un itinéraire et des conseils pratiques pour avancer à votre rythme.
            </p>
          </div>
        </div>
        <p className="mt-10 text-center">
          <Link to="/a-propos" className={btnVert}>
            Explorer tous les thèmes
          </Link>
        </p>
      </section>

      {photos.length > 0 && (
        <section className="bg-white py-24">
          <div className="mx-auto max-w-6xl px-4">
            <p className={`${eyebrow} mb-4 text-center`}>Galerie</p>
            <h2 className="mb-12 text-center font-titre text-4xl text-vert sm:text-5xl">
              Un avant-goût de votre séjour
            </h2>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {photos.slice(0, 6).map((p) => (
                <Link key={p.id} to="/galerie" className="group block overflow-hidden">
                  <img
                    src={assetUrl(p.url)}
                    alt={p.caption || categoryLabel(p.category)}
                    loading="lazy"
                    className="h-48 w-full object-cover transition duration-700 group-hover:scale-105 sm:h-60"
                  />
                </Link>
              ))}
            </div>
            <p className="mt-10 text-center">
              <Link to="/galerie" className={btnVert}>
                Voir toute la galerie
              </Link>
            </p>
          </div>
        </section>
      )}

      <section className="relative mt-24 overflow-hidden bg-vert px-4 py-20 text-center text-white">
        <div className="motif-zellige absolute inset-0" />
        <div className="relative mx-auto max-w-2xl">
          <h2 className="font-titre text-4xl sm:text-5xl">Réservez votre séjour</h2>
          <p className="mt-4 text-white/90">
            Quelques clics pour demander votre chambre. Notre équipe vous répond pour confirmer.
          </p>
          <div className="mt-8">
            <Link to={BOOKING_PATH} className={btnOr}>
              Réserver
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
