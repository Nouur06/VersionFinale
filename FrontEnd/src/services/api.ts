import axios, { isAxiosError } from "axios";
import type {
  AdminBooking,
  AdminUser,
  Booking,
  BookingStatus,
  GalleryCategory,
  GalleryPhoto,
  Role,
  Room,
  RoomInput,
  RoomSearch,
  Stats,
  User,
} from "../types";

// Vide en développement (proxy Vite) ; adresse du back-end en production
export const API_URL = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");

const TOKEN_KEY = "dar_token";
export const AUTH_EXPIRED_EVENT = "auth:expired";

export const getToken = (): string | null => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};
export const setToken = (token: string): void => {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    /* stockage indisponible */
  }
};
export const clearToken = (): void => {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* stockage indisponible */
  }
};

const api = axios.create({ baseURL: `${API_URL}/api` });

// Ajoute automatiquement le token à chaque requête
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Token expiré ou compte désactivé : on déconnecte proprement
api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (
      isAxiosError(error) &&
      error.response?.status === 401 &&
      getToken() &&
      !error.config?.url?.startsWith("/auth/login") &&
      !error.config?.url?.startsWith("/auth/register") &&
      // mauvais mot de passe actuel : le serveur répond 401 mais la session reste valide
      !error.config?.url?.startsWith("/auth/me/password")
    ) {
      clearToken();
      window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT));
    }
    return Promise.reject(error);
  },
);

/** Message d'erreur lisible, en français, à partir d'une erreur axios. */
export function apiError(error: unknown): string {
  if (isAxiosError(error)) {
    const msg = (error.response?.data as { error?: string } | undefined)?.error;
    if (msg) return msg;
    if (error.response?.status === 429)
      return "Trop de tentatives, réessayez dans quelques minutes.";
    if (!error.response)
      return "Impossible de joindre le serveur. Vérifiez qu'il est démarré.";
  }
  return "Une erreur est survenue.";
}

/** Les photos envoyées au serveur commencent par /uploads : on ajoute l'adresse du back-end. */
export const assetUrl = (path: string): string =>
  path.startsWith("/uploads") ? `${API_URL}${path}` : path;

interface AuthResponse {
  token: string;
  user: User;
}

export const authApi = {
  login: (email: string, password: string) =>
    api
      .post<AuthResponse>("/auth/login", { email, password })
      .then((r) => r.data),
  register: (data: {
    name: string;
    email: string;
    phone?: string;
    password: string;
  }) => api.post<AuthResponse>("/auth/register", data).then((r) => r.data),
  me: () => api.get<User>("/auth/me").then((r) => r.data),
  updateMe: (data: { name?: string; phone?: string }) =>
    api.patch<User>("/auth/me", data).then((r) => r.data),
  changePassword: (currentPassword: string, newPassword: string) =>
    api
      .patch<{
        ok: true;
      }>("/auth/me/password", { currentPassword, newPassword })
      .then((r) => r.data),
};

export const roomsApi = {
  list: (search: RoomSearch = {}) =>
    api
      .get<Room[]>("/rooms", {
        params: {
          checkIn: search.checkIn || undefined,
          checkOut: search.checkOut || undefined,
          guests: search.guests || undefined,
        },
      })
      .then((r) => r.data),
  get: (id: string) => api.get<Room>(`/rooms/${id}`).then((r) => r.data),
};

export interface NewBooking {
  room: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  notes?: string;
}

export const bookingsApi = {
  create: (data: NewBooking) =>
    api
      .post<{ _id: string; total: number; status: string }>("/bookings", data)
      .then((r) => r.data),
  mine: () => api.get<Booking[]>("/bookings/mine").then((r) => r.data),
  cancel: (id: string) =>
    api.patch<Booking>(`/bookings/${id}/cancel`).then((r) => r.data),
};

/* ----- Administration (réservé aux rôles admin et super_admin) ----- */
export const adminApi = {
  stats: () => api.get<Stats>("/admin/stats").then((r) => r.data),

  bookings: (status?: string) =>
    api
      .get<
        AdminBooking[]
      >("/bookings", { params: { status: status || undefined } })
      .then((r) => r.data),
  setBookingStatus: (id: string, status: BookingStatus) =>
    api
      .patch<{ status: BookingStatus }>(`/bookings/${id}/status`, { status })
      .then((r) => r.data),

  rooms: () => api.get<Room[]>("/rooms/all").then((r) => r.data),
  createRoom: (data: RoomInput) =>
    api.post<Room>("/rooms", data).then((r) => r.data),
  updateRoom: (id: string, data: Partial<RoomInput>) =>
    api.put<Room>(`/rooms/${id}`, data).then((r) => r.data),
  // 204 : supprimée ; 200 { archived: true } : conservée car elle a des réservations
  deleteRoom: (id: string) =>
    api
      .delete<{ archived?: boolean } | "">(`/rooms/${id}`)
      .then((r) => ({ archived: r.status === 200 })),
  uploadPhotos: (id: string, files: File[]) => {
    const form = new FormData();
    files.forEach((f) => form.append("photos", f));
    return api.post<Room>(`/rooms/${id}/photos`, form).then((r) => r.data);
  },
  removePhoto: (id: string, photo: string) =>
    api
      .delete<Room>(`/rooms/${id}/photos`, { data: { photo } })
      .then((r) => r.data),

  users: () => api.get<AdminUser[]>("/admin/users").then((r) => r.data),
  setUserActive: (id: string, active: boolean) =>
    api.patch<User>(`/admin/users/${id}/active`, { active }).then((r) => r.data),
  setUserRole: (id: string, role: Role) =>
    api.patch<User>(`/admin/users/${id}/role`, { role }).then((r) => r.data),
  createAdmin: (data: { name: string; email: string; password: string }) =>
    api.post<User>("/admin/admins", data).then((r) => r.data),
};

/* ----- Galerie (lecture publique ; envoi, modification et suppression réservés aux admins) ----- */
export const galleryApi = {
  list: () => api.get<GalleryPhoto[]>("/gallery").then((r) => r.data),
  upload: (files: File[], category: GalleryCategory, caption: string) => {
    const form = new FormData();
    form.append("category", category);
    if (caption.trim()) form.append("caption", caption.trim());
    files.forEach((f) => form.append("photos", f));
    return api.post<GalleryPhoto[]>("/gallery", form).then((r) => r.data);
  },
  update: (id: string, data: { category?: GalleryCategory; caption?: string }) =>
    api.patch<GalleryPhoto>(`/gallery/${id}`, data).then((r) => r.data),
  remove: (id: string) => api.delete(`/gallery/${id}`).then(() => undefined),
};

export default api;
