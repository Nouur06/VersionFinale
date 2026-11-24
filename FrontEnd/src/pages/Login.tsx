import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { apiError } from "../services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const from = (useLocation().state as { from?: string } | null)?.from ?? "/";

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email))
      return setError("Adresse e-mail invalide.");
    if (!password) return setError("Veuillez saisir votre mot de passe.");
    setError("");
    setSending(true);
    try {
      await login(email.trim(), password);
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
      <h1 className="mb-6 font-titre text-4xl text-vert">Connexion</h1>
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <input
          className={field}
          type="email"
          placeholder="E-mail"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className={field}
          type="password"
          placeholder="Mot de passe"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
          {sending ? "Connexion…" : "Se connecter"}
        </button>
      </form>
      <p className="mt-4 text-gray-600">
        Pas de compte ?{" "}
        <Link to="/register" state={{ from }} className="text-vert underline">
          Créer un compte
        </Link>
      </p>
    </div>
  );
}
