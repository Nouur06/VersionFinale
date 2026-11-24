import { useState } from "react";
import type { FormEvent } from "react";
import { useAuth } from "../../context/useAuth";
import { useAsyncData } from "../../hooks/useAsyncData";
import { adminApi, apiError } from "../../services/api";
import type { AdminUser, Role } from "../../types";

const ROLE_LABEL: Record<Role, string> = {
  client: "Client",
  admin: "Admin",
  super_admin: "Super admin",
};
const field = "w-full rounded-lg border border-gray-300 bg-white p-3";

function NewAdminForm({ onCreated }: { onCreated: (name: string) => void }) {
  const [f, setF] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (f.name.trim().length < 2) return setError("Le nom est requis.");
    if (!/^\S+@\S+\.\S+$/.test(f.email))
      return setError("Adresse e-mail invalide.");
    if (f.password.length < 8)
      return setError("Mot de passe : 8 caractères minimum.");
    setError("");
    setSending(true);
    try {
      await adminApi.createAdmin({
        name: f.name.trim(),
        email: f.email.trim(),
        password: f.password,
      });
      setF({ name: "", email: "", password: "" });
      onCreated(f.name.trim());
    } catch (err) {
      setError(apiError(err));
    } finally {
      setSending(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mb-8 space-y-3 rounded-xl border border-or/40 bg-white p-6"
      noValidate
    >
      <h2 className="font-titre text-2xl text-vert">Créer un administrateur</h2>
      <div className="grid gap-3 sm:grid-cols-3">
        <input
          className={field}
          placeholder="Nom"
          value={f.name}
          onChange={(e) => setF({ ...f, name: e.target.value })}
        />
        <input
          className={field}
          type="email"
          placeholder="E-mail"
          value={f.email}
          onChange={(e) => setF({ ...f, email: e.target.value })}
        />
        <input
          className={field}
          type="password"
          placeholder="Mot de passe (8 min.)"
          autoComplete="new-password"
          value={f.password}
          onChange={(e) => setF({ ...f, password: e.target.value })}
        />
      </div>
      {error && (
        <p role="alert" className="text-red-600">
          {error}
        </p>
      )}
      <button
        disabled={sending}
        className="rounded-lg bg-vert px-5 py-2 text-sm font-semibold text-white disabled:opacity-60"
      >
        {sending ? "Création…" : "Créer l’administrateur"}
      </button>
    </form>
  );
}

export default function AdminUsers() {
  const { user: me } = useAuth();
  const isSuper = me?.role === "super_admin";
  const { data: users, loading, error, reload } = useAsyncData(adminApi.users);
  const [busyId, setBusyId] = useState("");
  const [notice, setNotice] = useState("");

  async function run(id: string, action: () => Promise<unknown>) {
    setBusyId(id);
    setNotice("");
    try {
      await action();
      await reload();
    } catch (e) {
      setNotice(apiError(e));
    } finally {
      setBusyId("");
    }
  }

  function toggleActive(u: AdminUser) {
    const verb = u.active ? "désactiver" : "réactiver";
    if (!window.confirm(`Voulez-vous ${verb} le compte de ${u.name} ?`)) return;
    return run(u._id, () => adminApi.setUserActive(u._id, !u.active));
  }

  function changeRole(u: AdminUser, role: Role) {
    if (role === u.role) return;
    if (!window.confirm(`Passer ${u.name} en « ${ROLE_LABEL[role]} » ?`))
      return;
    return run(u._id, () => adminApi.setUserRole(u._id, role));
  }

  return (
    <div>
      {isSuper && (
        <NewAdminForm
          onCreated={(name) => {
            setNotice(`Administrateur « ${name} » créé.`);
            reload();
          }}
        />
      )}

      {notice && (
        <p className="mb-4 rounded-lg bg-amber-50 p-3 text-amber-900">
          {notice}
        </p>
      )}
      {loading && <p className="text-gray-600">Chargement…</p>}
      {error && (
        <p role="alert" className="text-red-600">
          {error}
        </p>
      )}

      {users && (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-600">
              <tr>
                <th className="p-3">Nom</th>
                <th className="p-3">E-mail</th>
                <th className="p-3">Rôle</th>
                <th className="p-3">Statut</th>
                <th className="p-3" />
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const self = u._id === me?.id;
                const canToggle = !self && (u.role === "client" || isSuper);
                return (
                  <tr key={u._id} className="border-t border-gray-100">
                    <td className="p-3 font-medium text-gray-900">
                      {u.name}
                      {self && (
                        <span className="ml-2 text-xs text-gray-500">
                          (vous)
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-gray-700">{u.email}</td>
                    <td className="p-3">
                      {isSuper && !self ? (
                        <select
                          aria-label={`Rôle de ${u.name}`}
                          value={u.role}
                          disabled={busyId === u._id}
                          onChange={(e) =>
                            changeRole(u, e.target.value as Role)
                          }
                          className="rounded-lg border border-gray-300 bg-white p-1"
                        >
                          {(Object.keys(ROLE_LABEL) as Role[]).map((r) => (
                            <option key={r} value={r}>
                              {ROLE_LABEL[r]}
                            </option>
                          ))}
                        </select>
                      ) : (
                        ROLE_LABEL[u.role]
                      )}
                    </td>
                    <td className="p-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs ${u.active ? "bg-green-100 text-green-800" : "bg-gray-200 text-gray-700"}`}
                      >
                        {u.active ? "Actif" : "Désactivé"}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {canToggle && (
                        <button
                          disabled={busyId === u._id}
                          onClick={() => toggleActive(u)}
                          className="rounded-lg border border-gray-300 px-3 py-1 text-xs text-gray-700 hover:border-vert disabled:opacity-60"
                        >
                          {u.active ? "Désactiver" : "Réactiver"}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
