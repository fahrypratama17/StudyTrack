import { ReactNode } from "react";

export interface User {
  id: number;
  nama: string;
  email: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
}

export interface AuthProviderProps {
  children: ReactNode;
}
