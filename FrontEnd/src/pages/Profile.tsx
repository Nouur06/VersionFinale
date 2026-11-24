import { useState } from "react";
import type { FormEvent } from "react";
import { useAuth } from "../context/useAuth";
import { apiError, authApi } from "../services/api";

const field = "w-full rounded-lg border border-gray-300 bg-white p-3";

function InfoForm() {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [sending, setSending] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (name.trim().length < 2)
      return setMsg({ ok: false, text: "Veuillez saisir votre nom." });
    setSending(true);
    setMsg(null);
    try {
      updateUser(
        await authApi.updateMe({ name: name.trim(), phone: phone.trim() }),
      );
      setMsg({ ok: true, text: "Profil mis à jour." });
    } catch (err) {
      setMsg({ ok: false, text: apiError(err) });
    } finally {
      setSending(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 rounded-xl border border-gray-200 bg-white p-6"
      noValidate
    >
      <h2 className="font-titre text-2xl text-vert">Mes informations</h2>
      <input
        className={`${field} bg-gray-100 text-gray-500`}
        value={user?.email ?? ""}
        disabled
        aria-label="E-mail"
      />
      <input
        className={field}
        placeholder="Nom complet"
        autoComplete="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        className={field}
        type="tel"
        placeholder="Téléphone"
        autoComplete="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      {msg && (
        <p
          role={msg.ok ? "status" : "alert"}
          className={msg.ok ? "text-green-700" : "text-red-600"}
        >
          {msg.text}
        </p>
      )}
      <button
        disabled={sending}
        className="rounded-lg bg-vert px-5 py-2 font-semibold text-white disabled:opacity-60"
      >
        {sending ? "Enregistrement…" : "Enregistrer"}
      </button>
    </form>
  );
}

function PasswordForm() {
  const [f, setF] = useState({ current: "", next: "", confirm: "" });
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [sending, setSending] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!f.current)
      return setMsg({
        ok: false,
        text: "Saisissez votre mot de passe actuel.",
      });
    if (f.next.length < 8)
      return setMsg({
        ok: false,
        text: "Le nouveau mot de passe doit contenir au moins 8 caractères.",
      });
    if (f.next !== f.confirm)
      return setMsg({
        ok: false,
        text: "Les mots de passe ne correspondent pas.",
      });
    setSending(true);
    setMsg(null);
    try {
      await authApi.changePassword(f.current, f.next);
      setF({ current: "", next: "", confirm: "" });
      setMsg({ ok: true, text: "Mot de passe modifié." });
    } catch (err) {
      setMsg({ ok: false, text: apiError(err) });
    } finally {
      setSending(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 rounded-xl border border-gray-200 bg-white p-6"
      noValidate
    >
      <h2 className="font-titre text-2xl text-vert">Changer le mot de passe</h2>
      <input
        className={field}
        type="password"
        placeholder="Mot de passe actuel"
        autoComplete="current-password"
        value={f.current}
        onChange={(e) => setF({ ...f, current: e.target.value })}
      />
      <input
        className={field}
        type="password"
        placeholder="Nouveau mot de passe (8 caractères min.)"
        autoComplete="new-password"
        value={f.next}
        onChange={(e) => setF({ ...f, next: e.target.value })}
      />
      <input
        className={field}
        type="password"
        placeholder="Confirmer le nouveau mot de passe"
        autoComplete="new-password"
        value={f.confirm}
        onChange={(e) => setF({ ...f, confirm: e.target.value })}
      />
      {msg && (
        <p
          role={msg.ok ? "status" : "alert"}
          className={msg.ok ? "text-green-700" : "text-red-600"}
        >
          {msg.text}
        </p>
      )}
      <button
        disabled={sending}
        className="rounded-lg bg-vert px-5 py-2 font-semibold text-white disabled:opacity-60"
      >
        {sending ? "Modification…" : "Modifier le mot de passe"}
      </button>
    </form>
  );
}

export default function Profile() {
  return (
    <div className="mx-auto max-w-xl space-y-8 px-4 py-12">
      <h1 className="font-titre text-4xl text-vert">Mon profil</h1>
      <InfoForm />
      <PasswordForm />
    </div>
  );
}
