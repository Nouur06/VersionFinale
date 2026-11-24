export interface Room {
  id: string; // ObjectId MongoDB (texte de 24 caractères)
  name: string;
  type: string; // "double", "twin", "suite"...
  description: string;
  capacity: number;
  price: number;
  pricePerNight: number;
  photos: string[];
  image: string;
  available: boolean;
}

export type Role = "client" | "admin" | "super_admin";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: Role;
}

export type BookingStatus =
  | "en_attente"
  | "confirmee"
  | "refusee"
  | "annulee"
  | "terminee";

export interface Booking {
  _id: string;
  room: { id: string; name: string } | null; // null si la chambre a été supprimée
  checkIn: string;
  checkOut: string;
  guests: number;
  total: number;
  notes: string;
  status: BookingStatus;
  createdAt: string;
}

export interface RoomSearch {
  checkIn?: string;
  checkOut?: string;
  guests?: string;
}

/* ----- Administration ----- */

// Réservation vue par un admin : le client est inclus
export interface AdminBooking extends Omit<Booking, "room"> {
  room: { id: string; name: string } | null;
  client: { _id: string; name: string; email: string } | null;
}

// Utilisateur vu par un admin (liste GET /api/users)
export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  active: boolean;
  createdAt: string;
}

export interface Stats {
  bookings: Partial<Record<BookingStatus, number>>;
  clients: number;
  admins: number;
  superAdmins: number;
}

export interface RoomInput {
  name: string;
  type: string;
  description: string;
  capacity: number;
  price: number;
  available: boolean;
}

/* ----- Galerie ----- */
export type GalleryCategory =
  | "hotel"
  | "chambres"
  | "alger"
  | "gastronomie"
  | "culture"
  | "sites";

export interface GalleryPhoto {
  id: string;
  url: string;
  caption: string;
  category: GalleryCategory;
  createdAt: string;
}
