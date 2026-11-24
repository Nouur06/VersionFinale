import { createContext } from "react";
import type { User } from "../types";

export interface AuthContextValue {
  user: User | null;
  loading: boolean; // true pendant la vérification du token au chargement de la page
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    name: string;
    email: string;
    phone?: string;
    password: string;
  }) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void; // après modification du profil
}

export const AuthContext = createContext<AuthContextValue | null>(null);
