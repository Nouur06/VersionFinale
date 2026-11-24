import { useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { apiError } from "../services/api";

export default function Register() {
  const [f, setF] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
  });
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const from = (useLocation().state as { from?: string } | null)?.from ?? "/";
  const set = (k: keyof typeof f) => (e: ChangeEvent<HTMLInputElement>) =>
    setF({ ...f, [k]: e.target.value });

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (f.name.trim().length < 2) return setError("Veuillez saisir votre nom.");
    if (!/^\S+@\S+\.\S+$/.test(f.email))
      return setError("Adresse e-mail invalide.");
    if (f.password.length < 8)
      return setError("Le mot de passe doit contenir au moins 8 caractères.");
    if (f.password !== f.confirm)
      return setError("Les mots de passe ne correspondent pas.");
    setError("");
    setSending(true);
    try {
      await register({
        name: f.name.trim(),
        email: f.email.trim(),
        password: f.password,
        ...(f.phone.trim() ? { phone: f.phone.trim() } : {}),
      });
      navigate(from, { replace: true });
    } catch (err) {
      setError(apiError(err));
    } finally {
      setSending(false);
    }
  }

  const field = "w-full rounded-lg border border-gray-300 bg-white p-3";

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h1 className="mb-6 font-titre text-4xl text-vert">Créer un compte</h1>
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <input
          className={field}
          placeholder="Nom complet"
          autoComplete="name"
          value={f.name}
          onChange={set("name")}
        />
        <input
          className={field}
          type="email"
          placeholder="E-mail"
          autoComplete="email"
          value={f.email}
          onChange={set("email")}
        />
        <input
          className={field}
          type="tel"
          placeholder="Téléphone (facultatif)"
          autoComplete="tel"
          value={f.phone}
          onChange={set("phone")}
        />
        <input
          className={field}
          type="password"
          placeholder="Mot de passe (8 caractères min.)"
          autoComplete="new-password"
          value={f.password}
          onChange={set("password")}
        />
        <input
          className={field}
          type="password"
          placeholder="Confirmer le mot de passe"
          autoComplete="new-password"
          value={f.confirm}
          onChange={set("confirm")}
        />
        {error && (
          <p role="alert" className="text-red-600">
            {error}
          </p>
        )}
        <button
          disabled={sending}
          className="w-full rounded-lg bg-vert px-5 py-3 font-semibold text-white disabled:opacity-60"
        >
          {sending ? "Création…" : "S’inscrire"}
        </button>
      </form>
      <p className="mt-4 text-gray-600">
        Déjà un compte ?{" "}
        <Link to="/login" state={{ from }} className="text-vert underline">
          Se connecter
        </Link>
      </p>
    </div>
  );
}
