
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import api, { TOKEN_KEY} from "../../../service/api";
import {AuthContextType, AuthProviderProps, User} from "../types/types";

const AuthContext = createContext<AuthContextType | null>(null);

/**
 * Menyediakan status login ke seluruh aplikasi.
 *
 * Saat pertama dimuat, token yang tersimpan (jika ada)
 * diverifikasi ke /auth/me.
 * Selama proses itu loading bernilai true.
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get<{ user: User }>("/auth/me")
      .then((res) => setUser(res.data.user))
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
      })
      .finally(() => setLoading(false));
  }, []);

  /** Menyimpan token dan data pengguna setelah login atau registrasi berhasil. */
  function login(token: string, userData: User): void {
    localStorage.setItem(TOKEN_KEY, token);
    setUser(userData);
  }

  function logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth harus digunakan di dalam AuthProvider");
  }

  return context;
}
