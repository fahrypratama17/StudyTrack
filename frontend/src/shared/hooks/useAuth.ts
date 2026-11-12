import { useContext } from "react";
import { AuthContext } from "../../features/auth/context/AuthContext";
import type { AuthContextType } from "../../features/auth/types/type";

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth harus digunakan di dalam AuthProvider");
  }

  return context;
}
